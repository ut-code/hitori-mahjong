import React from 'react';
import styles from '../styles/Tile.module.css';

const Tile = ({ value }) => {
  return <div className={styles.tile}>{value}</div>;
};

export default Tile;
