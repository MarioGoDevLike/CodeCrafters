/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import SplashScreen from './screens/SplashScreen';
import Login from './screens/Login';
import Signup from './screens/Signup';
import WelcomeScreen from './screens/WelcomeScreen';
import useAuth from './hooks/useAuth';
import HomeScreen from './screens/HomeScreen';
import SetupProfile from './screens/SetupProfile';
import MessageScreen from './screens/MessageScreen';
import PostScreen from './screens/PostScreen';
import NotificationScreen from './screens/notificationScreen';
import ProfileScreen from './screens/ProfileScreen';
import Comments from './screens/Comments';
import messaging from '@react-native-firebase/messaging';
import { ChatContextProvider } from './config/chatContext';
import Chat from './components/Chat';
import usePushNotification from './config/usePushNotification';
import EditProfile from './components/EditProfile';
import Search from './screens/Search';

function App(): React.JSX.Element {
  const { user } = useAuth();
  

  const Stack = createNativeStackNavigator();
  const {
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

  useEffect(() => {
    requestUserPermission();
  }, []);
  

  return (
    <ChatContextProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={({ route }) => ({
            headerTitleAlign: 'center',
            headerTintColor: 'black',
            headerShown: route.name === 'Comments',
          })}>
          <Stack.Screen name="Comments" component={Comments} />
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{ headerShown: true, headerTitle:'Edit Profile' }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SetupProfile"
            component={SetupProfile}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Search"
            component={Search}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ChatContextProvider>
  );
}

export default App;
