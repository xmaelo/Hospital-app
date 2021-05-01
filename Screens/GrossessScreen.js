import React, { useEffect, useState }from 'react';
import { View, StyleSheet, SafeAreaView, Image, Alert, Picker, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';
import { Text, Input, Button, CheckBox } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { ProgressBar, Colors } from 'react-native-paper';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { showMessage, hideMessage } from "react-native-flash-message";

const img = require('../../assets/imgs/bebe/Le-foetus-a-10-semaines-de-grossesse.jpg')


const week = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

export default function GrossessScreen({navigation}){
	const [mentrue, setMentrue] = useState(null)
	const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
	const [dateRegle, setDateRegle] = useState(null);
	const [string, setString] = useState("");
	const [disabled, setDisabled] = useState(false);
	const [grossesse, setGrossesse] = useState(null);


	const onLoadData = () => {
		let userId = auth().currentUser.uid;
	      	let grossesse = database().ref('grossesse/'+userId+"/infos");
	      	grossesse.once('value', (snapshot) => {
				setGrossesse(snapshot.val());
			});
	}

	useEffect(() => {
	    (async()  =>{ 
	      	onLoadData();
		})
	});

	const onSaveGrossesse = async () => {
		let type, message, description;
    	if(!dateRegle && !mentrue){
			const message = {
	            message: "Erreur",
	            description: "Vous n'avez pas rempli tous les champs réquis !",
	            icon: { icon: "auto", position: "left" },
	            type: 'danger',
	            hideStatusBar: false,
	            onPress: () => {
	              hideMessage();
	            },
    		}
    		showMessage(message);
            return;
    	}
    	setDisabled(true)
		try{
				let date_accouche = dateRegle.getDate() + parseInt(parseInt(mentrue) / 2)
				let date = new Date();
				date.setDate(date_accouche);
				date.setMonth(9);
				console.log('------------->>>>', date);
				const userId = auth().currentUser.uid;
				await database().ref('grossesse/'+userId+"/infos").update({
			      date_mentrue: mentrue,
			      date_regle: dateRegle.toISOString(),
			      date_accouche: date.toISOString()
			    })
				 message = "Succès";
	    		 type =  'success';
	    		 description="Sauvegarde effectuée !"
		}catch(e){
			message = "Error";
    		type =  'danger';
    		description="Erreur inconnue est apparue !"
			console.log('error saving on firebase');
		}
		const mess = {
            message: message,
            description: description,
            icon: { icon: "auto", position: "left" },
            type: type,
            hideStatusBar: false,
            onPress: () => {
              hideMessage();
            },
		}
    	showMessage(mess);
     	setDisabled(false)
     	onLoadData();
        return;
	}
	const hideDatePicker1 = () => {
	    setDatePickerVisibility1(false);
	};
	const handleConfirm1 = (date) => {
	    setDateRegle(date)
	    hideDatePicker1();
	    let string = week[date.getDay()]+" le "+date.getDate() +"-" +(parseInt(date.getMonth())+1)+"-"
							+date.getFullYear()
		setString(string)
	}
	return(
		<ScrollView style={{backgroundColor: "white"}} >
			<View style={styles.container}>
				{!grossesse&&
					<View style={{...styles.form}}>
						<View>
							<Text style={{fontSize: 17}} >
								Date de début de vos dernières règles:
							</Text>
							<Input
							  placeholder='Date'
							  //onChangeText={value => setSubtitle(value)}
							  onTouchStart={() => setDatePickerVisibility1(!isDatePickerVisible1)}
							  onChangeText={() => setDatePickerVisibility1(!isDatePickerVisible1)}
							  value={string}
							  leftIcon={
							    <Ionicons
							      name='calendar-outline'
							      size={24}
							      color='black'
							    />
							  }
							/>
							<DateTimePickerModal
						        isVisible={isDatePickerVisible1}
						        mode="date"
						        onConfirm={handleConfirm1}
						        onCancel={hideDatePicker1}
						    />

						</View>
						<View style={{ ...styles.row, justifyContent: "space-around"}}>
							<Text style={{fontSize: 17}} >Cycle Mentruel:</Text>
							<Picker
						        selectedValue={mentrue}
						        style={{ 
						        	height: 30, 
						        	width: 150, 
						        	color: "black",
						        	borderRadius: 10,
						        	borderWidth: 1,
						        	borderColor: "black",
						        	borderStyle: "solid"
						         }}
						        onValueChange={(itemValue, itemIndex) => setMentrue(itemValue)}
						      >
						        <Picker.Item label="20 Jours" value="20" />
						        <Picker.Item label="21 Jours" value="21" />
						        <Picker.Item label="22 Jours" value="22" />
						        <Picker.Item label="23 Jours" value="23" />
						        <Picker.Item label="24 Jours" value="24" />
						        <Picker.Item label="25 Jours" value="25" />
						        <Picker.Item label="26 Jours" value="26" />
						        <Picker.Item label="27 Jours" value="27" />
						        <Picker.Item label="28 Jours" value="28" />
						        <Picker.Item label="29 Jours" value="29" />
						        <Picker.Item label="30 Jours" value="30" />
						        <Picker.Item label="31 Jours" value="31" />
						        <Picker.Item label="32 Jours" value="32" />
						        <Picker.Item label="33 Jours" value="33" />
						        <Picker.Item label="34 Jours" value="34" />
						        <Picker.Item label="35 Jours" value="35" />
					        </Picker>
						</View>
						<View style={{height: 30}}/>
						<View>
							<Button
							  title="Commencer les calcul"
							  onPress={()=>onSaveGrossesse()}
			                  disabled={disabled}
			                  loading={disabled}
							/>
						</View>
					</View>
				}
				{grossesse&&
					<View>
						<View>
							<Image
		                        style={{ width: wp("100%"), height: hp("40%") }}
		                        source={img}
		                    />
						</View>
						<View style={{...styles.row, ...styles.padding}}>
							<Round 
								width={40}
								value={35}
								size={20}
								size={20}
							/>
							<Round 
								width={50}
								value={36}
								size={21}
							/>
							<Round 
								width={60}
								value={37}
								color={true}
								size={23}
							/>
							<Round 
								width={50}
								value={38}
								size={21}
							/>
							<Round 
								width={40}
								value={39}
								size={20}
							/>
						</View>
						<View style={{marginTop: 20}}>
							<View style={{...styles.height, backgroundColor: "#659E5A"}}>
								<View style={{
									flexDirection: "row", 
									justifyContent: "space-between", 
									...styles.padding,
									marginTop: 10
								 }} >
									<Text style={styles.witheText} > 37 semaines 4 Jours</Text>
									<Text style={styles.witheText} > 3 trimestre</Text>
								</View>
								<View style={{...styles.padding, marginTop: 16}}>
									<ProgressBar progress={0.5} color={"white"} />
								</View>
								<View style={{...styles.padding, marginTop: 16, alignItems: "center"}}>
									<Text style={{...styles.witheText, fontSize: 13}}> Accouchement probable le 16 mars (2 semaines 3 jours restantes)</Text>
								</View>
							</View>
							<View style={{...styles.height, backgroundColor: "#F15A24", marginTop: -20}}>
								<View style={{
									flexDirection: "row", 
									justifyContent: "space-between", 
									...styles.padding,
									marginTop: 10
								 }} >
									<Text style={styles.witheText} > BEBE</Text>
									<Ionicons 
										name="chevron-forward-circle" 
										size={35}
										style={{marginTop: -30}}
										color={'white'}
									/>
								</View>
								<View style={{
									...styles.padding,
									marginTop: 10
								 }} >
									<Text style={{...styles.witheText, fontSize: 13}} >
										A 38 semaines, e bébé est considerer comme etant a terme. 
										Son développement est terminer et ses organes sont prêt a 
										fonctionner, la croissance ralentit maintenant, mais la prise de 
										poids se
									</Text>
								</View>

							</View>

							<View style={{...styles.height, backgroundColor: "#3A469D", marginTop: -20}}>
								<View style={{
									flexDirection: "row", 
									justifyContent: "space-between", 
									...styles.padding,
									marginTop: 10
								 }} >
									<Text style={styles.witheText} > MAMAN</Text>
									<Ionicons 
										name="chevron-forward-circle" 
										size={35}
										style={{marginTop: -30}}
										color={'white'}
									/>
								</View>
								<View style={{
									...styles.padding,
									marginTop: 10
								 }} >
									<Text style={{...styles.witheText, fontSize: 13}} >
										A 38 semaines, e bébé est considerer comme etant a terme. 
										Son développement est terminer et ses organes sont prêt a 
										fonctionner, la croissance ralentit maintenant, mais la prise de 
										poids se
									</Text>
								</View>
								
							</View>
						</View>
						<View style={{paddingTop: hp('3%'), paddingBottom: hp('3%'), alignItems: "center"}}>
							<Button
							  title={" Liste a faire"}
							  type="outline"
							  buttonStyle={{width: 200}}
							  onPress={()=>navigation.navigate('ToDOScreen')}
							  icon={<Ionicons name="list" size={20} color="#4793CC"/>}
							/>
						</View>
					</View>
				}
			</View>
		</ScrollView>
	)
}

const Round = ({width, value, color, size}) =>
	<View style={{...styles.round, width: width, height: width,  backgroundColor: color ? "#009BD9" : null}}>
		<Text style={{fontSize: size, color: !color ? "#009BD9" : "white"}}>
			{value}
		</Text>
	</View>


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: hp('2%'),
        backgroundColor: "white",
    },
    form: {
	  	marginTop: hp("5%"),
	  	paddingHorizontal: wp('6%')
	},
    witheText: {
    	color: "white",
    	fontSize: 16
    },
    padding: {
    	paddingHorizontal: wp("6%")
    },
    row: {
    	flexDirection: 'row',
    	 marginTop: hp('2%'),
    	justifyContent: 'space-between',
    	alignItems: 'center'
    },
    height: {
    	height: 150,
    	borderTopLeftRadius: 25,
    	borderTopRightRadius: 25,
    },
    round: {
    	borderRadius: 50,
    	borderColor: "#009BD9",
    	borderWidth: 2,
    	borderStyle: "solid",
    	alignItems: "center",
    	justifyContent: "center"
    },
    text: {
    	color: "#009BD9",
    }
}) 


/**

<TouchableOpacity 
							  onClick={() => {
							  	setDatePickerVisibility1(true)
							  	console.log('_________>',isDatePickerVisible1)
							  }}
						>
							<Ionicons
							  name='calendar-outline'
						      size={34}
						      color='black'
							/>
						</TouchableOpacity>


						*/