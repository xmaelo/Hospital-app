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
import { useFocusEffect } from '@react-navigation/native';
import database from '@react-native-firebase/database';


export default function ResultatExamenScreen({navigation, route}){
	const [resultats, setResultas] = useState([])
	useFocusEffect(
	    React.useCallback(() => {
			let tab = [];
			setResultas([])
			async function get() {
				console.log('get start here');
				const userId =  route.params.userId;
				let covid = database().ref('resultats/'+userId);

				covid.once('value', (snapshot) => {
					if(snapshot.val()){
						for (const [key, value] of Object.entries(snapshot.val())) {
					    	tab.push({...value, key: key})
						}
						console.log('tabb tab', tab)
						setResultas(tab);
					}
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
              title: "Resultats Examens",
              headerRight: () => (
                <TouchableOpacity 
                  onPress={() => navigation.navigate('AddResultat', {userId: route.params?.userId})}
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
		<ScrollView>
			{resultats.map((item, i) => (
		      <ListItem key={i} bottomDivider onPress={()=>navigation.navigate("AddResultat", {key: item.key, userId: route.params.userId})}>
		        <Ionicons
			      name='document-text-outline'
			      size={24}
			      color='black'
			    />
		        <ListItem.Content>
		          <ListItem.Title>{item.name}</ListItem.Title>
		          	<View style={{paddingRight: wp('6%')}}>
		          		<Text style={{color: "#626365"}}>{item.description}</Text>
		          		{item.date&&<Text style={{color: "#626365"}}>{'Date: '+item.date+''}</Text>}
		          	</View>
		        </ListItem.Content>
		        <ListItem.Chevron />
		      </ListItem>
		    ))
		  }
		</ScrollView>
	)
}