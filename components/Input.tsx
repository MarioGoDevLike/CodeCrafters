import { View, TextInput, StyleSheet } from 'react-native';
import React, { useContext, useState } from 'react';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { ChatContext } from '../config/chatContext';
import { db } from '../config/firebase';
import { Timestamp, arrayUnion, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useAtom } from 'jotai';
import { globalUid } from '../hooks/useAuth';
import uuid from 'react-native-uuid';

const Input = ({ chatId, userId }) => {
  const [text, setText] = useState('');
  const { data } = useContext(ChatContext);
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
      borderWidth: 1,
      borderColor: '#d3d3d3',
      width: 300,
      backgroundColor: '#fff',
    },
    mainContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    iconStyle: {
      padding: 15,
      backgroundColor: '#0390fc',
      height: 50,
    },
  });

export default Input;
