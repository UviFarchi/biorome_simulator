import {defineStore} from 'pinia'
import {ref} from 'vue'

export const animals = defineStore('animalsStore', () => {


    const products = ref({
        milk: {icon: '🥛', label: 'Milk', basePrice: 3, shelfLife: 2},
        goat_milk: {icon: '🥛', label: 'Goat milk', basePrice: 4, shelfLife: 2},
        eggs: {icon: '🥚', label: 'Eggs', basePrice: 2, shelfLife: 3},
        duck_eggs: {icon: '🥚', label: 'Duck eggs', basePrice: 3, shelfLife: 3},
        honey: {icon: '🍯', label: 'Honey', basePrice: 5, shelfLife: 1000},
        wool: {icon: '🧶', label: 'Wool', basePrice: 7, shelfLife: 1000},
    })


    const animalTypes = ref([{
        type: 'cow',
        icon: '🐄',
        food: ['grass', 'clover', 'corn', 'animal_feed'],
        foodConsumption: 3,
        waterConsumption: 4,
        health: 100,
        growthStages: ['calf', 'heifer', 'adult', 'old'],
        daysPerGrowthStage: [365, 365, 1825, 730], // 1yr, 1yr, 5yr, 2yr
        pricesPerStage: [200, 600, 1200, 600],     // €/herd at each stage (buy price)
        yieldPerStage: [0, 0, 50, 20],             // liters milk per day per hectare
        product: 'milk',
        outputFrequency: 1,
        wastePerTurn: 2,
        dateDeployed: '',
        growthStage: '',
        effects: [{type: 'fertilizer', strength: 2}],
        synergies: [{target: 'clover', strength: 1}, {target: 'grass', strength: 1}]
    }, {
        type: 'goat',
        icon: '🐐',
        food: ['grass', 'lettuce', 'corn', 'animal_feed'],
        foodConsumption: 2,
        waterConsumption: 3,
        health: 100,
        growthStages: ['kid', 'yearling', 'adult', 'old'],
        daysPerGrowthStage: [180, 185, 1095, 730], // 6mo, 6mo, 3yr, 2yr
        pricesPerStage: [80, 150, 400, 150],       // €/herd
        yieldPerStage: [0, 0, 15, 6],              // liters goat milk/day/ha
        product: 'goat_milk',
        outputFrequency: 1,
        wastePerTurn: 2,
        dateDeployed: '',
        growthStage: '',
        effects: [{type: 'fertilizer', strength: 1}],
        synergies: [{target: 'clover', strength: 1}, {target: 'grass', strength: 1}, {target: 'lavender', strength: 1}]
    }, {
        type: 'sheep',
        icon: '🐑',
        food: ['grass', 'clover', 'animal_feed'],
        foodConsumption: 2,
        waterConsumption: 3,
        health: 100,
        growthStages: ['lamb', 'yearling', 'adult', 'old'],
        daysPerGrowthStage: [150, 215, 1460, 730], // 5mo, 7mo, 4yr, 2yr
        pricesPerStage: [60, 120, 250, 80],
        yieldPerStage: [0, 0, 400, 150],             // kg wool/day/ha (annualized as daily)
        product: 'wool',
        outputFrequency: 180,
        wastePerTurn: 2,
        dateDeployed: '',
        growthStage: '',
        effects: [{type: 'fertilizer', strength: 1}],
        synergies: [{target: 'clover', strength: 1}, {target: 'grass', strength: 1}]
    }, {
        type: 'pig',
        icon: '🐖',
        food: ['corn', 'carrot', 'pumpkin', 'animal_feed'],
        foodConsumption: 2,
        waterConsumption: 2,
        health: 100,
        growthStages: ['piglet', 'grower', 'finisher', 'old'],
        daysPerGrowthStage: [120, 150, 545, 365], // 4mo, 5mo, 1.5yr, 1yr
        pricesPerStage: [50, 120, 220, 70],
        yieldPerStage: [0, 0, 0, 0],               // No regular product, set up for future
        product: '',
        outputFrequency: 0,
        wastePerTurn: 3,
        dateDeployed: '',
        growthStage: '',
        effects: [{type: 'fertilizer', strength: 2}],
        synergies: [{target: 'pumpkin', strength: 1}, {target: 'carrot', strength: 1}, {target: 'grass', strength: 1}]
    }, {
        type: 'chicken',
        icon: '🐔',
        food: ['seeds', 'corn', 'grass', 'animal_feed'],
        foodConsumption: 1,
        waterConsumption: 1,
        health: 100,
        growthStages: ['chick', 'pullet', 'adult', 'old'],
        daysPerGrowthStage: [60, 120, 730, 365], // 2mo, 4mo, 2yr, 1yr
        pricesPerStage: [10, 20, 60, 20],
        yieldPerStage: [0, 0.5, 7, 3],           // eggs/day/ha
        product: 'eggs',
        outputFrequency: 1,
        wastePerTurn: 1,
        dateDeployed: '',
        growthStage: '',
        effects: [{type: 'pest_control', strength: 1}],
        synergies: [{target: 'tomato', strength: 1}, {target: 'pumpkin', strength: 1}, {
            target: 'carrot', strength: 1
        }, {target: 'apple_tree', strength: 1}]
    }, {
        type: 'duck',
        icon: '🦆',
        food: ['seeds', 'grass', 'animal_feed'],
        foodConsumption: 1,
        waterConsumption: 2,
        health: 100,
        growthStages: ['duckling', 'juvenile', 'adult', 'old'],
        daysPerGrowthStage: [40, 70, 730, 365], // 1.5mo, 2.5mo, 2yr, 1yr
        pricesPerStage: [12, 25, 65, 20],
        yieldPerStage: [0, 0.5, 5, 2],          // eggs/day/ha
        product: 'duck_eggs',
        outputFrequency: 1,
        wastePerTurn: 1,
        dateDeployed: '',
        growthStage: '',
        effects: [{type: 'pest_control', strength: 1}, {type: 'weed_suppression', strength: 1}],
        synergies: [{target: 'rice', strength: 1}, {target: 'lettuce', strength: 1}, {target: 'clover', strength: 1}]
    }, {
        type: 'bee',
        icon: '🐝',
        food: ['flowers', 'clover', 'lavender', 'sunflower', 'animal_feed'],
        foodConsumption: 0.5,
        waterConsumption: 0.5,
        health: 100,
        growthStages: ['colony', 'established', 'productive', 'old'],
        daysPerGrowthStage: [30, 60, 1460, 730], // 1mo, 2mo, 4yr, 2yr
        pricesPerStage: [90, 150, 450, 120],
        yieldPerStage: [0, 0, 240, 60],           // kg honey/day/ha
        product: 'honey',
        outputFrequency: 120,
        wastePerTurn: 0,
        dateDeployed: '',
        growthStage: '',
        effects: [{type: 'pollination', strength: 2}],
        synergies: [{target: 'apple_tree', strength: 1}, {target: 'pear_tree', strength: 1}, {
            target: 'lavender', strength: 1
        }, {target: 'sunflower', strength: 1}, {target: 'strawberry', strength: 1}, {
            target: 'blueberry', strength: 1
        }, {target: 'grape_vine', strength: 1}, {target: 'pumpkin', strength: 1}]
    }, {
        type: 'rabbit',
        icon: '🐇',
        food: ['grass', 'carrot', 'lettuce', 'clover', 'animal_feed'],
        foodConsumption: 1,
        waterConsumption: 1,
        health: 100,
        growthStages: ['kit', 'juvenile', 'adult', 'old'],
        daysPerGrowthStage: [45, 45, 365, 180], // 1.5mo, 1.5mo, 1yr, 6mo
        pricesPerStage: [5, 10, 20, 7],
        yieldPerStage: [0, 0, 0, 0],            // No regular product for now
        product: '',
        outputFrequency: 0,
        wastePerTurn: 1,
        dateDeployed: '',
        growthStage: '',
        effects: [{type: 'soil_loosen', strength: 1}, {type: 'weed_suppression', strength: 1}],
        synergies: []
    }, {
        type: 'horse',
        icon: '🐎',
        food: ['grass', 'oats', 'animal_feed'],
        foodConsumption: 3,
        waterConsumption: 4,
        health: 100,
        growthStages: ['foal', 'yearling', 'adult', 'old'],
        daysPerGrowthStage: [365, 365, 1825, 730], // 1yr, 1yr, 5yr, 2yr
        pricesPerStage: [300, 700, 2000, 800],
        yieldPerStage: [0, 0, 0, 0],               // No regular product, only for sale/use
        product: '',
        outputFrequency: 0,
        wastePerTurn: 3,
        dateDeployed: '',
        growthStage: '',
        effects: [{type: 'defense', strength: 1}],
        synergies: [{target: 'cow', strength: 1}, {target: 'sheep', strength: 1}, {target: 'goat', strength: 1}]
    }, {
        type: 'donkey',
        icon: '🫏',
        food: ['grass', 'oats', 'animal_feed'],
        foodConsumption: 2,
        waterConsumption: 3,
        health: 100,
        growthStages: ['foal', 'juvenile', 'adult', 'old'],
        daysPerGrowthStage: [365, 365, 1460, 730], // 1yr, 1yr, 4yr, 2yr
        pricesPerStage: [120, 300, 700, 250],
        yieldPerStage: [0, 0, 0, 0],
        product: '',
        outputFrequency: 0,
        wastePerTurn: 2,
        dateDeployed: '',
        growthStage: '',
        effects: [{type: 'surprise', strength: 2}, {type: 'defense', strength: 2}, {type: 'fertilizer', strength: 1}],
        synergies: []
    }, {
        type: 'ladybug',
        icon: '🐞',
        food: ['clover', 'animal_feed'],
        foodConsumption: 0,
        waterConsumption: 0.1,
        health: 100,
        growthStages: ['larva', 'pupa', 'adult', 'old'],
        daysPerGrowthStage: [10, 5, 60, 30], // 10d, 5d, 2mo, 1mo
        pricesPerStage: [1, 2, 5, 1],
        yieldPerStage: [0, 0, 0, 0],
        product: '',
        outputFrequency: 0,
        wastePerTurn: 0,
        dateDeployed: '',
        growthStage: '',
        effects: [{type: 'pest_control', strength: 3}],
        synergies: [{target: 'lettuce', strength: 2}, {target: 'tomato', strength: 1}]
    }, {
        type: 'dog',
        icon: '🐕',
        food: ['animal_feed'],
        foodConsumption: 1,
        waterConsumption: 1,
        health: 100,
        growthStages: ['puppy', 'juvenile', 'adult', 'old'],
        daysPerGrowthStage: [180, 185, 2190, 730], // 6mo, 6mo, 6yr, 2yr
        pricesPerStage: [80, 200, 400, 150],
        yieldPerStage: [0, 0, 0, 0],
        product: '',
        outputFrequency: 0,
        wastePerTurn: 1,
        dateDeployed: '',
        growthStage: '',
        effects: [{type: 'defense', strength: 2}],
        synergies: [{target: 'sheep', strength: 1}, {target: 'goat', strength: 1}]
    }])


    return {animalTypes, products}
})
