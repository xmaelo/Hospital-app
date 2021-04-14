import React, { useState, useEffect }from 'react';
import { View, StyleSheet, SafeAreaView, Image, StatusBar, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Input, Button, CheckBox } from 'react-native-elements';
import { ListItem } from 'react-native-elements'
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';

export default function AntecedentsMedical({navigation, route}){

	
	const [obj, setObj] = useState({
		diabete: false,
		obesite: false,
		cardiq: false,
		femme: false,
		insuffisance: false,
		hyperTenion: false
	})

	const [editable, setEditable] = useState(false);
	useFocusEffect(
	    React.useCallback(() => {
			async function get() {
					let userId;
					if(route.params?.userId){
					  userId =  route.params.userId;
					}else{
					  userId =  auth().currentUser.uid;
					  setEditable(true)
					}
					let user = database().ref('antecedents/'+userId);
					user.on('value', (snapshot) => {
						if(snapshot.val()){
							setObj(snapshot.val());
						}
					});	
		    }
		    get();
		    return;
		  }, []
		)
	);

	async function onSave(key){
		try{
			let obj2 = obj;
			obj2[key] = !obj2[key]
			setObj(obj2)
			if(editable){
				const userId =  auth().currentUser.uid;
				await database().ref('antecedents/'+userId).update(obj2);
			}
		}catch(r){
			console.log('error saving===>', r)
		}
	}
	return(
		<View style={styles.container}>
			<View style={{marginTop: 30}}>
				<CheckBox
				  title={"Diabète"}
				  onPress={()=>onSave('diabete')}
				  checked={obj.diabete}
				/>
				<CheckBox
				  title={"obésité"}
				  onPress={()=>onSave('obesite')}
				  checked={obj.obesite}
				/>
				<CheckBox
				  title={"Problème Cardiaque"}
				  onPress={()=>onSave('cardiq')}
				  checked={obj.cardiq}
				/>
				<CheckBox
				  title={"Femme Enceinte"}
				  onPress={()=>onSave('femme')}
				  checked={obj.femme}
				/>
				<CheckBox
				  title={"Insuffisance Rénale"}
				  onPress={()=>onSave('insuffisance')}
				  checked={obj.insuffisance}
				/>
				<CheckBox
				  title={"Hypertension"}
				  onPress={()=>onSave('hyperTenion')}
				  checked={obj.hyperTenion}
				/>
			</View>
		</View>
	)
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: wp("6%"),
    },
    center: {
    	justifyContent: 'center',
        alignItems: 'center',
    },
    displayRow2: {
    	flexDirection: 'row', 
    },
    center2: {
    	justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: "column",
        width: wp("47%")
    }
});