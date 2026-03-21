import React, { useState } from 'react';
import api, { getApiKey } from '../api';
import { FileText, Wand2, Copy, Trash2, Clock } from 'lucide-react';

const Summarizer = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState([]);

  const handleSummarize = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await api.post('/summarizer/summarize/', {
        text,
        api_key: getApiKey(),
        title: text.substring(0, 30) + '...'
      });
      setSummary(res.data);
    } catch (err) {
      console.error(err);
      alert('Summarization failed. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (summary) {
      navigator.clipboard.writeText(summary.summary);
      alert('Summary copied to clipboard!');
    }
  };

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1>Notes Summarizer</h1>
        <p>Paste your long lectures, articles, or chapters and get a concise summary in seconds.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Input Notes</h3>
              <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={() => setText('')}>
                <Trash2 size={14} /> Clear
              </button>
            </div>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here (minimum 50 words recommended for best results)..."
              style={{
                width: '100%',
                height: '400px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border)',
                padding: '20px',
                borderRadius: '12px',
                color: 'white',
                outline: 'none',
                resize: 'none',
                lineHeight: '1.6'
              }}
            />
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '20px', padding: '16px' }}
              onClick={handleSummarize}
              disabled={loading || !text.trim()}
            >
              <Wand2 size={20} />
              <span>{loading ? 'Summarizing...' : 'Summarize Development'}</span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card" style={{ flex: 1, minHeight: '522px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>AI Summary Result</h3>
              {summary && (
                <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={copyToClipboard}>
                  <Copy size={14} /> Copy
                </button>
              )}
            </div>
            
            {!summary && !loading ? (
              <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>
                <FileText size={48} style={{ marginBottom: '16px' }} />
                <p>Output will appear here</p>
              </div>
            ) : loading ? (
              <div style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="animate-spin" style={{ marginBottom: '16px' }}>
                  <RefreshCw size={32} color="var(--primary)" />
                </div>
                <p>Analyzing text and generating summary...</p>
              </div>
            ) : (
              <div className="animate-fade-in" style={{ 
                height: '400px', 
                overflowY: 'auto', 
                padding: '24px',
                background: 'rgba(79, 70, 229, 0.05)',
                borderRadius: '12px',
                border: '1px dotted var(--primary)'
              }}>
                <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)', lineHeight: '1.8' }}>
                  {summary.summary}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summarizer;
