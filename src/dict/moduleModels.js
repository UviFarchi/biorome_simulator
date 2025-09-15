const constants = {
    units: {electricity: 'kWh', water: 'm³', waste: 'ton', batteryPack: 'pack'},
    battery: {moduleKey: 'battery', kWhPerPack: 5}
}


const moduleTypes = [
// 1
    { key:'battery_pack', name:'Battery Pack', type:'battery', subtype:null,
        mass:12, volume:8, cost:60, electricity:0, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{
            power:{
                dc:{ params:{ kW:Number }, caps:{ /* battery supplies; actual draw validated by ops */ } },
                state:{ params:{}, caps:{} },
                charge:{ params:{ kW:Number, duration_s:Number }, caps:{ kW:[0,1.0] } }
            }
        }
    },

// 2
    { key:'ugv_small', name:'UGV Transport (small)', type:'transport', subtype:'ground',
        mass:55, volume:90, cost:200, electricity:-0.4, capacity:0, slots:6, parentSlotsUsed:0,
        provides:{
            mobility:{
                moveTo:{ params:{ coord:'geo.coord', speed_mps:Number }, caps:{ speed_mps:[0,2.0], load_kg_max:60 } },
                followPath:{ params:{ path:'geo.path', speed_mps:Number }, caps:{ speed_mps:[0,2.0] } },
                hold:{ params:{ duration_s:Number }, caps:{ duration_s:[0,3600] } },
                setMode:{ params:{ mode:['ground'] }, caps:{} }
            }
        }
    },

// 3
    { key:'ugv_large', name:'UGV Transport (large)', type:'transport', subtype:'ground',
        mass:85, volume:140, cost:320, electricity:-0.6, capacity:0, slots:8, parentSlotsUsed:0,
        provides:{
            mobility:{
                moveTo:{ params:{ coord:'geo.coord', speed_mps:Number }, caps:{ speed_mps:[0,2.5], load_kg_max:120 } },
                followPath:{ params:{ path:'geo.path', speed_mps:Number }, caps:{ speed_mps:[0,2.5] } },
                hold:{ params:{ duration_s:Number }, caps:{ duration_s:[0,3600] } },
                setMode:{ params:{ mode:['ground'] }, caps:{} }
            }
        }
    },

// 4
    { key:'drone_quad', name:'Drone Transport (quadcopter)', type:'transport', subtype:'flying',
        mass:8, volume:12, cost:250, electricity:-0.8, capacity:0, slots:4, parentSlotsUsed:0,
        provides:{
            mobility:{
                moveTo:{ params:{ coord:'geo.coord', speed_mps:Number }, caps:{ speed_mps:[0,12], load_kg_max:3, alt_m_max:120 } },
                followPath:{ params:{ path:'geo.path', speed_mps:Number }, caps:{ speed_mps:[0,12] } },
                hold:{ params:{ duration_s:Number }, caps:{ duration_s:[0,1800] } },
                setMode:{ params:{ mode:['aerial'] }, caps:{} }
            }
        }
    },

// 5
    { key:'drone_fixed', name:'Drone Transport (fixed wing)', type:'transport', subtype:'flying',
        mass:12, volume:18, cost:350, electricity:-0.6, capacity:0, slots:6, parentSlotsUsed:0,
        provides:{
            mobility:{
                moveTo:{ params:{ coord:'geo.coord', speed_mps:Number }, caps:{ speed_mps:[10,25], load_kg_max:5, alt_m_max:300 } },
                followPath:{ params:{ path:'geo.path', speed_mps:Number }, caps:{ speed_mps:[10,25] } },
                hold:{ params:{ duration_s:Number }, caps:{ duration_s:[0,900] } },
                setMode:{ params:{ mode:['aerial'] }, caps:{} }
            }
        }
    },

// 6
    { key:'pole', name:'Pole', type:'support', subtype:'pole',
        mass:10, volume:20, cost:40, electricity:0, capacity:0, slots:3, parentSlotsUsed:0,
        provides:{
            support:{ anchor:{ params:{}, caps:{ mount_points:3 } } }
        }
    },

// 7
    { key:'shelf_rack', name:'Shelf Rack', type:'support', subtype:'shelfRack',
        mass:18, volume:40, cost:35, electricity:0, capacity:0, slots:2, parentSlotsUsed:0,
        provides:{
            support:{ frame:{ params:{}, caps:{ mount_points:2 } } }
        }
    },

// 8
    { key:'arm_small', name:'Robotic Arm (small)', type:'arm', subtype:'small',
        mass:12, volume:12, cost:70, electricity:-0.4, capacity:0, slots:1, parentSlotsUsed:1,
        provides:{
            manip:{
                setPose:{ params:{ x_m:Number, y_m:Number, z_m:Number, roll_rad:Number, pitch_rad:Number, yaw_rad:Number }, caps:{ reach_m:0.9 } },
                movePath:{ params:{ path:{ points:Array } }, caps:{ reach_m:0.9 } },
                grip:{ params:{ state:['open','close'], force_N:Number }, caps:{ force_N:[0,250] } },
                applyForce:{ params:{ fx_N:Number, fy_N:Number, fz_N:Number, duration_s:Number }, caps:{ fz_N:[-200,200] } }
            }
        }
    },

// 9
    { key:'arm_medium', name:'Robotic Arm (medium)', type:'arm', subtype:'medium',
        mass:18, volume:20, cost:100, electricity:-0.6, capacity:0, slots:2, parentSlotsUsed:1,
        provides:{
            manip:{
                setPose:{ params:{ x_m:Number, y_m:Number, z_m:Number, roll_rad:Number, pitch_rad:Number, yaw_rad:Number }, caps:{ reach_m:1.1 } },
                movePath:{ params:{ path:{ points:Array } }, caps:{ reach_m:1.1 } },
                grip:{ params:{ state:['open','close'], force_N:Number }, caps:{ force_N:[0,400] } },
                applyForce:{ params:{ fx_N:Number, fy_N:Number, fz_N:Number, duration_s:Number }, caps:{ fz_N:[-300,300] } }
            }
        }
    },

// 10
    { key:'arm_heavy', name:'Robotic Arm (heavy)', type:'arm', subtype:'heavy',
        mass:28, volume:30, cost:160, electricity:-0.8, capacity:0, slots:1, parentSlotsUsed:1,
        provides:{
            manip:{
                setPose:{ params:{ x_m:Number, y_m:Number, z_m:Number, roll_rad:Number, pitch_rad:Number, yaw_rad:Number }, caps:{ reach_m:1.2 } },
                movePath:{ params:{ path:{ points:Array } }, caps:{ reach_m:1.2 } },
                grip:{ params:{ state:['open','close'], force_N:Number }, caps:{ force_N:[0,600] } },
                applyForce:{ params:{ fx_N:Number, fy_N:Number, fz_N:Number, duration_s:Number }, caps:{ fz_N:[-500,500] } }
            }
        }
    },

// 11
    { key:'tool_borer', name:'Hole-Borer', type:'tool', subtype:'borer',
        mass:6, volume:8, cost:40, electricity:-0.4, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{
            borer:{ bore:{ params:{ x_m:Number, y_m:Number, depth_m:Number, diameter_m:Number, rpm:Number, feed_mm_per_rev:Number }, caps:{ depth_m:[0,0.4], diameter_m:[0.01,0.08] } } }
        }
    },

// 12
    { key:'tool_gripper', name:'Gripper', type:'tool', subtype:'gripper',
        mass:4, volume:5, cost:30, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{
            gripper:{ grip:{ params:{ state:['open','close'], force_N:Number }, caps:{ force_N:[0,300] } } }
        }
    },

// 13
    { key:'tool_cutter', name:'Cutter/Saw', type:'tool', subtype:'cutter',
        mass:5, volume:6, cost:35, electricity:-0.5, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{
            cutter:{ cutPolyline:{ params:{ path:'geo.path', depth_m:Number, feed_mps:Number }, caps:{ depth_m:[0,0.05], feed_mps:[0,0.6] } } }
        }
    },

// 14
    { key:'tool_pruner', name:'Pruner', type:'tool', subtype:'pruner',
        mass:3, volume:4, cost:32, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{
            pruner:{ snip:{ params:{ points:{ items:'cartesian[]' } }, caps:{ branch_diameter_m:[0,0.02] } } }
        }
    },

// 15
    { key:'tool_suction', name:'Suction Tool', type:'tool', subtype:'suction',
        mass:3, volume:4, cost:25, electricity:-0.3, capacity:1, slots:0, parentSlotsUsed:1,
        provides:{
            suction:{
                pick:{ params:{ x_m:Number, y_m:Number, z_m:Number }, caps:{ mass_kg:[0,0.5] } },
                release:{ params:{ x_m:Number, y_m:Number, z_m:Number }, caps:{} }
            }
        }
    },

// 16
    { key:'tool_seeder', name:'Seeder', type:'tool', subtype:'seeder',
        mass:10, volume:15, cost:45, electricity:-0.1, capacity:5, slots:0, parentSlotsUsed:1,
        provides:{
            seeder:{ seedRows:{ params:{ rows:{ items:'line[]' }, rate_seeds_per_m:Number, depth_m:Number }, caps:{ rate_seeds_per_m:[5,60], depth_m:[0.01,0.05] } } }
        }
    },

// 17
    { key:'tool_digger', name:'Digger', type:'tool', subtype:'digger',
        mass:7, volume:9, cost:50, electricity:-0.5, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{
            digger:{ trench:{ params:{ path:'geo.path', width_m:Number, depth_m:Number }, caps:{ width_m:[0.05,0.2], depth_m:[0,0.3] } } }
        }
    },

// 18
    { key:'tool_brush', name:'Brush Tool', type:'tool', subtype:'brush',
        mass:4, volume:6, cost:30, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{
            brush:{ brushArea:{ params:{ area:'plan.area', rpm:Number }, caps:{ rpm:[200,1200] } } }
        }
    },

// 19
    { key:'tool_rotating', name:'Rotating Blades', type:'tool', subtype:'rotatingblades',
        mass:5, volume:7, cost:45, electricity:-1.5, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{
            mower:{ cutMow:{ params:{ area:'plan.area', height_m:Number, speed_mps:Number }, caps:{ height_m:[0.02,0.08], speed_mps:[0.2,1.5] } } }
        }
    },

// 20
    { key:'tool_pitchfork', name:'Pitchfork', type:'tool', subtype:'pitchfork',
        mass:2, volume:3, cost:28, electricity:0, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{
            pitchfork:{
                lift:{ params:{ mass_kg:Number }, caps:{ mass_kg:[0,0.2] } },
                move:{ params:{ path:'geo.path', mass_kg:Number }, caps:{ mass_kg:[0,0.2] } }
            }
        }
    },

// 21
    { key:'tool_flattener', name:'Flattener Module', type:'tool', subtype:'flattener',
        mass:12, volume:20, cost:60, electricity:0, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{
            flattener:{ flattenArea:{ params:{ area:'plan.area', passes:Number }, caps:{ passes:[1,5] } } }
        }
    },

// 22
    { key:'tool_grader', name:'Grader Module', type:'tool', subtype:'grader',
        mass:14, volume:24, cost:70, electricity:-0.3, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{
            grader:{ gradeProfile:{ params:{ path:'geo.path', target_z_m:Number }, caps:{ target_z_m:[-0.1,0.1] } } }
        }
    },

// 23
    { key:'tool_anchor', name:'Anchor Driver Module', type:'tool', subtype:'anchor_driver',
        mass:9, volume:12, cost:55, electricity:-0.5, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{
            anchor:{ drive:{ params:{ x_m:Number, y_m:Number, depth_m:Number, torque_Nm:Number }, caps:{ depth_m:[0,0.5], torque_Nm:[0,200] } } }
        }
    },

// 24
    { key:'cart_std', name:'Cart', type:'cart',
        mass:15, volume:50, cost:60, electricity:0, capacity:100, slots:0, parentSlotsUsed:1,
        provides:{
            payload:{
                load:{ params:{ mass_kg:Number|undefined, volume_L:Number|undefined }, caps:{ mass_kg:[0,100], volume_L:[0,100] } },
                unload:{ params:{ mass_kg:Number|undefined, volume_L:Number|undefined }, caps:{ mass_kg:[0,100], volume_L:[0,100] } },
                status:{ params:{}, caps:{} }
            }
        }
    },

// 25
    { key:'tank_std', name:'Tank', type:'tank',
        mass:20, volume:60, cost:70, electricity:0, capacity:50, slots:0, parentSlotsUsed:1,
        provides:{
            tank:{
                level:{ params:{}, caps:{ volume_L:[0,50] } },
                capacity:{ params:{}, caps:{ volume_L_max:50 } }
            },
            payload:{
                load:{ params:{ volume_L:Number }, caps:{ volume_L:[0,50] } },
                unload:{ params:{ volume_L:Number }, caps:{ volume_L:[0,50] } }
            }
        }
    },
    // 26
    { key:'sprayer_std', name:'Sprayer', type:'sprayer',
        mass:6, volume:8, cost:40, electricity:-0.3, capacity:2, slots:0, parentSlotsUsed:1,
        provides:{
            sprayer:{
                apply:{ params:{ area:'plan.area'|'geo.path', rate_L_per_ha:Number, droplet_um:Number, pressure_bar:Number },
                    caps:{ rate_L_per_ha:[50,300], pressure_bar:[1,6] } }
            }
        }
    },

// 27
    { key:'spreader_fertilizer', name:'Fertilizer Spreader', type:'spreader',
        mass:10, volume:15, cost:45, electricity:-0.2, capacity:30, slots:0, parentSlotsUsed:1,
        provides:{
            spreader:{
                dispense:{ params:{ area:'plan.area'|'geo.path', rate_kg_per_ha:Number, material:String },
                    caps:{ rate_kg_per_ha:[10,400] } }
            }
        }
    },

// 28
    { key:'seed_box', name:'Seed Box', type:'seedbox',
        mass:5, volume:10, cost:20, electricity:0, capacity:20, slots:0, parentSlotsUsed:1,
        provides:{
            payload:{
                load:{ params:{ volume_L:Number|undefined, mass_kg:Number|undefined }, caps:{ volume_L:[0,20] } },
                unload:{ params:{ volume_L:Number|undefined, mass_kg:Number|undefined }, caps:{ volume_L:[0,20] } },
                status:{ params:{}, caps:{} }
            }
        }
    },

// 29
    { key:'sensor_air_temp', name:'Air Thermometer', type:'sensor', subtype:'air_temp',
        mass:0.3, volume:0.2, cost:25, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_air_temp:{ params:{}, caps:{} } } }
    },

