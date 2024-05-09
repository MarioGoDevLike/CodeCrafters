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
import React, {useEffect, useCallback, useMemo, useRef, useState} from 'react';
import {useAtom} from 'jotai';
import useAuth, {globalUid} from '../hooks/useAuth';
import {getDownloadURL, ref} from 'firebase/storage';
import {auth, db, storage} from '../config/firebase';
import {Image} from 'react-native-animatable';
import {doc, onSnapshot} from 'firebase/firestore';
import {clearUserEmail, getUserEmail} from '../components/RememberMe';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Loader from '../components/Loader';
import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import {TouchableOpacity} from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';

const ProfileScreen = ({navigation}) => {
  const [buttonName, setButtonName] = useState('');
  const [link, setLink] = useState('');
  const [uid, setUid] = useAtom(globalUid);
  const snapPoints = useMemo(() => ['25%', '50%', '70%'], []);
  const [url, setUrl] = useState('');
  const email = useAuth().user?.email;
  const [userInfo, setUserInfo] = useState<any | undefined>(null);
  const [expertise, setExpertise] = useState();
  const [role, setRole] = useState();
  const [gender, setGender] = useState();
  const [Loading, setLoading] = useState(false);
  const [Bio, setBio] = useState(
    'Just getting started. Excited to be a part of the community!',
  );

  const bottomSheetRef = useRef<BottomSheet>(null);
  // const bottomSheetRef2 = useRef<BottomSheet>(null);

  const handleClosePress = () => bottomSheetRef.current?.close();
  const handleOpenPress = () => bottomSheetRef.current?.expand();
  const handleCollapsePress = () => bottomSheetRef.current?.collapse();
  const snapeToIndex = (index: number) =>
    bottomSheetRef.current?.snapToIndex(index);
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    [],
  );

  const fetchData = async () => {
    setLoading(true);
    const docRef = doc(db, 'usersInfo', uid);

    const unsubscribe = onSnapshot(docRef, docSnap => {
      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
        setExpertise(docSnap.data()?.developmentExpertise);
        setRole(docSnap.data()?.role);
        setGender(docSnap.data()?.gender);
        const bio =
          docSnap.data()?.bio ||
          'Just getting started. Excited to be a part of the community!';
        setBio(bio);
        setLoading(false);
      } else {
        setLoading(false);
        console.log('No such document');
      }
    });

    return () => unsubscribe();
  };
  useEffect(() => {
    const storageRef = ref(storage, 'images/' + uid);
    getDownloadURL(storageRef).then(async (downloadURL: string) => {
      setUrl(downloadURL);
    });
    fetchData();
  }, []);

  const signOutUser = async () => {
    auth.signOut().then(
      function () {
        navigation.navigate('Login');
        clearUserEmail();
        console.log('Signed Out');
      },
      function (error) {
        console.error('Sign Out Error', error);
      },
    );
  };
  const handlePressGithub = () => {
    bottomSheetRef.current?.expand();
    setButtonName('Github');
  };
  const handlePressLinkedIn = () => {
    bottomSheetRef.current?.expand();
    setButtonName('LinkedIn');
  };
  const handlePressPortfolio = () => {
    bottomSheetRef.current?.expand();
    setButtonName('Portfolio');
  };
  
  const handleSaveLink = () => {
    if (buttonName === 'Github') {
      firestore()
        .collection('usersInfo')
        .doc(uid)
        .update({
          github: link,
        })
        .then(res => {
          Alert.alert('Database updated.');
        })
        .catch(err => {
          console.log(err);
          Alert.alert('Error Happened');
        });
    } else if (buttonName === 'LinkedIn') {
      firestore()
        .collection('usersInfo')
        .doc(uid)
        .update({
          linkedIn: link,
        })
        .then(res => {
          Alert.alert('Database updated.');
        })
        .catch(err => {
          console.log(err);
          Alert.alert('Error Happened');
        });
    }else if(buttonName === 'Portfolio'){
      firestore()
        .collection('usersInfo')
        .doc(uid)
        .update({
          portfolio:link,
        })
        .then(res => {
          Alert.alert('Database updated.');
        })
        .catch(err => {
          console.log(err);
          Alert.alert('Error Happened');
        });
  }
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
              fontSize: 20,
              fontFamily: 'MarkaziText-Medium',
              color: 'white',
            }}>
            {userInfo?.username}
          </Text>
          <View style={styles.passwordContainer2}>
            <Text style={styles.inputBio}>{Bio}</Text>
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
          <View
            style={{
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexDirection: 'column',
              gap: 20,
            }}>
            <Text style={{color: '#24786D', fontWeight: '500', fontSize: 15}}>
              Social Links
            </Text>
            <View style={{display: 'flex', gap: 20, flexDirection: 'row'}}>
              <IonIcon.Button
                style={{backgroundColor: '#fff'}}
                onPress={handlePressGithub}
                size={30}
                name="logo-github"
                color={'black'}
              />
              <IonIcon.Button
                onPress={handlePressLinkedIn}
                style={{backgroundColor: '#fff'}}
                size={30}
                name="logo-linkedin"
                color={'#0a66c2'}
              />
              <IonIcon.Button
                onPress={handlePressPortfolio}
                style={{backgroundColor: '#fff'}}
                size={30}
                name="link-outline"
                color={'black'}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              onPress={() => navigation.navigate('EditProfile')}
              style={styles.buttons}>
              <Text style={styles.text}>Edit Profile</Text>
            </Pressable>
            <Pressable onPress={signOutUser} style={styles.buttons}>
              <Text style={styles.text}>Logout</Text>
            </Pressable>
          </View>
        </View>
      </View>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleIndicatorStyle={{backgroundColor: '#fff'}}
        backgroundStyle={{backgroundColor: '#d3d3d3'}}
        backdropComponent={renderBackdrop}>
        <View style={styles.contentContainer}>
          <Text>Enter Your {buttonName} Account</Text>
          <TextInput
            onChangeText={link => setLink(link)}
            placeholder={`Enter your ${buttonName} link`}
            style={{
              borderWidth: 1,
              borderColor: '#fff',
              borderRadius: 10,
              padding: 10,
              opacity: 0.4,
            }}
          />
          <TouchableOpacity
            onPress={handleSaveLink}
            style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text
              style={{
                color: 'white',
                fontWeight: 'bold',
                backgroundColor: '#24786D',
                padding: 10,
                paddingLeft: 30,
                paddingRight: 30,
              }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
      {Loading ? <Loader /> : null}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  contentContainer: {
    display: 'flex',
    gap: 20,
    padding: 10,
  },
  passwordContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width: 150,
  },
  passwordContainer2: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    width: 200,
    paddingBottom: 20,
  },

  text: {
    color: '#24786D',
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
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#24786D',
    paddingTop: 20,
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
  },

  input: {
    fontSize: 12,
    color: 'black',
  },
  inputBio: {
    fontSize: 11,
    color: 'white',
    fontWeight: '300',
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
    height: 750,
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
    borderColor: '#24786D',
    borderWidth: 1,
    padding: 10,
    opacity: 0.9,
  },
});

export default ProfileScreen;
