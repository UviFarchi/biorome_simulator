import {defineStore} from 'pinia'
import {ref} from 'vue'

export const animal = defineStore('animalStore', () => {


    const products = ref({
        milk: {icon: '🥛', label: 'Milk', basePrice: 3, shelfLife: 2},
        goat_milk: {icon: '🥛', label: 'Goat milk', basePrice: 4, shelfLife: 2},
        eggs: {icon: '🥚', label: 'Eggs', basePrice: 2, shelfLife: 3},
        duck_eggs: {icon: '🥚', label: 'Duck eggs', basePrice: 3, shelfLife: 3},
        honey: {icon: '🍯', label: 'Honey', basePrice: 5, shelfLife: 1000},
        wool: {icon: '🧶', label: 'Wool', basePrice: 7, shelfLife: 1000},
    })


    const animalTypes = ref([
        {
            type: 'cow',
            icon: '🐄',
            food: ['grass', 'clover', 'corn', 'animal_feed'],
            foodConsumption: 3,
            waterConsumption: 4,
            health: 100,
            growthStages: ['calf', 'heifer', 'adult', 'old'],
            daysPerGrowthStage: [365, 365, 1825, 730],
            pricesPerStage: [200, 600, 1200, 600],
            yieldPerStage: [0, 0, 50, 20],
            product: 'milk',
            outputFrequency: 1,
            wastePerTurn: 2,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { target: 'soil', property: 'fertility', delta: 2, description: 'Cow manure increases soil fertility' },
                { target: 'plant', property: 'trampling', delta: -1, description: 'Cows damage tender crops by stepping on them' }
            ]
        },
        {
            type: 'goat',
            icon: '🐐',
            food: ['grass', 'lettuce', 'corn', 'animal_feed'],
            foodConsumption: 2,
            waterConsumption: 3,
            health: 100,
            growthStages: ['kid', 'yearling', 'adult', 'old'],
            daysPerGrowthStage: [180, 185, 1095, 730],
            pricesPerStage: [80, 150, 400, 150],
            yieldPerStage: [0, 0, 15, 6],
            product: 'goat_milk',
            outputFrequency: 1,
            wastePerTurn: 2,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { target: 'soil', property: 'fertility', delta: 1, description: 'Goat manure increases soil fertility' },
                { target: 'plant', property: 'browse', delta: -1, description: 'Goats overgraze and damage shrubs/vines' }
            ]
        },
        {
            type: 'sheep',
            icon: '🐑',
            food: ['grass', 'clover', 'animal_feed'],
            foodConsumption: 2,
            waterConsumption: 3,
            health: 100,
            growthStages: ['lamb', 'yearling', 'adult', 'old'],
            daysPerGrowthStage: [150, 215, 1460, 730],
            pricesPerStage: [60, 120, 250, 80],
            yieldPerStage: [0, 0, 400, 150],
            product: 'wool',
            outputFrequency: 180,
            wastePerTurn: 2,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { target: 'soil', property: 'fertility', delta: 1, description: 'Sheep manure improves fertility' },
                { target: 'plant', property: 'grazing', delta: -1, description: 'Sheep reduce pasture growth when overstocked' }
            ]
        },
        {
            type: 'pig',
            icon: '🐖',
            food: ['corn', 'carrot', 'pumpkin', 'animal_feed'],
            foodConsumption: 2,
            waterConsumption: 2,
            health: 100,
            growthStages: ['piglet', 'grower', 'finisher', 'old'],
            daysPerGrowthStage: [120, 150, 545, 365],
            pricesPerStage: [50, 120, 220, 70],
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 3,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { target: 'soil', property: 'fertility', delta: 2, description: 'Pig manure enriches soil fertility' },
                { target: 'soil', property: 'compaction', delta: 1, description: 'Pigs rooting increases soil disturbance' }
            ]
        },
        {
            type: 'chicken',
            icon: '🐔',
            food: ['seeds', 'corn', 'grass', 'animal_feed'],
            foodConsumption: 1,
            waterConsumption: 1,
            health: 100,
            growthStages: ['chick', 'pullet', 'adult', 'old'],
            daysPerGrowthStage: [60, 120, 730, 365],
            pricesPerStage: [10, 20, 60, 20],
            yieldPerStage: [0, 0.5, 7, 3],
            product: 'eggs',
            outputFrequency: 1,
            wastePerTurn: 1,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { target: 'soil', property: 'fertility', delta: 1, description: 'Chicken manure boosts soil fertility' },
                { target: 'pest', property: 'pest_control', delta: -1, description: 'Chickens reduce insect pests' }
            ]
        },
        {
            type: 'duck',
            icon: '🦆',
            food: ['seeds', 'grass', 'animal_feed'],
            foodConsumption: 1,
            waterConsumption: 2,
            health: 100,
            growthStages: ['duckling', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [40, 70, 730, 365],
            pricesPerStage: [12, 25, 65, 20],
            yieldPerStage: [0, 0.5, 5, 2],
            product: 'duck_eggs',
            outputFrequency: 1,
            wastePerTurn: 1,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { target: 'pest', property: 'pest_control', delta: -1, description: 'Ducks eat pests and larvae' },
                { target: 'soil', property: 'weed_suppression', delta: 1, description: 'Ducks forage weeds in rice paddies' }
            ]
        },
        {
            type: 'bee',
            icon: '🐝',
            food: ['flowers', 'clover', 'lavender', 'sunflower'],
            foodConsumption: 0.5,
            waterConsumption: 0.5,
            health: 100,
            growthStages: ['colony', 'established', 'productive', 'old'],
            daysPerGrowthStage: [30, 60, 1460, 730],
            pricesPerStage: [90, 150, 450, 120],
            yieldPerStage: [0, 0, 240, 60],
            product: 'honey',
            outputFrequency: 120,
            wastePerTurn: 0,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { target: 'plant', property: 'pollination', delta: 2, description: 'Bees increase pollination and yield' }
            ]
        },
        {
            type: 'rabbit',
            icon: '🐇',
            food: ['grass', 'carrot', 'lettuce', 'clover', 'animal_feed'],
            foodConsumption: 1,
            waterConsumption: 1,
            health: 100,
            growthStages: ['kit', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [45, 45, 365, 180],
            pricesPerStage: [5, 10, 20, 7],
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 1,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { target: 'soil', property: 'compaction', delta: -1, description: 'Rabbits loosen soil through burrowing' },
                { target: 'soil', property: 'weed_suppression', delta: 1, description: 'Rabbits eat weeds' }
            ]
        },
        {
            type: 'horse',
            icon: '🐎',
            food: ['grass', 'oats', 'animal_feed'],
            foodConsumption: 3,
            waterConsumption: 4,
            health: 100,
            growthStages: ['foal', 'yearling', 'adult', 'old'],
            daysPerGrowthStage: [365, 365, 1825, 730],
            pricesPerStage: [300, 700, 2000, 800],
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 3,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { target: 'defense', property: 'predator_deterrence', delta: 1, description: 'Horses deter some predators' },
                { target: 'soil', property: 'fertility', delta: 1, description: 'Horse manure enriches soil' }
            ]
        },
        {
            type: 'donkey',
            icon: '🫏',
            food: ['grass', 'oats', 'animal_feed'],
            foodConsumption: 2,
            waterConsumption: 3,
            health: 100,
            growthStages: ['foal', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [365, 365, 1460, 730],
            pricesPerStage: [120, 300, 700, 250],
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 2,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { target: 'defense', property: 'predator_deterrence', delta: 2, description: 'Donkeys defend herd animals' },
                { target: 'soil', property: 'fertility', delta: 1, description: 'Donkey manure enriches soil' }
            ]
        },
        {
            type: 'ladybug',
            icon: '🐞',
            food: ['clover'],
            foodConsumption: 0,
            waterConsumption: 0.1,
            health: 100,
            growthStages: ['larva', 'pupa', 'adult', 'old'],
            daysPerGrowthStage: [10, 5, 60, 30],
            pricesPerStage: [1, 2, 5, 1],
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 0,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { target: 'pest', property: 'pest_control', delta: -3, description: 'Ladybugs eat aphids and soft-bodied pests' }
            ]
        },
        {
            type: 'dog',
            icon: '🐕',
            food: ['animal_feed'],
            foodConsumption: 1,
            waterConsumption: 1,
            health: 100,
            growthStages: ['puppy', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [180, 185, 2190, 730],
            pricesPerStage: [80, 200, 400, 150],
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 1,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { target: 'defense', property: 'predator_deterrence', delta: 2, description: 'Dogs guard against predators and thieves' }
            ]
        },
        {
            type: 'fish_tilapia',
            icon: '🐟',
            food: ['algae', 'plankton'],
            foodConsumption: 1,
            waterConsumption: 0,
            health: 100,
            growthStages: ['fingerling', 'juvenile', 'adult'],
            daysPerGrowthStage: [60, 120, 365],
            pricesPerStage: [20, 40, 80],
            yieldPerStage: [0, 0, 1],
            product: 'fish',
            outputFrequency: 180,
            wastePerTurn: 1,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { target: 'water', property: 'nutrients', delta: 1, description: 'Fish waste fertilizes aquatic systems' }
            ]
        },
        {
            type: 'fish_trout',
            icon: '🐠',
            food: ['insects', 'small_fish'],
            foodConsumption: 1,
            waterConsumption: 0,
            health: 100,
            growthStages: ['fry', 'juvenile', 'adult'],
            daysPerGrowthStage: [90, 180, 365],
            pricesPerStage: [30, 60, 100],
            yieldPerStage: [0, 0, 1],
            product: 'fish',
            outputFrequency: 365,
            wastePerTurn: 1,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { target: 'water', property: 'nutrients', delta: 1, description: 'Fish enrich water with organic matter' },
                { target: 'pest', property: 'mosquito_control', delta: -1, description: 'Trout reduce mosquito larvae populations' }
            ]
        },
        {
            type: 'hawk',
            icon: '🦅',
            food: ['rodents', 'small_birds'],
            foodConsumption: 1,
            waterConsumption: 0.2,
            health: 100,
            growthStages: ['chick', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [90, 180, 1460, 730], // 3mo, 6mo, 4yr, 2yr
            pricesPerStage: [100, 250, 600, 200],
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 0,
            dateDeployed: '',
            growthStage: '',
            effects: [{ type: 'pest_control', strength: 3 }]
        },
        {
            type: 'snake',
            icon: '🐍',
            food: ['rodents', 'insects'],
            foodConsumption: 0.5,
            waterConsumption: 0.1,
            health: 100,
            growthStages: ['hatchling', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [60, 180, 1825, 730], // 2mo, 6mo, 5yr, 2yr
            pricesPerStage: [20, 50, 200, 50],
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 0,
            dateDeployed: '',
            growthStage: '',
            effects: [{ type: 'pest_control', strength: 2 }]
        },
        {
            type: 'earthworm',
            icon: '🪱',
            food: ['organic_matter'],
            foodConsumption: 0.2,
            waterConsumption: 0.1,
            health: 100,
            growthStages: ['juvenile', 'adult'],
            daysPerGrowthStage: [30, 365], // 1mo, 1yr
            pricesPerStage: [1, 5],
            yieldPerStage: [0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 0,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { type: 'soil_loosen', strength: 2 },
                { type: 'fertilizer', strength: 1 }
            ]
        },
        {
            type: 'dung_beetle',
            icon: '🪲',
            food: ['manure'],
            foodConsumption: 0.1,
            waterConsumption: 0.05,
            health: 100,
            growthStages: ['larva', 'pupa', 'adult'],
            daysPerGrowthStage: [15, 15, 180], // 15d, 15d, 6mo
            pricesPerStage: [1, 2, 10],
            yieldPerStage: [0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 0,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { type: 'fertilizer', strength: 2 },
                { type: 'weed_suppression', strength: 1 }
            ]
        },
        {
            type: 'frog',
            icon: '🐸',
            food: ['insects'],
            foodConsumption: 0.5,
            waterConsumption: 0.5,
            health: 100,
            growthStages: ['tadpole', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [30, 60, 365, 365], // 1mo, 2mo, 1yr, 1yr
            pricesPerStage: [5, 10, 25, 10],
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 0,
            dateDeployed: '',
            growthStage: '',
            effects: [{ type: 'pest_control', strength: 2 }]
        },
        {
            type: 'shrimp',
            icon: '🦐',
            food: ['detritus', 'algae'],
            foodConsumption: 0.3,
            waterConsumption: 0.1,
            health: 100,
            growthStages: ['larva', 'juvenile', 'adult'],
            daysPerGrowthStage: [20, 40, 365], // 20d, 40d, 1yr
            pricesPerStage: [2, 5, 20],
            yieldPerStage: [0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 0,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { type: 'water_consumption', strength: -1 }, // cleans water by filtering
                { type: 'fertilizer', strength: 1 } // recycles nutrients
            ]
        },
        {
            type: 'deer',
            icon: '🦌',
            food: ['grass', 'leaves', 'fruit', 'vegetables'],
            foodConsumption: 3,
            waterConsumption: 2,
            health: 100,
            growthStages: ['fawn', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [180, 365, 2190, 730], // 6mo, 1yr, 6yr, 2yr
            pricesPerStage: [200, 400, 1000, 300],
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 2,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { type: 'weed_suppression', strength: 1 }, // grazing pressure
                { type: 'yield', strength: -2 } // damages crops
            ]
        },
        {
            type: 'wild_boar',
            icon: '🐗',
            food: ['roots', 'tubers', 'corn', 'leftovers'],
            foodConsumption: 4,
            waterConsumption: 2,
            health: 100,
            growthStages: ['piglet', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [120, 240, 2190, 730], // 4mo, 8mo, 6yr, 2yr
            pricesPerStage: [150, 300, 800, 200],
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 3,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { type: 'soil_loosen', strength: 2 }, // rooting
                { type: 'yield', strength: -3 } // destroys crops
            ]
        },
        {
            type: 'bear',
            icon: '🐻',
            food: ['honey', 'fruit', 'fish', 'livestock'],
            foodConsumption: 5,
            waterConsumption: 3,
            health: 100,
            growthStages: ['cub', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [365, 730, 3650, 1095], // 1yr, 2yr, 10yr, 3yr
            pricesPerStage: [500, 1200, 3000, 800],
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 4,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { type: 'defense', strength: 3 }, // keeps predators away
                { type: 'yield', strength: -4 } // raids crops/livestock
            ]
        },
        {
            type: 'fox',
            icon: '🦊',
            food: ['chickens', 'ducks', 'rabbits', 'rodents'],
            foodConsumption: 2,
            waterConsumption: 1,
            health: 100,
            growthStages: ['kit', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [90, 180, 1825, 730], // 3mo, 6mo, 5yr, 2yr
            pricesPerStage: [50, 120, 300, 100],
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 1,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { type: 'pest_control', strength: 1 }, // rodents down
                { type: 'yield', strength: -2 } // kills poultry
            ]
        },
        {
            type: 'raccoon',
            icon: '🦝',
            food: ['corn', 'fruit', 'eggs', 'fish'],
            foodConsumption: 2,
            waterConsumption: 1,
            health: 100,
            growthStages: ['kit', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [120, 240, 1825, 730], // 4mo, 8mo, 5yr, 2yr
            pricesPerStage: [30, 80, 200, 60],
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 1,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { type: 'yield', strength: -2 }, // steals crops/eggs
                { type: 'defense', strength: 1 } // deters small pests
            ]
        },
        {
            type: 'locust',
            icon: '🦗',
            food: ['grass', 'cereal', 'corn', 'vegetables'],
            foodConsumption: 5, // per swarm unit
            waterConsumption: 0.5,
            health: 100,
            growthStages: ['nymph', 'juvenile', 'adult', 'swarm'],
            daysPerGrowthStage: [20, 20, 30, 30], // short lifecycle
            pricesPerStage: [5, 10, 20, 5],       // basically worthless
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 1,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { type: 'yield', strength: -5 }, // devastates crops
                { type: 'soil_loosen', strength: 0 } // no positive impact
            ]
        },
        {
            type: 'mosquito',
            icon: '🦟',
            food: ['blood', 'nectar'],
            foodConsumption: 0.1,
            waterConsumption: 0.1, // breeding needs stagnant water
            health: 100,
            growthStages: ['larva', 'pupa', 'adult', 'swarm'],
            daysPerGrowthStage: [7, 3, 14, 14], // very fast
            pricesPerStage: [0, 0, 0, 0],       // cannot be "sold"
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 0,
            dateDeployed: '',
            growthStage: '',
            effects: [
                { type: 'health', strength: -2 }, // stresses animals & humans
                { type: 'yield', strength: -1 }   // lowers productivity
            ]
        },
        {
            type: 'butterfly',
            icon: '🦋',
            food: ['nectar', 'flowers', 'clover'],
            foodConsumption: 0.2,
            waterConsumption: 0.1,
            health: 50,
            growthStages: ['caterpillar', 'chrysalis', 'adult', 'old'],
            daysPerGrowthStage: [20, 10, 30, 10], // 20d larva, 10d pupa, 1mo adult, 10d decline
            pricesPerStage: [1, 2, 5, 1],
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 0,
            dateDeployed: '',
            growthStage: '',
            effects: [{ type: 'pollination', strength: 1 }],
            synergies: [{ target: 'flowers', strength: 1 }, { target: 'clover', strength: 1 }]
        },
        {
            type: 'owl',
            icon: '🦉',
            food: ['rodents', 'small_birds', 'insects'],
            foodConsumption: 1,
            waterConsumption: 0.5,
            health: 100,
            growthStages: ['chick', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [60, 365, 2190, 730], // 2mo, 1yr, 6yr, 2yr
            pricesPerStage: [50, 120, 300, 100],
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 1,
            dateDeployed: '',
            growthStage: '',
            effects: [{ type: 'pest_control', strength: 2 }, { type: 'defense', strength: 1 }],
            synergies: [{ target: 'grain', strength: 1 }, { target: 'storage', strength: 1 }]
        },
        {
            type: 'cat',
            icon: '🐈',
            food: ['rodents', 'animal_feed'],
            foodConsumption: 1,
            waterConsumption: 1,
            health: 100,
            growthStages: ['kitten', 'juvenile', 'adult', 'old'],
            daysPerGrowthStage: [90, 180, 2920, 730], // 3mo, 6mo, 8yr, 2yr
            pricesPerStage: [20, 50, 150, 50],
            yieldPerStage: [0, 0, 0, 0],
            product: '',
            outputFrequency: 0,
            wastePerTurn: 1,
            dateDeployed: '',
            growthStage: '',
            effects: [{ type: 'defense', strength: 1 }, { type: 'pest_control', strength: 1 }],
            synergies: [{ target: 'grain', strength: 1 }, { target: 'storage', strength: 1 }]
        }
    ])



    return {animalTypes, products}
})
