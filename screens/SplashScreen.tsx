import {View, Text, StyleSheet, Image} from 'react-native';
import React, {useEffect} from 'react';
import * as Animatable from 'react-native-animatable';
import {
  clearUserEmail,
  getCheckStatus,
  getUserEmail,
  getUserPassword,
} from '../components/RememberMe';
import {firebase} from '@react-native-firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAtom } from 'jotai';

const SplashScreen = ({navigation}) => {
  const todoRef = firebase.firestore().collection('usersInfo');

  useEffect(() => {
    setTimeout(async () => {
      const {checkValue} = await getCheckStatus();
      const {emailValue} = await getUserEmail();
      const {passwordValue} = await getUserPassword();

      if (checkValue && emailValue) {
        try {
          await signInWithEmailAndPassword(auth, emailValue, passwordValue);
          const uid = auth.currentUser?.uid;
          if ((await todoRef.doc(uid).get()).exists == true) {
            navigation.navigate('HomeScreen');
          } else {
            navigation.navigate('SetupProfile');
          }
        } catch (err) {
          console.log('got error: ', err.message);
          if (err.message == 'Firebase: Error (auth/invalid-email).') {
            console.log('Invalid email');
          } else if (
            err.message == 'Firebase: Error (auth/invalid-credential).'
          ) {
            console.log('Invalid password or email');
          }
        }
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
