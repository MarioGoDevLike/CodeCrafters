import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import React, { useState } from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { db } from '../config/firebase';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useAtom } from 'jotai';
import { globalUid } from '../hooks/useAuth';
import uuid from 'react-native-uuid';

const Input = ({ chatId, userId }) => {
  const [text, setText] = useState('');
  
  const [uid] = useAtom(globalUid);

  const handleSend = async () => {
    await updateDoc(doc(db, "chats", chatId), {
      messages: arrayUnion({
        id: uuid.v4(),
        text,
        senderId: uid,
        date: Timestamp.now(),
      }),
    });

    await updateDoc(doc(db, "userChats", uid), {
      [chatId + ".lastMessage"]: {
        text,
      },
      [chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", userId), {
      [chatId + ".lastMessage"]: {
        text,
      },
      [chatId + ".date"]: serverTimestamp(),
    });

    setText("");
  };
  
  return (
    <View style={styles.mainContainer}>
      <TextInput
        placeholder="Enter your Message"
        style={styles.textInput}
        value={text}
        onChangeText={setText}
      />
      <IonIcon.Button onPress={handleSend} style={styles.iconStyle} size={20} name="send" />
    </View>
  );
};

const styles = StyleSheet.create({
    textInput: {
      height:60,
      borderWidth: 1,
      borderColor: '#d3d3d3',
      backgroundColor: '#fff',
      flex:1
    },
    mainContainer: {
      width:Dimensions.get('window').width,
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    iconStyle: {
      backgroundColor: '#0390fc',
      height: 50,
      flex:1,
      justifyContent:'center',
      padding:10,
    },
    
  });

export default Input;
