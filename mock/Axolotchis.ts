import { AxogotchisMovement } from "@/models/Axogotchi"

export const Axogotchis: AxogotchisMovement[] = [
    {
        color: 1,
        awake: require('../assets/gifs/albinoFloating.gif'),
        sleeping: require('../assets/gifs/albinoSleeping.gif'),
        sleepingStatic: require('../imagens/AlbinoSleepingStop.png'),
        swimming:  require("../assets/gifs/albinoSwimming.gif")
    },
    {
        color: 2,
        awake: require('../assets/gifs/PimentinhaFloating.gif'),
        sleeping: require('../assets/gifs/pimentinhaSleeping.gif'),
        sleepingStatic: require('../imagens/PimentinhaSleepingStop.png'),
        swimming:  require("../assets/gifs/pimentinhaSwimming.gif")
    },
    {
        color: 3,
        awake: require('../assets/gifs/UranioFloating.gif'),
        sleeping: require('../assets/gifs/uranioSleeping.gif'),
        sleepingStatic: require('../imagens/UranioSleepingStop.png'),
        swimming:  require("../assets/gifs/uranioSwimming.gif")
    }
]