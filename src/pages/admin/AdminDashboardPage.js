import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { styles } from '../../styles/appStyles';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    suspendedUsers: 0,
    totalMilestones: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [resUsers, resMilestones] = await Promise.all([
        api.get('/api/admin/users'),
        api.get('/api/admin/milestones'),
      ]);

      const users = resUsers.data;
      const totalUsers = users.length;
      const suspendedUsers = users.filter(u => u.status === 'suspended').length;
      const totalMilestones = resMilestones.data.length;

      setStats({
        totalUsers,
        suspendedUsers,
        totalMilestones,
      });
    } catch (err) {
      console.error('Gagal mengambil statistik admin:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={styles.pageTitle}>Dashboard Admin</h2>
        <p style={styles.pageSubtitle}>Selamat datang di panel kontrol MyMoney. Kelola pengguna dan lencana aplikasi.</p>
      </header>

      {loading ? (
        <p>Memuat statistik...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <div style={styles.card}>
            <h3 style={{ fontSize: '14px', color: '#64748b', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Total Pengguna</h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#1e293b' }}>{stats.totalUsers}</div>
            <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#3b82f6' }}>Terdaftar di database</p>
          </div>

          <div style={styles.card}>
            <h3 style={{ fontSize: '14px', color: '#64748b', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Akun Ditangguhkan</h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#ef4444' }}>{stats.suspendedUsers}</div>
            <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#64748b' }}>Status suspended</p>
          </div>

          <div style={styles.card}>
            <h3 style={{ fontSize: '14px', color: '#64748b', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Total Lencana</h3>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981' }}>{stats.totalMilestones}</div>
            <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#10b981' }}>Tersedia di Gamifikasi</p>
          </div>
        </div>
      )}

      <div style={styles.card}>
        <h3 style={{ fontSize: '18px', color: '#1e293b', marginBottom: '15px' }}>Panduan Cepat Admin</h3>
        <ul style={{ paddingLeft: '20px', lineHeight: '1.6', color: '#475569' }}>
          <li>
            <strong>Kelola User:</strong> Periksa daftar pengguna terdaftar, suspend pengguna yang melanggar ketentuan, atau aktifkan kembali akun mereka. Anda juga bisa menginspeksi alokasi dana dan transaksi per pengguna jika dicurigai ada aktivitas tidak wajar.
          </li>
          <li>
            <strong>Kelola Lencana:</strong> Tambahkan atau sesuaikan lencana (milestone) baru yang bisa didapatkan secara otomatis berdasarkan jumlah transaksi/jumlah tabungan pengguna, atau bagikan lencana kustom secara manual sebagai penghargaan.
          </li>
        </ul>
      </div>
    </div>
  );
};
