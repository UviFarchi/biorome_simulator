function getNewPH(context) {
    //console.log("assembly", "tile: " +  context.tile.row + ',' +context.tile.col)
    return -1
}


export default {
    acidify: [{target: "soil", property: "ph", delta:getNewPH}]
}