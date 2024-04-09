import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useEffect} from 'react';
import * as Animatable from 'react-native-animatable';
import {
  clearUserEmail,
  getCheckStatus,
  getUserEmail,
} from '../components/RememberMe';

const SplashScreen = ({navigation}) => {
  
  useEffect(() => {
    setTimeout(async () => {
      const {checkValue} = await getCheckStatus();
      if (checkValue) {
        navigation.navigate('HomeScreen');
        // navigation.navigate('Welcome');

      } else {
        navigation.navigate('Welcome');
      }
    }, 2000);
  }, []);
  return (
    <View style={styles.Splashcontainer}>
      <Animatable.Image
        source={require('../assets/images/logoe.png')}
        duration={2000}
        animation="zoomIn"
      />
    </View>
  );
};
const styles = StyleSheet.create({
  Splashcontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default SplashScreen;
