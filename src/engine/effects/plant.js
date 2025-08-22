function calculateMycorrhizalGrowth(context) {
    //console.log("plants", "tile: " +  context.tile.row + ',' +context.tile.col)
    return 2;
}

export default {
    grass: [{target: 'soil', property: 'mycorrhizalColonization', delta: calculateMycorrhizalGrowth},],

    corn:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    tomato:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: calculateMycorrhizalGrowth},],

    lettuce:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    carrot:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    oats:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    barley:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    wheat:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    strawberry:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    blueberry:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    coffee:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    rice:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    lotus:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    water_spinach:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    duckweed:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    water_hyacinth:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    barnyard_grass:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    pumpkin:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    lavender:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    clover:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    sunflower:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    almond_tree:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    orange_tree:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    apple_tree:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    oak_tree:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    poplar:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    pear_tree:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    lemon_tree:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],

    willow:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},],


    grape_vine:
        [{target: 'soil', property: 'mycorrhizalColonization', delta: 2},]

}
