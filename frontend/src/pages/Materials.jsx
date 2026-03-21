import React, { useState, useEffect } from 'react';
import api from '../api';
import { BookOpen, ChevronRight, Search, LayoutGrid, List } from 'lucide-react';

const Materials = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/materials/subjects/')
      .then(res => {
        setSubjects(res.data.subjects);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  const fetchMaterials = (subjectId) => {
    setLoading(true);
    api.get(`/materials/subjects/${subjectId}/materials/`)
      .then(res => {
        setSelectedSubject(res.data.subject);
        setMaterials(res.data.materials);
        setLoading(false);
      })
      .catch(err => console.error(err));
  };

  if (loading && subjects.length === 0) return <div>Loading subjects...</div>;

  const filteredSubjects = subjects.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      {!selectedSubject ? (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <h1>Learning Materials</h1>
              <p>Explore subject-wise organized notes and resources</p>
            </div>
            <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', gap: '8px' }}>
              <Search size={18} color="var(--text-secondary)" />
              <input 
                type="text" 
                placeholder="Search subjects..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {filteredSubjects.map(subject => (
              <div key={subject.id} className="glass-card" onClick={() => fetchMaterials(subject.id)} style={{ cursor: 'pointer', borderTop: `4px solid ${subject.color}` }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>{subject.icon}</div>
                <h3>{subject.name}</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '20px' }}>{subject.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="glass" style={{ padding: '4px 12px', fontSize: '0.75rem', color: subject.color }}>
                    {subject.material_count} Materials
                  </span>
                  <ChevronRight size={18} color="var(--text-secondary)" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="btn btn-secondary" onClick={() => setSelectedSubject(null)}>Back to Subjects</button>
            <div style={{ fontSize: '2rem' }}>{selectedSubject.icon}</div>
            <h1 style={{ margin: 0 }}>{selectedSubject.name}</h1>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {materials.map(material => (
              <div key={material.id} className="glass-card" style={{ padding: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h3>{material.title}</h3>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    background: material.difficulty === 'beginner' ? '#10B98120' : material.difficulty === 'intermediate' ? '#F59E0B20' : '#EF444420',
                    color: material.difficulty === 'beginner' ? '#10B981' : material.difficulty === 'intermediate' ? '#F59E0B' : '#EF4444',
                    textTransform: 'capitalize'
                  }}>
                    {material.difficulty}
                  </span>
                </div>
                <div style={{ 
                  color: 'var(--text-primary)', 
                  lineHeight: '1.8', 
                  fontSize: '1rem', 
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)'
                }}>
                  {material.content}
                </div>
                <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
                  <button className="btn btn-primary" style={{ fontSize: '0.875rem' }}>Take Study Notes</button>
                  <button className="btn btn-secondary" style={{ fontSize: '0.875rem' }}>Download PDF</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Materials;
