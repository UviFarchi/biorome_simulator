function getAdjacentTiles(tile, tilesGrid) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [ 0, -1],          [ 0, 1],
        [ 1, -1], [ 1, 0], [ 1, 1],
    ]
    const adjacent = []
    for (const [deltaRow, deltaCol] of directions) {
        const row = tile.row + deltaRow
        const col = tile.col + deltaCol
        if (
            row >= 0 && row < tilesGrid.length &&
            col >= 0 && col < tilesGrid[0].length &&
            !(row === tile.row && col === tile.col)
        ) {
            adjacent.push(tilesGrid[row][col])
        }
    }
    return adjacent
}

function getImageOrIcon(){
    return true
}

export {getAdjacentTiles, getImageOrIcon}