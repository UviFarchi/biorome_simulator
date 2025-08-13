import {defineStore} from 'pinia'
import {ref, watch} from 'vue'
import {mapStore} from "@/stores/map.js";

export const requirementsStore =
    defineStore('requirementsStore', () => {
        return {
            harvest: {
                // plant products
                hay: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'cutter', subtype: 'rotating'}
                ],
                corn_cob: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'camera', subtype: 'rgb'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cart'},
                    {type: 'gripper'}
                ],
                tomato_fruit: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'camera', subtype: 'rgb'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'gripper'}
                ],
                lettuce_leaf: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'camera', subtype: 'rgb'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'gripper'}
                ],
                pumpkin_fruit: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cart'},
                    {type: 'cutter'}
                ],
                carrot_root: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'digger'}
                ],
                wheat_grain: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cutter', subtype: 'rotating'},
                    {type: 'cart'}
                ],
                barley_grain: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cutter', subtype: 'rotating'},
                    {type: 'cart'}
                ],
                oats_grain: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cutter', subtype: 'rotating'},
                    {type: 'cart'}
                ],
                coffee_beans: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'gripper'}
                ],
                apple: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cart'},
                    {type: 'gripper'}
                ],
                lavender_flower: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'gripper'}
                ],
                clover_flower: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'cutter', subtype: 'rotating'}
                ],
                sunflower_seed: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'gripper'}
                ],
                acorn: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cart'},
                    {type: 'gripper'}
                ],
                wood: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'heavy'},
                    {type: 'cart'},
                    {type: 'cutter', subtype: 'saw'}
                ],
                willow_bark: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cutter'}
                ],
                strawberry_fruit: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'gripper'}
                ],
                blueberry_fruit: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'gripper'}
                ],
                pear: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cart'},
                    {type: 'gripper'}
                ],
                almond: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cart'},
                    {type: 'gripper'}
                ],
                orange: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cart'},
                    {type: 'gripper'}
                ],
                lemon: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cart'},
                    {type: 'gripper'}
                ],
                grape: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'gripper'},
                    {type: 'cart'}
                ],


                // plants
                'corn': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'camera', subtype: 'rgb'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cart'},
                    {type: 'gripper'}
                ],
                'tomato': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'camera', subtype: 'rgb'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'gripper'}
                ],
                'lettuce': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'camera', subtype: 'rgb'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'gripper'}
                ],
                'pumpkin': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cart'},
                    {type: 'cutter'}
                ],
                'carrot': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'digger'}
                ],
                'grass': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'cutter', subtype: 'rotating'}
                ],
                'coffee': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'gripper'}
                ],
                'apple_tree': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cart'},
                    {type: 'gripper'}
                ],
                'lavender': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'gripper'}
                ],
                'clover': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'cutter', subtype: 'rotating'}
                ],
                'sunflower': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'gripper'}
                ],
                'oak_tree': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'heavy'},
                    {type: 'cart'},
                    {type: 'cutter', subtype: 'saw'}
                ],
                'poplar': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'heavy'},
                    {type: 'cart'},
                    {type: 'cutter', subtype: 'saw'}
                ],
                'willow': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'heavy'},
                    {type: 'cart'},
                    {type: 'cutter', subtype: 'saw'}
                ],
                'strawberry': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'gripper'}
                ],
                'blueberry': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'gripper'}
                ],
                'pear_tree': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cart'},
                    {type: 'gripper'}
                ],
                'almond_tree': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cart'},
                    {type: 'gripper'}
                ],
                'wheat': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cutter', subtype: 'rotating'},
                    {type: 'cart'}
                ],
                'barley': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cutter', subtype: 'rotating'},
                    {type: 'cart'}
                ],
                'oats': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cutter', subtype: 'rotating'},
                    {type: 'cart'}
                ],
                'orange_tree': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cart'},
                    {type: 'gripper'}
                ],
                'lemon_tree': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'cart'},
                    {type: 'gripper'}
                ],

                'grape_vine': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'gripper'},
                    {type: 'cart'}
                ],

                // animal products
                'milk': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'medium'},
                    {type: 'gripper'}
                ],
                'goat_milk': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'gripper'}
                ],
                'eggs': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'camera', subtype: 'rgb'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'suction'},
                    {type: 'cart'}
                ],
                'duck_eggs': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'camera', subtype: 'rgb'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'suction'},
                    {type: 'cart'}
                ],
                'honey': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm'},
                    {type: 'gripper'}
                ],
                'wool': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'small'},
                    {type: 'brush'}
                ],
                'cow': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'cart', subtype: 'animal'}
                ],
                'goat': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'cart', subtype: 'animal'}
                ],
                'sheep': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'cart', subtype: 'animal'}
                ],
                'pig': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'cart', subtype: 'animal'}
                ],
                'chicken': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'cage'}
                ],
                'duck': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'cage'}
                ],
                'rabbit': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'cage'}
                ],
                'horse': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'cart', subtype: 'animal'}
                ],
                'donkey': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'cart', subtype: 'animal'}
                ],
                'bee': [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'box', subtype: 'hive'}
                ]
            },
            sowing: {
                seed: [
                    {type: 'transport'},
                    {type: 'arm'},
                    {type: 'seeder'},
                    {type: 'borer'}
                ],
                seedling: [
                    {type: 'transport'},
                    {type: 'arm'},
                    {type: 'cart'},
                    {type: 'gripper'}
                ],
                fertilize: [
                    {type: 'transport'},
                    {type: 'arm'},
                    {type: 'cart'},
                    {
                        type: "tool",
                        subtype: "pitchfork"
                    },
                    {type: 'battery'}
                ]
            },
            animal: {
                move: [
                    {type: 'transport'},
                    {type: 'arm'},
                    {type: 'cart'},
                    {type: "alarm", subtype: "electric"}
                ],
                collar: [
                    {type: 'collar'},
                    {type: "alarm", subtype: "electric"},
                    {type: "alarm", subtype: "sound"},
                    {type: 'battery'},
                    {type: "gps"},
                ],
                feed: [
                    {type: 'transport'},
                    {type: 'arm'},
                    {type: 'cart'},
                    {type: 'tank'},
                    {type: "valve"},
                    {type: 'battery'}
                ]
            },
            assemblies: {
                transportAssembly: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'cart'},
                    {type: 'arm', subtype: 'heavy'}
                ],
                buildAssembly: [
                    {type: 'transport'},
                    {type: 'battery'},
                    {type: 'arm', subtype: 'heavy'},
                    {type: 'tool', subtype: 'borer'},
                    {type: 'tool', subtype: 'digger'},
                    {type: 'tool', subtype: 'flattener'},
                    {type: 'tool', subtype: 'grader'},
                    {type: 'tool', subtype: 'anchor_driver'}
                ]
            }
        }
    })