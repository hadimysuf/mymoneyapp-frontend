export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateAuthForm = ({ mode, name, email, password, confirmPassword }) => {
  const nextErrors = {};

  if (mode === 'register' && !name.trim()) {
    nextErrors.name = 'Nama wajib diisi.';
  }

  if (!email.trim()) {
    nextErrors.email = 'Email wajib diisi.';
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    nextErrors.email = 'Format email tidak valid.';
  }

  if (!password) {
    nextErrors.password = 'Password wajib diisi.';
  } else if (password.length < 8) {
    nextErrors.password = 'Password minimal 8 karakter.';
  }

  if (mode === 'register') {
    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Konfirmasi password wajib diisi.';
    } else if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Konfirmasi password harus sama.';
    }
  }

  return nextErrors;
};
