import { getFirestore, collection, query, where, getDocs , doc, setDoc, updateDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL  } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-storage.js";
import { verAutenticacion } from "../js/firebase.config.js";
import { realizarComentario } from "./comentarios.js";

const db = getFirestore();
const storage = getStorage();
var operacion;
var idRestauranteGolbal;

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
        contenido+="<img src=" + fila.foto + " alt='' class='card-img-top imagen'>";
        contenido+="<div class='card-body'>";
        contenido+="<h5 class='card-title'>" + fila.nombre + "</h5>";
        contenido+="<p class='card-text'><strong>Direccion: </strong>" + fila.direccion + "</p>";
        contenido+= calularRating(fila.rating);
        contenido+="<div class='icon-block'>";
        contenido+="<a href='"+ fila.menu + "' target='_blank'><i class='fa fa-eye'></i> Ver menu</a></br>";
        contenido+="<button type='button' class='btn btn-primary' onclick='verComentarios(\""+rpta.id+"\")'><i class='fa fa-comments'></i> Ver comentarios</button>"
        contenido+="</div>"
        contenido+="<input type='button' class='btn btn-success' value='Editar' onclick='abrirModal(\""+rpta.id+"\")' data-toggle='modal' data-target='#exampleModal' />";
        contenido+="<input type='button' value='Eliminar' class='btn btn-danger' onclick='eliminar(\""+rpta.id+"\")' />";
        contenido+="<input type='button' value='Comentar' class='btn btn-secondary'  data-toggle='modal' data-target='#commentModal' onclick='abrirModalComentario(\""+ fila.nombre +"\", \""+rpta.id+"\")' />";
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

window.abrirModal = function abrirModal(idRestaurante) {

    limpiarDatos();
    if(idRestaurante == 0) {
        operacion = 1;
        document.getElementById("lblTitulo").innerHTML = "Agregar restaurante";
    } else {
        operacion = 2;
        document.getElementById("lblTitulo").innerHTML = "Editar restaurante";
        idRestauranteGolbal = idRestaurante;
        cargarDatos(idRestaurante);
    }
    
}

const cargarDatos = (idRestaurante) => {

    const docRef = doc(db, "restaurantes", idRestaurante);
    getDoc(docRef).then(docSnap => {
        if (docSnap.exists()) {
            
            const data = docSnap.data();
            document.getElementById("txtnombre").value = data.nombre;
            document.getElementById("txtdireccion").value = data.direccion;
            document.getElementById("imgFoto").src = data.foto;
            document.getElementById("iframePreview").src = data.menu;
            
        } else {
            alert("No se puede encontrar el restuarante");
        }
    }).catch((error) => {
        alert("Ocurrio un error" + error.message);
    });
    
}

