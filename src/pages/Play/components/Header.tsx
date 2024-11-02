import React from 'react';
import styles from '../styles/Header.module.css';

const Header = () => {
  return (
    <div className={styles.header}>
      <div className={styles.title}>東風戦 東一局 25000点</div>
      <div className={styles.progressBar}>
        <div className={styles.progress} style={{ width: '30%' }}></div>
      </div>
      <div className={styles.turnInfo}>15巡目</div>
    </div>
  );
};

export default Header;