// 30
    { key:'sensor_air_humidity', name:'Hygrometer', type:'sensor', subtype:'air_humidity',
        mass:0.3, volume:0.2, cost:25, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_air_humidity:{ params:{}, caps:{} } } }
    },

// 31
    { key:'sensor_barometer', name:'Barometer', type:'sensor', subtype:'pressure',
        mass:0.4, volume:0.2, cost:30, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_pressure:{ params:{}, caps:{} } } }
    },

// 32
    { key:'sensor_anemometer', name:'Wind Speed (Anemometer)', type:'sensor', subtype:'wind_speed',
        mass:0.8, volume:0.6, cost:35, electricity:-0.08, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_wind_speed:{ params:{}, caps:{} } } }
    },

// 33
    { key:'sensor_wind_vane', name:'Wind Direction (Vane)', type:'sensor', subtype:'wind_dir',
        mass:0.6, volume:0.5, cost:25, electricity:-0.03, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_wind_dir:{ params:{}, caps:{} } } }
    },

// 34
    { key:'sensor_rain_gauge', name:'Rain Gauge', type:'sensor', subtype:'rainfall',
        mass:0.9, volume:0.8, cost:30, electricity:-0.03, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_rainfall:{ params:{}, caps:{} } } }
    },

// 35
    { key:'sensor_pyranometer', name:'Solar Radiation (Pyranometer)', type:'sensor', subtype:'solar_rad',
        mass:0.7, volume:0.6, cost:45, electricity:-0.08, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_solar_rad:{ params:{}, caps:{} } } }
    },

