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
import DateTimePickerModal from "react-native-modal-datetime-picker";

const week = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];


export default function AddResultat({navigation, route}){
	const [start, setStart] = useState(null);
	const [disabled, setDisabled] = useState(false);
	const [end, setEnd] = useState(null);
	const [title, setTitle] = useState('');
	const [subtitle, setSubtitle] = useState('');
	const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);

	async function onSaveResultat(){
		const userId = route.params?.userId;
    	let type, message, description;
    	if((title&&title.trim()==="" || subtitle&&subtitle.trim()==="")){
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
				await database().ref('resultats/'+userId+"/"+route.params.key).update({
				  name: title, 
			      description: subtitle,
			      date: start ? start.toISOString() : null
				})
			 }else{
				await database().ref('resultats/'+userId).push({
			      name: title, 
			      description: subtitle,
			      date: start ? start.toISOString() : null
			    })
			 }
			 message = "Succès";
    		 type =  'success';
    		 description="Sauvegarde effectuée !"
		}catch(e){
			message = "Error";
    		type =  'danger';
    		description="Erreur inconnue est apparue !"
			console.log('error saving on firebase', e);
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
     	navigation.navigate('ResultatExamenScreen');

	}

	useFocusEffect(
	    React.useCallback(() => {
			async function get() {
	    		if(route.params?.key){
	    			console.log('route.params.userId', route.params.userId)
					const userId =  route.params.userId;
					let cascontact = database().ref('resultats/'+route.params.userId+'/'+route.params.key);
					try{
						cascontact.once('value', (snapshot) => {
							let it = snapshot.val();
							setTitle(it.name)
							setSubtitle(it.description)
						});	
					}catch(e){
						console.log('erororroro getting', e)
					}
	    		}
		    }
		    get();
		    return;
		  }, []
		)
	);

	const showDatePicker1 = () => {
	    setDatePickerVisibility1(true);
	};

	const hideDatePicker1 = () => {
	    setDatePickerVisibility1(false);
	};

	const handleConfirm1 = (date) => {
	    setStart(date)
	    hideDatePicker1();

	};


	return(
		<View  style={styles.container}>
			<View style={styles.form}>
				<Input
				  placeholder='Nom examen'
				  onChangeText={value => setTitle(value)}
				  value={title}
				  leftIcon={
				    <Ionicons
				      name='pencil-outline'
				      size={24}
				      color='black'
				    />
				  }
				/>
				<Input
				  placeholder='Description'
				  onChangeText={value => setSubtitle(value)}
				  value={subtitle}
				  leftIcon={
				    <Ionicons
				      name='pencil-outline'
				      size={24}
				      color='black'
				    />
				  }
				/>
				<View style={{...styles.row, ...styles.content3}}>
					<View style={{ ...styles.row, ...styles.content2, width: wp('45%')}}>
						<Ionicons
					      name='calendar-outline'
					      size={24}
					      color='black'
					    />
					    <View style={{marginLeft: wp("1%"),}}>
							<Button
							icon={
								<Icon
									name="chevron-down"
									size={13}
									color="black"
								/>
							}
							buttonStyle={{paddingHorizontal: 20, backgroundColor: "#F0F0F0"}}
							titleStyle={{color: "black"}}
							iconRight
							title="Date      "
							onPress={()=>setDatePickerVisibility1(true)}
						/>
						<DateTimePickerModal
					        isVisible={isDatePickerVisible1}
					        mode="datetime"
					        onConfirm={handleConfirm1}
					        onCancel={hideDatePicker1}
					      />

					    </View>
					</View>
					<View>
						<Text>
						{start? 
							week[start.getDay()]
							+" le "+start.getDate() +"-" 
							+(parseInt(start.getMonth())+1)+"-"
							+start.getFullYear()+" à "+ start.getHours()+" h "+start.getMinutes(): null}
						</Text>
					</View>
				</View>
				<View style={{height: 20}}/>
			</View>

			<View style={{height: 30}}/>
			<View>
				<Button
				  title="Enregistrer"
				  onPress={()=>onSaveResultat()}
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
  },
  row: {
	 	flexDirection: 'row',
	 },
	 content3: {
	 	alignItems: "center"
	 },
	content2: {
		justifyContent: "space-around", 
		justifyContent: 'flex-start', 
		alignItems: "center"
	}
});