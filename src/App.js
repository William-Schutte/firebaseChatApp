import React from 'react';
import './App.css';
// import firebase from 'firebase/app';
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
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

  return (
    <div className="App">
      <header className="App-header">
        Hello World
      </header>
      <SignIn></SignIn>
      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>
    </div>
  );
}

const SignIn = () => {
  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  return (
    <button onClick={signInWithGoogle}>
      Sign in with Google
    </button>
  )
}
const SignOut = () => {
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  );
}

const ChatRoom = () => {
  const messagesRef = collection(firestore, 'messages');
  // const query = getDocs(messagesRef);
  // const [messages] = useCollectionData(query, { idField: 'id' });

  return (
    <>
      <div>Yo dawg
        {/* {messages && messages.map(msg => (<ChatMessage key={msg.id} message={msg} />))} */}
      </div>
    </>
  )
}

const ChatMessage = ({ message }) => {
  const { text, uid } = message;

  return (
    <p>{text}</p>
  )
}

export default App;
