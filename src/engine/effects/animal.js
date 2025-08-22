function foodConsumption(context) {
    //console.log("animal", "tile: " +  context.tile.row + ',' +context.tile.col)
    const subject = context.subject
    const stageIndex = subject.growthStages.indexOf(subject.growthStage);
    const perStage = subject.foodPerGrowthStage?.[stageIndex] ?? 0;
    return -perStage;
}

export default {
    cow: [{target: 'resources', property: 'food', delta: foodConsumption},   ],
    goat:
        [{target: 'resources', property: 'food', delta: -1},       ],
    sheep:
        [{target: 'resources', property: 'food', delta: -1},       ],
    pig:
        [{target: 'resources', property: 'food', delta: -1},       ],
    chicken:
        [{target: 'resources', property: 'food', delta: -1},       ],
    duck:
        [{target: 'resources', property: 'food', delta: -1},       ],
    bee:
        [{target: 'resources', property: 'food', delta: -1},       ],
    rabbit:
        [{target: 'resources', property: 'food', delta: -1},       ],
    horse:
        [{target: 'resources', property: 'food', delta: -1},       ],
    donkey:
        [{target: 'resources', property: 'food', delta: -1},       ],
    ladybug:
        [{target: 'resources', property: 'food', delta: -1},       ],
    dog:
        [{target: 'resources', property: 'food', delta: -1},       ],
    fish_tilapia:
        [{target: 'resources', property: 'food', delta: -1},       ],
    fish_trout:
        [{target: 'resources', property: 'food', delta: -1},       ],
    hawk:
        [{target: 'resources', property: 'food', delta: -1},       ],
    snake:
        [{target: 'resources', property: 'food', delta: -1},       ],
    earthworm:
        [{target: 'resources', property: 'food', delta: -1},       ],
    dung_beetle:
        [{target: 'resources', property: 'food', delta: -1},       ],
    frog:
        [{target: 'resources', property: 'food', delta: -1},       ],
    shrimp:
        [{target: 'resources', property: 'food', delta: -1},       ],
    deer:
        [{target: 'resources', property: 'food', delta: -1},       ],
    wild_boar:
        [{target: 'resources', property: 'food', delta: -1},       ],
    bear:
        [{target: 'resources', property: 'food', delta: -1},       ],
    fox:
        [{target: 'resources', property: 'food', delta: -1},       ],
    raccoon:
        [{target: 'resources', property: 'food', delta: -1},       ],
    locust:
        [{target: 'resources', property: 'food', delta: -1},       ],
    mosquito:
        [{target: 'resources', property: 'food', delta: -1},       ],
    butterfly:
        [{target: 'resources', property: 'food', delta: -1},       ],
    owl:
        [{target: 'resources', property: 'food', delta: -1},       ],
    cat:
        [{target: 'resources', property: 'food', delta: -1},       ]
}