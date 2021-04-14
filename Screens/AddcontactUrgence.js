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

export default function AddcontactUrgence({navigation, route}){
	const [nom, setNom] = useState(''); 
	const [phone, setPhone] = useState('');
	const [disabled, setDisabled] = useState(false);

	useFocusEffect(
	    React.useCallback(() => {
			async function get() {
	    		if(route.params?.key){
	    			console.log('route.params.key', route.params.key)
					const userId =  auth().currentUser.uid;
					let cascontact = database().ref('contactUrgence/'+userId+"/"+route.params.key);
					cascontact.on('value', (snapshot) => {
						let it = snapshot.val();
						setNom(it.nom)
						setPhone(it.phone)
					});	
	    		}
		    }
		    get();
		    return;
		  }, []
		)
	);

	async function onSaveCasContact(){
		
		const userId = auth().currentUser.uid;
    	let type, message, description;
    	if((phone&&phone.trim()==="" || nom&&nom.trim()==="")){
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
				await database().ref('contactUrgence/'+userId+"/"+route.params.key).update({
					nom: nom,
					phone: phone
				})
			 }else{
				await database().ref('contactUrgence/'+userId).push({
					nom: nom,
					phone: phone
				})
			 }
			 message = "Succès";
    		 type =  'success';
    		 description="Sauvegarde effectuée !"
		}catch(e){
			message = "Error";
    		type =  'error';
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
     	navigation.navigate('ContactUrgence');

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
			</View>
			<View>
				<Button
				  title="Enregistrer"
				  onPress={()=>onSaveCasContact()}
                  disabled={disabled}
                  loading={disabled}
				/>
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