# StudyMate AI 🎓

StudyMate AI is a comprehensive, AI-powered educational assistant designed to help students streamline their learning process. Built with a modern tech stack and integrated with Google's Gemini AI, it provides a range of smart features to enhance productivity and understanding.

## 🚀 Key Features

-   **🤖 AI Chatbot**: A helpful and encouraging educational assistant powered by Gemini 1.5 Flash. It can answer study questions, explain complex topics, and provide learning guidance.
-   **📝 Smart Summarizer**: Quickly condense long study notes or articles into concise, bulleted summaries focusing on key concepts.
-   **❓ Interactive Quizzes**: Generate custom multiple-choice quizzes on any topic at various difficulty levels. Includes detailed explanations for every answer to reinforce learning.
-   **📚 Study Materials**: An organized repository (Math, Science, History, etc.) to manage and access notes, articles, and videos.
-   **📊 Personal Dashboard**: Get an overview of your recent activity and track your learning progress in one place.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite), Axios, Lucide-React, React Router.
-   **Backend**: Django, Django REST Framework, SQLite, Django CORS Headers.
-   **AI Integration**: Google Generative AI (Gemini 1.5 Flash).

## ⚙️ Setup Instructions

### 1. Prerequisites
-   **Python 3.10+**
-   **Node.js 18+**
-   **Google Gemini API Key** (Get one from [Google AI Studio](https://aistudio.google.com/))

### 2. Backend Setup
1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Set up a virtual environment and activate it:
    ```bash
    # Windows
    python -m venv venv
    venv\Scripts\activate

    # macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run migrations:
    ```bash
    python manage.py migrate
    ```
5.  Start the development server:
    ```bash
    python manage.py runserver
    ```
    The backend will run at `http://127.0.0.1:8000/`.

### 3. Frontend Setup
1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will be accessible at `http://localhost:3000/`.

## 🔑 Configuration
Once the application is running, go to the **Settings** page in the frontend and enter your **Google Gemini API Key**. This will enable all AI-powered features like the chatbot, summarizer, and quiz generator.

## 📄 License
This project is for educational purposes.
