import { animalTypes } from '@/dict/animalModels.js'
import { plantTypes } from '@/dict/plantModels.js'
import {gameStore} from '@/stores/game.js';
import {v4 as uuidv4} from 'uuid'

const lists = {
    animal: Object.fromEntries(animalTypes.map(s => [s.type, s])),
    plant: Object.fromEntries(plantTypes.map(s => [s.type, s]))
}
let game;
const measuredField = (unit, env = 0) => ({
    env,
    unit,
    measured: {value: null, history: [], date: null, collect: false},
    optimized: null,
})

function makeInstance(domain, type, growthStage) {
    if (!game) {
        game = gameStore()
    }

    const list = lists[domain]

    const species = list[type]


    const i = species.growthStages.indexOf(growthStage)
    const idx = i >= 0 ? i : 0

    const dateISO = game.currentDate;

    let instance = {
        id: uuidv4(),
        type: species.type,
        dateDeployed: dateISO,
        growthStage,
        health: measuredField('life', 100),
        flags: {remove: false}
    }

    if (domain === 'animal') {
        const base = species.weightPerGrowthStage?.[idx] ?? 0
        const jitter = base ? Math.round(base * ((Math.random() * 0.2) - 0.1)) : 0 // ±10%
        instance.weight = measuredField('kg', base + jitter)
        instance.flags = {move: false, limitArea: false, remove: false}
    } else if (domain === 'plant') {
        const base = species.heightPerGrowthStage?.[idx] ?? 0
        instance.height = measuredField('cm', base)
        instance.fruiting = {pollinated: measuredField('boolean', false)}
    }

    return instance
}

export {makeInstance}
