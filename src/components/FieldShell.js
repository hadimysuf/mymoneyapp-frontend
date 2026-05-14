import React from 'react';
import { styles } from '../styles/appStyles';

export const FieldShell = ({ label, icon, hint, children, grow = 1 }) => (
  <div style={{ ...styles.fieldShellWrap, flex: grow }}>
    <div style={styles.fieldLabelRow}>
      <span style={styles.fieldIcon}>{icon}</span>
      <span style={styles.fieldLabel}>{label}</span>
    </div>
    {children}
    {hint ? <small style={styles.fieldHint}>{hint}</small> : null}
  </div>
);
