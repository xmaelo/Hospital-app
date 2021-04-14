import React, { useState }from 'react';
import { View, StyleSheet, Picker, SafeAreaView, Image, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';
import { Text, Input, Button, CheckBox } from 'react-native-elements';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth'; 
import { showMessage, hideMessage } from "react-native-flash-message";
 
		const label= {
						Fever: "Fever",
						Throat: "Throat Pain",
						Gaz: "Gaz",
						High: "High BP",
						Blocked: "Blocked nose",
						Headache: "Headache",
						Couth: "Couth",
						Loose: "Loose Motion",
						Low: "Low BP",
						Migraine: "Migraine",
						Runny: "Runny nose",
						Constipation: "Constipation",
						Diabetes: "Diabetes",
						vaumiting: "vaumiting"
					}

export default function SymtomeScreen({navigation}){
	const [selectedValue, setSelectedValue] = useState("java");

	const [object, setObject] = useState({});
	const [disabled, setDisabled] = useState(false);

	const onPress = (x) => {
		let y = {...object}
		if(!object[x]){
			y = {...y, [x]: true}
		}else{
			delete y[x]
		}
		setObject(y);
	}
	const onSave = async () => {
		let message, type, description;
		let success;
		try{
			const userId = auth().currentUser.uid;
			if(Object.entries(object).length !== 0){
				setDisabled(true)
				await database().ref('symtomes/'+userId).push(object);
				message = "Succès";
	    		type =  'success';
	    		description="Sauvegarde effectuée !"
	    		success = true;
			}else{
				message = "Info !";
	    		type: 'info',
	    		description="Rien à enregistrer !"
			}

		}catch(e){
			console.log('error saving foto', e);
			message = "Error";
    		type =  'danger';
    		description="Votre profile n'as pas été mise a jour!"
			console.log('error saving on firebase');
		}

		const mess = {
	        message: message,
	        description: description,
	        icon: { icon: "auto", position: "left" },
	        type: type,
	        onPress: () => {
	          hideMessage();
	        },
	    };
     	showMessage(mess);
     	setDisabled(false)
     		if(success){
	    		navigation.navigate('Main');
     		}
	}
	return(
		<ScrollView style={{backgroundColor: "white"}}>
			<View style={styles.container}> 
				<View style={styles.center}>
				  <Text h4 style={{ ...styles.slogan}}>Analyse des symptômes</Text>
				</View>
				<View style={{...styles.center, marginTop: 16}}>
				  <View style={{...styles.select, ...styles.displayRow, ...styles.center, paddingLeft: 10}}>
				  	  <Ionicons
							name="person-outline"
							size={30}
							color="black"
						/>
				      <Picker
				        selectedValue={selectedValue}
				        style={{ height: 40, width: 150 }}
				        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
				      >
				        <Picker.Item label="Covid19" value="covid" />
				        <Picker.Item label="Diabète" value="diabete" />
				      </Picker>
				   </View>
				</View>

				<View style={{...styles.center, marginTop: 16}}>
					<ScrollView horizontal>
						<View style={{...styles.displayRow}}>
						    {Object.entries(object).map((item, i)=>
								<Button
									icon={
										<Icon
											name="times"
											size={13}
											color="white"
										/>
									}
									buttonStyle={{borderRadius: 20, paddingHorizontal: 20, backgroundColor: "#009BD9"}}
									iconRight
									onPress={()=>{
										delete object[item[0]]
										setObject({...object})
									}}
									title={label[item[0]]+" "}
								/>
							)}
						</View>
					</ScrollView>
				</View>
				<View style={styles.form}>
					<View style={{ ...styles.displayRow2}}>
						<View style={{...styles.center2}}>
							<Card st="Fever" name="Fever" icon="person" onPress={onPress} />
							<Card st="Throat" name="Throat Pain" icon="person" onPress={onPress}/>
							<Card st="Gaz" name="Gaz" icon="person" onPress={onPress}/>
							<Card st="High" name="High BP" icon="person" onPress={onPress}/>
							<Card st="Blocked" name="Blocked nose" icon="person" onPress={onPress}/>
							<Card st="Headache" name="Headache" icon="person" onPress={onPress}/>
							<Card st="vaumiting" name="vaumiting/Nausea" icon="person" onPress={onPress}/>
						</View>
						<View style={{...styles.center2}}>
							<Card st="Couth" name="Couth" icon="person" onPress={onPress}/>
							<Card st="Loose" name="Loose Motion" icon="person" onPress={onPress}/>
							<Card st="Low" name="Low BP" icon="person" onPress={onPress}/>
							<Card st="Migraine" name="Migraine" icon="person" onPress={onPress}/>
							<Card st="Runny" name="Runny nose" icon="person" onPress={onPress}/>
							<Card st="Constipation" name="Constipation" icon="person" onPress={onPress}/>
							<Card st="Diabetes" name="Diabetes" icon="person" onPress={onPress}/>
						</View>
					</View>
				</View>
			</View>
			<View style={{height: hp("5%")}}>
			</View>
			<View style={styles.center}>
				<Button
                      buttonStyle={{backgroundColor: "#009BD9", borderRadius: 5, width: wp('80%')}}
                      onPress={onSave}
                      title="Enregister"
                      disabled={disabled}
	                   loading={disabled}
                    />
            </View>
			<View style={{height: hp("10%")}}>
			</View>
		</ScrollView>
	)
}

function Card({icon, name, st, onPress}){
	return(
		<TouchableOpacity onPress={()=>onPress(st)} >
			<View style={{...styles.displayRow, ...styles.center}}>
				<View style={styles.card}>
					<Ionicons
						name="person"
						size={33}
						color="black"
					/>
				</View>
				<View><Text style={styles.slogan}>{"  "+name}</Text></View>
			</View>
		</TouchableOpacity>
	)
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: hp('2%'),
        paddingHorizontal: wp("6%"),
    },
    center: {
    	justifyContent: 'center',
        alignItems: 'center',
    },
    center2: {
    	justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: "column",
        width: wp("47%")
    },
    form: {
    	marginTop: hp("3%"),
    	paddingTop: hp("1%"),
    	borderTopColor: "#5F666D",
    	borderTopWidth: .5,
    	borderStyle: "solid",
    	paddingHorizontal: wp("2%")
    },
    card: {
    	paddingVertical: hp("1%"),
	    marginTop: hp("1%"),
	    backgroundColor: "white",
	    borderRadius: 10,
	    shadowColor: '#1e1e1e',
	    width: wp("10.5%"),
	    height: 50,
	    shadowOffset: {
	      width: 1,
	      height: 1,
	    },
	    shadowOpacity: 0.5,
	    shadowRadius: 3,
	    elevation: 8,
    },
    select: {
    	borderRadius: 20,
    	borderStyle: "solid",
    	borderWidth: 1,
    	borderColor: "green"
    },
    slogan: {
        color: "#5F666D",
        fontSize: hp("2.3%")

    },
    displayRow: {
    	flexDirection: 'row', 
    	justifyContent: 'space-between'
    },
    displayRow2: {
    	flexDirection: 'row', 
    }
 });