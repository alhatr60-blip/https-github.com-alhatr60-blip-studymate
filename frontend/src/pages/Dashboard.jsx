import React, { useState, useEffect } from 'react';
import api from '../api';
import { 
  Trophy, 
  Users, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  MessageSquare, 
  FileText,
  CheckCircle2
} from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="glass-card animate-fade-in" style={{ flex: 1, minWidth: '200px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
      <div style={{ background: `${color}20`, padding: '10px', borderRadius: '12px', color: color }}>
        {icon}
      </div>
      <TrendingUp size={16} color="var(--success)" />
    </div>
    <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{title}</p>
    <h2 style={{ margin: '4px 0 0 0', fontSize: '1.75rem' }}>{value}</h2>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats/')
      .then(res => {
        setStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  const statItems = [
    { title: 'Quizzes Taken', value: stats?.stats?.quizzes_taken || 0, icon: <Trophy size={20} />, color: '#F59E0B' },
    { title: 'Notes Summarized', value: stats?.stats?.notes_summarized || 0, icon: <FileText size={20} />, color: '#10B981' },
    { title: 'Chat Sessions', value: stats?.stats?.chat_sessions || 0, icon: <MessageSquare size={20} />, color: '#4F46E5' },
    { title: 'Learning Hours', value: '24.5', icon: <Clock size={20} />, color: '#0EA5E9' },
  ];

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ marginBottom: '8px' }}>Welcome back, {stats?.name || 'Student'}! 👋</h1>
        <p>You're on a {stats?.stats?.streak_days || 0} day study streak. Keep it up!</p>
      </div>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '40px' }}>
        {statItems.map((item, idx) => (
          <StatCard key={idx} {...item} />
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'RFR 1fr', gap: '24px' }}>
        <div className="glass-card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} color="var(--primary)" />
            Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {stats?.recent_activity.map(activity => (
              <div key={activity.id} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                padding: '12px', 
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--glass-border)'
              }}>
                <div style={{ 
                  background: activity.type === 'quiz' ? '#F59E0B20' : activity.type === 'chat' ? '#4F46E520' : '#10B98120',
                  padding: '8px', 
                  borderRadius: '50%',
                  color: activity.type === 'quiz' ? '#F59E0B' : activity.type === 'chat' ? '#4F46E5' : '#10B981'
                }}>
                  {activity.type === 'quiz' ? <Trophy size={16} /> : activity.type === 'chat' ? <MessageSquare size={16} /> : <FileText size={16} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: 'var(--text-primary)', fontWeight: 500, margin: 0 }}>{activity.title}</p>
                  <p style={{ fontSize: '0.75rem', margin: 0 }}>{activity.time}</p>
                </div>
                <CheckCircle2 size={16} color="var(--success)" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
