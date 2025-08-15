import { defineStore } from 'pinia'
import { ref } from 'vue'

export const modulesStore = defineStore('modulesStore', () => {
    const constants = ref({
        units: { electricity: 'kWh', water: 'm³', waste: 'ton', batteryPack: 'pack' },
        battery: { moduleKey: 'battery', kWhPerPack: 5 }
    })

    // ---- BATTERY / BASES / SUPPORTS ----
    const batteryAndBases = [
        { key:'battery_pack', name:'Battery Pack', type:'battery', subtype:null,
            mass:12, volume:8, cost:60, electricity:0, carryingCapacity:0, operationalStrength:0,
            capacity:0, slots:0, parentSlotsUsed:1, requires:[], count:0 },

        { key:'ugv_small', name:'UGV Transport (small)', type:'transport', subtype:'ground',
            mass:55, volume:90, cost:200, electricity:-0.4, carryingCapacity:60, operationalStrength:1,
            capacity:0, slots:6, parentSlotsUsed:0, requires:['gps','communications','battery'], count:0 },

        { key:'ugv_large', name:'UGV Transport (large)', type:'transport', subtype:'ground',
            mass:85, volume:140, cost:320, electricity:-0.6, carryingCapacity:120, operationalStrength:1,
            capacity:0, slots:8, parentSlotsUsed:0, requires:['gps','communications','battery','battery'], count:0 },

        { key:'drone_quad', name:'Drone Transport (quadcopter)', type:'transport', subtype:'flying',
            mass:8, volume:12, cost:250, electricity:-0.8, carryingCapacity:3, operationalStrength:1,
            capacity:0, slots:4, parentSlotsUsed:0, requires:['gps','communications','battery'], count:0 },

        { key:'drone_fixed', name:'Drone Transport (fixed wing)', type:'transport', subtype:'flying',
            mass:12, volume:18, cost:350, electricity:-0.6, carryingCapacity:5, operationalStrength:2,
            capacity:0, slots:6, parentSlotsUsed:0, requires:['gps','communications','battery'], count:0 },

        { key:'pole', name:'Pole', type:'support', subtype:'pole',
            mass:10, volume:20, cost:40, electricity:0, carryingCapacity:15, operationalStrength:0,
            capacity:0, slots:3, parentSlotsUsed:0, requires:[], count:0 },

        { key:'shelf_rack', name:'Shelf Rack', type:'support', subtype:'shelfRack',
            mass:18, volume:40, cost:35, electricity:0, carryingCapacity:30, operationalStrength:0,
            capacity:0, slots:2, parentSlotsUsed:0, requires:[], count:0 },
    ]

    // ---- ARMS ----
    const arms = [
        { key:'arm_small', name:'Robotic Arm (small)', type:'arm', subtype:'small',
            mass:12, volume:12, cost:70, electricity:-0.4, carryingCapacity:3, operationalStrength:1,
            capacity:0, slots:1, parentSlotsUsed:1, requires:['transport','battery'], count:0 },

        { key:'arm_medium', name:'Robotic Arm (medium)', type:'arm', subtype:'medium',
            mass:18, volume:20, cost:100, electricity:-0.6, carryingCapacity:5, operationalStrength:2,
            capacity:0, slots:2, parentSlotsUsed:1, requires:['transport','battery'], count:0 },

        { key:'arm_heavy', name:'Robotic Arm (heavy)', type:'arm', subtype:'heavy',
            mass:28, volume:30, cost:160, electricity:-0.8, carryingCapacity:12, operationalStrength:3,
            capacity:0, slots:1, parentSlotsUsed:1, requires:['transport','battery'], count:0 },
    ]

    // ---- TOOLS & ATTACHMENTS ----
    const tools = [
        { key:'tool_borer', name:'Hole-Borer', type:'tool', subtype:'borer',
            mass:6, volume:8, cost:40, electricity:-0.4, carryingCapacity:0, operationalStrength:2,
            capacity:0, slots:0, parentSlotsUsed:1, requires:['arm','battery'], count:0 },

        { key:'tool_gripper', name:'Gripper', type:'tool', subtype:'gripper',
            mass:4, volume:5, cost:30, electricity:-0.2, carryingCapacity:0, operationalStrength:2,
            capacity:0, slots:0, parentSlotsUsed:1, requires:['arm','battery'], count:0 },

        { key:'tool_cutter', name:'Cutter/Saw', type:'tool', subtype:'cutter',
            mass:5, volume:6, cost:35, electricity:-0.5, carryingCapacity:0, operationalStrength:2,
            capacity:0, slots:0, parentSlotsUsed:1, requires:['arm','battery'], count:0 },

        { key:'tool_pruner', name:'Pruner', type:'tool', subtype:'pruner',
            mass:3, volume:4, cost:32, electricity:-0.2, carryingCapacity:0, operationalStrength:2,
            capacity:0, slots:0, parentSlotsUsed:1, requires:['arm','battery'], count:0 },

        { key:'tool_suction', name:'Suction Tool', type:'tool', subtype:'suction',
            mass:3, volume:4, cost:25, electricity:-0.3, carryingCapacity:0, operationalStrength:1,
            capacity:1, slots:0, parentSlotsUsed:1, requires:['arm','battery'], count:0 },

        { key:'tool_seeder', name:'Seeder', type:'tool', subtype:'seeder',
            mass:10, volume:15, cost:45, electricity:-0.1, carryingCapacity:0, operationalStrength:2,
            capacity:5, slots:0, parentSlotsUsed:1, requires:['transport','battery'], count:0 },

        { key:'tool_digger', name:'Digger', type:'tool', subtype:'digger',
            mass:7, volume:9, cost:50, electricity:-0.5, carryingCapacity:0, operationalStrength:3,
            capacity:0, slots:0, parentSlotsUsed:1, requires:['arm','battery'], count:0 },

        { key:'tool_brush', name:'Brush Tool', type:'tool', subtype:'brush',
            mass:4, volume:6, cost:30, electricity:-0.2, carryingCapacity:0, operationalStrength:1,
            capacity:0, slots:0, parentSlotsUsed:1, requires:['arm','battery'], count:0 },

        { key:'tool_rotating', name:'Rotating Blades', type:'tool', subtype:'rotatingblades',
            mass:5, volume:7, cost:45, electricity:-1.5, carryingCapacity:0, operationalStrength:3,
            capacity:0, slots:0, parentSlotsUsed:1, requires:['arm','battery'], count:0 },

        { key:'tool_pitchfork', name:'Pitchfork', type:'tool', subtype:'pitchfork',
            mass:2, volume:3, cost:28, electricity:0, carryingCapacity:0, operationalStrength:1,
            capacity:0, slots:0, parentSlotsUsed:1, requires:['arm'], count:0 },

        { key:'tool_flattener', name:'Flattener Module', type:'tool', subtype:'flattener',
            mass:12, volume:20, cost:60, electricity:0, carryingCapacity:0, operationalStrength:2,
            capacity:0, slots:0, parentSlotsUsed:1, requires:[], count:0 },

        { key:'tool_grader', name:'Grader Module', type:'tool', subtype:'grader',
            mass:14, volume:24, cost:70, electricity:-0.3, carryingCapacity:0, operationalStrength:3,
            capacity:0, slots:0, parentSlotsUsed:1, requires:['battery'], count:0 },

        { key:'tool_anchor', name:'Anchor Driver Module', type:'tool', subtype:'anchor_driver',
            mass:9, volume:12, cost:55, electricity:-0.5, carryingCapacity:0, operationalStrength:3,
            capacity:0, slots:0, parentSlotsUsed:1, requires:['arm','battery'], count:0 },
    ]

    // ---- FIELD: CARRY / SPRAY / STORAGE ----
    const fieldModules = [
        { key:'cart_std', name:'Cart', type:'cart',
            mass:15, volume:50, cost:60, electricity:0, carryingCapacity:0, operationalStrength:0,
            capacity:100, slots:0, parentSlotsUsed:1, requires:['transport'], count:0 },

        { key:'tank_std', name:'Tank', type:'tank',
            mass:20, volume:60, cost:70, electricity:0, carryingCapacity:0, operationalStrength:0,
            capacity:50, slots:0, parentSlotsUsed:1, requires:['transport'], count:0 },

        { key:'sprayer_std', name:'Sprayer', type:'sprayer',
            mass:6, volume:8, cost:40, electricity:-0.3, carryingCapacity:0, operationalStrength:2,
            capacity:2, slots:0, parentSlotsUsed:1, requires:['transport','tank','battery'], count:0 },

        { key:'spreader_fertilizer', name:'Fertilizer Spreader', type:'spreader',
            mass:10, volume:15, cost:45, electricity:-0.2, carryingCapacity:0, operationalStrength:2,
            capacity:30, slots:0, parentSlotsUsed:1, requires:['transport','battery'], count:0 },

        { key:'seed_box', name:'Seed Box', type:'seedbox',
            mass:5, volume:10, cost:20, electricity:0, carryingCapacity:0, operationalStrength:0,
            capacity:20, slots:0, parentSlotsUsed:1, requires:['transport'], count:0 },
    ]

    // ---- SENSORS / IMAGING / NAV ----
    const sensorsAndImaging = [
        // Air & weather
        { key:'sensor_air_temp', name:'Air Thermometer', type:'sensor', subtype:'air_temp',
            mass:0.3, volume:0.2, cost:25, electricity:-0.05, carryingCapacity:0, operationalStrength:0,
            capacity:0, slots:0, parentSlotsUsed:1, requires:['battery'], count:0 },

        { key:'sensor_air_humidity', name:'Hygrometer', type:'sensor', subtype:'air_humidity',
            mass:0.3, volume:0.2, cost:25, electricity:-0.05, carryingCapacity:0, operationalStrength:0,
            capacity:0, slots:0, parentSlotsUsed:1, requires:['battery'], count:0 },

        { key:'sensor_barometer', name:'Barometer', type:'sensor', subtype:'pressure',
            mass:0.4, volume:0.2, cost:30, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'sensor_anemometer', name:'Wind Speed (Anemometer)', type:'sensor', subtype:'wind_speed',
            mass:0.8, volume:0.6, cost:35, electricity:-0.08, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'sensor_wind_vane', name:'Wind Direction (Vane)', type:'sensor', subtype:'wind_dir',
            mass:0.6, volume:0.5, cost:25, electricity:-0.03, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'sensor_rain_gauge', name:'Rain Gauge', type:'sensor', subtype:'rainfall',
            mass:0.9, volume:0.8, cost:30, electricity:-0.03, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'sensor_pyranometer', name:'Solar Radiation (Pyranometer)', type:'sensor', subtype:'solar_rad',
            mass:0.7, volume:0.6, cost:45, electricity:-0.08, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'sensor_par', name:'PAR Sensor', type:'sensor', subtype:'par',
            mass:0.6, volume:0.5, cost:45, electricity:-0.08, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'sensor_uv', name:'UV Index Sensor', type:'sensor', subtype:'uv',
            mass:0.4, volume:0.3, cost:35, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        // Soil
        { key:'sensor_soil_moisture', name:'Soil Moisture Probe', type:'sensor', subtype:'soil_moisture',
            mass:0.8, volume:0.6, cost:35, electricity:-0.08, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'sensor_soil_temp', name:'Soil Thermometer', type:'sensor', subtype:'soil_temp',
            mass:0.5, volume:0.4, cost:30, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        // Water
        { key:'sensor_water_level', name:'Water Level Sensor', type:'sensor', subtype:'water_level',
            mass:0.8, volume:0.7, cost:40, electricity:-0.08, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'sensor_flow_meter', name:'Flow Meter', type:'sensor', subtype:'flow',
            mass:1.0, volume:0.8, cost:45, electricity:-0.1, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'sensor_turbidity', name:'Turbidity Sensor', type:'sensor', subtype:'turbidity',
            mass:0.9, volume:0.7, cost:45, electricity:-0.1, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        // Plant / canopy
        { key:'sensor_leaf_wetness', name:'Leaf Wetness Sensor', type:'sensor', subtype:'leaf_wetness',
            mass:0.3, volume:0.2, cost:30, electricity:-0.03, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'sensor_chlorophyll', name:'Leaf Chlorophyll Meter', type:'sensor', subtype:'chlorophyll_spad',
            mass:0.6, volume:0.5, cost:60, electricity:-0.1, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        // Nav / topo
        { key:'gps_basic', name:'GPS Module', type:'gps', subtype:'basic',
            mass:0.5, volume:0.4, cost:20, electricity:-0.1, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'gps_rtk', name:'RTK GPS Module', type:'gps', subtype:'rtk',
            mass:0.9, volume:0.6, cost:120, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'sensor_lidar', name:'LIDAR Module', type:'sensor', subtype:'lidar',
            mass:2.2, volume:2.0, cost:100, electricity:-0.8, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        // Cameras
        { key:'camera_rgb', name:'RGB Camera', type:'camera', subtype:'rgb',
            mass:0.8, volume:0.7, cost:50, electricity:-0.5, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'camera_ms', name:'Multispectral Camera', type:'camera', subtype:'ms',
            mass:1.2, volume:1.0, cost:70, electricity:-0.7, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'camera_ir', name:'Thermal IR Camera', type:'camera', subtype:'ir',
            mass:1.0, volume:0.9, cost:65, electricity:-0.6, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        // Other sensors
        { key:'sensor_weighing', name:'Weighing module', type:'sensor', subtype:'weighing',
            mass:5, volume:6, cost:25, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },
    ]

    // ---- COMMS / POWER / FLUID ----
    const infra = [
        { key:'comms_repeater', name:'Communications Repeater', type:'communications', subtype:'repeater',
            mass:8, volume:10, cost:300, electricity:-0.2, carryingCapacity:0, operationalStrength:0,
            capacity:0, slots:0, parentSlotsUsed:1, requires:['battery'], count:0 },

        { key:'radio_client', name:'Radio Client', type:'communications', subtype:'client',
            mass:1, volume:1, cost:120, electricity:-0.1, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'controller_rt', name:'Real-Time Controller', type:'computer', subtype:'rt_control',
            mass:1.5, volume:1.2, cost:180, electricity:-0.15, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'solar_panel', name:'Solar Panel', type:'solar', subtype:null,
            mass:10, volume:15, cost:50, electricity:+0.15, capacity:0, slots:0, parentSlotsUsed:1,
            requires:[], count:0 },

        { key:'valve_inline', name:'Valve module', type:'valve', subtype:null,
            mass:2, volume:1, cost:35, electricity:-0.1, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['tank','battery'], count:0 },

        { key:'pump_inline', name:'Pump module', type:'pump', subtype:null,
            mass:7, volume:10, cost:60, electricity:-0.5, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['tank','battery'], count:0 },

        // environment control for internal spaces
        { key:'heating', name:'Heating Module', type:'heating', subtype:null,
            mass:20, volume:30, cost:60, electricity:-0.6, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'humidifier', name:'Heater/Humidifier module', type:'humidifier', subtype:null,
            mass:15, volume:25, cost:40, electricity:-0.4, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },
    ]

// ---- ENCLOSURES ----
    const enclosures = [
        { key:'internal_space', name:'Internal Space', type:'internalSpace', subtype:null,
            mass:500, volume:1200, cost:1500, electricity:0, carryingCapacity:2000, operationalStrength:0,
            capacity:0, slots:16, parentSlotsUsed:0, requires:[], count:0 },
    ]

// ---- CCC (compute + core comms) ----
    const cccModules = [
        { key:'server_rack', name:'Server Rack', type:'computer', subtype:'server',
            mass:120, volume:200, cost:4000, electricity:-2.5, capacity:0, slots:2, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'storage_array', name:'Storage Array', type:'computer', subtype:'storage',
            mass:80, volume:150, cost:2500, electricity:-1.2, capacity:0, slots:1, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'core_router', name:'Core Router', type:'communications', subtype:'router_core',
            mass:10, volume:12, cost:1200, electricity:-0.5, capacity:0, slots:2, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'antenna_mast', name:'Antenna Mast', type:'support', subtype:'antenna',
            mass:50, volume:120, cost:600, electricity:0, carryingCapacity:25, operationalStrength:0,
            capacity:0, slots:3, parentSlotsUsed:0, requires:[], count:0 },

        { key:'hvac_unit', name:'HVAC Unit', type:'hvac', subtype:null,
            mass:60, volume:100, cost:1500, electricity:-1.2, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },
    ]

// ---- MAS (storage + manipulation for assembly) ----
    const masModules = [
        { key:'shelf_robotic', name:'Robotic Shelf', type:'shelf', subtype:'robotic',
            mass:40, volume:90, cost:900, electricity:-0.4, carryingCapacity:80, operationalStrength:0,
            capacity:0, slots:4, parentSlotsUsed:1, requires:['battery'], count:0 },

        { key:'conveyor', name:'Conveyor', type:'conveyor', subtype:null,
            mass:30, volume:80, cost:700, electricity:-0.6, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'sensor_rfid', name:'RFID/Barcode Reader', type:'sensor', subtype:'rfid',
            mass:0.7, volume:0.5, cost:80, electricity:-0.1, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },
    ]

    //Collar
    const collar = [

        { key:'animal_collar', name:'Animal Collar', type:'collar', subtype:null,
            mass:0.2, volume:0.1, cost:1, electricity:0, slots:2, parentSlotsUsed:0, requires:['battery'], count:0 },

        { key:'alarm_audio', name:'Audio Alarm', type:'alarm', subtype:'audio',
            mass:0.1, volume:0.05, cost:2, electricity:-0.02, slots:0, parentSlotsUsed:1, requires:['battery'], count:0 },

        { key:'alarm_electric', name:'Mild Shocker', type:'alarm', subtype:'electric',
            mass:0.1, volume:0.05, cost:2, electricity:-0.02, slots:0, parentSlotsUsed:1, requires:['battery'], count:0 }
    ]

    // ---- BIOGAS PLANT (modules) ----
    const biogas = [
        // Feed handling
        { key:'feed_hopper', name:'Feed Hopper', type:'feed', subtype:null,
            mass:120, volume:300, cost:1800, electricity:0, capacity:200, slots:0, parentSlotsUsed:1,
            requires:[], count:0 },

        { key:'feed_shredder', name:'Shredder/Macerator', type:'pretreat', subtype:null,
            mass:90, volume:120, cost:2500, electricity:-2.0, capacity:10, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'feed_auger', name:'Auger Conveyor', type:'conveyor', subtype:'auger',
            mass:80, volume:150, cost:2200, electricity:-1.0, capacity:8, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'slurry_pump', name:'Slurry Pump', type:'pump', subtype:'slurry',
            mass:60, volume:80, cost:1800, electricity:-1.5, capacity:12, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        // Digester core
        { key:'digester_tank', name:'Digester Tank', type:'vessel', subtype:null,
            mass:3000, volume:10000, cost:40000, electricity:0, capacity:1000, slots:4, parentSlotsUsed:1,
            requires:[], count:0 },

        { key:'digester_mixer', name:'Digester Mixer/Agitator', type:'mixer', subtype:null,
            mass:120, volume:200, cost:6000, electricity:-2.0, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'digester_heater', name:'Heater Coil', type:'heater', subtype:null,
            mass:90, volume:120, cost:4500, electricity:-0.5, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'heat_exchanger', name:'Heat Exchanger (CHP→Digester)', type:'heat_xfer', subtype:null,
            mass:120, volume:160, cost:5200, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'sensor_digester_temp', name:'Digester Temperature', type:'sensor', subtype:'digester_temp',
            mass:1, volume:1, cost:120, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'sensor_digester_ph', name:'Digester pH', type:'sensor', subtype:'ph',
            mass:1, volume:1, cost:150, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        // Gas handling
        { key:'gasholder', name:'Gas Holder/Dome', type:'gas_storage', subtype:null,
            mass:500, volume:1500, cost:9000, electricity:0, capacity:300, slots:1, parentSlotsUsed:1,
            requires:[], count:0 },

        { key:'gas_blower', name:'Gas Blower', type:'gas_move', subtype:null,
            mass:45, volume:60, cost:2000, electricity:-0.6, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'gas_condenser', name:'Gas Cooler/Condenser', type:'gas_dry', subtype:null,
            mass:70, volume:90, cost:2800, electricity:-0.4, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        // Gas cleaning and safety
        { key:'h2s_scrubber_ac', name:'H2S Scrubber (Activated Carbon)', type:'gas_clean', subtype:'h2s_ac',
            mass:180, volume:220, cost:6500, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'h2s_scrubber_btf', name:'H2S Biotrickling Filter', type:'gas_clean', subtype:'h2s_btf',
            mass:350, volume:500, cost:12000, electricity:-0.8, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'gas_filter_partic', name:'Particulate Filter', type:'gas_filter', subtype:null,
            mass:25, volume:30, cost:800, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'gas_regulator', name:'Pressure Regulator', type:'gas_control', subtype:null,
            mass:10, volume:8, cost:600, electricity:0, capacity:0, slots:0, parentSlotsUsed:1,
            requires:[], count:0 },

        { key:'flame_arrester', name:'Flame Arrester', type:'safety', subtype:null,
            mass:18, volume:12, cost:900, electricity:0, capacity:0, slots:0, parentSlotsUsed:1,
            requires:[], count:0 },

        { key:'safety_relief', name:'Relief Valve', type:'safety', subtype:null,
            mass:12, volume:8, cost:500, electricity:0, capacity:0, slots:0, parentSlotsUsed:1,
            requires:[], count:0 },

        { key:'flare_stack', name:'Emergency Flare', type:'flare', subtype:null,
            mass:180, volume:300, cost:7000, electricity:0, capacity:0, slots:0, parentSlotsUsed:1,
            requires:[], count:0 },

        { key:'sensor_gas_flow', name:'Gas Flow Meter', type:'sensor', subtype:'gas_flow',
            mass:3, volume:2, cost:600, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'sensor_gas_ch4', name:'Methane Analyzer', type:'sensor', subtype:'ch4',
            mass:4, volume:3, cost:1800, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'sensor_gas_h2s', name:'H2S Analyzer', type:'sensor', subtype:'h2s',
            mass:4, volume:3, cost:1600, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'sensor_gas_pressure', name:'Gas Pressure', type:'sensor', subtype:'gas_pressure',
            mass:1, volume:1, cost:200, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        // Power utilisation (CHP)
        { key:'biogas_engine', name:'Biogas Engine', type:'engine', subtype:null,
            mass:1200, volume:2500, cost:45000, electricity:-1.0, capacity:0, slots:1, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'generator_alt', name:'Generator/Alternator', type:'generator', subtype:null,
            mass:600, volume:1200, cost:22000, electricity:+2.0, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['engine'], count:0 },

        { key:'chp_heat_recovery', name:'CHP Heat Recovery', type:'heat_recovery', subtype:null,
            mass:200, volume:300, cost:9000, electricity:-0.3, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['engine'], count:0 },

        { key:'grid_inverter', name:'Grid-Tie Inverter/Switchgear', type:'power_elec', subtype:null,
            mass:150, volume:200, cost:12000, electricity:-0.3, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['generator'], count:0 },

        // Digestate handling
        { key:'separator_press', name:'Screw Press Separator', type:'separator', subtype:null,
            mass:350, volume:500, cost:18000, electricity:-1.2, capacity:15, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'digestate_pump', name:'Digestate Pump', type:'pump', subtype:'digestate',
            mass:45, volume:60, cost:1400, electricity:-1.0, capacity:10, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        { key:'digestate_tank', name:'Digestate Storage Tank', type:'tank', subtype:'digestate',
            mass:1200, volume:8000, cost:20000, electricity:0, capacity:800, slots:0, parentSlotsUsed:1,
            requires:[], count:0 },
    ]

    // ---- MYCELIUM BOX REACTOR (modules) ----
    const mycelium = [
        // Substrate prep
        { key:'substrate_mixer', name:'Substrate Mixer/Tumbler', type:'mixer', subtype:null,
            mass:120, volume:200, cost:3800, electricity:-0.8, capacity:150, slots:0, parentSlotsUsed:1,
            requires:['internalSpace','battery'], count:0 },

        { key:'steam_generator', name:'Steam Generator', type:'steam_gen', subtype:null,
            mass:140, volume:220, cost:5200, electricity:-2.0, capacity:50, slots:0, parentSlotsUsed:1,
            requires:['internalSpace','battery'], count:0 },

        { key:'sterilizer_autoclave', name:'Autoclave (Substrate Sterilizer)', type:'sterilizer', subtype:'autoclave',
            mass:180, volume:260, cost:7800, electricity:-1.5, capacity:40, slots:0, parentSlotsUsed:1,
            requires:['internalSpace','steam_gen','battery'], count:0 },

        { key:'pasteurizer_tank', name:'Pasteurizer Tank', type:'pasteurizer', subtype:null,
            mass:160, volume:280, cost:6400, electricity:-1.2, capacity:80, slots:0, parentSlotsUsed:1,
            requires:['internalSpace','steam_gen','battery'], count:0 },

        // Clean air / biosafety
        { key:'laminar_flow_hood', name:'Laminar Flow Hood', type:'air_clean', subtype:'laminar',
            mass:90, volume:140, cost:3500, electricity:-0.6, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['internalSpace','battery'], count:0 },

        { key:'hepa_filter_unit', name:'HEPA Filter Unit', type:'air_filter', subtype:'hepa',
            mass:40, volume:80, cost:1200, electricity:-0.3, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['internalSpace','battery'], count:0 },

        { key:'air_circulation_fan', name:'Air Circulation Fan', type:'fan', subtype:null,
            mass:20, volume:40, cost:600, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['internalSpace','battery'], count:0 },

        // Inoculation
        { key:'spawn_dispenser', name:'Spawn/Inoculum Dispenser', type:'dispenser', subtype:'spawn',
            mass:25, volume:35, cost:2400, electricity:-0.4, capacity:10, slots:0, parentSlotsUsed:1,
            requires:['internalSpace','laminar_flow_hood','battery'], count:0 },

        // Incubation / growth
        { key:'grow_tray_set', name:'Grow Tray Set', type:'tray', subtype:null,
            mass:15, volume:30, cost:400, electricity:0, capacity:20, slots:0, parentSlotsUsed:1,
            requires:['internalSpace'], count:0 },

        { key:'co2_sensor_air', name:'CO₂ Sensor (Air)', type:'sensor', subtype:'co2',
            mass:0.6, volume:0.5, cost:140, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['battery'], count:0 },

        // Forming / pressing
        { key:'box_mold_frame', name:'Box Mold Frame', type:'mold', subtype:'box',
            mass:30, volume:50, cost:900, electricity:0, capacity:4, slots:0, parentSlotsUsed:1,
            requires:['internalSpace'], count:0 },

        // Drying / curing
        { key:'dehydrator_rack', name:'Dehydrator Rack', type:'dryer', subtype:'dehydrator',
            mass:120, volume:220, cost:4200, electricity:-1.2, capacity:30, slots:0, parentSlotsUsed:1,
            requires:['internalSpace','battery'], count:0 },

        { key:'dehumidifier_unit', name:'Dehumidifier', type:'dehumidifier', subtype:null,
            mass:45, volume:70, cost:1100, electricity:-0.6, capacity:0, slots:0, parentSlotsUsed:1,
            requires:['internalSpace','battery'], count:0 },
    ]

    const availableModules = ref([
        ...batteryAndBases,
        ...arms,
        ...tools,
        ...fieldModules,
        ...sensorsAndImaging,
        ...infra,
        ...enclosures,
        ...cccModules,
        ...masModules,
        ...biogas,
        ...mycelium,
        ...collar
    ])

    const premadeAssemblies = [
        {
        usage: 'Animal Geofencing Collar',
        modules: [{type: 'collar'}, {type: 'battery'}, {type: 'alarm', subtype: 'audio'}, {
            type: 'alarm', subtype: 'electric'
        }, {type: 'gps'}]
    }]
    const activeAssemblies = ref([
        {
            id: 'af97e85f-4696-4ff2-8f43-3b3e742b94c2',
            modules: [
                { type: 'transport', subtype: 'ground' },
                { type: 'arm', subtype: 'medium' },
                { type: 'tool', subtype: 'seeder' },
                { type: 'tool', subtype: 'borer' }
            ],
            name: "Seed Planter",
            deployed: false,
            built: false,
            moves: 1,
            actions: 1
        }
    ])
    const currentAssembly = ref([])
    return {availableModules, activeAssemblies, premadeAssemblies, currentAssembly, constants}
})
