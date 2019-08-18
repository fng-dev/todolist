$(document).ready(function () {

    //INSTANCIADO OBJECTO DO CALENDARIO KEY:CALENDAR
    $('.datepicker').datepicker({
        language: 'es',
        autoclose: true
    });

    $('[data-toggle="tooltip"]').tooltip()


    //FORMATAR DATA - KEY:DATA
    const dataInvert = (data) => {
        var dateAr = data.split('/');
        var dataEs = dateAr[2] + "/" + dateAr[1] + "/" + dateAr[0];
        return dataEs;
    };


    //LIBERAR TAREAS KEY:LIB-TAREA

    $(document).on('click', '.btn-liberar', function () {

        camposMarcados = new Array();


        $("input[type=checkbox][name='cb-tarjetas[]']:checked").each(function () {
            camposMarcados.push($(this).val());
        });

        var totalCampos = camposMarcados.length;

        if (totalCampos == 0) {
            $('.modal-info .modal-body').html('<p>Seleccione al menos una tarea antes de continuar...</p>');
            $('.modal-info').modal();
        } else {
            camposMarcados.forEach(function (item, index) {

                var params = "";
                var url = "http://localhost:3000/tarjetas/" + item;
                axios.get(url, params)
                    .then(res => {
                        params = res.data;
                        params.status.status_id = 3;
                        params.status.label = "Liberada";
                        url = "http://localhost:3000/tarjetas/" + item;
                        axios.put(url, params)
                            .then(res => {
                                totalCampos--;
                                //console.log(totalCampos);
                                if (totalCampos == 0) {
                                    location.reload();
                                }
                            })
                            .catch(err => {
                                console.error(err);
                            })
                    })
                    .catch(err => {
                        console.error(err);
                    })
            })
        }
    });

    // LLAMANDO MODAL DE LIBERACION KEY:LIB-MODAL

    $(document).on('click', '.btn-clr', function () {
        var id = $(this).attr('id');
        $('.modal-confirm .btn-ok').attr('id', id);
        $('.modal-confirm .modal-body').html('<p>¿Estás seguro de que quieres continuar?</p>');
        $('.modal-confirm .btn-ok').attr('class', 'btn btn-outline-success btn-ok clear-tarea');
        $('.modal-confirm').modal();
    });

    // ACCION PARA LIBERAR TAREA KEY: ACCION-LIB-TAREA

    $(document).on('click', '.clear-tarea', function () {
        var id = $(this).attr('id');
        $('.modal-confirm').modal('hide');
        var params = "";
        var url = "http://localhost:3000/tarjetas/" + id;
        axios.get(url, params)
            .then(res => {
                params = res.data;
                params.status.status_id = 3;
                params.status.label = "Liberada";
                url = "http://localhost:3000/tarjetas/" + id;
                axios.put(url, params)
                    .then(res => {
                        if (res.status == 200) {
                            location.reload();
                        } else {
                            $('.modal-info .modal-body').html('<p>Se produjo un error en la solicitud. Por favor intente nuevamente...</p>');
                        }
                    })
                    .catch(err => {
                        console.error(err);
                    })
            })
            .catch(err => {
                console.error(err);
            })

    });

    //LLAMANDO MODAL DE UPDATE DE TAREA KEY:UPD-MODAL

    $(document).on('click', '.btn-upd', function () {

        $('.modal-update input').each(function () {
            $(this).removeClass('border-danger');
        });

        $('.alert').hide();

        var id = $(this).attr('id');
        $('.modal-update .btn-ok').attr('id', id);
        $('.modal-update .btn-ok').attr('class', 'btn btn-outline-success btn-ok update-tarea');
        var url = "http://localhost:3000/tarjetas/" + id;
        var params = "";
        axios.get(url, params)
            .then(res => {
                $('.modal-update .inp-label').val(res.data.label);
                $('.modal-update .inp-venc').val(dataInvert(res.data.vencimiento));
                $('.modal-update').modal();
            })
            .catch(err => {
                console.error(err);
            })

    });

    //ACCION UPDATE TAREA KEY:ACCION-UPD-TAREA

    $(document).on('click', '.update-tarea', function () {

        var error = 0;

        $('.modal-update input').each(function () {

            $(this).removeClass('border-danger');

            if ($(this).val() == null || $(this).val() == '') {
                $(this).addClass('border-danger');
                $('.alert').show().delay(2500).slideUp();
                error++;
            }

        });

        if (error == 0) {

            var id = $(this).attr('id');
            var params = "";
            var url = "http://localhost:3000/tarjetas/" + id;
            axios.get(url, params)
                .then(res => {

                    params = res.data;
                    if (params.vencimiento == dataInvert($('.modal-update .inp-venc').val())) {
                        params.label = $('.modal-update .inp-label').val()
                    } else {
                        params.label = $('.modal-update .inp-label').val()
                        params.vencimiento = dataInvert($('.modal-update .inp-venc').val())
                        var hoy = new Date();
                        hoy = hoy.getFullYear() + "/" + (parseInt(hoy.getMonth()) + 1) + "/" + hoy.getDate();
                        hoy = new Date(hoy);
                        vencimiento = new Date(params.vencimiento);
                        if (vencimiento < hoy) {
                            params.status.status_id = 1;
                            params.status.label = "Atrasado";
                        } else {
                            params.status.status_id = 2;
                            params.status.label = "Pendiente";
                        }
                    }

                    url = "http://localhost:3000/tarjetas/" + id;
                    axios.put(url, params)
                        .then(res => {
                            if (res.status == 200) {
                                location.reload();
                            } else {
                                $('.modal-info .modal-body').html('<p>Se produjo un error en la solicitud. Por favor intente nuevamente...</p>');
                            }
                        })
                        .catch(err => {
                            console.error(err);
                        })
                })
                .catch(err => {
                    console.error(err);
                })

        }



    });

    //LLAMANDO MODAL PARA BORRAR TAREA KEY:DEL-MODAL

    $(document).on('click', '.btn-del', function () {
        var id = $(this).attr('id');
        $('.modal-confirm .btn-ok').attr('id', id);
        $('.modal-confirm .modal-body').html('<p>Esta acción eliminará permanentemente el registro. Quieres continuar?</p>');
        $('.modal-confirm .btn-ok').attr('class', 'btn btn-outline-success btn-ok del-tarea');
        $('.modal-confirm').modal();
    });


    //ACCION PARA BORRAR TAREA KEY:ACCION-DEL-TAREA
    $(document).on('click', '.del-tarea', function () {

        var id = $(this).attr('id');
        var url = "http://localhost:3000/tarjetas/" + id;
        axios.delete(url, {})
            .then(res => {
                if (res.status == 200) {
                    location.reload();
                } else {
                    $('.modal-info .modal-body').html('<p>Se produjo un error en la solicitud. Por favor intente nuevamente...</p>');
                }
            })
            .catch(err => {
                console.error(err);
            })
    });


    //LLAMANDO MODAL PARA ANADIR TAREA KEY:ADD-MODAL

    $(document).on('click', '.add-tarea', function () {

        $('.modal-add input').each(function () {
            $(this).removeClass('border-danger');
        });

        $('.alert').hide();

        $('.modal-add .btn-ok').attr('class', 'btn btn-outline-success btn-ok add-tarea-bd');
        $('.modal-add').modal();

    });


    //ACCION PARA ANADIR UNA NUEVA TAREA KEY:ACCION-ADD-TAREA
    $(document).on('click', '.add-tarea-bd', function () {

        var label = $('.modal-add .inp-label').val();
        var fecha = $('.modal-add .inp-venc').val();
        var error = 0;

        $('.modal-add input').each(function () {
            $(this).removeClass('border-danger');
            if ($(this).val() == null || $(this).val() == '') {
                $(this).addClass('border-danger');
                $('.alert').show().delay(2500).slideUp();
                error++;
            }
        });

        if (error == 0) {

            var vencimiento = dataInvert(fecha);
            var hoy = new Date();
            var month = (parseInt(hoy.getMonth()) + 1);
            month = month < 10 ? "0" + month : month;
            hoy = hoy.getFullYear() + "/" + month + "/" + hoy.getDate();

            var nuevaTarjeta = {
                "status": {
                    "status_id": 2,
                    "label": "Pendiente"
                },
                "vencimiento": vencimiento,
                "creacion": hoy,
                "label": label,
                "keyword": "tarea",
            }

            var url = "http://localhost:3000/tarjetas/";
            axios.post(url, nuevaTarjeta)
                .then(res => {
                    location.reload();
                })
                .catch(err => {
                    console.error(err);
                })
        }
    });

    //LLAMANDO MODAL DE FILTROS

    $(document).on('click', '.filtro-tarea', function () {

        $('.modal-filtro').modal();

    });

    //LLAMANDO MODAL DE ORDENACION
    $(document).on('click', '.ordenar-tarea', function () {

        $('.modal-order').modal();

    });

    //ANADIR 'CLASS' EN LA ORDENACION SELECCIONADA
    $(document).on('click','.modal-order .hover-filter',function(){

        $('.modal-order .hover-filter').removeClass('selected-filter');
        $(this).addClass('selected-filter');

    })

    //ORDENACION POR LA FECHA DE VENCIMIENTO
    $(document).on('click','.by-fecha', function(){
        $('.modal').modal('hide');
        $('.modal-filter-by-date').modal();
    })

})