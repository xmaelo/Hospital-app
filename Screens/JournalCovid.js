import React, { useState, useEffect }from 'react';
import { View, StyleSheet, SafeAreaView, Image, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SearchBar } from 'react-native-elements';
import { Text, Input, Button, CheckBox } from 'react-native-elements';
import Carousel from 'react-native-snap-carousel';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { useFocusEffect } from '@react-navigation/native';
import FusionCharts from 'react-native-fusioncharts';


 const string = {
 	toux: "La toux",
    diarrhe: "La diarrhée",
    ecoullement_nasal: "Ecoulement nasal",
    perte_odorat: "Une perte d'odorat & de goût",
    maux_tete: "Des maux de tête",
    maux_gorge: "Des maux de george",
    gene_respiratoire: "Une gêne respiratoire ",
    courbatures: "Des courbatures et douleurs musculaires",
    fatigue : "Dela fatigue",
    avoir_ete_a_etranger : "Avez vous été a l'étrange",
    pays_touche : "Visitez un pays touché",
    en_contact : "Avez vous été en contact avec un infecté",
 }

let chart = {
    "type": "spline",
    "dataFormat": "json",
    "renderAt": "chart-container",
    "width": wp("96%"),
    "height": hp("36.5%"),
    "dataSource": {
      "chart": {
        "theme": "fusion",
        "caption": "Evolution de la temperature",
        "subCaption": "",
        "xAxisName": "Day",
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
const libraryPath = Platform.select({
  android: { uri: 'file:///android_asset/fusioncharts.html' }
});

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export default function JournalCovid(props){

	const [diabete, setDiabete] = useState(false)
	const [covids, setCovids] = useState([])
	const [state, setState] = useState(false)
	const [endIndex, setEndIndex] = useState(2)
	const [states, setStates] = useState(chart)

	useFocusEffect(
	    React.useCallback(() => {
			let tab = [];
			async function get() {
				console.log('get start here')
				const userId =  auth().currentUser.uid;
				let covid = database().ref('pandemie/'+userId+"/covid");
				let data = [];
				covid.on('value', (snapshot) => {
					let i = 0;
					for (const [key, value] of Object.entries(snapshot.val())) {
				    	tab.push(value)
				    	const b = new Date(value.date);
				    	let small = {label: days[b.getDay()], value: value.temperature, date: value.date}
				    	data.push(small)
					}
					console.log('tabb tab', data)
					data = data.sort(function(a,b){
					  return new Date(b.date) - new Date(a.date);
					});
					const result = data.filter((val, i)=>{
						  let s =  data.filter(vals=>vals.label === val.label);
						  if(s.length>1){
						    s = s.sort((a,b) => b.value - a.value)
						    if(s[0].value === val.value){
						      return true
						    }
						  }else{
						    return true;
						  }
						})
					chart.dataSource.data = result
					setCovids(tab);
					setStates(chart);
				});	
		    }
		     get();
		    return;
		  }, []
		)
	);


	return(
		<ScrollView style={styles.container}>
			<View> 
				<View> 
					<View style={styles.chartContainer}>
			          <FusionCharts
			            type={states.type}
			            width={states.width}
			            height={states.height}
			            dataFormat={states.dataFormat}
			            dataSource={states.dataSource}
			            libraryPath={libraryPath} // set the libraryPath property
			          />
			        </View>
				</View>
				{covids.length > 0&&
				    <View style={styles.container_all_profile}>
						<View style={styles.container_card_profile}>
							<ScrollView>
								{covids.slice(0, endIndex).map((val, i)=>{
									return(
										<View key={i} style={{paddingTop: 30}}>
											<View style={{alignItems: "center"}}><Text>{val.date}</Text></View>
											{Object.keys(val).map((elt, i2) =>
												<View key={i2}>
													{val[elt] ===true&&
														<View> 
															<CheckBox
															  title={string[elt]}
															  
															  checked={true}
															/>
														</View>
													}
												</View>

											)}
										</View>
									  )
								 	}
								  )
								}
								<View style={{height: 15}} />
								<Button
								  title={endIndex==2?"Afficher 10": "Réduire"}
								  type="outline"
								  onPress={()=>{
								  	if(endIndex==2){
								  		setEndIndex(10)
								  	}else {
								  		setEndIndex(2)
								  	}
								  }}
								/>
							</ScrollView>
				        </View>
			        </View>
			    }
			</View>
		</ScrollView>
	)
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chartContainer: {
    height: 230
  },
  container_all_profile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp('1%'),
    paddingTop: hp('2%')
  },
  container_card_profile: {
    backgroundColor: 'white',
    alignItems: "center",
    marginLeft: hp('2%'),
    marginRight: hp('2%'),
    borderRadius: 10,
    marginTop: hp('2%'),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.39,
    shadowRadius: 8.30,

    elevation: 13,
  },

});