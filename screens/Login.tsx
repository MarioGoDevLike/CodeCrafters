import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Dimensions,
} from 'react-native';
import React, {useState} from 'react';
import {Image} from 'react-native-animatable';
import {signInWithCredential, signInWithEmailAndPassword} from 'firebase/auth';
import useAuth from '../hooks/useAuth';
import {auth} from '../config/firebase';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {FacebookAuthProvider, GoogleAuthProvider} from 'firebase/auth/cordova';

GoogleSignin.configure({
  webClientId:
    '772567513029-v7spd6hdfu1aee6vgbmq6625j6ep3ogv.apps.googleusercontent.com',
});

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {user} = useAuth();

  const onFacebookButtonPress = async () =>{
   
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      console.log('data: ', data);
      throw 'Something went wrong obtaining access token';
    }
  
    const facebookCredential = FacebookAuthProvider.credential(data.accessToken);
  
    return signInWithCredential(auth, facebookCredential);
  }

  const _signInWithFacebook = async() =>{
    console.log('clicked');
    const credentials = await onFacebookButtonPress().then(() =>{
      console.log('Signing in with Facebook');
    })
  }


  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      const googleCredentials = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, googleCredentials).catch(err =>
        console.log(err),
      );
      navigation.navigate('HomeScreen');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('error! cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('error! progress error');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('error! not available rn');
      } else {
      }
    }
  };


  const handleLogin = async () => {
    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigation.navigate('HomeScreen');
      } catch (err) {
        console.log('got error: ', err.message);
      }
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleImagecontainer}>
        <Image
          style={styles.imageLogo}
          source={require('../assets/images/logoeremovebg.png')}
        />
      </View>
      <View style={styles.signupContainer}>
        <View>
          <Text style={styles.signupText}>Login</Text>
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
          <Text style={styles.textInputTitle}>Password</Text>
          <TextInput
            value={password}
            onChangeText={value => setPassword(value)}
            style={styles.defaultTextInput}
          />
        </View>

        <Pressable onPress={handleLogin} style={styles.button}>
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
        <Pressable onPress={() => signIn()}>
          <Image
            style={styles.image}
            source={require('../assets/images/googleIcon.webp')}
          />
        </Pressable>
        <Pressable onPress={() => _signInWithFacebook()}>
          <Image
            style={styles.image}
            source={require('../assets/images/facebook.webp')}
          />
        </Pressable>
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
    gap: 30,
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
    paddingLeft: 12,
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
  image: {
    width: 40,
    height: 40,
  },
  imagesContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
  },
  imageLogo: {
    width: 270,
    height: 150,
  },
  titleImagecontainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 0,
  },
  welcomeText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 15,
    margin: 0,
    padding: 0,
  },
});
export default Login;