// 36
    { key:'sensor_par', name:'PAR Sensor', type:'sensor', subtype:'par',
        mass:0.6, volume:0.5, cost:45, electricity:-0.08, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_par:{ params:{}, caps:{} } } }
    },

// 37
    { key:'sensor_uv', name:'UV Index Sensor', type:'sensor', subtype:'uv',
        mass:0.4, volume:0.3, cost:35, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_uv:{ params:{}, caps:{} } } }
    },

// 38
    { key:'sensor_soil_moisture', name:'Soil Moisture Probe', type:'sensor', subtype:'soil_moisture',
        mass:0.8, volume:0.6, cost:35, electricity:-0.08, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_soil_moisture:{ params:{}, caps:{} } } }
    },

// 39
    { key:'sensor_soil_temp', name:'Soil Thermometer', type:'sensor', subtype:'soil_temp',
        mass:0.5, volume:0.4, cost:30, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_soil_temp:{ params:{}, caps:{} } } }
    },

// 40
    { key:'sensor_water_level', name:'Water Level Sensor', type:'sensor', subtype:'water_level',
        mass:0.8, volume:0.7, cost:40, electricity:-0.08, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_water_level:{ params:{}, caps:{} } } }
    },

// 41
    { key:'sensor_flow_meter', name:'Flow Meter', type:'sensor', subtype:'flow',
        mass:1.0, volume:0.8, cost:45, electricity:-0.1, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_flow:{ params:{}, caps:{} } } }
    },

