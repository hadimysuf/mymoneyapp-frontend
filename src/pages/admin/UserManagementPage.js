import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { styles } from '../../styles/appStyles';

export const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Gagal mengambil daftar pengguna:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    const confirmMsg = `Apakah Anda yakin ingin ${newStatus === 'suspended' ? 'menangguhkan (Suspend)' : 'mengaktifkan kembali (Activate)'} pengguna ini?`;
    
    if (!window.confirm(confirmMsg)) return;

    try {
      await api.patch(`/api/admin/users/${userId}/status`, { status: newStatus });
      alert('Status pengguna berhasil diperbarui.');
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal mengubah status pengguna.');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.pageTitle}>Kelola Pengguna</h2>
        <p style={styles.pageSubtitle}>Daftar seluruh pengguna terdaftar. Anda dapat menonaktifkan akun atau melihat detail aktivitas finansial mereka.</p>
      </header>

      {loading ? (
        <p>Memuat daftar pengguna...</p>
      ) : (
        <div style={styles.card}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 8px' }}>Nama</th>
                  <th style={{ padding: '12px 8px' }}>Email</th>
                  <th style={{ padding: '12px 8px' }}>Role</th>
                  <th style={{ padding: '12px 8px' }}>Status</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                    <td style={{ padding: '12px 8px', fontWeight: '500' }}>{user.name}</td>
                    <td style={{ padding: '12px 8px' }}>{user.email}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: user.role === 'admin' ? '#fee2e2' : '#f0fdf4',
                        color: user.role === 'admin' ? '#991b1b' : '#166534',
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: user.status === 'suspended' ? '#fef3c7' : '#dcfce7',
                        color: user.status === 'suspended' ? '#92400e' : '#166534',
                      }}>
                        {user.status === 'suspended' ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                      <button
                        onClick={() => navigate(`/admin/users/${user.id}`)}
                        style={{
                          marginRight: '8px',
                          padding: '6px 12px',
                          backgroundColor: '#3b82f6',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '13px'
                        }}
                      >
                        Lihat Detail
                      </button>
                      
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: user.status === 'suspended' ? '#10b981' : '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          {user.status === 'suspended' ? 'Activate' : 'Suspend'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
