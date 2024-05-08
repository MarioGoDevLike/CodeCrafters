import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {collectionGroup, query, getDocs, onSnapshot} from 'firebase/firestore';

import {db} from '../config/firebase';
import NormalPost from '../components/NormalPost';
import VotingPost from '../components/VotingPost';

const FeedScreen = () => {
  const [post, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collectionGroup(db, 'posts'));
        const unsubscribe = onSnapshot(q, querySnapshot => {
          const posts = [];
          querySnapshot.forEach(doc => {
            const userId = doc.data().userId;
            const postId = doc.data().postId;
            const postImage = doc.data().postImage;
            const postText = doc.data().postText;
            const postType = doc.data().postType;
            const postLikes = doc.data().Likes;
            const postUpVote = doc.data().upvote;
            const postDownVote = doc.data().Downvote;
            const postTime = doc.data().time;
            const postComments = doc.data().Comments;
0

            posts.push({
              postId,
              userId,
              postImage,
              postText,
              postType,
              postLikes,
              postUpVote,
              postDownVote,
              postTime,
              postComments
            });
          });
          setPosts(posts);
        });
        return () => unsubscribe();
      } catch (error) {
        console.log('Error fetching posts:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={{display: 'flex', gap: 20, justifyContent:'center', alignItems:'center'}}>
        {post.map(item => {
          if (item.postType === 'Normal Post') {
            return <NormalPost key={item.postId} post={item} />;
          } else {
            return <VotingPost key={item.postId} post={item} />;
          }
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
});

export default FeedScreen;
