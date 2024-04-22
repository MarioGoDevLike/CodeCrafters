import React from 'react';

import {View, Pressable, Dimensions, StyleSheet} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';

const {width} = Dimensions.get('window');
const getIconName = (routeName: string) => {
  let iconName = 'home';
  switch (routeName) {
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
  return iconName;
};
const TabBar = ({state, descriptors, navigation, name}: any) => {
  return (
    <View style={styles.mainContainer}>
      {state.routes.map((route: any, index: number) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <View
            key={index}
            style={[
              styles.mainItemContainer,
              {borderRightWidth: label == 'notes' ? 3 : 0},
            ]}>
            <Pressable
              onPress={onPress}
              style={{backgroundColor: 'white', borderRadius: 20}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  padding: 15,
                }}>
                <IonIcon
                size={15}
                  style={{
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                    display: 'flex',
                  }}
                  name={getIconName(route.name)}
                  color={
                    isFocused
                      ? '#24786D'
                      : route.name === 'Post'
                      ? '#e3e3e3'
                      : '#d9d9d9'
                  }
                />
              </View>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 25,
    backgroundColor: 'white',
    borderRadius: 25,
    borderWidth:1,
    borderColor:'#24786D',
    marginHorizontal: width * 0.1,
  },
  mainItemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 1,
    borderColor: '#333B42',
  },
});

export default TabBar;
