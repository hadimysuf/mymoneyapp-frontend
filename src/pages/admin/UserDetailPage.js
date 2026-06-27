import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { styles } from '../../styles/appStyles';

export const UserDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [resUsers, resSummary, resTrans] = await Promise.all([
        api.get('/api/admin/users'),
        api.get(`/api/admin/users/${id}/summary`),
        api.get(`/api/admin/users/${id}/transactions`)
      ]);

      const foundUser = resUsers.data.find(u => String(u.id) === String(id));
      setUser(foundUser);
      setSummary(resSummary.data);
      setTransactions(resTrans.data);
    } catch (err) {
      console.error('Gagal mengambil detail aktivitas user:', err);
      alert('Gagal memuat data pengguna.');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.container}><p>Memuat data aktivitas...</p></div>;
  if (!user) return <div style={styles.container}><p>Pengguna tidak ditemukan.</p></div>;

  return (
    <div style={styles.container}>
      <button 
        onClick={() => navigate('/admin/users')}
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          backgroundColor: '#64748b',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        ← Kembali ke Manajemen User
      </button>

      <header style={styles.header}>
        <h2 style={styles.pageTitle}>Aktivitas Finansial: {user.name}</h2>
        <p style={styles.pageSubtitle}>Inspeksi transaksi dan sisa anggaran milik {user.email}</p>
      </header>

      {/* Ringkasan Finansial */}
      {summary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={styles.card}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>Pemasukan Bulan Ini</h4>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
              Rp {summary.total_income_this_month?.toLocaleString() || 0}
            </div>
          </div>
          <div style={styles.card}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>Pengeluaran Bulan Ini</h4>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
              Rp {summary.total_expense_this_month?.toLocaleString() || 0}
            </div>
          </div>
          <div style={styles.card}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>Sisa Saldo Aktif</h4>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
              Rp {summary.active_balance?.toLocaleString() || 0}
            </div>
          </div>
          <div style={styles.card}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748b' }}>Saldo Tabungan</h4>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
              Rp {summary.savings_balance?.toLocaleString() || 0}
            </div>
          </div>
        </div>
      )}

      {/* Daftar Transaksi */}
      <div style={styles.card}>
        <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '15px' }}>Daftar Transaksi</h3>
        {transactions.length === 0 ? (
          <p style={{ color: '#64748b' }}>Belum ada transaksi untuk pengguna ini.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569' }}>
                  <th style={{ padding: '12px 8px' }}>Deskripsi</th>
                  <th style={{ padding: '12px 8px' }}>Tipe</th>
                  <th style={{ padding: '12px 8px' }}>Arus</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9', color: '#1e293b' }}>
                    <td style={{ padding: '12px 8px' }}>{t.description}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        backgroundColor: t.type === 'income' ? '#dcfce7' : t.type === 'savings' ? '#f3e8ff' : '#fee2e2',
                        color: t.type === 'income' ? '#166534' : t.type === 'savings' ? '#6b21a8' : '#991b1b',
                      }}>
                        {t.type === 'income' ? 'Pemasukan' : t.type === 'savings' ? 'Tabungan' : 'Pengeluaran'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px' }}>
                      {t.flow === 'in' ? 'Masuk (+)' : t.flow === 'out' ? 'Keluar (-)' : '-'}
                    </td>
                    <td style={{ padding: '12px 8px', textAlign: 'right', fontWeight: 'bold' }}>
                      Rp {t.amount?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
