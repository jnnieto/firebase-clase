import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
import { getStorage  } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-storage.js";
import { verAutenticacion } from "../js/firebase.config.js";

const db = getFirestore();
const storage = getStorage();
var operacion;

window.onload = function () {
    verAutenticacion();
    cargarRestaurantes();
}

const cargarRestaurantes = async () => {

    let contenido="";
    
    const q = query(collection(db, "restaurantes"), where("estado", "==", true));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(rpta => {
        const fila = rpta.data();
        contenido+="<div class='col-lg-4 mb-4'>";
        contenido+="<div class='card'>";
        contenido+="<img src=" + fila.foto + " alt='' class='card-img-top'>";
        contenido+="<div class='card-body'>";
        contenido+="<h5 class='card-title'>" + fila.nombre + "</h5>";
        contenido+="<p class='card-text'><strong>Direccion: </strong>" + fila.direccion + "</p>";
        contenido+= calularRating(fila.rating);
        contenido+="<div class='icon-block'>";
        contenido+="<a href='"+ fila.menu + "' target='_blank'><i class='fa fa-eye'></i> Ver menu</a></br>";
        contenido+="<a href='' target='_blank'><i class='fa fa-comments'></i> Ver comentarios</a>"
        contenido+="</div>"
        contenido+="<input type='button' class='btn btn-success' value='Editar' onclick='abrirModal(\""+rpta.id+"\")' data-toggle='modal' data-target='#exampleModal' />";
        contenido+="<input type='button' value='Eliminar' class='btn btn-danger' onclick='eliminar(\""+rpta.id+"\")' />";
        contenido+="</div>";
        contenido+="</div>";
        contenido+="</div>";
    });

    document.getElementById("restaurante").innerHTML=contenido;
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