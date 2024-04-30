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
import {collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome';
import {getUserEmail} from '../components/RememberMe';
import firestore from '@react-native-firebase/firestore';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Loader from '../components/Loader';

const ProfileScreen = ({navigation}) => {
  const [uid, setUid] = useAtom(globalUid);
  const [url, setUrl] = useState();
  const email = useAuth().user?.email;
  const [userInfo, setUserInfo] = useState<any | undefined>(null);
  const [expertise, setExpertise] = useState();
  const [role, setRole] = useState();
  const [gender, setGender] = useState();
  const [Loading, setLoading] = useState(false);
  // const {user, logout} = useAuth();

  const fetchData = async () => {
    setLoading(true);
    const docRef = doc(db, 'usersInfo', uid);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
        setExpertise(docSnap.data()?.developmentExpertise);
        setRole(docSnap.data()?.role);
        setGender(docSnap.data()?.gender);
        setLoading(false);
        console.log('Document updated successfully');
      } else {
        setLoading(false);
        console.log('No such document');
      }
    });
  
    return () => unsubscribe();
  };
  useEffect(() => {
    const storageRef = ref(storage, 'images/' + uid);
    getDownloadURL(storageRef).then(async downloadURL => {
      setUrl(downloadURL);
    });
    fetchData();
  }, []);
  
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
            <Pressable onPress={()=> navigation.navigate('EditProfile')} style={styles.buttons}>
              <Text style={styles.text}>Edit Profile</Text>
            </Pressable>
            <Pressable onPress={signOutUser} style={styles.buttons}>
              <Text style={styles.text}>Logout</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <View style={{display: 'flex', flexDirection: 'row', gap: 70}}>
            <View style={styles.passwordContainer}>
              <Text style={styles.textInputTitle}>Expertise:</Text>
              <Text style={styles.input}>{expertise}</Text>
            </View>
            <View style={styles.passwordContainer}>
              <Text style={styles.textInputTitle}>Role:</Text>
              <Text style={styles.input}>{role}</Text>
            </View>
          </View>
          <View style={{display: 'flex', flexDirection: 'row', gap: 70}}>
            <View style={styles.passwordContainer}>
              <Text style={styles.textInputTitle}>Email:</Text>
              <Text style={styles.input}>{email}</Text>
            </View>
            <View style={styles.passwordContainer}>
              <Text style={styles.textInputTitle}>Gender:</Text>
              <Text style={styles.input}>{gender}</Text>
            </View>
          </View>
          <View style={styles.moreInfoContainer}>
            <View style={styles.infoContainer}></View>
            <View style={styles.infoContainer}>
              <View style={styles.passwordContainer}>
                <Text style={styles.textInputTitle}>Phone Number:</Text>

                <Text style={styles.input}>
                  {userInfo?.countryCode + '  ' + userInfo?.phoneNumber}
                </Text>
              </View>
            </View>
          </View>
          <View style={{justifyContent:'flex-end', alignItems:'center', flexDirection:'column', gap:20,height:150}}>
            <Text style={{color:'#24786D', fontWeight:'500', fontSize:15,}}>Social Links</Text>
            <View style={{display:'flex', gap:20, flexDirection:'row',}}>
              <IonIcon size={30} name='logo-github' color={'black'} />
              <IonIcon size={30} name='logo-linkedin' color={'#0a66c2'}/>
              <IonIcon size={30} name='link-outline' color={'black'}/>
            </View>
          </View>
        </View>
      </View>
      {Loading ? <Loader /> : null}

    </ScrollView>
    
  );
};
const styles = StyleSheet.create({
  passwordContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width:150,
  },
  text: {
    color: 'white',
    fontWeight: '300',
    fontSize: 10,
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
    gap: 20,
    padding: 10,
  },
  textInputTitle: {
    color: '#24786D',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 0,
  },
  input: {
    flex: 1,
    fontSize: 12,
    color: 'black',
    borderRadius: 30,
  },

  moreInfoContainer: {
    display: 'flex',
    gap: 5,
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
    marginBottom: 10,
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
