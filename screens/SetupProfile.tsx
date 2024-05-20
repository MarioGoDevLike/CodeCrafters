import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  Alert,
  ScrollView,
  Button,
  Platform,
} from 'react-native';
import React, {useState} from 'react';
import {CountryPicker} from 'react-native-country-codes-picker';
import {TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import CheckBox from 'react-native-check-box';
import {firebase} from '@react-native-firebase/firestore';
import Loader from '../components/Loader';
import * as ImagePicker from 'react-native-image-picker';

import {auth, db, storage} from '../config/firebase';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  launchImageLibrary as _launchImageLibrary,
  launchCamera as _launchCamera,
} from 'react-native-image-picker';
import {Image} from 'react-native-animatable';
import {uploadBytesResumable, getDownloadURL, ref} from 'firebase/storage';
import { doc, setDoc} from 'firebase/firestore';
import messaging from '@react-native-firebase/messaging';

const SetupProfile = ({navigation}) => {
  const uid = auth.currentUser?.uid;
  const [show, setShow] = useState(false);
  const [selectedGender, setSelectedGender] = useState('');
  const [countryCode, setCountryCode] = useState('CC');
  const [isCheckedTechnology, setisCheckedTechnology] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('');
  const [username, setUsername] = useState('');
  const [DevelopmentExpertise, setDevelopmentExpertise] = useState('');
  const [data, setAddData] = useState('');
  const [Loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [userImage, setUserImage] = useState('');

  let launchImageLibrary = _launchImageLibrary;
  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, handleResponse);
  };
  
  const handleResponse = response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('Image picker error: ', response.error);
    } else {
      let imageUri = response.uri || response.assets?.[0]?.uri;
      uploadImage(imageUri, 'image');
    }
  };
  const uploadImage = async (uri, fileType) => {
    setLoading(true);
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, 'images/' + uid);
    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on(
      'state_changed',
      snapshot => {},
      error => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
          console.log('File available at ', downloadURL);
          setUserImage(downloadURL);
          setLoading(false);
          setImage('');
        });
      },
    );
  };

  const todoRef = firebase.firestore().collection('usersInfo');

  const addData = async () => {
    const uid = auth.currentUser?.uid;
    setLoading(true);

    if (
      phoneNumber &&
      countryCode &&
      selectedGender &&
      role &&
      username &&
      DevelopmentExpertise
    ) {

      const fcmToken = await messaging().getToken();
      console.log(fcmToken);
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      
      const data = {
        username: username,
        countryCode: countryCode,
        phoneNumber: phoneNumber,
        gender: selectedGender,
        role: role,
        developmentExpertise: DevelopmentExpertise,
        isCheckedTechnology: isCheckedTechnology,
        login: timestamp,
        uid: uid,
        photoUrl:userImage,
        userFcm: fcmToken,
      };

      todoRef
        .doc(uid)
        .set(data)
        .then(() => {
          setAddData('');
          Keyboard.dismiss();
          setLoading(false);
          console.log('success');
          setDoc(doc(db, 'userChats', uid), {});
          navigation.navigate('HomeScreen');
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.MainContainer}>
        <View style={styles.titlesContainer}>
          <Text style={styles.title1}>Welcome to Code Crafters</Text>
          <Text style={styles.title2}>Complete your profile setup</Text>
        </View>
        <View style={{flex: 1, justifyContent: 'center'}}>
          {image && (
            <Image
              source={{uri: image}}
              style={{flex: 1}}
              resizeMode="contain"
            />
          )}
          <View style={styles.imageContainer}>
            <Pressable onPress={openImagePicker} style={styles.addPhoto}>
              <Icon
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                name={'add-a-photo'}
                size={20}
                color="white"
              />
            </Pressable>
            <Image
              style={styles.profileImage}
              source={
                userImage
                  ? {uri: userImage}
                  : require('../assets/images/emptyProfile.webp')
              }
            />
          </View>
        </View>

        <View style={styles.usernameInput1}>
          <Text style={styles.textPhone}>Username</Text>
          <View>
            <TextInput
              placeholder="Enter your Username"
              value={username}
              onChangeText={value => setUsername(value)}
              style={styles.textInputUsername}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textPhone}>Phone number</Text>
          <View style={styles.phoneNumberInput}>
            <TouchableOpacity
              onPress={() => setShow(true)}
              style={styles.countryTouchable}>
              <Text style={styles.countryCodeText}>{countryCode}</Text>
            </TouchableOpacity>
            <CountryPicker
              show={show}
              pickerButtonOnPress={item => {
                setCountryCode(item.dial_code);
                setShow(false);
              }}
              lang={'pl'}
            />
            <TextInput
              placeholder="Enter your phone Number"
              value={phoneNumber}
              onChangeText={value => setPhoneNumber(value)}
              style={styles.textInputPh}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textPhone}>Gender</Text>
          <Picker
            style={styles.pickerStyle}
            selectedValue={selectedGender}
            onValueChange={(itemValue, itemIndex) => {
              setSelectedGender(itemValue);
            }}>
            <Picker.Item style={styles.labelText} label="Male" value="Male" />
            <Picker.Item
              style={styles.labelText}
              label="Female"
              value="Female"
            />
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textPhone}>Role</Text>
          <Picker
            style={styles.pickerStyle}
            selectedValue={role}
            onValueChange={(itemValue, itemIndex) => {
              setRole(itemValue);
            }}>
            <Picker.Item
              style={styles.labelText}
              label="FrontEnd Developer"
              value="Frontend Developer"
            />
            <Picker.Item
              style={styles.labelText}
              label="Backend Developer"
              value="Backend Developer"
            />
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textPhone}>Development Expertise</Text>
          <Picker
            style={styles.pickerStyle}
            selectedValue={DevelopmentExpertise}
            onValueChange={(itemValue, itemIndex) => {
              setDevelopmentExpertise(itemValue);
            }}>
            <Picker.Item
              style={styles.labelText}
              label="Mobile Development"
              value="Mobile Development"
            />
            <Picker.Item
              style={styles.labelText}
              label="Web Development"
              value="Web Development"
            />
          </Picker>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textPhone}>Technology News</Text>
          <CheckBox
            style={{width: 300}}
            checkedCheckBoxColor="#24786D"
            rightTextStyle={styles.rightTextStyle}
            onClick={() => {
              setisCheckedTechnology(!isCheckedTechnology);
            }}
            isChecked={isCheckedTechnology}
            rightText={"I'm Interested in Getting Technology NEWS "}
          />
        </View>

        <Pressable onPress={addData} style={styles.button}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
        {Loading ? <Loader /> : null}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    height: 70,
    width: 70,
    borderRadius: 40,
    position: 'absolute',
  },
  addPhoto: {
    backgroundColor: '#e3e3e3',
    opacity: 0.5,
    height: 70,
    width: 70,
    borderRadius: 40,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  usernameInput1: {
    display: 'flex',
    width: 300,
    gap: 10,
  },
  rightTextStyle: {
    color: 'black',
    fontWeight: '300',
  },
  button: {
    backgroundColor: '#24786D',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    height: 50,
    width: 300,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 23,
  },
  MainContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 12,
  },
  titlesContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    height: 100,
  },
  title1: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    fontFamily: 'MarkaziText-Bold',
  },
  title2: {
    fontSize: 13,
    color: 'gray',
    fontWeight: '300',
  },
  phoneNumberInput: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  countryTouchable: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3e3e3',
    borderRadius: 5,
    height: 50,
    width: 80,
  },
  countryCodeText: {
    color: 'black',
    fontSize: 20,
  },
  textInputPh: {
    backgroundColor: '#e3e3e3',
    borderRadius: 5,
    height: 50,
    width: 210,
    padding: 10,
  },
  textInputUsername: {
    backgroundColor: '#e3e3e3',
    borderRadius: 5,
    height: 50,
    width: 300,
    padding: 10,
  },
  inputContainer: {
    display: 'flex',
    gap: 10,
  },
  textPhone: {
    color: '#24786D',
    fontWeight: '500',
    fontSize: 15,
  },
  pickerStyle: {
    backgroundColor: '#e3e3e3',
    width: 300,
    borderRadius: 15,
    borderColor: 'green',
  },
  labelText: {
    fontSize: 13,
  },
});
export default SetupProfile;
