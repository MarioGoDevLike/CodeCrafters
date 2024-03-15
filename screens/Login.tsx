import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Dimensions,
} from 'react-native';
import React from 'react';
import {Image} from 'react-native-animatable';

const Login = ({navigation}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.signupContainer}>
        <View>
          <Text style={styles.signupText}>Login</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textInputTitle}>Email</Text>
          <TextInput style={styles.defaultTextInput} />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textInputTitle}>Password</Text>
          <TextInput style={styles.defaultTextInput} />
        </View>

        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>
        <View style={styles.Tcontainer}>
          <Text>Don't have an Account?</Text>
          <Pressable onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.pressableText}>Signup</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.lineContainer}>
        <View style={styles.lines}></View>
        <Text style={styles.continueWithText}>or continue with</Text>
        <View style={styles.lines}></View>
      </View>
      <View style={styles.imagesContainer}>
        <Image style={styles.image} source={require('../assets/images/googleIcon.webp')} />
        <Image style={styles.image} source={require('../assets/images/facebook.webp')} />
      
      </View>
    </View>
  );
};
const ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  mainContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    height: ScreenHeight,
    gap: 50,
  },
  signupContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ECECEC',
    gap: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#24786D',
    shadowOffset: {
      height: 6,
      width: 6,
    },

    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 10,
  },
  defaultTextInput: {
    backgroundColor: 'white',
    borderRadius: 20,
    width: 300,
  },
  textInputTitle: {
    color: '#24786D',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 15,
  },
  inputContainer: {
    display: 'flex',
    gap: 5,
  },
  signupText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 25,
    marginLeft: 15,
  },
  button: {
    backgroundColor: '#24786D',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    height: 50,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25,
  },
  Tcontainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
  },
  pressableText: {
    color: 'black',
    fontSize: 15,
    fontWeight: '500',
  },
  lines: {
    borderTopWidth: 1,
    borderTopColor: 'black',
    width: 80,
  },
  lineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  continueWithText: {
    color: 'black',
    fontWeight: '400',
  },
  image:{
    width:40,
    height:40,
  },
  imagesContainer:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    gap:30,
  }
});
export default Login;
