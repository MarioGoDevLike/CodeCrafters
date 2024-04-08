import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../config/firebase';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from '../components/Loader';

const Signup = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [Confirmpassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [errPassword, setErrPassword] = useState('');
  const [errEmail, setErrEmail] = useState('');

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (password != Confirmpassword) {
      setLoading(false);
      setErrPassword("Passwords doesn't match");
      console.log('make sure Password and confirm password are similar!');
    } else if (email && password) {
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        setLoading(false);
        navigation.navigate('Login');
      } catch (err) {
        setLoading(false);
        if(err.message == 'Firebase: Error (auth/email-already-in-use).'){
          setErrEmail('Email already in use.');
        }
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
          {errEmail ? (
            <View>
              <Text style={styles.errText}>{errEmail}</Text>
            </View>
          ) : null}
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.textInputTitle}>Password</Text>

          <View style={styles.passwordContainer}>
            <TextInput
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={value => setPassword(value)}
              style={styles.input}
            />
            <Icon.Button
              name={showPassword ? 'eye-slash' : 'eye'}
              size={20}
              color="gray"
              backgroundColor="white"
              onPress={toggleShowPassword}
            />
          </View>
          {errPassword ? (
            <View>
              <Text style={styles.errText}>{errPassword}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textInputTitle}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              secureTextEntry={!showConfirmPassword}
              value={Confirmpassword}
              onChangeText={value => setConfirmPassword(value)}
              style={styles.input}
            />
            <Icon.Button
              name={showConfirmPassword ? 'eye-slash' : 'eye'}
              size={20}
              color="gray"
              backgroundColor="white"
              onPress={toggleShowConfirmPassword}
            />
          </View>
          {errPassword ? (
            <View>
              <Text style={styles.errText}>{errPassword}</Text>
            </View>
          ) : null}
        </View>
        <Pressable onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Create Account</Text>
        </Pressable>
        <View style={styles.Tcontainer}>
          <Text style={styles.existText}>Existing Account?</Text>
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.pressableText}>Login</Text>
          </Pressable>
        </View>
      </View>
      {Loading ? <Loader /> : null}
    </View>
  );
};
const ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  errText: {
    fontSize: 10,
    color: '#FF3333',
  },

  textStyle: {
    color: 'gray',
  },
  existText: {
    color: 'gray',
    fontSize: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    color: 'black',
    borderRadius: 12,
  },
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
    borderRadius: 12,
    width: 300,
    color: 'black',
    paddingLeft: 12,
  },
  textInputTitle: {
    color: '#24786D',
    fontWeight: 'bold',
    fontSize: 9,
    marginLeft: 15,
  },
  inputContainer: {
    display: 'flex',
    gap: 5,
  },
  signupText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 20,
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
    fontSize: 15,
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
    fontSize: 13,
    fontWeight: '500',
  },
});
export default Signup;
