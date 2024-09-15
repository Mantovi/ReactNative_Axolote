import { Image, ImageBackground, ImageBackgroundProps, ImageSourcePropType } from "react-native";

export type Axogotchi = {
    id: number,
    name: string,
    color: number,
    hunger: number,
    sleep: number,
    fun: number,
    lastUpdate: Date,
};

// Mapeamento das imagens para cada cor
export interface AxogotchisMovement {
    color: number,
    awake: ImageBackgroundProps;
    sleeping: ImageBackgroundProps;
    sleepingStatic: ImageBackgroundProps;
}
