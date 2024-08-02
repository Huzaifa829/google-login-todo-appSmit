import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";
const firebaseConfig = {
  apiKey: "AIzaSyAv6yu4UXFucPtEaaaCJWxR5bs4Z01sAkI",
  authDomain: "login-todo-app-c0bda.firebaseapp.com",
  projectId: "login-todo-app-c0bda",
  storageBucket: "login-todo-app-c0bda.appspot.com",
  messagingSenderId: "674969601247",
  appId: "1:674969601247:web:cd79cccaac1e3b5aef956a",
  measurementId: "G-9XWWSDG3HQ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
