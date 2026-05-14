import React from 'react';
import { styles } from '../styles/appStyles';
import { renderCurrency } from '../utils/formatters';

export const DashboardPage = ({ summary }) => {
  const guideSteps = [
    {
      step: '1',
      title: 'Atur Dana Bulanan',
      text: 'Buka menu Atur Dana untuk membagi pemasukan bulan ini ke pos pengeluaran dan tabungan.'
    },
    {
      step: '2',
      title: 'Catat Transaksi',
      text: 'Masuk ke menu Transaksi untuk mencatat pemasukan, belanja, setor tabungan, atau tarik tabungan.'
    },
    {
      step: '3',
      title: 'Pantau Dashboard',
      text: 'Lihat saldo aktif, total tabungan, pemasukan bulan ini, dan sisa dana yang belum dialokasikan.'
    },
    {
      step: '4',
      title: 'Kelola Kategori',
      text: 'Tambahkan kategori baru atau dompet tabungan baru agar pencatatan tetap rapi dan sesuai kebutuhan.'
    }
  ];

  return (
    <div style={styles.page}>
      <div style={styles.heroPanel}>
        <div>
          <div style={styles.eyebrow}>Finance Overview</div>
          <h2 style={styles.heroTitle}>Arus uang kamu kini tampil lebih tenang, rapi, dan mudah dipantau.</h2>
          <p style={styles.heroDescription}>
            Lihat posisi kas aktif, kekuatan tabungan, dan pendapatan bulan berjalan dalam satu panel yang lebih nyaman dibaca.
          </p>
        </div>
        <div style={styles.heroBadge}>
          <span style={styles.heroBadgeLabel}>Periode aktif</span>
          <strong style={styles.heroBadgeValue}>{summary.current_month || '-'}</strong>
        </div>
      </div>

      {summary.is_end_of_month && summary.unallocated_this_month > 0 && (
        <div style={styles.warningBanner}>
          <h4 style={styles.bannerTitle}>Pengingat Akhir Bulan</h4>
          <p style={styles.bannerText}>
            Sebentar lagi ganti bulan. Kamu masih punya <strong>{renderCurrency(summary.unallocated_this_month)}</strong> pendapatan bulan ini yang belum dialokasikan. Segera atur di menu Atur Dana sebelum hangus menjadi "Sisa Bulan Kemarin"!
          </p>
        </div>
      )}

      {summary.leftover_past_month > 0 && (
        <div style={styles.secondaryPanel}>
          <h4 style={styles.secondaryTitle}>Dompet Sisa Pendapatan Kemarin</h4>
          <h2 style={styles.secondaryValue}>{renderCurrency(summary.leftover_past_month)}</h2>

          <div style={styles.secondaryInset}>
            <strong>Rincian Sisa Uang ({summary.leftover_percentage}% dari total pendapatan lama):</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', lineHeight: '1.6' }}>
              <li>Lupa dialokasikan: <strong style={{ color: '#c17c2e' }}>{renderCurrency(summary.unallocated_past)}</strong></li>
              <li>Sisa jatah belanja (tidak habis): <strong style={{ color: '#2f855a' }}>{renderCurrency(summary.unspent_past)}</strong></li>
            </ul>
          </div>
        </div>
      )}

      <h3 style={styles.sectionTitle}>Laporan Bulan Ini ({summary.current_month})</h3>

      <div style={styles.summaryPanel}>
        <div style={styles.summaryHeader}>
          <div>
            <h4 style={styles.mutedHeading}>Total Pemasukan Bulan Ini</h4>
            <h1 style={styles.summaryBigValue}>{renderCurrency(summary.total_income_this_month)}</h1>
          </div>
          <div style={styles.summaryMetrics}>
            <p style={styles.metricLine}>Gaji: <strong style={{ color: '#2f855a' }}>{renderCurrency(summary.income_salary)}</strong></p>
            <p style={styles.metricLine}>Bonus/Lainnya: <strong style={{ color: '#0f766e' }}>{renderCurrency(summary.income_other)}</strong></p>
          </div>
        </div>

        {summary.unallocated_this_month > 0 && (
          <p style={styles.warningInline}>{renderCurrency(summary.unallocated_this_month)} belum dialokasikan bulan ini.</p>
        )}
      </div>

      <div style={styles.cardContainer}>
        <div style={{ ...styles.card, ...styles.primaryCard }}>
          <div style={styles.cardLabel}>Dompet Aktif (Bulan Ini)</div>
          <div style={styles.cardValue}>{renderCurrency(summary.active_balance)}</div>
          <small style={styles.cardNote}>Saldo yang siap dipakai sebelum masuk bulan baru.</small>
        </div>
        <div style={{ ...styles.card, ...styles.secondaryCard }}>
          <div style={styles.cardLabel}>Total Tabungan</div>
          <div style={styles.cardValue}>{renderCurrency(summary.savings_balance)}</div>
          <small style={styles.cardNote}>Akumulasi bersih dari setor dan tarik tabungan.</small>
        </div>
      </div>

      <div style={styles.guidePanel}>
        <div style={styles.guideHeader}>
          <div>
            <div style={styles.eyebrow}>Guide Penggunaan</div>
            <h3 style={styles.guideTitle}>Urutan penggunaan aplikasi dari awal sampai pencatatan harian.</h3>
          </div>
          <p style={styles.guideDescription}>
            Gunakan alur ini supaya pengelolaan budget, transaksi, dan tabungan tetap konsisten setiap bulan.
          </p>
        </div>
        <div style={styles.guideGrid}>
          {guideSteps.map((item) => (
            <div key={item.step} style={styles.guideCard}>
              <span style={styles.guideStepBadge}>{item.step}</span>
              <strong style={styles.guideCardTitle}>{item.title}</strong>
              <p style={styles.guideCardText}>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
