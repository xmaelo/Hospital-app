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

const list = [
  {
    name: 'Amy Farha',
    subtitle: 'Bastos le 22/03/2021'
  },
  {
    name: 'Chris Jackson',
    subtitle: 'Yaoundé le 22/03/2021'
  }
]


export default function ContactUrgence({navigation}){
	const [urgences, setUrgence] = useState([])
	useFocusEffect(
	    React.useCallback(() => {
			let tab = [];
			setUrgence([])
			async function get() {
				console.log('get start here');
				const userId =  auth().currentUser.uid;
				let urgencs = database().ref('contactUrgence/'+userId);

				urgencs.once('value', (snapshot) => {
					for (const [key, value] of Object.entries(snapshot.val())) {
				    	tab.push({...value, key: key})
					}
					console.log('tabb tab', tab)
					setUrgence(tab);
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
              title: "Mes contacts d'urgence",
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('AddcontactUrgence')}
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
		    urgences.map((item, i) => (
		      <ListItem key={i} bottomDivider onPress={()=>navigation.navigate("AddcontactUrgence", {key: item.key})}>
		        <Ionicons
			      name='person-outline'
			      size={24}
			      color='black'
			    />
		        <ListItem.Content>
		          <ListItem.Title>{item.nom}</ListItem.Title>
		          <ListItem.Subtitle>{item.phone}</ListItem.Subtitle>
		        </ListItem.Content>
		        <ListItem.Chevron />
		      </ListItem>
		    ))
		  }

		</View>
	)
}