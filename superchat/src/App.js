import logo from './logo.svg';
import './App.css';

import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore';
import 'firebase/compat/auth'; 

import { useAuthState, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore'

firebase.initializeApp({
  apiKey: "AIzaSyDlXLgKsTsK1xv42E5oFzAT-w3uUoMWrcU",
  authDomain: "live-chat-64d5e.firebaseapp.com",
  projectId: "live-chat-64d5e",
  storageBucket: "live-chat-64d5e.appspot.com",
  messagingSenderId: "20478111196",
  appId: "1:20478111196:web:b0355d451db31a1d0fb319",
  measurementId: "G-J2MXJKDTTY"
})

const [user] = useAuthState(auth);

function App() {
  return (
    <div className="App">
      <header className="App-header">
      
      </header>
      <section>
        {user ? <ChatRoom/> : <SignIn/>}
      </section>
    </div>
  );
}

function SignIn(){
  const useSignInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.SignInWithPopup(provider);
  }

  return(
    <button onClick = {useSignInWithGoogle}>Sign in with Google</button>
  )
}

function SignOut () {
  return auth.currentUser && (

    <button onClick = {() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {



  const dummy = useRef()


  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderby('createdAt').limit(25);

  const [messages] = useCollectionData(query, {idField : 'id'});

  const[formvalue, setFormValue] = useState('');

  const sendMessage = async(e) => {
    e.preventDefault();

    const {uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formvalue,
      createdAt : firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');

    dummy.current.scrollIntoView({ behaviour: 'smooth' });
  }

  return(
    <>
      <main>
        {messages && messages.map(msg => <ChatMessage key = {msg.id} messsage = {msg} />)}

        <div ref={dummy}></div>

      </main>

      <form onSubmit= {sendMessage}>
        <input value = {formvalue} onChange={(e) => setFormValue(e.target.value)} />

        <button type = "submit">😒</button>
      </form>
    </>
  )
}

function ChatMessage(props) {
  const {text, uid} = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';

  return (
    <div className = {`message ${messageClass}`}>
      <img src = {photoURL}/>
      <p>{text}</p>
    </div>
  
  )
}

export default App;
