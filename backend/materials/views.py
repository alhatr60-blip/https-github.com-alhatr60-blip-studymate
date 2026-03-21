import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Subject, Material

DEMO_SUBJECTS = [
    {
        "name": "Mathematics",
        "description": "Algebra, Calculus, Statistics, Geometry and more",
        "icon": "📐",
        "color": "#4F46E5",
        "materials": [
            {"title": "Introduction to Algebra", "content": "Algebra is the branch of mathematics that deals with symbols and the rules for manipulating those symbols. Variables like x and y represent numbers in equations. For example: 2x + 3 = 7 → x = 2. Key concepts: variables, expressions, equations, inequalities, and functions.", "material_type": "note", "difficulty": "beginner"},
            {"title": "Calculus Fundamentals", "content": "Calculus is divided into two main branches: Differential Calculus (finding rates of change, derivatives) and Integral Calculus (finding areas under curves, integrals). The Fundamental Theorem of Calculus links these two branches. Key formulas: d/dx(xⁿ) = nxⁿ⁻¹, ∫xⁿdx = xⁿ⁺¹/(n+1) + C", "material_type": "note", "difficulty": "advanced"},
            {"title": "Statistics Basics", "content": "Statistics involves collecting, analyzing, and interpreting data. Measures of Central Tendency: Mean (average), Median (middle value), Mode (most frequent). Measures of Spread: Range, Variance, Standard Deviation. Probability is the likelihood of an event occurring, ranging from 0 to 1.", "material_type": "note", "difficulty": "intermediate"},
        ]
    },
    {
        "name": "Physics",
        "description": "Mechanics, Thermodynamics, Electromagnetism, Quantum Physics",
        "icon": "⚛️",
        "color": "#0EA5E9",
        "materials": [
            {"title": "Newton's Laws of Motion", "content": "Newton's Three Laws: 1) Law of Inertia - An object at rest stays at rest unless acted upon by a force. 2) F = ma - Force equals mass times acceleration. 3) Action-Reaction - For every action there is an equal and opposite reaction. Applications: rocket propulsion, car safety, sports physics.", "material_type": "note", "difficulty": "beginner"},
            {"title": "Electromagnetic Waves", "content": "Electromagnetic waves are transverse waves that don't need a medium to travel. The spectrum includes: Radio waves, Microwaves, Infrared, Visible light, Ultraviolet, X-rays, Gamma rays. Speed of light: c = 3×10⁸ m/s. Relationship: c = f × λ where f is frequency and λ is wavelength.", "material_type": "note", "difficulty": "intermediate"},
        ]
    },
    {
        "name": "Chemistry",
        "description": "Atoms, Molecules, Chemical Reactions, Organic Chemistry",
        "icon": "🧪",
        "color": "#10B981",
        "materials": [
            {"title": "Periodic Table Basics", "content": "The periodic table organizes elements by atomic number. Elements in the same column (group) share similar properties. Groups 1-2 are metals, Groups 17-18 are nonmetals and noble gases. Key concepts: atomic number, atomic mass, electron configuration, valence electrons.", "material_type": "note", "difficulty": "beginner"},
            {"title": "Chemical Bonding", "content": "Types of Chemical Bonds: 1) Ionic bonds - transfer of electrons (NaCl). 2) Covalent bonds - sharing of electrons (H₂O). 3) Metallic bonds - sea of electrons. Bond polarity depends on electronegativity differences. Polar covalent bonds have unequal electron sharing.", "material_type": "note", "difficulty": "intermediate"},
        ]
    },
    {
        "name": "Programming",
        "description": "Python, JavaScript, Data Structures, Algorithms",
        "icon": "💻",
        "color": "#F59E0B",
        "materials": [
            {"title": "Python Fundamentals", "content": "Python is a high-level, interpreted language. Core concepts: Variables (x = 5), Data types (int, float, str, bool, list, dict), Control flow (if/elif/else), Loops (for, while), Functions (def), Classes (class). Python is great for AI/ML, web development, data science and automation.", "material_type": "note", "difficulty": "beginner"},
            {"title": "Data Structures", "content": "Essential data structures: 1) Arrays/Lists - ordered, indexed collections. 2) Stacks - LIFO (Last In First Out). 3) Queues - FIFO (First In First Out). 4) Trees - hierarchical structures. 5) Hash Tables - key-value stores (O(1) average lookup). 6) Graphs - nodes and edges.", "material_type": "note", "difficulty": "intermediate"},
        ]
    },
    {
        "name": "Biology",
        "description": "Cell Biology, Genetics, Evolution, Human Anatomy",
        "icon": "🧬",
        "color": "#EF4444",
        "materials": [
            {"title": "Cell Structure & Function", "content": "Cells are the basic unit of life. Prokaryotic cells (bacteria) have no nucleus. Eukaryotic cells have a membrane-bound nucleus. Key organelles: Nucleus (DNA), Mitochondria (energy/ATP), Ribosomes (protein synthesis), Endoplasmic Reticulum (transport), Golgi Apparatus (processing).", "material_type": "note", "difficulty": "beginner"},
            {"title": "DNA and Genetics", "content": "DNA (Deoxyribonucleic Acid) carries genetic information. Structure: double helix with base pairs (A-T, G-C). Genes are segments of DNA that code for proteins. Genetic inheritance follows Mendelian laws: dominant and recessive alleles. Mutations are changes in DNA sequence.", "material_type": "note", "difficulty": "intermediate"},
        ]
    },
    {
        "name": "History",
        "description": "World History, Ancient Civilizations, Modern Era, Politics",
        "icon": "🏛️",
        "color": "#8B5CF6",
        "materials": [
            {"title": "Ancient Civilizations", "content": "Major ancient civilizations: Mesopotamia (Tigris & Euphrates rivers, writing system), Egypt (Nile Valley, pyramids, pharaohs), Greece (democracy, philosophy, Olympics), Rome (republic to empire, law, infrastructure). These civilizations developed agriculture, writing, cities, and complex societies.", "material_type": "note", "difficulty": "beginner"},
            {"title": "World War II", "content": "WWII (1939-1945) was the deadliest conflict in history. Key causes: Rise of fascism, Great Depression, Treaty of Versailles failures. Major events: German invasion of Poland, Battle of Britain, Operation Barbarossa, Pearl Harbor, D-Day, Holocaust, atomic bombings of Hiroshima & Nagasaki. Resulted in the UN and Cold War.", "material_type": "note", "difficulty": "intermediate"},
        ]
    },
]

def seed_data():
    if Subject.objects.count() == 0:
        for subj_data in DEMO_SUBJECTS:
            materials = subj_data.pop('materials')
            subject = Subject.objects.create(**subj_data)
            for mat in materials:
                Material.objects.create(subject=subject, **mat)
        return True
    return False

@csrf_exempt
@require_http_methods(["GET"])
def list_subjects(request):
    seed_data()
    subjects = list(Subject.objects.values('id', 'name', 'description', 'icon', 'color'))
    for s in subjects:
        s['material_count'] = Material.objects.filter(subject_id=s['id']).count()
    return JsonResponse({'subjects': subjects})

@csrf_exempt
@require_http_methods(["GET"])
def subject_materials(request, subject_id):
    try:
        subject = Subject.objects.get(pk=subject_id)
        materials = list(Material.objects.filter(subject=subject).values(
            'id', 'title', 'content', 'material_type', 'difficulty', 'created_at'
        ))
        return JsonResponse({
            'subject': {'id': subject.id, 'name': subject.name, 'description': subject.description, 'icon': subject.icon, 'color': subject.color},
            'materials': materials
        })
    except Subject.DoesNotExist:
        return JsonResponse({'error': 'Subject not found'}, status=404)
