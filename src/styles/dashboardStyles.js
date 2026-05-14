export const dashboardStyles = {
  heroPanel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    gap: '24px',
    padding: '28px',
    borderRadius: '30px',
    background: 'linear-gradient(135deg, rgba(15, 118, 110, 0.12), rgba(193, 124, 46, 0.16) 62%, rgba(255, 255, 255, 0.4))',
    border: '1px solid rgba(111, 78, 55, 0.12)',
    boxShadow: '0 30px 70px rgba(74, 48, 28, 0.12)',
    marginBottom: '26px',
    flexWrap: 'wrap'
  },
  eyebrow: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.16em',
    color: '#0f766e',
    fontWeight: '800',
    marginBottom: '10px'
  },
  heroTitle: {
    margin: 0,
    fontSize: 'clamp(28px, 4vw, 42px)',
    lineHeight: 1.05,
    letterSpacing: '-0.04em',
    maxWidth: '680px'
  },
  heroDescription: {
    margin: '14px 0 0',
    maxWidth: '620px',
    color: '#66574d',
    fontSize: '15px',
    lineHeight: 1.7
  },
  heroBadge: {
    minWidth: '220px',
    padding: '20px 22px',
    borderRadius: '24px',
    background: 'rgba(255, 252, 247, 0.9)',
    border: '1px solid rgba(111, 78, 55, 0.12)',
    alignSelf: 'center'
  },
  heroBadgeLabel: {
    display: 'block',
    fontSize: '12px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: '#746459',
    marginBottom: '10px'
  },
  heroBadgeValue: { fontSize: '28px', color: '#0b4f4a' },
  guidePanel: {
    background: 'rgba(255, 251, 246, 0.82)',
    padding: '24px',
    borderRadius: '24px',
    border: '1px solid rgba(111, 78, 55, 0.14)',
    marginBottom: '26px',
    boxShadow: '0 18px 40px rgba(74, 48, 28, 0.08)'
  },
  guideHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '20px',
    flexWrap: 'wrap',
    marginBottom: '18px'
  },
  guideTitle: {
    margin: '8px 0 0',
    color: '#2f241d',
    fontSize: '28px',
    letterSpacing: '-0.04em',
    maxWidth: '640px'
  },
  guideDescription: {
    margin: 0,
    color: '#6f6259',
    lineHeight: 1.7,
    maxWidth: '320px'
  },
  guideGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px'
  },
  guideCard: {
    padding: '18px',
    borderRadius: '22px',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(245, 250, 248, 0.88))',
    border: '1px solid rgba(111, 78, 55, 0.1)',
    boxShadow: '0 12px 24px rgba(74, 48, 28, 0.06)',
    display: 'grid',
    gap: '10px'
  },
  guideStepBadge: {
    width: '34px',
    height: '34px',
    borderRadius: '12px',
    display: 'grid',
    placeItems: 'center',
    background: 'rgba(15, 118, 110, 0.12)',
    color: '#0f766e',
    fontWeight: '800'
  },
  guideCardTitle: {
    color: '#2f241d',
    fontSize: '16px'
  },
  guideCardText: {
    margin: 0,
    color: '#6f6259',
    lineHeight: 1.7
  },
  warningBanner: {
    background: 'linear-gradient(135deg, rgba(193, 124, 46, 0.18), rgba(255, 243, 222, 0.9))',
    borderLeft: '6px solid #c17c2e',
    padding: '18px 22px',
    borderRadius: '22px',
    marginBottom: '22px',
    boxShadow: '0 16px 40px rgba(193, 124, 46, 0.12)'
  },
  bannerTitle: { margin: '0 0 6px 0', color: '#6d4518' },
  bannerText: { margin: 0, fontSize: '14px', color: '#5e4c3f', lineHeight: 1.7 },
  secondaryPanel: {
    background: 'rgba(255, 251, 246, 0.82)',
    padding: '24px',
    borderRadius: '24px',
    border: '1px solid rgba(111, 78, 55, 0.14)',
    marginBottom: '26px',
    boxShadow: '0 18px 40px rgba(74, 48, 28, 0.08)'
  },
  secondaryTitle: { margin: 0, color: '#625249' },
  secondaryValue: { margin: '10px 0 0', color: '#2f241d', fontSize: '34px' },
  secondaryInset: {
    background: 'rgba(255, 255, 255, 0.7)',
    padding: '14px 16px',
    borderRadius: '16px',
    marginTop: '14px',
    fontSize: '13px',
    color: '#5f534b',
    border: '1px solid rgba(111, 78, 55, 0.08)'
  },
  sectionTitle: { color: '#3a2e26', marginBottom: '18px', fontWeight: '800', letterSpacing: '-0.02em' },
  summaryPanel: {
    background: 'rgba(255, 251, 246, 0.82)',
    padding: '24px',
    borderRadius: '24px',
    border: '1px solid rgba(111, 78, 55, 0.14)',
    marginBottom: '26px',
    boxShadow: '0 18px 40px rgba(74, 48, 28, 0.08)'
  },
  summaryHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    borderBottom: '1px solid rgba(111, 78, 55, 0.12)',
    paddingBottom: '16px',
    marginBottom: '16px',
    flexWrap: 'wrap'
  },
  mutedHeading: { margin: 0, color: '#746459' },
  summaryBigValue: { margin: '8px 0 0', color: '#0b4f4a', fontSize: '40px', letterSpacing: '-0.05em' },
  summaryMetrics: { textAlign: 'right' },
  metricLine: { margin: '0 0 6px 0', fontSize: '14px', color: '#5f534b' },
  warningInline: { color: '#9a5d18', fontWeight: '800', margin: 0 },
  cardContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px', marginBottom: '30px' },
  card: {
    padding: '28px',
    borderRadius: '28px',
    boxShadow: '0 24px 50px rgba(74, 48, 28, 0.12)',
    color: '#fffaf2',
    position: 'relative',
    overflow: 'hidden'
  },
  primaryCard: { background: 'linear-gradient(145deg, #0f766e, #0b4f4a)' },
  secondaryCard: { background: 'linear-gradient(145deg, #2f855a, #1f5f42)' },
  cardLabel: { fontSize: '13px', fontWeight: '800', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.86, marginBottom: '12px' },
  cardValue: { fontSize: '34px', fontWeight: '800', marginBottom: '8px', letterSpacing: '-0.04em' },
  cardNote: { color: 'rgba(255, 250, 242, 0.78)', lineHeight: 1.6 }
};
