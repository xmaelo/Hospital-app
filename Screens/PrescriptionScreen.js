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
  Linking,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { ListItem, Icon , Badge} from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth'; 

export default function PrescriptionScreen({navigation}){
	const [resultats, setResultas] = useState([])
    const [noPicture, setNoPicture] = useState(false)
      let tab = [];

    useEffect(() => { 
        (async()  =>{
	        console.log('get start here');
	        const userId =  auth().currentUser.uid;
	        let covid = database().ref('ordonnances/'+userId);

	        covid.once('value', (snapshot) => {
	          if(snapshot.val()){

	            for (const [key, value] of Object.entries(snapshot.val())) {
	            let it = value;
	              let noPicture = false;
	              let fileName;
	              if(it.url){
	                  let tav = it.url.split('/');
	                  fileName = (tav[tav.length-1].split('?')[0]).split('%2')[1];
	                  console.log('tav[tav.length-1].split(', tav[tav.length-1].split('?')[0])
	                 if(it.url.split('pdf')[1] || it.url.split('doc')[1]){
	                    noPicture = true;
	                  }
	              }
	              tab.push({...value, fileName: fileName, noPicture: noPicture})
	            }
	            setResultas(tab);
	          }
	        });
        })();
  	}, []);

    const OpenURLButton = async (url) => {

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        
        await Linking.openURL(url);
      } else {
        Alert.alert(`Ne peut ouvrir cet url`);
      }
    };
	return(
		<ScrollView>
	      <SafeAreaView style={{...styles.container}}>
	          {resultats.map((e, i) => 
	        <View style={{...styles.row, ...styles.content2}} key={i}>
	            <View style={styles.center}>
	              <Text style={styles.mt}>{e.fileName}</Text>
	                <Image 
	                  style={{ width: 70, height: 100}}
	                  source={e.noPicture? require('../../assets/imgs/pdf.png') : require('../../assets/imgs/jpg.jpg')} 
	                /> 
	                <TouchableOpacity
	                  onPress={()=>OpenURLButton(e.url)}
	                >
	                  <Text style={styles.blue}>Télécharger</Text>
	                </TouchableOpacity>
	            </View>
	        </View>
	          )}
	      </SafeAreaView>
	    </ScrollView>
	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    minHeight: hp('80%'),
    paddingHorizontal: wp("6%")
  },
  mt: {
  	paddingBottom: 12
  },
  form: {
    marginTop: hp("2%")
  },
  blue: {
    fontSize: 19,
    marginTop: 5,
    color: 'blue'
  },
  row: {
     flexDirection: 'column',
    justifyContent: 'space-around',
  },
  center: {
    alignItems: "center",
    justifyContent: 'center'
  },
  content2: {
    justifyContent: "space-around", 
    // justifyContent: 'flex-start', 
    alignItems: "center",
    marginTop: hp('4%')
  }
});