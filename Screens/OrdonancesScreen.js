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

const list = [
  {
    name: 'Amy Farha',
    subtitle: 'Vice President'
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  }
]

export default function OrdonancesScreen({navigation, route}){
	const [ordonnances, setOrdonnances] = useState([])

	useFocusEffect(
	    React.useCallback(() => {
			let tab = [];
			setOrdonnances([])
			async function get() {
				console.log('get start here');
				const userId =  route.params.userId;
				let covid = database().ref('ordonnances/'+userId);

				covid.once('value', (snapshot) => {
					if(snapshot.val()){
						for (const [key, value] of Object.entries(snapshot.val())) {
					    	tab.push({...value, key: key})
						}
						console.log('tabb tab', tab)
						setOrdonnances(tab);
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
              title: "Ordonnance du patient",
              headerRight: () => (
                <TouchableOpacity 
                  onPress={() => navigation.navigate('AddOrdonnace', {userId: route.params?.userId})}
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
			{ordonnances.map((item, i) => (
		      <ListItem key={i} bottomDivider onPress={()=>navigation.navigate("AddOrdonnace", {key: item.key, userId: route.params.userId})}>
		        <Ionicons
			      name='document-text-outline'
			      size={24}
			      color='black'
			    />
		        <ListItem.Content>
		          <ListItem.Title>{item.title}</ListItem.Title>
		          	<View style={{paddingRight: wp('6%')}}>
		          		<Text style={{color: "#626365"}}>{item.subtitle}</Text>
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