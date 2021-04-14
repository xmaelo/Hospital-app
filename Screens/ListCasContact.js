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


export default function ListCasContact({navigation}){
	const [cascontacts, setCascontact] = useState([])
	useFocusEffect(
	    React.useCallback(() => {
			let tab = [];
			setCascontact([])
			async function get() {
				console.log('get start here');
				const userId =  auth().currentUser.uid;
				let covid = database().ref('cascontact/'+userId);

				covid.once('value', (snapshot) => {
					for (const [key, value] of Object.entries(snapshot.val())) {
				    	tab.push({...value, key: key})
					}
					console.log('tabb tab', tab)
					setCascontact(tab);
				});	
		    }
		     get();
		    return;
		  }, []
		),
	);
	React.useLayoutEffect(() => {

	    navigation.setOptions({
	          headerTransparent: false,  
              title: "Liste de contacts",
              headerRight: () => (
                <TouchableOpacity 
                  onPress={() => navigation.navigate('AddCasContact')}
                  style={{flexDirection: "row"}}
                >
                  <Ionicons
                    name='add-circle-outline'
                    size={30}
                    color='blue'
                  />
                  <Text>{"    "}</Text>
                </TouchableOpacity>
              ),
	    });
	  }, [navigation]);

	return(
		<View style={{paddingHorizontal: wp("3%"), marginTop: 10}}>
	      {
		    cascontacts.map((item, i) => (
		      <ListItem key={i} bottomDivider onPress={()=>navigation.navigate("AddCasContact", {key: item.key})}>
		        <Ionicons
			      name='person-outline'
			      size={24}
			      color='black'
			    />
		        <ListItem.Content>
		          <ListItem.Title>{item.nom}</ListItem.Title>
		          <ListItem.Subtitle>{item.phone+' ('+item.mail+')'}</ListItem.Subtitle>
		        </ListItem.Content>
		        <ListItem.Chevron />
		      </ListItem>
		    ))
		  }

		</View>
	)
}