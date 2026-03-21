import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  BookOpen, 
  GraduationCap, 
  FileText, 
  Settings,
  BrainCircuit
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'AI Chatbot', path: '/chat', icon: <MessageSquare size={20} /> },
    { name: 'Learning Materials', path: '/materials', icon: <BookOpen size={20} /> },
    { name: 'Quiz Generator', path: '/quiz', icon: <GraduationCap size={20} /> },
    { name: 'Notes Summarizer', path: '/summarizer', icon: <FileText size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="sidebar">
      <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ 
          background: 'var(--primary)', 
          padding: '8px', 
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <BrainCircuit size={24} color="white" />
        </div>
        <h2 style={{ fontSize: '1.25rem', marginBottom: 0 }}>StudyMate</h2>
      </div>

      <nav style={{ padding: '12px', flex: 1 }}>
        <ul style={{ listStyle: 'none' }}>
          {navItems.map((item) => (
            <li key={item.path} style={{ marginBottom: '4px' }}>
              <NavLink 
                to={item.path}
                className={({ isActive }) => `
                  btn nav-link
                  ${isActive ? 'active-nav' : ''}
                `}
                style={({ isActive }) => ({
                  width: '100%',
                  justifyContent: 'flex-start',
                  padding: '12px 16px',
                  background: isActive ? 'rgba(79, 70, 229, 0.1)' : 'transparent',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
                  borderRadius: isActive ? '0 8px 8px 0' : '8px',
                })}
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div style={{ padding: '24px', borderTop: '1px solid var(--border)' }}>
        <div className="glass" style={{ padding: '12px', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', marginBottom: '8px' }}>Study Streak</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent)' }}>🔥 12</span>
            <span style={{ fontSize: '0.75rem' }}>Days</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
