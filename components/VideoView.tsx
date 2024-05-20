import { View, Text, Dimensions } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'

const VideoView = ({route}) => {
    const {videoUrl} = route.params;
  return (
      <WebView javaScriptEnabled domStorageEnabled source={{uri:videoUrl}} style={{flex:1,height:Dimensions.get('window').height,width:Dimensions.get('window').width}}/>
  )
}
export default VideoView