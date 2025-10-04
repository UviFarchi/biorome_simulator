// Helper functions used in dynamic deltas
function plantOrAnimalYield(context) {
    const s = context?.subject || context || {};
    if (typeof s.yield_kg === 'number') return s.yield_kg;
    if (typeof s.estimatedYield_kg === 'number') return s.estimatedYield_kg;
    if (typeof s.milk_L === 'number') return s.milk_L;
    if (typeof s.honey_kg === 'number') return s.honey_kg;
    if (typeof s.eggs === 'number') return s.eggs;
    if (typeof s.yield === 'number') return s.yield;
    return 0;
}
function negativeYieldMirror(context) {
    const v = plantOrAnimalYield(context);
    return -Math.abs(v);
}

export default {
    "irrigate_drip": [
        {
            "target": "soil",
            "property": "water",
            "delta": 30
        }
    ],
    "irrigate_spray": [
        {
            "target": "soil",
            "property": "water",
            "delta": 30
        }
    ],
    "flush_irrigation_lines": [
        {
            "target": "resources",
            "property": "water",
            "delta": -5
        }
    ],
    "drain_field": [
        {
            "target": "soil",
            "property": "water",
            "delta": -30
        }
    ],
    "flatten": [
        {
            "target": "topo",
            "property": "roughness",
            "delta": -10
        },
        {
            "target": "soil",
            "property": "bulkDensity",
            "delta": 2
        }
    ],
    "terrace": [
        {
            "target": "topo",
            "property": "slopeDeg",
            "delta": -5
        },
        {
            "target": "soil",
            "property": "bulkDensity",
            "delta": 1
        }
    ],
    "dig_trench": [
        {
            "target": "topo",
            "property": "channelCapacity",
            "delta": 1
        },
        {
            "target": "soil",
            "property": "water",
            "delta": -10
        }
    ],
    "build_ditch": [
        {
            "target": "topo",
            "property": "channelCapacity",
            "delta": 1
        },
        {
            "target": "soil",
            "property": "water",
            "delta": -10
        }
    ],
    "grade_profile": [
        {
            "target": "topo",
            "property": "roughness",
            "delta": -10
        },
        {
            "target": "soil",
            "property": "bulkDensity",
            "delta": 2
        }
    ],
    "anchor_structure": [
        {
            "target": "assemblies",
            "property": "stability",
            "delta": 1
        }
    ],
    "stump_cleanup": [
        {
            "target": "plants",
            "property": "residue",
            "delta": -5
        }
    ],
    "store_water": [
        {
            "target": "resources",
            "property": "water_storage",
            "delta": 20
        },
        {
            "target": "soil",
            "property": "water",
            "delta": -20
        }
    ],
    "move_water_to_storage": [
        {
            "target": "resources",
            "property": "water_storage",
            "delta": 20
        },
        {
            "target": "soil",
            "property": "water",
            "delta": -20
        }
    ],
    "distribute_water_to_field": [
        {
            "target": "soil",
            "property": "water",
            "delta": 20
        },
        {
            "target": "resources",
            "property": "water_storage",
            "delta": -20
        }
    ],
    "filter_water": [
        {
            "target": "resources",
            "property": "water_quality",
            "delta": 5
        }
    ],
    "pasteurize_water": [
        {
            "target": "resources",
            "property": "water_pathogen",
            "delta": -10
        }
    ],
    "test_seal": [
        {
            "target": "assemblies",
            "property": "leakRate",
            "delta": -1
        }
    ],
    "set_valve_position": [
        {
            "target": "assemblies",
            "property": "valveChanges",
            "delta": 1
        }
    ],
    "generate_solar_dc": [
        {
            "target": "resources",
            "property": "energy_dc_kWh",
            "delta": 10
        }
    ],
    "generate_wind_ac": [
        {
            "target": "resources",
            "property": "energy_ac_kWh",
            "delta": 10
        }
    ],
    "generate_biogas": [
        {
            "target": "resources",
            "property": "biogas_m3",
            "delta": 5
        }
    ],
    "convert_dc_to_ac": [
        {
            "target": "resources",
            "property": "energy_dc_kWh",
            "delta": -10
        },
        {
            "target": "resources",
            "property": "energy_ac_kWh",
            "delta": 9
        }
    ],
    "convert_ac_to_dc": [
        {
            "target": "resources",
            "property": "energy_ac_kWh",
            "delta": -10
        },
        {
            "target": "resources",
            "property": "energy_dc_kWh",
            "delta": 9
        }
    ],
    "export_power_to_grid": [
        {
            "target": "resources",
            "property": "energy_ac_kWh",
            "delta": -20
        },
        {
            "target": "market",
            "property": "energyExport_kWh",
            "delta": 20
        }
    ],
    "charge_on_dock": [
        {
            "target": "assemblies",
            "property": "soc_pct",
            "delta": 10
        },
        {
            "target": "resources",
            "property": "energy_ac_kWh",
            "delta": -10
        }
    ],
    "swap_battery": [
        {
            "target": "assemblies",
            "property": "soc_pct",
            "delta": 50
        },
        {
            "target": "resources",
            "property": "spare_batteries",
            "delta": -1
        }
    ],
    "compost_biomass": [
        {
            "target": "resources",
            "property": "compost_kg",
            "delta": 10
        }
    ],
    "digest_slurry": [
        {
            "target": "resources",
            "property": "digestate_kg",
            "delta": 10
        },
        {
            "target": "resources",
            "property": "biogas_m3",
            "delta": 5
        }
    ],
    "separate_fertilizer_fractions": [
        {
            "target": "resources",
            "property": "fertilizer_liquid_kg",
            "delta": 5
        },
        {
            "target": "resources",
            "property": "fertilizer_solid_kg",
            "delta": 5
        }
    ],
    "pelletize_fertilizer": [
        {
            "target": "resources",
            "property": "fertilizer",
            "delta": 10
        }
    ],
    "apply_fertilizer_sidedress": [
        {
            "target": "resources",
            "property": "fertilizer",
            "delta": 10
        }
    ],
    "apply_mulch": [
        {
            "target": "soil",
            "property": "cover_pct",
            "delta": 10
        }
    ],
    "collect_field_residue": [
        {
            "target": "plants",
            "property": "residue",
            "delta": -10
        },
        {
            "target": "resources",
            "property": "residue_kg",
            "delta": 10
        }
    ],
    "separate_waste_streams": [
        {
            "target": "resources",
            "property": "recyclables_kg",
            "delta": 5
        },
        {
            "target": "resources",
            "property": "waste_kg",
            "delta": -5
        }
    ],
    "compress_biomass": [
        {
            "target": "resources",
            "property": "biomassCompressed_kg",
            "delta": 10
        },
        {
            "target": "resources",
            "property": "biomassLoose_kg",
            "delta": -10
        }
    ],
    "dry_dehydrate_biomass": [
        {
            "target": "resources",
            "property": "biomassDry_kg",
            "delta": 10
        },
        {
            "target": "resources",
            "property": "biomassMoist_kg",
            "delta": -10
        }
    ],
    "pelletize_biomass": [
        {
            "target": "resources",
            "property": "pellets_kg",
            "delta": 10
        },
        {
            "target": "resources",
            "property": "biomassDry_kg",
            "delta": -10
        }
    ],
    "sterilize_tools": [
        {
            "target": "assemblies",
            "property": "contamination_idx",
            "delta": -5
        }
    ],
    "char_biomass": [
        {
            "target": "resources",
            "property": "biochar_kg",
            "delta": 5
        },
        {
            "target": "resources",
            "property": "biomassDry_kg",
            "delta": -5
        }
    ],
    "generate_steam_for_cleaning": [
        {
            "target": "resources",
            "property": "energy_ac_kWh",
            "delta": -5
        },
        {
            "target": "assemblies",
            "property": "cleanliness_idx",
            "delta": 5
        }
    ],
    "flare_burnoff_biogas_contaminants": [
        {
            "target": "resources",
            "property": "biogas_m3",
            "delta": -5
        },
        {
            "target": "resources",
            "property": "h2s_ppm",
            "delta": -50
        }
    ],
    "windrow_residue": [
        {
            "target": "plants",
            "property": "residue_arranged",
            "delta": 10
        },
        {
            "target": "plants",
            "property": "residue",
            "delta": -10
        }
    ],
    "bale_residue": [
        {
            "target": "resources",
            "property": "bales",
            "delta": 1
        },
        {
            "target": "plants",
            "property": "residue",
            "delta": -10
        }
    ],
    "load_residue": [
        {
            "target": "resources",
            "property": "residue_loaded_kg",
            "delta": 10
        },
        {
            "target": "plants",
            "property": "residue",
            "delta": -10
        }
    ],
    "transport_residue_to_processor": [
        {
            "target": "resources",
            "property": "residue_at_processor_kg",
            "delta": 10
        },
        {
            "target": "resources",
            "property": "residue_loaded_kg",
            "delta": -10
        }
    ],
    "pelletize_residue": [
        {
            "target": "resources",
            "property": "pellets_kg",
            "delta": 10
        },
        {
            "target": "resources",
            "property": "biomassDry_kg",
            "delta": -10
        }
    ],
    "sow_seed": [
        {
            "target": "plants",
            "property": "population",
            "delta": 10
        }
    ],
    "sow_seedling": [
        {
            "target": "plants",
            "property": "population",
            "delta": 10
        }
    ],
    "prune_canopy": [
        {
            "target": "plants",
            "property": "leafAreaIndex",
            "delta": -0.2
        }
    ],
    "thin_fruit": [
        {
            "target": "plants",
            "property": "fruitCount",
            "delta": -10
        }
    ],
    "foliar_spray": [
        {
            "target": "plants",
            "property": "foliarProtection_idx",
            "delta": 5
        }
    ],
    "mow_cover_crop": [
        {
            "target": "plants",
            "property": "cover_crop_biomass_kg",
            "delta": -10
        },
        {
            "target": "plants",
            "property": "residue",
            "delta": 10
        }
    ],
    "harvest_grain_cereal": [
        {
            "target": "market",
            "property": "grain_kg",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        },
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": {
                "$fn": "negativeYieldMirror"
            }
        }
    ],
    "harvest_corn_cob": [
        {
            "target": "market",
            "property": "corn",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        },
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": {
                "$fn": "negativeYieldMirror"
            }
        }
    ],
    "harvest_leaf_lettuce": [
        {
            "target": "market",
            "property": "lettuce_kg",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        },
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": {
                "$fn": "negativeYieldMirror"
            }
        }
    ],
    "harvest_root_carrot": [
        {
            "target": "market",
            "property": "carrot_kg",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        },
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": {
                "$fn": "negativeYieldMirror"
            }
        }
    ],
    "harvest_fruit_apple": [
        {
            "target": "market",
            "property": "apple_kg",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        },
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": {
                "$fn": "negativeYieldMirror"
            }
        }
    ],
    "harvest_fruit_pear": [
        {
            "target": "market",
            "property": "pear_kg",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        },
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": {
                "$fn": "negativeYieldMirror"
            }
        }
    ],
    "harvest_fruit_orange": [
        {
            "target": "market",
            "property": "orange_kg",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        },
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": {
                "$fn": "negativeYieldMirror"
            }
        }
    ],
    "harvest_fruit_lemon": [
        {
            "target": "market",
            "property": "lemon_kg",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        },
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": {
                "$fn": "negativeYieldMirror"
            }
        }
    ],
    "harvest_fruit_strawberry": [
        {
            "target": "market",
            "property": "strawberry_kg",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        },
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": {
                "$fn": "negativeYieldMirror"
            }
        }
    ],
    "harvest_fruit_blueberry": [
        {
            "target": "market",
            "property": "blueberry_kg",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        },
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": {
                "$fn": "negativeYieldMirror"
            }
        }
    ],
    "harvest_flower_lavender": [
        {
            "target": "market",
            "property": "lavender_kg",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        },
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": {
                "$fn": "negativeYieldMirror"
            }
        }
    ],
    "harvest_seed_sunflower": [
        {
            "target": "market",
            "property": "sunflower_seed_kg",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        },
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": {
                "$fn": "negativeYieldMirror"
            }
        }
    ],
    "harvest_wood_timber": [
        {
            "target": "market",
            "property": "timber_kg",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        },
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": {
                "$fn": "negativeYieldMirror"
            }
        }
    ],
    "harvest_bark_willow": [
        {
            "target": "market",
            "property": "willow_bark_kg",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        },
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": {
                "$fn": "negativeYieldMirror"
            }
        }
    ],
    "harvest_beans_coffee": [
        {
            "target": "market",
            "property": "coffee_beans_kg",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        },
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": {
                "$fn": "negativeYieldMirror"
            }
        }
    ],
    "harvest_grape": [
        {
            "target": "market",
            "property": "grape_kg",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        },
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": {
                "$fn": "negativeYieldMirror"
            }
        }
    ],
    "harvest_milk_cow": [
        {
            "target": "market",
            "property": "milk_L",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        }
    ],
    "harvest_milk_goat": [
        {
            "target": "market",
            "property": "milk_L",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        }
    ],
    "harvest_honey": [
        {
            "target": "market",
            "property": "honey_kg",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        }
    ],
    "harvest_eggs_chicken": [
        {
            "target": "market",
            "property": "eggs_count",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        }
    ],
    "harvest_eggs_duck": [
        {
            "target": "market",
            "property": "eggs_count",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        }
    ],
    "harvest_wool": [
        {
            "target": "market",
            "property": "wool_kg",
            "delta": {
                "$fn": "plantOrAnimalYield"
            }
        }
    ],
    "cut_stalks_corn": [
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": -10
        },
        {
            "target": "resources",
            "property": "residue_kg",
            "delta": 10
        }
    ],
    "uproot_row_crop": [
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": -10
        },
        {
            "target": "resources",
            "property": "residue_kg",
            "delta": 10
        }
    ],
    "cut_vine_grape": [
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": -10
        },
        {
            "target": "resources",
            "property": "residue_kg",
            "delta": 10
        }
    ],
    "fell_tree_orchard": [
        {
            "target": "plants",
            "property": "biomass_kg",
            "delta": -10
        },
        {
            "target": "resources",
            "property": "residue_kg",
            "delta": 10
        }
    ],
    "move_animal": [
        {
            "target": "animals",
            "property": "moved_count",
            "delta": 1
        }
    ],
    "move_herd": [
        {
            "target": "animals",
            "property": "moved_count",
            "delta": 1
        }
    ],
    "limit_animal_area": [
        {
            "target": "animals",
            "property": "boundary_enforcements",
            "delta": 1
        }
    ],
    "provide_feed": [
        {
            "target": "resources",
            "property": "feed_kg",
            "delta": {
                "$fn": "feedConsumption"
            }
        },
        {
            "target": "animals",
            "property": "satiety_idx",
            "delta": 5
        }
    ],
    "clean_water_troughs": [
        {
            "target": "animals",
            "property": "water_quality_idx",
            "delta": 5
        }
    ],
    "collect_manure": [
        {
            "target": "resources",
            "property": "manure_kg",
            "delta": 10
        }
    ],
    "track_animal": [
        {
            "target": "analytics",
            "property": "tracking_sessions",
            "delta": 1
        }
    ],
    "release_dog_control": [
        {
            "target": "animals",
            "property": "dispersal_events",
            "delta": 1
        }
    ],
    "drone_loudspeaker_deter": [
        {
            "target": "animals",
            "property": "dispersal_events",
            "delta": 1
        }
    ],
    "electric_fence_pulse": [
        {
            "target": "animals",
            "property": "boundary_enforcements",
            "delta": 1
        }
    ],
    "set_gate_position": [
        {
            "target": "assemblies",
            "property": "gate_cycles",
            "delta": 1
        }
    ],
    "transport_assembly": [
        {
            "target": "assemblies",
            "property": "position_updates",
            "delta": 1
        }
    ],
    "build_assembly_pad": [
        {
            "target": "topo",
            "property": "pad_flatness",
            "delta": 5
        },
        {
            "target": "soil",
            "property": "bulkDensity",
            "delta": 1
        }
    ],
    "position_mobile_base": [
        {
            "target": "assemblies",
            "property": "position_updates",
            "delta": 1
        }
    ],
    "recharge_on_dock": [
        {
            "target": "assemblies",
            "property": "soc_pct",
            "delta": 10
        },
        {
            "target": "resources",
            "property": "energy_ac_kWh",
            "delta": -10
        }
    ],
    "restock_seed": [
        {
            "target": "resources",
            "property": "seed_kg",
            "delta": 50
        }
    ],
    "restock_fertilizer": [
        {
            "target": "resources",
            "property": "fertilizer_kg",
            "delta": 50
        }
    ],
    "restock_feed": [
        {
            "target": "resources",
            "property": "feed_kg",
            "delta": 50
        }
    ],
    "evacuate_to_base": [
        {
            "target": "assemblies",
            "property": "evacuations",
            "delta": 1
        }
    ],
    "survey_topography_lidar3d": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_rows_lidar2d": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_plants_rgb": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_plants_multispectral": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_plants_thermal": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_weather_mast": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_soil_moisture": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_soil_temp": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_soil_ph": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_soil_ec": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_leaf_wetness": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_par": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_solar_irradiance": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_wind_speed": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_wind_dir": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_air_temp": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_air_humidity": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_pressure": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_rainfall": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_water_level": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_turbidity": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_uv": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_weight": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_rfid_livestock": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_gnss_pose": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_heading": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_biogas_ch4": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_biogas_flow": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_biogas_h2s": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "survey_biogas_pressure": [
        {
            "target": "analytics",
            "property": "observations",
            "delta": 1
        }
    ],
    "bootstrap_landos": [
        {
            "target": "comms",
            "property": "landos_online",
            "delta": 1
        }
    ],
    "provision_network": [
        {
            "target": "comms",
            "property": "coverage_idx",
            "delta": 5
        }
    ],
    "deploy_repeater": [
        {
            "target": "comms",
            "property": "coverage_idx",
            "delta": 5
        }
    ],
    "register_node": [
        {
            "target": "comms",
            "property": "nodes_registered",
            "delta": 1
        }
    ],
    "join_network": [
        {
            "target": "comms",
            "property": "nodes_joined",
            "delta": 1
        }
    ],
    "stream_telemetry_on": [
        {
            "target": "comms",
            "property": "streams_active",
            "delta": 1
        }
    ],
    "stream_telemetry_off": [
        {
            "target": "comms",
            "property": "streams_active",
            "delta": -1
        }
    ],
    "run_model_job": [
        {
            "target": "analytics",
            "property": "compute_jobs",
            "delta": 1
        }
    ],
    "schedule_compute_task": [
        {
            "target": "analytics",
            "property": "scheduled_tasks",
            "delta": 1
        }
    ],
    "reserve_compute": [
        {
            "target": "analytics",
            "property": "compute_reserved",
            "delta": 1
        }
    ]
};