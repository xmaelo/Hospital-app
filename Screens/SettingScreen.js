import React, { useState, useEffect }from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Image, Picker, Switch, StatusBar, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Input, Button, CheckBox } from 'react-native-elements';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';



export default function SettingScreen(){
	const [switchVal, setSwitchVal] = useState(false);
	const [selectedValue, setSelectedValue] = useState("java");
	const [user, setUser] = useState({});

	useEffect(() => {
    (async()  =>{ 
      const userId = await auth().currentUser.uid
      let user = database().ref('users/'+userId);

      user.once('value', snatchot =>{
      	setUser(snatchot.val())
      })

    })();
  }, []);

	return(
		<ScrollView style={styles.container}>
			<View>
				<View style={{...styles.blueBack}}>
					<Text style={styles.texxt}>Paramètre de facturation</Text>
				</View>
				<View style={{marginTop: 20}}>
					<View style={{...styles.row, justifyContent: "space-around"}}>
						<View style={{width: "40%"}}>
							<Text style={styles.texxt2}>Votre Abo:{"   "}</Text>
						</View> 
						<View style={{ backgroundColor: "#009BD9", justifyContent: "flex-start"}}>
							<Picker
						        selectedValue={selectedValue}
						        style={{ height: 30, width: 200, color: "white" }}
						        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
						      >
						        <Picker.Item label="Express Union" value="covid" />
						        <Picker.Item label="Mtn Money" value="diabete" />
						      </Picker>
						</View>
					</View>
					<View style={{...styles.row, justifyContent: "space-around", ...styles.top}}>
						<View style={{width: "40%"}}>
							<Text style={styles.texxt2}>Methode de paiement:{"   "}</Text>
						</View>
						<View>
							<Picker
						        selectedValue={selectedValue}
						        style={{ height: 30, width: 200}}
						        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
						      >
						        <Picker.Item label="Express Union" value="covid" />
						        <Picker.Item label="Mtn Money" value="diabete" />
						      </Picker>
						</View>
					</View>

				</View>
				<View>
					<View style={{...styles.blueBack}}>
						<Text style={styles.texxt}>Paramètre du compte</Text>
					</View>

					<View style={{...styles.row, justifyContent: "space-around", ...styles.top2}}>
						<View style={{width: "35%", paddingLeft: wp("5.4%")}}>
							<Text style={styles.texxt2}>Email:</Text>
						</View>
						<View style={{width: wp("60%"), marginTop: -hp("2%")}}>
							<Input
							 
							  placeholder='INPUT WITH CUSTOM ICON'
							  value={user.email}
							  rightIcon={
							    <Ionicons
							      name='checkmark-outline'
							      size={24}
							      color='black'
							    />
							  }
							/>
						</View>
					</View>
					<View style={{...styles.row, justifyContent: "space-around"}}>
						<View style={{width: "35%", paddingLeft: wp("5.4%")}}>
							<Text style={styles.texxt2}>Telephone:</Text>
						</View>
						<View style={{width: wp("60%"), marginTop: -hp("2%")}}>
							<Input
							 
							  placeholder='INPUT WITH CUSTOM ICON'
							  value={user.phone}
							  rightIcon={
							    <Ionicons
							      name='checkmark-outline'
							      size={24}
							      color='black'
							    />
							  }
							/>
						</View>
					</View>
					<View style={{...styles.row, justifyContent: "space-around"}}>
						<View style={{width: "35%", paddingLeft: wp("5.4%")}}>
							<Text style={styles.texxt2}>Mot de passe:</Text>
						</View>
						<View style={{width: wp("60%"), marginTop: -hp("2%")}}>
							<Input
							  secureTextEntry
							  placeholder='INPUT WITH CUSTOM ICON'
							  value={"673276146"}
							  rightIcon={
							    <Ionicons
							      name='checkmark-outline'
							      size={24}
							      color='black'
							    />
							  }
							/>
						</View>
					</View>

					<View style={{...styles.row, justifyContent: "space-around"}}>
						<View style={{width: "63%", paddingLeft: wp("5.4%")}}>
							<Text style={styles.texxt2}>Activer les notifications:</Text>
						</View>
						<View style={{width: wp("30%")}}>
							<Switch
								rackColor={{false: "#0767577", true: "#009BD9"}}
								thumbColor={switchVal ? '#009BD9' : "#f4f3f4"}
								value={switchVal}
								onValueChange={()=>setSwitchVal(!switchVal)}
							/>
						</View>
					</View>
				</View>

				<View>
					<View style={{...styles.blueBack}}>
						<Text style={styles.texxt}>Paramètre Hôpital</Text>
					</View>

					<View style={{...styles.row, justifyContent: "space-around", ...styles.top2}}>
						<View style={{width: "35%", paddingLeft: wp("5.4%")}}>
							<Text style={styles.texxt2}>Suivi médical distant ?</Text>
						</View>
						<View style={{width: wp("60%")}}>
							<Switch
								rackColor={{false: "#0767577", true: "#009BD9"}}
								thumbColor={switchVal ? '#009BD9' : "#f4f3f4"}
								value={switchVal}
								onValueChange={()=>setSwitchVal(!switchVal)}
							/>
						</View>
					</View>
					{switchVal &&
						<View style={{...styles.row, justifyContent: "space-around", marginTop: hp('2%')}}>
							<View style={{width: "35%", paddingLeft: wp("5.4%")}}>
								<Text style={styles.texxt2}>Id  Hôpital:</Text>
							</View>
							<View style={{width: wp("60%"), marginTop: -hp("2%")}}>
								<Input
								 
								  placeholder='INPUT WITH CUSTOM ICON'
								  value={"XMBAZ_HG-3U"}
								  rightIcon={
								    <Ionicons
								      name='checkmark-outline'
								      size={24}
								      color='black'
								    />
								  }
								/>
							</View>
						</View>
					}
					<View style={{justifyContent: 'center', alignItems: 'center', marginTop: hp('4%')}}>
						<TouchableOpacity>
							<View style={{...styles.row}}>
								<Text style={{fontSize: 20}}>
									Conditions générale d'utilisation
								</Text>
								<Ionicons
								      name='arrow-redo'
								      size={24}
								      color='black'
								    />
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</ScrollView>
	)
}



const styles = StyleSheet.create({
	container: {
	    flex: 1,
	    paddingHorizontal: wp('1%'),
	    backgroundColor: 'white',
	 },
	 center: {
        alignContent: 'center', 
        justifyContent: 'center'
    },
    top: {
    	marginTop: hp("1.5%")
    },
    top2: {
    	marginTop: hp("3%")
    },
	 texxt: {
	 	color: "white",
	 },
	 texxt2: {
	 	color: "black",
	 	fontSize: 17
	 },
	 padding: {
	 	paddingHorizontal: wp("3%"),
	 },
	 row: {
	 	flexDirection: 'row',
	 },
	 blueBack: {
	 	backgroundColor: "#009BD9",
	 	height: hp("5%"),
	 	marginTop: 5,
	 	justifyContent: 'center',
        alignItems: 'center',
	 	paddingHorizontal: wp("5%")
	 }
})