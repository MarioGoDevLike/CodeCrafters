import {View, Text, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Image} from 'react-native-animatable';
import {ChatContext} from '../config/chatContext';
import {useAtom} from 'jotai';
import {globalUid} from '../hooks/useAuth';
import {doc, getDoc} from 'firebase/firestore';
import {db} from '../config/firebase';

const Message = ({message}) => {
  const [currentUser, setCurrentUser] = useAtom(globalUid);
  const [userPhotoUrl, setUserPhotoUrl] = useState('');
  const [senderPhotoUrl, setSenderPhotoUrl] = useState('');

  const fetchPhoto = async () => {
    try {
      const docRef = doc(db, 'usersInfo', currentUser);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserPhotoUrl(docSnap.data().photoUrl);
      } else {
        console.log('No Such Document');
        return null;
      }
    } catch (error) {
      console.error('Error fetching photo:', error);
      return null;
    }
  };

  const fetchSenderPhoto = async () => {
    try {
      const docRef = doc(db, 'usersInfo', message.senderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSenderPhotoUrl(docSnap.data().photoUrl);
      } else {
        console.log('No Such Document');
        return null;
      }
    } catch (error) {
      console.error('Error fetching photo:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchPhoto();
    fetchSenderPhoto();
  }, []);

  return (
    <View
      style={
        message.senderId === currentUser
          ? styles.MainContainerLeft
          : styles.MainContainerRight
      }>
      <View
        style={
          message.senderId === currentUser
            ? styles.messageOwnerRight
            : styles.messageOwnerLeft
        }>
        <View style={styles.messageInfo}>
          <Image
            style={{
              height: 40,
              width: 40,
              borderRadius: 50,
              resizeMode: 'stretch',
            }}
            source={{
              uri:
                message.senderId === currentUser
                  ? userPhotoUrl
                  : senderPhotoUrl,
            }}
          />
        </View>
        <View style={styles.messageContent}>
          <Text
            style={
              message.senderId === currentUser
                ? styles.textRight
                : styles.textLeft
            }>
            {message.text}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainerLeft: {
    display: 'flex',
    padding: 10,
    flexDirection: 'row-reverse',
  },
  textLeft: {
    color: 'white',
    fontSize:12,
  },
  textRight: {
    fontSize:12,
  },
  MainContainerRight: {
    display: 'flex',
    padding: 10,
    flexDirection: 'row',
  },
  messageInfo: {
    flexDirection: 'column',
  },
  messageOwnerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap:10,
    justifyContent: 'flex-start',
    backgroundColor: '#228B22',
    borderRadius: 40,
    padding: 10,
  },
  messageOwnerRight: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
    borderRadius: 40,
    padding: 10,
    gap:10,

  },
  messageContent: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});

export default Message;
