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

import Comments from './screens/Comments';
import messaging from '@react-native-firebase/messaging';
import { ChatContextProvider } from './config/chatContext';
import Chat from './components/Chat';
import usePushNotification from './config/usePushNotification';
import EditProfile from './components/EditProfile';
import Search from './screens/Search';
import SearchItem from './screens/SearchItem';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CourseInfo from './components/CourseInfo';
import CodeSnippetsComments from './components/CodeSnippetsComments';
import VideoView from './components/VideoView';

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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            name="SearchResult"
            component={SearchItem}
            options={{ headerShown: true, headerTitle:'Result' }}
          />
          <Stack.Screen
            name="Welcome"
            component={WelcomeScreen}
            options={{ headerShown: false,  }}
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
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="Search"
            component={Search}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="CourseInfo"
            component={CourseInfo}
            options={{ headerShown: true }}
          />
          <Stack.Screen
            name="VideoView"
            component={VideoView}
            options={{ headerShown: true, headerTitle:''}}
          />
          <Stack.Screen
            name="CodeSnippetsComments"
            component={CodeSnippetsComments}
            options={{ headerShown: true, headerTitle:'' }}
          />
          
        </Stack.Navigator>
      </NavigationContainer>
    </ChatContextProvider>
    </GestureHandlerRootView>
  );
}

export default App;
