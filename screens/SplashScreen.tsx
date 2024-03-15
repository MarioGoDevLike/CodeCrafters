import { View, Text, StyleSheet, Image } from 'react-native'
import React, { useEffect } from 'react'
import * as Animatable from 'react-native-animatable'

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('Home');
        }, 2000)
    }, [])
  return (
    <View style={styles.Splashcontainer}>
      <Animatable.Image source={require('../assets/images/logoe.png')} duration={2000} animation='zoomIn' />
    </View>
  )
  
};
const styles = StyleSheet.create({
    Splashcontainer: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#FFFFFF'
    },
  });

export default SplashScreen;