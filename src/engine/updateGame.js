import {saveAllStores} from "@/utils.js";
import {applyEffects} from "@/engine/steps/applyEffects.js";
import {produceReport} from "@/engine/steps/produceReport.js";
import {gameStore} from "@/stores/game.js";
import getWeather from "@/engine/steps/getWeather.js";
import {marketFlux} from "@/engine/steps/marketFlux.js";
import ecosystemEvents from "@/engine/steps/ecosystemEvents.js";
import applyStageChanges from "@/engine/steps/applyStageChanges.js";
import clearAssemblyOrders from "@/engine/steps/clearAssemblyOrders.js";
import eventBus from "@/eventBus.js";

const now = () => (performance && performance.now) ? performance.now() : Date.now();


export default function () {
    eventBus.emit('log', {engine: 'simulation', msg: 'Beginning Update'})
    const game = gameStore()

    game.currentTurn += 1;
    const currentDate = game.currentDate
    const month = currentDate.getMonth() + 1
    const day = currentDate.getDate()

    let season = {}
    switch (true) {
        case (month === 3 && day >= 20) || (month > 3 && month < 6) || (month === 6 && day <= 20):
            season = {label: 'Spring', icon: '🌸'}
            break
        case (month === 6 && day >= 21) || (month > 6 && month < 9) || (month === 9 && day <= 21):
            season = {label: 'Summer', icon: '☀️'}
            break
        case (month === 9 && day >= 22) || (month > 9 && month < 12) || (month === 12 && day <= 20):
            season = {label: 'Autumn', icon: '🍂'}
            break
        default:
            season = {label: 'Winter', icon: '❄️'}
    }
    game.currentSeason = season;


    const t0 = now();
    const times = [];
    eventBus.emit('log', {engine: 'simulation', msg: 'Recalculating entity values.'})
    const step = (name, fn) => {
        eventBus.emit('log', {engine: 'simulation', msg: 'Step ' + name})
        const s = now(); fn(); const d = now() - s; times.push([name, d]);
    };

    // pipeline (same order)
    step("getWeather",        getWeather);
    step("ecosystemEvents",   ecosystemEvents);
    step("applyEffects",  applyEffects);
    step("marketFlux",        marketFlux);
    step("applyStageChanges", applyStageChanges);
    step("clearAssemblyOrders", clearAssemblyOrders);
    step("produceReport",     produceReport);
    step("saveAllStores",     saveAllStores);

    const total = now() - t0;
    // single summary log
    console.log(
        `[tick] total ${total.toFixed(1)} ms`,
        Object.fromEntries(times.map(([n,d]) => [n, +d.toFixed(1)]))
    );
}