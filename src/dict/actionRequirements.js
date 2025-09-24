export const actionRequirements = {
    "anchor_structure": {
        "categories": [
            "Topography"
        ],
        "description": "Reshape or stabilize terrain.",
        "displayName": "Anchor Structure",
        "requires": [
            "followPath",
            "bore"
        ]
    },
    "animal_limit_area": {
        "categories": [
            "Animal Ops"
        ],
        "description": "Guide or constrain animals.",
        "displayName": "Animal Limit Area",
        "requires": [
            "trackAnimal",
            "triggerElectricAlarm"
        ]
    },
    "animal_move": {
        "categories": [
            "Animal Ops"
        ],
        "description": "Guide or constrain animals.",
        "displayName": "Animal Move",
        "requires": [
            "followPath",
            "triggerAudioAlarm"
        ]
    },
    "apply_fertilizer_sidedress": {
        "categories": [
            "Fertilizer"
        ],
        "description": "Produce and apply soil inputs.",
        "displayName": "Apply Fertilizer Sidedress",
        "requires": [
            "followPath"
        ]
    },
    "apply_mulch": {
        "categories": [
            "Cultivation"
        ],
        "description": "Crop care maintenance.",
        "displayName": "Apply Mulch",
        "requires": [
            "followPath",
            "dispense"
        ]
    },
    "bale_residue": {
        "categories": [
            "Waste/Processing"
        ],
        "description": "Handle residues and waste materials.",
        "displayName": "Bale Residue",
        "requires": []
    },
    "bootstrap_landos": {
        "categories": [
            "Comms/Compute"
        ],
        "description": "Communications and compute orchestration.",
        "displayName": "Bootstrap Landos",
        "requires": []
    },
    "build_assembly": {
        "categories": [
            "Logistics"
        ],
        "description": "Move or prepare assemblies on site.",
        "displayName": "Build Assembly",
        "requires": [
            "followPath",
            "bore",
            "digTrench",
            "brushArea"
        ]
    },
    "build_assembly_pad": {
        "categories": [
            "Logistics"
        ],
        "description": "Logistics for assemblies and supplies.",
        "displayName": "Build Assembly Pad",
        "requires": [
            "followPath",
            "brushArea"
        ]
    },
    "build_ditch": {
        "categories": [
            "Topography"
        ],
        "description": "Reshape or stabilize terrain.",
        "displayName": "Build Ditch",
        "requires": [
            "followPath",
            "digTrench",
            "brushArea"
        ]
    },
    "calibrate_soil_probes": {
        "categories": [
            "General"
        ],
        "description": "Perform a field operation.",
        "displayName": "Calibrate Soil Probes",
        "requires": [
            "calibrateEC",
            "calibratePH"
        ]
    },
    "char_biomass": {
        "categories": [
            "Waste/Processing"
        ],
        "description": "Handle residues and waste materials.",
        "displayName": "Char Biomass",
        "requires": []
    },
    "charge_on_dock": {
        "categories": [
            "Energy"
        ],
        "description": "Operate and manage power systems.",
        "displayName": "Charge On Dock",
        "requires": [
            "followPath",
            "chargeDock"
        ]
    },
    "clean_water_troughs": {
        "categories": [
            "Animal Ops"
        ],
        "description": "Animal husbandry operations.",
        "displayName": "Clean Water Troughs",
        "requires": [
            "followPath"
        ]
    },
    "collect_field_residue": {
        "categories": [
            "Waste/Processing"
        ],
        "description": "Handle residues and waste materials.",
        "displayName": "Collect Field Residue",
        "requires": [
            "followPath",
            "moveLoad"
        ]
    },
    "collect_manure": {
        "categories": [
            "Animal Ops"
        ],
        "description": "Animal husbandry operations.",
        "displayName": "Collect Manure",
        "requires": [
            "followPath",
            "moveLoad"
        ]
    },
    "compost_biomass": {
        "categories": [
            "Fertilizer"
        ],
        "description": "Produce and apply soil inputs.",
        "displayName": "Compost Biomass",
        "requires": []
    },
    "compress_biomass": {
        "categories": [
            "Waste/Processing"
        ],
        "description": "Handle residues and waste materials.",
        "displayName": "Compress Biomass",
        "requires": []
    },
    "convert_ac_to_dc": {
        "categories": [
            "Energy"
        ],
        "description": "Operate and manage power systems.",
        "displayName": "Convert AC To DC",
        "requires": []
    },
    "convert_dc_to_ac": {
        "categories": [
            "Energy"
        ],
        "description": "Operate and manage power systems.",
        "displayName": "Convert DC To AC",
        "requires": []
    },
    "cut_stalks_corn": {
        "categories": [
            "General"
        ],
        "description": "Perform an operational task.",
        "displayName": "Cut Stalks Corn",
        "requires": []
    },
    "cut_vine_grape": {
        "categories": [
            "General"
        ],
        "description": "Perform an operational task.",
        "displayName": "Cut Vine Grape",
        "requires": [
            "followPath"
        ]
    },
    "deploy_repeater": {
        "categories": [
            "Comms/Compute"
        ],
        "description": "Communications and compute orchestration.",
        "displayName": "Deploy Repeater",
        "requires": []
    },
    "dig_trench": {
        "categories": [
            "Topography"
        ],
        "description": "Reshape or stabilize terrain.",
        "displayName": "Dig Trench",
        "requires": [
            "followPath",
            "digTrench"
        ]
    },
    "digest_slurry": {
        "categories": [
            "Fertilizer"
        ],
        "description": "Produce and apply soil inputs.",
        "displayName": "Digest Slurry",
        "requires": []
    },
    "distribute_water_to_field": {
        "categories": [
            "Water"
        ],
        "description": "Manage water capture, treatment, and distribution.",
        "displayName": "Distribute Water To Field",
        "requires": [
            "followPath",
            "setFlow"
        ]
    },
    "drain": {
        "categories": [
            "Irrigation"
        ],
        "description": "Create drainage to remove excess water.",
        "displayName": "Drain",
        "requires": [
            "followPath",
            "digTrench"
        ]
    },
    "drain_field": {
        "categories": [
            "Irrigation"
        ],
        "description": "Create drainage to remove excess water.",
        "displayName": "Drain Field",
        "requires": [
            "followPath",
            "digTrench"
        ]
    },
    "drone_loudspeaker_deter": {
        "categories": [
            "Animal Control"
        ],
        "description": "Non-lethal animal control.",
        "displayName": "Drone Loudspeaker Deter",
        "requires": [
            "followPath"
        ]
    },
    "dry_dehydrate_biomass": {
        "categories": [
            "Waste/Processing"
        ],
        "description": "Handle residues and waste materials.",
        "displayName": "Dry Dehydrate Biomass",
        "requires": []
    },
    "electric_fence_pulse": {
        "categories": [
            "Animal Control"
        ],
        "description": "Non-lethal animal control.",
        "displayName": "Electric Fence Pulse",
        "requires": []
    },
    "evacuate_to_base": {
        "categories": [
            "Logistics"
        ],
        "description": "Logistics for assemblies and supplies.",
        "displayName": "Evacuate To Base",
        "requires": [
            "followPath"
        ]
    },
    "export_power_to_grid": {
        "categories": [
            "Energy"
        ],
        "description": "Operate and manage power systems.",
        "displayName": "Export Power To Grid",
        "requires": []
    },
    "fell_tree_orchard": {
        "categories": [
            "General"
        ],
        "description": "Perform an operational task.",
        "displayName": "Fell Tree Orchard",
        "requires": [
            "followPath"
        ]
    },
    "filter_water": {
        "categories": [
            "Water"
        ],
        "description": "Manage water capture, treatment, and distribution.",
        "displayName": "Filter Water",
        "requires": []
    },
    "flare_burnoff_biogas_contaminants": {
        "categories": [
            "Waste/Processing"
        ],
        "description": "Handle residues and waste materials.",
        "displayName": "Flare Burnoff Biogas Contaminants",
        "requires": []
    },
    "flatten": {
        "categories": [
            "Topography"
        ],
        "description": "Reshape ground profile.",
        "displayName": "Flatten",
        "requires": [
            "scanLidar3d",
            "digTrench",
            "brushArea"
        ]
    },
    "flush_irrigation_lines": {
        "categories": [
            "General"
        ],
        "description": "Perform an operational task.",
        "displayName": "Flush Irrigation Lines",
        "requires": [
            "followPath",
            "setFlow"
        ]
    },
    "foliar_spray": {
        "categories": [
            "Cultivation"
        ],
        "description": "Crop care maintenance.",
        "displayName": "Foliar Spray",
        "requires": [
            "followPath",
            "captureImage",
            "spray"
        ]
    },
    "generate_biogas": {
        "categories": [
            "Energy"
        ],
        "description": "Operate and manage power systems.",
        "displayName": "Generate Biogas",
        "requires": []
    },
    "generate_solar_dc": {
        "categories": [
            "Energy"
        ],
        "description": "Operate and manage power systems.",
        "displayName": "Generate Solar DC",
        "requires": []
    },
    "generate_steam_for_cleaning": {
        "categories": [
            "Waste/Processing"
        ],
        "description": "Handle residues and waste materials.",
        "displayName": "Generate Steam For Cleaning",
        "requires": []
    },
    "generate_wind_ac": {
        "categories": [
            "Energy"
        ],
        "description": "Operate and manage power systems.",
        "displayName": "Generate Wind AC",
        "requires": []
    },
    "grade_profile": {
        "categories": [
            "Topography"
        ],
        "description": "Reshape or stabilize terrain.",
        "displayName": "Grade Profile",
        "requires": [
            "followPath",
            "brushArea"
        ]
    },
    "harvest_acorn": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Acorn",
        "requires": [
            "followPath",
            "setPose",
            "grip",
            "moveLoad"
        ]
    },
    "harvest_apple": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Apple",
        "requires": [
            "followPath",
            "captureImage",
            "getObjectLocalCoordinates",
            "setPose",
            "grip",
            "cutPolyline",
            "release"
        ]
    },
    "harvest_barley_grain": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Barley Grain",
        "requires": [
            "followPath",
            "mow"
        ]
    },
    "harvest_blueberry_fruit": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Blueberry Fruit",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "snip"
        ]
    },
    "harvest_carrot_root": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Carrot Root",
        "requires": [
            "followPath",
            "digTrench",
            "setPose",
            "grip"
        ]
    },
    "harvest_clover_flower": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Clover Flower",
        "requires": [
            "followPath",
            "mow"
        ]
    },
    "harvest_coffee_beans": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Coffee Beans",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "grip"
        ]
    },
    "harvest_corn_cob": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Corn Cob",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "grip"
        ]
    },
    "harvest_eggs_chicken": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Eggs Chicken",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "grip",
            "release"
        ]
    },
    "harvest_eggs_duck": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Eggs Duck",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "grip",
            "release"
        ]
    },
    "harvest_grape": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Grape",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "snip",
            "moveLoad"
        ]
    },
    "harvest_hay": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Hay",
        "requires": [
            "followPath",
            "mow"
        ]
    },
    "harvest_honey": {
        "categories": [
            "Animal Ops",
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Honey",
        "requires": [
            "followPath",
            "setPose",
            "grip"
        ]
    },
    "harvest_lavender_flower": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Lavender Flower",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "snip"
        ]
    },
    "harvest_lemon": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Lemon",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "grip",
            "cutPolyline",
            "release"
        ]
    },
    "harvest_lettuce_leaf": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Lettuce Leaf",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "snip"
        ]
    },
    "harvest_milk_cow": {
        "categories": [
            "Animal Ops",
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Milk Cow",
        "requires": [
            "followPath",
            "setPose",
            "grip"
        ]
    },
    "harvest_milk_goat": {
        "categories": [
            "Animal Ops",
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Milk Goat",
        "requires": [
            "followPath",
            "setPose",
            "grip"
        ]
    },
    "harvest_oats_grain": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Oats Grain",
        "requires": [
            "followPath",
            "mow"
        ]
    },
    "harvest_orange": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Orange",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "grip",
            "cutPolyline",
            "release"
        ]
    },
    "harvest_pear": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Pear",
        "requires": [
            "followPath",
            "captureImage",
            "getObjectLocalCoordinates",
            "setPose",
            "grip",
            "cutPolyline",
            "release"
        ]
    },
    "harvest_pumpkin_fruit": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Pumpkin Fruit",
        "requires": [
            "followPath",
            "setPose",
            "cutPolyline",
            "liftLoad",
            "moveLoad"
        ]
    },
    "harvest_strawberry_fruit": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Strawberry Fruit",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "snip"
        ]
    },
    "harvest_sunflower_seed": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Sunflower Seed",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "grip",
            "snip"
        ]
    },
    "harvest_tomato_fruit": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Tomato Fruit",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "grip",
            "cutPolyline"
        ]
    },
    "harvest_wheat_grain": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Wheat Grain",
        "requires": [
            "followPath",
            "mow"
        ]
    },
    "harvest_willow_bark": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Willow Bark",
        "requires": [
            "followPath",
            "setPose",
            "cutPolyline"
        ]
    },
    "harvest_wood": {
        "categories": [
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Wood",
        "requires": [
            "followPath",
            "setPose",
            "cutPolyline",
            "moveLoad"
        ]
    },
    "harvest_wool": {
        "categories": [
            "Animal Ops",
            "Harvest"
        ],
        "description": "Harvest the specified product.",
        "displayName": "Harvest Wool",
        "requires": [
            "followPath",
            "brushArea"
        ]
    },
    "irrigate_drip": {
        "categories": [
            "Irrigation"
        ],
        "description": "Irrigate the target area.",
        "displayName": "Irrigate Drip",
        "requires": [
            "followPath",
            "setFlow",
            "irrigate",
            "stopPump"
        ]
    },
    "irrigate_spray": {
        "categories": [
            "Irrigation"
        ],
        "description": "Irrigate the target area.",
        "displayName": "Irrigate Spray",
        "requires": [
            "followPath",
            "spray"
        ]
    },
    "join_network": {
        "categories": [
            "Comms/Compute"
        ],
        "description": "Communications and compute orchestration.",
        "displayName": "Join Network",
        "requires": []
    },
    "limit_animal_area": {
        "categories": [
            "Animal Ops"
        ],
        "description": "Animal husbandry operations.",
        "displayName": "Limit Animal Area",
        "requires": [
            "trackAnimal"
        ]
    },
    "load_residue": {
        "categories": [
            "Waste/Processing"
        ],
        "description": "Handle residues and waste materials.",
        "displayName": "Load Residue",
        "requires": []
    },
    "move_animal": {
        "categories": [
            "Animal Ops"
        ],
        "description": "Animal husbandry operations.",
        "displayName": "Move Animal",
        "requires": [
            "followPath"
        ]
    },
    "move_herd": {
        "categories": [
            "Animal Ops"
        ],
        "description": "Animal husbandry operations.",
        "displayName": "Move Herd",
        "requires": [
            "followPath"
        ]
    },
    "move_water_to_storage": {
        "categories": [
            "Water"
        ],
        "description": "Manage water capture, treatment, and distribution.",
        "displayName": "Move Water To Storage",
        "requires": [
            "followPath",
            "setFlow"
        ]
    },
    "mow_cover_crop": {
        "categories": [
            "Cultivation"
        ],
        "description": "Crop establishment and care.",
        "displayName": "Mow Cover Crop",
        "requires": []
    },
    "pasteurize_water": {
        "categories": [
            "Water"
        ],
        "description": "Manage water capture, treatment, and distribution.",
        "displayName": "Pasteurize Water",
        "requires": []
    },
    "pelletize_biomass": {
        "categories": [
            "Waste/Processing"
        ],
        "description": "Handle residues and waste materials.",
        "displayName": "Pelletize Biomass",
        "requires": []
    },
    "pelletize_fertilizer": {
        "categories": [
            "Fertilizer"
        ],
        "description": "Produce and apply soil inputs.",
        "displayName": "Pelletize Fertilizer",
        "requires": []
    },
    "pelletize_residue": {
        "categories": [
            "Waste/Processing"
        ],
        "description": "Handle residues and waste materials.",
        "displayName": "Pelletize Residue",
        "requires": []
    },
    "position_mobile_base": {
        "categories": [
            "Logistics"
        ],
        "description": "Logistics for assemblies and supplies.",
        "displayName": "Position Mobile Base",
        "requires": [
            "followPath"
        ]
    },
    "provide_feed": {
        "categories": [
            "Animal Ops"
        ],
        "description": "Animal husbandry operations.",
        "displayName": "Provide Feed",
        "requires": [
            "followPath"
        ]
    },
    "provision_network": {
        "categories": [
            "Comms/Compute"
        ],
        "description": "Communications and compute orchestration.",
        "displayName": "Provision Network",
        "requires": []
    },
    "prune_canopy": {
        "categories": [
            "Cultivation"
        ],
        "description": "Crop care maintenance.",
        "displayName": "Prune Canopy",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "snip"
        ]
    },
    "recharge_on_dock": {
        "categories": [
            "Logistics"
        ],
        "description": "Logistics for energy, feed, or water.",
        "displayName": "Recharge On Dock",
        "requires": [
            "followPath",
            "chargeDock"
        ]
    },
    "register_node": {
        "categories": [
            "Comms/Compute"
        ],
        "description": "Communications and compute orchestration.",
        "displayName": "Register Node",
        "requires": []
    },
    "release_dog_control": {
        "categories": [
            "Animal Control"
        ],
        "description": "Non-lethal animal control.",
        "displayName": "Release Dog Control",
        "requires": []
    },
    "remove_almond_tree": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Almond Tree",
        "requires": [
            "followPath",
            "setPose",
            "cutPolyline",
            "moveLoad"
        ]
    },
    "remove_apple_tree": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Apple Tree",
        "requires": [
            "followPath",
            "setPose",
            "cutPolyline",
            "moveLoad"
        ]
    },
    "remove_barley": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Barley",
        "requires": [
            "followPath",
            "mow"
        ]
    },
    "remove_blueberry": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Blueberry",
        "requires": [
            "followPath",
            "setPose",
            "snip"
        ]
    },
    "remove_carrot": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Carrot",
        "requires": [
            "followPath",
            "digTrench",
            "setPose",
            "grip"
        ]
    },
    "remove_clover": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Clover",
        "requires": [
            "followPath",
            "mow"
        ]
    },
    "remove_coffee": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Coffee",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "grip"
        ]
    },
    "remove_corn": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Corn",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "grip"
        ]
    },
    "remove_grape_vine": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Grape Vine",
        "requires": [
            "followPath",
            "setPose",
            "snip"
        ]
    },
    "remove_grass": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Grass",
        "requires": [
            "followPath",
            "mow"
        ]
    },
    "remove_lavender": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Lavender",
        "requires": [
            "followPath",
            "setPose",
            "snip"
        ]
    },
    "remove_lemon_tree": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Lemon Tree",
        "requires": [
            "followPath",
            "setPose",
            "cutPolyline",
            "moveLoad"
        ]
    },
    "remove_lettuce": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Lettuce",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "snip"
        ]
    },
    "remove_oak_tree": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Oak Tree",
        "requires": [
            "followPath",
            "setPose",
            "cutPolyline",
            "moveLoad"
        ]
    },
    "remove_oats": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Oats",
        "requires": [
            "followPath",
            "mow"
        ]
    },
    "remove_orange_tree": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Orange Tree",
        "requires": [
            "followPath",
            "setPose",
            "cutPolyline",
            "moveLoad"
        ]
    },
    "remove_pear_tree": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Pear Tree",
        "requires": [
            "followPath",
            "setPose",
            "cutPolyline",
            "moveLoad"
        ]
    },
    "remove_poplar": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Poplar",
        "requires": [
            "followPath",
            "setPose",
            "cutPolyline",
            "moveLoad"
        ]
    },
    "remove_pumpkin": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Pumpkin",
        "requires": [
            "followPath",
            "setPose",
            "cutPolyline"
        ]
    },
    "remove_strawberry": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Strawberry",
        "requires": [
            "followPath",
            "setPose",
            "snip"
        ]
    },
    "remove_sunflower": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Sunflower",
        "requires": [
            "followPath",
            "setPose",
            "snip"
        ]
    },
    "remove_tomato": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Tomato",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "grip"
        ]
    },
    "remove_wheat": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Wheat",
        "requires": [
            "followPath",
            "mow"
        ]
    },
    "remove_willow": {
        "categories": [
            "Removal"
        ],
        "description": "Remove the specified crop or structure.",
        "displayName": "Remove Willow",
        "requires": [
            "followPath",
            "setPose",
            "cutPolyline",
            "moveLoad"
        ]
    },
    "reserve_compute": {
        "categories": [
            "Comms/Compute"
        ],
        "description": "Communications and compute orchestration.",
        "displayName": "Reserve Compute",
        "requires": []
    },
    "restock_feed": {
        "categories": [
            "Logistics"
        ],
        "description": "Logistics for assemblies and supplies.",
        "displayName": "Restock Feed",
        "requires": [
            "followPath"
        ]
    },
    "restock_fertilizer": {
        "categories": [
            "Logistics"
        ],
        "description": "Logistics for assemblies and supplies.",
        "displayName": "Restock Fertilizer",
        "requires": [
            "followPath"
        ]
    },
    "restock_seed": {
        "categories": [
            "Logistics"
        ],
        "description": "Logistics for assemblies and supplies.",
        "displayName": "Restock Seed",
        "requires": [
            "followPath"
        ]
    },
    "run_model_job": {
        "categories": [
            "Comms/Compute"
        ],
        "description": "Communications and compute orchestration.",
        "displayName": "Run Model Job",
        "requires": []
    },
    "schedule_compute_task": {
        "categories": [
            "Comms/Compute"
        ],
        "description": "Communications and compute orchestration.",
        "displayName": "Schedule Compute Task",
        "requires": []
    },
    "separate_fertilizer_fractions": {
        "categories": [
            "Fertilizer"
        ],
        "description": "Produce and apply soil inputs.",
        "displayName": "Separate Fertilizer Fractions",
        "requires": []
    },
    "separate_waste_streams": {
        "categories": [
            "Waste/Processing"
        ],
        "description": "Handle residues and waste materials.",
        "displayName": "Separate Waste Streams",
        "requires": []
    },
    "set_gate_position": {
        "categories": [
            "Animal Control"
        ],
        "description": "Non-lethal animal control.",
        "displayName": "Set Gate Position",
        "requires": []
    },
    "sow_seed": {
        "categories": [
            "Cultivation"
        ],
        "description": "Sow seeds or place seedlings.",
        "displayName": "Sow Seed",
        "requires": [
            "followPath",
            "seedRows"
        ]
    },
    "sow_seedling": {
        "categories": [
            "Cultivation"
        ],
        "description": "Sow seeds or place seedlings.",
        "displayName": "Sow Seedling",
        "requires": [
            "followPath",
            "setPose",
            "grip"
        ]
    },
    "sterilize_tools": {
        "categories": [
            "Waste/Processing"
        ],
        "description": "Handle residues and waste materials.",
        "displayName": "Sterilize Tools",
        "requires": []
    },
    "store_water": {
        "categories": [
            "Logistics"
        ],
        "description": "Logistics for energy, feed, or water.",
        "displayName": "Store Water",
        "requires": [
            "followPath",
            "setFlow",
            "provideWater",
            "acceptWater"
        ]
    },
    "stream_telemetry_off": {
        "categories": [
            "Comms/Compute"
        ],
        "description": "Communications and compute orchestration.",
        "displayName": "Stream Telemetry Off",
        "requires": []
    },
    "stream_telemetry_on": {
        "categories": [
            "Comms/Compute"
        ],
        "description": "Communications and compute orchestration.",
        "displayName": "Stream Telemetry On",
        "requires": []
    },
    "stump_cleanup": {
        "categories": [
            "Topography"
        ],
        "description": "Reshape or stabilize terrain.",
        "displayName": "Stump Cleanup",
        "requires": [
            "followPath",
            "cutPolyline",
            "moveLoad"
        ]
    },
    "survey_plants": {
        "categories": [
            "Survey"
        ],
        "description": "Collect measurements for mapping or control.",
        "displayName": "Survey Plants",
        "requires": [
            "captureImage",
            "startStream",
            "stopStream"
        ]
    },
    "survey_topography": {
        "categories": [
            "Survey"
        ],
        "description": "Collect measurements for mapping or control.",
        "displayName": "Survey Topography",
        "requires": [
            "scanLidar3d"
        ]
    },
    "swap_battery": {
        "categories": [
            "Energy"
        ],
        "description": "Operate and manage power systems.",
        "displayName": "Swap Battery",
        "requires": [
            "followPath",
            "setPose",
            "grip"
        ]
    },
    "terrace": {
        "categories": [
            "Topography"
        ],
        "description": "Reshape ground profile.",
        "displayName": "Terrace",
        "requires": [
            "scanLidar3d",
            "digTrench"
        ]
    },
    "thin_fruit": {
        "categories": [
            "Cultivation"
        ],
        "description": "Crop care maintenance.",
        "displayName": "Thin Fruit",
        "requires": [
            "followPath",
            "captureImage",
            "setPose",
            "snip"
        ]
    },
    "track_animal": {
        "categories": [
            "Animal Control"
        ],
        "description": "Non-lethal animal control.",
        "displayName": "Track Animal",
        "requires": []
    },
    "transport_assembly": {
        "categories": [
            "Logistics"
        ],
        "description": "Move or prepare assemblies on site.",
        "displayName": "Transport Assembly",
        "requires": [
            "followPath",
            "moveLoad"
        ]
    },
    "transport_residue_to_processor": {
        "categories": [
            "General"
        ],
        "description": "Handle residues and waste materials.",
        "displayName": "Transport Residue To Processor",
        "requires": [
            "followPath",
            "moveLoad"
        ]
    },
    "uproot_row_crop": {
        "categories": [
            "General"
        ],
        "description": "Perform an operational task.",
        "displayName": "Uproot Row Crop",
        "requires": [
            "followPath"
        ]
    },
    "windrow_residue": {
        "categories": [
            "Waste/Processing"
        ],
        "description": "Handle residues and waste materials.",
        "displayName": "Windrow Residue",
        "requires": [
            "followPath",
            "brushArea"
        ]
    }
};