import {View, Text} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import MobileDevelopment from './MobileDevelopment';
import WebDevelopment from './WebDevelopment';

const Courses = () => {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Mobile Development" component={MobileDevelopment} />
      <Tab.Screen name="Web Development" component={WebDevelopment} />
    </Tab.Navigator>
  );
};

export default Courses;