// 42
    { key:'sensor_turbidity', name:'Turbidity Sensor', type:'sensor', subtype:'turbidity',
        mass:0.9, volume:0.7, cost:45, electricity:-0.1, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_turbidity:{ params:{}, caps:{} } } }
    },

// 43
    { key:'sensor_leaf_wetness', name:'Leaf Wetness Sensor', type:'sensor', subtype:'leaf_wetness',
        mass:0.3, volume:0.2, cost:30, electricity:-0.03, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_leaf_wetness:{ params:{}, caps:{} } } }
    },

// 44
    { key:'sensor_chlorophyll', name:'Leaf Chlorophyll Meter', type:'sensor', subtype:'chlorophyll_spad',
        mass:0.6, volume:0.5, cost:60, electricity:-0.1, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_chlorophyll_spad:{ params:{}, caps:{} } } }
    },

// 45
    { key:'gps_basic', name:'GPS Module', type:'gps', subtype:'basic',
        mass:0.5, volume:0.4, cost:20, electricity:-0.1, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ nav:{ fix:{ params:{}, caps:{} }, heading:{ params:{}, caps:{} } } }
    },

// 46
    { key:'gps_rtk', name:'RTK GPS Module', type:'gps', subtype:'rtk',
        mass:0.9, volume:0.6, cost:120, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ nav:{ fix:{ params:{}, caps:{} }, heading:{ params:{}, caps:{} }, rtkFix:{ params:{}, caps:{} } } }
    },

// 47
    { key:'sensor_lidar', name:'LIDAR Module', type:'sensor', subtype:'lidar',
        mass:2.2, volume:2.0, cost:100, electricity:-0.8, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ lidar:{ scan:{ params:{ fov_deg:Number, res_deg:Number }, caps:{ fov_deg:[30,360] } } } }
    },

// 48
    { key:'camera_rgb', name:'RGB Camera', type:'camera', subtype:'rgb',
        mass:0.8, volume:0.7, cost:50, electricity:-0.5, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ camera:{ capture_rgb:{ params:{ res_px:Number, exposure_ms:Number }, caps:{ res_px:[0.3e6,24e6] } } } }
    },

// 49
    { key:'camera_ms', name:'Multispectral Camera', type:'camera', subtype:'ms',
        mass:1.2, volume:1.0, cost:70, electricity:-0.7, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ camera:{ capture_ms:{ params:{ res_px:Number, bands:Number }, caps:{ bands:[4,12] } } } }
    },

// 50
    { key:'camera_ir', name:'Thermal IR Camera', type:'camera', subtype:'ir',
        mass:1.0, volume:0.9, cost:65, electricity:-0.6, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ camera:{ capture_ir:{ params:{ res_px:Number, temp_range_C:[Number,Number] }, caps:{ temp_range_C:[-20,200] } } } }
    },
// 51
    { key:'sensor_weighing', name:'Weighing module', type:'sensor', subtype:'weighing',
        mass:5, volume:6, cost:25, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_weighing:{ params:{}, caps:{ range_kg:[0,200] } } } }
    },

// 52
    { key:'comms_repeater', name:'Communications Repeater', type:'communications', subtype:'repeater',
        mass:8, volume:10, cost:300, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ comms:{
                status:{ params:{}, caps:{ } },
                send:{ params:{ topic:String, bytes:'Buffer' }, caps:{ } },
                subscribe:{ params:{ topic:String }, caps:{ } }
            } }
    },

// 53
    { key:'radio_client', name:'Radio Client', type:'communications', subtype:'client',
        mass:1, volume:1, cost:120, electricity:-0.1, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ comms:{
                status:{ params:{}, caps:{ } },
                send:{ params:{ topic:String, bytes:'Buffer' }, caps:{ } },
                subscribe:{ params:{ topic:String }, caps:{ } }
            } }
    },

// 54
    { key:'controller_rt', name:'Real-Time Controller', type:'computer', subtype:'rt_control',
        mass:1.5, volume:1.2, cost:180, electricity:-0.15, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ control:{
                setCycle:{ params:{ period_ms:Number, programId:String }, caps:{ period_ms:[5,1000] } },
                read:{ params:{ variable:String }, caps:{ } }
            } }
    },

