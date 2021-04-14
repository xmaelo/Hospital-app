import React, { useState, useEffect }from 'react';
import { View, StyleSheet, KeyboardAvoidingView,SafeAreaView, Image, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Input, Button, CheckBox } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { showMessage, hideMessage } from "react-native-flash-message";
import storage from '@react-native-firebase/storage';

const img = require('../../assets/imgs/logo.png')



function RegisterScreen ({ navigation }){
    const [initializing, setInitializing] = useState(true);
    const [password, setPassword] = useState("");
    const [name, defineName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [passwordCheck, setPasswordCheck] = useState("");

    const pressed = (text) =>{
        console.log('Text pressed');
    }
    const handlePress = () =>{
        console.log('Pressed')
    }
    const [pinSecure, setPinSecure] = useState(false);

    function onAuthStateChanged(user) {
    //setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; 
  }, []);

  // Handle create account button press
  async function createAccount() {
    if (phone&&phone.slice(0, 1)!=="+") {
      const sc = {
        message: "Attention !",
        description: "Le numéro de téléphone est au format international ex: +237xxxxxx",
        icon: { icon: "auto", position: "left" },
        type: 'info',
        onPress: () => {
          hideMessage();
        },
      };
    showMessage(sc);

       return;
      console.log('incorresct phone');
    }

    if(passwordCheck !== password){
      const message = {
        message: "Erreur fatale",
        description: "Les mots de passe ne correspondents pas !",
        icon: { icon: "auto", position: "left" },
        type: 'danger',
        onPress: () => {
          hideMessage();
        },
      };

     showMessage(message);

      return;
    }
    setDisabled(true);
    try {
      let res = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
     const userId = auth().currentUser.uid;

      // const { userId } = await admin.auth().createUser({
      //      displayName,
      //      password,
      //      email
      //  })
      //await admin.auth().setCustomUserClaims(userId, { doctor: true })

      console.log('User account created & signed in!');

        

      database().ref('users').child(userId).set({
        phone: phone,
        email: email,
        profile: "https://randomuser.me/api/portraits/women/11.jpg",
        nom_complet : name
      }).then((data) => {
          console.log('Saved Data', data)
      })
      .catch((error) => {
          console.log('Storing Error', error)
      })  
      setDisabled(false);
      navigation.navigate('CodeVerificationScreen', {phone: phone});
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        const message2 = {
          message: "Erreur fatale",
          description: "Cet email est déja utilisé!",
          icon: { icon: "auto", position: "left" },
          type: 'danger',
          onPress: () => {
            hideMessage();
          },
        };
      showMessage(message2);
      setDisabled(false);

      return;
        console.log('That email address is already in use!');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
        const message2 = {
          message: "Erreur fatale",
          description: "Cet email est invalide !",
          icon: { icon: "auto", position: "left" },
          type: 'danger',
          onPress: () => {
            hideMessage();
          },
        };
      showMessage(message2);
      setDisabled(false);
      return;
      }

      console.log('That email address is invalid!');
      const message2 = {
        message: "Erreur fatale",
        description: "Quelque chose a mal tourné",
        icon: { icon: "auto", position: "left" },
        type: 'danger',
        onPress: () => {
          hideMessage();
        },
      };
      showMessage(message2);
      setDisabled(false);
      console.log(error);
    }
  }

  


    return(
        <ScrollView style={styles.backrgound}>
            <StatusBar style="auto" backgroundColor="white" />
            <View style={styles.container}>
                <View style={styles.imgBloc}>
                    <Image
                        style={{ width: wp("40%"), height: hp("10%"), borderRadius: 100 }}
                        source={img}
                    />
                    <Text h4>
                      Créer un compte
                    </Text>
                </View> 
                <View style={{marginTop: hp("3%")}}>
                    <Input
                       inputStyle={{marginTop: 5}}
                       label="Nom de famille"
                       containerStyle={{marginTop: -20, marginBottom: -10, marginBottom: -10}}
                       labelStyle={{color: "red", transform: [{ translateY: 20 }]}}
                       onChangeText={value => defineName(value)}
                       value={name}
                      />
                      <Input
                       inputStyle={{marginTop: 5}}
                       containerStyle={{marginTop: -20, marginBottom: -10}}
                       label="Numéro de teléphone"
                       placeholder="+xxx xxxxxxx"
                       labelStyle={{color: "red", transform: [{ translateY: 20 }]}}
                       onChangeText={value => setPhone(value)}
                       value={phone}
                      />
                      <Input
                       inputStyle={{marginTop: 5}}
                       containerStyle={{marginTop: -20, marginBottom: -10}}
                       label="Email"
                       labelStyle={{color: "red",transform: [{ translateY: 20 }]}}
                       onChangeText={value => setEmail(value)}
                       value={email}
                      />
                      <Input
                       containerStyle={{marginTop: -20, marginBottom: -10}}
                       inputStyle={{marginTop: 5}}
                       label="Password"
                       labelStyle={{color: "red", transform: [{ translateY: 20 }]}}
                       secureTextEntry={!false}
                       onChangeText={value => setPassword(value)}
                       value={password}
                      />
                      <Input
                       containerStyle={{marginTop: -20, marginBottom: -10}}
                       inputStyle={{marginTop: 5}}
                       label="Confirm password"
                       labelStyle={{color: "red", transform: [{ translateY: 20 }]}}
                       secureTextEntry={!false}
                       onChangeText={value => setPasswordCheck(value)}
                       value={passwordCheck}
                      />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('2%')}}>
                        <CheckBox
                          title={
                            <View>
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text>I agree to the</Text>
                                <Text style={{color: "red"}}> Terms of Services</Text>
                                <Text > and</Text>
                                </View>
                                <Text style={{color: "red"}}> Privacy Policy</Text>
                            </View>
                            }
                          checkedColor="red"
                          containerStyle={{backgroundColor: null, marginTop: -hp("3%")}}
                          checked={true}
                        />
                </View>
                <View>
                    <Button
                      buttonStyle={{backgroundColor: "red", borderRadius: 20}}
                      
                      disabled={disabled}
                      loading={disabled}
                      onPress={()=>createAccount()}
                      title="Continue"
                    />
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: hp('2%')}}>
                        <Text style={styles.slogan}>
                          Have an account ?
                        </Text>
                        <TouchableOpacity
                            onPress={()=>navigation.navigate("LoginScreen")}
                        >
                            <Text style={{...styles.slogan, color: 'red' }}>
                              Sign In
                            </Text>
                        </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
} 

const styles = StyleSheet.create({
    container: {
        marginTop: hp('2%'),
        
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

export default RegisterScreen;