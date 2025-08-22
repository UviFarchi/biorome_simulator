import { processTile } from '@/engine/steps/applyEffects.js';

self.onmessage = e => {
    const tiles = e.data // 2D array of tile rows
    for (let r = 0; r < tiles.length; r++) {
        const row = tiles[r]
        for (let c = 0; c < row.length; c++) {
            processTile(row[c])
        }
    }
    self.postMessage(tiles)
}


