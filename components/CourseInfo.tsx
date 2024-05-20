import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {Image} from 'react-native-animatable';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';

const CourseInfo = ({route, navigation}) => {
  const {courseTitle, courseImage, courseDescription, courseLearn} =
    route.params;
  useEffect(() => {
    navigation.setOptions({title: ''});
  }, [navigation, courseTitle]);
  return (
    <View style={styles.mainContainer}>
      <View>
        <Image style={styles.image} source={courseImage} />
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.textContainer}>
          <Text style={{fontSize:22, fontWeight:'bold', color:'black'}}>{courseTitle}</Text>
          <Text style={{fontSize:15, fontWeight:'300', color:'black'}}>{courseDescription}</Text>
          <View style={{justifyContent:'center', alignItems:'center', padding:10, borderWidth:1, borderColor:'#d3d3d3'}}><Text style={{color:'black'}}>What you'll learn</Text></View>
          <Text style={{fontWeight:'300', color:'black', padding:10,}}>{courseLearn}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Watch Now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    textContainer:{
        display:'flex',
        gap:5,
        padding:10,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 300,
        gap:5,
      },
  mainContainer: {
    display: 'flex',
  },
  image: {
    height: 230,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15,
  },
  button: {
    padding: 15,
    paddingLeft: 50,
    paddingRight: 50,
    backgroundColor: '#24786D',
    borderRadius: 5,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CourseInfo;
