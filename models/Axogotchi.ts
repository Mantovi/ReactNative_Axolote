import { Image, ImageBackground, ImageBackgroundProps, ImageSourcePropType } from "react-native";

export type Axogotchi = {
    id: number,
    name: string,
    color: number
};

// Mapeamento das imagens para cada cor
export interface AxogotchisMovement {
    color: number,
    awake: ImageBackgroundProps;
    sleeping: ImageBackgroundProps;
    sleepingStatic: ImageBackgroundProps;
    swimming: ImageBackgroundProps;
}
