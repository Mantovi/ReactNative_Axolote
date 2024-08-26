import { SafeAreaView, StyleSheet, Text, View } from "react-native";


const list = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View >
                <Text>Listagens</Text>
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