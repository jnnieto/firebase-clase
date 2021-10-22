import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    GithubAuthProvider,
    TwitterAuthProvider,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

import {
    verAutenticacion
} from './firebase.config.js';

const auth = getAuth();

window.onload = () => {
    verAutenticacion();
}


window.abrirMoldal = function abrirMoldal() {
    document.getElementById("alertaErrorRegistro").style.display = "none";
    document.getElementById("alertaErrorRegistro").innerHTML = "";
    document.getElementById("txtDisplayName").value = "";
    document.getElementById("txtcorreo").value = "";
    document.getElementById("txtcontra").value = "";
}

window.crearUsuario = function crearUsuario() {

    const displayName = document.getElementById("txtDisplayName").value;
    const correo = document.getElementById("txtcorreo").value;
    const contrasena = document.getElementById("txtcontra").value;

    if (displayName == "") {
        document.getElementById("alertaErrorRegistro").style.display = "block";
        document.getElementById("alertaErrorRegistro").innerHTML = "Debe ingresar un displayName";
        return;
    }
    if (correo == "") {
        document.getElementById("alertaErrorRegistro").style.display = "block";
        document.getElementById("alertaErrorRegistro").innerHTML = "Debe ingresar un correo";
        return;
    }
    if (contrasena == "") {
        document.getElementById("alertaErrorRegistro").style.display = "block";
        document.getElementById("alertaErrorRegistro").innerHTML = "Debe ingresar un contrasena";
        return;
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, correo, contrasena).then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        updateProfile(auth.currentUser, {
            displayName: displayName
        }).then(() => {
            alert("Usuario registrado correctamente");
            //console.log(userCredential);
            auth.signOut();
            document.location.href = "/src/views/";
        }).catch((error) => {
            const errorMessage = error.message;
            document.getElementById("alertaErrorRegistro").style.display = "block";
            document.getElementById("alertaErrorRegistro").innerHTML = errorMessage;
        });

    }).catch((error) => {
        //const errorCode = error.code;
        const errorMessage = error.message;
        document.getElementById("alertaErrorRegistro").style.display = "block";
        document.getElementById("alertaErrorRegistro").innerHTML = errorMessage;
    });

}

window.authGoogle = () => {

    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;

            /* console.log(credential);
            console.log(token);
            console.log(user); */
            alert("Iniciado correctamente desde Google");

            // ...
        }).catch((error) => {
            //const errorCode = error.code;
            //const email = error.email;
            const errorMessage = error.message;
            document.getElementById("alertErrorLogueo").style.display = "block";
            document.getElementById("alertErrorLogueo").innerHTML = errorMessage;
            // The AuthCredential type that was used.
            //const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
}

window.authGithub = () => {

    const githubProvider = new GithubAuthProvider();
    const auth = getAuth();

    signInWithPopup(auth, githubProvider)
        .then((data) => {
            const credential = GithubAuthProvider.credentialFromResult(data);
            const token = credential.accessToken;

            // The signed-in user info.
            const user = data.user;

            /* console.log(credential);
            console.log(token);
            console.log(user); */
            alert("Iniciado correctamente desde Github");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = GithubAuthProvider.credentialFromError(error);
            console.log(error);
        })
}

window.authTwitter = () => {

    const twitterProvider = new TwitterAuthProvider();
    const auth = getAuth();

    signInWithPopup(auth, twitterProvider)
        .then((result) => {
            // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
            // You can use these server side with your app's credentials to access the Twitter API.
            const credential = TwitterAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const secret = credential.secret;

            // The signed-in user info.
            const user = result.user;
            /* console.log(credential);
            console.log(token);
            console.log(user); */
            alert("Iniciado correctamente desde Github");
            // ...
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.email;
            // The AuthCredential type that was used.
            const credential = TwitterAuthProvider.credentialFromError(error);

            console.log(error);
            // ...
        });

}

window.iniciarSesion = () => {

    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;

    if (correo === "" || contrasena === "") {
        document.getElementById("alertaErrorLogeo").style.display = "block";
        document.getElementById("alertaErrorLogeo").innerHTML = "El correo y contraseña deben ser obligatorios";
        return;
    } else {
        const autn = getAuth();
        signInWithEmailAndPassword(auth, correo, contrasena)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                document.location.href = "/src/views/index.html";
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                document.getElementById("alertaErrorLogeo").style.display = "block";
                document.getElementById("alertaErrorLogeo").innerHTML = errorMessage;
            });

    }

}
