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

const lists = [
  {
    title: 'Medical/Family History',
    icon: 'history'
  },
  {
    title: 'Antécédents Médicaux',
    icon: 'folder-outline',
    no: true,
    nav: "AntecedentsMedical"
  },
  { 
    title: 'Visualisation des signes vitaux',
    icon: 'heart-outline',
    nav: "DashPatScreen",
    no: true
  },
  {
    title: 'Notification Médical',
    icon: 'notifications-outline',
    no: true
  },
  {
    title: 'Ordonance Médicales',
    icon: 'medkit-outline',
    nav: "OrdonancesScreen",
    no: true
  },{
    title: 'Rendez-vous programmé',
    icon: 'time-outline',
    nav: "RendezVousScreen",
    no: true
  },{
    title: "Résultats d'examen",
    icon: 'document-text-outline',
    nav: "ResultatExamenScreen",
    no: true
  },
  {
    title: "Facturation",
    icon: 'cash-outline',
    no: true
  },
]


export default function PatientDataScreen({navigation, route}){

    const [user, setUser] = useState({});
    const [antecedents, setAntedent] = useState({});
    const [list, setList] = useState(lists);

    useEffect(() => {
	    (async()  =>{
	      let user = database().ref('users/'+route.params.userId);
	      let antecedents = database().ref('antecedents/'+route.params.userId);
	      user.once('value', (snapshot) => {
				setUser(snapshot.val());
			});
	      antecedents.once('value', (snapshot) => {
				setAntedent(snapshot.val());
			    lists[1].length = Object.entries(snapshot.val()).length
			    setList(lists);
			});
	    })();
	}, []);

	return(
		<ScrollView style={{...styles.container, paddingBottom: 35}}>
			<View style={{
				...styles.container_card_profile, 
				backgroundColor: "#4D9BBE", 
				marginTop: 50, 
				paddingTop: 15, 
				justifyContent: "center",
				paddingBottom: 40,
			}}>
				<View style={styles.container_all_profile}>

		          <View style={[styles.container2, { borderRadius: 50}]}>
			           <Image style={{ width: 80, height: 80,}} 
			           source={user.profile ? {
		           			uri: user.profile
		                }: require('../../assets/imgs/doc.jpg')}

			            width={100} height={100}/>
			        </View>

		          <View style={styles.container_name_lieu}>
		            <Text style={styles.name}>{user.nom_complet}</Text>
		            <Text style={styles.lieu}>Yaoundé, Cameroun</Text>
		          </View>
		        </View>
			</View>
			<View
				style={{paddingHorizontal: wp('2%')}}
			>

				<View style={{
					...styles.container_card_profile,
					marginTop: -30, 
					paddingTop: 15, 
					justifyContent: "center",
					borderRadius: 10,
					elevation: 10,
				}}>
					<View style={{
						...styles.row, 
						justifyContent: 'space-around',
						alignItems: "center"
					}}>
						<View
							style={{alignItems: "center"}}
						>
							<Ionicons
								name="time"
								size={25}
								color="#4D9BBE"
							/>
							<Text style={styles.slogan}>Schedule</Text>
						</View>
						<View
							style={{alignItems: "center"}}
						>
							<Ionicons
								name="call"
								size={25}
								color="#4D9BBE"
							/>
							<Text style={styles.slogan}>Call</Text>
						</View>
						<View
							style={{alignItems: "center"}}
						>
							<Ionicons
								name="chatbubble"
								size={25}
								color="#4D9BBE"
							/>
							<Text style={styles.slogan}>Text</Text>
						</View>
						<View
							style={{alignItems: "center"}}
						>
							<Ionicons
								name="document"
								size={25}
								color="#4D9BBE"
							/>
							<Text style={styles.slogan}>Download</Text>
						</View>
						<View
							style={{alignItems: "center"}}
						>
							<Ionicons
								name="logo-whatsapp"
								size={25}
								color="#4D9BBE"
							/>
							<Text style={styles.slogan}>Whatsapp</Text>
						</View>
			        </View>
				</View>
			</View>
			<View style={{paddingHorizontal: wp('6%'), marginTop: 27}}>
				<View>
					<Text style={styles.label}>
						Email
					</Text>
					<Text style={styles.value}>
						{user.email}
					</Text>
				</View>
				<View>
					<Text style={styles.label}>
						Address
					</Text>
					<Text style={styles.value}>
						No address availlable
					</Text>
				</View>

				<View style={{...styles.row}}>
					<View style={{width: wp('55%')}}>
						<View>
						  <Text style={styles.label}>
						  	Téléphone
						  </Text>
						  <Text style={styles.value}>
						  	{user.phone}
						  </Text>
						</View>
						<View>
						  <Text style={styles.label}>
						  	Birthdate
						  </Text>
						  <Text style={styles.value}>
						  	{user.date}
						  </Text>
						</View>
						<View>
						  <Text style={styles.label}>
						  	Blood Type
						  </Text>
						  <Text style={styles.value}>
						  	N/A
						  </Text>
						</View>
						<View>
						  <Text style={styles.label}>
						  	Note
						  </Text>
						  <Text style={styles.value}>
						  	Aucune note disponible
						  </Text>
						</View>
						<View>
						  <Text style={styles.label}>
						  	Date d'inscription
						  </Text>
						  <Text style={styles.value}>
						   Jan 45, 2000 à 25h 32
						  </Text>
						</View>
					</View>

					<View>
						<View>
						  <Text style={styles.label}>
						  	Gender
						  </Text>
						  <Text style={styles.value}>
						  	{user.sexe}
						  </Text>
						</View>
						<View>
						  <Text style={styles.label}>
						  	Age
						  </Text>
						  <Text style={styles.value}>
						  	43
						  </Text>
						</View>
						<View>
						  <Text style={styles.label}>
						  	Insurance
						  </Text>
						  <Text style={styles.value}>
						  	N/A
						  </Text>
						</View>
					</View>
				</View>
			</View>

			<View style={{paddingHorizontal: wp('6%'), marginTop: 20}}>
				<View>
				  {
				    list.map((item, i) => (
				    	<TouchableOpacity
				    	 key={i}
				    	 onPress={()=>item.nav ? navigation.navigate(item.nav, {userId: route.params.userId}) : null}
				    	>
					      <ListItem  bottomDivider>
					        {!item.no ?
					        	<Icon name={item.icon} /> :
					        	<Ionicons name={item.icon} size={23} />
					        }	
					        <ListItem.Content>
					          <ListItem.Title>{item.title}</ListItem.Title>
					        </ListItem.Content>
					        <View style={styles.row}>
					        	<Badge value={item.length || 3} status="primary" />
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
        // backgroundColor: "white",
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