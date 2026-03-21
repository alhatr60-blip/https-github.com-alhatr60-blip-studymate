import json
import uuid
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import ChatSession, ChatMessage

# Configure logging to a file for diagnostics
logging.basicConfig(
    filename='studymate.log',
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def get_gemini_client(api_key):
    import google.generativeai as genai
    genai.configure(api_key=api_key)
    return genai.GenerativeModel(
        model_name='gemini-1.5-flash',
        system_instruction=(
            "You are AI StudyMate, a helpful and encouraging educational assistant. "
            "You help students understand complex topics, answer study questions, "
            "explain concepts clearly, and provide learning guidance. "
            "Be concise, clear, and use examples when helpful. "
            "Always encourage the student and make learning fun!"
        )
    )

@csrf_exempt
@require_http_methods(["POST"])
def ask_chatbot(request):
    try:
        # Log the raw request for debugging
        logger.info(f"POST /api/chatbot/ask/ - Body: {request.body}")

        if not request.body:
            return JsonResponse({'error': 'Empty request body'}, status=400)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError as e:
            logger.error(f"JSON Decode Error: {str(e)}")
            return JsonResponse({'error': f'Invalid JSON: {str(e)}'}, status=400)

        message = data.get('message', '').strip()
        session_id = data.get('session_id')
        api_key = data.get('api_key', '')

        # Ensure we have a valid session_id
        if not session_id:
            session_id = str(uuid.uuid4())
            logger.info(f"Generated new session_id: {session_id}")

        if not message:
            return JsonResponse({'error': 'Message is required'}, status=400)

        # Get or create session
        session, _ = ChatSession.objects.get_or_create(session_id=session_id)
        
        # Save user message
        ChatMessage.objects.create(session=session, role='user', content=message)

        if not api_key:
            reply = (
                "I'm your AI StudyMate assistant! To enable real AI responses, please go to the "
                "Settings page and enter your Google Gemini API key. Once configured, I can help you with "
                "any study questions, explain complex topics, and provide personalized learning support!"
            )
        else:
            # Build conversation history for Gemini
            history_qs = list(session.messages.values('role', 'content').order_by('timestamp'))
            # Exclude the very last message since we just saved it and we'll send it now
            gemini_history = []
            for h in history_qs[:-1]:
                role = 'model' if h['role'] == 'assistant' else 'user'
                gemini_history.append({
                    "role": role,
                    "parts": [h['content']]
                })

            try:
                model = get_gemini_client(api_key)
                chat = model.start_chat(history=gemini_history)
                response = chat.send_message(message)
                reply = response.text
            except Exception as e:
                logger.error(f"Gemini API Error: {str(e)}")
                reply = f"AI error: {str(e)}. Please check your API key in Settings."

        # Save assistant message
        ChatMessage.objects.create(session=session, role='assistant', content=reply)

        # Return history
        all_messages = list(session.messages.values('role', 'content').order_by('timestamp'))
        return JsonResponse({
            'reply': reply,
            'session_id': session_id,
            'messages': all_messages
        })

    except Exception as e:
        logger.exception("Force 500 in ask_chatbot")
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def get_history(request, session_id):
    try:
        session = ChatSession.objects.get(session_id=session_id)
        messages = list(session.messages.values('role', 'content').order_by('timestamp'))
        return JsonResponse({'messages': messages, 'session_id': session_id})
    except ChatSession.DoesNotExist:
        return JsonResponse({'messages': [], 'session_id': session_id})


@csrf_exempt
@require_http_methods(["DELETE"])
def clear_history(request, session_id):
    try:
        session = ChatSession.objects.get(session_id=session_id)
        session.messages.all().delete()
        return JsonResponse({'success': True})
    except ChatSession.DoesNotExist:
        return JsonResponse({'success': True})
