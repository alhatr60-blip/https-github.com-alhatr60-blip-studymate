import React, { useState, useEffect } from 'react';
import { setApiKey, getApiKey } from '../api';
import { Settings as SettingsIcon, ShieldCheck, Key, Save, AlertCircle } from 'lucide-react';

const Settings = () => {
  const [apiKey, setKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setKey(getApiKey());
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setApiKey(apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '700px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1>App Settings</h1>
        <p>Configure your study assistant and external integrations.</p>
      </div>

      <div className="glass-card" style={{ padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'var(--primary)', padding: '12px', borderRadius: '12px', color: 'white' }}>
            <Key size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0 }}>Gemini API Key</h3>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>Needed for Chat, Quiz Generator, and Summarizer features</p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontWeight: 500 }}>Enter your API Key</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="password" 
                value={apiKey}
                onChange={(e) => setKey(e.target.value)}
                placeholder="sk-..."
                style={{
                  width: '100%',
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  color: 'white',
                  outline: 'none',
                  fontSize: '1rem'
                }}
              />
            </div>
            <p style={{ marginTop: '12px', fontSize: '0.81rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={14} />
              Your key is stored locally in your browser and is never sent to our database.
            </p>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '14px 28px' }}>
            {saved ? <ShieldCheck size={20} /> : <Save size={20} />}
            <span>{saved ? 'Key Saved Successfully!' : 'Save Configuration'}</span>
          </button>
        </form>

        <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '1px solid var(--border)' }}>
          <h4 style={{ marginBottom: '16px' }}>How to get an API Key?</h4>
          <ol style={{ marginLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
            <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>Google AI Studio</a></li>
            <li>Sign in with your Google account</li>
            <li>Click on "Create API key"</li>
            <li>Copy your new key and paste it above</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Settings;
