import React, { useEffect, useState }from 'react';
import { View, StyleSheet, SafeAreaView, Image, Alert, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';
import { Text, Input, Button, CheckBox } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {AuthService, x} from '../video/services';
import { PermissionsAndroid } from 'react-native';
import {fcmService} from '../FCMService';
import {localNotificationService} from '../LocalNotificationService';

import Init from '../video/Init';

const img = require('../../assets/imgs/logo.png')

 
const docId = "QY7P52WSS6UmEFX6Dmc0qhDSG232"; 

export default function HomeMedScreen(props){
	const [users, setUsers] = useState([]);
	const [doc, setDoc] = useState({});
	const [pat, setPat] = useState([]);
	const [numRen, setNumRen] = useState(0)
	const [numRenAu, setNumRenAu] = useState(0)
    const [filteredUsers, setFilteredUsers] = useState([]);

    const onLogout = () =>
    Alert.alert(
      "Confirmation",
      "Vous souhaitez vous déconnecter ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
        	let users2 = database().ref('users/'+auth().currentUser.uid);
        	users2.update({last_seen: new Date().getTime()});
        	auth().signOut().then(() => props.navigation.navigate("LoginScreen"))} 
        }
      ]
    );

    useEffect(() => {
	    (async()  =>{ 
	      let user = auth().currentUser;
	      let docId = user.uid;
	      let users = database().ref('users').orderByChild('is_doctor').equalTo(null);
	      let tab = [];
	      let tab2 = [];
	      users.once('value', (snapshot) => {
			for (const [key, value] of Object.entries(snapshot.val())) {
		    	tab.push({...value, key: key})
			}
			setUsers(tab);
		});
	      let users1 = database().ref('users/'+user.uid);
	      let users2 = database().ref('users/'+user.uid);
	      users2.update({last_seen: 'online'});
	      users1.once('value', snatchot =>{
	        let callId = snatchot.val().callId;
	        setDoc(snatchot.val());
	        AuthService.check({id: callId, email: user.email, password: user.email, login: user.email, idU: user.uid});
	        //new Init().start();
	      })
	      let mespatients = database().ref('users').orderByChild('is_doctor').equalTo(null);
	      mespatients.on('value', (snapshot) => {
				if(snapshot.val()){
			      	let xc = Object.values(snapshot.val()).map((value, key)=>{
			      		return value
			      	})
			      	xc = xc.filter(a=>{
			      		if(a.demandes){
			      			return Object.keys(a.demandes).find((i)=>i===docId)
			      		}
			      	});
					setPat(xc);
				}
			}); 

	        let rendezVous = database().ref('rendezVous/'+docId);
		        rendezVous.on('value', (snapshot) => { 
		        if(snapshot.val()){
		           let rendez = {};
		           let dayR = Object.values(snapshot.val()).filter((ren, id)=>new Date(ren.start).toISOString().split('T')[0] === new Date().toISOString().split('T')[0])
		           let pro = Object.values(snapshot.val()).filter((ren, id)=>new Date(ren.start).getTime() > new Date().getTime())
		           setNumRenAu(dayR.length);
		           setNumRen(pro.length);
	        }})

	      const onRegister = async (token)  =>{
	        console.log('[App] onRegister: ', token);
	        users2.update({token: token});
	      }
	      
	      const onNotification = async (notify) => {
	        console.log('[App] onNotification: ', notify);
	        const options = {
	          sound: 'default',
	          playSound: true,
	        };
	        console.log('--------------------------------------------------------')
	        console.log(notify.title, notify.body)
	        console.log('--------------------------------------------------------')
	        await localNotificationService.showNotification(
	          0,
	          notify.title,
	          notify.body,
	          notify,
	          options,
	        );
	      }
	      const onOpenNotification = (notify) => {
	        console.log('[App] onOpenNotification: ', notify);
	      }
	      await fcmService.registerAppWithFCM();
	      await fcmService.register(onRegister, onNotification, onOpenNotification);
	      await localNotificationService.configure(onOpenNotification);
	    })(); 
	  }, []);
	return(
		<ScrollView style={{backgroundColor: "white"}}>
			<StatusBar style="auto" backgroundColor="white" />
            <SafeAreaView style={styles.container}>
            	<View style={styles.imgBloc}>
                    <Image
                        style={{ width: wp("40%"), height: hp("10%"), borderRadius: 100 }}
                        source={img}
                    />
                    <Text style={{...styles.slogan, fontWeight: "bold", marginTop: -hp('.5%')}}>
                      Bienvenue Dr. {doc.nom_complet}
                    </Text>
                </View> 

                <View style={{marginTop: hp("3%"), backgroundColor: "#F6F7F8", paddingHorizontal: wp('2%')}}>
                	<View style={{paddingBottom: 30}}>
	                	<View style={{...styles.row, justifyContent: "space-between", alignItems: "center"}}>
	                		<View style={styles.row}>
	                			<Ionicons name="calendar" size={20}/>
	                			<Text>{"  "}Mes Rendez vous</Text>
	                		</View>
	                		<View>
	                			<Ionicons name="add" size={30} color='#4793CC'/>
	                		</View>
	                	</View>
	                	<View style={{...styles.container_card_profile, paddingTop: 15, justifyContent: "center"}}>
	                		<View style={{...styles.row, justifyContent: "space-around"}}>
						       <View style={{...styles.col}}>
						       		<Text style={styles.paddingTop}>Pour aujourd'hui</Text>
						       		<Text>Prochain rendez-vous</Text>
						       </View>

						       <View style={{...styles.col, alignItems: "center"}}>
						       		<Text  style={{color: "#4793CC", fontSize: 17, ...styles.paddingTop}}>{numRenAu}</Text>
						       		<Text  style={{color: "#4793CC", fontSize: 17}}>{numRen}</Text>
						       </View>
						       <View style={{...styles.col, alignItems: "center"}}>
						       		<Ionicons style={styles.paddingTop} name="eye" size={20} color="#4793CC"/>
						       		<Ionicons name="send" size={20} color="#4793CC"/>
						       </View>
						    </View>
						    <View style={{alignItems: "center", marginTop: 15}}>
						    	<Button
								  title={" Voir le calendrier"}
								  type="outline"
								  onPress={()=>props.navigation.navigate("RendezVousScreen")}
								  buttonStyle={{width: 200}}
								  icon={<Ionicons name="calendar" size={20} color="#4793CC"/>}
								/>
						    </View>
					    </View>
	                </View>

	                <View style={{paddingBottom: 30}}>
	                	<View style={{...styles.row, justifyContent: "space-between", alignItems: "center"}}>
	                		<View style={styles.row}>
	                			<Ionicons name="people" size={23}/>
	                			<Text>{"  "}Patients</Text>
	                		</View>
	                		<View>
	                			<Ionicons name="add" size={30} color='#4793CC'/>
	                		</View>
	                	</View>

	                	<View style={{...styles.container_card_profile, paddingTop: 15, justifyContent: "center"}}>
	                		<View style={{...styles.row, justifyContent: "space-around"}}>
						       <View style={{...styles.col}}>
						       		<TouchableOpacity
						       			onPress={()=>props.navigation.navigate('MyPatientList')}
						       		>
						       			<Text style={styles.paddingTop}>Mes Patients</Text>
						       		
						       		</TouchableOpacity>
						       		<TouchableOpacity
						       			onPress={()=>props.navigation.navigate('PatientListScreen')}
						       		>
						       			<Text>Tous les Patients</Text>
						       		</TouchableOpacity>
						       </View>

						       <View style={{...styles.col, alignItems: "center"}}>
						       		<Text  style={{color: "#4793CC", fontSize: 17, ...styles.paddingTop}}>{pat.length} </Text>
						       		<Text  style={{color: "#4793CC", fontSize: 17}}>{users.length}</Text>
						       </View>
						    </View>
					    </View>
	                </View>
	                <View style={{paddingBottom: 30}}>
	                	<View style={{...styles.row, justifyContent: "space-between", alignItems: "center"}}>
	                		<View style={styles.row}>
	                			<Ionicons name="apps" size={23}/>
	                			<Text>{"  "}Racourcis</Text>
	                		</View>
                			<TouchableOpacity
                				onPress={onLogout}
                			>
		                		<View style={styles.row}>
			                			<Ionicons name="log-out" size={23}/>
			                			<Text>{"  "}Déconnexion</Text>
		                		</View>
		                	</TouchableOpacity>
	                	</View>
	                	<View style={{...styles.row, justifyContent: 'space-between', marginTop: 20}}>
	                		<View style={styles.center}>
		                		<View style={{...styles.center, ...styles.rondView}} >
		                			<Ionicons
		                			 name='settings-outline'
		                			 size={30} 
		                			 color="#4793CC"
		                			/>
		                		</View>
		                		<Text style={styles.slogan}>Paramètres</Text>
	                		</View>
	                		<View style={styles.center}>
		                		<View style={{...styles.center, ...styles.rondView}} >
		                			<Ionicons
		                			 name='cash'
		                			 size={30} 
		                			 color="#4793CC"
		                			/>
		                		</View>
		                		<Text style={styles.slogan}>Facturation</Text>
	                		</View>
	                		<View style={styles.center}>
		                		<View style={{...styles.center, ...styles.rondView}} >
		                			<Ionicons
		                			 name='help-circle-outline'
		                			 size={30} 
		                			 color="#4793CC"
		                			/>
		                		</View>
		                		<Text style={styles.slogan}>Aide</Text>
	                		</View>
	                		
	                	</View>
	                </View>
                </View>
            </SafeAreaView>
            <Init navigation={props.navigation} is_doctor={true}/>
		</ScrollView>
	)
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: hp('2%'),
        backgroundColor: "white",
        paddingHorizontal: wp("6%"),
    },
    center: {
    	alignItems: "center",
    	justifyContent: "center"
    },
    rondView: {
    	height: 50,
    	width: 50,
    	borderRadius: 50,
    	borderColor: "#4793CC",
    	borderWidth: 1,
    	borderStyle: 'solid'

    },
    paddingTop: {paddingBottom: 12},
    container_card_profile: {
	    backgroundColor: 'white',
	    marginLeft: hp('2%'),
	    marginRight: hp('2%'),
	    borderRadius: 10,
	    marginTop: hp('2%'),
	    shadowColor: "#000",
	    shadowOffset: {
	      width: 0,
	      height: 6,
	    },
	    shadowOpacity: 0.39,
	    shadowRadius: 8.30,

	    elevation: 13,
	    paddingBottom: 14
	},
    imgBloc: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    slogan: {
        color: "#5F666D",
        fontSize: hp("2.3%")

    },
    test2: {
        marginTop: hp('3%'),
        // marginLeft: -wp('72%'),
        // paddingBottom: 50
    },
    img: {
        // marginTop: hp('6%'),
        height: hp('8.2%'),
        width: wp('40%')
    },
    imgContainer:{
        // paddingBottom: wp('30%')
    },
    row: {
    	flexDirection: 'row',
    },
    col: {
    	flexDirection: 'column',
    },
    forgotPass:{ 
        flexDirection: 'row', 
        justifyContent: 'flex-end',
        paddingRight: wp("10%"),
        marginBottom: hp("2%"),
        width: wp('100%'),
    },
    textEntries: {
        alignContent: 'center', 
        justifyContent: 'center'
    },
    signup:{
        flexDirection:'row',
        width: wp('100%'),
        justifyContent: 'center',
        marginTop: wp('2%'),
    }
})