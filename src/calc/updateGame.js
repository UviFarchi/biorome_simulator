import {saveAllStores} from "@/utils.js";
import {recalculateTileValues} from "@/calc/recalculateTileValues.js";
import {produceReport} from "@/calc/produceReport.js";
import {gameStore} from "@/stores/game.js";
import generateWeather from "@/calc/generateWeather.js";
import {marketFlux} from "@/calc/marketFlux.js";


export default function () {

    const game = gameStore()

    game.currentDay += 1;
    const currentDate = game.currentDate
    const month = currentDate.getMonth() + 1
    const day = currentDate.getDate()

    let season = {}
    switch (true) {
        case (month === 3 && day >= 20) || (month > 3 && month < 6) || (month === 6 && day <= 20):
            season = { label: 'Spring', icon: '🌸' }
            break
        case (month === 6 && day >= 21) || (month > 6 && month < 9) || (month === 9 && day <= 21):
            season = { label: 'Summer', icon: '☀️' }
            break
        case (month === 9 && day >= 22) || (month > 9 && month < 12) || (month === 12 && day <= 20):
            season = { label: 'Autumn', icon: '🍂' }
            break
        default:
            season = { label: 'Winter', icon: '❄️' }
    }
    game.currentSeason = season;



    generateWeather();
    recalculateTileValues();
    produceReport();
    marketFlux();
    saveAllStores();
}