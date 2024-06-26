import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Image } from 'react-native-animatable';

// Helper function to truncate the description to the first 10 words
const truncateDescription = (description, wordLimit = 20) => {
  const words = description.split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return description;
};

const Course = ({ image, title, description }) => {
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: '#d3d3d3', justifyContent:'center',alignItems:'center' }}>
      <View style={styles.mainContainer}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={image} />
        </View>
        <View style={styles.textsContainer}>
          <Text style={styles.courseTitle}>{title}</Text>
          <Text style={styles.courseDescription}>{truncateDescription(description)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: 15,
    gap: 15,
  },
  image: {
    height: 90,
    width: 150,
    resizeMode: 'contain',
  },
  courseTitle: {
    fontSize: 15,
    width: 150,
    fontWeight: 'bold',
    color: 'black',
  },
  courseDescription: {
    color: 'black',
    fontWeight: '300',
    fontSize: 10,
    width: 170,
  },
  textsContainer: {
    display: 'flex',
    gap: 10,
    marginTop: 20,
  },
});

export default Course;
