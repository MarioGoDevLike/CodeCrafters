import {View, Text, StyleSheet, Pressable, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native-animatable';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {getDownloadURL, ref} from 'firebase/storage';
import {db, storage} from '../config/firebase';
import {doc, getDoc} from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import {useAtom} from 'jotai';
import {globalUid} from '../hooks/useAuth';
import {formatDistanceToNow} from 'date-fns';
import axios from 'axios';

const VotingPost = ({post}) => {
  const [url, setUrl] = useState();
  const uid = post.userId;
  const [userInfo, setUserInfo] = useState<any | undefined>(null);
  const [upvote, setUpVote] = useState(false);
  const [downVote, setDownVote] = useState(false);
  const [globaluid, setUid] = useAtom(globalUid);
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
    const storageRef = ref(storage, 'images/' + uid);
    getDownloadURL(storageRef).then(async downloadURL => {
      setUrl(downloadURL);
    });
    fetchData();
    if (globaluid && post.postUpVote.includes(globaluid)) {
      setUpVote(true);
    }
    if (globaluid && post.postDownVote.includes(globaluid)) {
      setDownVote(true);
    }
  }, []);

  const upVotePost = () => {
    const newUpVote = upvote
      ? post.postUpVote.filter(id => id !== globaluid)
      : [...post.postUpVote, globaluid];
    setUpVote(!upvote);
    firestore().collection('posts').doc(post.postId).update({
      upvote: newUpVote,
    });
  };
  const downVotePost = () => {
    const newDownVote = downVote
      ? post.postDownVote.filter(id => id !== globaluid)
      : [...post.postDownVote, globaluid];
    setDownVote(!downVote);
    firestore().collection('posts').doc(post.postId).update({
      Downvote: newDownVote,
    });
  };
  const upVoteCount = post && post.postUpVote ? post.postUpVote.length : 0;
const downVoteCount = post && post.postDownVote ? post.postDownVote.length : 0;

  const [translatedText, setTranslatedText] = useState(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);

  const API_KEY = "AIzaSyBl0jjxjNDG9aZBimhAQxc3UzcClevSXfY";

  const translateText = async () => {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          contents: [{ role: "user", parts: [{ text: `Translate this to English: ${post.postText}` }] }]
        }
      );
      const translation = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
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
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            style={styles.picStyle}
            source={
              url ? {uri: url} : require('../assets/images/emptyProfile.webp')
            }
          />
          <Text
            style={{
              fontSize: 10,
              color: '#2b2b2b',
              fontWeight: '400',
              paddingLeft: 5,
            }}>
            {userInfo?.username}
          </Text>
        </View>
        <View>
          <Text style={{fontSize: 10, color: '#d3d3d3'}}>{timeAgo}</Text>
        </View>
      </View>
      <View style={styles.postContain}>
        <Text style={{fontSize: 12, fontWeight: '300', color: '#424242'}}>
          {showOriginal ? post.postText : translatedText}
        </Text>
        {showTranslation && (
          <TouchableOpacity onPress={toggleText} style={styles.translateButton}>
            <Text style={styles.translateButtonText}>{showOriginal ? 'Show Translation' : 'Show Original'}</Text>
          </TouchableOpacity>
        )}
        {!showTranslation && (
          <TouchableOpacity onPress={translateText} style={styles.translateButton}>
            <Text style={styles.translateButtonText}>See Translation</Text>
          </TouchableOpacity>
        )}
        {post.postImage ? (
          <Image style={styles.postPic} source={{uri: post.postImage}} />
        ) : null}
      </View>
      <View style={styles.interactionContainer}>
        <Pressable onPress={upVotePost}>
          <View style={styles.interaction}>
            <AntIcon size={19} name={upvote ? 'like1' : 'like2'} />
            <Text>{upVoteCount}</Text>
          </View>
        </Pressable>
        <Pressable onPress={downVotePost}>
          <View style={styles.interaction}>
            <AntIcon size={19} name={downVote ? 'dislike1' : 'dislike2'} />
            <Text>{downVoteCount}</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  postContain: {
    display: 'flex',
    width: 360,
    gap: 10,
  },
  interaction: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
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
  picStyle: {
    width: 30,
    height: 30,
    resizeMode: 'stretch',
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 2,
  },
  userInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  postPic: {
    width: 360,
    height: 240,
    resizeMode: 'stretch',
    borderRadius: 10,
  },
  interactionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  translateButton: {
    marginTop: 10,
  },
  translateButtonText: {
    color: '#24786D',
    fontSize: 10,
    fontWeight: '300',
  },
});

export default VotingPost;