import React, { useState }from 'react';
import { View, StyleSheet, SafeAreaView, Image, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Input, Button, CheckBox, ListItem } from 'react-native-elements';


const list = [
  {
    name: 'Amy Farha',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President'
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },
  {
    name: 'Chris Jackson',
    avatar_url: 'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman'
  },
]

const img = require('../../assets/imgs/logo.png')

function CasContactScreen ({ navigation }){
	const [password, setPassword] = useState("");
    const [username, defineUsername] = useState("");

    const pressed = (text) =>{
        console.log('Text pressed');
    }
    const handlePress = () =>{
        console.log('Pressed')
    }
    const [pinSecure, setPinSecure] = useState(false);
    return(
        <ScrollView style={styles.container}>
        	<StatusBar style="auto" backgroundColor="white" />
            <SafeAreaView>
	                <View style={styles.imgBloc}>
	                    <Image
	                        style={{ width: wp("35%"), height: hp("8%"), borderRadius: 100 }}
	                        source={img}
	                    />
	                    <Text style={styles.slogan}>Mes Cas Contacts</Text>
	                    <Text style={{...styles.slogan, marginTop: hp('2%'), fontWeight: "bold", fontSize: hp("2.5%")}}>
	                		Les drniers 14 jours
	                	</Text>
	                </View>
	                <View>
	                	<View>
						  {
						    list.map((l, i) => (
						    	<View style={{marginTop: hp('1%')}} key={i}>
							      <ListItem
							      containerStyle={{backgroundColor: "#F0F0F0"}}
							      >
							      	<Icon
								      name='address-card'
								      size={24}
								      color='black'
								    />
							        <ListItem.Content>
							          <ListItem.Title>{l.name}</ListItem.Title>
							          <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
							        </ListItem.Content>
							        <Icon
								      name='info'
								      size={24}
								      color='black'
								    />
							      </ListItem>
							    </View>
						    ))
						  }
						</View>
	                </View>

	                <View style={{...styles.imgBloc, marginTop: hp("3%")}}>
	                    <Text style={{...styles.slogan, marginTop: hp('2%'), fontWeight: "bold", fontSize: hp("2.5%")}}>
	                		Mes dernieres position
	                	</Text>
	                </View>

	                <View>
						  {
						    list.map((l, i) => (
						    	<View style={{marginTop: hp('1%')}} key={i}>
							      <ListItem
							      containerStyle={{backgroundColor: "#F0F0F0"}}
							      >
							      	<Ionicons
								      name='locate'
								      size={22}
								      color='black'
								    />
							        <ListItem.Content>
							          <ListItem.Title>{l.name}</ListItem.Title>
							          <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
							        </ListItem.Content>
							        <Icon
								      name='info'
								      size={22}
								      color='black'
								    />
							      </ListItem>
							    </View>
						    ))
						  }
						</View>
	        </SafeAreaView>
	        <View style={{height: hp("5%")}}></View>
		</ScrollView>
    );
} 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: wp("3%"),
    },
    card: {

    },
    imgBloc: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    slogan: {
        color: "#5F666D",
        fontSize: hp("2.3%")

    }, 
    row: {
	    flexDirection: 'row',
	    marginTop: hp('4%')
	  },
    card2: {
    	width: wp("70%"),
    	padding: wp('5%'),
    	borderWidth: 1,
    	borderColor: "#5F666D",
    	borderStyle: "solid",
    	marginTop: hp('4%')
    },
    centerContent: {
    	justifyContent: 'center', 
    	alignItems: 'center'
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
    details: {
	    flexDirection: 'column',
	    justifyContent: 'center',
	    alignItems: "center"
	  },
	  container_all_details: {
	    flexDirection: 'row',
	    justifyContent: 'space-between',
	    marginTop: hp('4%')
	  },
  container_card_profile: {
    backgroundColor: 'white',
    marginLeft: hp('1%'),
    marginRight: hp('1%'),
    borderRadius: 10,
    height: hp('50%'),
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
})

export default CasContactScreen;