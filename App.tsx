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

function App(): React.JSX.Element {
  const { user } = useAuth();

  const Stack = createNativeStackNavigator();
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  const getToken = async () => {
    const token = await messaging().getToken();
    console.log("Token", token);
  }

  useEffect(() => {
    requestUserPermission();
    getToken();
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
        </Stack.Navigator>
      </NavigationContainer>
    </ChatContextProvider>
  );
}

export default App;
