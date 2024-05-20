import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Image } from 'react-native-animatable';

const Course = ({image, title, description}) => {
  return (
    <View style={{borderBottomWidth:1, borderBottomColor:'#d3d3d3'}}>
      <View style={styles.mainContainer}>
        <View style={styles.imageContainer}>
            <Image style={styles.image} source={image} />
        </View>
        <View style={styles.textsContainer}>
            <Text style={styles.courseTitle}>{title}</Text>
            <Text style={styles.courseDescription}>{description}</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    mainContainer:{
        display:'flex',
        flexDirection:'row',
        margin:15,
        gap:15,
    },
    image:{
        height:150,
        width:150,
        resizeMode:'contain',
    },
    courseTitle:{
        fontSize:20,
        fontWeight:'bold',
        color:'black',
        width:220,
    },
    courseDescription:{
        color:'black',
        fontWeight:'300',
        fontSize:12,
        width:230,
    },
    textsContainer:{
        display:'flex',
        gap:10,
        marginTop:20,
    }
});

export default Course