var listaGlosario;
$(document).ready(function () {
    ListarGlosario();
});

function Filtrar(e, caja) {
    if (e.keyCode == 13) {
        e.keyCode = 0;
        ListarGlosario();
        return false;
    }
}

function ListarGlosario() {
    $('#divGlosario').empty();
    var filtro = $('#txtTermino').val() == "" ? '' : ' Glos_Nombre LIKE \'%' + $('#txtTermino').val() + '%\' OR Glos_Descripcion LIKE \'%' + $('#txtTermino').val() + '%\'  ';
    $.ajax({
        url: urlRaiz + "Admin/Glosario/ListarGlosarioPaginado",
        data: { filter: filtro, sorting: '', pageNumber: 1, pageSize: 0 },
        type: "POST",
        contenType: "application/json;charset=utf-8",
        success: function (v) {
            listaGlosario = v;
            descripcionGlosario();
        },
        error: function (v) {
            alert('No se pudo cargar el Glosario', "ERROR");
        }
    });
}

function descripcionGlosario() {
    if (listaGlosario.length > 0) {
        for (i = 0; i < listaGlosario.length; i++) {
            var nombre = '<h2 class="cont-title-h2">' + listaGlosario[i].Glos_Nombre + '</h2>' +
                    '<div  class="cont-table">' +
                        '<div>' + listaGlosario[i].Glos_Descripcion + '</div>' +
                    '</div>';
            $('#divGlosario').append(nombre);

        }

    }
}
