export const sharedStyles = {
  formCard: {
    background: 'rgba(255, 251, 246, 0.82)',
    padding: '24px',
    borderRadius: '24px',
    boxShadow: '0 18px 40px rgba(74, 48, 28, 0.08)',
    marginBottom: '26px',
    border: '1px solid rgba(111, 78, 55, 0.14)'
  },
  formTitle: { marginTop: 0, marginBottom: '14px', color: '#2f241d' },
  inputGroup: { display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'stretch' },
  fieldShellWrap: { minWidth: '180px', display: 'flex', flexDirection: 'column', gap: '8px' },
  fieldLabelRow: { display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '4px' },
  fieldIcon: {
    width: '24px',
    height: '24px',
    borderRadius: '8px',
    display: 'grid',
    placeItems: 'center',
    fontSize: '12px',
    fontWeight: '800',
    color: '#0f766e',
    background: 'rgba(15, 118, 110, 0.1)'
  },
  fieldLabel: {
    fontSize: '12px',
    fontWeight: '800',
    color: '#5c5048',
    textTransform: 'uppercase',
    letterSpacing: '0.08em'
  },
  fieldHint: { color: '#85756a', paddingLeft: '4px', lineHeight: 1.5 },
  input: {
    padding: '14px 18px',
    borderRadius: '18px',
    border: '1px solid rgba(111, 78, 55, 0.16)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flex: '2',
    minWidth: '200px',
    color: '#2f241d',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.78), 0 10px 24px rgba(74, 48, 28, 0.06)'
  },
  inputNominal: {
    padding: '14px 18px',
    borderRadius: '18px',
    border: '1px solid rgba(111, 78, 55, 0.16)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flex: '1',
    minWidth: '150px',
    color: '#2f241d',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.78), 0 10px 24px rgba(74, 48, 28, 0.06)'
  },
  inputSelect: {
    padding: '14px 44px 14px 18px',
    borderRadius: '18px',
    border: '1px solid rgba(111, 78, 55, 0.16)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flex: '1',
    color: '#2f241d',
    minWidth: '160px',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.78), 0 10px 24px rgba(74, 48, 28, 0.06)',
    appearance: 'none'
  },
  btnSimpan: {
    padding: '14px 24px',
    background: 'linear-gradient(145deg, #0f766e, #0b4f4a)',
    color: '#fffaf2',
    border: 'none',
    borderRadius: '18px',
    cursor: 'pointer',
    fontWeight: '700',
    letterSpacing: '0.02em',
    boxShadow: '0 18px 30px rgba(15, 118, 110, 0.24), inset 0 1px 0 rgba(255,255,255,0.16)',
    minWidth: '190px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonTextWrap: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.15 },
  buttonSubtitle: { marginTop: '4px', color: 'rgba(255, 250, 242, 0.72)', fontSize: '11px', fontWeight: '500' },
  tableWrapper: {
    background: 'rgba(255, 251, 246, 0.86)',
    borderRadius: '24px',
    border: '1px solid rgba(111, 78, 55, 0.14)',
    overflow: 'hidden',
    boxShadow: '0 18px 40px rgba(74, 48, 28, 0.08)'
  },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '15px' },
  tableRow: { borderBottom: '1px solid rgba(111, 78, 55, 0.1)' },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '18px' },
  catCard: {
    background: 'rgba(255,255,255,0.72)',
    padding: '20px',
    borderRadius: '20px',
    boxShadow: '0 12px 28px rgba(74, 48, 28, 0.08)',
    border: '1px solid rgba(111, 78, 55, 0.1)'
  }
};
