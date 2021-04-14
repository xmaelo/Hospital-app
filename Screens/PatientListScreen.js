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
import { Icon } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { showMessage, hideMessage } from "react-native-flash-message";
 
export default function PatientListScreen(props){
	const [searchText, setSearchText] = useState('');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const docId = auth().currentUser.uid;

    useEffect(() => {
	    (async()  =>{
	      let users = database().ref('users').orderByChild('is_doctor').equalTo(null);
	      let tab = [];
	      users.once('value', (snapshot) => {
				for (const [key, value] of Object.entries(snapshot.val())) {
			    	tab.push({...value, key: key})
				}

				tab.sort((x, y)=> y.createdAt - x.createdAt)

				console.log('tabb tab', tab)
				setUsers(tab);
				setFilteredUsers(tab);
			});
	    })();
	  }, []);

    function onSendDemande(patient){
    	try{
    		const message = {
                message: "Info !",
                description: "La demande a été envoyer a ce patient !",
                icon: { icon: "auto", position: "left" },
                type: 'info',
                onPress: () => {
                  hideMessage();
                },
            }; 

            showMessage(message);

			let mespatients = database().ref('users/'+patient.key+"/demandes");
			mespatients.set({[docId]: false})
			// let search = database().ref('users/'+patient.key+"/demandes").orderByChild('docId').startAt(docId);
			// search.once('value', snapshot =>{
			// 	if(!snapshot.val()){
			// 	}
			// })
            return;
    	}catch(e){
    		console.log('error user request', e)
    	}
    }

	return(
		<View style={{ flex: 1, paddingTop: 10 }}>
	      <View style={styles.container}>
	        <View style={styles.searchView}>
	          <View style={styles.inputView}>
	            <TextInput
	              defaultValue={searchText}
	              style={styles.input}
	              placeholder='Search'
	              textContentType='name'
	              onChangeText={(text) => {
	                setSearchText(text);
	                if (text.trim() !== '') {
	                  //return setFilteredUsers([]);
		                const filtered_users = users.filter((user) =>
		                  user.nom_complet.toLowerCase().startsWith(text.toLowerCase())
		                );
		                setFilteredUsers(filtered_users);
	                }else{
		                setFilteredUsers(users);
	                }
	              }}
	              returnKeyType='search'
	            />
	            {searchText.length === 0 ? (
	              <TouchableOpacity>
	                <Icon name='search' size={24} color='#333' />
	              </TouchableOpacity>
	            ) : (
	              <TouchableOpacity
	                onPress={() => {
	                  setSearchText('');
	                  setFilteredUsers(users);
	                }}
	              >
	                <Icon name='cancel' size={24} color='#333' />
	              </TouchableOpacity>
	            )}
	          </View>
	        </View>
	        {filteredUsers.length > 0 ? (
	          <ScrollView>
	            {filteredUsers.map((user, key) => (
	              <View key={key} style={styles.userCard}>
		              <TouchableOpacity
		                onPress={() => {
		                	props.navigation.navigate('PatientDataScreen',{userId: user.key});
		                }}//
		              >
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
			                  >{user.nom_complet}</Text>
			                  <Text  style={{color: "#5F666D", fontSize: 15}}>{user.phone}</Text>
			                  <Text style={{color: "#5F666D", fontSize: 13}}>Last update: 20/03/2021</Text>
			                </View>
			            </View>
	              	</TouchableOpacity>
	                <View>
		                <View style={{flexDirection: "row"}} >
		                	<TouchableOpacity
				                onPress={() => {
				                	onSendDemande(user)
				                }}
				            >
		                		<Ionicons name="person-add-outline" size={20} color="#4793CC"/>
		                	</TouchableOpacity>
		                	<Ionicons name="call-outline" size={20} color="#4793CC" style={{paddingHorizontal: 20}} />
		                	<TouchableOpacity
				                onPress={() => {
				                	props.navigation.navigate('ChatScreen',{userId: user.key});
				                }}
				            >
		                		<Ionicons name="chatbubble-outline" size={20} color="#4793CC"/>
		                	</TouchableOpacity>
		                </View>
		            </View>
	              </View>
	            ))}
	            <View style={{ height: 50 }}></View>
	          </ScrollView>
	        ) : searchText.length > 0 ? (
	          <View style={styles.messageBox}>
	            <Text style={styles.messageBoxText}>No user found</Text>
	          </View>
	        ) : (
	          <View style={styles.messageBox}>
	            <Text style={styles.messageBoxText}>Search for users</Text>
	          </View>
	        )}
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