import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIon from 'react-native-vector-icons/Ionicons';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MessageScreen from './MessageScreen';
import PostScreen from './PostScreen';
import NotificationScreen from './NotificationScreen';
import ProfileScreen from './ProfileScreen';
import FeedScreen from './FeedScreen';

const HomeScreen = () => {
  const Home = createBottomTabNavigator();

  const screenOptions = ({route}) => ({
    tabBarStyle:{height:50},
    tabBarIconStyle:styles.tabBarIcon,
    tabBarShowLabel:false,  
    headerShown: false,
    tabBarIcon: ({focused}) => {
      let iconName = 'home';
      switch (route.name) {
        case 'Feed':
          iconName = 'home-outline';
          break;
        case 'Message':
          iconName = 'chatbubbles-outline';
          break;
        case 'Post':
          iconName = 'add';
          break;
        case 'Notification':
          iconName = 'notifications-outline';
          break;
        case 'Profile':
          iconName = 'person-outline';
          break;
      }
      if(route.name == 'Post'){
        return <IconIon.Button
        style={{backgroundColor: 'white'}}
        name={iconName}
        color={focused ? '#24786D' : '#e3e3e3'}
      />
      }
      return (
        <IconIon.Button
          style={{backgroundColor: 'white',justifyContent:'center', alignItems:'center', display:'flex'}}
          name={iconName}
          color={focused ? '#24786D' : '#d9d9d9'}
        />
      );
    },
  });
  return (
    <Home.Navigator screenOptions={screenOptions} >
      {/* <Home.Screen name="Feed" component={FeedScreen} />
      <Home.Screen name="Message" component={MessageScreen} /> */}
      <Home.Screen name="Post" component={PostScreen} />
      {/* <Home.Screen name="Notification" component={NotificationScreen} />
      <Home.Screen name="Profile" component={ProfileScreen} /> */}
    </Home.Navigator>
  );
};
const styles = StyleSheet.create({
  tabBarIcon:{
    
  }
});

export default HomeScreen;
