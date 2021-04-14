import React, { useState, useEffect }from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, SafeAreaView, Image, StatusBar, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';
import { Text, Input, Button, CheckBox } from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';



export default function LeVirusScreen(){
	return(
		<ScrollView>
			<View style={{paddingHorizontal: wp('3%'), paddingTop:10}}>
				<View style={null}>
					<Text style={{...styles.text, color: "#009BD9", paddingBottom: 10}}>Que sait-on du virus SARS-CoV-2 ?</Text>
				</View>
				<View>
					<Text style={{...styles.text}}>
						Si la COVID-19 se propage dans votre communauté, protégez-vous en prenant 
						quelques précautions simples, comme maintenir une distance physique avec autrui, 
						porter un masque, bien ventiler les pièces, éviter les rassemblements, 
						vous laver les mains, et tousser dans votre coude replié ou un mouchoir. 
						Suivez les recommandations locales là où vous vivez et travaillez. Faites tout cela !
					</Text>
				</View>

				<View>
					<Text style={styles.text}>
						Plusieurs coronavirus sont déjà connus pour être capables d’infecter les humains : 
						trois coronavirus saisonniers responsables de symptômes hivernaux sans gravité (rhumes), le SARS-CoV responsable du syndrome respiratoire aigu sévère (SRAS) et le MERS-CoV responsable d’une 
						atteinte respiratoire potentiellement sévère (Middle East Respiratory Syndrome).
					</Text>
				</View>
				<View>
				 	<Text style={{...styles.text, fontWeight: "bold"}}>Le SARS-CoV-2 est le septième coronavirus pathogène pour l'Homme. Il est responsable de la maladie Covid-19 (COronaVIrus Disease 2019).</Text>
					<Text style={styles.text}>Source:</Text>
					<Text style={styles.text}>https://www.inserm.fr/information-en-sante/dossiers-information/coronavirus-sars-cov-et-mers-cov </Text>
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