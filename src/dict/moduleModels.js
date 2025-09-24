

 const constants = {
    units: { electricity: 'kWh', water: 'm3', waste: 'ton' },
    battery: { moduleKey: 'battery_pack', kWhPerPack: 1 }
};

 const moduleTypes = [
    {
        key: 'air_circulation_fan',
        name: 'Air Circulation Fan',
        type: 'fan',
        subtype: null,
        mass: 20,
        volume: 40,
        cost: 600,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {setAirflow: {params: {flow_cfm: Number}, caps: {flow_cfm: [50, 1000]}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'air_jet_bank',
        name: 'Air Jet Bank',
        type: 'actuator',
        subtype: 'air_jet',
        mass: 35,
        volume: 50,
        cost: 4500,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            fireAirJet: {
                params: {lane: Number, duration_ms: Number}, caps: {lanes: [2, 16], duration_ms: [10, 200]}
            }
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            actuation: Object
        }
    },

    {
        key: 'alarm_audio',
        name: 'Audio Alarm',
        type: 'alarm',
        subtype: 'audio',
        mass: 0.1,
        volume: 0.05,
        cost: 2,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            readAlarmStatus: {params: {}, caps: {}}, triggerAudioAlarm: {
                params: {level: Number, duration_s: Number}, caps: {level: [1, 10], duration_s: [1, 600]}
            }
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'alarm_electric',
        name: 'Mild Shocker',
        type: 'alarm',
        subtype: 'electric',
        mass: 0.1,
        volume: 0.05,
        cost: 2,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            readAlarmStatus: {params: {}, caps: {}}, triggerElectricAlarm: {
                params: {level: Number, duration_s: Number}, caps: {level: [1, 5], duration_s: [1, 10]}
            }
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'animal_collar',
        name: 'Animal Collar',
        type: 'collar',
        subtype: null,
        mass: 0.2,
        volume: 0.1,
        cost: 1,
        acesPorts: 2,
        parentPortsUsed: 0,
        exposedFunctions: {emitAlert: {params: {level: String}, caps: {}}, trackAnimal: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'antenna_mast',
        name: 'Antenna Mast',
        type: 'support',
        subtype: 'antenna',
        mass: 50,
        volume: 120,
        cost: 600,
        acesPorts: 3,
        parentPortsUsed: 0,
        exposedFunctions: {provideMountPoints: {params: {}, caps: {mount_points: 3}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            mountPoints_free: Number
        }
    },

     {
         key: 'arm_heavy',
         name: 'Robotic Arm (heavy)',
         type: 'arm',
         subtype: 'heavy',
         mass: 28,
         volume: 30,
         cost: 160,
         acesPorts: 1,
         parentPortsUsed: 1,
         exposedFunctions: {
             applyForce: {
                 params: { fx_N: Number, fy_N: Number, fz_N: Number, duration_s: Number },
                 caps: { fz_N: [-500, 500], duration_s: [0, 600] }
             },
             movePath: {
                 params: { path: { points: Array } },
                 caps: { reach_m: 1.2, max_payload_kg: 8 }
             },
             setPose: {
                 params: { x_m: Number, y_m: Number, z_m: Number, roll_rad: Number, pitch_rad: Number, yaw_rad: Number },
                 caps: { reach_m: 1.2, max_payload_kg: 8 }
             }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             localPosition_m: { x: Number, y: Number, z: Number },
             toolEuler_rad: { roll: Number, pitch: Number, yaw: Number },
             force_N: { fx: Number, fy: Number, fz: Number }
         }
     },

     {
         key: 'arm_medium',
         name: 'Robotic Arm (medium)',
         type: 'arm',
         subtype: 'medium',
         mass: 18,
         volume: 20,
         cost: 100,
         acesPorts: 2,
         parentPortsUsed: 1,
         exposedFunctions: {
             applyForce: {
                 params: { fx_N: Number, fy_N: Number, fz_N: Number, duration_s: Number },
                 caps: { fz_N: [-300, 300], duration_s: [0, 600] }
             },
             movePath: {
                 params: { path: { points: Array } },
                 caps: { reach_m: 1.1, max_payload_kg: 5 }
             },
             setPose: {
                 params: { x_m: Number, y_m: Number, z_m: Number, roll_rad: Number, pitch_rad: Number, yaw_rad: Number },
                 caps: { reach_m: 1.1, max_payload_kg: 5 }
             }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             localPosition_m: { x: Number, y: Number, z: Number },
             toolEuler_rad: { roll: Number, pitch: Number, yaw: Number },
             force_N: { fx: Number, fy: Number, fz: Number }
         }
     },

     {
         key: 'arm_small',
         name: 'Robotic Arm (small)',
         type: 'arm',
         subtype: 'small',
         mass: 12,
         volume: 12,
         cost: 70,
         acesPorts: 1,
         parentPortsUsed: 1,
         exposedFunctions: {
             applyForce: {
                 params: { fx_N: Number, fy_N: Number, fz_N: Number, duration_s: Number },
                 caps: { fz_N: [-200, 200], duration_s: [0, 600] }
             },
             movePath: {
                 params: { path: { points: Array } },
                 caps: { reach_m: 0.9, max_payload_kg: 3 }
             },
             setPose: {
                 params: { x_m: Number, y_m: Number, z_m: Number, roll_rad: Number, pitch_rad: Number, yaw_rad: Number },
                 caps: { reach_m: 0.9, max_payload_kg: 3 }
             }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             localPosition_m: { x: Number, y: Number, z: Number },
             toolEuler_rad: { roll: Number, pitch: Number, yaw: Number },
             force_N: { fx: Number, fy: Number, fz: Number }
         }
     }
,

     {
         key: 'bale_chamber',
         name: 'Bale Chamber',
         type: 'chamber',
         subtype: 'baler',
         mass: 180,
         volume: 300,
         cost: 7000,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             formBale: {
                 params: { size: { w_m: Number, h_m: Number, d_m: Number } },
                 caps: { w_m: [0.4, 1.2], h_m: [0.4, 1.2], d_m: [0.5, 2.0] }
             }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             mode: String,
             busy: Boolean,
             lastUpdateIso: String
         }
     }
     ,

    {
        key: 'bale_tier',
        name: 'Bale Tier',
        type: 'fastener',
        subtype: 'twine',
        mass: 25,
        volume: 40,
        cost: 2500,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            tie: {params: {pattern: String}, caps: {pattern: ['twine', 'strap']}}
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

     {
         key: 'battery_pack',
         name: 'Battery Pack',
         type: 'battery',
         subtype: null,
         mass: 12,
         volume: 8,
         cost: 60,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             acceptCharge: {
                 params: { power_W: Number, duration_s: Number },
                 caps: { power_W: [0, 1000] }
             },
             providePower: {
                 params: { power_W: Number },
                 caps: { power_W: [0, 1000] }
             },
             readPowerState: { params: {}, caps: {} }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             soc_pct: Number,
             voltage_V: Number,
             current_A: Number,
             temp_C: Number,
             charging: Boolean,
             chargeRate_W: Number
         }
     },

     {
         key: 'biogas_engine',
         name: 'Biogas Engine',
         type: 'engine',
         subtype: null,
         mass: 1200,
         volume: 2500,
         cost: 45000,
         acesPorts: 1,
         parentPortsUsed: 1,
         exposedFunctions: {
             generateShaftPower: {
                 params: { kW: Number },
                 caps: { kW: [0, 150], fuel: ['biogas'], min_CH4_pct: 45 }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     }
,

    {
        key: 'box_mold_frame',
        name: 'Box Mold Frame',
        type: 'mold',
        subtype: 'box',
        mass: 30,
        volume: 50,
        cost: 900,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            moldBox: {
                params: {dims: {w_m: Number, h_m: Number, d_m: Number}}, caps: {volume_L: [0.5, 5]}
            }
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'camera_ir',
        name: 'Thermal IR Camera',
        type: 'camera',
        subtype: 'ir',
        mass: 1.0,
        volume: 0.9,
        cost: 65,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {captureIR: {params: {res_px: Number}, caps: {temp_range_C: [-20, 200]}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'camera_ms',
        name: 'Multispectral Camera',
        type: 'camera',
        subtype: 'ms',
        mass: 1.2,
        volume: 1.0,
        cost: 70,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {captureMS: {params: {res_px: Number, bands: Number}, caps: {bands: [4, 12]}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'camera_multispectral',
        name: 'Camera Multispectral',
        type: 'sensor',
        subtype: 'camera_ms',
        mass: 1.2,
        volume: 1.0,
        cost: 70,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            captureCube: { params: { bands: Array, exposure_ms: Number, roi: 'image.roi' }, caps: {} },
            startStream: { params: { fps: Number, resolution: 'image.size' }, caps: {} },
            stopStream: { params: {}, caps: {} }
        },
        state: { health: { ok: Boolean, faultCode: String }, band_count: Number }
    },

    {
        key: 'camera_rgb',
        name: 'Camera RGB',
        type: 'sensor',
        subtype: 'camera_rgb',
        mass: 0.8,
        volume: 0.7,
        cost: 50,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            captureImage: { params: { exposure_ms: Number, gain: Number, roi: 'image.roi' }, caps: {} },
            startStream: { params: { fps: Number, resolution: 'image.size' }, caps: {} },
            stopStream: { params: {}, caps: {} }
        },
        state: { health: { ok: Boolean, faultCode: String }, streaming: Boolean, lens_focal_mm: Number }
    },

    {
        key: 'camera_thermal',
        name: 'Camera Thermal',
        type: 'sensor',
        subtype: 'camera_thermal',
        mass: 1.0,
        volume: 0.9,
        cost: 65,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            captureImage: { params: { emissivity: Number, roi: 'image.roi' }, caps: {} },
            startStream: { params: { fps: Number, resolution: 'image.size' }, caps: {} },
            stopStream: { params: {}, caps: {} }
        },
        state: { health: { ok: Boolean, faultCode: String }, temperatureRange_C: { min: Number, max: Number } }
    },

     {
         key: 'cart_std',
         name: 'Cart',
         type: 'cart',
         subtype: null,
         mass: 15,
         volume: 50,
         cost: 60,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             loadMaterial: {
                 params: { mass_kg: Number, volume_L: Number },
                 caps: { mass_kg: [0, 100], volume_L: [0, 100] }
             },
             readStatus: { params: {}, caps: {} },
             unloadMaterial: {
                 params: { mass_kg: Number, volume_L: Number },
                 caps: { mass_kg: [0, 100], volume_L: [0, 100] }
             }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             mode: String,
             busy: Boolean,
             lastUpdateIso: String
         }
     },

     {
         key: 'chp_heat_recovery',
         name: 'CHP Heat Recovery',
         type: 'heat_recovery',
         subtype: null,
         mass: 200,
         volume: 300,
         cost: 9000,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             recoverHeat: {
                 params: { kW: Number },
                 caps: { kW: [0, 80], inlet_temp_C: [60, 95], outlet_temp_C: [30, 85] }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

     {
         key: 'co2_sensor_air',
         name: 'CO₂ Sensor (Air)',
         type: 'sensor',
         subtype: 'co2',
         mass: 0.6,
         volume: 0.5,
         cost: 140,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: { readCO2Air: { params: {}, caps: { co2_ppm_range: [400, 50000] } } },
         state: {
             health: { ok: Boolean, faultCode: String },
             mode: String,
             busy: Boolean,
             lastUpdateIso: String,
             measurement: Object
         }
     },

    {
        key: 'comms_cellular',
        name: 'Comms Cellular',
        type: 'comms',
        subtype: 'lte5g',
        mass: 0.5,
        volume: 0.5,
        cost: 150,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: { setLink: { params: { target: ['opsEngine', 'peer'], qos: { latency_ms: Number, reliability: Number } }, caps: {} }, getLinkStatus: { params: {}, caps: {} } },
        state: { health: { ok: Boolean, faultCode: String }, rssi_dBm: Number, latency_ms: Number }
    },

    {
        key: 'comms_lorawan',
        name: 'Comms LoRaWAN',
        type: 'comms',
        subtype: 'lorawan',
        mass: 0.2,
        volume: 0.3,
        cost: 80,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: { joinNetwork: { params: { netId: String }, caps: {} }, getLinkStatus: { params: {}, caps: {} } },
        state: { health: { ok: Boolean, faultCode: String }, snr_dB: Number, spreadingFactor: Number }
    },

    {
        key: 'comms_repeater',
        name: 'Communications Repeater',
        type: 'communications',
        subtype: 'repeater',
        mass: 8,
        volume: 10,
        cost: 300,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            readCommsStatus: {params: {}, caps: {}},
            sendData: {params: {topic: String, bytes: 'Buffer'}, caps: {}},
            subscribeTopic: {params: {topic: String}, caps: {}}
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'compactor_chamber',
        name: 'Compactor Chamber',
        type: 'chamber',
        subtype: 'compactor',
        mass: 160,
        volume: 260,
        cost: 5000,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            receive: {params: {mass_kg: Number}, caps: {mass_kg: [0, 200]}}
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

     {
         key: 'compute_blade',
         name: 'Compute Blade',
         type: 'computer',
         subtype: 'edge_blade',
         mass: 4,
         volume: 6,
         cost: 900,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             runTask: {
                 params: { taskId: String, payload: Object },
                 caps: { max_runtime_s: 7200, max_mem_MB: 8192 }
             },
             scheduleTask: { params: { cron: String, taskId: String }, caps: {} }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             mode: String,
             busy: Boolean,
             lastUpdateIso: String
         }
     },

     {
         key: 'compute_edge',
         name: 'Edge Compute',
         type: 'compute',
         subtype: 'edge',
         mass: 5,
         volume: 8,
         cost: 1500,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             runModel: {
                 params: { modelId: String, inputsRef: String, params: Object },
                 caps: { max_runtime_s: 3600, max_mem_MB: 16384 }
             },
             reserveCompute: {
                 params: { cpu_cores: Number, gpu_frac: Number, mem_MB: Number, duration_s: Number },
                 caps: { cpu_cores: [0, 16], gpu_frac: [0, 1], mem_MB: [0, 65536], duration_s: [1, 86400] }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, cpu_load_pct: Number, mem_used_MB: Number }
     },

     {
         key: 'conditioner',
         name: 'Pellet Conditioner',
         type: 'conditioner',
         subtype: 'steam_water',
         mass: 70,
         volume: 110,
         cost: 3500,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             condition: {
                 params: { moisture_pct: Number, temp_C: Number },
                 caps: { moisture_pct: [8, 16], temp_C: [50, 85], dwell_s: [10, 600] }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

    {
        key: 'controller_rt',
        name: 'Real-Time Controller',
        type: 'computer',
        subtype: 'rt_control',
        mass: 1.5,
        volume: 1.2,
        cost: 180,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            readVariable: {params: {variable: String}, caps: {}},
            setControlCycle: {params: {period_ms: Number, programId: String}, caps: {period_ms: [5, 1000]}}
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'conveyor',
        name: 'Conveyor',
        type: 'conveyor',
        subtype: null,
        mass: 30,
        volume: 80,
        cost: 700,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            transferMass: {
                params: {mass_kg: Number, from: String, to: String}, caps: {mass_kg: [0, 50]}
            }
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'cooling_unit',
        name: 'Cooling Unit',
        type: 'cooling',
        subtype: null,
        mass: 55,
        volume: 95,
        cost: 1300,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {setAirTemp: {params: {temp_C: Number}, caps: {temp_C: [10, 30]}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'core_router',
        name: 'Core Router',
        type: 'communications',
        subtype: 'router_core',
        mass: 10,
        volume: 12,
        cost: 1200,
        acesPorts: 2,
        parentPortsUsed: 1,
        exposedFunctions: {
            readCommsStatus: {params: {}, caps: {}},
            sendData: {params: {topic: String, bytes: 'Buffer'}, caps: {}},
            subscribeTopic: {params: {topic: String}, caps: {}}
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'dehumidifier_unit',
        name: 'Dehumidifier',
        type: 'dehumidifier',
        subtype: null,
        mass: 45,
        volume: 70,
        cost: 1100,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {dehumidify: {params: {rh_setpoint_pct: Number}, caps: {rh_setpoint_pct: [30, 60]}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

     {
         key: 'dehydrator_rack',
         name: 'Dehydrator Rack',
         type: 'dryer',
         subtype: 'dehydrator',
         mass: 120,
         volume: 220,
         cost: 4200,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             dryDehydrate: {
                 params: { temp_C: Number, duration_s: Number, airflow_cfm: Number },
                 caps: { temp_C: [30, 90], duration_s: [3600, 86400], airflow_cfm: [50, 600] }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

     {
         key: 'digestate_pump',
         name: 'Digestate Pump',
         type: 'pump',
         subtype: 'digestate',
         mass: 45,
         volume: 60,
         cost: 1400,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             runPump: {
                 params: { flow_Lps: Number, duration_s: Number },
                 caps: { flow_Lps: [0.2, 2.0], duration_s: [1, 7200], max_head_m: 12 }
             },
             setPumpFlow: { params: { flow_Lps: Number }, caps: { flow_Lps: [0.2, 2.0] } }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

     {
         key: 'digestate_tank',
         name: 'Digestate Storage Tank',
         type: 'tank',
         subtype: 'digestate',
         mass: 1200,
         volume: 8000,
         cost: 20000,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             loadMaterial: { params: { volume_L: Number }, caps: { volume_L: [0, 8000] } },
             readCapacity: { params: {}, caps: { volume_L_max: 8000 } },
             readLevel: { params: {}, caps: { volume_L: [0, 8000] } },
             unloadMaterial: { params: { volume_L: Number }, caps: { volume_L: [0, 8000] } }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

    {
        key: 'digester_heater',
        name: 'Heater Coil',
        type: 'heater',
        subtype: null,
        mass: 90,
        volume: 120,
        cost: 4500,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {setAirTemp: {params: {temp_C: Number}, caps: {temp_C: [25, 55]}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

     {
         key: 'digester_mixer',
         name: 'Digester Mixer/Agitator',
         type: 'mixer',
         subtype: null,
         mass: 120,
         volume: 200,
         cost: 6000,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             mix: {
                 params: { rpm: Number, duration_s: Number },
                 caps: { rpm: [10, 120], duration_s: [1, 7200], max_torque_Nm: 1200 }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

     {
         key: 'digester_tank',
         name: 'Digester Tank',
         type: 'vessel',
         subtype: null,
         mass: 3000,
         volume: 10000,
         cost: 40000,
         acesPorts: 4,
         parentPortsUsed: 1,
         exposedFunctions: {
             store: {
                 params: { volume_L: Number },
                 caps: { volume_L: [0, 1000], temp_C: [30, 45], ph_range: [6.5, 8.0] }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

    {
        key: 'dock_beacon',
        name: 'Dock Nav Beacon',
        type: 'nav',
        subtype: 'beacon',
        mass: 1,
        volume: 1,
        cost: 60,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            beacon: {params: {}, caps: {}}
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

     {
         key: 'dock_charger_dc',
         name: 'Dock DC Charger',
         type: 'power',
         subtype: 'charger_dc',
         mass: 18,
         volume: 20,
         cost: 600,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             chargeDock: {
                 params: { kW: Number },
                 caps: { kW: [0, 3.0], battery_V: [24, 48] }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

    {
        key: 'dock_contacts',
        name: 'Dock Contacts',
        type: 'power',
        subtype: 'contacts',
        mass: 8,
        volume: 12,
        cost: 150,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            dockContacts: {params: {}, caps: {}}
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

     {
         key: 'drone_fixed',
         name: 'Drone Transport (fixed wing)',
         type: 'transport',
         subtype: 'flying',
         mass: 12,
         volume: 18,
         cost: 350,
         acesPorts: 6,
         parentPortsUsed: 0,
         exposedFunctions: {
             followPath: {
                 params: { path: 'geo.path', speed_mps: Number },
                 caps: { speed_mps: [10, 25] }
             },
             loiter: {
                 params: { duration_s: Number },
                 caps: { duration_s: [0, 900] }
             },
             takeoff: {
                 params: {},
                 caps: { max_payload_kg: 4.0, required_run_m: 10 }
             },
             land: {
                 params: { site: 'geo.coord' },
                 caps: { max_glide_slope_deg: 12 }
             },
             returnToBase: { params: {}, caps: {} },
             stopTransport: { params: {}, caps: {} }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             worldPose: {
                 position_m: { x: Number, y: Number, z: Number },
                 orientation_q: { qx: Number, qy: Number, qz: Number, qw: Number }
             },
             airspeed_mps: Number,
             battery_soc_pct: Number
         }
     },

     {
         key: 'drone_quad',
         name: 'Drone Transport (quadcopter)',
         type: 'transport',
         subtype: 'flying',
         mass: 8,
         volume: 12,
         cost: 250,
         acesPorts: 4,
         parentPortsUsed: 0,
         exposedFunctions: {
             followPath: {
                 params: { path: 'geo.path', speed_mps: Number },
                 caps: { speed_mps: [0, 12] }
             },
             loiter: {
                 params: { duration_s: Number },
                 caps: { duration_s: [0, 1800] }
             },
             takeoff: {
                 params: {},
                 caps: { max_payload_kg: 2.0, max_takeoff_altitude_m: 120 }
             },
             land: {
                 params: { site: 'geo.coord' },
                 caps: { max_descent_rate_mps: 3 }
             },
             returnToBase: { params: {}, caps: {} },
             stopTransport: { params: {}, caps: {} }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             worldPose: {
                 position_m: { x: Number, y: Number, z: Number },
                 orientation_q: { qx: Number, qy: Number, qz: Number, qw: Number }
             },
             velocity_mps: { x: Number, y: Number, z: Number },
             battery_soc_pct: Number,
             gps_quality: String
         }
     }     ,

    {
        key: 'eject_gate',
        name: 'Eject Gate',
        type: 'gate',
        subtype: 'diverter',
        mass: 20,
        volume: 30,
        cost: 900,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {setGatePosition: {params: {position: Number}, caps: {positions: [2, 4]}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'feed_auger',
        name: 'Auger Conveyor',
        type: 'conveyor',
        subtype: 'auger',
        mass: 80,
        volume: 150,
        cost: 2200,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            transferMass: {
                params: {mass_kg: Number, from: String, to: String}, caps: {mass_kg: [0, 80]}
            }
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

     {
         key: 'feed_hopper',
         name: 'Feed Hopper',
         type: 'feed',
         subtype: null,
         mass: 120,
         volume: 300,
         cost: 1800,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             feed: {
                 params: { mass_kg: Number, volume_L: Number },
                 caps: { volume_L: [0, 200] }
             }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             mode: String,
             busy: Boolean,
             lastUpdateIso: String
         }
     },
     {
        key: 'feed_shredder',
        name: 'Shredder/Macerator',
        type: 'pretreat',
        subtype: null,
        mass: 90,
        volume: 120,
        cost: 2500,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {grind: {params: {throughput_kgph: Number}, caps: {throughput_kgph: [50, 500]}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'feeder_screw',
        name: 'Feeder Screw',
        type: 'conveyor',
        subtype: 'screw_feed',
        mass: 60,
        volume: 120,
        cost: 4000,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            transfer: {params: {mass_kg: Number, from: String, to: String}, caps: {mass_kg: [0, 80]}}
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'fence_node',
        name: 'Fence Node',
        type: 'fence',
        subtype: 'node',
        mass: 1.2,
        volume: 1.5,
        cost: 90,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            pulse: {params: {level: Number, duration_ms: Number}, caps: {level: [1, 5], duration_ms: [10, 100]}},
            status: {params: {}, caps: {}}
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'flame_arrester',
        name: 'Flame Arrester',
        type: 'safety',
        subtype: null,
        mass: 18,
        volume: 12,
        cost: 900,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readFlameArresterStatus: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },
     {
         key: 'flare_stack',
         name: 'Emergency Flare',
         type: 'flare',
         subtype: null,
         mass: 180,
         volume: 300,
         cost: 7000,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             flareBurnoff: {
                 params: { rate_Nm3_h: Number },
                 caps: { rate_Nm3_h: [5, 300], min_CH4_pct: 20 }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     }
,

     {
         key: 'gas_blower',
         name: 'Gas Blower',
         type: 'gas_move',
         subtype: null,
         mass: 45,
         volume: 60,
         cost: 2000,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             moveGas: {
                 params: { flow_Nm3_h: Number },
                 caps: { flow_Nm3_h: [5, 200], max_pressure_kPa: 50 }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

     {
         key: 'gas_condenser',
         name: 'Gas Cooler/Condenser',
         type: 'gas_dry',
         subtype: null,
         mass: 70,
         volume: 90,
         cost: 2800,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             coolGas: {
                 params: { setpoint_C: Number },
                 caps: { setpoint_C: [5, 25], max_flow_Nm3_h: 200 }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

     {
         key: 'gas_filter_partic',
         name: 'Particulate Filter',
         type: 'gas_filter',
         subtype: null,
         mass: 25,
         volume: 30,
         cost: 800,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             filterGasParticulates: {
                 params: { micron: Number },
                 caps: { micron: [1, 50], max_flow_Nm3_h: 200 }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

     {
         key: 'gas_regulator',
         name: 'Pressure Regulator',
         type: 'gas_control',
         subtype: null,
         mass: 10,
         volume: 8,
         cost: 600,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             regulateGasPressure: {
                 params: { pressure_out_bar: Number },
                 caps: { pressure_out_bar: [0.1, 10], max_flow_Nm3_h: 150 }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

     {
         key: 'gasholder',
         name: 'Gas Holder/Dome',
         type: 'gas_storage',
         subtype: null,
         mass: 500,
         volume: 1500,
         cost: 9000,
         acesPorts: 1,
         parentPortsUsed: 1,
         exposedFunctions: {
             store: {
                 params: { volume_Nm3: Number },
                 caps: { volume_Nm3: [0, 300], max_pressure_mbar: 50 }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },
     {
         key: 'generator_ac',
         name: 'Generator (AC)',
         type: 'generator',
         subtype: 'ac',
         mass: 600,
         volume: 1200,
         cost: 22000,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             generateACPower: {
                 params: { kW: Number },
                 caps: { kW: [0, 120], voltage_V: [230, 400], frequency_Hz: [50, 60] }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },
    {
        key: 'gps_basic',
        name: 'GPS Module',
        type: 'gps',
        subtype: 'basic',
        mass: 0.5,
        volume: 0.4,
        cost: 20,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {getFix: {params: {}, caps: {}}, getHeading: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'gps_rtk',
        name: 'RTK GPS Module',
        type: 'gps',
        subtype: 'rtk',
        mass: 0.9,
        volume: 0.6,
        cost: 120,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            getFix: {params: {}, caps: {}}, getHeading: {params: {}, caps: {}}, getRTKFix: {params: {}, caps: {}}
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'grid_switchgear',
        name: 'Grid Switchgear',
        type: 'power_elec',
        subtype: 'switchgear',
        mass: 90,
        volume: 140,
        cost: 7000,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {exportToGrid: {params: {kW: Number}, caps: {kW: [0, 100]}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'grow_tray_set',
        name: 'Grow Tray Set',
        type: 'tray',
        subtype: null,
        mass: 15,
        volume: 30,
        cost: 400,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            loadMaterial: {params: {volume_L: Number}, caps: {volume_L: [0, 20]}},
            unloadMaterial: {params: {volume_L: Number}, caps: {volume_L: [0, 20]}}
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'h2s_scrubber_ac',
        name: 'H2S Scrubber (Activated Carbon)',
        type: 'gas_clean',
        subtype: 'h2s_ac',
        mass: 180,
        volume: 220,
        cost: 6500,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {cleanGasH2S: {params: {mode: ['H2S_AC']}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'h2s_scrubber_btf',
        name: 'H2S Biotrickling Filter',
        type: 'gas_clean',
        subtype: 'h2s_btf',
        mass: 350,
        volume: 500,
        cost: 12000,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {cleanGasH2S: {params: {mode: ['H2S_BTF']}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },
     {
         key: 'heat_exchanger',
         name: 'Heat Exchanger (CHP→Digester)',
         type: 'heat_xfer',
         subtype: null,
         mass: 120,
         volume: 160,
         cost: 5200,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             transferHeat: {
                 params: { from: String, to: String, kW: Number },
                 caps: { kW: [0, 50], deltaT_C: [2, 40], max_pressure_kPa: 600 }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

    {
        key: 'heating',
        name: 'Heating Module',
        type: 'heating',
        subtype: null,
        mass: 20,
        volume: 30,
        cost: 60,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {setAirTemp: {params: {temp_C: Number}, caps: {temp_C: [5, 40]}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'hepa_filter_unit',
        name: 'HEPA Filter Unit',
        type: 'air_filter',
        subtype: 'hepa',
        mass: 40,
        volume: 80,
        cost: 1200,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {filterAir: {params: {micron: Number}, caps: {micron: [0.3, 1.0]}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'hose_reel',
        name: 'Hose Reel',
        type: 'support',
        subtype: 'hose',
        mass: 20,
        volume: 50,
        cost: 400,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: { extend: { params: { length_m: Number }, caps: { length_m: [0, 50] } }, retract: { params: { length_m: Number }, caps: { length_m: [0, 50] } }, lock: { params: { state: Boolean }, caps: {} } },
        state: { health: { ok: Boolean, faultCode: String }, extended_m: Number, locked: Boolean }
    },

    {
        key: 'humidifier',
        name: 'Heater/Humidifier module',
        type: 'humidifier',
        subtype: null,
        mass: 15,
        volume: 25,
        cost: 40,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {setHumidity: {params: {rh_pct: Number}, caps: {rh_pct: [30, 95]}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'internal_space',
        name: 'Internal Space',
        type: 'internalSpace',
        subtype: null,
        mass: 500,
        volume: 1200,
        cost: 1500,
        acesPorts: 16,
        parentPortsUsed: 0,
        exposedFunctions: {
            allocatePort: {params: {moduleKey: String}, caps: {slots: [0, 16]}},
            readPortStatus: {params: {}, caps: {slots_total: 16}}
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },
     {
         key: 'inverter_dc_ac',
         name: 'DC→AC Inverter',
         type: 'power_elec',
         subtype: 'inverter',
         mass: 120,
         volume: 160,
         cost: 9000,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             convertDCtoAC: {
                 params: { kW: Number },
                 caps: { kW: [0, 100], dc_bus_V: [24, 48], ac_voltage_V: [230, 400] }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

    {
        key: 'laminar_flow_hood',
        name: 'Laminar Flow Hood',
        type: 'air_clean',
        subtype: 'laminar',
        mass: 90,
        volume: 140,
        cost: 3500,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {cleanAirLaminar: {params: {level: String}, caps: {level: ['laminar']}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'laser_positioner',
        name: 'Laser Positioner',
        type: 'sensor',
        subtype: 'laser_pointer',
        mass: 2,
        volume: 3,
        cost: 300,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            pointTo: { params: { target: { x: Number, y: Number, z: Number }, frame: ['assembly', 'world'] }, caps: {} },
            getObjectLocalCoordinates: { params: { class: String, minConfidence: Number, maxN: Number }, caps: {} }
        },
        state: { health: { ok: Boolean, faultCode: String } }
    },

    {
        key: 'lidar_2d',
        name: 'LiDAR 2D',
        type: 'sensor',
        subtype: 'lidar2d',
        mass: 1.0,
        volume: 1.5,
        cost: 800,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: { scanLidar2d: { params: { range_m: Number, resolution_deg: Number }, caps: {} } },
        state: { health: { ok: Boolean, faultCode: String }, lastScanPoints: Number }
    },

    {
        key: 'lidar_3d',
        name: 'LiDAR 3D',
        type: 'sensor',
        subtype: 'lidar3d',
        mass: 3,
        volume: 4,
        cost: 3000,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: { scanLidar3d: { params: { range_m: Number, vFov_deg: Number, hFov_deg: Number }, caps: {} } },
        state: { health: { ok: Boolean, faultCode: String }, lastPointCount: Number }
    },
     {
         key: 'mppt_charger_dc',
         name: 'MPPT DC Charger',
         type: 'power',
         subtype: 'mppt',
         mass: 6,
         volume: 8,
         cost: 140,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             chargeConnectedBattery: {
                 params: { kW: Number },
                 caps: { kW: [0, 0.5], pv_input_V: [18, 60], battery_V: [24, 48] }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

     {
         key: 'pasteurizer_tank',
         name: 'Pasteurizer Tank',
         type: 'pasteurizer',
         subtype: null,
         mass: 160,
         volume: 280,
         cost: 6400,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             pasteurize: {
                 params: { temp_C: Number, duration_s: Number },
                 caps: { temp_C: [60, 85], duration_s: [600, 14400], max_volume_L: 250 }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

     {
         key: 'pellet_die_head',
         name: 'Pellet Die Head',
         type: 'manufacture',
         subtype: 'pellet_die',
         mass: 140,
         volume: 220,
         cost: 9000,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             pelletize: {
                 params: { throughput_kgph: Number },
                 caps: { throughput_kgph: [50, 500], pellet_diameter_mm: [3, 12] }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

    {
        key: 'pole',
        name: 'Pole',
        type: 'support',
        subtype: 'pole',
        mass: 10,
        volume: 20,
        cost: 40,
        acesPorts: 3,
        parentPortsUsed: 0,
        exposedFunctions: { anchorStructure: { params: {}, caps: { mount_points: 3 } } },
        state: { health: { ok: Boolean, faultCode: String }, mountPoints_free: Number }
    },

    {
        key: 'positioning_gnss_ins',
        name: 'Positioning GNSS+INS',
        type: 'positioning',
        subtype: 'gnss_ins',
        mass: 0.8,
        volume: 0.6,
        cost: 500,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            getPose: { params: { frame: ['world', 'assembly', 'local'] }, caps: {} },
            setHome: { params: { position_m: { x: Number, y: Number, z: Number }, frame: ['world', 'assembly'] }, caps: {} },
            getVelocity: { params: { frame: ['world', 'assembly'] }, caps: {} }
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            position_m: { x: Number, y: Number, z: Number },
            orientation_q: { qx: Number, qy: Number, qz: Number, qw: Number },
            covariance: Array
        }
    },

    {
        key: 'pump_inline',
        name: 'Pump module',
        type: 'pump',
        subtype: null,
        mass: 7,
        volume: 10,
        cost: 60,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            runPump: {
                params: {flow_Lps: Number, duration_s: Number}, caps: {flow_Lps: [0.1, 1.2], duration_s: [1, 3600]}
            }, setPumpFlow: {params: {flow_Lps: Number}, caps: {flow_Lps: [0.1, 1.2]}}
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

     {
         key: 'pump_water',
         name: 'Pump (water)',
         type: 'actuator',
         subtype: 'pump',
         mass: 30,
         volume: 50,
         cost: 1000,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             setFlow: {
                 params: { flow_Lps: Number, pressure_kPa: Number },
                 caps: { flow_Lps: [0, 5], pressure_kPa: [0, 600], max_suction_head_m: 7 }
             },
             stopPump: { params: {}, caps: {} }
         },
         state: { health: { ok: Boolean, faultCode: String }, flow_Lps: Number, pressure_kPa: Number }
     },

     {
         key: 'pyrolysis_reactor',
         name: 'Pyrolysis Reactor',
         type: 'reactor',
         subtype: 'biochar',
         mass: 500,
         volume: 900,
         cost: 14000,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             char: {
                 params: { throughput_kgph: Number, temp_C: Number },
                 caps: { throughput_kgph: [20, 200], temp_C: [350, 700], residence_time_min: [10, 90] }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

    {
        key: 'radio_client',
        name: 'Radio Client',
        type: 'communications',
        subtype: 'client',
        mass: 1,
        volume: 1,
        cost: 120,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            readCommsStatus: {params: {}, caps: {}},
            sendData: {params: {topic: String, bytes: 'Buffer'}, caps: {}},
            subscribeTopic: {params: {topic: String}, caps: {}}
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'ram_actuator',
        name: 'Ram Actuator',
        type: 'actuator',
        subtype: 'linear_ram',
        mass: 120,
        volume: 180,
        cost: 6000,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            compressMaterial: {
                params: {force_kN: Number, stroke_m: Number}, caps: {force_kN: [50, 400], stroke_m: [0, 1.2]}
            }
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            actuation: Object
        }
    },
     {
         key: 'rectifier_dc',
         name: 'AC→DC Rectifier',
         type: 'power_elec',
         subtype: 'rectifier',
         mass: 80,
         volume: 100,
         cost: 5000,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             convertACtoDC: {
                 params: { kW: Number },
                 caps: { kW: [0, 120], dc_bus_V: [24, 48] }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     }
,

    {
        key: 'safety_relief',
        name: 'Relief Valve',
        type: 'safety',
        subtype: null,
        mass: 12,
        volume: 8,
        cost: 500,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readReliefValveStatus: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

     {
         key: 'seed_box',
         name: 'Seed Box',
         type: 'seedbox',
         subtype: null,
         mass: 5,
         volume: 10,
         cost: 20,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             loadMaterial: {
                 params: { volume_L: Number, mass_kg: Number },
                 caps: { volume_L: [0, 20] }
             },
             readStatus: { params: {}, caps: {} },
             unloadMaterial: {
                 params: { volume_L: Number, mass_kg: Number },
                 caps: { volume_L: [0, 20] }
             }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             mode: String,
             busy: Boolean,
             lastUpdateIso: String
         }
     },

     {
         key: 'sensor_air_humidity',
         name: 'Hygrometer',
         type: 'sensor',
         subtype: 'air_humidity',
         mass: 0.3,
         volume: 0.2,
         cost: 25,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             readAirHumidity: { params: {}, caps: { rh_pct_range: [0, 100] } }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             mode: String,
             busy: Boolean,
             lastUpdateIso: String,
             measurement: Object
         }
     },

     {
         key: 'sensor_air_temp',
         name: 'Air Thermometer',
         type: 'sensor',
         subtype: 'air_temp',
         mass: 0.3,
         volume: 0.2,
         cost: 25,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             readAirTemp: { params: {}, caps: { temp_C_range: [-40, 85] } }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             mode: String,
             busy: Boolean,
             lastUpdateIso: String,
             measurement: Object
         }
     },

    {
        key: 'sensor_anemometer',
        name: 'Wind Speed (Anemometer)',
        type: 'sensor',
        subtype: 'wind_speed',
        mass: 0.8,
        volume: 0.6,
        cost: 35,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readWindSpeed: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'sensor_barometer',
        name: 'Barometer',
        type: 'sensor',
        subtype: 'pressure',
        mass: 0.4,
        volume: 0.2,
        cost: 30,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readPressure: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'sensor_chlorophyll',
        name: 'Leaf Chlorophyll Meter',
        type: 'sensor',
        subtype: 'chlorophyll_spad',
        mass: 0.6,
        volume: 0.5,
        cost: 60,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readChlorophyllSPAD: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'sensor_digester_ph',
        name: 'Digester pH',
        type: 'sensor',
        subtype: 'ph',
        mass: 1,
        volume: 1,
        cost: 150,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readPH: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'sensor_digester_temp',
        name: 'Digester Temperature',
        type: 'sensor',
        subtype: 'digester_temp',
        mass: 1,
        volume: 1,
        cost: 120,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readDigesterTemp: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'sensor_flow_meter',
        name: 'Flow Meter',
        type: 'sensor',
        subtype: 'flow',
        mass: 1.0,
        volume: 0.8,
        cost: 45,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readFlow: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'sensor_gas_ch4',
        name: 'Methane Analyzer',
        type: 'sensor',
        subtype: 'ch4',
        mass: 4,
        volume: 3,
        cost: 1800,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readCH4: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'sensor_gas_flow',
        name: 'Gas Flow Meter',
        type: 'sensor',
        subtype: 'gas_flow',
        mass: 3,
        volume: 2,
        cost: 600,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readGasFlow: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'sensor_gas_h2s',
        name: 'H2S Analyzer',
        type: 'sensor',
        subtype: 'h2s',
        mass: 4,
        volume: 3,
        cost: 1600,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readH2S: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'sensor_gas_pressure',
        name: 'Gas Pressure',
        type: 'sensor',
        subtype: 'gas_pressure',
        mass: 1,
        volume: 1,
        cost: 200,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readGasPressure: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'sensor_leaf_wetness',
        name: 'Leaf Wetness Sensor',
        type: 'sensor',
        subtype: 'leaf_wetness',
        mass: 0.3,
        volume: 0.2,
        cost: 30,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readLeafWetness: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },
    {
        key: 'sensor_par',
        name: 'PAR Sensor',
        type: 'sensor',
        subtype: 'par',
        mass: 0.6,
        volume: 0.5,
        cost: 45,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readPAR: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'sensor_pyranometer',
        name: 'Solar Radiation (Pyranometer)',
        type: 'sensor',
        subtype: 'solar_rad',
        mass: 0.7,
        volume: 0.6,
        cost: 45,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readSolarIrradiance: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'sensor_rain_gauge',
        name: 'Rain Gauge',
        type: 'sensor',
        subtype: 'rainfall',
        mass: 0.9,
        volume: 0.8,
        cost: 30,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readRainfall: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'sensor_rfid',
        name: 'RFID/Barcode Reader',
        type: 'sensor',
        subtype: 'rfid',
        mass: 0.7,
        volume: 0.5,
        cost: 80,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readRFID: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

     {
         key: 'sensor_soil_moisture',
         name: 'Soil Moisture Probe',
         type: 'sensor',
         subtype: 'soil_moisture',
         mass: 0.8,
         volume: 0.6,
         cost: 35,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             readSoilMoisture: { params: {}, caps: { volumetric_water_content_pct: [0, 60] } }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             mode: String,
             busy: Boolean,
             lastUpdateIso: String,
             measurement: Object
         }
     },

     {
         key: 'sensor_soil_temp',
         name: 'Soil Thermometer',
         type: 'sensor',
         subtype: 'soil_temp',
         mass: 0.5,
         volume: 0.4,
         cost: 30,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             readSoilTemp: { params: {}, caps: { temp_C_range: [-20, 80] } }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             mode: String,
             busy: Boolean,
             lastUpdateIso: String,
             measurement: Object
         }
     },

    {
        key: 'sensor_turbidity',
        name: 'Turbidity Sensor',
        type: 'sensor',
        subtype: 'turbidity',
        mass: 0.9,
        volume: 0.7,
        cost: 45,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readTurbidity: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'sensor_uv',
        name: 'UV Index Sensor',
        type: 'sensor',
        subtype: 'uv',
        mass: 0.4,
        volume: 0.3,
        cost: 35,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readUV: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'sensor_water_level',
        name: 'Water Level Sensor',
        type: 'sensor',
        subtype: 'water_level',
        mass: 0.8,
        volume: 0.7,
        cost: 40,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readWaterLevel: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'sensor_weighing',
        name: 'Weighing module',
        type: 'sensor',
        subtype: 'weighing',
        mass: 5,
        volume: 6,
        cost: 25,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readWeighing: {params: {}, caps: {range_kg: [0, 200]}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'sensor_wind_vane',
        name: 'Wind Direction (Vane)',
        type: 'sensor',
        subtype: 'wind_dir',
        mass: 0.6,
        volume: 0.5,
        cost: 25,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {readWindDir: {params: {}, caps: {}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

     {
         key: 'separator_press',
         name: 'Screw Press Separator',
         type: 'separator',
         subtype: null,
         mass: 350,
         volume: 500,
         cost: 18000,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             separate: {
                 params: { throughput_kgph: Number },
                 caps: { throughput_kgph: [100, 2000], dryness_solid_pct: [25, 40] }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

    {
        key: 'server_rack',
        name: 'Server Rack',
        type: 'computer',
        subtype: 'server',
        mass: 120,
        volume: 200,
        cost: 4000,
        acesPorts: 2,
        parentPortsUsed: 1,
        exposedFunctions: {
            allocatePort: {params: {moduleKey: String}, caps: {slots: [0, 2]}},
            readPortStatus: {params: {}, caps: {slots_total: 2}}
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'shelf_rack',
        name: 'Shelf Rack',
        type: 'support',
        subtype: 'shelfRack',
        mass: 18,
        volume: 40,
        cost: 35,
        acesPorts: 2,
        parentPortsUsed: 0,
        exposedFunctions: { provideMountPoints: { params: {}, caps: { mount_points: 2 } } },
        state: { health: { ok: Boolean, faultCode: String }, mountPoints_free: Number }
    },

    {
        key: 'shelf_robotic',
        name: 'Robotic Shelf',
        type: 'shelf',
        subtype: 'robotic',
        mass: 40,
        volume: 90,
        cost: 900,
        acesPorts: 4,
        parentPortsUsed: 1,
        exposedFunctions: {
            insert: {params: {slot_id: String}, caps: {slots: [0, 4]}},
            readStatus: {params: {}, caps: {slots_total: 4}},
            remove: {params: {slot_id: String}, caps: {slots: [0, 4]}}
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },
     {
         key: 'slurry_pump',
         name: 'Slurry Pump',
         type: 'pump',
         subtype: 'slurry',
         mass: 60,
         volume: 80,
         cost: 1800,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             runPump: {
                 params: { flow_Lps: Number, duration_s: Number },
                 caps: { flow_Lps: [0.2, 3.0], duration_s: [1, 7200], max_solids_pct: 8 }
             },
             setPumpFlow: { params: { flow_Lps: Number }, caps: { flow_Lps: [0.2, 3.0] } }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },
    {
        key: 'soil_core_sampler',
        name: 'Soil Core Sampler',
        type: 'tool',
        subtype: 'core_sampler',
        mass: 8,
        volume: 12,
        cost: 300,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: { coreSample: { params: { depth_m: Number, diameter_mm: Number }, caps: { depth_m: [0, 0.5], diameter_mm: [10, 50] } }, ejectCore: { params: {}, caps: {} } },
        state: { health: { ok: Boolean, faultCode: String } }
    },

    {
        key: 'soil_ec_sensor',
        name: 'Soil EC Sensor',
        type: 'sensor',
        subtype: 'ec',
        mass: 0.5,
        volume: 0.4,
        cost: 100,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: { readSoilEC: { params: {}, caps: {} }, calibrateEC: { params: { standard_mScm: Number }, caps: {} } },
        state: { health: { ok: Boolean, faultCode: String }, ec_mScm: Number }
    },

     {
         key: 'soil_ph_sensor',
         name: 'Soil pH Sensor',
         type: 'sensor',
         subtype: 'ph',
         mass: 0.4,
         volume: 0.3,
         cost: 80,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             readSoilPH: { params: {}, caps: { pH_range: [3.0, 10.0] } },
             calibratePH: { params: { buffer_pH: Number }, caps: { buffer_pH: [4.0, 10.0] } }
         },
         state: { health: { ok: Boolean, faultCode: String }, ph: Number }
     },

    {
        key: 'soil_probe',
        name: 'Soil Probe (multi)',
        type: 'sensor',
        subtype: 'soil_probe',
        mass: 2,
        volume: 2,
        cost: 400,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: { probeSoil: { params: { depth_m: Number, parameters: ['moisture', 'temp', 'ec', 'ph'], dwell_s: Number }, caps: { depth_m: [0, 1] } } },
        state: { health: { ok: Boolean, faultCode: String }, lastDepth_m: Number }
    },

     {
         key: 'solar_panel',
         name: 'Solar Panel',
         type: 'solar',
         subtype: null,
         mass: 10,
         volume: 15,
         cost: 50,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             generateDCPower: {
                 params: { kW: Number },
                 caps: { kW: [0, 0.15], Vmp_V: [30, 40], Voc_V: [38, 48] }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

     {
        key: 'sorter_camera',
        name: 'Sorter Camera',
        type: 'sensor',
        subtype: 'vision_sort',
        mass: 15,
        volume: 25,
        cost: 3000,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            classify: {
                params: {imageKey: String}, caps: {classes: ['plastic', 'paper', 'cardboard', 'metal', 'glass', 'bio']}
            }
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            measurement: Object
        }
    },

    {
        key: 'spawn_dispenser',
        name: 'Spawn/Inoculum Dispenser',
        type: 'dispenser',
        subtype: 'spawn',
        mass: 25,
        volume: 35,
        cost: 2400,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            dispense: {
                params: {points: {items: 'geo.coord[]'}, amount_g_each: Number}, caps: {amount_g_each: [1, 100]}
            }
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

     {
         key: 'sprayer_std',
         name: 'Sprayer',
         type: 'sprayer',
         subtype: null,
         mass: 6,
         volume: 8,
         cost: 40,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             sprayApply: {
                 params: {
                     area: 'plan.area' | 'geo.path',
                     rate_L_per_ha: Number,
                     droplet_um: Number,
                     pressure_bar: Number
                 },
                 caps: { rate_L_per_ha: [50, 300], pressure_bar: [1, 6], droplet_um: [100, 600] }
             }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             mode: String,
             busy: Boolean,
             lastUpdateIso: String
         }
     },

     {
         key: 'spreader_fertilizer',
         name: 'Fertilizer Spreader',
         type: 'spreader',
         subtype: null,
         mass: 10,
         volume: 15,
         cost: 45,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             dispenseGranular: {
                 params: {
                     area: 'plan.area' | 'geo.path',
                     rate_kg_per_ha: Number,
                     material: String
                 },
                 caps: { rate_kg_per_ha: [10, 400], max_granule_mm: 6 }
             }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             mode: String,
             busy: Boolean,
             lastUpdateIso: String
         }
     },
    {
        key: 'steam_generator',
        name: 'Steam Generator',
        type: 'steam_gen',
        subtype: null,
        mass: 140,
        volume: 220,
        cost: 5200,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {generateSteam: {params: {rate_kg_per_h: Number}, caps: {rate_kg_per_h: [5, 50]}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'sterilizer_autoclave',
        name: 'Autoclave (Substrate Sterilizer)',
        type: 'sterilizer',
        subtype: 'autoclave',
        mass: 180,
        volume: 260,
        cost: 7800,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            sterilize: {
                params: {temp_C: Number, duration_s: Number}, caps: {temp_C: [110, 134], duration_s: [300, 7200]}
            }
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

    {
        key: 'storage_array',
        name: 'Storage Array',
        type: 'computer',
        subtype: 'storage',
        mass: 80,
        volume: 150,
        cost: 2500,
        acesPorts: 1,
        parentPortsUsed: 1,
        exposedFunctions: {
            readStorageStatus: {params: {}, caps: {}},
            storageLoad: {params: {key: String}, caps: {}},
            storageSave: {params: {key: String, bytes: 'Buffer'}, caps: {}}
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

     {
         key: 'substrate_mixer',
         name: 'Substrate Mixer/Tumbler',
         type: 'mixer',
         subtype: null,
         mass: 120,
         volume: 200,
         cost: 3800,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             mix: {
                 params: { rpm: Number, duration_s: Number },
                 caps: { rpm: [5, 60], duration_s: [10, 7200], batch_kg_max: 300 }
             }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

     {
         key: 'tank_std',
         name: 'Tank',
         type: 'tank',
         subtype: null,
         mass: 20,
         volume: 60,
         cost: 70,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             loadMaterial: { params: { volume_L: Number }, caps: { volume_L: [0, 50] } },
             readCapacity: { params: {}, caps: { volume_L_max: 50 } },
             readLevel: { params: {}, caps: { volume_L: [0, 50] } },
             unloadMaterial: { params: { volume_L: Number }, caps: { volume_L: [0, 50] } }
         },
         state: { health: { ok: Boolean, faultCode: String }, mode: String, busy: Boolean, lastUpdateIso: String }
     },

    {
        key: 'tool_anchor',
        name: 'Anchor Driver Module',
        type: 'tool',
        subtype: 'anchor_driver',
        mass: 9,
        volume: 12,
        cost: 55,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            driveAnchor: {
                params: {x_m: Number, y_m: Number, depth_m: Number, torque_Nm: Number},
                caps: {depth_m: [0, 0.5], torque_Nm: [0, 200]}
            }
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            toolState: Object
        }
    },

    {
        key: 'tool_borer',
        name: 'Hole-Borer',
        type: 'tool',
        subtype: 'borer',
        mass: 6,
        volume: 8,
        cost: 40,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            bore: {
                params: { x_m: Number, y_m: Number, depth_m: Number, diameter_m: Number, rpm: Number, feed_mm_per_rev: Number },
                caps: { depth_m: [0, 0.4], diameter_m: [0.01, 0.08] }
            }
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            rpm: Number,
            tipDepth_m: Number
        }
    },

    {
        key: 'tool_brush',
        name: 'Brush Tool',
        type: 'tool',
        subtype: 'brush',
        mass: 4,
        volume: 6,
        cost: 30,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: { brushArea: { params: { area: 'plan.area', rpm: Number }, caps: { rpm: [200, 1200] } } },
        state: { health: { ok: Boolean, faultCode: String }, brush_rpm: Number }
    },

    {
        key: 'tool_cutter',
        name: 'Cutter/Saw',
        type: 'tool',
        subtype: 'cutter',
        mass: 5,
        volume: 6,
        cost: 35,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            cutPolyline: { params: { path: 'geo.path', depth_m: Number, feed_mps: Number }, caps: { depth_m: [0, 0.05], feed_mps: [0, 0.6] } }
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            blade_rpm: Number
        }
    },

    {
        key: 'tool_digger',
        name: 'Digger',
        type: 'tool',
        subtype: 'digger',
        mass: 7,
        volume: 9,
        cost: 50,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: { digTrench: { params: { path: 'geo.path', width_m: Number, depth_m: Number }, caps: { width_m: [0.05, 0.2], depth_m: [0, 0.3] } } },
        state: { health: { ok: Boolean, faultCode: String } }
    },

    {
        key: 'tool_flattener',
        name: 'Flattener Module',
        type: 'tool',
        subtype: 'flattener',
        mass: 12,
        volume: 20,
        cost: 60,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {flattenArea: {params: {area: 'plan.area', passes: Number}, caps: {passes: [1, 5]}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            toolState: Object
        }
    },

    {
        key: 'tool_grader',
        name: 'Grader Module',
        type: 'tool',
        subtype: 'grader',
        mass: 14,
        volume: 24,
        cost: 70,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            gradeProfile: {
                params: {path: 'geo.path', target_z_m: Number}, caps: {target_z_m: [-0.1, 0.1]}
            }
        },
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String,
            toolState: Object
        }
    },

     {
         key: 'tool_gripper',
         name: 'Gripper',
         type: 'tool',
         subtype: 'gripper',
         mass: 4,
         volume: 5,
         cost: 30,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             grip: {
                 params: { state: ['open', 'close'], force_N: Number },
                 caps: { force_N: [0, 300], max_object_mass_kg: 2 }
             }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             jaw_state: String,
             jaw_force_N: Number
         }
     },

    {
        key: 'tool_irrigator_drip',
        name: 'Irrigator (drip)',
        type: 'tool',
        subtype: 'drip',
        mass: 5,
        volume: 8,
        cost: 100,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            irrigate: { params: { volume_L: Number, rate_Lps: Number }, caps: { rate_Lps: [0, 1] } },
            purge: { params: { duration_s: Number }, caps: {} }
        },
        state: { health: { ok: Boolean, faultCode: String }, emitter_count: Number }
    },

    {
        key: 'tool_pitchfork',
        name: 'Pitchfork',
        type: 'tool',
        subtype: 'pitchfork',
        mass: 2,
        volume: 3,
        cost: 28,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            liftLoad: { params: { mass_kg: Number }, caps: { mass_kg: [0, 0.2] } },
            moveLoad: { params: { path: 'geo.path', mass_kg: Number }, caps: { mass_kg: [0, 0.2] } }
        },
        state: { health: { ok: Boolean, faultCode: String } }
    },

    {
        key: 'tool_pruner',
        name: 'Pruner',
        type: 'tool',
        subtype: 'pruner',
        mass: 3,
        volume: 4,
        cost: 32,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: { snip: { params: { points: { items: 'geo.coord[]' } }, caps: { branch_diameter_m: [0, 0.02] } } },
        state: { health: { ok: Boolean, faultCode: String } }
    },

    {
        key: 'tool_rotating',
        name: 'Rotating Blades',
        type: 'tool',
        subtype: 'rotatingblades',
        mass: 5,
        volume: 7,
        cost: 45,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: { mow: { params: { area: 'plan.area', height_m: Number, speed_mps: Number }, caps: { height_m: [0.02, 0.08], speed_mps: [0.2, 1.5] } } },
        state: { health: { ok: Boolean, faultCode: String }, blade_rpm: Number, cut_height_m: Number }
    },

    {
        key: 'tool_seeder',
        name: 'Seeder',
        type: 'tool',
        subtype: 'seeder',
        mass: 10,
        volume: 15,
        cost: 45,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            seedRows: { params: { rows: { items: 'line[]' }, rate_seeds_per_m: Number, depth_m: Number }, caps: { rate_seeds_per_m: [5, 60], depth_m: [0.01, 0.05] } }
        },
        state: { health: { ok: Boolean, faultCode: String }, hopper_level_pct: Number }
    },

    {
        key: 'tool_sprayer',
        name: 'Sprayer',
        type: 'tool',
        subtype: 'sprayer',
        mass: 12,
        volume: 15,
        cost: 150,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {
            spray: { params: { area: 'plan.area', rate_Lps: Number, droplet_um: Number, pressure_kPa: Number }, caps: { rate_Lps: [0, 5], pressure_kPa: [50, 600] } },
            flush: { params: { volume_L: Number }, caps: {} },
            mixDose: { params: { soluteId: String, concentration_gL: Number }, caps: {} }
        },
        state: { health: { ok: Boolean, faultCode: String }, nozzle_count: Number, line_pressure_kPa: Number }
    },

     {
         key: 'tool_suction',
         name: 'Suction Tool',
         type: 'tool',
         subtype: 'suction',
         mass: 3,
         volume: 4,
         cost: 25,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             grip: {
                 params: { x_m: Number, y_m: Number, z_m: Number, mass_kg: Number },
                 caps: { mass_kg: [0, 0.5] }
             },
             release: { params: { x_m: Number, y_m: Number, z_m: Number }, caps: {} },
             testSeal: { params: {}, caps: {} }
         },
         state: { health: { ok: Boolean, faultCode: String }, vacuum_kPa: Number }
     },


     {
         key: 'ugv_large',
         name: 'UGV Transport (large)',
         type: 'transport',
         subtype: 'ground',
         mass: 85,
         volume: 140,
         cost: 320,
         acesPorts: 8,
         parentPortsUsed: 0,
         exposedFunctions: {
             followPath: {
                 params: { path: 'geo.path', speed_mps: Number },
                 caps: { speed_mps: [0, 2.5], max_payload_kg: 80 }
             },
             loiter: {
                 params: { duration_s: Number },
                 caps: { duration_s: [0, 3600] }
             },
             stopTransport: { params: {}, caps: {} }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             worldPose: {
                 position_m: { x: Number, y: Number, z: Number },
                 orientation_q: { qx: Number, qy: Number, qz: Number, qw: Number }
             },
             velocity_mps: { x: Number, y: Number, z: Number },
             heading_deg: Number,
             battery_soc_pct: Number
         }
     },

     {
         key: 'ugv_small',
         name: 'UGV Transport (small)',
         type: 'transport',
         subtype: 'ground',
         mass: 55,
         volume: 90,
         cost: 200,
         acesPorts: 6,
         parentPortsUsed: 0,
         exposedFunctions: {
             followPath: {
                 params: { path: 'geo.path', speed_mps: Number },
                 caps: { speed_mps: [0, 2.0], max_payload_kg: 30 }
             },
             loiter: {
                 params: { duration_s: Number },
                 caps: { duration_s: [0, 3600] }
             },
             stopTransport: { params: {}, caps: {} }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             worldPose: {
                 position_m: { x: Number, y: Number, z: Number },
                 orientation_q: { qx: Number, qy: Number, qz: Number, qw: Number }
             },
             velocity_mps: { x: Number, y: Number, z: Number },
             heading_deg: Number,
             battery_soc_pct: Number
         }
     },

    {
        key: 'uwb_anchor',
        name: 'UWB Anchor/Tag',
        type: 'positioning',
        subtype: 'uwb',
        mass: 0.3,
        volume: 0.3,
        cost: 100,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: { rangeTo: { params: { peerId: String }, caps: {} }, getPose: { params: {}, caps: {} } },
        state: { health: { ok: Boolean, faultCode: String }, anchor: Boolean }
    },

    {
        key: 'valve_inline',
        name: 'Valve module',
        type: 'valve',
        subtype: null,
        mass: 2,
        volume: 1,
        cost: 35,
        acesPorts: 0,
        parentPortsUsed: 1,
        exposedFunctions: {setValvePosition: {params: {open_pct: Number}, caps: {open_pct: [0, 100]}}},
        state: {
            health: { ok: Boolean, faultCode: String },
            mode: String,
            busy: Boolean,
            lastUpdateIso: String
        }
    },

     {
         key: 'water_tank',
         name: 'Water Tank',
         type: 'resource',
         subtype: 'water',
         mass: 200,
         volume: 2000,
         cost: 5000,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             provideWater: { params: { flow_Lps: Number }, caps: { flow_Lps: [0, 5] } },
             acceptWater: { params: { flow_Lps: Number }, caps: { flow_Lps: [0, 5] } }
         },
         state: { health: { ok: Boolean, faultCode: String }, level_L: Number, temperature_C: Number }
     },

     {
         key: 'weather_mast',
         name: 'Weather Mast',
         type: 'sensor',
         subtype: 'met',
         mass: 10,
         volume: 20,
         cost: 800,
         acesPorts: 0,
         parentPortsUsed: 1,
         exposedFunctions: {
             readWeather: {
                 params: { sensors: ['wind', 'temp', 'humidity', 'rain', 'solar'], averaging_s: Number },
                 caps: {
                     temp_C_range: [-40, 85],
                     rh_pct_range: [0, 100],
                     wind_mps_range: [0, 60],
                     rain_mmph_range: [0, 200],
                     solar_Wm2_range: [0, 1400]
                 }
             }
         },
         state: {
             health: { ok: Boolean, faultCode: String },
             wind_mps: Number,
             temp_C: Number,
             humidity_pct: Number,
             rain_mmph: Number,
             solar_Wm2: Number
         }
     }

];

export {moduleTypes, constants}
