Vue.component('tarjetas', {
  template: "#tarjetas",
  props: ['class', 'status', 'id', 'label', 'vencimiento', 'creacion', 'filtro'],
  data() {
    return {
      icon: '',
      bg: '',
    }
  },
  methods: {
    dataFormat: function (data) {
      var dateAr = data.split('/');
      var dataEs = dateAr[2] + "/" + dateAr[1] + "/" + dateAr[0];
      return dataEs;
    },
    checkStatus: function (value) {
      if (value == 1) {
        this.icon = "far fa-times-circle text-danger";
        this.bg = "background: #dc35451c";
        return "border-danger"
      } else if (value == 2) {
        this.icon = "far fa-clock text-info";
        this.bg = "background: #17a2b817";
        return "border-info"
      } else {
        this.icon = "far fa-check-circle text-success";
        this.bg = "background: #28a74514";
        return "border-success"
      }
    }
  },
  watch: {
    filtro: function () {
      alert(filtro);
    }
  },
});

//Instancia Vue

var app = new Vue({
  el: "#app",
  data: {
    tarjetas: null,
    liberado: true,
    data: '',
  },
  methods: {

    //funcion filter
    filter: function (value) {
      if (value == 'all') {
        axios.get("http://localhost:3000/tarjetas/?_sort=creacion,id&_order=desc,desc", {})
          .then(res => {
            this.tarjetas = res.data;
            $('.modal').modal('hide');
          })
          .catch(err => {
            console.error(err);
          })
      } else {
        axios.get("http://localhost:3000/tarjetas?status.label=" + value, {})
          .then(res => {
            this.tarjetas = res.data;
            $('.modal').modal('hide');
          })
          .catch(err => {
            console.error(err);
          })
      }
    },
    //final funcion filter

    //funcion order
    order: function (value) {
      var params = value.split(',');
      if (params[0] == 'creacion') {
        var url = "http://localhost:3000/tarjetas?_sort=" + params[0] + ",id&_order=" + params[1] + "," + params[1];
      } else {
        var url = "http://localhost:3000/tarjetas?_sort=" + params[0] + "&_order=" + params[1];
      }
            
      axios.get(url, {})
        .then(res => {
          this.tarjetas = res.data;
          $('.modal').modal('hide');
        })
        .catch(err => {
          console.error(err);
        })
    },
    //final funcion order

  },
  beforeMount() {

    var month = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
    var week = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sabado'];
    var dateTime = new Date();
    this.data = week[dateTime.getDay()] + ", " + dateTime.getDate() + " de " + month[dateTime.getMonth()] + " de " + dateTime.getFullYear();

    axios.get("http://localhost:3000/tarjetas/?_sort=creacion,id&_order=desc,desc", {})
      .then(res => {
        var reload = false;

        res.data.forEach(function (item, index) {

          //Verificando se existe algum registro vencido
          hoy = new Date();
          hoy = hoy.getFullYear() + "/" + (parseInt(hoy.getMonth()) + 1) + "/" + hoy.getDate();
          hoy = new Date(hoy);
          vencimiento = new Date(item.vencimiento);

          if (item.status.status_id == 2 && vencimiento < hoy) {

            reload = true;
            vencido = {
              "status": {
                "status_id": 1,
                "label": "Atrasado"
              },
              "vencimiento": item.vencimiento,
              "creacion": item.creacion,
              "label": item.label,
              "keyword": item.keyword,
            }

            url = "http://localhost:3000/tarjetas/" + item.id;

            axios.put(url, vencido)
              .catch(err => {
                console.error(err);
              })

          }
        })

        if (reload == true) {
          location.reload();
        }

        this.tarjetas = res.data;
      })
      .catch(err => {
        console.error(err);
      })
  },
  mounted() {

  },
})