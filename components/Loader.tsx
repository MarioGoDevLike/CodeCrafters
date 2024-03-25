import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import LoaderKit from 'react-native-loader-kit';


const Loader = () => {
    const ScreenHeight = Dimensions.get('window').height;
    const ScreenWidth = Dimensions.get('window').width;

  return (
    <View style={{ display:'flex', justifyContent:'center', alignItems:'center', backgroundColor:'#E3E3E3',width:ScreenWidth, height:ScreenHeight,opacity: 0.5 ,position:'absolute'}}>
        <LoaderKit
        style={{width:50, height:50}}
        name={'BallRotateChase'}
        color='black'
         />
    </View>
  )
}

export default Loader