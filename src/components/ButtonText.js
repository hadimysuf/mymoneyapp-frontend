import React from 'react';
import { styles } from '../styles/appStyles';

export const ButtonText = ({ title, subtitle }) => (
  <span style={styles.buttonTextWrap}>
    <span>{title}</span>
    {subtitle ? <small style={styles.buttonSubtitle}>{subtitle}</small> : null}
  </span>
);
