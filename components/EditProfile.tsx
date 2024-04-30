import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  Pressable,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAtom} from 'jotai';
import useAuth, {globalUid} from '../hooks/useAuth';
import {doc, getDoc} from 'firebase/firestore';
import {db, storage} from '../config/firebase';
import {getDownloadURL, ref} from 'firebase/storage';
import firestore from '@react-native-firebase/firestore';
import Loader from './Loader';

const EditProfile = () => {
  const [uid, setUid] = useAtom(globalUid);
  //   const [url, setUrl] = useState();
  const email = useAuth().user?.email;
  const [userInfo, setUserInfo] = useState<any | undefined>(null);
  const [expertise, setExpertise] = useState();
  const [role, setRole] = useState();
  const [gender, setGender] = useState();
  const [username, setUsername] = useState();
  const [Loading, setLoading] = useState(false);

  // const {user, logout} = useAuth();

  const fetchData = async () => {
    setLoading(true);
    const docRef = doc(db, 'usersInfo', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserInfo(docSnap.data());
      setExpertise(docSnap.data()?.developmentExpertise);
      setRole(docSnap.data()?.role);
      setGender(docSnap.data()?.gender);
      setUsername(docSnap.data()?.username);
      setLoading(false);
      console.log('retrieved Successfully');
    } else {
      setLoading(false);

      console.log('No Such Document');
    }
  };
  useEffect(() => {
    // const storageRef = ref(storage, 'images/' + uid);
    // getDownloadURL(storageRef).then(async downloadURL => {
    //   setUrl(downloadURL);
    // });
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
        username: username,
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
      <View style={styles.MainContainer}>
        <View style={styles.inputContainer}>
          <View style={styles.passwordContainer}>
            <Text style={styles.textInputTitle}>Username:</Text>
            <TextInput
              // secureTextEntry={!showPassword}
              value={username}
              onChangeText={value => setUsername(value)}
              style={styles.input}
            />
          </View>
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
          <View style={styles.passwordContainer}>
            <Text style={styles.textInputTitle}>Country Code:</Text>
            <Text style={styles.textStyle}>{userInfo?.countryCode}</Text>
          </View>
          <View style={styles.passwordContainer}>
            <Text style={styles.textInputTitle}>Phone Number:</Text>
            <Text style={styles.textStyle}>{userInfo?.phoneNumber}</Text>
          </View>

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

          <Pressable onPress={updateProfile} style={styles.buttons}>
            <Text style={styles.text}>Update Profile</Text>
          </Pressable>
        </View>
        {Loading ? <Loader /> : null}
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  text: {
    color: 'white',
  },
  MainContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 20,
  },
  passwordContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 5,
  },
  textInputTitle: {
    color: '#24786D',
    fontWeight: '700',
    fontSize: 12,
  },
  inputContainer: {
    display: 'flex',
    gap: 15,
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 5,
    width: 300,
    paddingLeft: 10,
  },
  textStyle: {
    backgroundColor: 'white',
    borderColor: '#d3d3d3',
    borderWidth: 1,
    borderRadius: 5,
    width: 300,
    paddingLeft: 10,
    height: 50,
    color: 'black',
    textAlignVertical: 'center',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#24786D',
    padding: 10,
  },
});
export default EditProfile;
