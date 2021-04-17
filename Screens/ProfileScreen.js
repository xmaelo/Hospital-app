import React, { useState, useEffect }from 'react';
import { View, StyleSheet, SafeAreaView, Image, Alert, StatusBar, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Input, Button, CheckBox } from 'react-native-elements';
import { ListItem } from 'react-native-elements'
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {AuthService} from '../video/services'; 

const list = [
  {
    title: 'Mes Antécédents Médicaux',
    icon: 'thermometer',
    navigation: "AntecedentsMedical"
  },
  {
    title: "Mes Contacts d'Urgence",
    icon: "user",
    navigation: "ContactUrgence"
  },
  {
    title: "Paramètres",
    icon: "cog",
    navigation: "SettingScreen"
  },
]




const avatar = require('../../assets/imgs/avatar.jpg')
export default function ProfileScreen({navigation}){
  const userId = auth().currentUser.uid;
  let users = database().ref('users/'+userId);
  const [name, setName] = useState("");
  const [profile, setProfile] = useState(null);
  const [taille, setTaille] = useState(null);
  const [poids, setPoids] = useState(null);
  const [date, setDate] = useState(null);

  function onAction(){
    AuthService.logout()
    navigation.navigate("LoginScreen")
  }
  const createTwoButtonAlert = () =>
    Alert.alert(
      "Confirmation",
      "Vous souhaitez vous déconnecter ?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => auth().signOut().then(() => onAction())
        }
      ]
    );

  useEffect(() => {
    (async()  =>{
        users.on('value', (snapshot) => {
            const n = snapshot.val()
            setName(n.nom_complet);
            setProfile(n.profile);
            setPoids(n.poids);
            setTaille(n.taille);
            setDate(n.date);
        }); 
      })()
    }, []);
	return(
		<View style={styles.container}>
	      <View style={styles.container_card_profile}>
	        <View style={styles.container_all_profile}>

	          <View style={[styles.container2, { borderRadius: 50}]}>
		           <Image style={{ width: 100, height: 100}}
                source={profile ? {
                  uri: profile
                }: avatar}  

                width={100} height={100}/>
		        </View>

	          <View style={styles.container_name_lieu}>
	            <Text style={styles.name}>{name}</Text>
	            <Text style={styles.lieu}>Yaoundé, Cameroun</Text>
	          </View>
	        </View>

	        <View style={styles.container_all_details}>
	          <View style={styles.details}>
	            <Text style={styles.title}>Taille</Text>
	            <Text style={styles.number}>{taille ? taille+" m" : "?"}</Text>
	          </View>

	          <View style={styles.details}>
	            <Text style={styles.title}>Poids</Text>
	            <Text style={styles.number}>{poids ? poids+" K.g" : "?"}</Text>
	          </View>
	          <View style={styles.details}>
	            <Text style={styles.title}>Naissance</Text>
	            <Text style={styles.number}>{date ? new Date(date).toISOString().split("T")[0] : "?"}</Text>
	          </View>
	        </View>

            <Button
              icon={
                <Ionicons
                  name="create-outline"
                  size={25}
                  color="black"
                /> 
              }
              onPress={()=>navigation.navigate('EditProfile')}
              type="clear"
              title={" Modifier mon profile"}
            />
	      </View>
	      <View style={{paddingHorizontal: wp("2%"), marginTop: 10}}>
		      {
			    list.map((item, i) => (
			      <ListItem key={i} bottomDivider onPress={()=>navigation.navigate(item.navigation)}>
			        <Icon name={item.icon} size={23}/>
			        <ListItem.Content>
			          <ListItem.Title>{item.title}</ListItem.Title>
			        </ListItem.Content>
			        <ListItem.Chevron />
			      </ListItem>
			    ))
			  }
          <ListItem bottomDivider onPress={createTwoButtonAlert}>
            <Ionicons name={"log-out"} size={23}/>
            <ListItem.Content>
              <ListItem.Title>{"Déconnexion"}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>

    		</View>
    	</View>
	)
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container2: {
  	overflow: "hidden"
  },
  container_all_profile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: hp('3%'),
    paddingTop: hp('2%')
  },
  container_name_lieu: {
    marginLeft: hp('2%')
  },

  name: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: 'black'
  },
  lieu: {
    color: 'black'
  },
  number: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: 'black'
  },
  title: {
    fontSize: hp('2.3%'),
    color: 'black'
  },
  details: {
    flexDirection: 'column',
    justifyContent: 'center'
  },
  container_all_details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: hp('4%')
  },
  container_card_profile: {
    backgroundColor: 'white',
    marginLeft: hp('2%'),
    marginRight: hp('2%'),
    borderRadius: 10,
    height: hp('35%'),
    marginTop: hp('2%'),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,

    elevation: 13,
  },
  logo: {
    width: wp('50%'),
    height: hp('5%')
  },
  startup: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0
  }
});