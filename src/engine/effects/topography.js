function flatten(context){
    // console.log("topo", "tile: " +  context.tile.row + ',' +context.tile.col)
    return 1
}

export default {
    elevation: [{target: 'resources', property: 'electricity', delta: 1}],
    slopeDeg: [{target: 'resources', property: 'electricity', delta: flatten}],
    aspectDeg: [{target: 'resources', property: 'electricity', delta: 1}],
    waterTable: [{target: 'resources', property: 'electricity', delta: 1}],
    drainageIndex:[{target: 'resources', property: 'electricity', delta: 1}],
}