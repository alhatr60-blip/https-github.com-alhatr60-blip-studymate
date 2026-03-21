import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Quiz, Question

DEMO_QUIZ_FALLBACK = {
    "python": [
        {"question_text": "What is the correct way to define a function in Python?", "option_a": "function myFunc():", "option_b": "def myFunc():", "option_c": "create myFunc():", "option_d": "func myFunc():","correct_answer": "B","explanation": "In Python, functions are defined using the 'def' keyword followed by the function name and parentheses."},
        {"question_text": "Which data type is used to store True/False values in Python?", "option_a": "int", "option_b": "string", "option_c": "bool", "option_d": "float", "correct_answer": "C", "explanation": "Boolean (bool) data type stores True or False values in Python."},
        {"question_text": "What does 'len([1, 2, 3])' return?", "option_a": "2", "option_b": "3", "option_c": "4", "option_d": "Error", "correct_answer": "B", "explanation": "The len() function returns the number of items in a list. [1, 2, 3] has 3 items."},
        {"question_text": "Which symbol is used for single-line comments in Python?", "option_a": "//", "option_b": "/*", "option_c": "#", "option_d": "--", "correct_answer": "C", "explanation": "Python uses # for single-line comments."},
        {"question_text": "What is the output of print(2 ** 3)?", "option_a": "6", "option_b": "5", "option_c": "9", "option_d": "8", "correct_answer": "D", "explanation": "** is the exponentiation operator. 2 ** 3 = 2³ = 8."},
    ],
    "default": [
        {"question_text": "What does AI stand for?", "option_a": "Automatic Intelligence", "option_b": "Artificial Intelligence", "option_c": "Advanced Integration", "option_d": "Automated Interface", "correct_answer": "B", "explanation": "AI stands for Artificial Intelligence, the simulation of human intelligence in machines."},
        {"question_text": "Which planet is known as the Red Planet?", "option_a": "Venus", "option_b": "Jupiter", "option_c": "Mars", "option_d": "Saturn", "correct_answer": "C", "explanation": "Mars is known as the Red Planet due to iron oxide (rust) on its surface."},
        {"question_text": "What is H₂O commonly known as?", "option_a": "Salt", "option_b": "Water", "option_c": "Hydrogen", "option_d": "Oxygen", "correct_answer": "B", "explanation": "H₂O is the chemical formula for water (2 hydrogen atoms + 1 oxygen atom)."},
        {"question_text": "Who wrote the theory of relativity?", "option_a": "Newton", "option_b": "Darwin", "option_c": "Einstein", "option_d": "Hawking", "correct_answer": "C", "explanation": "Albert Einstein developed the theory of relativity (E=mc²)."},
        {"question_text": "What is the capital of France?", "option_a": "Berlin", "option_b": "Rome", "option_c": "Madrid", "option_d": "Paris", "correct_answer": "D", "explanation": "Paris is the capital city of France."},
    ]
}

@csrf_exempt
@require_http_methods(["POST"])
def generate_quiz(request):
    try:
        data = json.loads(request.body)
        topic = data.get('topic', '').strip()
        difficulty = data.get('difficulty', 'medium')
        num_questions = min(int(data.get('num_questions', 5)), 10)
        api_key = data.get('api_key', '')

        if not topic:
            return JsonResponse({'error': 'Topic is required'}, status=400)

        quiz = Quiz.objects.create(topic=topic, difficulty=difficulty)

        if not api_key:
            # Use demo fallback questions
            key = 'python' if 'python' in topic.lower() else 'default'
            questions_data = DEMO_QUIZ_FALLBACK[key][:num_questions]
        else:
            try:
                import google.generativeai as genai
                genai.configure(api_key=api_key)
                model = genai.GenerativeModel('gemini-1.5-flash')
                prompt = f"""Generate exactly {num_questions} multiple choice quiz questions about "{topic}" at {difficulty} difficulty level.
Return ONLY valid JSON in this exact format, with no markdown formatting or backticks:
{{
  "questions": [
    {{
      "question": "question text here",
      "options": {{"A": "option A", "B": "option B", "C": "option C", "D": "option D"}},
      "correct": "A",
      "explanation": "brief explanation"
    }}
  ]
}}"""
                response = model.generate_content(prompt)
                content = response.text.strip()
                # Parse JSON response
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0].strip()
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0].strip()
                
                parsed = json.loads(content)
                questions_data = []
                for q in parsed.get('questions', []):
                    opts = q.get('options', {})
                    questions_data.append({
                        "question_text": q.get('question', ''),
                        "option_a": opts.get('A', ''),
                        "option_b": opts.get('B', ''),
                        "option_c": opts.get('C', ''),
                        "option_d": opts.get('D', ''),
                        "correct_answer": q.get('correct', 'A').upper(),
                        "explanation": q.get('explanation', '')
                    })
            except Exception as e:
                key = 'python' if 'python' in topic.lower() else 'default'
                questions_data = DEMO_QUIZ_FALLBACK[key][:num_questions]

        # Save questions to DB
        saved_questions = []
        for q in questions_data:
            question = Question.objects.create(quiz=quiz, **q)
            saved_questions.append({
                'id': question.id,
                'question_text': question.question_text,
                'option_a': question.option_a,
                'option_b': question.option_b,
                'option_c': question.option_c,
                'option_d': question.option_d,
                'correct_answer': question.correct_answer,
                'explanation': question.explanation,
            })

        return JsonResponse({
            'quiz_id': quiz.id,
            'topic': quiz.topic,
            'difficulty': quiz.difficulty,
            'questions': saved_questions,
            'ai_generated': bool(api_key)
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def quiz_history(request):
    quizzes = list(Quiz.objects.values('id', 'topic', 'difficulty', 'created_at').order_by('-created_at')[:20])
    return JsonResponse({'quizzes': quizzes})
