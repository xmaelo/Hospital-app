import React, { useState, useEffect }from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, SafeAreaView, Image, StatusBar, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';
import { Text, Input, Button, CheckBox } from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';



export default function RiposteScreen(){
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
				<View style={null}>
					<Text style={{...styles.text, color: "#009BD9", paddingBottom: 10}}>Que faire pour vous protéger et protéger les autres de la COVID-19</Text>
				</View>
				<View>
					<Text>
						Laissez une distance d’au moins un mètre entre vous et les autres pour réduire 
						le risque d'infection lorsque vous toussez, éternuez ou parlez. Gardez une distance encore 
						plus grande entre vous 
						et les autres lorsque vous êtes à l'intérieur. Plus vous êtes éloigné, mieux c'est.</Text>
					<Text>Considérez le port du masque comme normal lorsque vous êtes avec d'autres personnes. 
						Pour que les masques soient aussi efficaces que possible, il est essentiel de les porter, 
						de les ranger et de les laver ou de les jeter correctement.</Text>
				</View>
				<View style={null}>
					<Text style={{...styles.text, color: "#009BD9", paddingBottom: 10}}>Voici, en quelques points essentiels, comment porter un masque:</Text>
				</View>
				<View>
					<Text>
						Lavez-vous les mains avant de mettre votre masque, ainsi 
						qu'avant de l’enlever et après l'avoir fait.
					</Text>
					<Text>
						Assurez-vous qu'il couvre à la fois votre nez, votre bouche et votre menton.
					</Text>
					<Text>	
						Lorsque vous enlevez votre masque, placez-le dans un sac en plastique propre et lavez-le, chaque jour, 
						s’il s’agit d’un masque en tissu ou jetez-le dans une poubelle si c’est un masque médical.
					</Text>
					<Text>N’utilisez pas de masques avec des valves d’expiration.</Text>
				</View>
				<View>
					<Text style={styles.text}>Source: OMS</Text>
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