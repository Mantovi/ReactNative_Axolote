import { SafeAreaView, StyleSheet, Text, View } from "react-native";


const list = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View >
                <Text>Listagem</Text>
            </View>
        </SafeAreaView>
    );
}

export default list;

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff"
    }
})