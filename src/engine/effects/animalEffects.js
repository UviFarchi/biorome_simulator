function feedConsumption(context) {
    const subject = context.subject
    const perStage = subject.feedPerGrowthStage?.[subject.growthStages.indexOf(context.instance.growthStage)] || 0;
    return -perStage;
}

export default {
    cow: [
        {target: 'resources', property: 'feed', delta: feedConsumption},
    ],
    goat:
        [{target: 'soil', property: 'organicCarbon', delta: +1},       ],
    sheep:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    pig:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    chicken:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    duck:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    bee:
        [{target: 'topography', property: 'slope', delta: -1},       ],
    rabbit:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    horse:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    donkey:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    ladybug:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    dog:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    tilapia:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    trout:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    hawk:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    snake:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    earthworm:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    dung_beetle:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    frog:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    shrimp:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    deer:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    wild_boar:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    bear:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    fox:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    raccoon:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    locust:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    mosquito:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    butterfly:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    owl:
        [{target: 'resources', property: 'feed', delta: -1},       ],
    cat:
        [{target: 'resources', property: 'feed', delta: -1},       ]
}
