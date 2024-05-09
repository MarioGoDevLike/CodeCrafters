import {
    View,
    Text,
    StyleSheet,
    ScrollView,
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
  import {Image} from 'react-native-animatable';
  import {getDownloadURL, ref} from 'firebase/storage';
  import {db, storage} from '../config/firebase';
  import {doc, getDoc} from 'firebase/firestore';
  import {useAtom} from 'jotai';
  import {globalUid} from '../hooks/useAuth';
  import {firebase} from '@react-native-firebase/firestore';
  
  const Comments = ({route}) => {
    const {postId, postData, username, userPic, postTime} = route.params;
    const [liked, setLiked] = useState(false);
    const [url, setUrl] = useState();
    const [uid, setUid] = useAtom(globalUid);
    const [comment, setComment] = useState('');
    const [data, setAddData] = useState('');
    const [comments, setComments] = useState([]);
    const [commentUid, setCommentUid] = useState();
    const [userPhotos, setUserPhotos] = useState({});
    const [usernames, setUsernames] = useState({});
  
    const getUserPhoto = async userId => {
      try {
        const storageRef = ref(storage, `images/${userId}`);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      } catch (error) {
        console.error('Error fetching user photo:', error);
        return null;
      }
    };
  
    const getUsername = async userId => {
      try {
        const docRef = doc(db, 'usersInfo', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data().username;
        } else {
          console.log('No Such Document');
          return null;
        }
      } catch (error) {
        console.error('Error fetching username:', error);
        return null;
      }
    };
  
    useEffect(() => {
      const fetchUserData = async () => {
        const photoMap = {};
        const usernameMap = {};
        await Promise.all(
          comments.map(async commentData => {
            const {userId} = commentData;
            if (!photoMap[userId]) {
              const photoUrl = await getUserPhoto(userId);
              photoMap[userId] = photoUrl;
            }
            if (!usernameMap[userId]) {
              const username = await getUsername(userId);
              usernameMap[userId] = username;
            }
          }),
        );
        setUserPhotos(photoMap);
        setUsernames(usernameMap);
      };
  
      fetchUserData();
    }, [comments]);
    
  
    useEffect(() => {
      const commentsRef = firebase
        .firestore()
        .collection('postComments')
        .doc(postId);
      const unsubscribe = commentsRef.onSnapshot(docSnapshot => {
        if (docSnapshot.exists) {
          const commentsData = docSnapshot.data();
          if (commentsData && commentsData.comments) {
            setComments(commentsData.comments);
          }
        }
      });
      return () => unsubscribe();
    }, [postId]);
  
    useEffect(() => {
      const storageRef = ref(storage, 'images/' + uid);
      getDownloadURL(storageRef).then(async downloadURL => {
        setUrl(downloadURL);
      });
      const fetchData = async () => {
        const commentsRef = firebase
          .firestore()
          .collection('postComments')
          .doc(postId);
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
      <ScrollView style={{flex: 1, paddingBottom: 30}}>
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
          <View style={styles.commentsContainer}>
            {comments.map((commentData, index) => (
              <View key={index} style={styles.comment}>
                <Image
                  style={{
                    height: 40,
                    width: 40,
                    borderRadius: 40,
                    resizeMode: 'stretch',
                  }}
                  source={
                    userPhotos[commentData.userId]
                      ? {uri: userPhotos[commentData.userId]}
                      : require('../assets/images/emptyProfile.webp')
                  }
                />
                <View style={{flexDirection: 'column'}}>
                  <Text style={{fontSize: 10, color: 'black', fontWeight: '300'}}>
                    {usernames[commentData.userId]}
                  </Text>
                  <Text style={{fontSize: 12, color: 'black', fontWeight: '400'}}>
                    {commentData.comment}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
    comment: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    commentsContainer: {
      padding: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
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
      display: 'flex',
      justifyContent:'center',
      padding:10,
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
      width: 380,
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
  