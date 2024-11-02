import React from 'react';
import styles from '../styles/HandTiles.module.css';
import Tile from "./Tile.tsx"

const HandTiles = () => {
  return (
    <div className={styles.handTiles}>
      <Tile value="二萬" />
      <Tile value="六萬" />
      <Tile value="九萬" />
      {/* Continue with other tiles */}
    </div>
  );
};

export default HandTiles;