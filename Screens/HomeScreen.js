import React, { useState, useEffect }from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, SafeAreaView, Image, StatusBar, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';
import { Text, Input, Button, CheckBox } from 'react-native-elements';
import Carousel from 'react-native-snap-carousel'; 
import database from '@react-native-firebase/database';
import ConnectyCube from 'react-native-connectycube';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import { Neomorph } from 'react-native-neomorph-shadows';
import { Shadow } from 'react-native-neomorph-shadows';
import {AuthService} from '../video/services'; 
import {users} from '../video/config';
import Init from '../video/Init';

 const img = require('../../assets/imgs/logo.png')
 const back = require('../../assets/imgs/b.jpg')


const carouselItems = [
  {
      title:"Covid 19",
      text: "éviter les embrassades, les poignées de main et les accolades. Une distance physique d'un ou deux mètres entre soi et quelqu'un d'autre",
  },
  {
      title:"Covid 19",
      text: "éviter les réunions de famille ou les rassemblements privés, surtout quand ils concernent aussi des personnes âgées ou fragiles",
  },
  {
      title:"Covid 19",
      text: "se laver les mains régulièrement (au gel hydroalcoolique ou au savon et à l'eau), surtout lorsqu'on fréquente un endroit public ou avoir avoir touché son masque",
  },
  {
      title:"Covid 19",
      text: "le respect du port du masque à chaque fois que cela est obligatoire (lieu public clos, transport en commun, espace de travail partagé, ...) ",
  },
  {
      title:"Diabète",
      text: "Prenez trois repas équilibrés par jour et, au besoin, des collations. Évitez de sauter des repas.",
  },
  {
    title: "Diabète",
    text: "Ayez un horaire de repas régulier. Ceux-ci devraient être espacés d’environ 4 à 6 heures. Les collations devraient être prises de 2 à 3 heures après le repas, s’il y a lieu"
  },
  {
    title: "Diabète",
    text: "Mangez une variété d’aliments provenant des différents groupes alimentaires : légumes et fruits, féculents, lait et substituts, viandes et substituts. "
  },
  {
    title: "Diabète",
    text: "Choisissez des aliments riches en fibres alimentaires : légumes et fruits, produits céréaliers à grains entiers, légumineuses, noix et graines, etc."
  },
  {
    title: "Diabète",
    text: "Composez votre repas selon le modèle de l’assiette équilibrée."
  },
  {
    title: "Diabète",
    text: "Privilégiez l’eau pour vous hydrater plutôt que les jus de fruits et les boissons sucrées."
  },
  {
    title: "Diabète",
    text: "Si vous consommez de l’alcool, faites-le de préférence en mangeant et respectez les quantités recommandées."
  }
]

const reference = database().ref('users');

function _renderItem({item,index}){
    return (
      <View 
        key={index}
        style={{
          backgroundColor:'floralwhite',
          borderRadius: 5,
          height: hp('30%'),
          padding: 10,
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 20}}>{item.title}</Text>
        <View style={{alignItems: "center"}} >
          <Text>{item.text}</Text>
        </View>
      </View>

    )
}

  function Logo({nom_complet}){
    console.log('lohgooddod)=============>')

    return(
       <View style={{flexDirection: 'row',  alignItems: 'center'}}>  
          <Image
              style={{ width: 90, height: 45 }}
              source={img}
          />
            <Text style={{
              marginLeft: 12, 
              marginTop: -10,
              color: "#5F666D",
              fontSize: 17
            }}>
              Bonjour {nom_complet} !
            </Text>
      </View>
    )
  }


