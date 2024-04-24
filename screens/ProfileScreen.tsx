import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
  Button,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAtom} from 'jotai';
import useAuth, {globalUid} from '../hooks/useAuth';
import {getDownloadURL, ref} from 'firebase/storage';
import {db, storage} from '../config/firebase';
import {Image} from 'react-native-animatable';
import {collection, doc, getDoc, getDocs} from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getUserEmail} from '../components/RememberMe';
import firestore from '@react-native-firebase/firestore';
import * as firebase from 'firebase/compat/app';

const ProfileScreen = ({navigation}) => {
  const [uid, setUid] = useAtom(globalUid);
  const [url, setUrl] = useState();
  const email = useAuth().user?.email;

  const [userInfo, setUserInfo] = useState<any | undefined>(null);
  const [expertise, setExpertise] = useState();
  const [role, setRole] = useState();
  const [gender, setGender] = useState();
  // const {user, logout} = useAuth();

  const fetchData = async () => {
    const docRef = doc(db, 'usersInfo', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserInfo(docSnap.data());
      setExpertise(docSnap.data()?.developmentExpertise);
      setRole(docSnap.data()?.role);
      setGender(docSnap.data()?.gender);
      console.log('retrieved Successfully');
    } else {
      console.log('No Such Document');
    }
  };
  useEffect(() => {
    const storageRef = ref(storage, 'images/' + uid);
    getDownloadURL(storageRef).then(async downloadURL => {
      setUrl(downloadURL);
    });
    fetchData();
  }, []);

  const updateProfile = () => {
    firestore()
      .collection('usersInfo')
      .doc(uid)
      .update({
        developmentExpertise: expertise,
        role: role,
        gender: gender,
      })
      .then(res => {
        Alert.alert('Profile updated.');
      })
      .catch(err => {
        console.log(err);
        Alert.alert('Error Happened');
      });
  };
  const signOutUser = async () => {
    // await logout();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View>
        <View style={styles.headerContainer}>
          <Image
            style={styles.picStyle}
            source={
              url ? {uri: url} : require('../assets/images/emptyProfile.webp')
            }
          />

          <Text
            style={{
              paddingTop: 5,
              fontSize: 15,
              fontFamily: 'MarkaziText-Medium',
              color: 'white',
            }}>
            @{userInfo?.username}
          </Text>
          <View style={styles.buttonContainer}>
            <Pressable onPress={updateProfile} style={styles.buttons}>
              <Text style={styles.text}>Update Profile</Text>
            </Pressable>
            <Pressable onPress={signOutUser} style={styles.buttons}>
              <Text style={styles.text}>Logout</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.passwordContainer}>
            <Text style={styles.textInputTitle}>Expertise:</Text>

            <TextInput
              // secureTextEntry={!showPassword}
              value={expertise}
              onChangeText={value => setExpertise(value)}
              style={styles.input}
            />
          </View>
          <View style={styles.passwordContainer}>
            <Text style={styles.textInputTitle}>Role:</Text>
            <TextInput
              // secureTextEntry={!showPassword}
              value={role}
              onChangeText={value => setRole(value)}
              style={styles.input}
            />
          </View>
          <View style={styles.passwordContainer}>
            <Text style={styles.textInputTitle}>Email:</Text>
            <TextInput
              value={email}
              // secureTextEntry={!showPassword}
              // onChangeText={value => setPassword(value)}
              style={styles.input}
            />
          </View>
          <View style={styles.moreInfoContainer}>
            <Text style={styles.smallTitle}>
              More about {userInfo?.username}
            </Text>
            <View style={styles.infoContainer}>
              <View style={styles.passwordContainer}>
                <Text style={styles.textInputTitle}>Gender:</Text>

                <TextInput
                  value={gender}
                  onChangeText={value => setGender(value)}
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.infoContainer}>
              <View style={styles.passwordContainer}>
                <Text style={styles.textInputTitle}>Phone Number:</Text>

                <TextInput
                  value={userInfo?.countryCode + '  ' + userInfo?.phoneNumber}
                  style={styles.input}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontWeight:'300',
    fontSize:10,
  },
  tabBarIcon: {},
  picStyle: {
    width: 80,
    height: 80,
    resizeMode: 'stretch',
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 2,
  },
  headerContainer: {
    height: 210,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#24786D',
  },
  inputContainer: {
    display: 'flex',
    gap: 10,
    padding: 20,
  },
  textInputTitle: {
    color: '#24786D',
    fontWeight: 'bold',
    fontSize: 9,
    marginLeft: 15,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: 'black',
    borderRadius: 30,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  moreInfoContainer: {
    display: 'flex',
    gap: 10,
  },
  smallTitle: {
    padding: 5,
    color: '#24786D',
    opacity: 0.5,
    fontSize: 10,
    fontWeight: 'bold',
    display: 'flex',
  },
  infoContainer: {
    display: 'flex',
  },
  infoMiniContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    padding: 10,
    marginBottom:10,
  },
  buttons: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    borderColor: 'white',
    borderWidth: 1,
    padding: 10,
    opacity: 0.9,
  },
});

export default ProfileScreen;
