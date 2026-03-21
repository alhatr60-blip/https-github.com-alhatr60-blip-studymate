import React, { useState } from 'react';
import api, { getApiKey } from '../api';
import { Brain, CheckCircle, XCircle, RefreshCw, Trophy } from 'lucide-react';

const Quiz = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswer, setUserAnswer] = useState(null);

  const generateQuiz = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setQuiz(null);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);

    try {
      const res = await api.post('/quiz/generate/', {
        topic,
        difficulty,
        api_key: getApiKey()
      });
      setQuiz(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to generate quiz. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (option) => {
    if (userAnswer) return;
    setUserAnswer(option);
    if (option === quiz.questions[currentQuestion].correct_answer) {
      setScore(score + 1);
    }
  };

  const nextQuestion = () => {
    setUserAnswer(null);
    if (currentQuestion + 1 < quiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  return (
    <div className="animate-fade-in">
      {!quiz ? (
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', paddingTop: '50px' }}>
          <div style={{ background: 'var(--primary)', display: 'inline-flex', padding: '20px', borderRadius: '24px', marginBottom: '24px' }}>
            <Brain size={48} color="white" />
          </div>
          <h1>Quiz Generator</h1>
          <p style={{ marginBottom: '40px' }}>Generate a personalized quiz on any topic using AI to test your knowledge.</p>
          
          <form className="glass-card" onSubmit={generateQuiz} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>What do you want to be tested on?</label>
              <input 
                type="text" 
                placeholder="e.g. Ancient Rome, Python Loops, Organic Chemistry..." 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={{
                  width: '100%',
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  color: 'white',
                  outline: 'none'
                }}
              />
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Select Difficulty</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {['easy', 'medium', 'hard'].map(level => (
                  <button 
                    key={level}
                    type="button"
                    className={`btn ${difficulty === level ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setDifficulty(level)}
                    style={{ flex: 1, textTransform: 'capitalize' }}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? <RefreshCw className="animate-spin" size={20} /> : <Brain size={20} />}
              <span>{loading ? 'Generating Quiz...' : 'Generate Quiz'}</span>
            </button>
          </form>
        </div>
      ) : showResult ? (
        <div className="glass-card animate-fade-in" style={{ maxWidth: '600px', margin: '50px auto', textAlign: 'center', padding: '60px 40px' }}>
          <div style={{ background: '#F59E0B20', display: 'inline-flex', padding: '24px', borderRadius: '50%', marginBottom: '24px', color: 'var(--accent)' }}>
            <Trophy size={64} />
          </div>
          <h1>Quiz Completed!</h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '32px' }}>You scored <strong>{score}</strong> out of <strong>{quiz.questions.length}</strong></p>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setQuiz(null)}>Try Another Topic</button>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={generateQuiz}>Retake Quiz</button>
          </div>
        </div>
      ) : (
        <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <p style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '4px' }}>Question {currentQuestion + 1} of {quiz.questions.length}</p>
              <h3>{quiz.topic} ({quiz.difficulty})</h3>
            </div>
            <div className="glass" style={{ width: '150px', height: '8px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%`, 
                height: '100%', 
                background: 'var(--primary)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          <div className="glass-card" style={{ marginBottom: '24px', padding: '40px' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '32px' }}>{quiz.questions[currentQuestion].question_text}</h2>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {['A', 'B', 'C', 'D'].map(key => {
                const optionLabel = `option_${key.toLowerCase()}`;
                const optionText = quiz.questions[currentQuestion][optionLabel];
                const isCorrect = key === quiz.questions[currentQuestion].correct_answer;
                const isSelected = userAnswer === key;
                
                let bgColor = 'rgba(255, 255, 255, 0.02)';
                let borderColor = 'var(--glass-border)';
                
                if (userAnswer) {
                  if (isCorrect) {
                    bgColor = '#10B98120';
                    borderColor = '#10B981';
                  } else if (isSelected) {
                    bgColor = '#EF444420';
                    borderColor = '#EF4444';
                  }
                } else {
                  borderColor = 'var(--glass-border)';
                }

                return (
                  <button 
                    key={key}
                    className="btn"
                    onClick={() => handleAnswer(key)}
                    style={{
                      justifyContent: 'flex-start',
                      padding: '20px 24px',
                      background: bgColor,
                      border: `1px solid ${borderColor}`,
                      textAlign: 'left',
                      fontSize: '1rem',
                      color: 'var(--text-primary)'
                    }}
                  >
                    <span style={{ 
                      width: '32px', 
                      height: '32px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      borderRadius: '8px',
                      background: isSelected ? 'rgba(255, 255, 255, 0.1)' : 'var(--background)',
                      marginRight: '16px',
                      fontWeight: 'bold',
                      flexShrink: 0
                    }}>
                      {key}
                    </span>
                    <span style={{ flex: 1 }}>{optionText}</span>
                    {userAnswer && isCorrect && <CheckCircle size={20} color="#10B981" />}
                    {userAnswer && isSelected && !isCorrect && <XCircle size={20} color="#EF4444" />}
                  </button>
                );
              })}
            </div>
          </div>

          {userAnswer && (
            <div className="animate-fade-in">
              <div className="glass" style={{ padding: '20px', marginBottom: '24px', borderLeft: `4px solid ${userAnswer === quiz.questions[currentQuestion].correct_answer ? '#10B981' : '#EF4444'}` }}>
                <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '8px' }}>
                  {userAnswer === quiz.questions[currentQuestion].correct_answer ? 'Correct!' : 'Incorrect'}
                </p>
                <p style={{ margin: 0 }}>{quiz.questions[currentQuestion].explanation}</p>
              </div>
              <button className="btn btn-primary" style={{ float: 'right' }} onClick={nextQuestion}>
                {currentQuestion + 1 === quiz.questions.length ? 'Show Results' : 'Next Question'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Quiz;
