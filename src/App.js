import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AllocationPage } from './pages/AllocationPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { GamificationPage } from './pages/GamificationPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { UserManagementPage } from './pages/admin/UserManagementPage';
import { UserDetailPage } from './pages/admin/UserDetailPage';
import { MilestoneManagementPage } from './pages/admin/MilestoneManagementPage';
import { api } from './services/api';
import { clearStoredAuth, getStoredAuth, persistAuth } from './services/authStorage';
import { styles } from './styles/appStyles';

function App() {
  const [auth, setAuth] = useState(() => getStoredAuth());
  const [authReady, setAuthReady] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerMessage, setRegisterMessage] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [summary, setSummary] = useState({});

  const getErrorMessage = (err, fallback) => err?.response?.data?.error || fallback;

  useEffect(() => {
    setAuthReady(true);
  }, []);

  useEffect(() => {
    if (auth?.token) {
      api.defaults.headers.common.Authorization = `Bearer ${auth.token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [auth]);

  const fetchData = async () => {
    try {
      const [resT, resC, resS, resB] = await Promise.all([
        api.get('/api/transactions'),
        api.get('/api/categories'),
        api.get('/api/summary'),
        api.get('/api/budgets').catch(() => ({ data: [] }))
      ]);

      setTransactions(resT.data);
      setCategories(resC.data);
      setSummary(resS.data);
      setBudgets(resB.data);
    } catch (err) {
      if (err?.response?.status === 401) {
        clearStoredAuth();
        setAuth(null);
        setLoginError('Sesi login berakhir. Silakan masuk lagi.');
      }
      console.error(err);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchData();
    }
  }, [auth]);

  const handleLogin = async ({ email, password }) => {
    try {
      setLoginError('');
      setRegisterError('');
      setRegisterMessage('');
      const response = await api.post('/api/auth/login', { email, password });
      persistAuth(response.data);
      setAuth(response.data);
    } catch (err) {
      setLoginError(getErrorMessage(err, 'Login gagal.'));
    }
  };

  const handleRegister = async ({ name, email, password }) => {
    try {
      setRegisterError('');
      setRegisterMessage('');
      setLoginError('');
      const response = await api.post('/api/auth/register', { name, email, password });
      persistAuth(response.data);
      setAuth(response.data);
      setRegisterMessage('Register berhasil. Kamu langsung masuk sebagai user baru.');
    } catch (err) {
      setRegisterError(getErrorMessage(err, 'Register gagal.'));
    }
  };

  const handleLogout = () => {
    clearStoredAuth();
    setAuth(null);
    setTransactions([]);
    setCategories([]);
    setBudgets([]);
    setSummary({});
    window.location.href = '/';
  };

  const handleSaveBudget = async (catId, amount) => {
    if (!catId || !amount) return alert('Pilih kategori dan isi nominal!');
    try {
      await api.post('/api/budgets', { category_id: parseInt(catId, 10), amount: parseFloat(amount) });
      fetchData();
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal menyimpan alokasi.'));
    }
  };

  const handleDeleteBudget = async (catId) => {
    try {
      await api.delete(`/api/budgets/${catId}`);
      fetchData();
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal menghapus alokasi.'));
    }
  };

  const handleSaveTrans = async (desc, amount, catId, flow) => {
    const category = categories.find((item) => item.id === parseInt(catId, 10));
    try {
      await api.post('/api/transactions', {
        description: desc,
        amount: parseFloat(amount),
        type: category ? category.type : 'expense',
        flow,
        category_id: parseInt(catId, 10)
      });
      fetchData();
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal menyimpan transaksi.'));
    }
  };

  const handleEditTrans = async (id, desc, amount, catId, flow) => {
    const category = categories.find((item) => item.id === parseInt(catId, 10));
    try {
      await api.put(`/api/transactions/${id}`, {
        description: desc,
        amount: parseFloat(amount),
        type: category ? category.type : 'expense',
        flow,
        category_id: parseInt(catId, 10)
      });
      fetchData();
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal mengubah transaksi.'));
    }
  };

  const handleDeleteTrans = async (id) => {
    try {
      await api.delete(`/api/transactions/${id}`);
      fetchData();
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal menghapus transaksi.'));
    }
  };

  const handleAddCat = async (name, type) => {
    try {
      await api.post('/api/categories', { name, type });
      fetchData();
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal menambah kategori.'));
    }
  };

  const handleDeleteCat = async (id) => {
    try {
      await api.delete(`/api/categories/${id}`);
      fetchData();
    } catch (err) {
      alert(getErrorMessage(err, 'Gagal menghapus kategori.'));
    }
  };

  if (!authReady) {
    return null;
  }

  if (!auth?.token) {
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        loginError={loginError}
        registerError={registerError}
        registerMessage={registerMessage}
      />
    );
  }

  const isAdmin = auth?.user?.role === 'admin';

  return (
    <Router>
      <div style={styles.body}>
        <Navbar currentUser={auth.user} onLogout={handleLogout} />
        <div style={styles.mainContainer}>
          <Routes>
            {isAdmin ? (
              <>
                <Route path="/" element={<AdminDashboardPage />} />
                <Route path="/admin/users" element={<UserManagementPage />} />
                <Route path="/admin/users/:id" element={<UserDetailPage />} />
                <Route path="/admin/milestones" element={<MilestoneManagementPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<DashboardPage summary={summary} />} />
                <Route
                  path="/allocation"
                  element={
                    <AllocationPage
                      categories={categories}
                      budgets={budgets}
                      transactions={transactions}
                      summary={summary}
                      onSaveBudget={handleSaveBudget}
                      onDeleteBudget={handleDeleteBudget}
                    />
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <TransactionsPage
                      transactions={transactions}
                      categories={categories}
                      budgets={budgets}
                      onSave={handleSaveTrans}
                      onEdit={handleEditTrans}
                      onDelete={handleDeleteTrans}
                    />
                  }
                />
                <Route
                  path="/categories"
                  element={
                    <CategoriesPage
                      categories={categories}
                      transactions={transactions}
                      budgets={budgets}
                      onAddCat={handleAddCat}
                      onDeleteCat={handleDeleteCat}
                    />
                  }
                />
                <Route path="/gamification" element={<GamificationPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
