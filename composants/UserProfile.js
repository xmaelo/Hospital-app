import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
//importation de la library pour le responsive design
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

 
export default function UserProfile({images, size= 50, stylesProfile}) {
    return (
        <View style={[styles.container, { borderRadius: size / 2}, {...stylesProfile}]}>
           <Image style={{ width: size, height: size,}} source={{
           		uri: "https://randomuser.me/api/portraits/women/11.jpg"
            }} width={size} height={size}/>
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        overflow: "hidden"
    },
})