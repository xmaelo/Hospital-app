import React, { useState, useEffect }from 'react';
import { ActivityIndicator, View, Text, StyleSheet, BackHandler, SafeAreaView, Image, KeyboardAvoidingView,ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import CodeInput from 'react-native-code-input';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';


const reference = database().ref('personne');

function CodeVerificationScreen({route, navigation}){
	const [confirm, setConfirm] = useState(null);
	const [waitingC, setWaitingC] = useState(true);
  const [errorC, setErroC] = useState(false);
  const [message, setMessage] = useState("En attente du code de verification");

	useEffect(() => {
		(async()  =>{
			console.log('route.params.phone', route.params.phone);
			await verifyPhoneNumber(route.params.phone);	
	    })()
      BackHandler.addEventListener('hardwareBackPress', () => true)
      return () => BackHandler.removeEventListener('hardwareBackPress', () => true)

	  }, []);



	async function _onFinishCheckingCode2(code){
		console.log('code', code);
		await confirmCode(code)
		
	}

	  async function verifyPhoneNumber(phoneNumber) {
	    const confirmation = await auth().verifyPhoneNumber(phoneNumber);
	    setConfirm(confirmation);
	    setWaitingC(false)
	    
	  }

	async function confirmCode(code) {
    try {
      setWaitingC(true)
      setErroC(false)
      setMessage("Verification en cours...")
      const credential = auth.PhoneAuthProvider.credential(
        confirm.verificationId,
        code,
      );
      console.log('credential credential credential', credential)
      let userData = await auth().currentUser.linkWithCredential(credential);
      setWaitingC(false)
      setErroC(false)
      navigation.navigate('EditProfile');
    } catch (error) {
      setErroC(true) 
      setWaitingC(false)
      if (error.code == 'auth/invalid-verification-code') {
        console.log('Invalid code.');
      } else {
        console.log('Account linking witout error');
      }
    }
  }
	return(
		<KeyboardAvoidingView behavior='padding' style={styles.container}>
        <ScrollView style={styles.wrapper}>
          <View style={styles.titleWrapper}>
            <Text style={styles.title}>VERIFICATION</Text>
          </View>
  
          <View style={[styles.inputWrapper, {backgroundColor: '#2980C3'}]}>
            {waitingC ?
            	<View style={{alignItems: "center", justifyContent: "center"}}>
            		<Text style={[styles.inputLabel, {color: '#fff', textAlign: 'center'}]}>{message}</Text>
            		<ActivityIndicator size="large" color="white" />
            	</View> :
	            <Text style={[styles.inputLabel, {color: '#fff', textAlign: 'center'}]}>
	              ENTREZ LE CODE DE VERICATION
	            </Text>

            }
            {errorC &&
              <Text style={[styles.inputLabel, {color: '#fff', textAlign: 'center'}]}>
                Le code founir est incorrect
              </Text>
            }
            <CodeInput
              codeLength={6}
              borderType='circle'
              autoFocus={false}
              ConfirmationCodeInput={()=>{}}
              codeInputStyle={{ fontWeight: '800' }}
              onFulfill={(code)=>_onFinishCheckingCode2(code)}
            />
          </View>
        </ScrollView> 
      </KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  title: {
    color: 'red',
    fontSize: 16,
    fontWeight: '800',
    paddingVertical: 30
  },
  wrapper: {
    marginTop: 30
  },
  inputWrapper: {
  	borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '800'
  },
})


export default CodeVerificationScreen 