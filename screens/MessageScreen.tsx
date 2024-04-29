import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {Image} from 'react-native-animatable';
import {db} from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import {useAtom} from 'jotai';
import {globalUid} from '../hooks/useAuth';
import {ChatContext} from '../config/chatContext';

const MessageScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const [globaluid, setUid] = useAtom(globalUid);
  const [userInfo, setUserInfo] = useState<any | undefined>(null);
  const [chats, setChats] = useState([]);
  const [userSaved, setUserSaved] = useState(null);

  const {dispatch} = useContext(ChatContext);
  const fetchData = async () => {
    const currentUid = globaluid;
    const docRef = doc(db, 'usersInfo', currentUid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserInfo(docSnap.data());
    } else {
      console.log('No Such Document');
    }
  };
  useEffect(() => {
    fetchData();
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChats', globaluid), doc => {
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    };
    globaluid && getChats();
  }, [globaluid]);

  const handleSelect = async () => {
    const combinedId =
      globaluid > user.uid ? globaluid + user.uid : user.uid + globaluid;
    console.log('started');

    try {
      const res = await getDoc(doc(db, 'chats', combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, 'chats', combinedId), {messages: []});

        await updateDoc(doc(db, 'userChats', globaluid), {
          [combinedId + '.userInfo']: {
            uid: user.uid,
            username: user.username,
            photoUrl: user.photoUrl,
          },
          [combinedId + '.date']: serverTimestamp(),
        });
        await updateDoc(doc(db, 'userChats', user.uid), {
          [combinedId + '.userInfo']: {
            uid: globaluid,
            username: userInfo?.username,
            photoUrl: userInfo?.photoUrl,
          },
          [combinedId + '.date']: serverTimestamp(),
        });
      }
    } catch (err) {}
    setUsername('');
    setUserSaved(user);
    setUser(null);
  };

  const handleSearch = async () => {
    const q = query(
      collection(db, 'usersInfo'),
      where('username', '==', username),
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(doc => {
        setUser(doc.data());
        setErr(false);
      });
    } catch (err) {
      setUser(null);
      setErr(true);
    }
  };

  const handlePress = userInfo => {
    navigation.navigate('Chat', {
      userId: userInfo.uid,
      currentUserUid: globaluid,
      userUsername: userInfo.username,
    });
  };

  return (
    <View
      style={{padding: 10, display: 'flex', flexDirection: 'column', gap: 10}}>
      <View style={styles.searchBar}>
        <TextInput
          onChangeText={text => setUsername(text)}
          style={{fontSize: 10}}
          placeholder="Search for user"
          onSubmitEditing={handleSearch}
        />
      </View>
      {err && <Text>User not found!</Text>}
      {user ? (
        <TouchableOpacity onPress={handleSelect}>
          <View style={styles.userFound}>
            <Image
              style={{height: 40, width: 40, borderRadius: 30}}
              source={{uri: user.photoUrl}}
            />
            <Text style={{fontSize: 10}}>{user.username}</Text>
          </View>
        </TouchableOpacity>
      ) : null}

      {chats
        ? Object.entries(chats)?.map(([chatId, chatData]) => (
            <TouchableOpacity onPress={() => handlePress(chatData.userInfo)}>
              <View key={chatId} style={styles.userInfoContainer}>
                <Image
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 50,
                    resizeMode: 'stretch',
                  }}
                  source={{uri: chatData?.userInfo?.photoUrl}}
                />
                <View style={{display: 'flex', flexDirection: 'column'}}>
                  <Text style={{fontSize: 12, fontWeight: '300'}}>
                    {chatData.userInfo.username}
                  </Text>
                  <Text>{chatData.lastMessage?.text}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        : null}
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    paddingLeft: 10,
    borderWidth: 1,
    borderColor: '#d3d3d3',
    borderRadius: 30,
    fontSize: 10,
  },
  userFound: {
    paddingLeft: 10,
    display: 'flex',
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
    padding: 10,
    gap: 10,
  },
});
export default MessageScreen;
