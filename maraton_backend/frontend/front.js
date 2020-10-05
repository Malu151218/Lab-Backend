// GET de todas las compras
const PORT = 'http://localhost:3001/compras';

    fetch(PORT,{
        headers:{
            'Accept':'application/json'
        }
    }).then(function(res){
        return res.json();
    }).then(function(response){
        console.log(response);
        const LISTA = document.querySelector(".compra-Actual");
        LISTA.innerHTML = '';
        response.compras.forEach(function(compra){
           LISTA.innerHTML +=  `<li>
                                    <span>Id: </span> ${compra.id}<br> 
                                    <span>Cliente: </span> ${compra.clientId}<br>
                                    <span>Productos: </span> ${compra.products}<br>
                                    <span>Monto: </span> $${compra.amount}<br>
                                    <span>Metodo de Pago: </span>${compra.paymentMethod}<br>
                                    <span>Fecha: </span> ${compra.createdAt}<br><br>
                                </li>` 
        });
    });

//POST compras
const FORMCOMPRA = document.querySelector(".formCompra");
FORMCOMPRA.addEventListener("submit", function (event){
    event.preventDefault();    

    let id = document.querySelector(".id").value;
    let clientId = document.querySelector(".clientId").value;
    let products = document.querySelector(".products").value;
    let amount = document.querySelector(".amount").value;
    let paymentMethod = document.querySelector(".paymentMethod").value;
    let compraSave = {
        'id': id,
        'clientId': clientId,
        'products': products,
        'amount': amount,
        'paymentMethod': paymentMethod
    };
    fetch(PORT,{
        'body': JSON.stringify(compraSave),
        'method': 'POST',
        'headers':{'Content-Type':'application/json'}
    }).then(function(res){
        return res.json();
    }).then(function(res){
        console.log("Respuesta procesada: ", res);
    })
});
