import {createContext, useReducer} from 'react';
import {useAtom} from 'jotai';
import useAuth, {globalUid} from '../hooks/useAuth';


export const ChatContext = createContext();

export const ChatContextProvider = ({children}) => {
  const currentUid = useAuth().uid;

  const INITIAL_STATE = {
    chatId: 'null',
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case 'CHANGE_USER':
        return {
          user: action.payload,
          chatId:
          currentUid > action.payload.uid
              ? currentUid  + action.payload.uid
              : action.payload.uid + currentUid,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{data: state, dispatch}}>
      {children}
    </ChatContext.Provider>
  );
};
