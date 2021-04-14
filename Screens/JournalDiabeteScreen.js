import React, { useState }from 'react';
import { View, StyleSheet, Picker, SafeAreaView, Image, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';
import { Text, Input, Button, CheckBox, ButtonGroup } from 'react-native-elements';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth'; 
import { useFocusEffect } from '@react-navigation/native';
 

export default function JournalDiabeteScreen(){
	const [diabetes, setDiabetes] = useState([]);
	useFocusEffect(
	    React.useCallback(() => {
			async function get() {
				const userId =  auth().currentUser.uid;
				let tab = [];
				let mesure = database().ref('mesures/'+userId);
					mesure.once('value', (snapshot) => {
						if(snapshot.val()){
								for (const [key, value] of Object.entries(snapshot.val())) {
									tab.push(value)
								}
								setDiabetes(tab);
								console.log('value===========ddh====>', diabetes);

						}
					});	
		    }
		    get();
		    return;
		  }, []
		)
	);
 	return(
	 	<View style={styles.main}>
	 		<ScrollView style={styles.container}>
	 			{diabetes.map((diabete, index)=>{
	 				return(<Item key={index} diabete={diabete}/>)
	 			})
	 			}
	 		</ScrollView>
	 	</View>

 	)
}

function Item({diabete}){
	return(
		<View>
			<View style={styles.haut}>
				<Text style={styles.slogan} >{new Date(diabete.date).toISOString().split("T")[0]}</Text>
			</View> 

			<View style={styles.bas}>
				<View>
					<Text style={styles.value} >{(parseFloat(diabete.glucide)*1000/parseFloat(diabete.glycemie)).toFixed(0)} mg/dl</Text>
					<Text style={styles.slogan} >{diabete.time}</Text>
				</View>
				<View>
					<Text style={styles.slogan} >{diabete.cathegorie}</Text>
				</View>
			</View>

		</View>
	)
}

const styles = StyleSheet.create({
    container: {
    	marginTop: hp("2%"),
        paddingHorizontal: wp("1%"),
        backgroundColor: "white"
    },
    bas: { 
	    height: 60,
	    justifyContent: "space-between",
		paddingHorizontal: wp("5%"),
		flexDirection: "row"
    },
    haut: {
    	paddingHorizontal: wp("5%"),
    	height: 30,
    	backgroundColor: "#F0F0F0"
    },
    main: {	
    	flex: 1,
        backgroundColor: "white"
    },
    slogan: {
        color: "#5F666D",
        fontSize: hp("2.3%")

    },
    value: {
        color: "#5F666D",
        fontSize: hp("2.7%")

    }
  });