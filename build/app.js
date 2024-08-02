import { signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { auth,db } from "./config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";


const google_login_btn =document.querySelector("#google_login_btn")
const provider = new GoogleAuthProvider();
google_login_btn.addEventListener('click',()=>{
    
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        const { displayName, email, photoURL } = user;

        // Save user info to Firestore
        try {
            await addDoc(collection(db, "users"), {
                name: displayName,
                email: email,
                photoURL: photoURL,
                uid: user.uid,
                createdAt: new Date()
            });
            window.location = 'todo.html'
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
})