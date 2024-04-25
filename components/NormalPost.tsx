import {View, Text, StyleSheet, Pressable} from 'react-native';
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
import { useNavigation } from '@react-navigation/native';

const NormalPost = ({post}) => {
  const navigation = useNavigation();

  const [url, setUrl] = useState();
  const [liked, setLiked] = useState(false);
  const [globaluid, setUid] = useAtom(globalUid);
  const uid = post.userId;
  const [userInfo, setUserInfo] = useState<any | undefined>(null);

  const likesCount = post.postLikes.length;
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
  }, []);

  const likePost = () => {
    const newLikes = liked
      ? post.postLikes.filter(id => id !== globaluid)
      : [...post.postLikes, globaluid];
    setLiked(!liked);
    firestore().collection('posts').doc(post.postId).update({
      Likes: newLikes, 
    });
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
          {post.postText}
        </Text>
        {post.postImage ? (
          <Image style={styles.postPic} source={{uri: post.postImage}} />
        ) : null}
      </View>
      <View style={styles.interactionContainer}>
        <Pressable onPress={likePost}>
          <View style={styles.interaction}>
            <IonIcon size={25} name="heart-outline" />
            <Text>{likesCount}</Text>
          </View>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Comments', {postData: post, postId : post.postId, username:userInfo?.username, userPic: url ? {uri: url} : require('../assets/images/emptyProfile.webp'), postTime: timeAgo})}>
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
  postContain: {
    display: 'flex',
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
    width: 350,
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
    width: 330,
    height: 240,
    borderRadius: 10,
    resizeMode: 'stretch',
  },
  interactionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    padding: 10,
  },
});

export default NormalPost;
