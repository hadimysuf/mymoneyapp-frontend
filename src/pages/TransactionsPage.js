import React, { useState } from 'react';
import { FieldShell } from '../components/FieldShell';
import { ButtonText } from '../components/ButtonText';
import { styles } from '../styles/appStyles';
import { formatMonthLabel, parseTransactionDate, toInputDateValue } from '../utils/formatters';

export const TransactionsPage = ({ transactions, categories, budgets, onSave, onDelete, onEdit }) => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState(categories[0]?.id || '');
  const [savingsFlow, setSavingsFlow] = useState('in');
  const [editingId, setEditingId] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterSavingsFlow, setFilterSavingsFlow] = useState('all');
  const [pendingDeleteTransactionId, setPendingDeleteTransactionId] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [monthFrom, setMonthFrom] = useState('');
  const [monthTo, setMonthTo] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentMonthBudgets = (budgets || []).filter((budget) => budget.month === currentMonth);
  const selectedCategory = categories.find((category) => category.id === parseInt(cat, 10));
  const selectedSavingsBalance = selectedCategory?.type === 'savings'
    ? transactions
        .filter((transaction) => transaction.category_id === parseInt(cat, 10))
        .reduce((sum, transaction) => sum + ((transaction.flow || 'in') === 'in' ? transaction.amount : -transaction.amount), 0)
    : 0;
  const selectedSavingsBudget = selectedCategory?.type === 'savings'
    ? currentMonthBudgets.find((budget) => budget.category_id === parseInt(cat, 10))
    : null;
  const selectedSavingsAllocated = selectedCategory?.type === 'savings'
    ? transactions
        .filter((transaction) => transaction.category_id === parseInt(cat, 10) && transaction.month === currentMonth && (transaction.flow || 'in') === 'in')
        .reduce((sum, transaction) => sum + transaction.amount, 0)
    : 0;
  const selectedSavingsRemainingAllocation = selectedSavingsBudget
    ? selectedSavingsBudget.amount - selectedSavingsAllocated
    : 0;

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

  const savingsCategories = categories.filter((category) => category.type === 'savings');
  const filteredTransactions = transactions.filter((transaction) => {
    const categoryName = categories.find((category) => category.id === transaction.category_id)?.name || '';
    const transactionDate = parseTransactionDate(transaction);
    const transactionDateValue = toInputDateValue(transactionDate);
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (filterType !== 'all' && transaction.type !== filterType) return false;
    if (filterCategory !== 'all' && transaction.category_id !== parseInt(filterCategory, 10)) return false;
    if (filterSavingsFlow !== 'all') {
      if (transaction.type !== 'savings') return false;
      if ((transaction.flow || 'in') !== filterSavingsFlow) return false;
    }
    if (monthFrom && (!transaction.month || transaction.month < monthFrom)) return false;
    if (monthTo && (!transaction.month || transaction.month > monthTo)) return false;
    if (dateFrom && (!transactionDateValue || transactionDateValue < dateFrom)) return false;
    if (dateTo && (!transactionDateValue || transactionDateValue > dateTo)) return false;
    if (normalizedKeyword) {
      const haystack = `${transaction.description || ''} ${categoryName} ${transaction.type || ''}`.toLowerCase();
      if (!haystack.includes(normalizedKeyword)) return false;
    }
    return true;
  });

  const savingsMutationSummary = savingsCategories
    .map((category) => {
      const categoryTransactions = filteredTransactions.filter((transaction) => transaction.category_id === category.id);
      const totalIn = categoryTransactions
        .filter((transaction) => (transaction.flow || 'in') === 'in')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      const totalOut = categoryTransactions
        .filter((transaction) => (transaction.flow || 'in') === 'out')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      const balance = transactions
        .filter((transaction) => transaction.category_id === category.id)
        .reduce((sum, transaction) => sum + ((transaction.flow || 'in') === 'in' ? transaction.amount : -transaction.amount), 0);

      return { category, totalIn, totalOut, balance };
    })
    .filter((item) => item.totalIn > 0 || item.totalOut > 0 || item.balance > 0);

  const savingsMonthlyStats = Object.values(
    filteredTransactions
      .filter((transaction) => transaction.type === 'savings')
      .reduce((accumulator, transaction) => {
        const monthKey = transaction.month || '-';
        if (!accumulator[monthKey]) {
          accumulator[monthKey] = { month: monthKey, totalIn: 0, totalOut: 0, net: 0 };
        }

        if ((transaction.flow || 'in') === 'out') {
          accumulator[monthKey].totalOut += transaction.amount;
          accumulator[monthKey].net -= transaction.amount;
        } else {
          accumulator[monthKey].totalIn += transaction.amount;
          accumulator[monthKey].net += transaction.amount;
        }

        return accumulator;
      }, {})
  ).sort((left, right) => right.month.localeCompare(left.month));

  const resetForm = () => {
    setDesc('');
    setAmount('');
    setSavingsFlow('in');
    setEditingId(null);
  };

  const handleEditClick = (transaction) => {
    setEditingId(transaction.id);
    setDesc(transaction.description);
    setAmount(transaction.amount);
    setCat(String(transaction.category_id));
    setSavingsFlow(transaction.flow || 'in');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={styles.page}>
      <div style={{ ...styles.formCard, marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0 }}>Monitoring Anggaran ({currentMonth})</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {currentMonthBudgets.map((budget) => {
            const catInfo = categories.find((category) => category.id === budget.category_id);
            if (catInfo?.type !== 'expense' && catInfo?.type !== 'savings') return null;

            const used = transactions
              .filter((transaction) => transaction.category_id === budget.category_id && transaction.month === currentMonth)
              .reduce((sum, transaction) => sum + transaction.amount, 0);
            const progress = budget.amount > 0 ? Math.min((used / budget.amount) * 100, 100) : 0;
            const isWarning = used > budget.amount;
            const label = catInfo?.type === 'savings' ? 'Terkumpul' : 'Dipakai';

            return (
              <div key={budget.category_id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold' }}>
                  <span>{catInfo.name}</span>
                  <span style={{ color: isWarning ? '#d32f2f' : '#333' }}>{label}: Rp {used.toLocaleString()} / Limit: Rp {(budget.amount || 0).toLocaleString()}</span>
                </div>
                <div style={{ width: '100%', height: '10px', background: '#ddd', borderRadius: '5px', marginTop: '5px' }}>
                  <div style={{ width: `${progress}%`, height: '100%', background: isWarning ? '#e74c3c' : (catInfo?.type === 'savings' ? '#27ae60' : '#3498db'), borderRadius: '5px' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.formCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
          <h3 style={styles.formTitle}>{editingId ? 'Edit Transaksi' : 'Catat Transaksi'}</h3>
          {editingId && <button onClick={resetForm} style={styles.btnEdit}>Batal Edit</button>}
        </div>
        <div style={styles.inputGroup}>
          <FieldShell label="Keterangan" icon="✎" hint="Tulis nama transaksi yang mudah dikenali" grow={2}>
            <input placeholder="Keterangan..." value={desc} onChange={(event) => setDesc(event.target.value)} style={styles.input} />
          </FieldShell>
          <FieldShell label="Nominal" icon="Rp" hint="Masukkan angka transaksi" grow={1}>
            <input placeholder="Nominal" type="number" value={amount} onChange={(event) => setAmount(event.target.value)} style={styles.inputNominal} />
          </FieldShell>
          <FieldShell label="Kategori" icon="○" hint="Pilih kategori transaksi" grow={1}>
            <select value={cat} onChange={(event) => setCat(event.target.value)} style={styles.inputSelect}>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name || 'Tanpa Kategori'} ({category.type})</option>)}
            </select>
          </FieldShell>
          {selectedCategory?.type === 'savings' && (
            <FieldShell label="Mode Tabungan" icon="↕" hint="Pilih setor atau tarik" grow={1}>
              <select value={savingsFlow} onChange={(event) => setSavingsFlow(event.target.value)} style={styles.inputSelect}>
                <option value="in">Setor Tabungan</option>
                <option value="out">Tarik Tabungan</option>
              </select>
            </FieldShell>
          )}
          <button
            onClick={() => {
              if (!desc.trim() || !amount || amount <= 0) {
                return alert('Peringatan: Keterangan dan Nominal wajib diisi dengan benar (tidak boleh nol/minus)!');
              }

              const currentBudget = currentMonthBudgets.find((budget) => budget.category_id === parseInt(cat, 10));
              const usedInCategory = transactions
                .filter((transaction) => transaction.category_id === parseInt(cat, 10) && transaction.month === currentMonth && (selectedCategory?.type !== 'savings' || (transaction.flow || 'in') === 'in'))
                .reduce((sum, transaction) => sum + transaction.amount, 0);
              const remainingBudget = currentBudget ? currentBudget.amount - usedInCategory : 0;
              const savingsBalance = transactions
                .filter((transaction) => transaction.category_id === parseInt(cat, 10))
                .reduce((sum, transaction) => sum + ((transaction.flow || 'in') === 'in' ? transaction.amount : -transaction.amount), 0);

              if ((selectedCategory?.type === 'expense' || (selectedCategory?.type === 'savings' && savingsFlow === 'in')) && !currentBudget) {
                return alert('Kategori ini belum punya alokasi untuk bulan berjalan.');
              }

              if ((selectedCategory?.type === 'expense' || (selectedCategory?.type === 'savings' && savingsFlow === 'in')) && parseFloat(amount) > remainingBudget) {
                return alert(`Transaksi melebihi sisa alokasi kategori ini. Sisa yang tersedia: Rp ${Math.max(remainingBudget, 0).toLocaleString()}`);
              }

              if (selectedCategory?.type === 'savings' && savingsFlow === 'out' && parseFloat(amount) > savingsBalance) {
                return alert(`Penarikan melebihi saldo tabungan kategori ini. Saldo tersedia: Rp ${Math.max(savingsBalance, 0).toLocaleString()}`);
              }

              if (editingId) {
                onEdit(editingId, desc, amount, cat, selectedCategory?.type === 'savings' ? savingsFlow : undefined);
              } else {
                onSave(desc, amount, cat, selectedCategory?.type === 'savings' ? savingsFlow : undefined);
              }

              resetForm();
            }}
            style={styles.btnSimpan}
          >
            <ButtonText title={editingId ? 'Simpan Perubahan' : 'Simpan'} subtitle={editingId ? 'Perbarui transaksi ini' : 'Tambah ke riwayat'} />
          </button>
        </div>
        {selectedCategory?.type === 'savings' && (
          <div style={{ marginTop: '15px', padding: '14px 16px', borderRadius: '10px', background: '#f3fbf5', border: '1px solid #d8f1df' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px', flexWrap: 'wrap' }}>
              <div>
                <strong style={{ display: 'block', color: '#1b5e20' }}>Saldo Tabungan Saat Ini</strong>
                <span style={{ fontSize: '18px', fontWeight: '700', color: '#27ae60' }}>Rp {Math.max(selectedSavingsBalance, 0).toLocaleString()}</span>
              </div>
              <div>
                <strong style={{ display: 'block', color: '#555' }}>Sisa Setoran Bulan Ini</strong>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#2d3436' }}>
                  {selectedSavingsBudget ? `Rp ${Math.max(selectedSavingsRemainingAllocation, 0).toLocaleString()}` : 'Belum ada alokasi'}
                </span>
              </div>
              <div>
                <strong style={{ display: 'block', color: '#555' }}>Maks Tarik Sekarang</strong>
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#2d3436' }}>Rp {Math.max(selectedSavingsBalance, 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ ...styles.formCard, marginBottom: '30px' }}>
        <h3 style={{ marginTop: 0 }}>Filter Transaksi</h3>
        <div style={styles.inputGroup}>
          <FieldShell label="Pencarian" icon="⌕" hint="Cari keterangan atau kategori" grow={2}>
            <input placeholder="Cari transaksi atau kategori..." value={keyword} onChange={(event) => setKeyword(event.target.value)} style={styles.input} />
          </FieldShell>
          <FieldShell label="Jenis" icon="◌" hint="Pilih jenis transaksi" grow={1}>
            <select value={filterType} onChange={(event) => setFilterType(event.target.value)} style={styles.inputSelect}>
              <option value="all">Semua Jenis</option>
              <option value="income">Pemasukan</option>
              <option value="expense">Pengeluaran</option>
              <option value="savings">Tabungan</option>
            </select>
          </FieldShell>
          <FieldShell label="Kategori" icon="○" hint="Filter per kategori" grow={1}>
            <select value={filterCategory} onChange={(event) => setFilterCategory(event.target.value)} style={styles.inputSelect}>
              <option value="all">Semua Kategori</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name || 'Tanpa Kategori'}</option>)}
            </select>
          </FieldShell>
          <FieldShell label="Mutasi Tabungan" icon="↕" hint="Filter setor atau tarik" grow={1}>
            <select value={filterSavingsFlow} onChange={(event) => setFilterSavingsFlow(event.target.value)} style={styles.inputSelect}>
              <option value="all">Semua Mutasi Tabungan</option>
              <option value="in">Setor Tabungan</option>
              <option value="out">Tarik Tabungan</option>
            </select>
          </FieldShell>
          <FieldShell label="Bulan Dari" icon="◷" grow={1}>
            <input type="month" value={monthFrom} onChange={(event) => setMonthFrom(event.target.value)} style={styles.inputSelect} />
          </FieldShell>
          <FieldShell label="Bulan Sampai" icon="◷" grow={1}>
            <input type="month" value={monthTo} onChange={(event) => setMonthTo(event.target.value)} style={styles.inputSelect} />
          </FieldShell>
          <FieldShell label="Tanggal Dari" icon="◫" grow={1}>
            <input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} style={styles.inputSelect} />
          </FieldShell>
          <FieldShell label="Tanggal Sampai" icon="◫" grow={1}>
            <input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} style={styles.inputSelect} />
          </FieldShell>
          <button
            onClick={() => {
              setKeyword('');
              setFilterType('all');
              setFilterCategory('all');
              setFilterSavingsFlow('all');
              setMonthFrom('');
              setMonthTo('');
              setDateFrom('');
              setDateTo('');
            }}
            style={styles.btnEdit}
          >
            <ButtonText title="Reset Filter" subtitle="Kembalikan tampilan awal" />
          </button>
        </div>
      </div>

      {savingsMutationSummary.length > 0 && (
        <div style={{ ...styles.formCard, marginBottom: '30px' }}>
          <h3 style={{ marginTop: 0 }}>Mutasi Tabungan per Kategori</h3>
          <div style={styles.catGrid}>
            {savingsMutationSummary.map((item) => (
              <div key={item.category.id} style={{ ...styles.catCard, borderLeft: '4px solid #2ecc71' }}>
                <strong>{item.category.name}</strong>
                <div style={{ marginTop: '10px', fontSize: '14px', lineHeight: '1.8' }}>
                  <div style={{ color: '#27ae60' }}>Total Masuk: Rp {item.totalIn.toLocaleString()}</div>
                  <div style={{ color: '#c0392b' }}>Total Keluar: Rp {item.totalOut.toLocaleString()}</div>
                  <div style={{ color: '#1b5e20', fontWeight: '700' }}>Saldo Saat Ini: Rp {Math.max(item.balance, 0).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {savingsMonthlyStats.length > 0 && (
        <div style={{ ...styles.formCard, marginBottom: '30px' }}>
          <h3 style={{ marginTop: 0 }}>Statistik Mutasi Tabungan per Bulan</h3>
          <div style={styles.catGrid}>
            {savingsMonthlyStats.map((item) => (
              <div key={item.month} style={{ ...styles.catCard, borderLeft: '4px solid #16a085' }}>
                <strong>{formatMonthLabel(item.month)}</strong>
                <div style={{ marginTop: '10px', fontSize: '14px', lineHeight: '1.8' }}>
                  <div style={{ color: '#27ae60' }}>Masuk: Rp {item.totalIn.toLocaleString()}</div>
                  <div style={{ color: '#c0392b' }}>Keluar: Rp {item.totalOut.toLocaleString()}</div>
                  <div style={{ color: item.net >= 0 ? '#1b5e20' : '#d32f2f', fontWeight: '700' }}>
                    Net: {item.net >= 0 ? '+' : '-'}Rp {Math.abs(item.net).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>Waktu</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Keterangan</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Nominal</th>
              <th style={{ padding: '12px' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.slice().reverse().map((transaction) => {
              const categoryName = categories.find((category) => category.id === transaction.category_id)?.name;

              return (
                <tr key={transaction.id} style={styles.tableRow}>
                  <td style={{ padding: '12px', color: '#666', fontSize: '13px' }}>{formatDateTime(transaction.timestamp, transaction.date)}</td>
                  <td style={{ padding: '12px' }}>
                    <strong>{transaction.description}</strong><br />
                    <small style={{ color: '#888', background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>
                      {categoryName || 'Tanpa Kategori'}
                    </small>
                  </td>
                  <td style={{ padding: '12px', color: transaction.type === 'income' || transaction.flow === 'in' ? '#27ae60' : '#c0392b', fontWeight: 'bold' }}>
                    {transaction.type === 'income' || transaction.flow === 'in' ? '+' : '-'} Rp {(transaction.amount || 0).toLocaleString()}
                    {transaction.type === 'savings' && (
                      <div>
                        <small style={{ color: '#666' }}>{transaction.flow === 'out' ? 'Tarik Tabungan' : 'Setor Tabungan'}</small>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button onClick={() => handleEditClick(transaction)} style={styles.btnEdit}>Edit</button>
                      <div style={styles.inlineDeleteWrap}>
                        {pendingDeleteTransactionId === transaction.id ? (
                          <div style={styles.inlineDeletePopover}>
                            <small style={styles.inlineDeleteText}>Hapus transaksi ini?</small>
                            <div style={styles.inlineDeleteActions}>
                              <button onClick={() => { onDelete(transaction.id); setPendingDeleteTransactionId(null); }} style={styles.inlineDeleteConfirmBtn}>Ya</button>
                              <button onClick={() => setPendingDeleteTransactionId(null)} style={styles.inlineDeleteCancelBtn}>Batal</button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => setPendingDeleteTransactionId(transaction.id)} style={styles.btnDel}>Hapus</button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#777' }}>
                  Tidak ada transaksi yang cocok dengan filter saat ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
