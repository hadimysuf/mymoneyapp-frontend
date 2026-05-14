import React, { useState } from 'react';
import { FieldShell } from '../components/FieldShell';
import { ButtonText } from '../components/ButtonText';
import { styles } from '../styles/appStyles';

export const CategoriesPage = ({ categories, transactions, budgets, onAddCat, onDeleteCat }) => {
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('expense');
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const currentMonth = new Date().toISOString().slice(0, 7);

  const getSavingsBalance = (id) => transactions
    .filter((transaction) => transaction.category_id === id)
    .reduce((sum, transaction) => sum + ((transaction.flow || 'in') === 'in' ? transaction.amount : -transaction.amount), 0);

  const getCurrentMonthSavingsAllocation = (id) => budgets
    .find((budget) => budget.category_id === id && budget.month === currentMonth)?.amount || 0;

  const handleDelete = (id) => {
    const isUsedInTx = transactions.some((transaction) => transaction.category_id === id);
    const isUsedInBudget = budgets.some((budget) => budget.category_id === id);

    if (isUsedInTx || isUsedInBudget) {
      alert('DITOLAK: Kategori ini tidak bisa dihapus karena masih digunakan di Transaksi atau Atur Dana!');
      return;
    }

    onDeleteCat(id);
    setPendingDeleteId(null);
  };

  return (
    <div style={styles.page}>
      <h3 style={styles.sectionTitle}>Kelola Kategori & Dompet</h3>
      <div style={{ ...styles.formCard, display: 'flex', gap: '10px', maxWidth: '700px' }}>
        <FieldShell label="Nama Kategori" icon="✦" hint="Gunakan nama yang singkat dan jelas" grow={2}>
          <input placeholder="Nama Kategori Baru..." value={newCatName} onChange={(event) => setNewCatName(event.target.value)} style={styles.input} />
        </FieldShell>
        <FieldShell label="Jenis Kategori" icon="○" hint="Pilih tipe arus uang" grow={1}>
          <select value={newCatType} onChange={(event) => setNewCatType(event.target.value)} style={styles.inputSelect}>
            <option value="expense">Pengeluaran (Gaya Hidup)</option>
            <option value="savings">Tabungan (Investasi/Simpanan)</option>
            <option value="income">Pemasukan (Gaji/Bonus)</option>
          </select>
        </FieldShell>
        <button
          onClick={() => {
            if (!newCatName.trim()) {
              return alert('Peringatan: Nama Kategori tidak boleh kosong!');
            }
            onAddCat(newCatName, newCatType);
            setNewCatName('');
          }}
          style={styles.btnSimpan}
        >
          <ButtonText title="Tambah" subtitle="Simpan kategori baru" />
        </button>
      </div>

      <div style={styles.catGrid}>
        {categories.map((category) => (
          <div key={category.id} style={{ ...styles.catCard, borderLeft: category.type === 'savings' ? '4px solid #2ecc71' : (category.type === 'income' ? '4px solid #3498db' : '4px solid #e74c3c') }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{category.name}</strong><br />
                <small>{category.type}</small>
                {category.type === 'savings' && (
                  <div style={{ marginTop: '8px' }}>
                    <small style={{ display: 'block', color: '#1b5e20', fontWeight: '600' }}>Saldo: Rp {Math.max(getSavingsBalance(category.id), 0).toLocaleString()}</small>
                    <small style={{ display: 'block', color: '#666' }}>Alokasi bulan ini: Rp {getCurrentMonthSavingsAllocation(category.id).toLocaleString()}</small>
                  </div>
                )}
              </div>
              <div style={styles.categoryDeleteWrap}>
                {pendingDeleteId === category.id ? (
                  <div style={styles.categoryDeletePopover}>
                    <small style={styles.categoryDeletePopoverText}>Hapus kategori ini?</small>
                    <div style={styles.categoryDeleteActions}>
                      <button onClick={() => handleDelete(category.id)} style={styles.categoryDeleteConfirmBtn}>Ya, Hapus</button>
                      <button onClick={() => setPendingDeleteId(null)} style={styles.categoryDeleteCancelBtn}>Batal</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setPendingDeleteId(category.id)} style={styles.categoryDeleteBtn}>
                    <span style={styles.categoryDeleteIcon}>−</span>
                    <span style={styles.categoryDeleteText}>Hapus</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
