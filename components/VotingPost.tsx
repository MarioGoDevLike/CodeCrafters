import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native-animatable';
import AntIcon from 'react-native-vector-icons/AntDesign';
import {getDownloadURL, ref} from 'firebase/storage';
import {db, storage} from '../config/firebase';
import {doc, getDoc} from 'firebase/firestore';

const VotingPost = ({post}) => {
  const [url, setUrl] = useState();
  const uid = post.userId;
  const [userInfo, setUserInfo] = useState<any | undefined>(null);

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

  return (
    <View style={styles.mainContainer}>
      <View style={styles.userInfoContainer}>
        <Image
          style={styles.picStyle}
          source={
            url ? {uri: url} : require('../assets/images/emptyProfile.webp')
          }
        />

        <Text
          style={{
            fontSize: 12,
            fontFamily: 'MarkaziText-Medium',
            color: '#2b2b2b',
            fontWeight: '300',
            paddingLeft: 5,
          }}>
          {userInfo?.username}
        </Text>
      </View>
      <View style={styles.postContain}>
        <Text>{post.postText}</Text>
        {post.postImage ? (
          <Image style={styles.postPic} source={{uri: post.postImage}} />
        ) : null}
      </View>
      <View style={styles.interactionContainer}>
        <View style={styles.interaction}>
          <AntIcon size={19} name="like2" />
          <Text>20</Text>
        </View>
        <View style={styles.interaction}>
          <AntIcon size={19} name="dislike2" />
          <Text>20</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
    postContain:{
        display:'flex',
        gap:10,
      },
  interaction: {
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
  },
  mainContainer: {
    marginTop: 10,
    padding: 10,
    borderBottomWidth:1,
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
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 10,
  },
  postPic: {
    width: 330,
    height: 240,
    resizeMode: 'stretch',
    borderRadius: 10,
  },
  interactionContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    padding:10,
  },
});
export default VotingPost;
