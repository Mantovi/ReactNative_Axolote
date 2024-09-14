// import React from 'react';
// import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { useFonts } from 'expo-font';

// interface AxolotItemProps {
//     name: string;
//     image: any; // A imagem pode ser importada diretamente
//     hunger: number;
//     sleep: number;
//     fun: number;
//     onPress: () => void;
// }

// const AxolotItem: React.FC<AxolotItemProps> = ({ name, image, hunger, sleep, fun, onPress }) => {
//     const [fontsLoaded] = useFonts({
//         'PressStart2P': require('../assets/fonts/PressStart2P-Regular.ttf'),
//     });

//     if (!fontsLoaded) {
//         return null; // Espera o carregamento das fontes
//     }

//     return (
//         <TouchableOpacity style={styles.container} onPress={onPress}>
//             <View style={styles.content}>
//                 <Image source={image} style={styles.image} />
//                 <View style={styles.info}>
//                     <View style={styles.bars}>
//                         <View style={styles.barContainer}>
//                             <View style={styles.barBackground}>
//                                 <View style={[styles.bar, { backgroundColor: 'red', width: `${hunger}%` }]} />
//                             </View>
//                             <Text style={styles.textBar}>Hunger</Text>
//                         </View>
//                         <View style={styles.barContainer}>
//                             <View style={styles.barBackground}>
//                                 <View style={[styles.bar, { backgroundColor: 'blue', width: `${sleep}%` }]} />
//                             </View>
//                             <Text style={styles.textBar}>Sleep</Text>
//                         </View>
//                         <View style={styles.barContainer}>
//                             <View style={styles.barBackground}>
//                                 <View style={[styles.bar, { backgroundColor: 'yellow', width: `${fun}%` }]} />
//                             </View>
//                             <Text style={styles.textBar}>Fun</Text>
//                         </View>
//                     </View>
//                     <Text style={styles.name}>{name}</Text>
//                 </View>
//             </View>
//         </TouchableOpacity>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         backgroundColor: "#f9ccaa",
//         padding: 20,
//         marginVertical: 10,
//         borderRadius: 50,
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderColor: '#000',
//         borderWidth: 1,
//     },
//     content: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         flex: 1,
//     },
//     image: {
//         width: 80,
//         height: 70,
//         marginRight: 20,
//     },
//     info: {
//         flex: 1,
//     },
//     bars: {
//         flexDirection: 'column',
//         marginBottom: 10,
//     },
//     bar: {
//         height: 10,
//         borderRadius: 5,
//         marginVertical: 2,
//     },
//     barBackground: {
//         width: 100, // Largura fixa para o fundo da barra
//         height: 10,
//         borderRadius: 5,
//         backgroundColor: '#ddd', // Cor de fundo da barra
//         marginRight: 10,
//     },
//     name: {
//         fontSize: 18,
//         fontFamily: 'PressStart2P',
//         textAlign: 'center',
//         marginTop: 10,
//         width: '100%',
//     },
//     textBar: {
//         width: 60,
//         fontSize: 8,
//         fontFamily: 'PressStart2P',
//         textAlign: 'left',
//         marginRight: 10,
//     },
//     barContainer: {
//         flexDirection: 'row', // Barra e texto lado a lado
//         alignItems: 'center',
//         marginBottom: 5,
//     },
// });

// export default AxolotItem;
