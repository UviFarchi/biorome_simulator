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
]




export {constants, moduleTypes}
