import React from 'react';
import { NavLink } from 'react-router-dom';
import { styles } from '../styles/appStyles';

export const Navbar = ({ currentUser, onLogout }) => {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <nav style={styles.nav}>
      <div style={styles.navContent}>
        <div style={styles.logoGroup}>
          <span style={styles.logoIcon}>MF</span>
          <div>
            <h1 style={styles.logoText}>MyMoney {isAdmin && '(Admin)'}</h1>
            <p style={styles.logoTagline}>Personal finance cockpit</p>
          </div>
        </div>
        <div style={styles.navLinks}>
          {!isAdmin ? (
            <>
              <NavLink to="/" style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>Dashboard</NavLink>
              <NavLink to="/allocation" style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>Atur Dana</NavLink>
              <NavLink to="/transactions" style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>Transaksi</NavLink>
              <NavLink to="/categories" style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>Kategori</NavLink>
              <NavLink to="/gamification" style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>Lencana</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/" style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>Dashboard Admin</NavLink>
              <NavLink to="/admin/users" style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>Kelola User</NavLink>
              <NavLink to="/admin/milestones" style={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>Kelola Lencana</NavLink>
            </>
          )}
        </div>
        <div style={styles.userPanel}>
          <div style={styles.userBadge}>
            <span style={styles.userBadgeEyebrow}>Role</span>
            <strong style={styles.userBadgeName}>{currentUser?.role || 'user'}</strong>
            <small style={styles.userBadgeMeta}>{currentUser?.email || '-'}</small>
          </div>
          <button onClick={onLogout} style={styles.logoutBtn}>Keluar</button>
        </div>
      </div>
    </nav>
  );
};
