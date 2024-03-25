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
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
import Icon from 'react-native-vector-icons/FontAwesome';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {FacebookAuthProvider, GoogleAuthProvider} from 'firebase/auth/cordova';
import Loader from '../components/Loader';

GoogleSignin.configure({
  webClientId:
    '772567513029-v7spd6hdfu1aee6vgbmq6625j6ep3ogv.apps.googleusercontent.com',
});
const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [Loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const {user} = useAuth();

  const onFacebookButtonPress = async () => {
    setLoading(true);
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (result.isCancelled) {
      setLoading(false);
      throw 'User cancelled the login process';
    }
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      setLoading(false);
      console.log('data: ', data);
      throw 'Something went wrong obtaining access token';
    }

    const facebookCredential = FacebookAuthProvider.credential(
      data.accessToken,
    );
    setLoading(false);
    return signInWithCredential(auth, facebookCredential);
  };

  const _signInWithFacebook = async () => {
    const credentials = await onFacebookButtonPress().then(() => {
      console.log('Signing in with Facebook');
      navigation.navigate('HomeScreen');
    });
  };

  const signIn = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      const googleCredentials = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, googleCredentials).catch(err =>
        console.log(err),
      );
      setLoading(false);
      navigation.navigate('HomeScreen');
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setLoading(false);
        console.log('error! cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setLoading(false);
        console.log('error! progress error');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setLoading(false);
        console.log('error! not available rn');
      } else {
      }
    }
  };

  const handleLogin = async () => {
    setLoading(true);

    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
        setLoading(false);
        navigation.navigate('HomeScreen');
      } catch (err) {
        setLoading(false);
        console.log('got error: ', err.message);
        if(err.message == 'Firebase: Error (auth/invalid-email).'){
          setErr('Invalid email');
        }else if(err.message == 'Firebase: Error (auth/invalid-credential).'){
          setErr('Invalid password or email');
        }
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
          {<View style={styles.errContainer}><Text style={styles.errText}>{err}</Text></View>}
        </View>

        <Pressable onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>
        <View style={styles.Tcontainer}>
          <Text style={styles.textStyle}>Don't have an Account?</Text>
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
      {Loading ? <Loader /> : null}
    </View>
  );
};
const ScreenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  textStyle: {
    color: 'gray',
    fontSize:9,
  },
  errContainer:{
  //   display:'flex',
  //   alignItems:'center',
  //   justifyContent:'center',
  },

  errText:{
    fontSize:10,
    color:'#FF3333',
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
    borderRadius: 30,
  },

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
    color: 'black',
    backgroundColor: 'white',
    borderRadius: 12,
    width: 300,
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
    fontSize: 20,
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
    fontSize: 10,
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
  icon: {
    marginTop: 10,
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
