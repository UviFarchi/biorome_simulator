export const assemblyRequirements = {
    "accepts": [
        {
            "parent": "mobile_base:*",
            "children": [
                "arm:*",
                "mast:*",
                "tank:*",
                "pump:*",
                "sprayer:*",
                "manifold:*",
                "valve:*",
                "hose:*",
                "battery_pack:*",
                "generator:*",
                "repeater:*",
                "compute:*",
                "comms:*",
                "camera:*",
                "sensor_*:*",
                "storage:*",
                "tray:*",
                "vision_sort:*"
            ]
        },
        {
            "parent": "cart:*",
            "children": [
                "tank:*",
                "pump:*",
                "sprayer:*",
                "manifold:*",
                "valve:*",
                "hose:*",
                "battery_pack:*",
                "generator:*",
                "storage:*",
                "tray:*",
                "vision_sort:*",
                "camera:*",
                "sensor_*:*"
            ]
        },
        {
            "parent": "trailer:*",
            "children": [
                "tank:*",
                "pump:*",
                "sprayer:*",
                "manifold:*",
                "valve:*",
                "hose:*",
                "battery_pack:*",
                "generator:*",
                "storage:*"
            ]
        },
        {
            "parent": "mast:*",
            "children": [
                "camera:*",
                "repeater:*",
                "antenna:*",
                "sensor_*:*",
                "uwb:*",
                "lidar:*",
                "sensor_lidar:*"
            ]
        },
        {
            "parent": "arm:*",
            "children": [
                "tool_*:*",
                "camera:*",
                "sensor_*:*",
                "suction_cup:*",
                "clippers:*",
                "gripper:*",
                "sprayer:*"
            ]
        },
        {
            "parent": "tank:*",
            "children": [
                "pump:*",
                "filter:*",
                "manifold:*",
                "valve:*",
                "hose:*"
            ]
        },
        {
            "parent": "pump:*",
            "children": [
                "manifold:*",
                "valve:*",
                "hose:*",
                "sprayer:*"
            ]
        },
        {
            "parent": "manifold:*",
            "children": [
                "valve:*",
                "hose:*",
                "sprayer:*"
            ]
        },
        {
            "parent": "valve:*",
            "children": [
                "hose:*",
                "sprayer:*"
            ]
        },
        {
            "parent": "air_compressor:*",
            "children": [
                "air_filter:*",
                "air_jet:*"
            ]
        },
        {
            "parent": "uav:*",
            "children": [
                "camera:*",
                "sensor_*:*",
                "sprayer:*",
                "repeater:*"
            ]
        },
        {
            "parent": "drone:*",
            "children": [
                "camera:*",
                "sensor_*:*",
                "sprayer:*",
                "repeater:*"
            ]
        },
        {
            "parent": "repeater:*",
            "children": [
                "antenna:*"
            ]
        },
        {
            "parent": "sprayer:*",
            "children": [
                "camera:*",
                "sensor_*:*"
            ]
        }
    ],
    "forbidden": [
        {
            "parent": "uav:*",
            "child": "tank:*"
        },
        {
            "parent": "drone:*",
            "child": "tank:*"
        },
        {
            "parent": "uav:*",
            "child": "arm:*"
        },
        {
            "parent": "drone:*",
            "child": "arm:*"
        },
        {
            "parent": "battery_pack:*",
            "child": "*:*"
        },
        {
            "parent": "generator:*",
            "child": "*:*"
        },
        {
            "parent": "camera:*",
            "child": "*:*"
        },
        {
            "parent": "sensor_*:*",
            "child": "*:*"
        }
    ],
    "portPolicy": {
        "useAcesPorts": true,
        "useParentPortsUsed": true
    }
};