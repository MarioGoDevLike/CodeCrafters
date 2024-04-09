import {View, Text, StyleSheet, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native-animatable';
import {auth, storage} from '../config/firebase';
import {getDownloadURL, ref} from 'firebase/storage';
import {onAuthStateChanged} from 'firebase/auth';
import useAuth from '../hooks/useAuth';

const PostScreen = () => {
  const {user} = useAuth();
  const [postText, setPostText] = useState('');
  const [url, setUrl] = useState();

  useEffect(() => {
    const storageRef = ref(storage, 'images/' + user.uid);
    getDownloadURL(storageRef).then(async downloadURL => {
      setUrl(downloadURL);
    });
  }, []);

  return (
    <View style={styles.mainContainer}>
      <View style={styles.postContainer}>
        <Image
          style={styles.picStyle}
          source={
            url ? {uri: url} : require('../assets/images/emptyProfile.webp')
          }
        />
        <TextInput
          value={'hi'}
          onChangeText={value => setPostText(value)}
          style={styles.defaultTextInput}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {},
  postContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  picStyle: {
    width: 30,
    height: 30,
    resizeMode:'stretch',
    borderRadius: 50,
  },
});

export default PostScreen;
