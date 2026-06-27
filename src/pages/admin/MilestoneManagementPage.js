import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { styles } from '../../styles/appStyles';

export const MilestoneManagementPage = () => {
  const [milestones, setMilestones] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states for creating/editing milestone
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('🏅');
  const [condition, setCondition] = useState('transaction_count');
  const [target, setTarget] = useState(0);

  // Modal / Assign states
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resM, resU] = await Promise.all([
        api.get('/api/admin/milestones'),
        api.get('/api/admin/users')
      ]);
      setMilestones(resM.data);
      setUsers(resU.data.filter(u => u.role !== 'admin'));
    } catch (err) {
      console.error('Gagal mengambil data milestone/user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMilestone = async (e) => {
    e.preventDefault();
    if (!name || !condition) return alert('Nama dan kondisi wajib diisi!');

    try {
      await api.post('/api/admin/milestones', {
        name,
        description,
        icon,
        condition,
        target: parseInt(target, 10) || 0
      });
      alert('Lencana baru berhasil dibuat!');
      setName('');
      setDescription('');
      setIcon('🏅');
      setCondition('transaction_count');
      setTarget(0);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal membuat lencana.');
    }
  };

  const handleDeleteMilestone = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus lencana ini?')) return;
    try {
      await api.delete(`/api/admin/milestones/${id}`);
      alert('Lencana berhasil dihapus.');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal menghapus lencana.');
    }
  };

  const handleAssignMilestone = async (e) => {
    e.preventDefault();
    if (!selectedMilestone || !selectedUserId) return alert('Pilih user!');

    try {
      await api.post(`/api/admin/milestones/${selectedMilestone.id}/assign`, {
        user_id: selectedUserId
      });
      alert('Lencana berhasil diberikan kepada user!');
      setSelectedMilestone(null);
      setSelectedUserId('');
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal memberikan lencana.');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.pageTitle}>Kelola Lencana (Gamifikasi)</h2>
        <p style={styles.pageSubtitle}>Buat target milestone otomatis atau berikan penghargaan lencana secara manual untuk pengguna berprestasi.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
        
        {/* Form Tambah Lencana */}
        <div style={styles.card}>
          <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '15px' }}>Buat Lencana Baru</h3>
          <form onSubmit={handleCreateMilestone}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#475569', fontWeight: '500' }}>Nama Lencana</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Super Saver"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                required
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#475569', fontWeight: '500' }}>Deskripsi</label>
              <input 
                type="text" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Contoh: Berhasil menabung nominal tertentu"
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '15px', marginBottom: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#475569', fontWeight: '500' }}>Ikon (Emoji)</label>
                <input 
                  type="text" 
                  value={icon} 
                  onChange={(e) => setIcon(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', textAlign: 'center' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#475569', fontWeight: '500' }}>Jenis Syarat</label>
                <select 
                  value={condition} 
                  onChange={(e) => setCondition(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                >
                  <option value="transaction_count">Jumlah Transaksi (Otomatis)</option>
                  <option value="savings_amount">Jumlah Tabungan (Otomatis)</option>
                  <option value="manual">Diberikan Manual oleh Admin</option>
                </select>
              </div>
            </div>

            {condition !== 'manual' && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#475569', fontWeight: '500' }}>Nilai Target</label>
                <input 
                  type="number" 
                  value={target} 
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder="Target (contoh: 1000000 atau 10)"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  min="0"
                />
              </div>
            )}

            <button 
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Buat Lencana
            </button>
          </form>
        </div>

        {/* List Lencana */}
        <div style={styles.card}>
          <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '15px' }}>Daftar Lencana Aktif</h3>
          {loading ? (
            <p>Memuat lencana...</p>
          ) : milestones.length === 0 ? (
            <p style={{ color: '#64748b' }}>Belum ada lencana yang dibuat.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {milestones.map((m) => (
                <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '24px' }}>{m.icon}</span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>{m.name}</h4>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                        {m.condition === 'manual' ? 'Syarat: Manual' : `Syarat: ${m.condition === 'transaction_count' ? 'Transaksi' : 'Tabungan'} (Target: ${m.target.toLocaleString()})`}
                      </p>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => setSelectedMilestone(m)}
                      style={{
                        marginRight: '8px',
                        padding: '4px 8px',
                        backgroundColor: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      Beri ke User
                    </button>
                    <button
                      onClick={() => handleDeleteMilestone(m.id)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#ef4444',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '11px'
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Assign Milestone */}
      {selectedMilestone && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{ ...styles.card, width: '400px', margin: '20px' }}>
            <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '15px' }}>
              Berikan Lencana: {selectedMilestone.icon} {selectedMilestone.name}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              Pilih pengguna untuk menerima lencana ini sebagai penghargaan khusus.
            </p>
            <form onSubmit={handleAssignMilestone}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#475569' }}>Nama Pengguna</label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                  required
                >
                  <option value="">-- Pilih User --</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedMilestone(null)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#e2e8f0',
                    color: '#475569',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  Berikan Lencana
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
