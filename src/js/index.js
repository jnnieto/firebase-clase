import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

const auth = getAuth();

window.crearUsuario = () => {
    
    const displayname = document.getElementById("").value;

}

createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    })