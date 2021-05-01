import React, { useState, useEffect }from 'react';
import { View, StyleSheet, SafeAreaView, Image, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Linking} from 'react-native'
import { Text, Input, Button, CheckBox } from 'react-native-elements';

// https://coronavirus-19-api.herokuapp.com/countries/cameroon

const img = require('../../assets/imgs/logo.png')
function CovidDashBordScreen ({ navigation }){

    const [password, setPassword] = useState("");
    const [username, defineUsername] = useState("");
    const [coronaState, setCoronaState] = useState({});

    useEffect(() => {
    (async()  =>{
        let res = await fetch('https://coronavirus-19-api.herokuapp.com/countries/cameroon', {"method": "GET"});
      	let json = await res.json();
      	console.log('corono live ====>>>', json)
      	setCoronaState(json);
      })()
    }, []);

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
	                	{
	                    // <Image
	                    //     style={{ width: wp("35%"), height: hp("8%"), borderRadius: 100 }}
	                    //     source={img}
	                    // />
	                    }
	                </View>
	                <View style={styles.container_card_profile}>
				        <View style={styles.centerContent}>

				            <View style={[styles.container2, { borderRadius: 50}]}>
					           <Image style={{ width: 100, height: 100,}} 
					           source={require('../../assets/imgs/covid.jpg')} 
					            width={100} height={100}/>
					        </View>

				          <View style={styles.container_name_lieu}>
				            <Text style={styles.slogan}>La pandémie a Coronavirus</Text>
				          </View>
					        <View style={styles.card2}>
					        	<Text style={{...styles.slogan, fontSize: hp('2.5%'), fontWeight: 'bold',}}>Les données en live</Text>

					        	<View style={styles.container_all_details}>
						          <View style={styles.details}>
						            <Text style={styles.number}>{coronaState.cases}</Text>
						            <Text style={styles.title}>Infectés</Text>
						          </View>

						          <View style={styles.details}>
						            <Text style={styles.number}>{coronaState.recovered}</Text>
						            <Text style={styles.title}>Guéris</Text>
						          </View>
						          <View style={styles.details}>
						            <Text style={styles.number}>{coronaState.deaths}</Text>
						            <Text style={styles.title}>Décèdés</Text>
						          </View>
						        </View>
						        <View style={{marginTop: 14, ...styles.centerContent}} >
						            <Image style={{ width: 40, height: 20,}} 
					           			source={require('../../assets/imgs/patrie.png')} 
					            	/>
				            	</View>
					        </View>
					        <View style={{marginTop: 2}}> 
			                    <Button
			                      onPress={()=>navigation.navigate('JournalCovid')}
			                      type="clear"
			                      title="Mon historique"
			                    />
			                </View> 
				        </View>

				    </View>
			        <View style={{...styles.row, justifyContent: 'space-around',}}>
			        	<View style={{alignItems: "center"}}>
			        		<TouchableOpacity
					        	onPress={()=>navigation.navigate("CheckCovidScreen")}
					        >
				        		<Image style={{ width: 70, height: 70,}} 
				           			source={require('../../assets/imgs/check1.png')} 
				            	/>
				            </TouchableOpacity>
			            	<Text style={styles.slogan}>Check Covid</Text>
			        	</View>
			        	<View style={{alignItems: "center"}}>
			        		<TouchableOpacity
					        	onPress={()=>navigation.navigate("BonAsavoirScreen")}
					        >
				        		<Image style={{ width: 70, height: 70,}} 
				           			source={require('../../assets/imgs/covid1.png')} 
				            	/>
				            </TouchableOpacity>
			            	<Text style={styles.slogan}>Bon à Savoir</Text>
			        	</View>	
			        </View>

			        <View style={{...styles.row, justifyContent: 'space-around',}}>
			        	<View style={{alignItems: "center"}}>
			        		<View>
		        				<TouchableOpacity
		        					onPress={()=>Linking.openURL(`tel:1510`)}
		        				>
					        		<Image style={{ width: 70, height: 70,}} 
					           			source={require('../../assets/imgs/sos1.png')} 
					            	/>
			        			</TouchableOpacity>
					         </View>
				             <View>
			            		<Text style={styles.slogan}>Lancer un Appel</Text>
			            	 </View>
			            		<Text style={styles.slogan}>d'Urgence</Text>
			        	</View>
			        	<View style={{alignItems: "center"}}>
					        <TouchableOpacity
					        	onPress={()=>navigation.navigate("ListCasContact")}
					        >
				        		<Image style={{ width: 70, height: 70,}} 
				           			source={require('../../assets/imgs/net1.png')} 
				            	/>
				            </TouchableOpacity>
				            	<Text style={styles.slogan}>Mes Cas Contact</Text>
				        </View>
			        </View>
            </SafeAreaView>
            <View style={{height: hp("5%")}}>
            	
            </View>
        </ScrollView>
    );
} 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: hp('1%'),
        
        paddingHorizontal: wp("3%"),
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
    height: hp('53.8%'),
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

export default CovidDashBordScreen;



