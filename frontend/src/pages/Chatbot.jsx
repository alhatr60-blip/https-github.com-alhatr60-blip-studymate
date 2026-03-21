import React, { useState, useEffect, useRef } from 'react';
import api, { getApiKey } from '../api';
import { Send, User, Bot, Trash2, Brain } from 'lucide-react';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(() => localStorage.getItem('chat_session_id') || null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (sessionId) {
      api.get(`/chatbot/history/${sessionId}/`)
        .then(res => setMessages(res.data.messages))
        .catch(err => console.error(err));
    }
    scrollToBottom();
  }, [sessionId]);

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input;
    setInput('');
    setLoading(true);

    // Optimistic update
    const tempMessages = [...messages, { role: 'user', content: userMsg }];
    setMessages(tempMessages);

    try {
      const res = await api.post('/chatbot/ask/', {
        message: userMsg,
        session_id: sessionId,
        api_key: getApiKey()
      });

      setMessages(res.data.messages);
      if (!sessionId) {
        setSessionId(res.data.session_id);
        localStorage.setItem('chat_session_id', res.data.session_id);
      }
    } catch (err) {
      console.error(err);
      setMessages([...tempMessages, { role: 'assistant', content: 'Sorry, I encountered an error. Please check your connection or API key.' }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    if (!sessionId) return;
    try {
      await api.delete(`/chatbot/clear/${sessionId}/`);
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1>AI Study Assistant</h1>
          <p>Ask me anything about your subjects, from Algebra to Zoology!</p>
        </div>
        <button className="btn btn-secondary" onClick={clearChat} title="Clear Conversation">
          <Trash2 size={18} />
          <span>Clear</span>
        </button>
      </div>

      <div className="glass" style={{ 
        flex: 1, 
        overflowY: 'auto', 
        padding: '24px', 
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {messages.length === 0 && !loading && (
          <div style={{ textAlign: 'center', marginTop: '100px', opacity: 0.5 }}>
            <Brain size={64} style={{ marginBottom: '16px' }} />
            <h3>Start a new conversation</h3>
            <p>I'm ready to help you learn!</p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} style={{ 
            display: 'flex', 
            gap: '16px', 
            flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
            alignItems: 'flex-start'
          }}>
            <div style={{ 
              background: msg.role === 'user' ? 'var(--primary)' : 'var(--secondary)',
              padding: '10px',
              borderRadius: '12px',
              color: 'white'
            }}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className="glass-card" style={{ 
              maxWidth: '70%', 
              padding: '16px', 
              borderRadius: '16px',
              background: msg.role === 'user' ? 'rgba(79, 70, 229, 0.1)' : 'var(--card-bg)',
              border: msg.role === 'user' ? '1px solid rgba(79, 70, 229, 0.2)' : '1px solid var(--glass-border)'
            }}>
              <p style={{ color: 'var(--text-primary)', whiteSpace: 'pre-wrap', margin: 0 }}>{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
            <div style={{ background: 'var(--secondary)', padding: '10px', borderRadius: '12px', color: 'white' }}>
              <Bot size={20} className="animate-pulse" />
            </div>
            <div className="glass-card" style={{ padding: '12px 20px', borderRadius: '16px' }}>
              <p style={{ margin: 0, fontStyle: 'italic' }}>AI is thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your study question here..."
          style={{
            flex: 1,
            background: 'var(--card-bg)',
            border: '1px solid var(--border)',
            padding: '16px 24px',
            borderRadius: '12px',
            color: 'var(--text-primary)',
            outline: 'none',
            fontSize: '1rem'
          }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '16px 32px' }} disabled={loading}>
          <Send size={20} />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
