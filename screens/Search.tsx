import React, {useState, useEffect, useCallback} from 'react';
import {View, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import { debounce } from "lodash";
import 'firebase/firestore';
import {
  collectionGroup,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import {db} from '../config/firebase';
import {Image, Text} from 'react-native-animatable';
import {formatDistanceToNow} from 'date-fns';

const Search = ({navigation}) => {
  const [searchText, setSearchText] = useState('');
  const [posts, setPosts] = useState([]);
  const [url, setUrl] = useState();

  useEffect(() => {
    const fetchPhoto = async userId => {
      try {
        const docRef = doc(db, 'usersInfo', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          return docSnap.data().photoUrl;
        } else {
          console.log('No Such Document');
          return null;
        }
      } catch (error) {
        console.error('Error fetching photo:', error);
        return null;
      }
    };
    const fetchData = async () => {
        try {
          const unsubscribe = onSnapshot(
            getQuery(searchText),
            async querySnapshot => {
              const updatedPosts = [];
              await Promise.all(
                querySnapshot.docs.map(async doc => {
                  const postData = doc.data();
                  const username = await fetchUser(postData.userId);
                  const userPhoto = await fetchPhoto(postData.userId);
                  updatedPosts.push({
                    postId: doc.id,
                    username,
                    userPhoto,
                    ...postData,
                  });
                }),
              );
              setPosts(updatedPosts);
              console.log(updatedPosts); 
            },
          );
          return unsubscribe;
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };

    fetchData();
  }, [searchText]);

  const getQuery = searchText => {
    let q = collectionGroup(db, 'posts');
    if (searchText) {
      q = query(q, where('postText', '>=', searchText));
    }
    return q;
  };
  const handler = useCallback(debounce((text)=>{
    console.log('text',searchText)
    setSearchText(text)
  }, 300), []);
  const handleSearchTextChange = newText => {
    handler(newText)
  };

  const fetchUser = async uid => {
    try {
      const docRef = doc(db, 'usersInfo', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().username;
      } else {
        console.log('No such document');
        return '';
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      return '';
    }
  };

  const formatPostTime = time => {
    const timeAgo = formatDistanceToNow(new Date(time.toDate()), {
      addSuffix: true,
    });
    return timeAgo;
  };

  return (
    <View>
      <View>
        <TextInput
          placeholder="Search for Post"
          style={styles.input}
          onChangeText={handleSearchTextChange}
        />
        {posts
          ? posts.map(item => (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('SearchResult', {
                    postData: item,
                    postId: item.postId,
                    username: item.username,
                    userPic: item.userPhoto
                      ? {uri: item.userPhoto}
                      : require('../assets/images/emptyProfile.webp'),
                    postTime: formatPostTime(item.time),
                  })
                }>
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: 100,
                    paddingLeft: 10,
                    alignItems: 'center',
                    borderTopColor: '#d3d3d3',
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderBottomColor: '#D3D3D3',
                  }}>
                  <View style={styles.infoContainer}>
                    <View style={styles.textsContainer}>
                      <Text numberOfLines={1} style={{fontSize: 15, fontWeight: 'bold'}}>
                        {item.postTitle}
                      </Text>
                      <Text
                        style={{
                          fontWeight: '200',
                          color: 'black',
                          fontSize: 10,
                        }}>
                        {item.postText}
                      </Text>
                    </View>
                    <View>
                      <Text numberOfLines={1} style={{fontSize: 10}}>
                        Posted By: {item.username}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#d3d3d3',
    padding: 10,
    fontSize: 12,
  },
  infoContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex:1,
    marginRight:16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textsContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex:1
  },
});

export default Search;
