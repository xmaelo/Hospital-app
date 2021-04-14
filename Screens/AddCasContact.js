import React, { useState, useEffect }from 'react';
import { View, StyleSheet, SafeAreaView, Image, StatusBar, Picker, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Input, Button, CheckBox } from 'react-native-elements';
import { ListItem } from 'react-native-elements'
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker';
import { showMessage, hideMessage } from "react-native-flash-message";
import { useFocusEffect } from '@react-navigation/native';

export default function AddCasContact({navigation, route}){
	const [nom, setNom] = useState('');
	const [phone, setPhone] = useState('');
	const [mail, setMail] = useState('');
	const [lieu, setLieu] = useState('');
	const [sexe, setSexe] = useState('');
	const [date, setDate] = useState(null);
	const [show, setShow] = useState(false);
	const [disabled, setDisabled] = useState(false);

	const [cascontact, setCascontact] = useState(null)
	useFocusEffect(
	    React.useCallback(() => {
			async function get() {
	    		if(route.params?.key){
	    			console.log('route.params.key', route.params.key)
					const userId =  auth().currentUser.uid;
					let cascontact = database().ref('cascontact/'+userId+"/"+route.params.key);
					cascontact.on('value', (snapshot) => {
						let it = snapshot.val();
						setNom(it.nom)
						setPhone(it.phone)
						setLieu(it.lieu)
						setMail(it.mail)
						setSexe(it.sexe)
						setDate(new Date(it.date))
					});	
	    		}
		    }
		    get();
		    return;
		  }, []
		)
	);

	async function onSaveMesure(){
		
		const userId = auth().currentUser.uid;
    	let type, message, description;
    	if((phone&&phone.trim()==="" || mail&&mail.trim()==="" || lieu&&lieu.trim()==="" || !date || nom&&nom.trim()==="" || !sexe)){
			const message = {
	            message: "Erreur",
	            description: "Tous les champs n'ont pas été fourni !",
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
			if(route.params?.key){
				await database().ref('cascontact/'+userId+"/"+route.params.key).update({
					nom: nom,
					phone: phone,
					lieu: lieu,
					sexe: sexe,
					date: new Date(date).toISOString().split("T")[0],
					mail: mail
				})
			 }else{
				await database().ref('cascontact/'+userId).push({
					nom: nom,
					phone: phone,
					lieu: lieu,
					sexe: sexe,
					date: new Date(date).toISOString().split("T")[0],
					mail: mail
				})
			 }
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
	    }; 
     	showMessage(mess);
     	setDisabled(false)
     	navigation.navigate('ListCasContact');

	}
	return(
		<View  style={styles.container}>
			<View style={styles.form}>
				<Input
				  placeholder='Nom complet'
				  onChangeText={value => setNom(value)}
				  value={nom}
				  leftIcon={
				    <Ionicons
				      name='person-outline'
				      size={24}
				      color='black'
				    />
				  }
				/>
				<Input
				  placeholder='Téléphone'
				  onChangeText={value => setPhone(value)}
				  value={phone}
				  leftIcon={
				    <Ionicons
				      name='call-outline'
				      size={24}
				      color='black'
				    />
				  }
				/>
				<Input
				  placeholder='Email'
				  onChangeText={value => setMail(value)}
				  value={mail}
				  leftIcon={
				    <Ionicons
				      name='mail-outline'
				      size={24}
				      color='black'
				    />
				  } 
				/>
				<Input
				  placeholder='Lieu de rencontre'
				  onChangeText={value => setLieu(value)}
				  value={lieu}
				  leftIcon={
				    <Ionicons
				      name='locate-outline'
				      size={24}
				      color='black'
				    />
				  }
				/>

				<Picker
			        selectedValue={sexe}
			        style={{ height: 30, width: wp('90%'), color: "black" }}
			        onValueChange={(itemValue, itemIndex) => setSexe(itemValue)}
			    >
			        <Picker.Item label={"Sexe"} value={null} selected/>
			        <Picker.Item label="Maxculin" value="M" />
			        <Picker.Item label="Feminin" value="F" />
			    </Picker> 

			    <View>
			    	<View
			      		style={{justifyContent: 'center', alignItems: 'center',}}
			      	>
			      		{date&& 
			      			<Text>{new Date(date).toISOString().split("T")[0]}</Text>
			      		}
			      		{!show &&
			      			<Button
							  title={!date ?"Date de conctact" : "Changer la date"}
							  type="outline"
							  onPress={()=>setShow({show: true})}
							/>
			      		}
			      		{show&&
					        <DateTimePicker
					          testID="dateTimePicker"
					          value={new Date()}
					          mode={"date"}
					          is24Hour={true}
					          display="default"
					          onChange={(event, selectedDate)=>
					          	{
					          		if(selectedDate){
					          			setDate(selectedDate)
					          		}
					          		setShow(false)
					          	}
					          }
					        />
					    }
			        </View>  

			        <View style={{marginTop: 15}}> 
	                    <Button
	                      buttonStyle={{backgroundColor: "#009BD9", borderRadius: 20}}
	                      onPress={()=>onSaveMesure()}
	                      disabled={disabled}
	                      loading={disabled}
	                      title="Sauvegarder"
	                    />
	                </View> 
			    </View>   
			</View>
		</View>
	)
}


const styles = StyleSheet.create({
  container: {
  	flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: wp("6%")
  },
  form: {
  	marginTop: hp("2%")
  }
});