import { onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { atom, useSetAtom } from 'jotai'

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [uid, setUid] = useState(null);
  const setGlobalUid = useSetAtom(globalUid); 

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, user => {
      console.log('got user:', user);
      if (user) {
        setUser(user);
        setUid(user.uid);
      } else {
        setUser(null);
        setUid(null); 
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    setGlobalUid(uid); 
  }, [uid, setGlobalUid]);

  return { user, uid };
};

export default useAuth;

export const globalUid = atom(null);
