export const parseTransactionDate = (transaction) => {
  if (transaction?.timestamp) {
    const byTimestamp = new Date(transaction.timestamp);
    if (!Number.isNaN(byTimestamp.getTime())) {
      return byTimestamp;
    }
  }

  if (typeof transaction?.date === 'string') {
    const parts = transaction.date.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      const byParts = new Date(year, month - 1, day);
      if (!Number.isNaN(byParts.getTime())) {
        return byParts;
      }
    }
  }

  return null;
};

export const toInputDateValue = (date) => {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatMonthLabel = (monthValue) => {
  if (!monthValue) return '-';
  const [year, month] = monthValue.split('-');
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
};

export const renderCurrency = (value) => `Rp ${(value || 0).toLocaleString()}`;
