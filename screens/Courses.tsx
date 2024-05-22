import {View, Text} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MobileDevelopment from './MobileDevelopment';
import WebDevelopment from './WebDevelopment';

const Courses = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator tabBarOptions={{
      
      activeTintColor: 'white',
      labelStyle: {
          textTransform: "uppercase",
      },
      inactiveTintColor: 'black',
      indicatorStyle: {
          height: null,
          top: '10%',
          bottom: '10%',
          width: '45%',
          left: '2.5%',
          borderRadius: 100,
          backgroundColor: '#24786D',
      },
      style: {
          alignSelf: "center",
          width: '100%',
          borderRadius: 100,
          borderColor: "blue",
          backgroundColor: "white",
          elevation: 5, 
          shadowOpacity: .10,
          shadowRadius: 4, 
      },
      tabStyle: {
          borderRadius: 100,
      },
  }}>
      <Tab.Screen name="Mobile Development" component={MobileDevelopment} />
      <Tab.Screen name="Web Development" component={WebDevelopment} />
    </Tab.Navigator>
  );
};

export default Courses;
