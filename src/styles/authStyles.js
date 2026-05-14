export const authStyles = {
  body: { minHeight: '100vh', paddingBottom: '60px' },
  authShell: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: '36px 20px'
  },
  authLayout: {
    width: '100%',
    maxWidth: '1180px',
    display: 'grid',
    gridTemplateColumns: 'minmax(320px, 1.1fr) minmax(320px, 0.9fr)',
    gap: '28px',
    alignItems: 'stretch'
  },
  authShowcase: {
    padding: '42px',
    borderRadius: '32px',
    background: 'linear-gradient(145deg, rgba(15, 118, 110, 0.94), rgba(11, 79, 74, 0.92))',
    color: '#fffaf2',
    boxShadow: '0 28px 60px rgba(15, 118, 110, 0.22)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    minHeight: '520px'
  },
  authEyebrow: {
    display: 'inline-flex',
    alignSelf: 'flex-start',
    padding: '8px 12px',
    borderRadius: '999px',
    background: 'rgba(255,250,242,0.12)',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.12em',
    textTransform: 'uppercase'
  },
  authTitle: { margin: '24px 0 12px', fontSize: '46px', lineHeight: 1.04, letterSpacing: '-0.05em' },
  authDescription: { margin: 0, color: 'rgba(255,250,242,0.84)', lineHeight: 1.8, maxWidth: '560px' },
  authFeatureList: { display: 'grid', gap: '14px', marginTop: '28px' },
  authFeatureItem: {
    padding: '16px 18px',
    borderRadius: '20px',
    background: 'rgba(255,250,242,0.1)',
    border: '1px solid rgba(255,250,242,0.12)',
    display: 'grid',
    gap: '6px'
  },
  authCard: {
    background: 'rgba(255, 251, 246, 0.92)',
    borderRadius: '32px',
    padding: '34px',
    border: '1px solid rgba(111, 78, 55, 0.14)',
    boxShadow: '0 28px 60px rgba(74, 48, 28, 0.12)',
    display: 'grid',
    gap: '22px'
  },
  authCardHeader: { display: 'grid', gap: '10px' },
  authCardBadge: {
    display: 'inline-flex',
    alignSelf: 'flex-start',
    padding: '7px 12px',
    borderRadius: '999px',
    background: 'rgba(15, 118, 110, 0.12)',
    color: '#0f766e',
    fontSize: '11px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '0.12em'
  },
  authCardTitle: { margin: 0, fontSize: '32px', color: '#2f241d', letterSpacing: '-0.04em' },
  authCardText: { margin: 0, color: '#6e6057', lineHeight: 1.7 },
  authFieldStack: { display: 'grid', gap: '16px' },
  authError: {
    padding: '14px 16px',
    borderRadius: '18px',
    background: 'rgba(184, 75, 75, 0.1)',
    border: '1px solid rgba(184, 75, 75, 0.16)',
    color: '#9f3d3d',
    fontWeight: '700'
  },
  authSuccess: {
    padding: '14px 16px',
    borderRadius: '18px',
    background: 'rgba(47, 133, 90, 0.1)',
    border: '1px solid rgba(47, 133, 90, 0.18)',
    color: '#256f4a',
    fontWeight: '700'
  },
  authFieldError: {
    color: '#b84b4b',
    paddingLeft: '4px',
    lineHeight: 1.4,
    fontWeight: '700'
  },
  authSubmitBtn: { width: '100%' },
  authSwitchBtn: {
    padding: '12px 14px',
    borderRadius: '16px',
    border: '1px solid rgba(111, 78, 55, 0.14)',
    background: 'rgba(255,255,255,0.86)',
    color: '#5f534b',
    cursor: 'pointer',
    fontWeight: '700'
  }
};
