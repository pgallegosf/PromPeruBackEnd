$(document).ready(function () {
    ListarSimulaciones();
});
function ListarSimulaciones() {
    grilla = new ccG_Objeto("gridSimulaciones", true, false, false, false);
    /*AGREGAMOS COLUMNAS*************************************************************************************/
    grilla.UnidadMedida = "%";
    grilla.AgregarColumna("Nº", "Simu_Item", false, 5, "center", "");
    grilla.AgregarColumna("Nombre", "Simu_Nombre", false, 20, "left", "");
    grilla.AgregarColumna("Producto", "Prod_Nombre", false, 20, "left", "");
    grilla.AgregarColumna("Destino", "Simu_Destino", false, 20, "left", "");
    grilla.AgregarColumna("Fecha", "Simu_Fecha", false, 10, "left", "");
    grilla.AgregarColumna("Progreso", "", false, 15, "center",
        '<div class="pasos-box"><span></span>#JS(GraficarProgreso(#Simu_Paso))#JS</div>'
        );
    grilla.AgregarColumna("Acciones", "", false, 10, "center",
        '<div class="accion-box">' +
        '<a href="' + urlRaiz + 'Simulador/Inicio/EditarSimulacion/#Simu_Id" title="Editar"><span class="fas fa-edit"></span></a>' +
        '<a href="javascript:" onclick="AnularSimulacion(#Simu_Id);" title="Eliminar"><span class="fas fa-trash-alt"></span></a>' +
        '#JS(#Simu_Paso==4?\'<a href="' + urlRaiz + 'Simulador/Inicio/EstructuraCostos/#Simu_Id" title="Ver Reporte" class="accion-box-report"><span class="fas fa-file-alt"></span></a>\':\'\')#JS' +
        '</div>'
        );

    grilla.ServicioUrl = urlRaiz + "Simulador/Simulacion/ListarSimulaciones";
    //grilla.MinWidth = "400px";
    grilla.Inicializar();
}
function GraficarProgreso(paso) {
    var html = '';
    switch (paso) {
        case 0:
        case 1:
        case 2:
        case 3:
            html += '<a ' + (paso == 1 ? 'class="cont-link-pasos"' : '') + '><span class="num">1</span></a>';
            html += '<a ' + (paso == 2 ? 'class="cont-link-pasos"' : '') + '><span class="num">2</span></a>';
            html += '<a ' + (paso == 3 ? 'class="cont-link-pasos"' : '') + '><span class="num">3</span></a>';
            html += '<a ' + (paso == 4 ? 'class="cont-link-pasos"' : '') + '><span class="num">4</span></a>';
            break;
        case 4:
            html = '<div class="pasos-box"><span>Terminado</span><a class="cont-link-pasos cont-link-termi"><span class="fas fa-check"></span></a></div>';
    }
    return html;
}
function AnularSimulacion(simu_Id) {
    confirm('¿Está seguro de eliminar la simulación?', function (result) {
        if (result) {            
            $.ajax({
                url: urlRaiz + "Simulacion/AnularSimulacion",
                data: { simu_Id: simu_Id },
                type: "POST",
                contenType: "application/json;charset=utf-8",
                success: function (v) {
                    if (v == 1) {
                        alert('Se eliminó simulación correctamente.', 'CHECK');
                        ccGrid["gridSimulaciones"].CargarDatos();                        
                    }
                    else
                        alert('No se pudo eliminar la simulación, inténtelo nuevamente.', 'ERROR');
                },
                error: function (v) {
                    alert('No se pudo eliminar la simulación.', 'ERROR');
                }
            });
        } else {
            return false;
        }
    });
}