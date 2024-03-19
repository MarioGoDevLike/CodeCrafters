import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const Signup = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if(email && password){
      try{
        await createUserWithEmailAndPassword(auth, email, password);
        navigation.navigate('Login');
      }catch(err){
        console.log('got error: ', err.message);
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.signupContainer}>
        <View>
          <Text style={styles.signupText}>Signup</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textInputTitle}>Email</Text>
          <TextInput
            value={email}
            onChangeText={value => setEmail(value)}
            style={styles.defaultTextInput}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textInputTitle}>Phone Number</Text>
          <TextInput
            value={phoneNumber}
            onChangeText={value => setPhoneNumber(value)}
            style={styles.defaultTextInput}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textInputTitle}>Password</Text>
          <TextInput
            value={password}
            onChangeText={value => setPassword(value)}
            style={styles.defaultTextInput}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textInputTitle}>Confirm Password</Text>
          <TextInput style={styles.defaultTextInput} />
        </View>
        <Pressable onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </Pressable>
        <View style={styles.Tcontainer}>
          <Text>Existing Account?</Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.pressableText}>Login</Text>
          </Pressable>
        </View>
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
    paddingLeft:12,
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
    fontFamily: 'MarkaziText-Bold',
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
});
export default Signup;
