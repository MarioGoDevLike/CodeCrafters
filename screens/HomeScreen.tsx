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
import TabBar from '../components/TabBar';

const HomeScreen = () => {
  const Home = createBottomTabNavigator();

  const screenOptions = ({}) => ({
    tabBarIconStyle: styles.tabBarIcon,
    tabBarShowLabel: false,
    headerShown: false,
  });
  return (
    <Home.Navigator
      tabBar={props => <TabBar {...props} name={'add'} />}
      screenOptions={screenOptions}>
      <Home.Screen
        name="Feed"
        options={{
          tabBarIconStyle: styles.tabBarIcon,
          tabBarShowLabel: false,
          headerShown: true,
          headerTitleAlign:'center',
        }}
        component={FeedScreen}
      />
      <Home.Screen
        name="Message"
        options={screenOptions}
        component={MessageScreen}
      />
      <Home.Screen name="Post" options={screenOptions} component={PostScreen} />
      <Home.Screen
        name="Notification"
        options={screenOptions}
        component={NotificationScreen}
      />
      <Home.Screen
        name="Profile"
        options={screenOptions}
        component={ProfileScreen}
      />
    </Home.Navigator>
  );
};
const styles = StyleSheet.create({
  tabBarIcon: {},
  headerStyle:{
    borderRadius:1,
    borderWidth:2,
    borderBottomColor:'black'
  }
});

export default HomeScreen;