const limpiarDatos = () => {
    document.getElementById("txtnombre").value = "";
    document.getElementById("txtdireccion").value = "";
    document.getElementById("imgFoto").src = '../../assets/img/user.jpg';
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

window.operar = function operar() {
    if(operacion == 1) {
        guardar();
    } else {
        editar();
    }
}

const editar = () => {
    const nombre = document.getElementById("txtnombre").value;
    const direccion = document.getElementById("txtdireccion").value;
    const promises = [];

    let uploadTask, uploadTaskFile;
    if(document.getElementById("imgFoto").src.includes('data:image/')){
        const foto = document.getElementById("fileImage").files[0];
        const imageRef = ref(storage, 'restaurante/foto/' + idRestauranteGolbal);
        uploadTask = uploadBytesResumable(imageRef, foto);
        promises.push(uploadTask);
    }

    if(document.getElementById("iframePreview").src.includes('data:application/')){
        const archivo = document.getElementById("file").files[0];
        const pdfRef = ref(storage, 'restaurante/menu/' + idRestauranteGolbal);
        uploadTaskFile = uploadBytesResumable(pdfRef, archivo);
        promises.push(uploadTaskFile);
    }
    
    Promise.all(promises).then(values =>{

        let flagSuccess = true;
        values.forEach(rpta =>{
                if(rpta.state !== "success"){
                    flagSuccess = false;
                    return;
                }
        });

        if(flagSuccess) {

            let downloadUrlFoto, downloadUrlPdf;
            let fotoBoolean = false;
            let documentoBoolean = false;
            const promises2 = [];
            if(document.getElementById("imgFoto").src.includes('data:image/')){
                downloadUrlFoto = getDownloadURL(uploadTask.snapshot.ref);
                promises2.push(downloadUrlFoto);
                fotoBoolean = true;
            }
            if(document.getElementById("iframePreview").src.includes('data:application/')){
                downloadUrlPdf = getDownloadURL(uploadTaskFile.snapshot.ref);
                promises2.push(downloadUrlPdf);
                documentoBoolean = true;
            }

            Promise.all(promises2).then(values =>{
                let fotoUrlFinal, documentoUrlFinal;   
                if(fotoBoolean && documentoBoolean) {
                    fotoUrlFinal = values[0];
                    documentoUrlFinal = values[1];
                } else if (fotoBoolean && !documentoBoolean) {
                    fotoUrlFinal = values[0];
                    documentoUrlFinal = document.getElementById("iframePreview").src;
                } else if(!fotoBoolean && documentoBoolean){
                    fotoUrlFinal = document.getElementById("imgFoto").src;
                    documentoUrlFinal = values[0];
                } else {
                    fotoUrlFinal = document.getElementById("imgFoto").src;
                    documentoUrlFinal = document.getElementById("iframePreview").src;
                }

                const restauranteRef = doc(db, "restaurantes", idRestauranteGolbal);
                updateDoc(restauranteRef, {
                        nombre: nombre,
                        direccion: direccion,
                        foto: fotoUrlFinal,
                        menu: documentoUrlFinal
                }).then(() =>{
                    alert("Editado correctamente");
                    $("#exampleModal").modal('hide');
                    cargarRestaurantes();
                }).catch(error =>{
                    document.getElementById("alertaErrorCrearRestaurante").style.display = "block";
                    document.getElementById("alertaErrorCrearRestaurante").innerHTML = error.errorMessage;
                });

            });


        } else {
            document.getElementById("alertaErrorCrearRestaurante").style.display = "block";
            document.getElementById("alertaErrorCrearRestaurante").innerHTML = "Error al cargar documentos";
        }

    });
}

const guardar = () => {

    //Agregar validaciones

    const nombre = document.getElementById("txtnombre").value;
    const direccion = document.getElementById("txtdireccion").value;
    const foto = document.getElementById("fileImage").files[0];
    const archivo = document.getElementById("file").files[0];

    const newRestaurant = doc(collection(db, "restaurantes"));
    setDoc(newRestaurant, {
        nombre: nombre,
        direccion: direccion,
        estado: true,
        rating: 5
    }).then(() =>{
        const imageRef = ref(storage, 'restaurante/foto/' + newRestaurant.id);
        const uploadTask = uploadBytesResumable(imageRef, foto);
        /*uploadTask.on('state_changed',
            (snapshot) => {},
            (error) => {
                document.getElementById("alertaErrorCrearRestaurante").style.display = "block";
                document.getElementById("alertaErrorCrearRestaurante").innerHTML = error.errorMessage;
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    fotoActualizada = downloadURL;
                });
            }
        );*/

        const pdfRef = ref(storage, 'restaurante/menu/' + newRestaurant.id);
        const uploadTaskFile = uploadBytesResumable(pdfRef, archivo);
        /*uploadTask.on('state_changed',
            (snapshot) => {},
            (error) => {
                document.getElementById("alertaErrorCrearRestaurante").style.display = "block";
                document.getElementById("alertaErrorCrearRestaurante").innerHTML = error.errorMessage;
            },
            () => {
                getDownloadURL(uploadTaskFile.snapshot.ref).then((downloadURL) => {
                    fdfActualizada = downloadURL;
                });
            }
        );  */   

       Promise.all([uploadTask, uploadTaskFile]).then(values =>{

            let flagSuccess = true;
            values.forEach(rpta =>{
                    if(rpta.state !== "success"){
                        flagSuccess = false;
                        return;
                    }
            });

            if(flagSuccess) {
                
                //Mala practica
                /*getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    fotoActualizada = downloadURL;
                    getDownloadURL(uploadTaskFile.snapshot.ref).then((downloadURL) => {
                        fdfActualizada = downloadURL;
                        //Editar
                    });
                });*/

                const downloadUrlFoto = getDownloadURL(uploadTask.snapshot.ref);
                const downloadUrlPdf = getDownloadURL(uploadTaskFile.snapshot.ref);
   
                Promise.all([downloadUrlFoto, downloadUrlPdf]).then(valuesUpload =>{
                            
                        const resturanteRef = doc(db, "restaurantes", newRestaurant.id);
                        updateDoc(resturanteRef, {
                            foto: valuesUpload[0],
                            menu: valuesUpload[1]
                        }).then(() =>{
                                alert("Agregado correctamente");
                                $("#exampleModal").modal('hide');
                                cargarRestaurantes();
                        }).catch(error =>{
                            document.getElementById("alertaErrorCrearRestaurante").style.display = "block";
                            document.getElementById("alertaErrorCrearRestaurante").innerHTML = error.errorMessage;
                        });
                });


            } else{
                document.getElementById("alertaErrorCrearRestaurante").style.display = "block";
                document.getElementById("alertaErrorCrearRestaurante").innerHTML = "Ocurrio un error al cargar datos";
            }

        }).catch((error) =>{
            document.getElementById("alertaErrorCrearRestaurante").style.display = "block";
            document.getElementById("alertaErrorCrearRestaurante").innerHTML = error.errorMessage;
        });
    

    }).catch(error =>{
        document.getElementById("alertaErrorCrearRestaurante").style.display = "block";
        document.getElementById("alertaErrorCrearRestaurante").innerHTML = error.errorMessage;
    });

}

window.eliminar =  function eliminar(idRestaurante) {
     const restauranteRef = doc(db, "restaurantes", idRestaurante);
     updateDoc(restauranteRef, {
         estado:  false
     }).then(() =>{
        alert("Eliminado correctamente");
        cargarRestaurantes();
     }).catch((error)=>{
        alert("Ocurrio un error al eliminar");
    });

}

window.abrirModalComentario = function abrirModalComentario(nombre, idRestaurante) {
    document.getElementById("lblComentario").innerHTML = `Qué te ha parecido el restaurante ${ nombre } ?`;
    idRestauranteGolbal = idRestaurante;
}

window.agregarComentario = function agregarComentario() {
    
    const comment = document.getElementById("txt-comentario").value;
    const calificacion = document.getElementById("txt-calificacion").value;

    const comentario = {
        comentario: comment,
        calificacion
    }

    realizarComentario(idRestauranteGolbal, comentario);

} 

window.verComentarios =  function verComentarios(idRestaurante) {

    const q = query(collection(db, `restaurantes/${ idRestaurante }/comentarios`));

    let modal="<div class='modal-header'>";
    const subscribe =  onSnapshot(q, async (querySnapshot) => {
        modal+="<h4 class='modal-title' id='myModalLabel'>Comentarios del restaurante tal..</h4>";
        modal+="<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>×</button>";
        modal+="</div>";
        modal+="<div class='modal-body'>";
        modal+="<ol class='list-group list-group-numbered'>"
        await querySnapshot.forEach(rtpa => {
            let fila = rtpa.data();
            modal+="<li class='list-group-item d-flex justify-content-between align-items-start'>";
            modal+="<div class='ms-2 me-auto'>";
            modal+="<div class='fw-bold'><img src=" + fila.usuario.foto + " alt='' class='card-img-top imagen-comment'><strong>" + fila.usuario.displayName + "</strong></div>";
            modal+="Comentario: " + fila.comentario + "</div>"
            modal+="<span class='badge bg-primary rounded-pill'>" + calularRating(fila.calificacion) + "</span>";
            modal+="</li>";
        });
        modal+="</ol>";
        modal+="</div>";
        modal+="<div class='modal-footer'>";
        modal+="<button type='button' class='btn btn-info waves-effect' data-dismiss='modal'>Close</button>"
        modal+="</div>";
        document.getElementById("comments").innerHTML=modal;
        $("#modal-commets").modal('show');
    });

}