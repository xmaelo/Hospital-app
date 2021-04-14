import React, { useState, useEffect }from 'react';
import { View, StyleSheet, SafeAreaView, Image, StatusBar, Picker, ScrollView, TouchableOpacity } from 'react-native';
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
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
 
const avatar = require('../../assets/imgs/avatar.jpg')
export default function EditProfile({navigation, route}){
	const [phone, setPhone] = useState("");
	const [email, setMail] = useState("");
	const [poids, setPoids] = useState("");
	const [sexe, setSexe] = useState("");
	const [taille, setTaille] = useState("");
	const [date, setDate] = useState(null);
	const [show, setShow] = useState(false);
	const [disabled, setDisabled] = useState(false);
	const [images, setImage] = useState(null);
	const [nom_complet, setNom] = useState("");

	const [cascontact, setCascontact] = useState(null)
	useFocusEffect(
	    React.useCallback(() => {
			async function get() {
					const userId =  auth().currentUser.uid;
					let user = database().ref('users/'+userId);
					user.on('value', (snapshot) => {
						let it = snapshot.val();
						setNom(it.nom_complet)
						setPoids(it.poids)
						setPhone(it.phone)
						setTaille(it.taille)
						setImage(it.profile)
						setMail(it.email)
						setSexe(it.sexe)
						if(it.date){
							setDate(new Date(it.date))
						}
					});	

		    }
		    get();
		    return;
		  }, []
		)
	);

	async function onUpdateProfil(){
		let type, message, description;
		let ob;
		try{
			const userId = auth().currentUser.uid;
			let toU = {};
			if(phone&&phone.trim() !==""){
				toU.phone = phone
			}
			if(nom_complet&&nom_complet.trim() !==""){
				toU.nom_complet = nom_complet
			}
			if(email&&email.trim() !==""){
				toU.email = email
			}
			if(poids&&poids.trim() !==""){
				toU.poids = poids
			}
			if(sexe&&sexe.trim() !==""){
				toU.sexe = sexe
			}
			if(taille&&taille.trim() !==""){
				toU.taille = taille
			}
			if(date){
				toU.date = new Date(date).toISOString().split("T")[0]
			}
			if((Object.entries(toU)).length < 7){
				ob = true;
				message = "Error";
	    		type =  'danger';
	    		description="Vous n'avez pas definir tous les champs !"
			}else{
    			setDisabled(true)
				await database().ref('users/'+userId).update(toU);
				message = "Succès";
	    		type =  'success';
	    		description="Sauvegarde effectuée !"
	    	}
		}catch(e){
			console.log('error saving foto', e);
			message = "Error";
    		type =  'error';
    		description="Votre profile n'as pas été mise a jour!"
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

	    if(ob){
	       return; 
	    }
	    navigation.navigate('Main');
	}

	const upload = async (pathToFile) => {
		try{
			const userId = auth().currentUser.uid;
		    const reference = storage().ref("images/"+userId+".jpg");	    
		    let res = await reference.putFile(pathToFile);
		    const url = await reference.getDownloadURL();
		    console.log("res=====>",url)
		    setImage(url);
		    await database().ref('users/'+userId).update({profile: url});
		    const mess = {
		        message: "Succès",
		        description: "Photo de profile déja a jour !",
		        icon: { icon: "auto", position: "left" },
		        type: "success",
		        hideStatusBar: true,
		        onPress: () => {
		          hideMessage();
		        },
		    }; 
	     	showMessage(mess);
	    }catch(e){
	    	console.log('error ==========>', e)
	    }
	};

	

	return(
		<ScrollView>
		<View  style={styles.container}>
			<View style={[styles.container2, {flexDirection: "row", justifyContent: 'center', alignItems: 'center', marginTop: 15}]}>
	           <Image style={{ width: 120, height: 120, borderRadius: 100}} 
	           source={images ? {
	           		uri: images
	            }: avatar} 
	           width={100} height={100}/>
	            
                <TouchableOpacity 
	                style={styles.edite}
	                onPress={() =>
			            launchImageLibrary(
			              {
			                mediaType: 'photo',
			                includeBase64: false,
			                maxHeight: 200,
			                maxWidth: 200,
			              },
			              (response) => {
			              	console.log('__________________')
			                upload(response.uri);
			              }, 
			            )
			          }
	                activeOpacity={0.9}
	            >
	                <Ionicons
	                  name="create-outline"
	                  size={25}
	                  color="black"
	                />
	            </TouchableOpacity> 
	        </View>
			<View style={styles.form}>
				<Input
				  placeholder='Nom complet'
				  onChangeText={value => setNom(value)}
				  value={nom_complet}
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
				  disabled
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
				  value={email}
				  disabled
				  leftIcon={
				    <Ionicons
				      name='mail-outline'
				      size={24}
				      color='black'
				    />
				  } 
				/>
				<Input
				  placeholder='poids (Kg)'
				  onChangeText={value => setPoids(value)}
				  value={poids}
				  keyboardType="numeric"
				  leftIcon={
				    <Ionicons
				      name='locate-outline'
				      size={24}
				      color='black'
				    />
				  }
				/>
				<Input
				  placeholder='Taille (m)'
				  keyboardType="numeric"
				  onChangeText={value => setTaille(value)}
				  value={taille}
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
							  title={!date ?"Date de naissance" : "Changer la date de naissance"}
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
	                      onPress={()=>onUpdateProfil()}
	                      disabled={disabled}
	                      loading={disabled}
	                      title="Sauvegarder"
	                    />
	                </View> 
			    </View>   
			</View>
		</View>
		<View style={{height: 20}}>
		</View>
		</ScrollView>
	)
}


const styles = StyleSheet.create({
  container: {
  	flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: wp("6%")
  },
  container2: {
  	overflow: "hidden"
  },
  form: {
  	marginTop: hp("2%")
  },
  edite: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 100,
    }
});