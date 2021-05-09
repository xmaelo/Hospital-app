// import React, { useState, useEffect }from 'react';
// import { View, StyleSheet, SafeAreaView, Image, StatusBar, Picker, TouchableOpacity } from 'react-native';
// import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import { Text, Input, Button, CheckBox } from 'react-native-elements';
// import { ListItem } from 'react-native-elements'
// import auth from '@react-native-firebase/auth';
// import database from '@react-native-firebase/database';
// import { showMessage, hideMessage } from "react-native-flash-message";
// import { useFocusEffect } from '@react-navigation/native';
// //import RNSchedule from '../rnschedule/src';
// import DateTimePickerModal from "react-native-modal-datetime-picker";
 
// const datas = [{
//       title: 'Lunch 2', 
//       subtitle: 'With Ha2rry',
//       start: new Date('2021-03-28T03:24:00'),
//       end: new Date('2021-03-28T04:55:00'),
//       color: '#009BD9',
//     },{
//       title: 'Lunch 3', 
//       subtitle: 'With Ha2rry',
//       start: new Date('2021-03-28T14:00:00'),
//       end: new Date('2021-03-28T15:00:00'),
//       color: '#009BD9',
//     },{
//       title: 'Lunch 2',  
//       subtitle: 'With Ha2rry',
//       start: new Date('2021-03-29T03:24:00'),
//       end: new Date('2021-03-29T05:24:00'),
//       color: '#009BD9',
//     },
//   ]
 
// const color = ['#009BD9', '#FFCD43', '#1BA160', '#DD5044', '#683A8A']
// function getRandomInt(max) {
//   return Math.floor(Math.random() * Math.floor(max));
// }

// function RendezVousScreen({navigation, route}){
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const [data, setData] = useState([]);

//   const showDatePicker = () => {
//     setDatePickerVisibility(true);
//   };

//   const hideDatePicker = () => {
//     setDatePickerVisibility(false);
//   };

//   const handleConfirm = (date) => {
//     hideDatePicker();

//   };

//   useEffect(() => {
//     (async()  =>{
//       let userId = route.params?.userId;
//       userId = userId ? userId : await auth().currentUser.uid;
//       let rendezVous = database().ref('rendezVous/'+userId);
//       rendezVous.on('value', (snapshot) => { 
//         if(snapshot.val()){
//           let rendez = Object.values(snapshot.val()).map((ren, id)=>{
//             console.log('rendez vous', ren)
//             return {...ren, color: color[getRandomInt(5)], end: new Date(ren.end), start: new Date(ren.start)}
//           })
//           setData(rendez);
//         }
//       })
//     })();
//   }, []);

//   React.useLayoutEffect(() => {
//       navigation.setOptions({
//             headerTransparent: false,  
//               title: "Rendez Vous",
//               headerRight: () => (
//                 <TouchableOpacity 
//                   onPress={()=>navigation.navigate('AddRendezVous', {userId: route.params?.userId})}
//                   style={{flexDirection: "row"}}
//                 >
//                   <Ionicons
//                     name='add-circle-outline'
//                     size={30}
//                     color='blue'
//                   />
//                   <Text>{"    "}</Text>
//                 </TouchableOpacity>
//               ),
//       });
//     }, [navigation]);


//   return(
//     <>
//     <Agenda
//   // The list of items that have to be displayed in agenda. If you want to render item as empty date
//   // the value of date key has to be an empty array []. If there exists no value for date key it is
//   // considered that the date in question is not yet loaded
//   items={{
//     '2012-05-22': [{name: 'item 1 - any js object'}],
//     '2012-05-23': [{name: 'item 2 - any js object', height: 80}],
//     '2012-05-24': [],
//     '2012-05-25': [{name: 'item 3 - any js object'}, {name: 'any js object'}]
//   }}
//   // Callback that gets called when items for a certain month should be loaded (month became visible)
//   loadItemsForMonth={(month) => {console.log('trigger items loading')}}
//   // Callback that fires when the calendar is opened or closed
//   onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
//   // Callback that gets called on day press
//   onDayPress={(day)=>{console.log('day pressed')}}
//   // Callback that gets called when day changes while scrolling agenda list
//   onDayChange={(day)=>{console.log('day changed')}}
//   // Initially selected day
//   selected={'2012-05-16'}
//   // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
//   minDate={'2012-05-10'}
//   // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
//   maxDate={'2012-05-30'}
//   // Max amount of months allowed to scroll to the past. Default = 50
//   pastScrollRange={50}
//   // Max amount of months allowed to scroll to the future. Default = 50
//   futureScrollRange={50}
//   // Specify how each item should be rendered in agenda
//   renderItem={(item, firstItemInDay) => {return (<View />);}}
//   // Specify how each date should be rendered. day can be undefined if the item is not first in that day.
//   renderDay={(day, item) => {return (<View />);}}
//   // Specify how empty date content with no items should be rendered
//   renderEmptyDate={() => {return (<View />);}}
//   // Specify how agenda knob should look like
//   renderKnob={() => {return (<View />);}}
//   // Specify what should be rendered instead of ActivityIndicator
//   renderEmptyData = {() => {return (<View />);}}
//   // Specify your item comparison function for increased performance
//   rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
//   // Hide knob button. Default = false
//   hideKnob={true}
//   // By default, agenda dates are marked if they have at least one item, but you can override this if needed
//   markedDates={{
//     '2012-05-16': {selected: true, marked: true},
//     '2012-05-17': {marked: true},
//     '2012-05-18': {disabled: true}
//   }}
//   // If disabledByDefault={true} dates flagged as not disabled will be enabled. Default = false
//   disabledByDefault={true}
//   // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
//   onRefresh={() => console.log('refreshing...')}
//   // Set this true while waiting for new data from a refresh
//   refreshing={false}
//   // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
//   refreshControl={null}
//   // Agenda theme
//   theme={{
//     // ...calendarTheme,
//     agendaDayTextColor: 'yellow',
//     agendaDayNumColor: 'green',
//     agendaTodayColor: 'red',
//     agendaKnobColor: 'blue'
//   }}
//   // Agenda container style
//   style={{}}
// />
//     {/*
//       <RNSchedule
//         dataArray={data}
//         onEventPress={(appt) => console.log(appt)}
//       />
//       */}
//     </>
//   )
// }

