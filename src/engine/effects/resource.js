function calculateThirstDamage(context) {
    // console.log("resource", "tile: " + context.tile.row + ',' + context.tile.col)
    return -1
}

export default {
    water: [
        {target: 'animals', property: 'health', delta: calculateThirstDamage}
    ]
}