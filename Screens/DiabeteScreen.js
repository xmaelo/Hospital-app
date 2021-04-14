import React, { useState }from 'react';
import { View, StyleSheet, Picker, SafeAreaView, Image, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';
import { Text, Input, Button, CheckBox, ButtonGroup } from 'react-native-elements';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth'; 
import { useFocusEffect } from '@react-navigation/native';

export default function DiabeteScreen(props){
	const [diabete, setDiabete] = useState({});
	useFocusEffect(
	    React.useCallback(() => {
			async function get() {
				const userId =  auth().currentUser.uid;
				let mesure = database().ref('mesures/'+userId).limitToLast(1);
				mesure.on('value', (snapshot) => {
					if(snapshot && snapshot.val()){
						for (const [key, value] of Object.entries(snapshot.val())) {
							setDiabete({...value});
						}
						console.log('value===========ddh====>', diabete);
					}
				});	
		    }
		    get();
		    return;
		  }, []
		)
	);
	return(
		<View style={styles.main}>
			<ScrollView style={styles.container}>
				<View>
					<View style={{...styles.row, justifyContent: "space-around", marginTop: hp('1%')}}>
						<View style={{width: "70%", paddingLeft: wp("10%")}}>
							<Text style={styles.slogan}>DERNIER CONTRÔLE N/A</Text>
						</View>
						<View style={{width: wp("20%"), marginTop: -hp(".5%")}}>
						    <Ionicons
						      name='chevron-forward-outline'
						      size={24}
						      color='green'
						    />
						</View>
					</View>
				</View>
				<View>
					<View style={{...styles.row, justifyContent: "space-around", marginTop: hp('3%'), ...styles.center2}}>
						<View style={styles.center}>
							<View style={{...styles.rounded, ...styles.col, ...styles.center}}>
								<View></View>
								<View >
									{!diabete['glycemie'] ?
										<Ionicons
									      name='remove-outline'
									      size={19}
									      color='white'
									    /> :
									    <Text style={styles.minime}>{diabete.glycemie}</Text>
								    }
								</View>
								<View><Text style={styles.minime}>mmol/L</Text></View>
							</View>
							<View><Text style={styles.slogan}>Glycemie</Text></View>
						</View>
						<View style={styles.center}>
							<View style={{...styles.rounded2, ...styles.center}}>
								<View style={{...styles.rounded3, ...styles.center}}>
									<View style={{...styles.rounded, ...styles.col, ...styles.center}}>	
										<View><Text style={styles.minime}>g/l</Text></View>
										<View >
											{!diabete['hba1'] ?
											<Ionicons
											      name='remove-outline'
											      size={19}
											      color='white'
											    /> : 
											<Text style={styles.minime}>{diabete.hba1}</Text>
											}
										</View>
										<View><Text style={styles.minime}>HbA1c</Text></View>
									</View>
								</View>
							</View>
							<View><Text style={styles.slogan}>TENDANCE 7 JOURS</Text></View>
						</View>
						<View style={styles.center}>
							<View style={{...styles.rounded, ...styles.col, ...styles.center}}>
								<View></View>
								<View >
									<Text style={{...styles.minime, fontWeight: "bold"}}>{diabete.insuline}</Text>
								</View>
								<View><Text style={styles.minime}>ml</Text></View>
							</View>
							<View><Text style={styles.slogan}>Insuline active</Text></View>
						</View>
					</View>
				</View>
				<View style={styles.ligne}/>
				<View>
					<View style={{...styles.row, justifyContent: "space-around",alignItems: 'center',  marginTop: hp('1%')}}>
						<View style={{width: "70%", paddingLeft: wp("10%")}}>
							<View style={{alignItems: 'center'}}>
								<Text style={{...styles.slogan, color: "green"}}>BON !</Text>
								<Text style={styles.slogan}>DERNIER CONTRÔLE N/A</Text>
							</View>
						</View>
						<View style={{width: wp("20%"), marginTop: -hp(".5%")}}>
						    <Ionicons
						      name='chevron-forward-outline'
						      size={24}
						      color='green'
						    />
						</View>
					</View>
				</View>
				<View style={styles.ligne}/>
				<View>
					<View style={{...styles.row, justifyContent: "space-around", marginTop: hp('1%'), ...styles.center2}}>
						<TouchableOpacity
							onPress={()=>props.navigation.navigate("NewMeasureScreen")}
						>
							<View style={styles.center}>
								<View style={{...styles.center}}>
									<Ionicons
								      name='add-circle-outline'
								      size={25}
								      color='black'
								    />
								</View>
									
								<View><Text style={styles.slogan}>ENTREE DU JOURNAL</Text></View>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={()=>props.navigation.navigate("JournalDiabeteScreen")}
						>
							<View style={styles.center}>
								<View style={{...styles.center}}>
									<Ionicons
								      name='newspaper-outline'
								      size={23}
								      color='black'
								    />
								</View>
									
								<View><Text style={styles.slogan}>JOURNAL</Text></View>
							</View>
						</TouchableOpacity>
					</View>
				</View>
				<View style={styles.ligne}/>
				<View>
					<View style={{...styles.row, justifyContent: "space-around", marginTop: hp('1%')}}>
						<View style={{width: "70%", paddingLeft: wp("10%")}}>
							<TouchableOpacity
								onPress={()=>props.navigation.navigate('StatistiquesScreen')}
							>
								<Text style={styles.slogan}>STATISTIQUES</Text>
							</TouchableOpacity>
						</View>
						<View style={{width: wp("20%"), marginTop: -hp(".5%")}}>
						    <Ionicons
						      name='chevron-forward-outline'
						      size={24}
						      color='green'
						    />
						</View>
					</View>
				</View>
				<View style={styles.ligne}/>
				<View>
					<View style={{ ...styles.row, justifyContent: "space-around", marginTop: hp('1.5%')}}>
						<View style={{...styles.column2}}>
							<View><Text style={styles.slogan} >Créneau.</Text></View>
							<View><Text style={styles.slogan} >Glucides.</Text></View>
							<View><Text style={styles.slogan} >Systole</Text></View>
							<View><Text style={styles.slogan} >Disatole</Text></View>
							<View><Text style={styles.slogan} >Médicaments</Text></View>
						</View>
						<View style={{...styles.column2}}>
							<View>
								{diabete.cathegorie ?
									<Text>{diabete.cathegorie}</Text> :
									<Ionicons
								      name='remove-outline'
								      size={19}
								      color='black'
								    />
							    }

							</View>
							<View>
								{diabete.glucide ?
									<Text>{diabete.glucide}</Text> :
									<Ionicons
								      name='remove-outline'
								      size={19}
								      color='black'
								    />
								}
							</View>
							<View>
							{diabete.systole ?
									<Text>{diabete.systole}</Text> :
									<Ionicons
								      name='remove-outline'
								      size={19}
								      color='black'
								    />
						    }
							</View>
							<View>
							{diabete.diastole ?
									<Text>{diabete.diastole}</Text> :
									<Ionicons
								      name='remove-outline'
								      size={19}
								      color='black'
								    />
						    }
							</View>
							<View>
							{diabete.medicament ?
									<Text>{"Oui"}</Text> :
									<Ionicons
								      name='remove-outline'
								      size={19}
								      color='black'
								    />
						    }
							</View>
						</View>

						<View style={{...styles.column2}}>
							<View><Ionicons
								      name='remove-outline'
								      size={19}
								      color='black'
								    />
							</View>
							<View><Ionicons
								      name='remove-outline'
								      size={19}
								      color='black'
								    />
							</View>
							<View><Ionicons
								      name='remove-outline'
								      size={19}
								      color='black'
								    />
							</View>
							<View><Ionicons
								      name='remove-outline'
								      size={19}
								      color='black'
								    />
							</View>
							<View><Ionicons
								      name='remove-outline'
								      size={19}
								      color='black'
								    />
							</View>
						</View>
					</View>
				</View>
				<View style={{height: 22}}/>
			</ScrollView>	
		</View>
	)
}

const styles = StyleSheet.create({
    container: {
    	marginTop: hp("2%"),
        paddingHorizontal: wp("3%"),
    },
    main: {	
        backgroundColor: "white"
    },
    row: {
	 	flexDirection: 'row',
	 },
	 column2: {
    	justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: "column",
	 },
	 col: {
	 	flexDirection: 'column',
	 },
	rounded: {
		width: 70,
		height: 70,
		backgroundColor: "green",
		borderRadius: 100
	},
	ligne: {
		backgroundColor: '#F0F0F0',
		borderRadius: 20,
		height: 10,
		marginTop: hp("2%")
	},
	rounded2: {
		width: 115,
		height: 115,
		backgroundColor: "white",
		borderRadius: 100,
		shadowColor: "#000",
	    shadowOffset: {
	      width: 0,
	      height: 6,
	    },
	    shadowOpacity: 0.39,
	    shadowRadius: 8.30,

	    elevation: 13,
	},
	rounded3: {
		width: 83,
		height: 83,
		backgroundColor: "#EBEBEB",
		borderRadius: 100
	},
	center: {
        justifyContent: 'center', 
        alignItems: 'center'
    },
    center2: {
        alignItems: 'center'
    },
    textbtn: {
    },
    minime: {
    	color: "white",
    	fontSize: 12
    },
    slogan: {
        color: "#5F666D",
        fontSize: hp("2.3%")

    },
});