// export default RendezVousScreen

import React, {useState, useEffect} from 'react';
import {Alert, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {Agenda} from 'react-native-calendars';;
import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { Button } from 'react-native-elements';

const testIDs ={
  menu: {
    CONTAINER: 'menu',
    CALENDARS: 'calendars_btn',
    CALENDAR_LIST: 'calendar_list_btn',
    HORIZONTAL_LIST: 'horizontal_list_btn',
    AGENDA: 'agenda_btn',
    EXPANDABLE_CALENDAR: 'expandable_calendar_btn',
    WEEK_CALENDAR: 'week_calendar_btn'
  },
  calendars: {
    CONTAINER: 'calendars',
    FIRST: 'first_calendar',
    LAST: 'last_calendar'
  },
  calendarList: {CONTAINER: 'calendarList'},
  horizontalList: {CONTAINER: 'horizontalList'},
  agenda: {
    CONTAINER: 'agenda',
    ITEM: 'item'
  },
  expandableCalendar: {CONTAINER: 'expandableCalendar'},
  weekCalendar: {CONTAINER: 'weekCalendar'}
};

export default function RendezVousScreen({navigation, route}) {
  const [items, setItems] = useState({})

  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }

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

  const loadItems = (day) => {
    setTimeout(() => {
      (async()  =>{
      let userId = route.params?.userId;
      userId = userId ? userId : await auth().currentUser.uid;
      let rendezVous = database().ref('rendezVous/'+userId);
      rendezVous.on('value', (snapshot) => { 
        if(snapshot.val()){
          let rendez = {};
          Object.values(snapshot.val()).map((ren, id)=>{
            let d = timeToString(ren.start) //new Date(ren.start).getTime();

            if(!rendez[d]){
              rendez[d] = [];
              rendez[d].push({height: 100, name: ren.title, desc: ren.subtitle})
            }else{
              rendez[d].push({height: 100, name: ren.title, desc: ren.subtitle})
            }})
          console.log('----------->>rendez<<---------------', rendez)
          setItems(rendez);
        }
      })
    })();

      // for (let i = -15; i < 85; i++) {
      //   const time = day.timestamp + i * 24 * 60 * 60 * 1000;
      //   const strTime = timeToString(time);
      //   if (!items[strTime]) {
      //     items[strTime] = [];
      //     const numItems = Math.floor(Math.random() * 3 + 1);
      //     for (let j = 0; j < numItems; j++) {
      //       items[strTime].push({
      //         name: 'Item for ' + strTime + ' #' + j,
      //         height: Math.max(50, Math.floor(Math.random() * 150))
      //       });
      //     }
      //   }
      // }
      // const newItems = {};
      // Object.keys(items).forEach(key => {
      //   newItems[key] = items[key];
      // });
      // console.log('>>>====<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<', newItems)
      // setItems(newItems)
    }, 500);
  }

  const renderItem = (item) =>{
    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        style={[styles.item, {height: item.height}]}
        onPress={() => Alert.alert(item.desc)}
      >
        <Text>{item.name}</Text>
        <View><Button type="outline" buttonStyle={{height: 25, marginTop: 40}} title="Résoudre"/></View>
      </TouchableOpacity>
    );
  }

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  }

  const rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  }

  
  return (
    <Agenda
      testID={testIDs.agenda.CONTAINER}
      items={items}
      loadItemsForMonth={loadItems}
      selected={new Date()}
      renderItem={renderItem}
      renderEmptyDate={renderEmptyDate}
      rowHasChanged={rowHasChanged}
    />
  );

}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
});

// {
//   "2021-03-25": [
//     {"height": 50, "name": "Item for 2021-03-25 #0"}, 
//     {"height": 50, "name": "Item for 2021-03-25 #1"}
//   ], 
//   "2021-03-26": [
//     {"height": 72, "name": "Item for 2021-03-26 #0"}
//   ], 
//   "2021-03-27": [
//     {"height": 88, "name": "Item for 2021-03-27 #0"}, 
//     {"height": 70, "name": "Item for 2021-03-27#1"}, 
//     {"height": 107, "name": "Item for 2021-03-27 #2"}
//   ]
// }