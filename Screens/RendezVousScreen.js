import React, { useState, useEffect }from 'react';
import { View, StyleSheet, SafeAreaView, Image, StatusBar, Picker, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text, Input, Button, CheckBox } from 'react-native-elements';
import { ListItem } from 'react-native-elements'
import auth from '@react-native-firebase/auth';
import { showMessage, hideMessage } from "react-native-flash-message";
import { useFocusEffect } from '@react-navigation/native';
import RNSchedule from '../rnschedule/src';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import database from '@react-native-firebase/database';
 
const datas = [{
      title: 'Lunch 2', 
      subtitle: 'With Ha2rry',
      start: new Date('2021-03-28T03:24:00'),
      end: new Date('2021-03-28T04:55:00'),
      color: '#009BD9',
    },{
      title: 'Lunch 3', 
      subtitle: 'With Ha2rry',
      start: new Date('2021-03-28T14:00:00'),
      end: new Date('2021-03-28T15:00:00'),
      color: '#009BD9',
    },{
      title: 'Lunch 2',  
      subtitle: 'With Ha2rry',
      start: new Date('2021-03-29T03:24:00'),
      end: new Date('2021-03-29T05:24:00'),
      color: '#009BD9',
    },
  ]
 
const color = ['#009BD9', '#FFCD43', '#1BA160', '#DD5044', '#683A8A']
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function RendezVousScreen({navigation, route}){
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [data, setData] = useState([]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();

  };

  useEffect(() => {
    (async()  =>{
      let userId = route.params?.userId;
      userId = userId ? userId : await auth().currentUser.uid;
      let rendezVous = database().ref('rendezVous/'+userId);
      rendezVous.on('value', (snapshot) => { 
        if(snapshot.val()){
          let rendez = Object.values(snapshot.val()).map((ren, id)=>{
            console.log('rendez vous', ren)
            return {...ren, color: color[getRandomInt(5)], end: new Date(ren.end), start: new Date(ren.start)}
          })
          setData(rendez);
        }
      })
    })();
  }, []);

  React.useLayoutEffect(() => {
      navigation.setOptions({
            headerTransparent: false,  
              title: "Rendez Vous",
              headerRight: () => (
                <TouchableOpacity 
                  onPress={()=>navigation.navigate('AddRendezVous', {userId: route.params?.userId})}
                  style={{flexDirection: "row"}}
                >
                  <Ionicons
                    name='add-circle-outline'
                    size={30}
                    color='blue'
                  />
                  <Text>{"    "}</Text>
                </TouchableOpacity>
              ),
      });
    }, [navigation]);


  return(
      <RNSchedule
        dataArray={data}
        onEventPress={(appt) => console.log(appt)}
      />
  )
}

export default RendezVousScreen