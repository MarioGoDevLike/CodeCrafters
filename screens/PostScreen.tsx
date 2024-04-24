import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Keyboard,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Image} from 'react-native-animatable';
import {auth, storage} from '../config/firebase';
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import useAuth from '../hooks/useAuth';
import {useAtom} from 'jotai';
import {globalUid} from '../hooks/useAuth';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  launchImageLibrary as _launchImageLibrary,
  launchCamera as _launchCamera,
} from 'react-native-image-picker';
import CheckBox from 'react-native-check-box';
import Loader from '../components/Loader';
import {firebase} from '@react-native-firebase/firestore';

const PostScreen = () => {
  const [uid, setUid] = useAtom(globalUid);
  const [postText, setPostText] = useState('');
  const [title, setTitle] = useState('');
  const [normalPost, setNormalPost] = useState(false);
  const [votingPost, setVotingPost] = useState(false);
  const [image, setImage] = useState(null);
  const [userImage, setUserImage] = useState('');
  const [data, setAddData] = useState('');
  const [Loading, setLoading] = useState(false);
  const [postType, setPostType] = useState(null);

  const [url, setUrl] = useState();
  useEffect(() => {
    const storageRef = ref(storage, 'images/' + uid);
    getDownloadURL(storageRef).then(async downloadURL => {
      setUrl(downloadURL);
    });
  }, []);

  let launchImageLibrary = _launchImageLibrary;
  const openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, handleResponse);
  };

  const handleVotingPostClick = () => {
    setVotingPost(!votingPost);
    if (!votingPost) {
      setNormalPost(false);
      setPostType('Voting Post');
    } else {
      setPostType(null);
    }
  };


  const handleNormalPostClick = () => {
    setNormalPost(!normalPost);
    if (!normalPost) {
      setVotingPost(false);
      setPostType('Normal Post');
    } else {
      setPostType(null);
    }
  };

  const handleResponse = response => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('Image picker error: ', response.error);
    } else {
      let imageUri = response.uri || response.assets?.[0]?.uri;
      uploadImage(imageUri, 'image');
    }
  };
  const generateRandomId = length => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }

    return randomId;
  };
  const uploadImage = async (uri, fileType) => {
    console.log('Started');
    const response = await fetch(uri);
    console.log('done response');
    const blob = await response.blob();
    const id = generateRandomId(10);
    const storageRef = ref(storage, 'postsImages/' + id);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      'state_changed',
      snapshot => {},
      error => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
          console.log('File available at ', downloadURL);
          setUserImage(downloadURL);
          setImage('');
        });
      },
    );
  };

  const todoRef = firebase.firestore().collection('posts');
  const addData = async () => {
    const postId = generateRandomId(20);
    setLoading(true);
    if (title && postText && postType) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      let data = {
        userId:uid,
        postId: postId,
        postTitle: title,
        postType: normalPost ? 'Normal Post' : 'Voting Post',
        postText: postText,
        postImage: userImage,
        time: timestamp,
      };
      if (normalPost) {
        data = {
          ...data,
          Likes: '',
        };
      } else {
        data = {
          ...data,
          upvote: '',
          Downvote: '',
        };
      }

      todoRef
        .doc(postId)
        .set(data)
        .then(() => {
          console.log('adding Data.. ');
          setAddData('');
          setLoading(false);
          console.log('success');
          Alert.alert('Posted Successfully');
          setPostText('');
          setUserImage('');
          setTitle('');
          setPostType(null);
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      Alert.alert('error');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.usernameInput1}>
          <Text style={styles.textPhone}>Title:</Text>
          <View>
            <TextInput
              placeholder="Enter the title"
              value={title}
              onChangeText={value => setTitle(value)}
              style={styles.textInputUsername}
            />
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.textPhone}>Post Type</Text>
          <View style={styles.checkboxContainer}>
            <CheckBox
              style={{width: 150}}
              checkedCheckBoxColor="#24786D"
              rightTextStyle={styles.rightTextStyle}
              onClick={handleVotingPostClick}
              isChecked={votingPost}
              rightText={'Voting post'}
              
            />
            <CheckBox
              style={{width: 150}}
              checkedCheckBoxColor="#24786D"
              rightTextStyle={styles.rightTextStyle}
              onClick={handleNormalPostClick}
              isChecked={normalPost}
              rightText={'Normal post'}
            />
          </View>
        </View>
        <View style={styles.postContainer}>
          <Image
            style={styles.picStyle}
            source={
              url ? {uri: url} : require('../assets/images/emptyProfile.webp')
            }
          />
          <TextInput
            placeholder="Want to share something?"
            placeholderTextColor={'#d4d4d4'}
            value={postText}
            onChangeText={value => setPostText(value)}
            style={styles.defaultTextInput}
            multiline={true}
            numberOfLines={4}
          />
        </View>
        <View>
          <Image
            source={{uri: userImage}}
            style={{height: 200, width: 200}}
            resizeMode="contain"
          />
        </View>
        <View style={styles.cameraContainer}>
          <Icon.Button
            onPress={openImagePicker}
            size={30}
            backgroundColor={'transparent'}
            color={'#24786D'}
            style={styles.iconStyle}
            name="camerao"
          />
        </View>
        <Pressable onPress={addData} style={styles.button}>
          <Text style={{color: 'white', fontSize: 14}}>Post</Text>
        </Pressable>
      </View>
      {Loading ? <Loader /> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#24786D',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    height: 50,
    width: 300,
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  rightTextStyle: {
    color: 'black',
    fontSize:10,
    fontWeight: '300',
  },

  inputContainer: {
    display: 'flex',
    gap:10,
  },
  usernameInput1: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    gap: 10,
    padding: 10,
  },
  textInputUsername: {
    backgroundColor: '#e3e3e3',
    borderRadius: 5,
    height: 40,
    width: 260,
    padding: 10,
    fontSize: 10,
  },
  textPhone: {
    color: '#24786D',
    fontWeight: '500',
    fontSize: 8,
  },
  cameraContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingTop: 20,
  },
  iconStyle: {},
  postContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderColor: '#d4d4d4',
    borderRadius: 15,
    borderWidth: 1,
    padding: 10,
  },
  defaultTextInput: {
    fontSize: 10,
    paddingLeft: 10,
    width: 240,
  },
  picStyle: {
    width: 30,
    height: 30,
    resizeMode: 'stretch',
    borderRadius: 50,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default PostScreen;
