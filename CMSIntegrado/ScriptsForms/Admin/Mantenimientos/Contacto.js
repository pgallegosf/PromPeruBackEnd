$(document).ready(function () {
    ListarContactos();
    $(document).keyup(function (event) {
        if (event.which == 27) {
            $('.reveal-modal-bg').css({ transition: "all 0.4s linear", height: "100%", opacity: "1" });
        }
    });
});

function ListarContactos() {
    grilla = new ccG_Objeto("gridContactos", true, true, true, false);
    /*AGREGAMOS COLUMNAS*************************************************************************************/
    grilla.UnidadMedida = "%";    
    grilla.AgregarColumna("Fecha", "Cont_FechaCreacion", true, 10, "left", "");
    grilla.AgregarColumna("Nombre", "Cont_Nombres", [true, '%LIKE%', 'return ValidarSoloLetras(event);'], 20, "left", "");
    grilla.AgregarColumna("RUC", "Cont_Ruc", true, 10, "left", "");
    grilla.AgregarColumna("Sector", "Cont_Sector_Nombre", [true, '%LIKE%', 'return ValidarSoloLetras(event);'], 15, "left", "");
    grilla.AgregarColumna("Correo", "Cont_Email", true, 15, "left", "");
    grilla.AgregarColumna("Mensaje", "Cont_Mensaje", true, 30, "left", "");
    //var btnEditar = "";
    //var btnEliminar = "";
    //if (editar) {
    //    btnEditar = '<a href="javascript:EditarContacto(#Part_Id);" title="Editar"><span class="fas fa-edit"></span></a>';
    //}

    //if (eliminar) {
    //    btnEliminar = '<a href="javascript:EliminarContacto(#Part_Id);" title="Eliminar"><span class="fas fa-trash-alt"></span></a>';
    //}

    //if (editar == true || eliminar == true) {
    //    grilla.AgregarColumna("", "", false, 10, "center", '<div class="accion-box">' + btnEditar + btnEliminar + '</div>');
    //}

    grilla.ServicioUrl = urlRaiz + "Simulador/Contacto/ListarContactoPaginado";
    grilla.Identificadores = "Part_Id";    
    grilla.MaxWidth = "800px";
    grilla.Inicializar();
    HideLoader();
}