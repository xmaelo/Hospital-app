import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  StatusBar,
  TouchableOpacity,
  Image, 
  ScrollView,
  SafeAreaView,
  Alert,   
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ListItem, Icon , Badge} from 'react-native-elements'
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import ToggleSwitch from 'toggle-switch-react-native'
import { showMessage, hideMessage } from "react-native-flash-message";





export default function NotificationScreen({navigation}){

	const [suivies, setSuivies] = useState([]);
	const [currentUser, setCurenntUser] = useState([]);
	const userId =  auth().currentUser.uid;

	    useEffect(() => {  
	        (async()  =>{ 
	            let user = database().ref('users/'+userId);
				user.on('value', (snapshot) => {
					setCurenntUser(snapshot.val())
					if(snapshot.val() && snapshot.val().demandes){
		                let data = {};
		                let meds = Object.keys(snapshot.val().demandes).map((key)=>{
		                  console.log("===>", key)
		                  let doc = database().ref('users/'+key)
		                  doc.once('value', snapshot=>{
		                  	data[key] = {doc_id: key, ...snapshot.val()} 
		                	setSuivies(data)
		                  	console.log('data======== data data', data)
		                  })
		                  return 
	    
		                })
		                console.log('medsmeds v v_ v meds v', meds) 
	               }
				});
	            // pats.on('value', (snapshot) => {
	            //   console.log('snapshot.val().demandes', snapshot.val())
	              
	            //   if(snapshot.val() && snapshot.val().demandes){
	            //     let suivies = Object.keys(snapshot.val().demandes).map((key)=>{
	            //       console.log("===>", key)
	            //       return key 
    
	            //     })  
	            //     console.log('suivies suivies=====xb=====', snapshot.val())
	            //     //setSuivies(suivies[0].filter(val=>val!==undefined));
	            //   }
	            // });
	        })();
	    }, []);

	    function activeSuivie(isOn, doc_id){
	    	console.log('activate suivie', isOn)
	    	try{
	    		let message = {
	                message: "Info !",
	                description: "",
	                icon: { icon: "auto", position: "left" },
	                type: 'info',
	                onPress: () => {
	                  hideMessage();
	                },
	            };
	    		let user = database().ref('users/'+auth().currentUser.uid);
	    		let app = {}
	    		if(isOn){
	    			message.description = "Ce medecin vous suivra desormais !"
	    			app = {date_approbation: new Date().getTime(), docId: doc_id}
	    		}else{
	    			message.description = "Ce medecin ne vous suivra plus desormais !"
	    			app = {docId: null, date_desapprobation: new Date().getTime()}
	    		}
	    		user.update(app);
	            showMessage(message);
	    	}catch(e){
	    		console.log('error activate suivie', e)
	    	}
	    }

	return(
		<View style={{ flex: 1, paddingTop: 10 }}>
	      <View style={styles.container}>
	        <ScrollView>
		        {Object.values(suivies).length > 0 ? (
		          <>
		            {Object.values(suivies).map((user, key) => (
		              <View key={key} style={styles.userCard}>
		              	<View style={{flexDirection: "row", alignItems: 'center',}}>
			                <Image
			                  style={styles.userImage}
			                  source={user.profile ? {
				           		uri: user.profile
				                }: require('../../assets/imgs/doc.jpg')} 
			                />
			                <View style={styles.userCardRight}>
			                  <Text
			                    style={{ fontSize: 18, fontWeight: '500' }}
			                  >{user.nom_complet} 
			                  </Text> 
			                  <Badge value={<Text style={{color: "white"}} >{"  23/04/2021  "}</Text>} />
			                </View>
			            </View>
		                <View>
			                <View style={{flexDirection: "row"}} >
			                	<ToggleSwitch
								  onColor="green"
								  offColor="#f4f3f4"
								  label=""
								  labelStyle={{ color: "black", fontWeight: "900" }}
								  size="small"
								  isOn={currentUser.docId&&currentUser.docId===user.doc_id}
								  onToggle={isOn => activeSuivie(isOn, user.doc_id)}
								/>
			                </View>
			            </View> 
		              </View>
		            ))}
		            <View style={{ height: 50 }}></View>
		          </>
		        ) :  (
		          <View style={styles.messageBox}>
		            <Text style={styles.messageBoxText}>Aucune nouvelle notification !</Text>
		          </View>
		        )}
	        </ScrollView>
	      </View>
	    </View>
	)
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12
  },
  searchView: {
    display: 'flex',
    flexDirection: 'row',
  },
  inputView: {
    flex: 1,
    height: 40,
    backgroundColor: '#dfe4ea',
    paddingHorizontal: 10,
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 18,
  },
  userCard: {
    backgroundColor: '#fafafa',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: "space-between",
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  userCardRight: {
    paddingHorizontal: 10,
  },
  messageBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBoxText: {
    fontSize: 20,
    fontWeight: '500',
  },
});