// 55
    { key:'solar_panel', name:'Solar Panel', type:'solar', subtype:null,
        mass:10, volume:15, cost:50, electricity:+0.15, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ power:{
                gen_dc:{ params:{ kW:Number }, caps:{ kW:[0,0.15] } },
                charge:{ params:{ kW:Number, duration_s:Number }, caps:{ kW:[0,0.15] } }
            } }
    },

// 56
    { key:'valve_inline', name:'Valve module', type:'valve', subtype:null,
        mass:2, volume:1, cost:35, electricity:-0.1, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ valve:{ set:{ params:{ open_pct:Number }, caps:{ open_pct:[0,100] } } } }
    },

// 57
    { key:'pump_inline', name:'Pump module', type:'pump', subtype:null,
        mass:7, volume:10, cost:60, electricity:-0.5, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ pump:{
                setFlow:{ params:{ flow_Lps:Number }, caps:{ flow_Lps:[0.1,1.2] } },
                run:{ params:{ flow_Lps:Number, duration_s:Number }, caps:{ flow_Lps:[0.1,1.2], duration_s:[1,3600] } }
            } }
    },

// 58
    { key:'heating', name:'Heating Module', type:'heating', subtype:null,
        mass:20, volume:30, cost:60, electricity:-0.6, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ env:{ heat_set:{ params:{ temp_C:Number }, caps:{ temp_C:[5,40] } } } }
    },

// 59
    { key:'humidifier', name:'Heater/Humidifier module', type:'humidifier', subtype:null,
        mass:15, volume:25, cost:40, electricity:-0.4, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ env:{ humidity_set:{ params:{ rh_pct:Number }, caps:{ rh_pct:[30,95] } } } }
    },

// 60
    { key:'internal_space', name:'Internal Space', type:'internalSpace', subtype:null,
        mass:500, volume:1200, cost:1500, electricity:0, capacity:0, slots:16, parentSlotsUsed:0,
        provides:{ enclosure:{
                allocateSlot:{ params:{ moduleKey:String }, caps:{ slots:[0,16] } },
                status:{ params:{}, caps:{ slots_total:16 } }
            } }
    },

// 61
    { key:'server_rack', name:'Server Rack', type:'computer', subtype:'server',
        mass:120, volume:200, cost:4000, electricity:-2.5, capacity:0, slots:2, parentSlotsUsed:1,
        provides:{ compute:{
                edge_run:{ params:{ taskId:String, payload:Object }, caps:{ } },
                edge_schedule:{ params:{ cron:String, taskId:String }, caps:{ } }
            } }
    },

// 62
    { key:'storage_array', name:'Storage Array', type:'computer', subtype:'storage',
        mass:80, volume:150, cost:2500, electricity:-1.2, capacity:0, slots:1, parentSlotsUsed:1,
        provides:{ storage:{
                save:{ params:{ key:String, bytes:'Buffer' }, caps:{ } },
                load:{ params:{ key:String }, caps:{ } },
                status:{ params:{}, caps:{ } }
            } }
    },

// 63
    { key:'core_router', name:'Core Router', type:'communications', subtype:'router_core',
        mass:10, volume:12, cost:1200, electricity:-0.5, capacity:0, slots:2, parentSlotsUsed:1,
        provides:{ comms:{
                status:{ params:{}, caps:{ throughput_mbps:[0,1000] } },
                send:{ params:{ topic:String, bytes:'Buffer' }, caps:{ } },
                subscribe:{ params:{ topic:String }, caps:{ } }
            } }
    },

// 64
    { key:'antenna_mast', name:'Antenna Mast', type:'support', subtype:'antenna',
        mass:50, volume:120, cost:600, electricity:0, capacity:0, slots:3, parentSlotsUsed:0,
        provides:{ support:{ frame:{ params:{}, caps:{ mount_points:3 } } } }
    },

// 65
    { key:'hvac_unit', name:'HVAC Unit', type:'hvac', subtype:null,
        mass:60, volume:100, cost:1500, electricity:-1.2, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ env:{
                cool_set:{ params:{ temp_C:Number }, caps:{ temp_C:[10,30] } },
                heat_set:{ params:{ temp_C:Number }, caps:{ temp_C:[10,30] } },
                air_move:{ params:{ flow_cfm:Number }, caps:{ flow_cfm:[100,2000] } }
            } }
    },

// 66
    { key:'shelf_robotic', name:'Robotic Shelf', type:'shelf', subtype:'robotic',
        mass:40, volume:90, cost:900, electricity:-0.4, capacity:0, slots:4, parentSlotsUsed:1,
        provides:{ tray:{
                insert:{ params:{ slot_id:String }, caps:{ slots:[0,4] } },
                remove:{ params:{ slot_id:String }, caps:{ slots:[0,4] } },
                status:{ params:{}, caps:{ slots_total:4 } }
            } }
    },

// 67
    { key:'conveyor', name:'Conveyor', type:'conveyor', subtype:null,
        mass:30, volume:80, cost:700, electricity:-0.6, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ conveyor:{
                transfer:{ params:{ mass_kg:Number, from:String, to:String }, caps:{ mass_kg:[0,50] } }
            } }
    },

// 68
    { key:'sensor_rfid', name:'RFID/Barcode Reader', type:'sensor', subtype:'rfid',
        mass:0.7, volume:0.5, cost:80, electricity:-0.1, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_rfid:{ params:{}, caps:{ } } } }
    },

