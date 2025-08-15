// src/stores/assemblyRequirements.js
import { defineStore } from 'pinia'

export const assemblyRequirementsStore = defineStore('assemblyRequirementsStore', () => {
    // Parent → allowed child types (broad defaults)
    const allowByParent = {
        'transport:ground': [
            'arm','sensor','camera','cart','tank','sprayer','spreader','seedbox',
            'gps','battery','communications','solar','valve','pump','computer'
        ],
        'transport:flying': [
            'sensor','camera','gps','battery','communications','computer'
        ],
        'support:pole': [
            'sensor','camera','communications','solar','valve','pump'
        ],
        'support:antenna': [
            'communications'
        ],
        'support:shelfRack': [
            'arm','sensor','press','tray','mold','dryer','dehumidifier','conveyor','humidifier','heating'
        ],
        'internalSpace:*': [
            'shelf','conveyor','sensor','computer','communications','hvac','heating','humidifier',
            'mixer','steam_gen','sterilizer','pasteurizer','dispenser','tray','mold','dryer','dehumidifier',
            'generator','engine','pump','tank','press','separator','heat_recovery','air_filter','fan','rfid',
            'power_elec','gas_storage','gas_move','gas_dry','gas_clean','gas_filter','gas_control','safety',
            'vessel'
        ]
    }

    // Child-specific overrides (narrower allow / explicit forbids)
    // Keys are "type" or "type:subtype". Use "*" as wildcard.
    const childOverrides = {
        'arm:heavy':      { forbid: ['transport:flying','support:pole','support:shelfRack'] },
        'arm:medium':     { forbid: ['transport:flying'] },

        'tool:flattener': { allow: ['arm:*','transport:ground'] },
        'tool:grader':    { allow: ['arm:*','transport:ground'] },
        'tool:*':         { allow: ['arm:*'] }, // default for tools

        'cart:*':         { allow: ['transport:ground'] },
        'tank:*':         { forbid: ['transport:flying'] },
        'sprayer:*':      { allow: ['transport:*'] },

        'valve:*':        { allow: ['transport:*','internalSpace:*','support:pole'] },
        'pump:*':         { allow: ['transport:*','internalSpace:*','support:pole'] },

        'solar:*':        { allow: ['support:pole','transport:ground'] },

        'computer:server':   { allow: ['internalSpace:*'] },
        'computer:storage':  { allow: ['internalSpace:*'] },
        'communications:router_core': { allow: ['internalSpace:*'] },
        'communications:repeater':    { allow: ['support:pole','support:antenna'] },
        'computer:rt_control':         { allow: ['transport:*','internalSpace:*'] },

        'shelf:robotic': { allow: ['internalSpace:*'] },
        'conveyor:*':    { allow: ['internalSpace:*'] },
        'rfid:*':        { allow: ['internalSpace:*'] },
        'hvac:*':        { allow: ['internalSpace:*'] },

        // Biogas plant modules
        'feed:*':        { allow: ['internalSpace:*'] },
        'pretreat:*':    { allow: ['internalSpace:*'] },
        'conveyor:auger':{ allow: ['internalSpace:*'] },
        'pump:slurry':   { allow: ['internalSpace:*'] },
        'vessel:*':      { allow: ['internalSpace:*'] },
        'mixer:*':       { allow: ['internalSpace:*'] },
        'heater:*':      { allow: ['internalSpace:*'] },
        'heat_xfer:*':   { allow: ['internalSpace:*'] },
        'gas_storage:*': { allow: ['internalSpace:*'] },
        'gas_move:*':    { allow: ['internalSpace:*'] },
        'gas_dry:*':     { allow: ['internalSpace:*'] },
        'gas_clean:*':   { allow: ['internalSpace:*'] },
        'gas_filter:*':  { allow: ['internalSpace:*'] },
        'gas_control:*': { allow: ['internalSpace:*'] },
        'safety:*':      { allow: ['internalSpace:*','support:pole'] },
        'flare:*':       { allow: ['support:pole','internalSpace:*'] },
        'engine:*':      { allow: ['internalSpace:*'] },
        'generator:*':   { allow: ['internalSpace:*'] },
        'heat_recovery:*': { allow: ['internalSpace:*'] },
        'power_elec:*':  { allow: ['internalSpace:*'] },
        'separator:*':   { allow: ['internalSpace:*'] },
        'pump:digestate':{ allow: ['internalSpace:*'] },
        'tank:digestate':{ allow: ['internalSpace:*'] },

        // Mycelium box reactor modules
        'steam_gen:*':     { allow: ['internalSpace:*'] },
        'sterilizer:*':    { allow: ['internalSpace:*'] },
        'pasteurizer:*':   { allow: ['internalSpace:*'] },
        'air_clean:laminar': { allow: ['internalSpace:*'] },
        'air_filter:hepa': { allow: ['internalSpace:*'] },
        'fan:*':           { allow: ['internalSpace:*'] },
        'dispenser:spawn': { allow: ['internalSpace:*'] },
        'tray:*':          { allow: ['internalSpace:*','shelf:robotic'] },
        'mold:box':        { allow: ['internalSpace:*','shelf:robotic'] },
        'dryer:dehydrator':{ allow: ['internalSpace:*'] },
        'dehumidifier:*':  { allow: ['internalSpace:*'] }
    }

    // Extra co-requirements (beyond module-level requires)
    const coRequires = {
        'transport:ground': ['gps','communications','battery'],
        'transport:flying': ['gps','communications','battery'],

        'sprayer:*':     ['tank','battery'],
        'valve:*':       ['tank','battery'],
        'pump:*':        ['tank','battery'],

        'generator:*':   ['engine'],
        'power_elec:*':  ['generator'],

        'sterilizer:autoclave': ['steam_gen'],
        'pasteurizer:*':        ['steam_gen'],
        'dispenser:spawn':      ['air_clean:laminar']
    }

    // Explicit forbids where mass rules aren’t enough
    const forbid = {
        'transport:flying': ['cart','tank','arm_heavy']
    }

    // Precedence (for consumers of this data):
    // childOverrides.allow / forbid → forbid → allowByParent (broad)

    return { allowByParent, childOverrides, coRequires, forbid }
})
