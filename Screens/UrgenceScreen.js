import React, { useState, useEffect }from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, SafeAreaView, Image, StatusBar, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';
import { Text, Input, Button, CheckBox } from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';



export default function UrgenceScreen(){
	return(
		<ScrollView>
			<View style={{paddingHorizontal: wp('3%'), paddingTop:10}}>
				<View style={null}>
					<Text style={{...styles.text, color: "#009BD9", paddingBottom: 10}}>Que faire en cas d’Urgence:</Text>
				</View>
				<View>
				 	<Text style={{...styles.text, fontWeight: "bold"}}>
				 		Si je n’ai pas de symptômes mais que j’ai eu un contact étroit ou que je vis avec une personne malade du COVID-19 :
				 	</Text>
				 	<Text style={styles.text}>
				 		1. Je m’isole à domicile, je reste chez moi sauf pour ravitaillement alimentaire, je fais du télétravail ;
				 	</Text>
				 	<Text style={styles.text}> 2. Je porte un masque lors des contacts inévitables, j’applique les gestes barrières ;</Text>
				 	<Text style={styles.text}> 3. Je prends ma température deux fois par jour et j’auto-surveille les symptômes de la maladie.</Text>
				 	<Text style={{...styles.text, fontWeight: "bold"}}>
				 		Si j’ai des symptômes évocateurs du COVID-19 (toux, fièvre, mal de gorge) : 
				 	</Text>
				 	<Text style={styles.text}>1. Je m’isole à domicile, j’évite tout contact avec mon entourage ; </Text>
				 	<Text style={styles.text}>
				 	 	2. J’appelle un numéro national dédié (le 15 10 ou les numéros ci-dessous) pour signaler ma situation aux autorités sanitaires et connaître la conduite à tenir ;
				 	</Text>
				</View>
			</View>
		</ScrollView>
	)
} 


const styles = StyleSheet.create({
    main: {
       flex: 1,
       backgroundColor: "white"
    },
    container: {
        paddingTop: hp('4%'),
        paddingHorizontal: wp("6%")
    },
    image: {
      resizeMode: "cover",
      justifyContent: "center"
    },
    text: {
      fontSize: 16,
      color: "#626365"
    }
});