export default function HomeScreen(props){
    //const [ca, setCal] = useState(null);
  useEffect(() => {
    (async()  =>{ 
      const user = await auth().currentUser
      let users = database().ref('users/'+user.uid);
      users.once('value', snatchot =>{
        let callId = snatchot.val().callId;
        //setCal(callId)
        AuthService.check({id: callId, email: user.email, password: user.email, login: user.email, idU: user.uid});
      })
    })();
  }, []);

 
	const [search, updateSearch] = useState("");
    const [carousel, setCarousel] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [nom_complet, setName] = useState("");

	return(
    <ScrollView> 
      <SafeAreaView style={{...styles.main}}>
      		<StatusBar style="auto" backgroundColor="white" />
      		<View style={styles.container}>
      				<View style={styles.imgBloc}>
                  <Text style={{...styles.slogan, fontSize: 20, fontWeight: "bold"}}>Notifications</Text>
              </View>
              <View style={styles.notif}>  
                  <View>
                      <Carousel
                        layout={"stack"}
                        ref={ref => setCarousel(ref)}
                        data={carouselItems}
                        sliderWidth={300}
                        layoutCardOffset={25}
                        itemWidth={300}
                        //loop={false}
                        autoplay={true}
                        enableMomentum ={false}
                        lockScrollWhileSnapping ={true}
                        autoplayInterval={5000}
                        autoplayDelay={1000}
                        renderItem={_renderItem}
                        onSnapToItem = { index => setActiveIndex(index) } 
                      />
                  </View>
              </View>
              <View style={{height: hp('12%')}}/>  
              <View style={styles.card}>
                <ImageBackground source={back} style={styles.image}>
                  <View style={{alignItems: "center"}} >
                    <Text style={{marginTop: hp('10%'), ...styles.slogan, fontWeight: "bold", color: "white"}}>
                      Hi! Nice to see you again
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      <View style={styles.cardContent}>
                        <TouchableOpacity
                          onPress={()=>props.navigation.navigate("SymtomeScreen")}
                        >
                          <Neomorph
                              swapShadows
                              style={
                                  {
                                  ...styles.menuIcons,
                                      width: wp("43%"),
                                      borderRadius: 18,
                                      height: hp('15%'),

                                  }}
                          >   
                            <Icon color="white" name="stethoscope" size={30} style={{marginTop: -hp("1%")}}/>
                            
                            <Text style={{...styles.colorText, fontWeight: 'bold', fontSize: 14 }}>Analyse Symptomes</Text>

                          </Neomorph>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.cardContent}>
                        <TouchableOpacity
                          onPress={()=>props.navigation.navigate("DashbordScreen")}
                        >
                          <Neomorph
                              swapShadows
                              style={
                                  {
                                  ...styles.menuIcons,
                                      width: wp("43%"),
                                      borderRadius: 18,
                                      height: hp('15%'),

                                  }}
                          >   
                            <Icon color="white" name="user-md" size={40} style={{marginTop: -hp("1%")}}/>
                            
                            <Text style={{...styles.colorText, fontWeight: 'bold', fontSize: 14 }}>Mon suivi Médical</Text>

                          </Neomorph>
                        </TouchableOpacity>
                      </View>
	                </View>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
	                    <View style={styles.cardContent2}>
                        <TouchableOpacity
                          onPress={()=>props.navigation.navigate("SearchDoctorScreen")}
                        >
                          <Neomorph
                              swapShadows
                              style={
                                  {
                                  ...styles.menuIcons,
                                      width: wp("43%"),
                                      borderRadius: 18,
                                      height: hp('15%'),

                                  }}
                          >   
                            <Ionicons color="white" name="search" size={35} style={{marginTop: -hp("1%")}}/>
                            <View style={{alignItems: "center", justifyContent: "center"}}>
                              <Text  style={{...styles.colorText, fontWeight: 'bold', fontSize: 14 }}>Recherche</Text>
                            </View>
                          </Neomorph>
                        </TouchableOpacity>
                      </View>


                      <View style={styles.cardContent2}>
                        <TouchableOpacity
                          onPress={()=>props.navigation.navigate("RendezVousScreen")}
                        >
                          <Neomorph
                              swapShadows
                              style={
                                  {
                                  ...styles.menuIcons,
                                      width: wp("43%"),
                                      borderRadius: 18,
                                      height: hp('15%'),

                                  }}
                          >   
                            <Ionicons color="white" name="calendar" size={40} style={{marginTop: -hp("1%")}}/>
                            
                            <Text style={{...styles.colorText, fontWeight: 'bold', fontSize: 14 }}>Mes rendez-vous</Text>

                          </Neomorph>
                        </TouchableOpacity>
                      </View>
	                </View>
                </ImageBackground>
              </View>
              <Init navigation={props.navigation}/>
      		</View>
  		</SafeAreaView>
    </ScrollView> 
	)
}


const styles = StyleSheet.create({
    main: {
       flex: 1,
       backgroundColor: "white"
    },
    container: {
        paddingTop: hp('4%'),
        paddingHorizontal: wp("6%")
    },
    image: {
      resizeMode: "cover",
      justifyContent: "center"
    },
    colorText: {
      color: "white"
    },
    menuIcons: {
        height: 50,
        width: 50,
        backgroundColor: "#009bd9",
        shadowRadius: 10,
        borderRadius: 23,
        marginRight: 10,
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center'


    },
    cardContent: {
    	borderColor: "white",
    	// borderWidth: 2,
    	borderStyle: "solid",
    	width: wp("48%"),
    	height: hp('17%'),
    	borderRadius: 5,
    	justifyContent: 'center',
        alignItems: 'center',
    },
    cardContent2: {
    	borderColor: "white",
    	// borderWidth: 2,
    	borderStyle: "solid",
    	width: wp("48%"),
    	height: hp('17%'),
    	borderRadius: 5,
    	justifyContent: 'center',
        alignItems: 'center',
    },
    cardContentSub: {
    	backgroundColor: "#D9DADF",
    	width: wp("46%"),
    	height: hp('15.6%'),
    	justifyContent: 'center',
        alignItems: 'center',
    },
    imgBloc: {
        marginTop: -hp('2%'),
        justifyContent: 'center',
        alignItems: "center",
        paddingBottom: 23
    },
    notif: {
        marginTop: hp("0%"),
        height: hp("17%"),
        // paddingBottom: 150
    },
    card: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -hp('6%')
    },
    slogan: {
        color: "#5F666D",
        fontSize: hp("2.3%")

    },
})
