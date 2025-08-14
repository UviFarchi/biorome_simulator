import {defineStore} from 'pinia'
import {ref} from 'vue'

export const modulesStore = defineStore('modulesStore', () => {

    const constants = ref({
        // Units used across the sim
        units: {
            electricity: 'kWh', water: 'm³', waste: 'ton', batteryPack: 'pack'
        },

        // Battery pack spec used by all modules
        battery: {
            moduleKey: 'battery',       // the moduleTypes key for batteries
            kWhPerPack: 5               // nominal ~48V·100Ah ≈ 5 kWh
        }
    })

    const availableModules = ref([{
        name: "Battery Pack",
        type: "battery",
        subtype: null,
        attachesTo: ["transport", "pole"],
        requires: [],
        slots: [],
        maxSlots: 0,
        count: 0,
        cost: 60,

    }, // TRANSPORT & MOBILE BASES
        {
            name: "UGV Transport (small)",
            type: "transport",
            subtype: "ground",
            attachesTo: [],
            requires: ["battery"],
            slots: ["arm", "sensor", "camera", "cart", "tank", "sprayer", "seeder", "gps", "battery"],
            maxSlots: 6,
            count: 0,
            cost: 200
        }, {
            name: "UGV Transport (large)",
            type: "transport",
            subtype: "ground",
            attachesTo: [],
            requires: ["battery"],
            slots: ["arm", "sensor", "camera", "cart", "tank", "sprayer", "seeder", "gps", "battery"],
            maxSlots: 8,
            count: 0,
            cost: 320
        }, {
            name: "Drone Transport (quadcopter)",
            type: "transport",
            subtype: "flying",
            attachesTo: [],
            requires: ["battery"],
            slots: ["sensor", "camera", "sprayer", "tank", "battery", "gps"],
            maxSlots: 4,
            count: 0,
            cost: 250
        }, {
            name: "Drone Transport (fixed wing)",
            type: "transport",
            subtype: "flying",
            attachesTo: [],
            requires: ["battery"],
            slots: ["sensor", "camera", "sprayer", "tank", "battery", "gps"],
            maxSlots: 6,
            count: 0,
            cost: 350
        }, {
            name: "Rail Transport Module",
            type: "transport",
            subtype: "rail",
            attachesTo: [],
            requires: ["battery"],
            slots: ["cart", "sensor", "camera", "battery"],
            maxSlots: 4,
            count: 0,
            cost: 150
        }, {
            name: "Pole",
            type: "pole",
            subtype: null,
            attachesTo: [],
            requires: ["battery"],
            slots: ["sensor", "camera", "communications"],
            maxSlots: 3,
            count: 0,
            cost: 40,

        }, {
            name: "Shelf/Rack",
            type: "shelf",
            subtype: null,
            attachesTo: [],
            requires: ["battery"],
            slots: ["arm", "sensor"],
            maxSlots: 2,
            count: 0,
            cost: 35,

        },

        // ROBOTIC ARMS
        {
            name: "Robotic Arm (small)",
            type: "arm",
            subtype: "small",
            attachesTo: ["transport", "pole", "shelf"],
            requires: ["transport"],
            slots: ["tool", "sensor"],
            maxSlots: 1,
            count: 0,
            cost: 70,

        }, {
            name: "Robotic Arm (medium)",
            type: "arm",
            subtype: "medium",
            attachesTo: ["transport", "pole", "shelf"],
            requires: ["transport"],
            slots: ["tool", "sensor"],
            maxSlots: 2,
            count: 0,
            cost: 100,

        }, {
            name: "Robotic Arm (heavy)",
            type: "arm",
            subtype: "heavy",
            attachesTo: ["transport"],
            requires: ["transport"],
            slots: ["tool"],
            maxSlots: 1,
            count: 0,
            cost: 160,

        },

        // TOOLS & ATTACHMENTS
        {
            name: "Hole-Borer",
            type: "tool",
            subtype: "borer",
            attachesTo: ["arm"],
            requires: ["arm"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 40
        }, {
            name: "Gripper",
            type: "tool",
            subtype: "gripper",
            attachesTo: ["arm"],
            requires: ["arm"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 30
        }, {
            name: "Cutter/Saw",
            type: "tool",
            subtype: "cutter",
            attachesTo: ["arm"],
            requires: ["arm"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 35
        }, {
            name: "Suction Tool",
            type: "tool",
            subtype: "suction",
            attachesTo: ["arm"],
            requires: ["arm"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 25
        }, {
            name: "Seeder",
            type: "tool",
            subtype: "seeder",
            attachesTo: ["transport"],
            requires: ["transport"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 45
        }, {
            name: "Digger",
            type: "tool",
            subtype: "digger",
            attachesTo: ["arm"],
            requires: ["arm"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 50
        }, {
            name: "Brush Tool",
            type: "tool",
            subtype: "brush",
            attachesTo: ["arm"],
            requires: ["arm"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 30
        }, {
            name: "Rotating Blades",
            type: "tool",
            subtype: "rotatingblades",
            attachesTo: ["arm"],
            requires: ["arm"],
            slots: [],
            maxSlots: 0,
            powerDraw: 1.5,
            count: 0,
            cost: 45
        }, {
            name: "Pitchfork",
            type: "tool",
            subtype: "pitchfork",
            attachesTo: ["arm", "internalSpace"],
            requires: ["arm"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 28
        }, {
            name: "Flattener Module",
            type: "tool",
            subtype: "flattener",
            attachesTo: ["arm", "transport"],
            requires: ["arm"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 60
        }, {
            name: "Grader Module",
            type: "tool",
            subtype: "grader",
            attachesTo: ["arm", "transport"],
            requires: ["arm"],
            slots: [],
            maxSlots: 0,
            count: 0,

            cost: 70
        }, {
            name: "Anchor Driver Module",
            type: "tool",
            subtype: "anchor_driver",
            attachesTo: ["arm"],
            requires: ["arm"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 55
        }, // FIELD MODULES (CARRY/SPRAY/STORAGE)
        {
            name: "Cart",
            type: "cart",
            subtype: null,
            attachesTo: ["transport"],
            requires: ["transport"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 60
        }, {
            name: "Tank",
            type: "tank",
            subtype: null,
            attachesTo: ["transport"],
            requires: ["transport"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 70
        }, {
            name: "Sprayer",
            type: "sprayer",
            subtype: null,
            attachesTo: ["tank", "transport"],
            requires: ["tank", "transport"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 40
        }, {
            name: "Fertilizer Spreader",
            type: "spreader",
            subtype: null,
            attachesTo: ["transport"],
            requires: ["transport"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 45
        }, {
            name: "Seed Box",
            type: "seedbox",
            subtype: null,
            attachesTo: ["transport"],
            requires: ["transport"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 20
        },

        // SENSORS & MONITORING
        {
            name: "Sensor Module (soil)",
            type: "sensor",
            subtype: "soil",
            attachesTo: ["transport", "arm", "pole"],
            requires: ["battery"],
            slots: [],
            maxSlots: 0,
            powerDraw: 0.5,
            count: 0,
            cost: 30,

        }, {
            name: "Sensor Module (air)",
            type: "sensor",
            subtype: "air",
            attachesTo: ["transport", "pole"],
            requires: [],
            slots: [],
            maxSlots: 0,
            powerDraw: 0.5,
            count: 0,
            cost: 30,

        }, {
            name: "Sensor Module (leaf)",
            type: "sensor",
            subtype: "leaf",
            attachesTo: ["transport", "arm", "pole"],
            requires: [],
            slots: [],
            maxSlots: 0,
            powerDraw: 0.5,
            count: 0,
            cost: 35,

        }, {
            name: "pH Sensor",
            type: "sensor",
            subtype: "ph",
            attachesTo: ["transport", "arm", "pole"],
            requires: [],
            slots: [],
            maxSlots: 0,
            powerDraw: 0.5,
            count: 0,
            cost: 30,

        }, {
            name: "EC Sensor",
            type: "sensor",
            subtype: "ec",
            attachesTo: ["transport", "arm", "pole"],
            requires: [],
            slots: [],
            maxSlots: 0,
            powerDraw: 0.5,
            count: 0,
            cost: 35,

        }, {
            name: "NPK Sensor",
            type: "sensor",
            subtype: "npk",
            attachesTo: ["transport", "arm", "pole"],
            requires: [],
            slots: [],
            maxSlots: 0,
            powerDraw: 0.5,
            count: 0,
            cost: 35,

        }, {
            name: "Weather Station",
            type: "weather",
            subtype: null,
            attachesTo: ["pole", "shelf"],
            requires: ["battery"],
            slots: ["sensor"],
            maxSlots: 2,
            count: 0,
            cost: 60,

        },

        // CAMERAS & IMAGING
        {
            name: "Camera_rgb",
            type: "camera",
            subtype: "rgb",
            attachesTo: ["transport", "pole", "arm"],
            requires: [],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 50,

        }, {
            name: "Camera_multispectral",
            type: "camera",
            subtype: "ms",
            attachesTo: ["transport", "pole", "arm"],
            requires: [],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 70,

        }, {
            name: "Camera_ir",
            type: "camera",
            subtype: "ir",
            attachesTo: ["transport", "pole", "arm"],
            requires: [],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 65,

        },

        // GPS / COMMUNICATIONS / PROCESSING
        {
            name: "GPS Module",
            type: "gps",
            subtype: null,
            attachesTo: ["transport"],
            requires: ["transport"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 20,

        }, {
            name: "Communications Repeater",
            type: "communications",
            subtype: null,
            attachesTo: ["transport", "pole"],
            requires: ["battery"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 40,

        }, {
            name: "Onboard Computer",
            type: "computer",
            subtype: null,
            attachesTo: ["transport", "pole"],
            requires: ["battery"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 120,

        }, {
            name: "Solar Panel",
            type: "solar",
            subtype: null,
            attachesTo: ["pole", "shelf", "transport"],
            requires: [],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 50,

        },


        // SUPPLY / WASTE
        {
            name: "Mycelium Box",
            type: "box",
            subtype: null,
            attachesTo: ["cart"],
            requires: ["cart"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 18
        }, {
            name: "Wagon Module",
            type: "wagon",
            subtype: null,
            attachesTo: ["rail"],
            requires: ["rail"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 80
        }, {
            name: "Waste Module",
            type: "waste",
            subtype: null,
            attachesTo: ["cart"],
            requires: ["cart"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 15
        },

        // SPECIALS
        {
            name: "LED Lamp",
            type: "lamp",
            subtype: null,
            attachesTo: ["pole", "shelf"],
            requires: ["battery"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 35,

        }, {
            name: "Heating Module",
            type: "heating",
            subtype: null,
            attachesTo: ["pole", "shelf", "transport"],
            requires: ["battery"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 60,

        }, {
            name: "Audio Alarm",
            type: "alarm",
            subtype: "audio",
            attachesTo: ["collar"],
            requires: ["battery"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 2,

        }, {
            name: "Mild Shocker",
            type: "alarm",
            subtype: "electric",
            attachesTo: ["collar"],
            requires: ["battery"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 2,

        }, {
            name: "Valve module",
            type: "valve",
            subtype: null,
            attachesTo: ["tank", "pipe", "pole"],
            requires: ["tank"],
            slots: [],
            maxSlots: 0,
            powerDraw: 0.5,
            count: 0,
            cost: 35
        }, {
            name: "Pump module",
            type: "pump",
            subtype: null,
            attachesTo: ["tank", "pipe", "pole"],
            requires: ["tank"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 60
        }, {
            name: "Barrel module",
            type: "barrel",
            subtype: null,
            attachesTo: [],
            requires: [],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 55
        }, {
            name: "Perimeter fence module",
            type: "fence",
            subtype: null,
            attachesTo: ["pole"],
            requires: ["pole"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 80,

        }, {
            name: "Animal Collar",
            type: "collar",
            subtype: null,
            attachesTo: ["animal"],
            requires: [],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 1,

        }, {
            name: "Internal space module",
            type: "internalSpace",
            subtype: null,
            attachesTo: ["shelf", "pole", "building"],
            requires: [],
            slots: [],
            maxSlots: 4,
            count: 0,
            cost: 90,

        }, {
            name: "Static actuator",
            type: "actuator",
            subtype: "static",
            attachesTo: ["internalSpace"],
            requires: ["internalSpace"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 50
        }, {
            name: "Sensor Module (temp)",
            type: "sensor",
            subtype: "temp",
            attachesTo: ["internalSpace", "pole", "arm", "transport"],
            requires: [],
            slots: [],
            maxSlots: 0,
            powerDraw: 0.3,
            count: 0,
            cost: 25,

        }, {
            name: "Gas sensor module",
            type: "sensor",
            subtype: "gas",
            attachesTo: ["internalSpace", "pole", "arm", "transport"],
            requires: [],
            slots: [],
            maxSlots: 0,
            powerDraw: 0.3,
            count: 0,
            cost: 30,

        }, {
            name: "Pressing module",
            type: "press",
            subtype: null,
            attachesTo: ["internalSpace", "shelf"],
            requires: ["internalSpace"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 70
        }, {
            name: "Generator module",
            type: "generator",
            subtype: null,
            attachesTo: ["internalSpace", "pole"],
            requires: ["internalSpace"],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 120,

        }, {
            name: "Robotic Shelf",
            type: "shelf",
            subtype: "robotic",
            attachesTo: ["internalSpace", "building"],
            requires: [],
            slots: ["arm", "sensor", "press"],
            maxSlots: 4,
            count: 0,
            cost: 90,

        }, {
            name: "Spore spreading module",
            type: "spreader",
            subtype: "spore",
            attachesTo: ["shelf", "internalSpace"],
            requires: [],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 30
        }, {
            name: "Heater/Humidifier module",
            type: "humidifier",
            subtype: null,
            attachesTo: ["internalSpace", "shelf"],
            requires: [],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 40,

        }, {
            name: "Rotary plate module",
            type: "rotary",
            subtype: null,
            attachesTo: ["shelf", "pole", "internalSpace"],
            requires: [],
            slots: [],
            maxSlots: 0,
            powerDraw: 0.7,
            count: 0,
            cost: 60
        }, {
            name: "Weighing module",
            type: "sensor",
            subtype: "weighing",
            attachesTo: ["cart", "arm", "shelf"],
            requires: [],
            slots: [],
            maxSlots: 0,
            powerDraw: 0.2,
            count: 0,
            cost: 25
        }, {
            name: "LIDAR module",
            type: "sensor",
            subtype: "lidar",
            attachesTo: ["transport", "arm", "pole", "drone"],
            requires: [],
            slots: [],
            maxSlots: 0,
            count: 0,
            cost: 100
        }])
    const premadeAssemblies = [{
        usage: "Animal Geofencing Collar",
        modules: [{type: "collar"}, {type: "battery"}, {type: "alarm", subtype: "audio"}, {
            type: "alarm",
            subtype: "electric"
        }, {type: "gps"}]
    }, // === Produce Cultivation (Field Zone) ===
        {
            usage: "Field Planter",
            modules: [{type: "transport", subtype: "ground"}, {type: "battery"}, {type: "gps"}, {
                type: "tool",
                subtype: "seeder"
            }, {type: "arm", subtype: "medium"}, {type: "tool", subtype: "borer"}, {type: "camera", subtype: "rgb"}]
        }, {
            usage: "Field Planter (seedlings)",
            modules: [{
                type: "transport",
                subtype: "ground"
            }, {type: "battery"}, {type: "gps"}, {type: "cart"}, {type: "arm", subtype: "medium"}, {
                type: "tool",
                subtype: "gripper"
            }, {type: "camera", subtype: "rgb"}]
        }, {
            usage: "Weeding Assembly (Cutter)",
            modules: [{type: "transport", subtype: "ground"}, {type: "battery"}, {
                type: "camera",
                subtype: "rgb"
            }, {type: "tool", subtype: "cutter"}]
        }, {
            usage: "Weeding Assembly (Sprayer)",
            modules: [{type: "transport", subtype: "ground"}, {type: "battery"}, {
                type: "camera",
                subtype: "rgb"
            }, {type: "tank"}, {type: "sprayer"}]
        }, {
            usage: "Irrigation Assembly (Spot)",
            modules: [{
                type: "transport",
                subtype: "ground"
            }, {type: "battery"}, {type: "tank"}, {type: "sprayer"}, {type: "camera", subtype: "rgb"}]
        }, {
            usage: "Field Irrigation Station",
            modules: [{type: "pole"}, {type: "tank"}, {type: "valve"}, {type: "pump"}]
        }, {
            usage: "Harvesting Assembly",
            modules: [{type: "transport", subtype: "ground"}, {type: "battery"}, {type: "gps"}, {
                type: "arm",
                subtype: "medium"
            }, {type: "camera", subtype: "rgb"}, {type: "tool", subtype: "gripper"}, {
                type: "tool",
                subtype: "suction"
            }, {type: "cart"}]
        }, {
            usage: "Harvest Grader",
            modules: [{type: "transport", subtype: "ground"}, {type: "battery"}, {type: "gps"}, {
                type: "arm",
                subtype: "medium"
            }, {type: "camera", subtype: "rgb"}, {type: "sensor", subtype: "weighing"}, {type: "cart"}]
        }, // === Land Modification ===
        {
            usage: "Path Construction",
            modules: [{type: "transport", subtype: "ground"}, {type: "battery"}, {type: "gps"}, {
                type: "tool",
                subtype: "digger"
            }, {type: "tool", subtype: "flattener"}, {type: "tool", subtype: "grader"}]
        }, // === Rainwater Management ===
        {
            usage: "Rain Capture Station", modules: [{type: "barrel"}, {type: "valve"}, {type: "pump"}]
        }, {
            usage: "Flood water management station", modules: [{type: "panel"}, {type: "valve"}, {type: "pump"}]
        }, // === Habitat Management ===
        {
            usage: "Sensor Deployment UGV",
            modules: [{type: "transport", subtype: "ground"}, {type: "battery"}, {
                type: "camera",
                subtype: "rgb"
            }, {type: "sensor", subtype: "soil"}, {type: "gps"}]
        }, {
            usage: "Sensor Deployment Drone",
            modules: [{type: "transport", subtype: "flying"}, {type: "battery"}, {
                type: "camera",
                subtype: "rgb"
            }, {type: "sensor", subtype: "air"}, {type: "gps"}]
        }, {
            usage: "Fixed Sensor Pole",
            modules: [{type: "pole"}, {type: "battery"}, {type: "sensor", subtype: "soil"}, {
                type: "sensor",
                subtype: "air"
            }, {type: "camera", subtype: "rgb"}]
        }, {
            usage: "Sheep Monitor/Fence",
            modules: [{type: "pole"}, {type: "battery"}, {type: "camera", subtype: "rgb"}, {type: "communications"}]
        }, {
            usage: "Poultry/Egg Collector",
            modules: [{type: "transport", subtype: "ground"}, {type: "battery"}, {
                type: "camera",
                subtype: "rgb"
            }, {type: "arm", subtype: "small"}, {type: "tool", subtype: "suction"}, {type: "cart"}, {type: "box"}]
        }, // === Bioreactor & Mycelium ===
        {
            usage: "Bioreactor Assembly",
            modules: [{type: "internalSpace"}, {
                type: "actuator",
                subtype: "static"
            }, {type: "heating"}, {type: "sensor", subtype: "temp"}, {type: "sensor", subtype: "ph"}, {
                type: "sensor",
                subtype: "gas"
            }, {type: "tank"}, {type: "press"}, {type: "generator"}]
        }, {
            usage: "Mycelium Bricks Production",
            modules: [{type: "internalSpace"}, {type: "shelf", subtype: "robotic"}, {
                type: "spreader",
                subtype: "spore"
            }, {type: "humidifier"}, {type: "sensor", subtype: "air"}, {type: "press"}]
        }, // === Maintenance/Assembly ===
        {
            usage: "Module Assembly Station",
            modules: [{type: "shelf", subtype: "robotic"}, {
                type: "arm",
                subtype: "heavy"
            }, {type: "rotary"}, {type: "computer"}, {type: "cart"}]
        }, // === Infrastructure ===
        {
            usage: "Communications Backbone", modules: [{type: "pole"}, {type: "battery"}, {type: "communications"}]
        }, {
            usage: "Solar Charging Station",
            modules: [{type: "pole"}, {type: "solar"}, {type: "battery"}, {type: "rotary"}, {type: "computer"}]
        }, // === Mapping/Monitoring Variants ===
        {
            usage: "Topographic Mapping UGV",
            modules: [{type: "transport", subtype: "ground"}, {type: "battery"}, {type: "gps"}, {
                type: "camera",
                subtype: "rgb"
            }, {type: "sensor", subtype: "soil"}, {type: "sensor", subtype: "lidar"}]
        }, {
            usage: "Topographic Mapping Drone",
            modules: [{type: "transport", subtype: "flying"}, {type: "battery"}, {type: "gps"}, {
                type: "camera",
                subtype: "rgb"
            }, {type: "sensor", subtype: "lidar"}]
        }, // === Habitat & Sensor Deployment (LIDAR variant) ===
        {
            usage: "Habitat LIDAR Mapping",
            modules: [{type: "transport", subtype: "ground"}, {type: "battery"}, {
                type: "sensor",
                subtype: "lidar"
            }, {type: "camera", subtype: "rgb"}, {type: "sensor", subtype: "soil"}, {type: "gps"}]
        }, // === Harvest/Monitor (LIDAR add-on) ===
        {
            usage: "LIDAR Harvester",
            modules: [{type: "transport", subtype: "ground"}, {type: "battery"}, {type: "gps"}, {
                type: "arm",
                subtype: "medium"
            }, {type: "camera", subtype: "rgb"}, {type: "sensor", subtype: "lidar"}, {
                type: "tool",
                subtype: "gripper"
            }, {type: "cart"}]
        }]
    const activeAssemblies = ref([{
        id: '65012c5e-0ef3-488f-98e4-3a4366b3eb17',
        modules: [{type: "internalSpace"}, {type: "actuator", subtype: "static"}, {type: "heating"}, {
            type: "sensor",
            subtype: "temp"
        }, {type: "sensor", subtype: "ph"}, {
            type: "sensor",
            subtype: "gas"
        }, {type: "tank"}, {type: "press"}, {type: "generator"}],
        name: "Bioreactor",
        deployed: false,
        built: false,
        moves: 0,
        actions: 1
    }, {
        id: 'af97e85f-4696-4ff2-8f43-3b3e742b94c2',
        modules: [{type: 'transport'}, {type: 'arm'}, {type: 'seeder'}, {type: 'borer'}],
        name: "Seed Planter",
        deployed: false,
        built: false,
        moves: 1,
        actions: 1
    }, {
        id: 'af97e85f-4696-4ff2-8f43-3b3e742b94c3',
        modules: [{type: 'transport'}, {type: 'arm'}, {type: 'cart', subtype: 'animal'}, {type: 'battery'}],
        name: "Animal Harvester",
        deployed: false,
        built: false,
        moves: 1,
        actions: 1
    }, {
        id: '01c181ea-b591-4a7c-bc2b-0ee06c2e1287',
        modules: [{type: 'transport', subtype: 'ground'}, {type: 'cart'}, {
            type: 'arm',
            subtype: 'heavy'
        }, {type: 'tool', subtype: 'gripper'}, {type: 'alarm', subtype: 'electric'}],
        name: "Cow Mover",
        deployed: false,
        built: false,
        moves: 2,
        actions: 2
    }, {
        id: '4be9bc91-75d8-457d-bdc1-1df33792e5e8',
        modules: [{type: 'transport'}, {type: 'battery'}, {type: 'arm', subtype: 'medium'}, {type: 'gripper'}],
        name: "Cow Milker",
        deployed: false,
        built: false,
        moves: 2,
        actions: 2
    }, {
        id: 'cbee372c-685d-428d-aeb1-8274345d53cc', modules: [{type: 'transport'}, {type: 'arm'}, {type: 'cart'}, {
            type: "tool", subtype: "pitchfork"
        }, {type: 'battery'}], name: "Field Fertilizer", deployed: false, built: false, moves: 1, actions: 1
    }, {
        id: 'f69f8fa3-dfd8-4f19-866e-e12c576c111e',
        modules: [{type: 'transport', subtype: 'ground'}, {type: 'battery'}, {
            type: 'arm',
            subtype: 'heavy'
        }, {type: 'tool', subtype: 'cutter'}],
        name: "Cow Harvester",
        deployed: false,
        built: false,
        moves: 1,
        actions: 1
    }, {
        id: 'f69f8fa3-dfd8-4f19-866e-e12c576c111f',
        modules: [{type: 'transport'}, {type: 'battery'}, {type: 'camera', subtype: 'rgb'}, {
            type: 'arm',
            subtype: 'medium'
        }, {type: 'cart'}, {type: 'gripper'}],
        name: "Corn Cob Collector   ",
        deployed: false,
        built: false,
        moves: 1,
        actions: 1
    }, {
        id: 'f69f8fa3-dfd8-4f19-866e-e12c576c112a',
        modules: [{type: 'transport'}, {type: 'arm'}, {type: 'cart'}, {type: 'tank'}, {type: "valve"}, {type: 'battery'}],
        name: "Animal Feeder",
        deployed: false,
        built: false,
        moves: 1,
        actions: 1
    },

    ])
    const currentAssembly = ref([])
    return {availableModules, activeAssemblies, premadeAssemblies, currentAssembly, constants}
})
