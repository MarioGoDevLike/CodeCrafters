import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import axios from 'axios';
import IonIcon from 'react-native-vector-icons/Ionicons';


const NotificationScreen = () => {
  const [chat, setChat] = useState([]);
  const [userInput , setUserInput] = useState('');
  const [loading ,setLoading] = useState(false);
  const [error ,setError] = useState(false);

  const API_KEY = "AIzaSyBl0jjxjNDG9aZBimhAQxc3UzcClevSXfY";

  const handleUserInput = async () => {
    let updatedChat = [
      ...chat,
      {
        role: "user",
        parts: [{ text: userInput }],
      },
    ];
  
    setChat(updatedChat);
  
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
        {
          contents: updatedChat,
        }
      );
      console.log("Gemini Response:", response.data);
      const modelResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  
      if (modelResponse) {
        const updatedChatWithModel = [
          ...updatedChat,
          {
            role: 'model',
            parts: [{ text: modelResponse }],
          },
        ];
        setChat(updatedChatWithModel);
        setUserInput("");
      }
    } catch (Error) {
      console.error("Error gemini api: ", Error);
      console.error('error response:', Error.response);
    }
  };
  const renderItem = ({ item }) => (
    <View style={item.role === 'user' ? styles.userMessage : styles.modelMessage}>
      <IonIcon
        name={item.role === 'user' ? 'man-outline' : 'logo-ionitron'}
        size={24}
        style={{ marginRight: 10 }}
      />
      <Text style={item.role === 'user' ? styles.userText : styles.modelText}>{item.parts[0].text}</Text>
    </View>
  );
 
  return (
    <View style={styles.container}>
      <View style={{alignItems:'center', justifyContent:'center',height:60,}}>
        <Text style={{fontSize:20, fontWeight:'bold', color:"black"}}>Chat BestFriend</Text>
      </View>
      <FlatList
        data={chat}
        renderItem={renderItem}
        keyExtractor={(item) => item.role + Math.random().toString()}
      />
      <View style={styles.textInputContainer}>
        <TextInput
          value={userInput}
          onChangeText={setUserInput}
          style={styles.textInput}
          placeholder="Type your message..."
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleUserInput}>
          <Text style={{color:'white', fontWeight:'300',}}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingBottom:100
  },
  userMessage: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  modelMessage: {
    backgroundColor: '#24786D',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  userText: {
    color: '#000',
  },
  modelText: {
    color:'white',
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff', 
    padding: 10,
  },
  textInput: {
    flex: 1,
    backgroundColor: '#eee',
    borderRadius: 5,
    padding: 10,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor:'#24786D'    
  }
});
export default NotificationScreen;
