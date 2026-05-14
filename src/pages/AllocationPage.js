import React, { useState } from 'react';
import { FieldShell } from '../components/FieldShell';
import { ButtonText } from '../components/ButtonText';
import { styles } from '../styles/appStyles';

export const AllocationPage = ({ categories, budgets, transactions, summary, onSaveBudget, onDeleteBudget }) => {
  const allocatableCats = categories.filter((c) => c.type === 'expense' || c.type === 'savings');
  const [selectedCat, setSelectedCat] = useState(allocatableCats[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [pendingDeleteBudgetId, setPendingDeleteBudgetId] = useState(null);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentBudgets = (budgets || []).filter((b) => b.month === currentMonth);
  const pastMonths = [...new Set((budgets || []).filter((b) => b.month && b.month < currentMonth).map((b) => b.month))].sort().reverse();

  const handleEdit = (budget) => {
    setSelectedCat(budget.category_id);
    setAmount(budget.amount);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDateTime = (timestamp, dateStr) => {
    if (timestamp) {
      return new Date(timestamp).toLocaleString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return dateStr || '-';
  };

  return (
    <div style={styles.page}>
      <h3 style={styles.sectionTitle}>Atur Dana Bulan Ini ({currentMonth})</h3>
      <p style={{ color: '#666' }}>Gaji Bulan Ini: <strong>Rp {summary.total_income_this_month?.toLocaleString() || 0}</strong></p>

      <div style={styles.formCard}>
        <div style={styles.inputGroup}>
          <FieldShell label="Pos Anggaran" icon="○" hint="Pilih dompet pengeluaran atau tabungan" grow={1}>
            <select value={selectedCat} onChange={(event) => setSelectedCat(event.target.value)} style={styles.inputSelect}>
              <option value="" disabled>-- Pilih Pos Anggaran --</option>
              {allocatableCats.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.type === 'savings' ? 'Tabungan' : 'Pengeluaran'})
                </option>
              ))}
            </select>
          </FieldShell>
          <FieldShell label="Nominal Alokasi" icon="Rp" hint="Masukkan nominal anggaran" grow={1}>
            <input type="number" placeholder="Nominal (Rp)" value={amount} onChange={(event) => setAmount(event.target.value)} style={styles.inputNominal} />
          </FieldShell>
          <button
            onClick={() => {
              const numAmount = parseFloat(amount);
              if (!numAmount || numAmount <= 0) {
                return alert('Peringatan: Nominal tidak valid!');
              }

              const totalAllocated = currentBudgets
                .filter((budget) => budget.category_id !== parseInt(selectedCat, 10))
                .reduce((sum, budget) => sum + budget.amount, 0);
              const remaining = summary.total_income_this_month - totalAllocated;

              if (numAmount > remaining) {
                return alert(`DITOLAK: Overbudget! Sisa gaji kamu yang bisa dialokasikan hanya Rp ${remaining.toLocaleString()}`);
              }

              onSaveBudget(selectedCat, amount);
              setAmount('');
            }}
            style={styles.btnSimpan}
          >
            <ButtonText title="Kunci Alokasi" subtitle="Simpan budget bulan ini" />
          </button>
        </div>
      </div>

      <div style={styles.catGrid}>
        {currentBudgets.map((budget) => {
          const category = categories.find((item) => item.id === budget.category_id);
          const percent = summary.total_income_this_month > 0 ? ((budget.amount / summary.total_income_this_month) * 100).toFixed(1) : 0;
          const isSavings = category?.type === 'savings';

          return (
            <div key={budget.category_id} style={{ ...styles.catCard, borderLeft: isSavings ? '5px solid #2ecc71' : '5px solid #e74c3c' }}>
              <strong>{category?.name || 'Kategori Terhapus'}</strong><br />
              <h3 style={{ margin: '5px 0', color: isSavings ? '#27ae60' : '#c0392b' }}>Rp {budget.amount.toLocaleString()}</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <small style={{ background: '#eee', padding: '3px 8px', borderRadius: '10px' }}>{percent}% dari Gaji</small>
                <small style={{ color: '#999', fontSize: '11px' }}>{formatDateTime(budget.timestamp, budget.date)}</small>
              </div>
              <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                <button onClick={() => handleEdit(budget)} style={styles.btnEdit}>Edit</button>
                <div style={styles.inlineDeleteWrap}>
                  {pendingDeleteBudgetId === budget.category_id ? (
                    <div style={styles.inlineDeletePopover}>
                      <small style={styles.inlineDeleteText}>Hapus alokasi ini?</small>
                      <div style={styles.inlineDeleteActions}>
                        <button onClick={() => { onDeleteBudget(budget.category_id); setPendingDeleteBudgetId(null); }} style={styles.inlineDeleteConfirmBtn}>Ya</button>
                        <button onClick={() => setPendingDeleteBudgetId(null)} style={styles.inlineDeleteCancelBtn}>Batal</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setPendingDeleteBudgetId(budget.category_id)} style={styles.btnDel}>Hapus</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {pastMonths.length > 0 && (
        <div style={{ marginTop: '50px' }}>
          <h3 style={{ ...styles.sectionTitle, borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Riwayat Alokasi Bulan Sebelumnya</h3>

          {pastMonths.map((month) => {
            const budgetsInMonth = budgets.filter((budget) => budget.month === month);
            const incomesInMonth = transactions.filter((transaction) => transaction.month === month && transaction.type === 'income');
            const totalIncomeInMonth = incomesInMonth.reduce((sum, transaction) => sum + transaction.amount, 0);
            const totalAllocatedInMonth = budgetsInMonth.reduce((sum, budget) => sum + budget.amount, 0);
            const totalLeftoverInMonth = totalIncomeInMonth - totalAllocatedInMonth;
            const percentAllocated = totalIncomeInMonth > 0 ? ((totalAllocatedInMonth / totalIncomeInMonth) * 100).toFixed(1) : 0;
            const percentLeftover = totalIncomeInMonth > 0 ? (100 - percentAllocated).toFixed(1) : 0;

            return (
              <div key={month} style={{ ...styles.formCard, background: '#f8f9fa', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', flexWrap: 'wrap' }}>
                  <h4 style={{ margin: 0, color: '#333' }}>Periode: {month}</h4>
                  <div style={{ textAlign: 'right' }}>
                    <small style={{ display: 'block', color: '#666' }}>Total Pendapatan: Rp {totalIncomeInMonth.toLocaleString()}</small>
                    <small style={{ display: 'block', color: '#1976d2', fontWeight: 'bold' }}>Total Dialokasikan: {percentAllocated}%</small>
                    {totalLeftoverInMonth > 0 && (
                      <small style={{ display: 'block', color: '#e67e22', fontWeight: 'bold' }}>
                        Sisa Tidak Ter-manage: Rp {totalLeftoverInMonth.toLocaleString()} ({percentLeftover}%)
                      </small>
                    )}
                    {totalLeftoverInMonth < 0 && (
                      <small style={{ display: 'block', color: '#d32f2f', fontWeight: 'bold' }}>
                        Overbudget: -Rp {Math.abs(totalLeftoverInMonth).toLocaleString()}
                      </small>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {budgetsInMonth.map((budget) => {
                    const catName = categories.find((category) => category.id === budget.category_id)?.name || 'Terhapus';
                    const pct = totalIncomeInMonth > 0 ? ((budget.amount / totalIncomeInMonth) * 100).toFixed(1) : 0;
                    return (
                      <div key={budget.category_id} style={{ background: '#fff', padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', minWidth: '150px' }}>
                        <strong style={{ fontSize: '13px' }}>{catName}</strong><br />
                        <span style={{ fontSize: '15px', fontWeight: 'bold' }}>Rp {budget.amount.toLocaleString()}</span><br />
                        <small style={{ color: '#888' }}>{pct}%</small>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