// 69
    { key:'animal_collar', name:'Animal Collar', type:'collar', subtype:null,
        mass:0.2, volume:0.1, cost:1, electricity:0, capacity:0, slots:2, parentSlotsUsed:0,
        provides:{ geofence:{
                track:{ params:{}, caps:{ } },
                alert:{ params:{ level:String }, caps:{ } }
            } }
    },

// 70
    { key:'alarm_audio', name:'Audio Alarm', type:'alarm', subtype:'audio',
        mass:0.1, volume:0.05, cost:2, electricity:-0.02, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ alarm:{ trigger_audio:{ params:{ level:Number, duration_s:Number }, caps:{ level:[1,10], duration_s:[1,600] } } } }
    },

// 71
    { key:'alarm_electric', name:'Mild Shocker', type:'alarm', subtype:'electric',
        mass:0.1, volume:0.05, cost:2, electricity:-0.02, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ alarm:{ trigger_electric:{ params:{ level:Number, duration_s:Number }, caps:{ level:[1,5], duration_s:[1,10] } } } }
    },

// 72
    { key:'feed_hopper', name:'Feed Hopper', type:'feed', subtype:null,
        mass:120, volume:300, cost:1800, electricity:0, capacity:200, slots:0, parentSlotsUsed:1,
        provides:{ material:{ feed:{ params:{ mass_kg:Number|undefined, volume_L:Number|undefined }, caps:{ volume_L:[0,200] } } } }
    },

// 73
    { key:'feed_shredder', name:'Shredder/Macerator', type:'pretreat', subtype:null,
        mass:90, volume:120, cost:2500, electricity:-2.0, capacity:10, slots:0, parentSlotsUsed:1,
        provides:{ material:{ grind:{ params:{ throughput_kgph:Number }, caps:{ throughput_kgph:[50,500] } } } }
    },

// 74
    { key:'feed_auger', name:'Auger Conveyor', type:'conveyor', subtype:'auger',
        mass:80, volume:150, cost:2200, electricity:-1.0, capacity:8, slots:0, parentSlotsUsed:1,
        provides:{ conveyor:{ transfer:{ params:{ mass_kg:Number, from:String, to:String }, caps:{ mass_kg:[0,80] } } } }
    },

// 75
    { key:'slurry_pump', name:'Slurry Pump', type:'pump', subtype:'slurry',
        mass:60, volume:80, cost:1800, electricity:-1.5, capacity:12, slots:0, parentSlotsUsed:1,
        provides:{ pump:{
                setFlow:{ params:{ flow_Lps:Number }, caps:{ flow_Lps:[0.2,3.0] } },
                run:{ params:{ flow_Lps:Number, duration_s:Number }, caps:{ flow_Lps:[0.2,3.0], duration_s:[1,7200] } }
            } }
    },
    // 76
    { key:'digester_tank', name:'Digester Tank', type:'vessel', subtype:null,
        mass:3000, volume:10000, cost:40000, electricity:0, capacity:1000, slots:4, parentSlotsUsed:1,
        provides:{ vessel:{
                store:{ params:{ volume_L:Number }, caps:{ volume_L:[0,1000] } }
            } }
    },

// 77
    { key:'digester_mixer', name:'Digester Mixer/Agitator', type:'mixer', subtype:null,
        mass:120, volume:200, cost:6000, electricity:-2.0, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ material:{
                mix:{ params:{ rpm:Number, duration_s:Number }, caps:{ rpm:[10,120], duration_s:[1,7200] } }
            } }
    },

// 78
    { key:'digester_heater', name:'Heater Coil', type:'heater', subtype:null,
        mass:90, volume:120, cost:4500, electricity:-0.5, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ env:{
                heat_set:{ params:{ temp_C:Number }, caps:{ temp_C:[25,55] } }
            } }
    },

// 79
    { key:'heat_exchanger', name:'Heat Exchanger (CHP→Digester)', type:'heat_xfer', subtype:null,
        mass:120, volume:160, cost:5200, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ heat:{
                transfer:{ params:{ from:String, to:String, kW:Number }, caps:{ kW:[0,50] } }
            } }
    },

// 80
    { key:'sensor_digester_temp', name:'Digester Temperature', type:'sensor', subtype:'digester_temp',
        mass:1, volume:1, cost:120, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_digester_temp:{ params:{}, caps:{} } } }
    },

// 81
    { key:'sensor_digester_ph', name:'Digester pH', type:'sensor', subtype:'ph',
        mass:1, volume:1, cost:150, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_ph:{ params:{}, caps:{} } } }
    },

// 82
    { key:'gasholder', name:'Gas Holder/Dome', type:'gas_storage', subtype:null,
        mass:500, volume:1500, cost:9000, electricity:0, capacity:300, slots:1, parentSlotsUsed:1,
        provides:{ gas:{
                store:{ params:{ volume_Nm3:Number }, caps:{ volume_Nm3:[0,300] } }
            } }
    },

// 83
    { key:'gas_blower', name:'Gas Blower', type:'gas_move', subtype:null,
        mass:45, volume:60, cost:2000, electricity:-0.6, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ gas:{
                move:{ params:{ flow_Nm3_h:Number }, caps:{ flow_Nm3_h:[5,200] } }
            } }
    },

// 84
    { key:'gas_condenser', name:'Gas Cooler/Condenser', type:'gas_dry', subtype:null,
        mass:70, volume:90, cost:2800, electricity:-0.4, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ gas:{
                cool:{ params:{ setpoint_C:Number }, caps:{ setpoint_C:[5,25] } }
            } }
    },

