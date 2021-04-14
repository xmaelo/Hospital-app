import React, { useState }from 'react';
import { View, StyleSheet, SafeAreaView, Image, ScrollView, StatusBar, TouchableOpacity, Switch } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Input, Button, CheckBox, ListItem } from 'react-native-elements';
import ToggleSwitch from 'toggle-switch-react-native'
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { showMessage, hideMessage } from "react-native-flash-message";

const img = require('../../assets/imgs/logo.png')

export default function CheckCovidScreen ({ navigation }){
	const [password, setPassword] = useState("");
    const [username, defineUsername] = useState("");
    const [disabled, setDisabled] = useState(false);

    const [toux, setToux] = useState(false);
    const [diarrhe, setDiarrhre] = useState(false);
    const [nasal, setNasal] = useState(false);
    const [perte, setPerte] = useState(false);
    const [maux, setMaux] = useState(false);
    const [gene, setGene] = useState(false);
    const [fatigue, setFatigue] = useState(false);
    const [courbatures, setCourbature] = useState(false);
    const [respiratoire, setRespiratoire] = useState(false);
    const [etranger, setEtranger] = useState(false);
    const [pays, setPays] = useState(false);
    const [contact, setContact] = useState(false);
    const [temperature, setTemperature] = useState("");
    const [george, setGeorge] = useState(false);

    async function onSave(){
    	setDisabled(true);
    	const userId = auth().currentUser.uid;
    	let type, message, description;
    	try{

    		await database().ref('pandemie/'+userId+"/covid").push({
    			date: new Date().toISOString().split("T")[0],
		        toux: toux,
		        diarrhe: diarrhe,
		        ecoullement_nasal: nasal,
		        perte_odorat: perte,
		        maux_tete: maux,
		        maux_gorge: george,
		        gene_respiratoire: gene,
		        courbatures: courbatures,
		        fatigue : fatigue,
		        avoir_ete_a_etranger : etranger,
		        pays_touche : pays,
		        en_contact : contact,
		        temperature : temperature
		      })

    		message = "Succès";
    		 type =  'success';
    		 description="Sauvegarde effectuée !"
    	}catch(err){
    		 message = "Error";
    		 type =  'error';
    		 description="Erreur inconnue est apparue !"
    		console.log('error', err);
    	}

    	const mess = {
	        message: message,
	        description: description,
	        icon: { icon: "auto", position: "left" },
	        type: type,
	        hideStatusBar: false,
	        onPress: () => {
	          hideMessage();
	        },
	      }; 
     	  showMessage(mess);
     	  setDisabled(false)
     	  navigation.navigate('JournalCovid');
    }
    const pressed = (text) =>{
        console.log('Text pressed');
    }
    const handlePress = () =>{
        console.log('Pressed')
    }
    const [swict1, setSwict1] = useState(false);
    return(
        <ScrollView style={styles.container}>
        	<StatusBar style="auto" backgroundColor="white" />
            	<SafeAreaView>
	                <View style={styles.imgBloc}>
	                    <Image
	                        style={{ width: wp("35%"), height: hp("8%"), borderRadius: 100 }}
	                        source={img}
	                    />
	                    <Text style={{...styles.slogan, marginTop: hp('.5%'), fontWeight: "bold", fontSize: hp("2.8%")}}>
	                		Analyse de mes Symtômes
	                	</Text>
	                </View>
	                <View><Text style={{...styles.slogan, marginTop: hp('2.5%'), fontSize: hp("2.3%")}}>AVEZ-VOUS:</Text></View>
	            	
	            	<View>
	            		<View style={styles.form}>
							<View style={{ ...styles.displayRow2}}>
								<View style={{...styles.center2}}>
									<View style={styles.mt}>
										<Text style={styles.label}>La Toux ?</Text>
										<ToggleSwitch
										  onColor="green"
										  offColor="#f4f3f4"
										  label=""
										  labelStyle={{ color: "black", fontWeight: "900" }}
										  size="small"
										  isOn={toux}
										  onToggle={isOn => setToux(isOn)}
										/>
									</View>
									<View style={styles.mt}>
										<Text style={styles.label}>La diarrhée ?</Text>
										<ToggleSwitch
										  onColor="green"
										  offColor="#f4f3f4"
										  label=""
										  labelStyle={{ color: "black", fontWeight: "900" }}
										  size="small"
										  isOn={diarrhe}
										  onToggle={isOn => setDiarrhre(isOn)}
										/>
									</View>
									<View style={styles.mt}>
										<Text style={styles.label}>Des maux de tête ?</Text>
										<ToggleSwitch
										  isOn={maux}
										  onColor="green"
										  offColor="#f4f3f4"
										  label=""
										  labelStyle={{ color: "black", fontWeight: "900" }}
										  size="small"
										  onToggle={isOn => setMaux(isOn)}
										/>
									</View>
									<View style={styles.mt}>
										<Text style={styles.label}>Une gêne respiratoire ?</Text>
										<ToggleSwitch
										  isOn={gene}
										  onColor="green"
										  offColor="#f4f3f4"
										  label=""
										  labelStyle={{ color: "black", fontWeight: "900" }}
										  size="small"
										  onToggle={isOn => setGene(isOn)}
										/>
									</View>
									<View style={styles.mt}>
										<Text style={styles.label}>Des courbatures et douleurs musculaires ?</Text>
										<ToggleSwitch
										  isOn={courbatures}
										  onColor="green"
										  offColor="#f4f3f4"
										  label=""
										  labelStyle={{ color: "black", fontWeight: "900" }}
										  size="small"
										  onToggle={isOn => setCourbature(isOn)}
										/>
									</View>
									<View style={styles.mt}>
										<Text style={styles.label}>Avez vous été dans un pays touché par la pandémique ?</Text>
										<ToggleSwitch
										  isOn={pays}
										  onColor="green"
										  offColor="#f4f3f4"
										  label=""
										  labelStyle={{ color: "black", fontWeight: "900" }}
										  size="small"
										  onToggle={isOn => setPays(isOn)}
										/>
									</View>
								</View>
								<View style={{...styles.center2}}>
									<View style={styles.mt}>
										<Text style={styles.label}>Ecoulement nasal ?</Text>
										<ToggleSwitch
										  isOn={nasal}
										  onColor="green"
										  offColor="#f4f3f4"
										  label=""
										  labelStyle={{ color: "black", fontWeight: "900" }}
										  size="small"
										  onToggle={isOn => setNasal(isOn)}
										/>
									</View>
									<View style={styles.mt}>
										<Text style={styles.label}>Une perte d'odorat & de goût ?</Text>
										<ToggleSwitch
										  isOn={perte}
										  onColor="green"
										  offColor="#f4f3f4"
										  label=""
										  labelStyle={{ color: "black", fontWeight: "900" }}
										  size="small"
										  onToggle={isOn => setPerte(isOn)}
										/>
									</View>
									<View style={styles.mt}>
										<Text style={styles.label}>Des maux de george ?</Text>
										<ToggleSwitch
										  isOn={george}
										  onColor="green"
										  offColor="#f4f3f4"
										  label=""
										  labelStyle={{ color: "black", fontWeight: "900" }}
										  size="small"
										  onToggle={isOn => setGeorge(isOn)}
										/>
									</View>
									<View style={styles.mt}>
										<Text style={styles.label}>Dela fatigue ?</Text>
										<ToggleSwitch
										  isOn={fatigue}
										  onColor="green"
										  offColor="#f4f3f4"
										  label=""
										  labelStyle={{ color: "black", fontWeight: "900" }}
										  size="small"
										  onToggle={isOn => setFatigue(isOn)}
										/>
									</View>
									<View style={styles.mt}>
										<Text style={styles.label}>Avez vous été a l'étranger ?</Text>
										<ToggleSwitch
										  isOn={etranger}
										  onColor="green"
										  offColor="#f4f3f4"
										  label=""
										  labelStyle={{ color: "black", fontWeight: "900" }}
										  size="small"
										  onToggle={isOn => setEtranger(isOn)}
										/>
									</View>
									<View style={styles.mt}>
										<Text style={styles.label}>Avez vous été en contact avec un infecté ?</Text>
										<ToggleSwitch
										  isOn={contact}
										  onColor="green"
										  offColor="#f4f3f4"
										  label=""
										  labelStyle={{ color: "black", fontWeight: "900" }}
										  size="small"
										  onToggle={isOn => setContact(isOn)}
										/>
									</View>
								</View>
							</View>
						</View>
	            	</View>
	            	<View style={{marginTop: hp("3%")}}>
	            		<Text>Votre température</Text>
	            		<Input
	            		  onChangeText={value => setTemperature(value)}
	            		  value={temperature}
						  placeholder='Température'
						  leftIcon={{ type: 'font-awesome', name: 'thermometer' }}
						/>
	            	</View>
	            	<View style={{...styles.row, justifyContent: 'space-around', marginTop: -7}}>
	            		<Button
						  title="Enregistrer"
						  disabled={disabled}
                          loading={disabled} 
						  onPress={()=>onSave()}
						  buttonStyle={{backgroundColor: "green"}}
						/>
						<Button
						  title="Fermer"
						  onPress={()=>navigation.navigate('JournalCovid')}
						  buttonStyle={{backgroundColor: "red"}}
						/>
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
        paddingHorizontal: wp("7%"),
    },
    mt: {
    	marginTop: 10
    },
    label: {
    	paddingBottom: 7
    },
    form: {
    	marginTop: hp("3%"),
    	paddingTop: hp("1%"),
    	// paddingHorizontal: wp("2%")
    },
    imgBloc: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    width: {
    	width: wp('40%'),
    },
    slogan: {
        color: "#5F666D",
        fontSize: hp("2.3%")

    }, 
    center2: {
    	justifyContent: 'flex-start',
        alignItems: 'flex-start',
        flexDirection: "column",
        width: wp("43%")
    },
    displayRow2: {
    	flexDirection: 'row', 
    },
    row: {
	    flexDirection: 'row',
	    marginTop: hp('4%')
	  },
})
