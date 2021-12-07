// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { 
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSumjGuL2hDq0WD6V8IlO9zjauHlSChn8",
  authDomain: "fir-clase-857a8.firebaseapp.com",
  projectId: "fir-clase-857a8",
  storageBucket: "fir-clase-857a8.appspot.com",
  messagingSenderId: "14545106288",
  appId: "1:14545106288:web:4e43bcfa9d1a60e98e8bb5",
  measurementId: "G-Z1REYJ104Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

window.salir = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      document.location.href = "/src/views/index.html";
    })
    .catch((error) => {
      alert("Se produce error al cerrar al sesión");
      console.error(error);
    })
}

export function verAutenticacion() {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {

      if (document.getElementById("login"))
        document.getElementById("login").style.visibility = "hidden";

      if (user.photoURL != null) {
        document.getElementById("imgFotoUsuario").src = user.photoURL;
      } else {
        document.getElementById("imgFotoUsuario").src = "../../assets/img/user.jpg";
      }

      if (user.displayName) {
        document.getElementById("labelUsuario").innerHTML = user.displayName;
      }

    } else if (!user) {
      document.getElementById("navbarNav").style.visibility = "hidden";
      document.getElementById("itemSalir").style.visibility = "hidden";
      document.getElementById("imgFotoUsuario").style.visibility = "hidden";
    }
  });
}

