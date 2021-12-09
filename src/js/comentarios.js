import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, collection, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

const db = getFirestore();

export const realizarComentario = (idRestaurante, comentario) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        const comentarionuevo = doc(collection(db, `restaurantes/${ idRestaurante }/comentarios`));
        setDoc(comentarionuevo, {
            comentario: comentario.comentario,
            calificacion: comentario.calificacion,
            usuario: {
                displayName: user.displayName,
                foto: user.photoURL,
                uid: user.uid
            }
        }).then(() => {
            editarRating(idRestaurante, comentario.calificacion);
        }).catch((error) =>{
            console.log("Ha ocurrido un error.");
            console.log(error);
        });;
        
    }) ;
    
}

const editarRating = (idRestaurante, rating) => {
    const docRef = doc(db, "restaurantes", idRestaurante);
    getDoc(docRef).then(docSnap =>{

        if(docSnap.exists()) {
                const data = docSnap.data();
                const newRating = (parseFloat(rating) + parseFloat(data.rating)) / 2.0;
                const restauranteRef = doc(db, "restaurantes", idRestaurante);
                updateDoc(restauranteRef , {
                    rating: newRating
                }).then(() =>{
                    alert("Comentario agregado correctamente");
                    document.location.href = "/src/views/restaurante.html";
                }).catch((error) =>{
                        console.log("Ha ocurrido un error.");
                        console.log(error);
                });
        }

    }).catch((error) =>{
        console.log("Ha ocurrido un error.");
        console.log(error);
    });

}



