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

const labels = [
	"Premier trimestre",
	"Deuxieme trimestre",
	"Troisième trimestre",
	"Sac d'hopital",
	"Ramenez le bébé à la maison"

	]

 
export default function ToDOScreen({navigation, route}){
  const [cliked, setCliked] = useState(null);
  useEffect(() => {  
        (async()  =>{
        	//
          })();
      }, []);

  return(
    <ScrollView style={{...styles.container, paddingBottom: 35}}>
      <View style={{ paddingTop: 20}}>
        <View>
          {
              labels.map((item, i) => (

                  <ListItem bottomDivider key={i}>
                    <ListItem.Content>
                      <ListItem.Title>
                      	<View
                      		style={{alignItems: "center", justifyContent: "center", ...styles.row}}
                      	>
	                      	<TouchableOpacity
			                 key={i}
			                 onPress={()=>cliked!==i? setCliked(i): setCliked(null)}
			                >
		                      <Ionicons
		                        name={cliked!==i?"chevron-down-circle-outline": "chevron-up-circle-outline"}
		                        size={30}
		                        color="#4765C3"
		                      />
	                		</TouchableOpacity>

	                      	<Text style={{fontSize: 18}}>{" "+item}</Text>
	                    </View>
                      </ListItem.Title>
                        {cliked===i&&
	                      <ListItem.Subtitle style={{...styles.row, marginTop: 10}}>
			                      <Ionicons
			                        name={"checkmark-done"}
			                        size={20}
			                        color="#4765C3"
			                      /> 
		                      	<Text>
		                      		{item}{item}{item}
		                      	</Text>
	                      </ListItem.Subtitle>
	                    }
                    </ListItem.Content> 
                  </ListItem>
              ))
           }
        </View>
      </View>
    </ScrollView>
  )
}


const Item1 = () => <View style={{flexDirection: "row"}}>
                      		<Ionicons
		                        name={"checkmark-done"}
		                        size={27}
		                        color="#4765C3"
		                      />
		                      <Text>
		                      	Dites aurevoir au mauvaises habitudes(fuler, alcool, grande quantité de caféine)
		                      </Text>
                      	</View>
const items = {
	1: ()=><Item1/>
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

