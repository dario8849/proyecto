console.log(location.search)     // lee los argumentos pasados a este formulario
var id=location.search.substr(4)
console.log(id)
const { createApp } = Vue
  createApp({
    data() {
      return {
        /*atributos para el guardar los valores del formulario */
        id:0,
        nombre:"",
        imagen:"",
        cupos:0,
        precio:0,
        url:'http://localhost:5000/paquetes/'+id,

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
                    console.log(data)
                    this.id=data.id
                    this.nombre = data.nombre;
                    this.imagen=data.imagen
                    this.cupos=data.cupos
                    this.precio=data.precio                    
                })
                .catch(err => {
                    console.error(err);
                    this.error=true              
                })
        },
        modificar() {

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
            if (campos.nombre && campos.imagen && campos.cupos && campos.precio){
                
                let paquete = {
                    nombre:this.nombre,
                    precio: this.precio,
                    cupos: this.cupos,
                    imagen:this.imagen
                }
                var options = {
                    body: JSON.stringify(paquete),
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    redirect: 'follow'
                }
                
                //Acá pedimos una doble confirmación 
                var respuesta = confirm("¿Está seguro de que desea confirmar la modificacion de los datos de este pedido?");
                if (respuesta == true){
                    fetch(this.url, options)
                        .then(function () {
                            alert("Registro modificado")
                            window.location.href = "./paquetes.html";             
                        })
                        .catch(err => {
                            console.error(err);
                            alert("Error al Modificar")
                        })
                }
            } else {
                // Formulario no válido, mostrar mensaje de error
                alert("Por favor, complete todos los campos correctamente.");
            }
            
        },
        cancelar() {
            alert("Los datos pedido actual, NO han sido modificados")
            // window.location.href = "./productos.html";
            window.location.href = "./paquetes.html";      
        }

        
    },
    created() {
        this.fetchData(this.url)
    },
  }).mount('#app')