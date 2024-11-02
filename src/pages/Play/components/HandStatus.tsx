import React from 'react';
import styles from '../styles/HandStatus.module.css';

const HandStatus = () => {
  return (
    <div className={styles.handStatus}>
      <div className={styles.statusText}>
        向聴数
      </div>
      <div className={styles.details}>
        メンツ手: テンパイ<br />
        七対子: 3シャンテン
      </div>
    </div>
  );
};

export default HandStatus;
