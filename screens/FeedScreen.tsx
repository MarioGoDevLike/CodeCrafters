import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collectionGroup, query, getDocs, onSnapshot } from 'firebase/firestore';
import { useAtom } from 'jotai';
import { globalUid } from '../hooks/useAuth';
import { db } from '../config/firebase';
import NormalPost from '../components/NormalPost';
import VotingPost from '../components/VotingPost';

const FeedScreen = () => {
  const [post, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collectionGroup(db, 'posts'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const posts = [];
          querySnapshot.forEach((doc) => {
            const userId = doc.data().userId;
            const postId = doc.data().postId;
            const postImage = doc.data().postImage;
            const postText = doc.data().postText;
            const postType = doc.data().postType;
            posts.push({ postId, userId, postImage, postText, postType });
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
      {post.map((item) => {
        if (item.postType === 'Normal Post') {
          return <NormalPost key={item.postId} post={item} />;
        } else {
          return <VotingPost key={item.postId} post={item} />;
        }
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 10,
    display: 'flex',
    gap: 20,
  },
});

export default FeedScreen;
