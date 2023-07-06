const { createApp } = Vue
  createApp({
    data() {
      return {
        paquetes:[],
        url:'http://localhost:5000/paquetes', 
        error:false,
        cargando:true,
        /*atributos para el guardar los valores del formulario */
        id:0,
        nombre:"", 
        imagen:"",
        cupos:0,
        precio:0,

        /* propiedades para validación del formulario */
        nombreValido: false,
        imagenValida: false,
        cuposValido: false,
        precioValido: false,
      }  
    },
    methods: {
        fetchData(url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    this.paquetes = data;
                    this.cargando=false
                })
                .catch(err => {
                    console.error(err);
                    this.error=true              
                })
        },
        eliminar(paquete) {
            const url = this.url+'/' + paquete;
            var options = {
                method: 'DELETE',
            }
            
            var respuesta = confirm("Está seguro de que desea eliminar los datos de este registro?");
        
            if (respuesta == true){
                fetch(url, options)
                .then(res => res.text()) // or res.json()
                .then(res => {
                    location.reload();
                })   
            }
        },
        
        
          validarFormulario() {
            const expresiones = {
              nombre: /^[a-zA-ZÀ-ÿ\s]{3,50}$/, // Letras y espacios, pueden llevar acentos.
              imagen: /^(http|https):\/\/.+$/, // URL que empiecen con http:// or https://.
              cupos: /^\d{1,4}$/, // 1 a 4 digitos.
              precio: /^\d{1,8}$/, // 6 a 8 digitos.
            };
      
            const campos = {
              nombre: this.nombre !== "" && expresiones.nombre.test(this.nombre),
              imagen: this.imagen !== "" && expresiones.imagen.test(this.imagen),
              cupos: expresiones.cupos.test(this.cupos.toString()), // Convert to string and validate.
              precio: expresiones.precio.test(this.precio.toString()), // Convert to string and validate.
            };
      
            // Actualiza las propiedades de validación en data
            this.nombreValido = campos.nombre;
            this.imagenValida = campos.imagen;
            this.cuposValido = campos.cupos;
            this.precioValido = campos.precio;


            console.log(this.nombre);
                  console.log(this.imagen);
                  console.log(this.cupos);
                  console.log(this.precio);

                  console.log(campos.nombre);
                  console.log(campos.imagen);
                  console.log(campos.cupos);
                  console.log(campos.precio);
      
            // Comprobando si todos los campos son válidos
            if (campos.nombre && campos.imagen && campos.cupos && campos.precio) {
              // Formulario válido, realizar la lógica de guardado
              let paquete = {
                nombre: this.nombre,
                precio: this.precio,
                cupos: this.cupos,
                imagen: this.imagen
              };
      
              var options = {
                body: JSON.stringify(paquete),
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                redirect: 'follow'
              };
              fetch(this.url, options)
                .then(function () {
                  alert("Registro grabado");
                  window.location.href = "./paquetes.html";
                })
                .catch(err => {
                  console.error(err);
                  alert("Error al Grabar");
                });
            } else {
              // Formulario no válido, mostrar mensaje de error
              alert("Por favor, complete todos los campos correctamente.");
            }
      
           /*  if (this.nombre!="" && this.imagen!="" && this.cupos > 0 && this.precio > 0) {
                  console.log(this.nombre);
                  console.log(this.imagen);
                  console.log(this.cupos);
                  console.log(this.precio);
                  
                  // Formulario válido, realizar la lógica de guardado
                  let paquete = {
                    nombre: this.nombre,
                    precio: this.precio,
                    cupos: this.cupos,
                    imagen: this.imagen
                  };

                  var options = {
                    body: JSON.stringify(paquete),
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow'
                  };
                  fetch(this.url, options)
                    .then(function () {
                      alert("Registro grabado");
                      window.location.href = "./paquetes.html";
                    })
                    .catch(err => {
                      console.error(err);
                      alert("Error al Grabar");
                    });

            } else {

                console.log(this.nombre);
                console.log(this.imagen);
                console.log(this.cupos);
                console.log(this.precio);


                // Formulario no válido, mostrar mensaje de error o realizar acciones adicionales

                alert("Por favor, complete todos los campos correctamente.");
            } */
          },

          cancelar(){
            alert("No se ha añadido un nuevo paquete")
            window.location.href = "./paquetes.html";
          }
    },
    created() {
        this.fetchData(this.url)
    },
  }).mount('#app')