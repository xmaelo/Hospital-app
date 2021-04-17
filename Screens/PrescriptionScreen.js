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
import { useFocusEffect } from '@react-navigation/native';
import database from '@react-native-firebase/database';

export default function PrescriptionScreen({navigation}){
	return(
		<ScrollView>
	      <SafeAreaView style={{...styles.container}}>
	        <View style={{...styles.row, ...styles.content2}}>
	          <View style={styles.center}>
	            <Text>Document 1</Text>
	            <Ionicons
	                name='document-text-outline'
	                size={30}
	                color='black'
	              />
	              <Text style={styles.blue}>Download</Text>
	          </View>
	          <View style={styles.center}>
	            <Text>Document 2</Text>
	            <Ionicons
	                name='document-text-outline'
	                size={30}
	                color='black' 
	              />
	              <Text style={styles.blue}>Download</Text>
	          </View>
	          <View style={styles.center}>
	            <Text>Document 3</Text>
	            <Ionicons
	                name='document-text-outline'
	                size={30}
	                color='black'
	              />
	              <Text style={styles.blue}>Download</Text>
	          </View>
	        </View>
	      </SafeAreaView>
	    </ScrollView>
	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: wp("6%")
  },
  form: {
    marginTop: hp("2%")
  },
  blue: {
    color: 'blue'
  },
  row: {
     flexDirection: 'row',
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