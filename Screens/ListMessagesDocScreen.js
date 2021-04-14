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



 
export default function ListMessagesDocScreen({navigation, route}){
  const [messages, setMessages] = useState({});
  const docId = auth().currentUser.uid;
  useEffect(() => {  
        (async()  =>{
          let chats = database().ref('messages/'+docId);
          let us = {};
            chats.on('value', (snapshot) => {
              if(snapshot.val()){
                let mes = Object.values(snapshot.val()).map((value, key)=>{
                  let lastmessage = Object.values(value)[0]

                  let user = database().ref('users/'+lastmessage.userId);

                  
                  user.on('value', (snapshot2) => {

                    let casex = {[lastmessage.userId]: {...snapshot2.val(), ...lastmessage}}
                    us = {...us, ...casex};
                    setMessages(us);
                  })
                })
              }
            });
          })();
      }, []);

	return(
		<ScrollView style={{...styles.container, paddingBottom: 35}}>
			<View style={{ paddingTop: 20}}>
				<View>
					{
					    Object.values(messages).sort((a, b)=>b.createdAt - a.createdAt).map((item, i) => ( 
					    	<TouchableOpacity
					    	 key={i}
					    	 onPress={()=>navigation.navigate("ChatScreen", {userId: item.userId})}
					    	>
						      <ListItem>
						        <Image
						            style={styles.userProfileImage}
						            source={item.profile ? {
                          uri: item.profile
                        }: require('../../assets/imgs/doc.jpg')} 
						          />
						        <ListItem.Content>
						          <ListItem.Title>{item.nom_complet}</ListItem.Title>
						          <ListItem.Subtitle>{item.message}</ListItem.Subtitle>
						        </ListItem.Content> 
						        <View style={styles.row}>
						        	<Badge value={ 3} status="primary" />
						        	<Ionicons
						        		name="chevron-forward"
						        		size={20}
						        		color="#4765C3"
						        	/>
						        </View>
						      </ListItem>
						    </TouchableOpacity>
					    ))
					 }
				</View>
			</View>
		</ScrollView>
	)
}



const styles = StyleSheet.create({
	label: {
		color: "#1A1E23",
        fontSize: hp("2.5%")
	},
	value: {
		color: "#5F666D",
        fontSize: hp("2%"),
        paddingBottom: hp('1%')
	},
    container: {
        flex: 1,
        backgroundColor: "white",
        // paddingHorizontal: wp("2%"),
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
    color: 'white'
  },
  lieu: {
    color: 'white'
  },
  number: {
    fontSize: hp('2.5%'),
    fontWeight: 'bold',
    color: 'black'
  },
    center: {
    	alignItems: "center",
    	justifyContent: "center"
    },
    userProfileImage: { height: 52, width: 52, aspectRatio: 1, borderRadius: 100 },
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
	    // borderRadius: 10,
	    marginTop: hp('2%'),
	    shadowColor: "#000",
	    shadowOffset: {
	      width: 0,
	      height: 6,
	    },
	    shadowOpacity: 0.39,
	    shadowRadius: 8.30,

	    // elevation: 3,
	    paddingBottom: 14
	},
    imgBloc: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    slogan: {
        color: "#5F666D",
        fontSize: hp("1.7%")

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

