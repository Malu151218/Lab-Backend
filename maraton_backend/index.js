/*
    Backend E-commerce

    Nota del cliente: 
    "Necesito un servicio RESTFul que me permita registrar un listado de productos comprados, precio, identificador de cliente y metodo de pago"

    Modelo de datos : 
    {
        "id": string,
        "clientId": string,
        "products": Array[], (Se guarda el identificador de producto, string)
        "amount": number,
        "paymentMethod": "Credit Card" | "Cash" | "Bitcoin"
    }

    Ejemplo:
    {
        "id": "adkjfh",
        "clientId": "1000",
        "products": ["100","300","400","500","600","700","800"],
        "amount": 10000,
        "paymentMethod": "Credit Card"
    }
*/

/*

MARATON BACKEND

1) Completar el servicio API REST, está incompleto.
2) Crear pruebas utilizando POSTMAN para todas las rutas (GET/POST/PUT/DELETE).
3) Validar en la carga/modificación (POST/PUT) que recibimos todos los datos necesarios. Sino, informar error de request.
4) Agregar al modelo de datos el atributo: createdAt (Date). Se debe cargar la fecha actual.  
5) BONUS: Crear un front-end simple que permita hacer una carga de datos desde un formulario. Respetando el modelo de datos.
6)  Elegí algún ejercicio de la maratón, e intenta encontrar una nueva forma de resolución, que sea distinta a la primera. 
7) Si fueses mentor/a, y tuvieses que pensar un ejercicio para la maratón, ¿Cuál sería? Te proponemos inventar un ejercicio nuevo que implique poner en práctica los conocimientos vistos hasta acá sobre Backend. 
Para finalizar:
A cada estudiante le tocará corregir el código de algún compañero/a. Tendrán que darle una devolución por escrito, marcando los aciertos y desaciertos, y las cosas que se pueden mejorar. Tengan en cuenta, a la hora de escribir, que el mensaje sea lo más organizado posible, para que el texto tenga claridad a la hora de leerse. Además, entendiendo que tendrán que juzgar el trabajo de un compañero/a, trabajen desde la empatía, para lograr una evaluación constructiva.
*/


const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const uniqid = require("uniqid");

const app = express(); 
const PORT = 3001;

//////////////////// Aplico Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("combined"));

///////////////////// Init Array de Compras. (Simulo una Base de datos)
const compras = [
  {
      "id": "malu2018",
      "clientId": "1000",
      "products": ["100","300","400","500","600","700","800"],
      "amount": 20000,
      "paymentMethod": "Cash",
      "createdAt": fechaActual()
      
  },
  {
    "id": "ale6534890",
    "clientId": "1001",
    "products": ["100","400","600","700",],
    "amount": 1500,
    "paymentMethod": "Credit Card",
    "createdAt":fechaActual()
  }
];

app.get('/',function(req,res){
  res.status(200).send({"message":"Bienvenidos a la compra"});
})


//////////////////// Defino Rutas, me baso en el modelo REST

        // Get All Compras

app.get("/compras", function (req, res) {
  res.status(200).send({ "compras": compras});
});

        //Get Compras By ID

app.get("/compras/:id", function (req, res){
    const id = req.params.id;
    console.log("id: ", id);

    let compraEncontrada = undefined;

    compras.forEach(function(compra){
    if(compra.id == id) {
        compraEncontrada = compra;
        return res.status(200).json({compraEncontrada:compra});
    }
})
    //Indico que no encuentro la compra.
    res.status(404).send({"message":"Compra Not Found - 404"});
});

      // Create Compra 

    app.post("/compras/", function (req, res) {

      if (!req.body.clientId || !req.body.products || !req.body.paymentMethod || !req.body.amount) {
        res.status(400).send({ "mensaje": "Compra no creada - Falta algun parametro requerido" })
      }
      else if (req.body.id) {
        res.status(400).send({ "mensaje": "Compra no creada con Id" })
      } else {
          const compraNew = {
            "id": uniqid(),
            "clientId": req.body.clientId,
            "products": req.body.products,
            "amount": req.body.amount,
            "paymentMethod": req.body.paymentMethod,
            "createdAt": fechaActual()
          }
        
          compras.push(compraNew)
          res.status(201).send({ "compraAgregada": compraNew })
          console.log(compras)
        
          }
        
      });

        // Actualizar  Compra 

    app.put("/compras/:id", function (req, res) {
      let compraActual;

      if (!req.body.clientId || !req.body.products || !req.body.paymentMethod || !req.body.amount) {
            res.status(400).send({ "mensaje": "compra no creada, no tiene algun parametro requerido" })
          }
      else {
        let compraId = req.params.id

      compras.forEach(function (compra) {
        if (compraId == compra.id) {
                compra.clientId = req.body.clientId;
                compra.products = req.body.products;
                compra.amount = req.body.amount;
                compra.paymentMethod = req.body.paymentMethod;
                compra.createdAt = fechaActual();
                compraActual=compra;
              }
            })
        if (compraActual) {
              res.status(201).send({ "compraModificada": compraActual})
            }
        else {
              res.status(404).send({ "mensaje": "Compra no encontrada" })
            }
          }
        });


      // Eliminar Compra 

    app.delete("/compras/:id", function (req, res) {
      let deleteID = req.params.id;
      let compraEliminada; 
      let indiceID;

      compras.forEach(function(compra,i){
      if(deleteID==compra.id){
        compraEliminada = compra
      indiceID = i
    }
  })
      if (compraEliminada){
    compras.splice(indiceID,1)
    res.status(200).send({"CompraEliminada": compraEliminada})
    }else {
        res.status(404).send({ "mensaje": "Compra not found" })
   }
   });







//////////////////// Ahora que tengo todo definido y creado, levanto el servicio escuchando peticiones en el puerto
app.listen(PORT, function () {
  console.log(`Maraton Guayerd running on PORT: ${PORT}\n\n`);
});

//Si No encuentra el Recurso
app.get("/*", function (req, res) {
  res.status(404).send({ message: "recurso no encontrado" });
});




// Espacio para Funciones creadas!!!

function fechaActual(){
  let createdAt = new Date();
  let fecha = `${createdAt.getDate()}/${createdAt.getMonth()+1}/${createdAt.getUTCFullYear()}`;
  return fecha;
}

/*function getNextID(){
  //en esta parte busca el ID máximo y al ID que encuentra le suma 1 
  return  (compras.reduce((a, b) => { return a.id > b.id? a: b })).id + 1;
};
*/

/*function validatorDatos(data){
  const {clientId, products, amount, paymentMethod} = req.body;

  if ( typeof clientId !== 'string'){
  throw new Error ('clientId must be a string')
  }
  if (typeof products !=='[]'){
  throw new Error ('Products must be a Array')
  }
  if (typeof amount!== 'number' && amount >0){
  throw new Error ('Amount must be a Number')
  });

   // Create Compra 

    app.post("/compras/", function (req, res) {

      if (!req.body.clientId || !req.body.products || !req.body.paymentMethod || !req.body.amount) {
        res.status(400).send({ "mensaje": "Compra no creada - Falta algun parametro requerido" })
      }
      else if (req.body.id) {
        res.status(400).send({ "mensaje": "Compra no creada con Id" })
      } else {
          const compraNew = {
            "id": uniqid(),
            "clientId": req.body.clientId,
            "products": req.body.products,
            "amount": req.body.amount,
            "paymentMethod": req.body.paymentMethod,
            "createdAt": fechaActual()
          }
        
          compras.push(compraNew)
          res.status(201).send({ "compraAgregada": compraNew })
          console.log(compras)
        
          }
        
      });
  */
