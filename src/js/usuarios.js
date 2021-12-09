import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
import { verAutenticacion } from "../js/firebase.config.js";

const db = getFirestore();

window.onload = () => {
    verAutenticacion();
    cargarUsuarios();
}

const cargarUsuarios = () => {

    let contenido="<table class='table table-dark table-striped'>";

    contenido+="<thead>";
    contenido+="<tr>";

    contenido+="<th>Display Name</th>";
    contenido+="<th>Nombre</th>";
    contenido+="<th>Apellido</th>";
    contenido+="<th>Foto</th>";
    contenido+="<th>Telefono</th>";
    contenido+="<th>Correo</th>";

    contenido+="</tr>";
    contenido+="</thead>";

    contenido+="<tbody>";
    
    const q = query(collection(db, "usuario"), where("id", "!=", sessionStorage.getItem('uid')));
    getDocs(q).then(querySnapshot =>{

        querySnapshot.forEach(rpta => {
            const fila=rpta.data();
            contenido+="<tr>";
            contenido+="<td>"+fila.displayName+"</td>";
            contenido+="<td>"+fila.nombre+"</td>";
            contenido+="<td>"+fila.apellido+"</td>";
            contenido+="<td><img src=" + fila.imgFoto + " width=\"100\" height=\"100\" /></td>";
            contenido+="<td>"+fila.telefono+"</td>";
            contenido+="<td>"+fila.email+"</td>";
            contenido+="</tr>";

        });

        contenido+="</tbody>";
        contenido+="</table>";
        document.getElementById("usuarios").innerHTML=contenido;

    }).catch((error) => {
        console.log(error);
    });
}
