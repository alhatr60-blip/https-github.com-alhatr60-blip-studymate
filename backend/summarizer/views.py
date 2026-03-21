import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Note

def get_gemini_client(api_key):
    import google.generativeai as genai
    genai.configure(api_key=api_key)
    return genai.GenerativeModel('gemini-1.5-flash')

@csrf_exempt
@require_http_methods(["POST"])
def summarize_text(request):
    try:
        data = json.loads(request.body)
        text = data.get('text', '').strip()
        api_key = data.get('api_key', '')
        title = data.get('title', '')

        if not text:
            return JsonResponse({'error': 'Text is required'}, status=400)

        if not api_key:
            # Simple algorithmic summary (fallback)
            sentences = text.split('.')
            if len(sentences) > 3:
                summary = '. '.join(sentences[:3]) + "..."
            else:
                summary = text
            summary = "[DEMO MODE: No API Key provided] " + summary
        else:
            try:
                model = get_gemini_client(api_key)
                prompt = f"Summarize the following study notes in a concise and clear bulleted format. Focus on key concepts and definitions:\n\n{text}"
                response = model.generate_content(prompt)
                summary = response.text
            except Exception as e:
                summary = f"Summary error: {str(e)}"

        note = Note.objects.create(title=title, original_text=text, summary=summary)

        return JsonResponse({
            'id': note.id,
            'title': note.title,
            'summary': summary,
            'created_at': note.created_at.isoformat() if note.created_at else None
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def note_history(request):
    notes = list(Note.objects.values('id', 'title', 'summary').order_by('-created_at')[:20])
    return JsonResponse({'notes': notes})
