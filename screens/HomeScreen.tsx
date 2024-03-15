import {View, Text, StyleSheet, Dimensions, Pressable} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

const HomeScreen = ( {navigation} ) => {
 
  return (
    <LinearGradient
      colors={['#43116A', 'black']}
      style={styles.startScreenContainer}>
      <View style={styles.titleContainer}>
        <View>
          <Text style={styles.titleText}>Code,</Text>
          <Text style={styles.titleText}>Connect,</Text>
          <Text style={styles.titleText}>Build!</Text>
        </View>
        <View>
          <Text style={styles.titleParagraph}>
            The ultimate platform to code, connect, and create with your
            programming community. Elevate your coding journey together!
          </Text>
        </View>
        <View style={styles.lineContainer}>
          <View style={styles.lines}></View>
          <View style={styles.lines}></View>
        </View>
        <View style={styles.buttonTextContainer}>
          <Pressable style={styles.button} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.buttonText}>Sign up with mail</Text>
          </Pressable>
          <View style={styles.Tcontainer}>
            <Text style={styles.existing}>Existing Account?</Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.pressableText}>Login</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  startScreenContainer: {
    height: screenHeight,
    flexDirection: 'column',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 50,
    height: screenHeight,
    marginLeft: 20,
  },
  titleText: {
    fontSize: 70,
    color: 'white',
    fontWeight: '400',
  },
  titleParagraph: {
    color: '#B9C1BE',
    lineHeight: 27,
    fontSize: 16,
    width: 300,
  },
  lines: {
    borderTopWidth: 1,
    borderTopColor: '#B9C1BE',
    width: 160,
  },
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    display: 'flex',
  },
  buttonText: {
    color: 'black',
    fontSize: 17,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 14,
    elevation: 3,
    backgroundColor: 'white',
  },
  buttonTextContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 30,
  },
  existing: {
    color: '#B9C1BE',
  },
  Tcontainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection:'row',
    gap:5,
  },
  pressableText:{
    color:'white',
    fontWeight:'bold',
    fontSize:15
  }
});

export default HomeScreen;
