import React, { useState, useEffect } from 'react';
import './App.css';
// import firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, where, query, onSnapshot } from 'firebase/firestore';
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
      <SignOut />
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

  const messagesRef = collection(firestore, 'messages');
  // const docs = getDocs(messagesRef);
  const q = query(messagesRef, where("message", "!=", ""));

  const snapshotListener = onSnapshot(q, (querySnapshot) => {
    const newData = [];
    querySnapshot.forEach((d) => (newData.push(d.data())));
    console.log(newData);
    setDocs(newData);
  });

  return (
    <>
      <div className="chat">Yo dawg
        {docs && docs.map((msg) => <ChatMessage message={msg.message} key={msg.userid} />)}
      </div>
    </>
  )
}

const ChatMessage = ({ message }) => {
  

  return (
    <p>{message}</p>
  )
}

export default App;
