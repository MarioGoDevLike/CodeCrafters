import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native-animatable';
import Icon from 'react-native-vector-icons/FontAwesome';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {getDownloadURL, ref} from 'firebase/storage';
import {db, storage} from '../config/firebase';
import {doc, getDoc} from 'firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import {useAtom} from 'jotai';
import {globalUid} from '../hooks/useAuth';
import {formatDistanceToNow} from 'date-fns';
import {useNavigation} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/firestore';
import {getDocs, collection, query, where} from 'firebase/firestore';

const Comments = ({route}) => {
  const {postId, postData, username, userPic, postTime} = route.params;
  const [liked, setLiked] = useState(false);
  const [url, setUrl] = useState();
  const [uid, setUid] = useAtom(globalUid);
  const [comment, setComment] = useState('');
  const [data, setAddData] = useState('');
  const [comments, setComments] = useState([]);

  const likesCount = postData.postLikes.length;
  // const likePost = () => {
  //   const newLikes = liked
  //     ? postData.postLikes.filter(id => id !== globaluid)
  //     : [...postData.postLikes, globaluid];
  //   setLiked(!liked);
  //   firestore().collection('posts').doc(post.postId).update({
  //     Likes: newLikes,
  //   });
  // };

  const todoRef = firebase.firestore().collection('postComments');
  const addData = async () => {
    if (comment) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const commentData = {
        userId: uid,
        comment: comment,
      };

      const postDoc = await todoRef.doc(postId).get();
      if (postDoc.exists) {
        todoRef
          .doc(postId)
          .update({
            comments: firebase.firestore.FieldValue.arrayUnion(commentData),
          })
          .then(() => {
            setComment('');
          })
          .catch(error => {
            console.log('Error updating document:', error);
          });
      } else {
        todoRef
          .doc(postId)
          .set({
            comments: [commentData],
          })
          .then(() => {
            setComment('');
          })
          .catch(error => {
            console.log('Error creating document:', error);
          });
      }
    } else {
      Alert.alert('Error', 'Please enter a comment');
    }
  };

  useEffect(() => {
    const storageRef = ref(storage, 'images/' + uid);
    getDownloadURL(storageRef).then(async downloadURL => {
      setUrl(downloadURL);
    });
    
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const commentsRef = firebase.firestore().collection('postComments').doc(postId);
      const docSnapshot = await commentsRef.get();
      if (docSnapshot.exists) {
        const commentsData = docSnapshot.data();
        if (commentsData && commentsData.comments) {
          setComments(commentsData.comments);
        }
      }
    };
  
    fetchData();
  }, [postId]);
  
  

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
          <Image style={styles.picStyle} source={userPic} />
          <Text
            style={{
              fontSize: 10,
              color: '#2b2b2b',
              fontWeight: '400',
              paddingLeft: 5,
            }}>
            {username}
          </Text>
        </View>
        <View>
          <Text style={{fontSize: 10, color: '#d3d3d3'}}>{postTime}</Text>
        </View>
      </View>
      <View style={styles.postContain}>
        <Text style={{fontSize: 12, fontWeight: '300', color: '#424242'}}>
          {postData.postText}
        </Text>
        {postData.postImage ? (
          <Image style={styles.postPic} source={{uri: postData.postImage}} />
        ) : null}
      </View>
      <View style={styles.interactionContainer}>
        <Pressable>
          <View style={styles.interaction}>
            <IonIcon size={25} name="heart-outline" />
            <Text>{likesCount}</Text>
          </View>
        </Pressable>
        <Pressable>
          <View style={styles.interaction}>
            <IonIcon size={25} name="chatbox-outline" />
            <Text>20</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.commentSection}>
        <View style={styles.userInputs}>
          <Image
            style={styles.picStyle}
            source={
              url ? {uri: url} : require('../assets/images/emptyProfile.webp')
            }
          />
          <TextInput
            value={comment}
            onChangeText={value => setComment(value)}
            style={styles.defaultTextInput}
            placeholder="Write your comment"
            placeholderTextColor={'#d3d3d3'}
            multiline={true}
            numberOfLines={4}
          />
          <Pressable onPress={addData}>
            <Icon name="send-o" size={20} style={{padding: 5}} />
          </Pressable>
        </View>
      </View>
      <View style={styles.commentsContainer}>
        {comments?.map((commentData, index) => (
          <View key={index} style={styles.comment}>
            <Image
              style={styles.picStyle} 
              source={require('../assets/images/emptyProfile.webp')}
            />
            <Text>{commentData.comment}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  picStyle: {
    width: 30,
    height: 30,
    resizeMode: 'stretch',
    borderRadius: 50,
    borderColor: '#fff',
    borderWidth: 2,
  },
  comment:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    gap:10,
  },
  commentsContainer: {
    padding: 10,
    display: 'flex',
    flexDirection: 'column',
    gap:20,
  },
  defaultTextInput: {
    fontSize: 10,
    width: 240,
  },
  userInputs: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    padding: 5,
  },
  commentSection: {
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#d3d3d3',
  },
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
export default Comments;
