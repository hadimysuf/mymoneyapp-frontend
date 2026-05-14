import { act } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';

jest.mock('axios');
jest.mock('react-router-dom', () => {
  const React = require('react');

  return {
    BrowserRouter: ({ children }) => React.createElement(React.Fragment, null, children),
    Routes: ({ children }) => React.createElement(React.Fragment, null, children),
    Route: ({ element }) => element,
    NavLink: ({ children, to, style }) =>
      React.createElement(
        'a',
        { href: to, style: typeof style === 'function' ? style({ isActive: false }) : style },
        children
      )
  };
}, { virtual: true });

import App from './App';

function createMockResponse(url) {
  if (url.endsWith('/api/transactions')) {
    return [
      { id: 101, description: 'Setor Tabungan', amount: 200000, type: 'savings', flow: 'in', category_id: 4, month: '2026-04', date: '01/04/2026', timestamp: 101 },
      { id: 102, description: 'Belanja Makan', amount: 50000, type: 'expense', flow: 'out', category_id: 3, month: '2026-04', date: '02/04/2026', timestamp: 102 }
    ];
  }

  if (url.endsWith('/api/categories')) {
    return [
      { id: 1, name: 'Gaji', type: 'income', group: 'salary' },
      { id: 3, name: 'Makanan', type: 'expense' },
      { id: 4, name: 'Tabungan', type: 'savings' }
    ];
  }

  if (url.endsWith('/api/summary')) {
    return {
      current_month: '2026-04',
      is_end_of_month: false,
      income_salary: 5000000,
      income_other: 0,
      total_income_this_month: 5000000,
      unallocated_this_month: 5000000,
      active_balance: 5000000,
      leftover_past_month: 0,
      leftover_percentage: 0,
      unallocated_past: 0,
      unspent_past: 0,
      savings_balance: 0
    };
  }

  if (url.endsWith('/api/budgets')) {
    return [
      { id: 201, category_id: 4, amount: 300000, month: '2026-04', date: '01/04/2026', timestamp: 201 }
    ];
  }

  return [];
}

describe('App', () => {
  let container;
  let root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    window.localStorage.clear();
    axios.defaults = { headers: { common: {} } };
    axios.create.mockReturnValue(undefined);
    axios.get.mockImplementation((url) => Promise.resolve({ data: createMockResponse(`${url}`) }));
    axios.post.mockImplementation((url, body) => {
      if (url === '/api/auth/login' && body.email === 'user@mymoney.local' && body.password === 'user12345') {
        return Promise.resolve({
          data: {
            token: 'mymoney-demo-user-token',
            user: {
              id: 1,
              name: 'User MyMoney',
              email: 'user@mymoney.local',
              role: 'user'
            }
          }
        });
      }

      if (url === '/api/auth/register') {
        return Promise.resolve({
          data: {
            user: {
              id: 2,
              name: body.name,
              email: body.email,
              role: 'user'
            }
          }
        });
      }

      return Promise.reject({ response: { data: { error: 'Unauthorized' } } });
    });
    axios.put.mockResolvedValue({ data: {} });
    axios.delete.mockResolvedValue({ data: {} });
  });

  afterEach(async () => {
    await act(async () => {
      root.unmount();
    });
    container.remove();
    jest.clearAllMocks();
  });

  test('renders the finance dashboard shell with loaded data', async () => {
    window.localStorage.setItem('mymoney-auth', JSON.stringify({
      token: 'mymoney-demo-user-token',
      user: {
        id: 1,
        name: 'User MyMoney',
        email: 'user@mymoney.local',
        role: 'user'
      }
    }));

    await act(async () => {
      root.render(<App />);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(container.textContent).toContain('MyMoney');
    expect(container.textContent).toContain('Dashboard');
    expect(container.textContent).toContain('Laporan Bulan Ini');
    expect(axios.get).toHaveBeenCalledTimes(4);
  });

  test('renders transaction page controls for filters and savings mutation summary', async () => {
    window.localStorage.setItem('mymoney-auth', JSON.stringify({
      token: 'mymoney-demo-user-token',
      user: {
        id: 1,
        name: 'User MyMoney',
        email: 'user@mymoney.local',
        role: 'user'
      }
    }));

    window.history.pushState({}, '', '/transactions');

    await act(async () => {
      root.render(<App />);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(container.textContent).toContain('Transaksi');
    expect(container.textContent).toContain('Filter Transaksi');
    expect(container.textContent).toContain('Mutasi Tabungan per Kategori');
    expect(container.textContent).toContain('Statistik Mutasi Tabungan per Bulan');
    expect(container.textContent).toContain('Total Masuk');
    expect(container.textContent).toContain('Reset Filter');
    expect(container.textContent).toContain('Edit');
  });

  test('renders login page when session is missing', async () => {
    await act(async () => {
      root.render(<App />);
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(container.textContent).toContain('Login User');
    expect(container.textContent).toContain('Role: user');
    expect(container.textContent).toContain('Masuk sebagai User');
    expect(container.textContent).toContain('MyMoney membantu kamu mencatat pemasukan');
    expect(axios.get).not.toHaveBeenCalled();
  });

  test('renders register mode fields when toggled from login', async () => {
    await act(async () => {
      root.render(<App />);
      await Promise.resolve();
      await Promise.resolve();
    });

    const toggleButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent.includes('Belum punya akun? Register user')
    );

    await act(async () => {
      toggleButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      await Promise.resolve();
    });

    expect(container.textContent).toContain('Register User');
    expect(container.textContent).toContain('Konfirmasi Password');
    expect(container.textContent).toContain('Buat Akun User');
  });
});