// 85
    { key:'h2s_scrubber_ac', name:'H2S Scrubber (Activated Carbon)', type:'gas_clean', subtype:'h2s_ac',
        mass:180, volume:220, cost:6500, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ gas:{
                clean:{ params:{ mode:['H2S_AC'] }, caps:{ } }
            } }
    },

// 86
    { key:'h2s_scrubber_btf', name:'H2S Biotrickling Filter', type:'gas_clean', subtype:'h2s_btf',
        mass:350, volume:500, cost:12000, electricity:-0.8, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ gas:{
                clean:{ params:{ mode:['H2S_BTF'] }, caps:{ } }
            } }
    },

// 87
    { key:'gas_filter_partic', name:'Particulate Filter', type:'gas_filter', subtype:null,
        mass:25, volume:30, cost:800, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ gas:{
                filter:{ params:{ micron:Number }, caps:{ micron:[1,50] } }
            } }
    },

// 88
    { key:'gas_regulator', name:'Pressure Regulator', type:'gas_control', subtype:null,
        mass:10, volume:8, cost:600, electricity:0, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ gas:{
                regulate:{ params:{ pressure_out_bar:Number }, caps:{ pressure_out_bar:[0.1,10] } }
            } }
    },

// 89
    { key:'flame_arrester', name:'Flame Arrester', type:'safety', subtype:null,
        mass:18, volume:12, cost:900, electricity:0, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ safety:{ flame_arrest_status:{ params:{}, caps:{} } } }
    },

// 90
    { key:'safety_relief', name:'Relief Valve', type:'safety', subtype:null,
        mass:12, volume:8, cost:500, electricity:0, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ safety:{ relief_status:{ params:{}, caps:{} } } }
    },

// 91
    { key:'flare_stack', name:'Emergency Flare', type:'flare', subtype:null,
        mass:180, volume:300, cost:7000, electricity:0, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ gas:{
                burnoff:{ params:{ rate_Nm3_h:Number }, caps:{ rate_Nm3_h:[5,300] } }
            } }
    },

// 92
    { key:'sensor_gas_flow', name:'Gas Flow Meter', type:'sensor', subtype:'gas_flow',
        mass:3, volume:2, cost:600, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ gas:{ measure_flow:{ params:{}, caps:{ } } } }
    },

// 93
    { key:'sensor_gas_ch4', name:'Methane Analyzer', type:'sensor', subtype:'ch4',
        mass:4, volume:3, cost:1800, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ gas:{ analyze_CH4:{ params:{}, caps:{ } } } }
    },

// 94
    { key:'sensor_gas_h2s', name:'H2S Analyzer', type:'sensor', subtype:'h2s',
        mass:4, volume:3, cost:1600, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ gas:{ analyze_H2S:{ params:{}, caps:{ } } } }
    },

// 95
    { key:'sensor_gas_pressure', name:'Gas Pressure', type:'sensor', subtype:'gas_pressure',
        mass:1, volume:1, cost:200, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_gas_pressure:{ params:{}, caps:{ } } } }
    },

// 96
    { key:'biogas_engine', name:'Biogas Engine', type:'engine', subtype:null,
        mass:1200, volume:2500, cost:45000, electricity:-1.0, capacity:0, slots:1, parentSlotsUsed:1,
        provides:{ power:{
                gen_mechanical:{ params:{ kW:Number }, caps:{ kW:[0,150] } }
            } }
    },

// 97
    { key:'generator_alt', name:'Generator/Alternator', type:'generator', subtype:null,
        mass:600, volume:1200, cost:22000, electricity:+2.0, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ power:{
                gen_dc:{ params:{ kW:Number }, caps:{ kW:[0,120] } }
            } }
    },

// 98
    { key:'chp_heat_recovery', name:'CHP Heat Recovery', type:'heat_recovery', subtype:null,
        mass:200, volume:300, cost:9000, electricity:-0.3, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ heat:{
                recover:{ params:{ kW:Number }, caps:{ kW:[0,80] } }
            } }
    },

// 99
    { key:'grid_inverter', name:'Grid-Tie Inverter/Switchgear', type:'power_elec', subtype:null,
        mass:150, volume:200, cost:12000, electricity:-0.3, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ power:{
                gridTie:{ params:{ kW:Number }, caps:{ kW:[0,100] } },
                convert_dc:{ params:{ kW:Number }, caps:{ kW:[0,100] } }
            } }
    },

// 100
    { key:'separator_press', name:'Screw Press Separator', type:'separator', subtype:null,
        mass:350, volume:500, cost:18000, electricity:-1.2, capacity:15, slots:0, parentSlotsUsed:1,
        provides:{ material:{
                separate:{ params:{ throughput_kgph:Number }, caps:{ throughput_kgph:[100,2000] } }
            } }
    },

// 101
    { key:'digestate_pump', name:'Digestate Pump', type:'pump', subtype:'digestate',
        mass:45, volume:60, cost:1400, electricity:-1.0, capacity:10, slots:0, parentSlotsUsed:1,
        provides:{ pump:{
                setFlow:{ params:{ flow_Lps:Number }, caps:{ flow_Lps:[0.2,2.0] } },
                run:{ params:{ flow_Lps:Number, duration_s:Number }, caps:{ flow_Lps:[0.2,2.0], duration_s:[1,7200] } }
            } }
    },

