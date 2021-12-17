import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { FirebaseError, initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, where, query, onSnapshot, addDoc, serverTimestamp, getDocs } from 'firebase/firestore';
import 'firebase/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const app = initializeApp({
  apiKey: "AIzaSyAkZv0GyfGGkjYtuV0gyKog16ITKJ8G09c",
  authDomain: "fir-chatapp-2ffae.firebaseapp.com",
  projectId: "fir-chatapp-2ffae",
  storageBucket: "fir-chatapp-2ffae.appspot.com",
  messagingSenderId: "295718496148",
  appId: "1:295718496148:web:beecec89ebfe9dd7ef1181",
  measurementId: "G-SHRSZ8V4XL"
});

const auth = getAuth();
const firestore = getFirestore(app);

function App() {
  const [user] = useAuthState(auth);

  console.log("User", user);
  return (
    <div className="App">
      <header className="header">
        Firebase Chat App
      </header>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
      {user && <SignOut />}
    </div>
  );
}

const SignIn = () => {
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    console.log(result.user);
  };

  return (
    <button className="btn" onClick={signInWithGoogle}>
      Sign in with Google
    </button>
  )
}
const SignOut = () => {
  return auth.currentUser && (
    <button className="btn" onClick={() => auth.signOut()}>Sign Out</button>
  );
}

const ChatRoom = () => {
  const [docs, setDocs] = useState(null);
  const [formValue, setFormValue] = useState('');
  const dummy = useRef();
  const messagesCollection = collection(firestore, 'messages');
  const q = query(messagesCollection, where("text", "!=", ""));
  // const intervalListener = setInterval(async() => {
  //   const querySnapshot = await getDocs(messagesCollection);
  //   const queryDocs = [];
  //   querySnapshot.forEach((doc) => {
  //     queryDocs.push(doc.data());
  //   });
  //   queryDocs.sort((a, b) => {
  //     if (a.createdAt < b.createdAt) {
  //       return -1;
  //     } else {
  //       return 1;
  //     }
  //   })
  //   setDocs(queryDocs);
  //   console.log(queryDocs);
  // }, 5000);

  // useEffect(() => {
  //   return () => clearInterval(intervalListener);
  // }, [intervalListener]);
  const snapshotListener = onSnapshot(q, (querySnapshot) => {
    const newData = [];
    querySnapshot.forEach((d) => (newData.push(d.data())));
    setDocs(newData);
  });

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    const newDocRef = await addDoc(messagesCollection, {
      text: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue('');
  }

  dummy.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="chat">
      <div className="chat-view">
        {docs && docs.map((msg) => <ChatMessage message={msg} key={msg.time} />)}
        <div ref={dummy}></div>
      </div>
      <form className="chat-form" value={formValue} onSubmit={sendMessage}>
        <input className="chat-input" value={formValue} onChange={(e) => setFormValue(e.target.value)} />
        <button type="submit" className="chat-send">Send</button>
      </form>
    </div>
  )
}

const ChatMessage = ({ message }) => {
  const { text, uid, photoURL } = message;
  const userMessage = uid === auth.currentUser.uid ? 'message sentMsg' : 'message receivedMsg';
  return (
    <div className={userMessage}>
      <img src={photoURL} alt="User icon" />
      <p>{text}</p>
    </div>
  )
}

export default App;
