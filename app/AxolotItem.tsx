import { useFonts } from "expo-font";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface AxolotItemProps {
    name: string,
    image: string,
    hunger: number,
    sleep: number,
    fun: number,
    onPress: () => void;
}

const AxolotItem: React.FC<AxolotItemProps> = ({ name, image, hunger, sleep, fun, onPress }) => {
    let [fontsLoaded] = useFonts({
        'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),

    })

    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.content}>
                <Image source={require('../imagens/Spritesheets/Axolotl_Albino_Dash.png')} style={styles.image} />
                <View style={styles.info}>
                    <View style={styles.bars}>
                        <View style={[styles.bar, { backgroundColor: 'red', width: `${hunger}%` }]} />
                        <View style={[styles.bar, { backgroundColor: 'blue', width: `${sleep}%` }]} />
                        <View style={[styles.bar, { backgroundColor: 'yellow', width: `${fun}%` }]} />
                    </View>
                    <Text style={styles.name}>{name}</Text>
                </View>
                <View>

                </View>
            </View>
        </TouchableOpacity>
    );
}

export default AxolotItem;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f9ccaa",
        padding: 20,
        marginVertical: 10,
        borderRadius: 20,
        flexDirection: 'column',
        alignItems: 'center',
    },
    content: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    image: {
        width: 60,
        height: 60,
        marginRight: 20,
    },
    info: {
        flex: 1,
    },
    bars: {
        flexDirection: 'column',
        marginBottom: 10,
    },
    bar: {
        height: 10,
        borderRadius: 5,
        marginVertical: 2,
    },
    name: {
        fontSize: 18,
        fontFamily: 'PressStart2P',
        textAlign: 'center',
    },

})