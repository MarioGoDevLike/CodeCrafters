import {View, Text, StyleSheet} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {ChatContext} from '../config/chatContext';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import Message from './Message';

const Chat = ({route}) => {
  const {userId, currentUserUid, userUsername} = route.params;

  const [messages, setMessages] = useState([]);

  useEffect(()=>{
    const unSub = onSnapshot(doc(db,"chats", userId + currentUserUid), (doc)=>{
        doc.exists() && setMessages(doc.data().messages);
    },)
    console.log(messages);
    return()=>{
        unSub();
    }
  },[data.chatId]);

  return (
    <View>
      <View style={styles.header}>
        <Text style={{paddingLeft: 10, color: 'black', fontWeight: '300'}}>
          {userUsername}
        </Text>

        {messages.map((m)=>(
            <Message message={m} key={m.id} />  
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Chat;