// 102
    { key:'digestate_tank', name:'Digestate Storage Tank', type:'tank', subtype:'digestate',
        mass:1200, volume:8000, cost:20000, electricity:0, capacity:800, slots:0, parentSlotsUsed:1,
        provides:{
            tank:{
                level:{ params:{}, caps:{ volume_L:[0,800] } },
                capacity:{ params:{}, caps:{ volume_L_max:800 } }
            },
            payload:{
                load:{ params:{ volume_L:Number }, caps:{ volume_L:[0,800] } },
                unload:{ params:{ volume_L:Number }, caps:{ volume_L:[0,800] } }
            }
        }
    },

// 103
    { key:'substrate_mixer', name:'Substrate Mixer/Tumbler', type:'mixer', subtype:null,
        mass:120, volume:200, cost:3800, electricity:-0.8, capacity:150, slots:0, parentSlotsUsed:1,
        provides:{ material:{
                mix:{ params:{ rpm:Number, duration_s:Number }, caps:{ rpm:[5,60], duration_s:[10,7200] } }
            } }
    },

// 104
    { key:'steam_generator', name:'Steam Generator', type:'steam_gen', subtype:null,
        mass:140, volume:220, cost:5200, electricity:-2.0, capacity:50, slots:0, parentSlotsUsed:1,
        provides:{ steam:{
                generate:{ params:{ rate_kg_per_h:Number }, caps:{ rate_kg_per_h:[5,50] } }
            } }
    },

// 105
    { key:'sterilizer_autoclave', name:'Autoclave (Substrate Sterilizer)', type:'sterilizer', subtype:'autoclave',
        mass:180, volume:260, cost:7800, electricity:-1.5, capacity:40, slots:0, parentSlotsUsed:1,
        provides:{ process:{
                sterilize:{ params:{ temp_C:Number, duration_s:Number }, caps:{ temp_C:[110,134], duration_s:[300,7200] } }
            } }
    },

// 106
    { key:'pasteurizer_tank', name:'Pasteurizer Tank', type:'pasteurizer', subtype:null,
        mass:160, volume:280, cost:6400, electricity:-1.2, capacity:80, slots:0, parentSlotsUsed:1,
        provides:{ process:{
                pasteurize:{ params:{ temp_C:Number, duration_s:Number }, caps:{ temp_C:[60,85], duration_s:[600,14400] } }
            } }
    },

// 107
    { key:'laminar_flow_hood', name:'Laminar Flow Hood', type:'air_clean', subtype:'laminar',
        mass:90, volume:140, cost:3500, electricity:-0.6, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ air:{
                clean:{ params:{ level:String }, caps:{ level:['laminar'] } }
            } }
    },

// 108
    { key:'hepa_filter_unit', name:'HEPA Filter Unit', type:'air_filter', subtype:'hepa',
        mass:40, volume:80, cost:1200, electricity:-0.3, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ air:{
                filter:{ params:{ micron:Number }, caps:{ micron:[0.3,1.0] } }
            } }
    },

// 109
    { key:'air_circulation_fan', name:'Air Circulation Fan', type:'fan', subtype:null,
        mass:20, volume:40, cost:600, electricity:-0.2, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ air:{
                move:{ params:{ flow_cfm:Number }, caps:{ flow_cfm:[50,1000] } }
            } }
    },

// 110
    { key:'spawn_dispenser', name:'Spawn/Inoculum Dispenser', type:'dispenser', subtype:'spawn',
        mass:25, volume:35, cost:2400, electricity:-0.4, capacity:10, slots:0, parentSlotsUsed:1,
        provides:{ material:{
                dispense:{ params:{ points:{ items:'geo.coord[]' }, amount_g_each:Number }, caps:{ amount_g_each:[1,100] } }
            } }
    },

// 111
    { key:'grow_tray_set', name:'Grow Tray Set', type:'tray', subtype:null,
        mass:15, volume:30, cost:400, electricity:0, capacity:20, slots:0, parentSlotsUsed:1,
        provides:{ payload:{
                load:{ params:{ volume_L:Number }, caps:{ volume_L:[0,20] } },
                unload:{ params:{ volume_L:Number }, caps:{ volume_L:[0,20] } }
            } }
    },

// 112
    { key:'co2_sensor_air', name:'CO₂ Sensor (Air)', type:'sensor', subtype:'co2',
        mass:0.6, volume:0.5, cost:140, electricity:-0.05, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ sensing:{ read_co2_air:{ params:{}, caps:{} } } }
    },

// 113
    { key:'box_mold_frame', name:'Box Mold Frame', type:'mold', subtype:'box',
        mass:30, volume:50, cost:900, electricity:0, capacity:4, slots:0, parentSlotsUsed:1,
        provides:{ manufacture:{
                mold:{ params:{ dims:{ w_m:Number, h_m:Number, d_m:Number } }, caps:{ volume_L:[0.5,5] } }
            } }
    },

// 114
    { key:'dehydrator_rack', name:'Dehydrator Rack', type:'dryer', subtype:'dehydrator',
        mass:120, volume:220, cost:4200, electricity:-1.2, capacity:30, slots:0, parentSlotsUsed:1,
        provides:{ process:{
                dry:{ params:{ temp_C:Number, duration_s:Number, airflow_cfm:Number }, caps:{ temp_C:[30,90], duration_s:[3600,86400] } }
            } }
    },

// 115
    { key:'dehumidifier_unit', name:'Dehumidifier', type:'dehumidifier', subtype:null,
        mass:45, volume:70, cost:1100, electricity:-0.6, capacity:0, slots:0, parentSlotsUsed:1,
        provides:{ env:{
                dehumidify:{ params:{ rh_setpoint_pct:Number }, caps:{ rh_setpoint_pct:[30,60] } }
            } }
    },

]




export {constants, moduleTypes}
