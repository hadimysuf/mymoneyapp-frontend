import React, { useState } from 'react';
import { FieldShell } from '../components/FieldShell';
import { ButtonText } from '../components/ButtonText';
import { styles } from '../styles/appStyles';
import { validateAuthForm } from '../utils/authValidation';

export const LoginPage = ({ onLogin, onRegister, loginError, registerError, registerMessage }) => {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('user@mymoney.local');
  const [password, setPassword] = useState('user12345');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const formErrors = validateAuthForm({ mode, name, email, password, confirmPassword });
  const canSubmit = Object.keys(formErrors).length === 0 && !isSubmitting;

  const markField = (field) => {
    setFieldErrors((current) => ({
      ...current,
      [field]: true
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateAuthForm({ mode, name, email, password, confirmPassword });
    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors({
        name: true,
        email: true,
        password: true,
        confirmPassword: true
      });
      return;
    }

    setIsSubmitting(true);
    if (mode === 'login') {
      await onLogin({ email, password });
    } else {
      await onRegister({ name, email, password });
    }
    setIsSubmitting(false);
  };

  return (
    <div style={styles.authShell}>
      <div style={styles.authLayout}>
        <div style={styles.authShowcase}>
          <span style={styles.authEyebrow}>Secure Access</span>
          <h1 style={styles.authTitle}>Masuk ke workspace keuangan pribadi kamu.</h1>
          <p style={styles.authDescription}>
            MyMoney membantu kamu mencatat pemasukan, mengatur dana bulanan, memantau transaksi, dan menjaga pertumbuhan tabungan dalam satu dashboard yang rapi.
          </p>
          <div style={styles.authFeatureList}>
            <div style={styles.authFeatureItem}>
              <strong>Catat arus uang</strong>
              <span>Simpan pemasukan, pengeluaran, setor tabungan, dan tarik tabungan dalam riwayat yang mudah ditelusuri.</span>
            </div>
            <div style={styles.authFeatureItem}>
              <strong>Atur dana bulanan</strong>
              <span>Bagi pendapatan ke pos pengeluaran dan tabungan supaya budget tetap disiplin dari awal bulan.</span>
            </div>
            <div style={styles.authFeatureItem}>
              <strong>Pantau kondisi keuangan</strong>
              <span>Lihat ringkasan saldo aktif, tabungan, mutasi, dan alokasi dalam satu tampilan yang lebih nyaman dibaca.</span>
            </div>
          </div>
        </div>

        <form style={styles.authCard} onSubmit={handleSubmit}>
          <div style={styles.authCardHeader}>
            <span style={styles.authCardBadge}>Role: user</span>
            <h2 style={styles.authCardTitle}>{mode === 'login' ? 'Login User' : 'Register User'}</h2>
            <p style={styles.authCardText}>
              {mode === 'login'
                ? 'Masuk untuk melanjutkan pengelolaan keuangan kamu.'
                : 'Buat akun baru untuk mulai mencatat dan mengatur keuangan pribadi.'}
            </p>
          </div>

          <div style={styles.authFieldStack}>
            {mode === 'register' && (
              <FieldShell label="Nama" icon="U" hint="Nama pemilik akun" grow={1}>
                <input
                  type="text"
                  placeholder="Nama lengkap"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onBlur={() => markField('name')}
                  style={styles.input}
                />
                {fieldErrors.name && formErrors.name ? <small style={styles.authFieldError}>{formErrors.name}</small> : null}
              </FieldShell>
            )}
            <FieldShell label="Email" icon="@" hint="Gunakan email aktif kamu" grow={1}>
              <input
                type="email"
                placeholder="user@mymoney.local"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => markField('email')}
                style={styles.input}
              />
              {fieldErrors.email && formErrors.email ? <small style={styles.authFieldError}>{formErrors.email}</small> : null}
            </FieldShell>
            <FieldShell label="Password" icon="*" hint="Minimal 8 karakter" grow={1}>
              <input
                type="password"
                placeholder="Masukkan password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onBlur={() => markField('password')}
                style={styles.input}
              />
              {fieldErrors.password && formErrors.password ? <small style={styles.authFieldError}>{formErrors.password}</small> : null}
            </FieldShell>
            {mode === 'register' && (
              <FieldShell label="Konfirmasi Password" icon="=" hint="Ulangi password yang sama" grow={1}>
                <input
                  type="password"
                  placeholder="Ulangi password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  onBlur={() => markField('confirmPassword')}
                  style={styles.input}
                />
                {fieldErrors.confirmPassword && formErrors.confirmPassword ? <small style={styles.authFieldError}>{formErrors.confirmPassword}</small> : null}
              </FieldShell>
            )}
          </div>

          {mode === 'login' && loginError ? <div style={styles.authError}>{loginError}</div> : null}
          {mode === 'register' && registerError ? <div style={styles.authError}>{registerError}</div> : null}
          {mode === 'register' && registerMessage ? <div style={styles.authSuccess}>{registerMessage}</div> : null}

          <button type="submit" disabled={!canSubmit} style={{ ...styles.btnSimpan, ...styles.authSubmitBtn, opacity: canSubmit ? 1 : 0.58 }}>
            <ButtonText
              title={
                isSubmitting
                  ? (mode === 'login' ? 'Memproses Login' : 'Memproses Register')
                  : (mode === 'login' ? 'Masuk sebagai User' : 'Buat Akun User')
              }
              subtitle={mode === 'login' ? 'Akses dashboard dan seluruh menu' : 'Simpan akun baru dengan aman'}
            />
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setFieldErrors({});
              setConfirmPassword('');
            }}
            style={styles.authSwitchBtn}
          >
            {mode === 'login' ? 'Belum punya akun? Register user' : 'Sudah punya akun? Kembali ke login'}
          </button>
        </form>
      </div>
    </div>
  );
};
