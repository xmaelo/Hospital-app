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
import FilePickerManager from 'react-native-file-picker';
import storage from '@react-native-firebase/storage';


const week = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];



export default function AddOrdonnace({navigation, route}){
	const [start, setStart] = useState(null);
	const [disabled, setDisabled] = useState(false);
	const [end, setEnd] = useState(null);
	const [title, setTitle] = useState('');
	const [subtitle, setSubtitle] = useState('');
	const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
	const [url, setUrl] = useState(null);
	const [image, setImage] = useState(null);
	const [showPicker, setShowFile] = useState(false);
	const [noPicture, setNoPicture] = useState(false);

	const upload = async () => {
		try{
			const userId = auth().currentUser.uid;
		    const reference = storage().ref("images/"+image.fileName);	    
		    let res = await reference.putFile(image.path);
		    const url = await reference.getDownloadURL();
		    console.log("res=====>",url)
		    return url;
	    }catch(e){
	    	console.log('error ==========>', e)
	    }
	};

	async function onSaveOrdonances(){
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
			let url;
			if(image){
				url = await upload();
			}
			if(route.params?.key){
				await database().ref('ordonnances/'+userId+"/"+route.params.key).update({
					title: title, 
			      subtitle: subtitle,
			      url: url,
			      date: start ? start.toISOString() : null
				})
			 }else{
				await database().ref('ordonnances/'+userId).push({
			      title: title, 
			      url: url,
			      subtitle: subtitle,
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
     	navigation.navigate('OrdonancesScreen');

	}

	useEffect(() => { 
        (async()  =>{
    		if(route.params?.key){
    			console.log('route.params.userId', route.params.userId)
				const userId =  route.params.userId;
				let cascontact = database().ref('ordonnances/'+route.params.userId+'/'+route.params.key);
				try{
					cascontact.once('value', (snapshot) => {
						let it = snapshot.val();
						setTitle(it.title)
						setSubtitle(it.subtitle)
						//setUrl(it.url)
						if(it.url && it.url.split('pdf')[1] || it.url && it.url.split('doc')[1]){
							setNoPicture(true)
							let tav = it.url.split('/');
							setUrl({url: (tav[tav.length-1].split('?')[0]).split('%2')[1], path: false})
							console.log(tav[tav.length-1].split('?')[0])
						}
						console.log('it.url it.url==>>', url)
					});	
				}catch(e){
					console.log('erororroro getting', e)
				}
    		}
		})();
    }, []);
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
				  placeholder='Title'
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
				<Input
				  placeholder='Choisir le fichier'
				  onTouchStart={() => {setShowFile(true)}}
				  //onChangeText={() => setShowFile(!showPicker)}
				  value={image && image.fileName || url?.url}
				  leftIcon={
				    <Ionicons
				      name='pencil-outline'
				      size={24}
				      color='black'
				    /> 
				  }
				  rightIcon={
					url && !noPicture? 
					<View> 
						<Image 
							style={{width: 35, height: 50}}
							source={require('../../assets/imgs/jpg.jpg')}  
			            /> 
					</View> : 
					<View> 
						<Image 
							style={{ width: 35, height: 50}}
							source={require('../../assets/imgs/pdf.png')} 
			            /> 
					</View> 
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
			<View>
			{showPicker &&
				FilePickerManager.showFilePicker(null, (response) => {
				  console.log('Response = ', response);

				  if (response.didCancel) {
				    console.log('User cancelled file picker');
				  }
				  else if (response.error) {
				    console.log('FilePickerManager Error: ', response.error);
				  }
				  else {
				    setShowFile(false)
				    setImage(response);
				    //setUrl({url: response.path, path: true})
				    console.log('response.path', response.path)
				  }
				})
			}
			</View>

			<View style={{height: 30}}/>
			<View>
				<Button
				  title="Enregistrer"
				  onPress={()=>onSaveOrdonances()}
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