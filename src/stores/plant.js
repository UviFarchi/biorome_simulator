import {defineStore} from 'pinia'
import {ref} from 'vue'

export const plant = defineStore('plantStore', () => {
    const plantTypes = ref(
        [
            {
        type: 'grass',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'vegetative', 'ripe', 'overripe'],
        daysPerGrowthStage: [7, 21, 40, 20, 8],
        waterRequired: 600,
        fertilizerRequired: 50,
        yield: 8000, // Spring & early autumn hay cuts
        harvestWindows: [{startMonth: 5, startDay: 15, endMonth: 6, endDay: 30}, {
            startMonth: 9, startDay: 1, endMonth: 9, endDay: 30
        }],
        seedCost: 0.1,
        seedlingCost: 0.5,
        icon: '🌱',
        productKey: 'hay',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'waste',
        removedWhenHarvested: false,
        effects: [{type: 'weed_suppression', strength: 1}],
        synergies: [{target: 'clover', strength: 1}]
    }, {
        type: 'corn',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerGrowthStage: [7, 14, 50, 10, 8, 8, 4],
        waterRequired: 600,
        fertilizerRequired: 150,
        yield: 8000, // One harvest period
        harvestWindows: [{startMonth: 7, startDay: 1, endMonth: 8, endDay: 15}, {
            startMonth: 9, startDay: 1, endMonth: 10, endDay: 15
        }],
        seedCost: 0.1,
        seedlingCost: 0.5,
        icon: '🌽',
        productKey: 'corn_cob',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'waste',
        removedWhenHarvested: true,
        effects: [{type: 'water_consumption', strength: 2}],
        synergies: [{target: 'beans', strength: 1}, {target: 'pumpkin', strength: 1}]
    }, {
        type: 'tomato',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerGrowthStage: [8, 12, 30, 15, 10, 10, 5],
        waterRequired: 700,
        fertilizerRequired: 120,
        yield: 50000, // Summer and autumn (can harvest indeterminate tomatoes twice)
        harvestWindows: [{startMonth: 7, startDay: 1, endMonth: 8, endDay: 15}, {
            startMonth: 9, startDay: 1, endMonth: 9, endDay: 30
        }],
        seedCost: 0.2,
        seedlingCost: 1.0,
        icon: '🍅',
        productKey: 'tomato_fruit',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'waste',
        removedWhenHarvested: true,
        effects: [{type: 'water_consumption', strength: 2}],
        synergies: [{target: 'basil', strength: 1}, {target: 'marigold', strength: 1}, {
            target: 'bee', strength: 1
        }, {target: 'ladybug', strength: 1}, {target: 'chicken', strength: 1}]
    }, {
        type: 'lettuce',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'vegetative', 'green fruit', 'ripe', 'overripe'],
        daysPerGrowthStage: [4, 10, 30, 7, 6, 4],
        waterRequired: 300,
        fertilizerRequired: 50,
        yield: 25000, // Spring & early autumn (often two crops)
        harvestWindows: [{startMonth: 4, startDay: 15, endMonth: 6, endDay: 15}, {
            startMonth: 9, startDay: 1, endMonth: 10, endDay: 15
        }],
        seedCost: 0.05,
        seedlingCost: 0.5,
        icon: '🥬',
        productKey: 'lettuce_leaf',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'waste',
        removedWhenHarvested: true,
        effects: [{type: 'water_consumption', strength: 1}],
        synergies: [{target: 'clover', strength: 1}, {target: 'duck', strength: 1}]
    }, {
        type: 'carrot',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'vegetative', 'green fruit', 'ripe', 'overripe'],
        daysPerGrowthStage: [14, 14, 35, 10, 10, 5],
        waterRequired: 400,
        fertilizerRequired: 80,
        yield: 40000,
        harvestWindows: [{startMonth: 6, startDay: 1, endMonth: 7, endDay: 31}],
        seedCost: 0.02,
        seedlingCost: 0.2,
        icon: '🥕',
        productKey: 'carrot_root',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'waste',
        removedWhenHarvested: true,
        effects: [{type: 'soil_loosen', strength: 1}],
        synergies: [{target: 'rabbit', strength: 1}, {target: 'pumpkin', strength: 1}, {target: 'pig', strength: 1}]
    }, {
        type: 'pumpkin',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerGrowthStage: [7, 14, 40, 15, 15, 10, 6],
        waterRequired: 500,
        fertilizerRequired: 100,
        yield: 35000,
        harvestWindows: [{startMonth: 9, startDay: 15, endMonth: 10, endDay: 31}],
        seedCost: 0.5,
        seedlingCost: 2.0,
        icon: '🎃',
        productKey: 'pumpkin_fruit',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'waste',
        removedWhenHarvested: true,
        effects: [{type: 'water_consumption', strength: 3}],
        synergies: [{target: 'corn', strength: 1}, {target: 'beans', strength: 1}, {
            target: 'bee', strength: 1
        }, {target: 'pig', strength: 1}]
    }, {
        type: 'lavender',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerGrowthStage: [21, 30, 30, 20, 10, 10, 6],
        waterRequired: 250,
        fertilizerRequired: 20,
        yield: 1000,
        harvestWindows: [{startMonth: 6, startDay: 1, endMonth: 7, endDay: 15}],
        seedCost: 0.1,
        seedlingCost: 1.0,
        icon: '💜',
        productKey: 'lavender_flower',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'waste',
        removedWhenHarvested: false,
        effects: [{type: 'pollination', strength: 1}, {type: 'pest_control', strength: 1}],
        synergies: [{target: 'bee', strength: 1}, {target: 'apple_tree', strength: 1}, {
            target: 'pear_tree', strength: 1
        }, {target: 'almond_tree', strength: 1}]
    }, {
        type: 'clover',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerGrowthStage: [10, 14, 30, 10, 8, 8, 4],
        waterRequired: 400,
        fertilizerRequired: 0,
        yield: 10000,
        harvestWindows: [{startMonth: 5, startDay: 1, endMonth: 6, endDay: 30}],
        seedCost: 0.01,
        seedlingCost: 0.1,
        icon: '☘️',
        productKey: 'clover_flower',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'waste',
        removedWhenHarvested: false,
        effects: [{type: 'nitrogen_fixing', strength: 1}],
        synergies: [{target: 'coffee', strength: 1}, {target: 'apple_tree', strength: 1}]
    }, {
        type: 'sunflower',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerGrowthStage: [7, 10, 40, 15, 10, 10, 6],
        waterRequired: 500,
        fertilizerRequired: 80,
        yield: 2500,
        harvestWindows: [{startMonth: 8, startDay: 15, endMonth: 9, endDay: 30}],
        seedCost: 0.1,
        seedlingCost: 0.5,
        icon: '🌻',
        productKey: 'sunflower_seed',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'waste',
        removedWhenHarvested: true,
        effects: [{type: 'pollination', strength: 1}],
        synergies: [{target: 'bee', strength: 1}, {target: 'grape_vine', strength: 1}, {target: 'coffee', strength: 1}]
    }, {
        type: 'wheat',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerGrowthStage: [7, 14, 60, 7, 7, 7, 4],
        waterRequired: 500,
        fertilizerRequired: 100,
        yield: 4500,
        harvestWindows: [{startMonth: 7, startDay: 1, endMonth: 8, endDay: 1}],
        seedCost: 0.005,
        seedlingCost: 0.05,
        icon: '🌾',
        productKey: 'wheat_grain',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'waste',
        removedWhenHarvested: true,
        effects: [{type: 'weed_suppression', strength: 1}],
        synergies: []
    }, {
        type: 'barley',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerGrowthStage: [7, 14, 55, 7, 7, 7, 4],
        waterRequired: 450,
        fertilizerRequired: 80,
        yield: 7000,
        harvestWindows: [{startMonth: 7, startDay: 1, endMonth: 7, endDay: 31}],
        seedCost: 0.005,
        seedlingCost: 0.05,
        icon: '🌾',
        productKey: 'barley_grain',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'waste',
        removedWhenHarvested: true,
        effects: [{type: 'weed_suppression', strength: 1}],
        synergies: []
    }, {
        type: 'oats',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerGrowthStage: [7, 14, 50, 7, 7, 7, 4],
        waterRequired: 500,
        fertilizerRequired: 60,
        yield: 5000,
        harvestWindows: [{startMonth: 8, startDay: 1, endMonth: 8, endDay: 31}],
        seedCost: 0.005,
        seedlingCost: 0.05,
        icon: '🌾',
        productKey: 'oats_grain',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'waste',
        removedWhenHarvested: true,
        effects: [{type: 'weed_suppression', strength: 1}],
        synergies: []
    }, {
        type: 'strawberry',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'juvenile', 'fruiting', 'old'],
        daysPerGrowthStage: [14, 14, 90, 730, 730],
       fruitStage: 'vegetative',
        fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerFruitStage: [7, 10, 10, 5],
        waterRequired: 600,
        fertilizerRequired: 100,
        yield: 20000, // Two fruiting periods: spring/early summer, and again late summer
        harvestWindows: [{startMonth: 5, startDay: 20, endMonth: 6, endDay: 30}, {
            startMonth: 8, startDay: 15, endMonth: 9, endDay: 15
        }],
        seedCost: 0.05,
        seedlingCost: 1.0,
        icon: '🍓',
        productKey: 'strawberry_fruit',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'waste',
        removedWhenHarvested: false,
        effects: [{type: 'pollination', strength: 1}],
        synergies: [{target: 'bee', strength: 1}, {target: 'ladybug', strength: 1}]
    }, {
        type: 'blueberry',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'juvenile', 'fruiting', 'old'],
        daysPerGrowthStage: [0, 30, 365, 3650, 3650],
       fruitStage: 'vegetative',
        fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerFruitStage: [10, 15, 10, 7],
        waterRequired: 700,
        fertilizerRequired: 50,
        yield: 20000, // Two windows: late June/early July and August
        harvestWindows: [{startMonth: 6, startDay: 25, endMonth: 7, endDay: 15}, {
            startMonth: 8, startDay: 1, endMonth: 8, endDay: 20
        }],
        seedCost: 0.1,
        seedlingCost: 3.0,
        icon: '🫐',
        productKey: 'blueberry_fruit',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'waste',
        removedWhenHarvested: false,
        effects: [{type: 'pollination', strength: 1}, {type: 'ph_down', strength: 0.2}],
        synergies: [{target: 'bee', strength: 1}]
    }, {
        type: 'coffee',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'juvenile', 'fruiting', 'old'],
        daysPerGrowthStage: [30, 730, 730, 1460, 1460],
       fruitStage: 'vegetative',
        fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerFruitStage: [14, 180, 30, 14],
        waterRequired: 1500,
        fertilizerRequired: 200,
        yield: 3000,
        harvestWindows: [{startMonth: 11, startDay: 1, endMonth: 1, endDay: 31}],
        seedCost: 0.1,
        seedlingCost: 1.0,
        icon: '☕',
        productKey: 'coffee_beans',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'waste',
        removedWhenHarvested: false,
        effects: [{type: 'ph_down', strength: 0.2}],
        synergies: [{target: 'bee', strength: 1}, {target: 'clover', strength: 1}, {target: 'sunflower', strength: 1}]
    }, {
        type: 'apple_tree',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'sapling', 'fruiting', 'old'],
        daysPerGrowthStage: [60, 730, 1095, 5475, 5475],
       fruitStage: 'vegetative',
        fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerFruitStage: [10, 120, 30, 15],
        waterRequired: 700,
        fertilizerRequired: 80,
        yield: 30000,
        harvestWindows: [{startMonth: 9, startDay: 1, endMonth: 10, endDay: 15}],
        seedCost: 0.2,
        seedlingCost: 10.0,
        icon: '🍏',
        productKey: 'apple',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'wood',
        removedWhenHarvested: false,
        effects: [{type: 'pollination', strength: 1}],
        synergies: [{target: 'bee', strength: 2}, {target: 'lavender', strength: 2}, {target: 'sunflower', strength: 2}]
    }, {
        type: 'oak_tree',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'sapling', 'fruiting', 'old'],
        daysPerGrowthStage: [20, 730, 3650, 18250, 18250],
       fruitStage: 'vegetative',
        fruitStages: ['flowering', 'acorn', 'ripe', 'overripe'],
        daysPerFruitStage: [10, 120, 30, 30],
        waterRequired: 500,
        fertilizerRequired: 0,
        yield: 250000,
        harvestWindows: [{startMonth: 10, startDay: 1, endMonth: 11, endDay: 15}],
        seedCost: 0.05,
        seedlingCost: 5.0,
        icon: '🌳',
        productKey: 'acorn',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'wood',
        removedWhenHarvested: false,
        effects: [{type: 'weed_suppression', strength: 2}],
        synergies: []
    }, {
        type: 'poplar',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'juvenile', 'fruiting', 'old'],
        daysPerGrowthStage: [1, 180, 1095, 2190, 2190],
       fruitStage: 'vegetative',
        fruitStages: ['flowering', 'seed_catkin', 'ripe', 'overripe'],
        daysPerFruitStage: [7, 30, 7, 0],
        waterRequired: 800,
        fertilizerRequired: 100,
        yield: 100000,
        harvestWindows: [{startMonth: 11, startDay: 1, endMonth: 12, endDay: 31}],
        seedCost: 0.05,
        seedlingCost: 2.0,
        icon: '🌲',
        productKey: '',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'wood',
        removedWhenHarvested: false,
        effects: [{type: 'weed_suppression', strength: 2}],
        synergies: []
    }, {
        type: 'willow',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'juvenile', 'fruiting', 'old'],
        daysPerGrowthStage: [1, 180, 730, 2190, 2190],
       fruitStage: 'vegetative',
        fruitStages: ['flowering', 'seed_catkin', 'ripe', 'overripe'],
        daysPerFruitStage: [7, 30, 7, 0],
        waterRequired: 1000,
        fertilizerRequired: 80,
        yield: 30000,
        harvestWindows: [{startMonth: 1, startDay: 1, endMonth: 2, endDay: 28}],
        seedCost: 0.05,
        seedlingCost: 1.0,
        icon: '🌳',
        productKey: 'willow_bark',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'wood',
        removedWhenHarvested: false,
        effects: [{type: 'weed_suppression', strength: 2}],
        synergies: []
    }, {
        type: 'pear_tree',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'sapling', 'fruiting', 'old'],
        daysPerGrowthStage: [60, 730, 1095, 5110, 5110],
       fruitStage: 'vegetative',
        fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerFruitStage: [10, 110, 20, 10],
        waterRequired: 600,
        fertilizerRequired: 60,
        yield: 30000,
        harvestWindows: [{startMonth: 8, startDay: 15, endMonth: 9, endDay: 30}],
        seedCost: 0.2,
        seedlingCost: 10.0,
        icon: '🍐',
        productKey: 'pear',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'wood',
        removedWhenHarvested: false,
        effects: [{type: 'pollination', strength: 1}],
        synergies: [{target: 'bee', strength: 2}, {target: 'lavender', strength: 2}, {target: 'sunflower', strength: 2}]
    }, {
        type: 'almond_tree',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'sapling', 'fruiting', 'old'],
        daysPerGrowthStage: [30, 730, 730, 3650, 3650],
       fruitStage: 'vegetative',
        fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerFruitStage: [7, 150, 30, 10],
        waterRequired: 800,
        fertilizerRequired: 150,
        yield: 2800,
        harvestWindows: [{startMonth: 8, startDay: 1, endMonth: 9, endDay: 15}],
        seedCost: 0.2,
        seedlingCost: 10.0,
        icon: '🌰',
        productKey: 'almond',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'wood',
        removedWhenHarvested: false,
        effects: [{type: 'pollination', strength: 1}],
        synergies: [{target: 'bee', strength: 2}, {target: 'clover', strength: 2}]
    }, {
        type: 'orange_tree',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'sapling', 'fruiting', 'old'],
        daysPerGrowthStage: [30, 730, 730, 3650, 3650],
       fruitStage: 'vegetative',
        fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerFruitStage: [14, 240, 60, 30],
        waterRequired: 1000,
        fertilizerRequired: 180,
        yield: 30000,
        harvestWindows: [{startMonth: 12, startDay: 1, endMonth: 3, endDay: 1}, {
            startMonth: 1, startDay: 1, endMonth: 12, endDay: 31
        }],
        seedCost: 0.1,
        seedlingCost: 15.0,
        icon: '🍊',
        productKey: 'orange',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'wood',
        removedWhenHarvested: false,
        effects: [{type: 'pollination', strength: 1}],
        synergies: [{target: 'bee', strength: 1}, {target: 'lavender', strength: 1}]
    }, {
        type: 'lemon_tree',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'sapling', 'fruiting', 'old'],
        daysPerGrowthStage: [30, 730, 730, 3285, 3285],
       fruitStage: 'vegetative',
        fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerFruitStage: [14, 180, 60, 30],
        waterRequired: 1000,
        fertilizerRequired: 180,
        yield: 35000,
        harvestWindows: [{startMonth: 11, startDay: 1, endMonth: 2, endDay: 28}],
        seedCost: 0.1,
        seedlingCost: 15.0,
        icon: '🍋',
        productKey: 'lemon',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'wood',
        removedWhenHarvested: false,
        effects: [{type: 'pollination', strength: 1}],
        synergies: [{target: 'bee', strength: 1}, {target: 'lavender', strength: 1}]
    }, {
        type: 'grape_vine',
        health: 100,
        plantingOptions: ['seed', 'seedling'],
        growthStages: ['seed', 'seedling', 'juvenile', 'fruiting', 'old'],
        daysPerGrowthStage: [30, 180, 730, 1825, 1825],
       fruitStage: 'vegetative',
        fruitStages: ['flowering', 'green fruit', 'ripe', 'overripe'],
        daysPerFruitStage: [7, 60, 30, 14],
        waterRequired: 600,
        fertilizerRequired: 50,
        yield: 25000,
        harvestWindows: [{startMonth: 8, startDay: 15, endMonth: 10, endDay: 1}],
        seedCost: 0.05,
        seedlingCost: 5.0,
        icon: '🍇',
        productKey: 'grape',
        dateDeployed: '',
        growthStage: '',
        plantMaterialKey: 'waste',
        removedWhenHarvested: false,
        effects: [{type: 'pollination', strength: 1}],
        synergies: [{target: 'bee', strength: 1}, {target: 'ladybug', strength: 1}]
    },
            // Aquatic crops
            {
                type: 'rice',
                health: 100,
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'green fruit', 'ripe', 'overripe'],
                daysPerGrowthStage: [7, 14, 45, 10, 10, 15, 7],
                waterRequired: 1200,
                fertilizerRequired: 150,
                yield: 6000,
                harvestWindows: [{ startMonth: 9, startDay: 1, endMonth: 10, endDay: 15 }],
                seedCost: 0.05,
                seedlingCost: 0.5,
                icon: '🌾',
                productKey: 'rice_grain',
                dateDeployed: '',
                growthStage: '',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                effects: [{ type: 'water_consumption', strength: 3 }],
                synergies: [{ target: 'duck', strength: 1 }]
            },
            {
                type: 'lotus',
                health: 100,
                plantingOptions: ['seed', 'seedling'],
                growthStages: ['seed', 'seedling', 'vegetative', 'flowering', 'ripe', 'overripe'],
                daysPerGrowthStage: [10, 20, 60, 20, 20, 10],
                waterRequired: 1000,
                fertilizerRequired: 80,
                yield: 2000,
                harvestWindows: [{ startMonth: 7, startDay: 1, endMonth: 8, endDay: 31 }],
                seedCost: 0.1,
                seedlingCost: 1.0,
                icon: '🌸',
                productKey: 'lotus_root',
                dateDeployed: '',
                growthStage: '',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                effects: [{ type: 'pollination', strength: 1 }],
                synergies: [{ target: 'bee', strength: 1 }]
            },
            {
                type: 'water_spinach',
                health: 100,
                plantingOptions: ['seed', 'cutting'],
                growthStages: ['seed', 'seedling', 'vegetative', 'ripe', 'overripe'],
                daysPerGrowthStage: [5, 7, 20, 10, 5],
                waterRequired: 800,
                fertilizerRequired: 40,
                yield: 15000,
                harvestWindows: [{ startMonth: 6, startDay: 1, endMonth: 8, endDay: 31 }],
                seedCost: 0.02,
                seedlingCost: 0.2,
                icon: '🥬',
                productKey: 'water_spinach_leaf',
                dateDeployed: '',
                growthStage: '',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                effects: [{ type: 'water_consumption', strength: 2 }],
                synergies: [{ target: 'fish', strength: 1 }]
            },

            // Weeds
            {
                type: 'duckweed',
                health: 80,
                plantingOptions: ['natural'],
                growthStages: ['vegetative', 'ripe'],
                daysPerGrowthStage: [7, 7],
                waterRequired: 500,
                fertilizerRequired: 0,
                yield: 500,
                harvestWindows: [{ startMonth: 6, startDay: 1, endMonth: 9, endDay: 30 }],
                seedCost: 0,
                seedlingCost: 0,
                icon: '🟩',
                productKey: 'duckweed_biomass',
                dateDeployed: '',
                growthStage: '',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                effects: [{ type: 'water_cover', strength: 1 }],
                synergies: [{ target: 'fish', strength: 1 }]
            },
            {
                type: 'water_hyacinth',
                health: 90,
                plantingOptions: ['natural'],
                growthStages: ['vegetative', 'flowering', 'ripe'],
                daysPerGrowthStage: [14, 20, 15],
                waterRequired: 700,
                fertilizerRequired: 0,
                yield: 1000,
                harvestWindows: [{ startMonth: 7, startDay: 1, endMonth: 9, endDay: 30 }],
                seedCost: 0,
                seedlingCost: 0,
                icon: '💜',
                productKey: 'water_hyacinth_biomass',
                dateDeployed: '',
                growthStage: '',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                effects: [{ type: 'invasive', strength: 2 }],
                synergies: []
            },
            {
                type: 'barnyard_grass',
                health: 70,
                plantingOptions: ['natural'],
                growthStages: ['seedling', 'vegetative', 'ripe'],
                daysPerGrowthStage: [7, 30, 15],
                waterRequired: 400,
                fertilizerRequired: 0,
                yield: 2000,
                harvestWindows: [{ startMonth: 7, startDay: 1, endMonth: 8, endDay: 31 }],
                seedCost: 0,
                seedlingCost: 0,
                icon: '🌱',
                productKey: 'barnyard_grass_seed',
                dateDeployed: '',
                growthStage: '',
                plantMaterialKey: 'waste',
                removedWhenHarvested: true,
                effects: [{ type: 'weed_competition', strength: 2 }],
                synergies: []
            }
])


    const products = {
        // Annuals
        hay: {
            icon: '🌱', label: 'Hay', basePrice: 1, shelfLife: 10, harvestType: 'product'
        }, corn_cob: {
            icon: '🌽', label: 'Corn Cob', basePrice: 1, shelfLife: 15, harvestType: 'product'
        }, tomato_fruit: {
            icon: '🍅', label: 'Tomato', basePrice: 1, shelfLife: 7, harvestType: 'product'
        }, lettuce_leaf: {
            icon: '🥬', label: 'Lettuce Leaf', basePrice: 1, shelfLife: 6, harvestType: 'product'
        }, carrot_root: {
            icon: '🥕', label: 'Carrot Root', basePrice: 1, shelfLife: 20, harvestType: 'product'
        }, pumpkin_fruit: {
            icon: '🎃', label: 'Pumpkin', basePrice: 2, shelfLife: 40, harvestType: 'product'
        }, lavender_flower: {
            icon: '💜', label: 'Lavender Flower', basePrice: 3, shelfLife: 15, harvestType: 'product'
        }, clover_flower: {
            icon: '☘️', label: 'Clover Flower', basePrice: 1, shelfLife: 10, harvestType: 'product'
        }, sunflower_seed: {
            icon: '🌻', label: 'Sunflower Seed', basePrice: 2, shelfLife: 12, harvestType: 'product'
        }, wheat_grain: {
            icon: '🌾', label: 'Wheat Grain', basePrice: 1, shelfLife: 90, harvestType: 'product'
        }, barley_grain: {
            icon: '🌾', label: 'Barley Grain', basePrice: 1, shelfLife: 90, harvestType: 'product'
        }, oats_grain: {
            icon: '🌾', label: 'Oats Grain', basePrice: 1, shelfLife: 90, harvestType: 'product'
        },

        // Perennials & fruit/nut trees
        strawberry_fruit: {
            icon: '🍓', label: 'Strawberry', basePrice: 3, shelfLife: 7, harvestType: 'product'
        }, blueberry_fruit: {
            icon: '🫐', label: 'Blueberry', basePrice: 4, shelfLife: 7, harvestType: 'product'
        }, coffee_beans: {
            icon: '☕', label: 'Coffee Beans', basePrice: 2, shelfLife: 30, harvestType: 'product'
        }, apple: {
            icon: '🍏', label: 'Apple', basePrice: 4, shelfLife: 20, harvestType: 'product'
        }, acorn: {
            icon: '🌰', label: 'Acorn', basePrice: 1, shelfLife: 45, harvestType: 'product'
        }, pear: {
            icon: '🍐', label: 'Pear', basePrice: 4, shelfLife: 20, harvestType: 'product'
        }, almond: {
            icon: '🌰', label: 'Almond', basePrice: 6, shelfLife: 30, harvestType: 'product'
        }, orange: {
            icon: '🍊', label: 'Orange', basePrice: 5, shelfLife: 18, harvestType: 'product'
        }, lemon: {
            icon: '🍋', label: 'Lemon', basePrice: 5, shelfLife: 18, harvestType: 'product'
        }, grape: {
            icon: '🍇', label: 'Grape', basePrice: 5, shelfLife: 10, harvestType: 'product'
        }, willow_bark: {
            icon: '', label: 'Willow Bark', basePrice: 3, shelfLife: 60, harvestType: 'product'
        }, wood: {
            icon: '🪵', label: 'Wood', basePrice: 6, shelfLife: 80, harvestType: 'plant'
        }
    }


    return {plantTypes, products}
})
