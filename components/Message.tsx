import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Image} from 'react-native-animatable';

const Message = ({message}) => {
  return (
    <View style={styles.MainContainer}>
      <View style={StyleSheet.messageInfo}>
        <Image style={{
                    height: 40,
                    width: 40,
                    borderRadius: 50,
                    resizeMode: 'stretch',
                  }} source={require('../assets/images/emptyProfile.webp')} />
        <Text>Just now</Text>
      </View>
      <View style={styles.messageContent}>
        <Text>Hello</Text>
        <Image style={{
                    height: 40,
                    width: 40,
                    borderRadius: 50,
                    resizeMode: 'stretch',
                  }} source={require('../assets/images/emptyProfile.webp')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
    MainContainer:{
        display:'flex',
        flexDirection:'row'
    },
    messageInfo:{
        flexDirection:'column',
    },
    messageContent:{
        flexDirection:'row'
    }
});
export default Message;
