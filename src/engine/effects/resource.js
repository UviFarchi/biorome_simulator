function calculateThirstDamage(context) {
    return -1
}

export default {
    water: [
        {target: 'animals', property: 'health', delta: calculateThirstDamage}
    ],
    electricity:[
        {target: 'animals', property: 'health', delta: 1}
    ],
    waste:[
        {target: 'animals', property: 'health', delta: -1}
    ],
}
