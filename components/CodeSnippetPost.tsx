import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native-animatable';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {getDownloadURL, ref} from 'firebase/storage';
import {db, storage} from '../config/firebase';
import {doc, getDoc} from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import {useAtom} from 'jotai';
import {globalUid} from '../hooks/useAuth';
import {formatDistanceToNow} from 'date-fns';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';

const CodeSnippetPost = ({post}) => {
  const navigation = useNavigation();
  const [url, setUrl] = useState();
  const [liked, setLiked] = useState(false);
  const [globaluid, setUid] = useAtom(globalUid);
  const [userInfo, setUserInfo] = useState<any | undefined>(null);
  const [translatedText, setTranslatedText] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);
  const [formattedCode, setFormattedCode] = useState('');


  const uid = post.userId;
  const timeAgo = formatDistanceToNow(new Date(post.postTime.toDate()), {
    addSuffix: true,
  });

  const fetchData = async () => {
    const docRef = doc(db, 'usersInfo', uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUserInfo(docSnap.data());
    } else {
      console.log('No Such Document');
    }
  };

  useEffect(() => {
    formatCode();
    const storageRef = ref(storage, 'images/' + uid);
    getDownloadURL(storageRef).then(async downloadURL => {
      setUrl(downloadURL);
    });
    fetchData();
    if (globaluid && post.postLikes.includes(globaluid)) {
      setLiked(true);
    }
  }, []);


  const API_KEY = 'AIzaSyBl0jjxjNDG9aZBimhAQxc3UzcClevSXfY';
  const formatCode = async () => {
    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
              contents: [
                {
                  role: 'user',
                  parts: [{text: `Format code without comments : ${post.codeSnippet}`}],
                },
              ],
            },
          );
      const formattedCode =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      setFormattedCode(formattedCode);
    } catch (error) {
      console.error('Error formatting code: ', error);
    }
  };
  const translateText = async () => {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          contents: [
            {
              role: 'user',
              parts: [{text: `Translate this to English: ${post.postText}`}],
            },
          ],
        },
      );
      const translation =
        response.data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      setTranslatedText(translation);
      setShowTranslation(true);
    } catch (error) {
      console.error('Error translating text: ', error);
    }
  };

  const toggleText = () => {
    setShowOriginal(!showOriginal);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.userInfoContainer}>
        <View style={styles.userDetails}>
          <Image
            style={styles.picStyle}
            source={
              url ? {uri: url} : require('../assets/images/emptyProfile.webp')
            }
          />
          <Text style={styles.usernameText}>{userInfo?.username}</Text>
        </View>
        <Text style={styles.timeAgoText}>{timeAgo}</Text>
      </View>
      <View style={styles.postContain}>
        <Text style={styles.postText}>
          {showOriginal ? post.postText : translatedText}
        </Text>
        {showTranslation && (
          <TouchableOpacity onPress={toggleText} style={styles.translateButton}>
            <Text style={styles.translateButtonText}>
              {showOriginal ? 'Show Translation' : 'Show Original'}
            </Text>
          </TouchableOpacity>
        )}
        {!showTranslation && (
          <TouchableOpacity
            onPress={translateText}
            style={styles.translateButton}>
            <Text style={styles.translateButtonText}>See Translation</Text>
          </TouchableOpacity>
        )}
        <View
          style={{backgroundColor: '#e3e3e3', marginLeft: 5, marginRight: 5, borderRadius:10,padding:10}}>
          <ScrollView style={{maxHeight: 100}}>
            <Text style={{fontSize: 10, fontWeight: '300', color: 'black'}}>
            {formattedCode}
            </Text>
          </ScrollView>
        </View>
        {post.postImage && (
          <Image style={styles.postPic} source={{uri: post.postImage}} />
        )}
      </View>
      <View style={styles.interactionContainer}>
        <Pressable
          onPress={() =>
            navigation.navigate('CodeSnippetsComments', {
              postData: post,
              postId: post.postId,
              username: userInfo?.username,
              userPic: url
                ? {uri: url}
                : require('../assets/images/emptyProfile.webp'),
              postTime: timeAgo,
              postCode: formattedCode,
            })
          }>
          <View style={styles.interaction}>
            <IonIcon size={25} name="chatbox-outline" />
            <Text>{post.postComments}</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 10,
    padding: 10,
    borderBottomWidth: 1,
    borderRadius: 10,
    borderColor: '#d3d3d3',
    marginLeft: 5,
    display: 'flex',
    gap: 15,
  },
  userInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picStyle: {
    width: 30,
    height: 30,
    resizeMode: 'stretch',
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 2,
  },
  usernameText: {
    fontSize: 10,
    color: '#2b2b2b',
    fontWeight: '400',
    paddingLeft: 5,
  },
  timeAgoText: {
    fontSize: 10,
    color: '#d3d3d3',
  },
  postContain: {
    display: 'flex',
    width: 360,
    gap: 10,
  },
  postText: {
    fontSize: 12,
    fontWeight: '300',
    color: '#424242',
  },
  translateButton: {
    marginTop: 10,
  },
  translateButtonText: {
    color: '#24786D',
    fontSize: 10,
    fontWeight: '300',
  },
  postPic: {
    width: 350,
    height: 240,
    borderRadius: 10,
    resizeMode: 'stretch',
  },
  interactionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    padding: 10,
  },
  interaction: {
    flexDirection: 'row',
    gap: 5,
  },
});

export default CodeSnippetPost;
