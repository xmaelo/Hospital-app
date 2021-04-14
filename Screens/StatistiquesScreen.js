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
import FusionCharts from 'react-native-fusioncharts';


let chart1 = {
    "type": "spline",
    "dataFormat": "json",
    "renderAt": "chart-container",
    "width": wp("96%"),
    "height": hp("36.5%"),
    "dataSource": {
      "chart": {
        "theme": "fusion",
        "caption": "Evolution de la hba1 7 jours",
        "subCaption": "",
        "xAxisName": "",
        "yAxisName": "",

        //Cosmetics
        "lineThickness": "2",
        "divlineAlpha": "100",
        "divlineColor": "#999999",
        "divlineThickness": "1",
        "divLineIsDashed": "1",
        "divLineDashLen": "1",
        "divLineGapLen": "1",
        "showXAxisLine": "1",
        "xAxisLineThickness": "1",
      },
      "data": [{
          "label": "Mon",
          "value": "37"
        },
        {
          "label": "Tue",
          "value": "34"
        },
        {
          "label": "Wed",
          "value": "38"
        },
        {
          "label": "Thu",
          "value": "32"
        },
        {
          "label": "Fri",
          "value": "35"
        },
        {
          "label": "Sat",
          "value": "33"
        },
        {
          "label": "Sun",
          "value": "42"
        }
      ]
    }
}
let chart2 = {
    "type": "spline",
    "dataFormat": "json",
    "renderAt": "chart-container",
    "width": wp("96%"),
    "height": hp("36.5%"),
    "dataSource": {
      "chart": {
        "theme": "fusion",
        "caption": "Evolution de l'insuline 7 jours",
        "subCaption": "",
        "xAxisName": "",
        "yAxisName": "",

        //Cosmetics
        "lineThickness": "2",
        "divlineAlpha": "100",
        "divlineColor": "#999999",
        "divlineThickness": "1",
        "divLineIsDashed": "1",
        "divLineDashLen": "1",
        "divLineGapLen": "1",
        "showXAxisLine": "1",
        "xAxisLineThickness": "1",
      },
      "data": []
    }
}
let chart3 = {
    "type": "spline",
    "dataFormat": "json",
    "renderAt": "chart-container",
    "width": wp("96%"),
    "height": hp("36.5%"),
    "dataSource": {
      "chart": {
        "theme": "fusion",
        "caption": "Evolution de la glycemie 7 jours",
        "subCaption": "",
        "xAxisName": "",
        "yAxisName": "",

        //Cosmetics
        "lineThickness": "2",
        "divlineAlpha": "100",
        "divlineColor": "#999999",
        "divlineThickness": "1",
        "divLineIsDashed": "1",
        "divLineDashLen": "1",
        "divLineGapLen": "1",
        "showXAxisLine": "1",
        "xAxisLineThickness": "1",
      },
      "data": []
    }
}

const libraryPath = Platform.select({
  android: { uri: 'file:///android_asset/fusioncharts.html' }
});
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export default function StatistiquesScreen(props){
	let char = {
		chart1: chart1,
		chart2: chart2,
		chart3: chart3
	}
	const [chart, setState] = useState(char);

	useFocusEffect(
	    React.useCallback(() => {
			async function get() {
		      const userId = auth().currentUser.uid;

		      let diabetes = database().ref('mesures/'+userId).limitToLast(7);
		      let insuline = [];
		      let freq = [];
		      let glycemie = [];
		      diabetes.on('value', (snapshot) => { 
		      	    if(snapshot && snapshot.val()){
						for (const [key, value] of Object.entries(snapshot.val())) {
							let sys = {value: value.systole, date: value.date}
							let dias = {value: value.diastole, date: value.date}
							const b = new Date(value.date)
							let i = {value: parseInt(value.insuline), label:  days[b.getDay()], date: value.date}
							let f = {value: parseInt(value.hba1), label:  days[b.getDay()], date: value.date}
							let g = {value: parseInt(value.glycemie), label:  days[b.getDay()], date: value.date}
							freq.push(f);
							insuline.push(i);
							glycemie.push(g);
						}

						freq = freq.sort(function(a,b){
						  return new Date(b.date) - new Date(a.date);
						});

						const result = freq.filter((val, i)=>{
						  let s =  freq.filter(vals=>vals.label === val.label);
						  if(s.length>1){
						    s = s.sort((a,b) => b.value - a.value)
						    if(s[0].value === val.value){
						      return true
						    }
						  }else{
						    return true;
						  }
						})

						insuline = insuline.sort(function(a,b){
						  return new Date(b.date) - new Date(a.date);
						});

						const ix = insuline.filter((val, i)=>{
						  let s =  insuline.filter(vals=>vals.label === val.label);
						  if(s.length>1){
						    s = s.sort((a,b) => b.value - a.value)
						    if(s[0].value === val.value){
						      return true
						    }
						  }else{
						    return true;
						  }
						})

						glycemie = glycemie.sort(function(a,b){
						  return new Date(b.date) - new Date(a.date);
						});

						const gx = glycemie.filter((val, i)=>{
						  let s =  glycemie.filter(vals=>vals.label === val.label);
						  if(s.length>1){
						    s = s.sort((a,b) => b.value - a.value)
						    if(s[0].value === val.value){
						      return true
						    }
						  }else{
						    return true;
						  }
						})
						console.log("glycemie ===>", gx)
					    char.chart1.dataSource.data = result
					    char.chart2.dataSource.data = ix
					    char.chart3.dataSource.data = gx

						setState(char)
					}
				});	
		    }
		    get();
		    return;
		  }, []
		)
	);
	return(
		<ScrollView style={styles.container1}>
	      <View style={styles.container}>
	        <View style={styles.chartContainer}>
	          <FusionCharts
	            type={chart.chart1.type}
	            width={chart.chart1.width}
	            height={chart.chart1.height}
	            dataFormat={chart.chart1.dataFormat}
	            dataSource={chart.chart1.dataSource}
	            libraryPath={libraryPath} // set the libraryPath property
	          />
	        </View>
	      </View>
	      <View style={{height: 20}}>
	      </View>
	      <View style={styles.container}>
	        <View style={styles.chartContainer}>
	          <FusionCharts
	            type={chart.chart2.type}
	            width={chart.chart2.width}
	            height={chart.chart2.height}
	            dataFormat={chart.chart2.dataFormat}
	            dataSource={chart.chart2.dataSource}
	            libraryPath={libraryPath} // set the libraryPath property
	          />
	        </View>
	      </View>
	      <View style={styles.container}>
	        <View style={styles.chartContainer}>
	          <FusionCharts
	            type={chart.chart3.type}
	            width={chart.chart3.width}
	            height={chart.chart3.height}
	            dataFormat={chart.chart3.dataFormat}
	            dataSource={chart.chart3.dataSource}
	            libraryPath={libraryPath} // set the libraryPath property
	          />
	        </View>
	      </View>
	      <View style={{height: 30}}>
	      </View>
	    </ScrollView>
	)
}


const styles = StyleSheet.create({
  container1: {
    flex: 1
  },
  container: {
    padding: 10
  },
  heading: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10
  },
  chartContainer: {
    height: 200
  }
});