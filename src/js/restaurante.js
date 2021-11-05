import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-firestore.js";
import { getStorage  } from "https://www.gstatic.com/firebasejs/9.0.2/firebase-storage.js";
import { verAutenticacion } from "./firebase.js";

const db = getFirestore();
const storage = getStorage();
var operacion;

window.onload = function () {
    verAutenticacion();
    cargarRestaurantes();
}

function cargarRestaurantes(){

    let contenido="<table class='table mt-2'>";

    contenido+="<thead>";
    contenido+="<tr>";

    contenido+="<th>Id</th>";
    contenido+="<th>Nombre</th>";
    contenido+="<th>Direccion</th>";
    contenido+="<th>Foto</th>";
    contenido+="<th>Menu</th>";
    contenido+="<th>Rating</th>";
    contenido+="<th>Opciones</th>";

    contenido+="</tr>";
    contenido+="</thead>";

    contenido+="<tbody>";
    
    const q = query(collection(db, "resturante"), where("visible", "==", true));
    getDocs(q).then(querySnapshot =>{

        querySnapshot.forEach(rpta => {
            //console.log(rpta.id, " => ", rpta.data());
            const fila=rpta.data();
            contenido+="<tr>";
            contenido+="<td>"+rpta.id+"</td>";
            contenido+="<td>"+fila.nombre+"</td>";
            contenido+="<td>"+fila.direccion+"</td>";
            contenido+="<td><img src=" + fila.foto + " width=\"100\" height=\"100\" /></td>";
            contenido+="<td>" + fila.menu + "</td>";
            contenido+="<td>"+ calularRating(fila.rating) +"</td>";
            contenido+="<td>";
            contenido+="<input type='button' class='btn btn-primary' value='Editar' onclick='abrirModal(\""+rpta.id+"\")' data-toggle='modal' data-target='#exampleModal' />";
            contenido+="<input type='button' value='Eliminar' class='btn btn-danger' onclick='eliminar(\""+rpta.id+"\")' />";
            contenido+="</td>";
            contenido+="</tr>";

        });

        contenido+="</tbody>";
        contenido+="</table>";
        document.getElementById("divRestaurante").innerHTML=contenido;

    }).catch((error) => {
        console.log(error);
    });
}

function calularRating(rating){
    let contenido = "<div>";
    for(let i = 1; i <= 5; i++) {
        if(rating >= i)
            contenido += "<span class=\"fa fa-star checked\"></span>";
        else    
            contenido += "<span class=\"fa fa-star \"></span>";
    }
    contenido += "</div>";
    return contenido;
}

window.abrirModal = function abrirModal(opc) {
    limpiarDatos();
    if(opc == 0) {
        operacion = 1;
        document.getElementById("lblTitulo").innerHTML = "Agregar restaurante";
    } else {
        operacion = 2;
        document.getElementById("lblTitulo").innerHTML = "Editar restaurante";
    }

}

function limpiarDatos() {
    document.getElementById("txtnombre").value = "";
    document.getElementById("txtdireccion").value = "";
    document.getElementById("imgFoto").src = 'asset/img/nouser.jpg';
    document.getElementById("iframePreview").src = "";

    document.getElementById("alertaErrorCrearRestaurante").style.display = "none";
    document.getElementById("alertaErrorCrearRestaurante").innerHTML = "";
}

window.subirImage = function subirImage(e) {
    const file = e.files[0];
    let reader = new FileReader();
    reader.onloadend= function() {
        document.getElementById("imgFoto").src = reader.result;
    }
    reader.readAsDataURL(file);
}

window.subirArchivo = function subirArchivo(e) {
    const file = e.files[0];
    let reader = new FileReader();
    reader.onloadend= function() {
        document.getElementById("iframePreview").src = reader.result;
    }
    reader.readAsDataURL(file);
}

window.descargarArchivo = function descargarArchivo() {
    const linkSource = document.getElementById("iframePreview").src;
    const downloadLink = document.createElement("a");
    const filename = "menuSoprte.pdf";
    downloadLink.href= linkSource;
    downloadLink.download = filename;
    downloadLink.target = "_black";
    downloadLink.click();
}