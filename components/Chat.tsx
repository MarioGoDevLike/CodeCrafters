import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {doc, onSnapshot} from 'firebase/firestore';
import {db} from '../config/firebase';
import Message from './Message';
import Input from './Input';
import Loader from './Loader';

const Chat = ({route}) => {
  const {userId, currentUserUid, userUsername} = route.params;
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState('');
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    console.log(currentUserUid);
    console.log(userId);
    const chatId =
      currentUserUid === userId
        ? userId + currentUserUid
        : currentUserUid + userId;
    console.log(chatId);
    setChatId(chatId);
    const unSub = onSnapshot(doc(db, 'chats', chatId), doc => {
      doc.exists() && setMessages(doc.data().messages);
      setLoading(false);
    });

    return () => {
      unSub();
    };
  }, [userId, currentUserUid]);

  return (
    <View style={{flex:1}}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{flex: 1}}>
          <View style={styles.header}>
            <Text style={{paddingLeft: 10, color: 'black', fontWeight: '300'}}>
              {userUsername}
            </Text>
          </View>
          <View>
            {messages.map(m => (
              <Message message={m} key={m.id} />
            ))}
          </View>
          {Loading ? <Loader /> : null}
        </View>
      </ScrollView>
      <Input userId={userId} chatId={chatId} />
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 50,
  },
});

export default Chat;
