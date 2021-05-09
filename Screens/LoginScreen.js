import React, { useState, useEffect }from 'react';
import { BackHandler, View, StyleSheet, SafeAreaView, Image, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Input, Button } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { showMessage, hideMessage } from "react-native-flash-message";



const img = require('../../assets/imgs/logo.png')
function LoginScreen ({ navigation }){

    const [password, setPassword] = useState("");
    const [username, defineUsername] = useState("");
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
      BackHandler.addEventListener('hardwareBackPress', () => true)
      return () => BackHandler.removeEventListener('hardwareBackPress', () => true)
    }, [])

    const pressed = (text) =>{
        console.log('Text pressed');
    }
    const handlePress = () =>{
        console.log('Pressed')
    }

    async function signInWithPhoneNumber(){
        try{   
            if(!username || username.trim()==="" ||!password || password.trim()===""){
                const message = {
                message: "Info !",
                description: "Vous n'avez pas entré vos identifiants !",
                icon: { icon: "auto", position: "left" },
                type: 'info',
                hideStatusBar: false,
                onPress: () => {
                  hideMessage();
                },
            }; 

            showMessage(message);
            return;
            }
            setDisabled(true)
            const confirmation = await auth().signInWithEmailAndPassword(username, password);
            auth().currentUser.getIdTokenResult().then((idTokenResult) => {
                if (!!idTokenResult.claims.doctor) {
                    navigation.navigate('TabBarMed');
                }else if(!idTokenResult.claims.doctor && !idTokenResult.claims.admin) {
                  navigation.navigate('Main');
                }else{
                  setError(true);  
                }
              }).catch((error) => {
                console.log(error);
              });

            setDisabled(false)
        }catch(e){
            setDisabled(false)
            console.log('error signin', e);
            const message = {
                message: "Problème de connexion !",
                description: "Identifiants incorrects où erreur lié au réseau",
                icon: { icon: "auto", position: "left" },
                type: 'danger',
                hideStatusBar: false,
                onPress: () => {
                  hideMessage();
                },
            };

            showMessage(message);
            return;
        }
    }

    const [pinSecure, setPinSecure] = useState(false);
    return(
        <ScrollView style={styles.backrgound}> 
            <StatusBar style="auto" backgroundColor="white" />
            <SafeAreaView style={styles.container}>
                <View style={styles.imgBloc}>
                    <Image
                        style={{ width: wp("40%"), height: hp("10%"), borderRadius: 100 }}
                        source={img}
                    />
                    <Text style={styles.slogan}>Mobile application </Text>
                    <Text style={styles.slogan}>for Medical documentation </Text>
                </View> 
                <View style={{marginTop: hp("4%")}}>
                    <Text h4>Sign In</Text>
                    <Text style={styles.slogan}>Hi there! Nice to see you again</Text>
                </View>
                <View style={{marginLeft: -10}}>
                    <View style={{marginTop: hp("3%")}}>
                        <Input
                           placeholder="Email"
                           label="Email"
                           labelStyle={{color: "red"}}
                           leftIcon={
                            <Ionicons 
                                name={"person"} 
                                size={24}   
                            />
                           }
                           value={username}
                           onChangeText={value => defineUsername(value)}
                          />

                          <Input
                           placeholder="Mot de passe"
                           label="Password"
                           labelStyle={{color: "red"}}
                           leftIcon={
                            <Ionicons 
                                    name={"lock-closed"} 
                                    size={24}   
                                />
                            }
                            value={password}
                            onChangeText={value => setPassword(value)}
                           rightIcon={
                            <TouchableOpacity
                                style={{padding: 4}}
                                onPress={()=>setPinSecure(!pinSecure)}
                            >
                                <Ionicons 
                                    name={pinSecure ? "eye": "eye-off"} 
                                    size={24}   
                                />
                            </TouchableOpacity>
                           }
                           secureTextEntry={!pinSecure}
                          />
                    </View>
                </View>
                <View> 
                    <Button
                      buttonStyle={{backgroundColor: "red", borderRadius: 20}}
                      icon={{
                        name: "arrow-right",
                        size: 15,
                        color: "white"
                      }}
                      onPress={()=>signInWithPhoneNumber()}
                      disabled={disabled}
                      loading={disabled}
                      title="Sign In"
                    />
                    <View style={{alignItems: "center", marginTop: hp("1%")}}>
                        <Text style={styles.slogan}>Or use one of you social profile</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-around', marginTop: hp('4%')}}>
                    <Icon.Button name="twitter" backgroundColor="#51ABF1">
                        <Text style={{ color: 'white', fontSize: 15, width: wp("25%") }}>
                          Twitter
                        </Text>
                    </Icon.Button>
                    <Icon.Button name="facebook" backgroundColor="#3b5998">
                        <Text style={{ color: 'white', fontSize: 15, width: wp("25%") }}>
                          Facebook
                        </Text>
                      </Icon.Button>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('3.7%')}}>
                    <TouchableOpacity
                       //onPress={()=>navigation.navigate("AuthScreen")}
                    >
                        <Text style={styles.slogan}>
                          Forgot password ?
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={()=>navigation.navigate("RegisterScreen")}
                    >
                        <Text style={{...styles.slogan, color: 'red' }}>
                          Sign Up
                        </Text> 
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
} 

const styles = StyleSheet.create({
    container: {
        marginTop: hp('3%'),
        
        paddingHorizontal: wp("6%"),
    },
    backrgound: {
        flex: 1,
        backgroundColor: "white"
    },
    imgBloc: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    slogan: {
        color: "#5F666D",
        fontSize: hp("2.3%")

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

export default LoginScreen;