import { StyleSheet } from 'react-native'; 
// npm i expo-constants
import Constants from 'expo-constants';
// npm i react-native-responsive-fontsize
import { RFValue } from "react-native-responsive-fontsize";

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        padding: RFValue(10), 
        paddingTop: Constants.statusBarHeight, // evita de sobrepor a statusBar
        // alignItems: 'center',
        // justifyContent: 'center', 
    }, 
    titulo: {
        fontSize: RFValue(16),
    }
});

export default styles;