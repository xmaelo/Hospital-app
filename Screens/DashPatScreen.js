 import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, ScrollView } from 'react-native';
import FusionCharts from 'react-native-fusioncharts';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Text, Input, Button } from 'react-native-elements';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { useFocusEffect } from '@react-navigation/native';


export default function DashPatScreen({navigation, route}) {

	const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const chart = {
    	chart1: {
		    type: 'angulargauge', 
		    renderAt: 'chart-container',
		    width: wp("95%"),
		    height: hp("37.5%"),
		    dataFormat: 'json',
		    dataSource: {
		      "chart": {
		        "caption": "Mon IMC",
		        "subcaption": "Calcul d'IMC",
		        "lowerLimit": "0",
		        "upperLimit": "",
		        "showValue": "1",
		        "chartBottomMargin": "50",
		        "theme": "fusion"
		      },
		      "colorRange": {
		        "color": [{
		          "minValue": "0",
		          "maxValue": "18.5",
		          "code": "#9AC01D"
		        }, {
		          "minValue": "18.5",
		          "maxValue": "24.9",
		          "code": "#41A72A"
		        }, {
		          "minValue": "24.9",
		          "maxValue": "29.9",
		          "code": "#E7AA0D"
		        }, {
		          "minValue": "29.9",
		          "maxValue": "40",
		          "code": "#E6521B"
		        }, {
		          "minValue": "40",
		          "maxValue": "50",
		          "code": "#561A1C"
		        }]
		      },
		      "dials": {
		        "dial": [{}]
		      },
		      "annotations": {
		        "origw": "450",
		        "origh": "300",
		        "autoscale": "1",
		        "showBelow": "0",
		        "groups": [{
		          "id": "arcs",
		          "items": [
		            {
		              "id": "store-cs-bg",
		              "type": "rectangle",
		              "x": "$chartCenterX-100",
		              "y": "$chartEndY - 22",
		              "tox": "$chartCenterX + 100",
		              "toy": "$chartEndY - 45",
		              "fillcolor": "#0075c2",
		              "align": "justify",
		            },
		            {
		              "id": "state-cs-text",
		              "type": "Text",
		              "color": "#ffffff",
		              "label": "",
		              "fontSize": "13",
		              "align": "justify",
		              "x": "$chartCenterX +30",
		              "y": "$chartEndY - 32"
		            }
		          ]
		        }]
		      }
		    }
		},
		chart2: {
			type: 'msspline',
		    renderAt: 'chart-container',
		    width: wp("94%"),
		    height: hp("40%"),
		    dataFormat: 'json',
		    dataSource: {
		      "chart": {
		        "theme": "fusion",
		        "caption": "Pression artérielle",
		        "subCaption": "",
		        "xAxisName": "",
		        "yAxisName": "",
		        "showXAxisLine": "1",
		        "xAxisLineColor": "#999999"
		      },
		      "categories": [{
		        "category": []
		      }],

		  "dataset": [{
		      "seriesname": "Systole",
		      "data": []
		    },
		    {
		      "seriesname": "Diastole",
		      "data": []
		    }
		  ]
		}
		},
		chart3: {
			type: 'column2d',
		    renderAt: 'chart-container',
		    width: wp("94%"),
		    height: hp("40%"),
		    dataFormat: 'json',
		    dataSource: {
		      "chart": {
		        "caption": "Pouls/Bâtement par min",
		        "subCaption": "",
		        "xAxisName": "Temps",
		        "yAxisName": "",
		        "numberPrefix": "",
		        "theme": "fusion"
		      },
		      "data": []
		    }
		}
	}

	const [state, setState] = useState(chart);
	const [user, setUser] = useState(null);

	useFocusEffect(
	    React.useCallback(() => { 
			async function get() {
		      const userId = route.params?.userId;
		      let user = database().ref('users/'+userId);
		      user.on('value', (snapshot) => {
		      	const t = snapshot.val();
		      	setUser(snapshot.val());

		      	let imc = parseFloat(t.poids)/(parseFloat(t.taille)*parseFloat(t.taille));
		      	let couleur, text;
				if(imc>0 && imc <= 18.5){
					couleur = "#9AC01D"
					text= "Maigreur"
				}else if(imc>18.5 && imc <= 24.9){
					couleur = "#41A72A"
					text= "Normal"
				}else if(imc>24.9 && imc <= 29.9){
					couleur = "Surpoids"
					text= "Obésité"
				}else if(imc>29.9 && imc <= 40){
					couleur = "#E6521B"
					text= "Obésité"
				}else{
					couleur = "#561A1C"
					text= "Obésité Massive"
				}
				chart.chart1.dataSource.annotations.groups[0].items[0].fillcolor = couleur
				chart.chart1.dataSource.annotations.groups[0].items[1].label = ""+text

		      	chart.chart1.dataSource.dials.dial[0].value = imc;
		      	setState(chart)
		      })

		      let diabetes = database().ref('mesures/'+userId).limitToLast(100);
		      let dataSystole = [];
		      let dataDias = [];
		      let freq = [];
		      let max = {};
		      let category = [];
		      diabetes.on('value', (snapshot) => {
		      	    if(snapshot && snapshot.val()){
						for (const [key, value] of Object.entries(snapshot.val())) {
								const b = new Date(value.date)
							if(!isNaN(parseInt(value.systole))){
								let sys = {value: value.systole, date: value.date, label:  days[b.getDay()]}
								dataSystole.push(sys)
							}
							if(!isNaN(parseInt(value.diastole))){
								let dias = {value: value.diastole, date: value.date, label:  days[b.getDay()]}
								dataDias.push(dias)
							}

							if(!isNaN(parseInt(value.freqenceCoeur))){
								let f = {value: parseInt(value.freqenceCoeur), label:  days[b.getDay()], date: value.date}
								freq.push(f);
							}
						}

						console.log('dataSystole ===>', dataDias)

						let result3 = [];
						const resultx = dataSystole.filter((val, i)=>{
							if(val.value){
							    let s =  dataSystole.filter(vals=>vals.label === val.label);
							    if(s.length>1){
							    	//s = s.sort((a,b) => a.value - b.value)
							    	if(!result3.find(o => o.label === val.label)){
							    	   let max = Math.max.apply(Math, s.map(function(o) { return o.value; }))
							    	   result3.push({value: max, label: val.label})

							    	   return true
							    	}
							    	
							    }else{
							    	if(!result3.find(o => o.label === val.label)){
							    	  result3.push(val);
							        }
							        return true;
							    }
							}else{

								return false;
							}
						})
						chart.chart2.dataSource.dataset[0].data = result3
						chart.chart2.dataSource.categories[0].category = result3.reverse()


						let result4 = [];
						dataDias.filter((val, i)=>{
							if(val.value){
							    let s =  dataDias.filter(vals=>vals.label === val.label);
							    if(s.length>1){
							    	//s = s.sort((a,b) => a.value - b.value)
							    	if(!result4.find(o => o.label === val.label)){
							    	   let max = Math.max.apply(Math, s.map(function(o) { return o.value; }))
							    	   result4.push({value: max, label: val.label})
							    	   return true
							    	}
							    	
							    }else{
							    	if(!result4.find(o => o.label === val.label)){
							    		result4.push(val);
							    	}
							        return true;
							    }
							}else{

								return false;
							}
						})
						chart.chart2.dataSource.dataset[1].data = result4.reverse();

						freq = freq.sort(function(a,b){
						  return new Date(b.date) - new Date(a.date);
						});

						let result2 = [];
						const result = freq.filter((val, i)=>{
							if(val.value){
							    let s =  freq.filter(vals=>vals.label === val.label);
							    if(s.length>1){
							    	//s = s.sort((a,b) => a.value - b.value)
							    	if(!result2.find(o => o.label === val.label)){
							    	   let max = Math.max.apply(Math, s.map(function(o) { return o.value; }))
							    	   result2.push({value: max, label: val.label})
							    	   return true
							    	}
							    	
							    }else{
							    	if(!result2.find(o => o.label === val.label)){
							    		result2.push(val);
							    	}
							        return true;
							    }
							}else{

								return false;
							}
						})
					    chart.chart3.dataSource.data = result2.reverse()

						setState(chart)
						console.log('result2========>', result2)
					}
				});	
		    }
		    get();
		    return;
		  }, []
		)
	);



    const libraryPath = Platform.select({
      android: { uri: 'file:///android_asset/fusioncharts.html' }
    });

    return (
    	<ScrollView style={styles.container1}>
	      <View style={styles.container}>
	        <View style={styles.chartContainer1}>
	          <FusionCharts
	            type={state.chart1.type}
	            width={state.chart1.width}
	            height={state.chart1.height}
	            dataFormat={state.chart1.dataFormat}
	            dataSource={state.chart1.dataSource}
	            libraryPath={libraryPath} // set the libraryPath property
	          />
	        </View>
	        <View style={styles.chartContainer}>
	          <FusionCharts
	            type={state.chart2.type}
	            width={state.chart2.width}
	            height={state.chart2.height}
	            dataFormat={state.chart2.dataFormat}
	            dataSource={state.chart2.dataSource}
	            libraryPath={libraryPath} // set the libraryPath property
	          />
	        </View>
	        <View style={styles.chartContainer}>
	          <FusionCharts
	            type={state.chart3.type}
	            width={state.chart3.width}
	            height={state.chart3.height}
	            dataFormat={state.chart3.dataFormat}
	            dataSource={state.chart3.dataSource}
	            libraryPath={libraryPath} // set the libraryPath property
	          />
	        </View>
	      </View>
	      <View style={{height: 30}}>
	      </View>
	    </ScrollView>
    );
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
  chartContainer1: {
    height: hp('40%')
  },
  chartContainer: {
    height: hp('40%')
  }
});



