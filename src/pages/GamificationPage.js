import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { styles } from '../styles/appStyles';

export const GamificationPage = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGamification();
  }, []);

  const fetchGamification = async () => {
    try {
      const res = await api.get('/api/gamification');
      setMilestones(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.pageTitle}>Lencana & Prestasi</h2>
        <p style={styles.pageSubtitle}>Kumpulkan lencana dengan mencapai target aktivitas finansialmu.</p>
      </header>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {milestones.map((m) => (
            <div key={m.id} style={{
              ...styles.card,
              border: m.isCompleted ? '2px solid #3b82f6' : '1px solid #eee',
              opacity: m.isCompleted ? 1 : 0.7
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <div style={{ fontSize: '40px', filter: m.isCompleted ? 'none' : 'grayscale(100%)' }}>
                  {m.icon || '🏅'}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', color: m.isCompleted ? '#1e293b' : '#64748b' }}>{m.name}</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>{m.description}</p>
                </div>
              </div>
              
              {m.condition !== 'manual' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px', fontSize: '12px', color: '#64748b' }}>
                    <span>Progres</span>
                    <span>{Math.min(m.progress, m.target).toLocaleString()} / {m.target.toLocaleString()}</span>
                  </div>
                  <div style={{ background: '#e2e8f0', borderRadius: '10px', height: '8px', overflow: 'hidden' }}>
                    <div style={{ 
                      background: m.isCompleted ? '#3b82f6' : '#94a3b8', 
                      height: '100%', 
                      width: `${Math.min((m.progress / m.target) * 100, 100)}%`,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
              )}
              
              {m.condition === 'manual' && (
                <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748b', padding: '5px' }}>
                  Lencana ini diberikan khusus oleh Admin.
                </div>
              )}

              {m.isCompleted && (
                <div style={{ marginTop: '15px', textAlign: 'center', color: '#3b82f6', fontWeight: 'bold', fontSize: '14px' }}>
                  ✓ BERHASIL DIRAIH
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
