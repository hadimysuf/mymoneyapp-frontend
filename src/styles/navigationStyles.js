export const navigationStyles = {
  nav: {
    position: 'sticky',
    top: 18,
    zIndex: 100,
    maxWidth: '1220px',
    margin: '22px auto 0',
    padding: '0 20px'
  },
  navContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '18px',
    padding: '18px 22px',
    borderRadius: '28px',
    background: 'rgba(255, 251, 246, 0.82)',
    backdropFilter: 'blur(18px)',
    border: '1px solid rgba(111, 78, 55, 0.14)',
    boxShadow: '0 18px 50px rgba(74, 48, 28, 0.12)',
    flexWrap: 'wrap'
  },
  logoGroup: { display: 'flex', alignItems: 'center', gap: '14px' },
  logoIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '16px',
    display: 'grid',
    placeItems: 'center',
    background: 'linear-gradient(135deg, #0f766e, #c17c2e)',
    color: '#fffaf2',
    fontWeight: '800',
    letterSpacing: '0.08em'
  },
  logoText: { color: '#2f241d', margin: 0, fontSize: '24px', fontWeight: '800', letterSpacing: '-0.03em' },
  logoTagline: { margin: '2px 0 0', color: '#746459', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.12em' },
  navLinks: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  userPanel: { display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' },
  userBadge: {
    display: 'grid',
    gap: '2px',
    padding: '10px 14px',
    borderRadius: '18px',
    background: 'rgba(15, 118, 110, 0.08)',
    border: '1px solid rgba(15, 118, 110, 0.12)',
    minWidth: '150px'
  },
  userBadgeEyebrow: {
    fontSize: '10px',
    fontWeight: '800',
    color: '#6f6259',
    letterSpacing: '0.12em',
    textTransform: 'uppercase'
  },
  userBadgeName: { color: '#0f766e', textTransform: 'capitalize' },
  userBadgeMeta: { color: '#746459' },
  logoutBtn: {
    padding: '11px 16px',
    borderRadius: '16px',
    border: '1px solid rgba(111, 78, 55, 0.14)',
    background: 'rgba(255,255,255,0.86)',
    color: '#5f534b',
    cursor: 'pointer',
    fontWeight: '700',
    boxShadow: '0 10px 18px rgba(74, 48, 28, 0.06)'
  },
  link: {
    color: '#5f534b',
    textDecoration: 'none',
    fontWeight: '700',
    padding: '10px 16px',
    borderRadius: '999px',
    background: 'transparent',
    border: '1px solid transparent'
  },
  activeLink: {
    color: '#0f766e',
    textDecoration: 'none',
    fontWeight: '700',
    padding: '10px 16px',
    borderRadius: '999px',
    background: 'rgba(15, 118, 110, 0.1)',
    border: '1px solid rgba(15, 118, 110, 0.18)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.45)'
  },
  mainContainer: { maxWidth: '1220px', margin: '28px auto 0', padding: '0 20px' },
  page: { padding: '12px 0 24px' }
};
