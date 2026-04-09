import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import axios from 'axios';

// ==========================================
// NAVBAR
// ==========================================
const Navbar = () => (
  <nav style={styles.nav}>
    <div style={styles.navContent}>
      <div style={styles.logoGroup}><span style={styles.logoIcon}>💰</span><h1 style={styles.logoText}>MyMoney</h1></div>
      <div style={styles.navLinks}>
        <NavLink to="/" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>Dashboard</NavLink>
        <NavLink to="/allocation" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>Alokasi Zero-Based</NavLink>
        <NavLink to="/transactions" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>Riwayat</NavLink>
        <NavLink to="/categories" style={({ isActive }) => isActive ? styles.activeLink : styles.link}>Kategori</NavLink>
      </div>
    </div>
  </nav>
);

// ==========================================
// DASHBOARD (TIMELINE & ROLLOVER)
// ==========================================
const Dashboard = ({ summary }) => {
  return (
    <div style={styles.page}>
      
      {/* REMINDER AKHIR BULAN */}
      {summary.is_end_of_month && summary.unallocated_this_month > 0 && (
        <div style={{background: '#ffeaa7', borderLeft: '5px solid #fdcb6e', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px'}}>
          <h4 style={{margin: '0 0 5px 0', color: '#d63031'}}>⏰ Pengingat Akhir Bulan!</h4>
          <p style={{margin: 0, fontSize: '14px', color: '#2d3436'}}>
            Sebentar lagi ganti bulan. Kamu masih punya <strong>Rp {summary.unallocated_this_month.toLocaleString()}</strong> pendapatan bulan ini yang belum dialokasikan. Segera atur di menu Alokasi sebelum hangus menjadi "Sisa Bulan Kemarin"!
          </p>
        </div>
      )}

      {/* SISA BULAN KEMARIN */}
      {summary.leftover_past_month > 0 && (
        <div style={{background: '#f1f2f6', padding: '20px', borderRadius: '12px', border: '1px dashed #a4b0be', marginBottom: '25px'}}>
          <h4 style={{margin: 0, color: '#57606f'}}>🕰️ Dompet Sisa Pendapatan Kemarin</h4>
          <h2 style={{margin: '5px 0', color: '#2f3542'}}>Rp {summary.leftover_past_month.toLocaleString()}</h2>
          
          <div style={{background: '#fff', padding: '12px', borderRadius: '8px', marginTop: '10px', fontSize: '13px', color: '#555'}}>
            <strong>Rincian Sisa Uang ({summary.leftover_percentage}% dari total pendapatan lama):</strong>
            <ul style={{margin: '8px 0 0 0', paddingLeft: '20px', lineHeight: '1.6'}}>
              <li>Lupa dialokasikan: <strong style={{color: '#e67e22'}}>Rp {summary.unallocated_past?.toLocaleString() || 0}</strong></li>
              <li>Sisa jatah belanja (tidak habis): <strong style={{color: '#27ae60'}}>Rp {summary.unspent_past?.toLocaleString() || 0}</strong></li>
            </ul>
          </div>
        </div>
      )}

      <h3 style={styles.sectionTitle}>Laporan Bulan Ini ({summary.current_month})</h3>
      
      {/* PEMISAHAN INCOME */}
      <div style={{background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #ddd', marginBottom: '25px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '15px', marginBottom: '15px'}}>
            <div>
              <h4 style={{margin: 0, color: '#666'}}>Total Pemasukan Bulan Ini</h4>
              <h1 style={{margin: '5px 0', color: '#1976d2'}}>Rp {summary.total_income_this_month?.toLocaleString() || 0}</h1>
            </div>
            <div style={{textAlign: 'right'}}>
              <p style={{margin: '0 0 5px 0', fontSize: '14px'}}>💼 Gaji: <strong style={{color: '#27ae60'}}>Rp {summary.income_salary?.toLocaleString() || 0}</strong></p>
              <p style={{margin: 0, fontSize: '14px'}}>🚀 Bonus/Lainnya: <strong style={{color: '#8e44ad'}}>Rp {summary.income_other?.toLocaleString() || 0}</strong></p>
            </div>
        </div>
        
        {summary.unallocated_this_month > 0 && (
            <p style={{color: '#e67e22', fontWeight: 'bold', margin: 0}}>⚠️ Rp {summary.unallocated_this_month?.toLocaleString()} belum dialokasikan bulan ini!</p>
        )}
      </div>

      <div style={styles.cardContainer}>
        <div style={{...styles.card, background: 'linear-gradient(135deg, #e3f2fd, #90caf9)'}}>
          <div style={styles.cardLabel}>Dompet Aktif (Bulan Ini)</div>
          <div style={{...styles.cardValue, color: '#0d47a1'}}>Rp {summary.active_balance?.toLocaleString() || 0}</div>
          <small style={{color: '#fff'}}>Otomatis reset saat ganti bulan</small>
        </div>
        <div style={{...styles.card, background: 'linear-gradient(135deg, #e8f5e9, #a5d6a7)'}}>
          <div style={styles.cardLabel}>Total Tabungan 🔒</div>
          <div style={{...styles.cardValue, color: '#1b5e20'}}>Rp {summary.savings_balance?.toLocaleString() || 0}</div>
          <small style={{color: '#fff'}}>Akumulasi masa depan</small>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// ALOKASI (DENGAN NOMINAL SISA BULAN LALU)
// ==========================================
const AllocationPage = ({ categories, budgets, transactions, summary, onSaveBudget, onDeleteBudget }) => {
  const allocatableCats = categories.filter(c => c.type === 'expense' || c.type === 'savings');
  const [selectedCat, setSelectedCat] = useState(allocatableCats[0]?.id || '');
  const [amount, setAmount] = useState('');

  const currentMonth = new Date().toISOString().slice(0, 7);
  const currentBudgets = (budgets || []).filter(b => b.month === currentMonth);
  const pastMonths = [...new Set((budgets || []).filter(b => b.month && b.month < currentMonth).map(b => b.month))].sort().reverse();

  const handleEdit = (budget) => {
    setSelectedCat(budget.category_id);
    setAmount(budget.amount);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const formatDateTime = (timestamp, dateStr) => {
    if (timestamp) return new Date(timestamp).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    return dateStr || '-';
  };

  return (
    <div style={styles.page}>
      
      <h3 style={styles.sectionTitle}>Alokasi Bulan Ini ({currentMonth})</h3>
      <p style={{color: '#666'}}>Gaji Bulan Ini: <strong>Rp {summary.total_income_this_month?.toLocaleString() || 0}</strong></p>
      
      <div style={styles.formCard}>
        <div style={styles.inputGroup}>
          <select value={selectedCat} onChange={e => setSelectedCat(e.target.value)} style={styles.inputSelect}>
            <option value="" disabled>-- Pilih Pos Anggaran --</option>
            {allocatableCats.map(c => <option key={c.id} value={c.id}>{c.name} ({c.type === 'savings' ? 'Tabungan' : 'Pengeluaran'})</option>)}
          </select>
          <input type="number" placeholder="Nominal (Rp)" value={amount} onChange={e => setAmount(e.target.value)} style={styles.inputNominal}/>
          <button onClick={() => {onSaveBudget(selectedCat, amount); setAmount('');}} style={styles.btnSimpan}>Kunci Alokasi</button>
        </div>
      </div>

      <div style={styles.catGrid}>
        {currentBudgets.map(b => {
          const cat = categories.find(c => c.id === b.category_id);
          const percent = summary.total_income_this_month > 0 ? ((b.amount / summary.total_income_this_month) * 100).toFixed(1) : 0;
          const isSavings = cat?.type === 'savings';
          
          return (
            <div key={b.category_id} style={{...styles.catCard, borderLeft: isSavings ? '5px solid #2ecc71' : '5px solid #e74c3c'}}>
              <strong>{cat?.name || 'Kategori Terhapus'}</strong><br/>
              <h3 style={{margin: '5px 0', color: isSavings ? '#27ae60' : '#c0392b'}}>Rp {b.amount.toLocaleString()}</h3>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <small style={{background: '#eee', padding: '3px 8px', borderRadius: '10px'}}>{percent}% dari Gaji</small>
                <small style={{color: '#999', fontSize: '11px'}}>{formatDateTime(b.timestamp, b.date)}</small>
              </div>
              <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
                <button onClick={() => handleEdit(b)} style={styles.btnEdit}>Edit</button>
                <button onClick={() => onDeleteBudget(b.category_id)} style={styles.btnDel}>Hapus</button>
              </div>
            </div>
          );
        })}
      </div>

      {pastMonths.length > 0 && (
        <div style={{marginTop: '50px'}}>
          <h3 style={{...styles.sectionTitle, borderBottom: '2px solid #ddd', paddingBottom: '10px'}}>Riwayat Alokasi Bulan Sebelumnya</h3>
          
          {pastMonths.map(month => {
            const budgetsInMonth = budgets.filter(b => b.month === month);
            const incomesInMonth = transactions.filter(t => t.month === month && t.type === 'income');
            const totalIncomeInMonth = incomesInMonth.reduce((a, b) => a + b.amount, 0);
            const totalAllocatedInMonth = budgetsInMonth.reduce((a, b) => a + b.amount, 0);
            
            // LOGIKA BARU: Menghitung nominal sisa uang
            const totalLeftoverInMonth = totalIncomeInMonth - totalAllocatedInMonth;
            
            const percentAllocated = totalIncomeInMonth > 0 ? ((totalAllocatedInMonth / totalIncomeInMonth) * 100).toFixed(1) : 0;
            const percentLeftover = totalIncomeInMonth > 0 ? (100 - percentAllocated).toFixed(1) : 0;

            return (
              <div key={month} style={{...styles.formCard, background: '#f8f9fa', marginBottom: '20px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px', flexWrap: 'wrap'}}>
                  <h4 style={{margin: 0, color: '#333'}}>Periode: {month}</h4>
                  <div style={{textAlign: 'right'}}>
                    <small style={{display: 'block', color: '#666'}}>Total Pendapatan: Rp {totalIncomeInMonth.toLocaleString()}</small>
                    <small style={{display: 'block', color: '#1976d2', fontWeight: 'bold'}}>Total Dialokasikan: {percentAllocated}%</small>
                    
                    {/* TAMPILAN BARU: Menampilkan nominal Rupiah beserta persen */}
                    {totalLeftoverInMonth > 0 && (
                      <small style={{display: 'block', color: '#e67e22', fontWeight: 'bold'}}>
                        Sisa Tidak Ter-manage: Rp {totalLeftoverInMonth.toLocaleString()} ({percentLeftover}%)
                      </small>
                    )}
                    {totalLeftoverInMonth < 0 && (
                      <small style={{display: 'block', color: '#d32f2f', fontWeight: 'bold'}}>
                        Overbudget: -Rp {Math.abs(totalLeftoverInMonth).toLocaleString()}
                      </small>
                    )}

                  </div>
                </div>

                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                  {budgetsInMonth.map(b => {
                    const catName = categories.find(c => c.id === b.category_id)?.name || 'Terhapus';
                    const pct = totalIncomeInMonth > 0 ? ((b.amount / totalIncomeInMonth) * 100).toFixed(1) : 0;
                    return (
                      <div key={b.category_id} style={{background: '#fff', padding: '10px 15px', borderRadius: '8px', border: '1px solid #ddd', minWidth: '150px'}}>
                        <strong style={{fontSize: '13px'}}>{catName}</strong><br/>
                        <span style={{fontSize: '15px', fontWeight: 'bold'}}>Rp {b.amount.toLocaleString()}</span><br/>
                        <small style={{color: '#888'}}>{pct}%</small>
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
/// ==========================================
// TRANSAKSI & MONITORING (DENGAN VALIDASI)
// ==========================================
const Transactions = ({ transactions, categories, budgets, onSave, onDelete }) => {
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState(categories[0]?.id || '');
  const currentMonth = new Date().toISOString().slice(0, 7);

  const formatDateTime = (timestamp, dateStr) => {
    if (timestamp) {
      return new Date(timestamp).toLocaleString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric', 
        hour: '2-digit', minute: '2-digit'
      });
    }
    return dateStr || '-';
  };

  return (
    <div style={styles.page}>
      
      <div style={{...styles.formCard, marginBottom: '30px'}}>
        <h3 style={{marginTop: 0}}>Monitoring Anggaran ({currentMonth})</h3>
        <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          {(budgets || []).filter(b => b.month === currentMonth).map(b => {
            const catInfo = categories.find(c => c.id === b.category_id);
            if(catInfo?.type !== 'expense') return null; 
            
            const used = transactions.filter(t => t.category_id === b.category_id && t.month === currentMonth).reduce((s, t) => s + t.amount, 0);
            const progress = b.amount > 0 ? Math.min((used / b.amount) * 100, 100) : 0;
            const isWarning = used > b.amount;

            return (
              <div key={b.category_id}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold'}}>
                  <span>{catInfo.name}</span>
                  <span style={{color: isWarning ? '#d32f2f' : '#333'}}>Dipakai: Rp {used.toLocaleString()} / Limit: Rp {(b.amount || 0).toLocaleString()}</span>
                </div>
                <div style={{width: '100%', height: '10px', background: '#ddd', borderRadius: '5px', marginTop: '5px'}}>
                  <div style={{width: `${progress}%`, height: '100%', background: isWarning ? '#e74c3c' : '#3498db', borderRadius: '5px'}}></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={styles.formCard}>
        <h3 style={styles.formTitle}>Catat Transaksi</h3>
        <div style={styles.inputGroup}>
          <input placeholder="Keterangan..." value={desc} onChange={e => setDesc(e.target.value)} style={styles.input}/>
          <input placeholder="Nominal" type="number" value={amount} onChange={e => setAmount(e.target.value)} style={styles.inputNominal}/>
          <select value={cat} onChange={e => setCat(e.target.value)} style={styles.inputSelect}>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name || 'Tanpa Kategori'} ({c.type})</option>)}
          </select>
          <button 
            onClick={() => {
              // VALIDASI: Mencegah Bug NaN dan Null Exception Crash!
              if (!desc.trim() || !amount || amount <= 0) {
                return alert("Peringatan: Keterangan dan Nominal wajib diisi dengan benar (tidak boleh nol/minus)!");
              }
              onSave(desc, amount, cat); 
              setDesc(''); 
              setAmount('');
            }} 
            style={styles.btnSimpan}
          >
            Simpan
          </button>
        </div>
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={{background: '#f8f9fa'}}>
              <th style={{padding:'12px', textAlign:'left'}}>Waktu</th>
              <th style={{padding:'12px', textAlign:'left'}}>Keterangan</th>
              <th style={{padding:'12px', textAlign:'left'}}>Nominal</th>
              <th style={{padding:'12px'}}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice().reverse().map(t => {
              const categoryName = categories.find(c=>c.id===t.category_id)?.name;
              
              return (
                <tr key={t.id} style={styles.tableRow}>
                  <td style={{padding:'12px', color: '#666', fontSize: '13px'}}>
                    {formatDateTime(t.timestamp, t.date)}
                  </td>
                  <td style={{padding:'12px'}}>
                    <strong>{t.description}</strong> <br/>
                    
                    {/* TAMPILAN LEBIH AMAN: Jika kategori hilang/hantu, tulis "Tanpa Kategori" */}
                    <small style={{color:'#888', background: '#eee', padding: '2px 6px', borderRadius: '4px'}}>
                      {categoryName ? categoryName : 'Tanpa Kategori'}
                    </small>
                  </td>
                  <td style={{padding:'12px', color: t.type === 'income' ? '#27ae60' : '#c0392b', fontWeight: 'bold'}}>
                    {t.type === 'income' ? '+' : '-'} Rp {(t.amount || 0).toLocaleString()}
                  </td>
                  <td style={{padding:'12px', textAlign: 'center'}}>
                    <button onClick={() => onDelete(t.id)} style={styles.btnDel}>Hapus</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// KATEGORI
// ==========================================
const CategoriesPage = ({ categories, onAddCat, onDeleteCat }) => {
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState('expense');

  return (
    <div style={styles.page}>
      <h3 style={styles.sectionTitle}>Kelola Kategori & Dompet</h3>
      <div style={{...styles.formCard, display: 'flex', gap: '10px', maxWidth: '700px'}}>
        <input placeholder="Nama Kategori Baru..." value={newCatName} onChange={e => setNewCatName(e.target.value)} style={styles.input}/>
        <select value={newCatType} onChange={e => setNewCatType(e.target.value)} style={styles.inputSelect}>
          <option value="expense">Pengeluaran (Gaya Hidup)</option>
          <option value="savings">Tabungan (Investasi/Simpanan)</option>
          <option value="income">Pemasukan (Gaji/Bonus)</option>
        </select>
        <button onClick={() => {onAddCat(newCatName, newCatType); setNewCatName('');}} style={styles.btnSimpan}>Tambah</button>
      </div>

      <div style={styles.catGrid}>
        {categories.map(c => (
          <div key={c.id} style={{...styles.catCard, borderLeft: c.type === 'savings' ? '4px solid #2ecc71' : (c.type === 'income' ? '4px solid #3498db' : '4px solid #e74c3c')}}>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <div><strong>{c.name}</strong><br/><small>{c.type}</small></div>
              <button onClick={() => onDeleteCat(c.id)} style={styles.btnDel}>X</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ==========================================
// ROOT APP
// ==========================================
function App() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({});

  const fetchData = async () => {
    try {
      const [resT, resC, resS, resB] = await Promise.all([
        axios.get('http://localhost:3001/api/transactions'), 
        axios.get('http://localhost:3001/api/categories'),
        axios.get('http://localhost:3001/api/summary'), 
        axios.get('http://localhost:3001/api/budgets').catch(()=>({data:[]}))
      ]);
      setTransactions(resT.data); setCategories(resC.data); setSummary(resS.data); setBudgets(resB.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveBudget = async (catId, amount) => {
    if(!catId || !amount) return alert("Pilih kategori dan isi nominal!");
    await axios.post('http://localhost:3001/api/budgets', { category_id: parseInt(catId), amount: parseFloat(amount) });
    fetchData();
  };

  const handleDeleteBudget = async (catId) => {
    await axios.delete(`http://localhost:3001/api/budgets/${catId}`);
    fetchData();
  };

  const handleSaveTrans = async (desc, amount, catId) => {
    const category = categories.find(c => c.id === parseInt(catId));
    await axios.post('http://localhost:3001/api/transactions', {
      description: desc, amount: parseFloat(amount), type: category ? category.type : 'expense', category_id: parseInt(catId)
    });
    fetchData(); 
  };

  const handleDeleteTrans = async (id) => { await axios.delete(`http://localhost:3001/api/transactions/${id}`); fetchData(); };
  const handleAddCat = async (name, type) => { await axios.post('http://localhost:3001/api/categories', { name, type }); fetchData(); };
  const handleDeleteCat = async (id) => { await axios.delete(`http://localhost:3001/api/categories/${id}`); fetchData(); };

  return (
    <Router>
      <div style={styles.body}>
        <Navbar />
        <div style={styles.mainContainer}>
          <Routes>
            <Route path="/" element={<Dashboard summary={summary} />} />
            <Route path="/allocation" element={<AllocationPage categories={categories} budgets={budgets} transactions={transactions} summary={summary} onSaveBudget={handleSaveBudget} onDeleteBudget={handleDeleteBudget} />} />
            <Route path="/transactions" element={<Transactions transactions={transactions} categories={categories} budgets={budgets} onSave={handleSaveTrans} onDelete={handleDeleteTrans} />} />
            <Route path="/categories" element={<CategoriesPage categories={categories} onAddCat={handleAddCat} onDeleteCat={handleDeleteCat} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

// ==========================================
// STYLES
// ==========================================
const styles = {
  body: { background: '#f5f7f9', minHeight: '100vh', fontFamily: "'Poppins', sans-serif", paddingBottom: '50px' },
  nav: { background: '#fff', padding: '15px 50px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', position: 'sticky', top: 0, zIndex: 100 },
  navContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: 'auto' },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoText: { color: '#333', margin: 0, fontSize: '22px', fontWeight: '700' },
  navLinks: { display: 'flex', gap: '15px' },
  link: { color: '#666', textDecoration: 'none', fontWeight: '500', padding: '8px 15px', borderRadius: '20px' },
  activeLink: { color: '#1976d2', textDecoration: 'none', fontWeight: '600', padding: '8px 15px', background: '#e3f2fd', borderRadius: '20px' },
  mainContainer: { maxWidth: '1100px', margin: '30px auto', padding: '0 20px' },
  page: { padding: '20px 0' },
  sectionTitle: { color: '#444', marginBottom: '20px', fontWeight: '600' },
  cardContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px', marginBottom: '30px' },
  card: { padding: '30px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' },
  cardLabel: { fontSize: '15px', fontWeight: '600', color: '#555', marginBottom: '10px' },
  cardValue: { fontSize: '32px', fontWeight: '800', marginBottom: '5px' },
  formCard: { background: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', marginBottom: '30px', border: '1px solid #eee' },
  inputGroup: { display: 'flex', gap: '15px', flexWrap: 'wrap' },
  input: { padding: '12px 18px', borderRadius: '10px', border: '1px solid #ddd', flex: '2', minWidth: '200px' },
  inputNominal: { padding: '12px 18px', borderRadius: '10px', border: '1px solid #ddd', flex: '1', minWidth: '150px' },
  inputSelect: { padding: '12px 18px', borderRadius: '10px', border: '1px solid #ddd', background: '#fff', flex: '1' },
  btnSimpan: { padding: '12px 30px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600' },
  tableWrapper: { background: '#fff', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '15px' },
  tableRow: { borderBottom: '1px solid #f0f0f0' },
  btnEdit: { padding: '6px 12px', background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', flex: 1 },
  btnDel: { padding: '6px 12px', background: '#fff', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', flex: 1 },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  catCard: { background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
};

export default App;