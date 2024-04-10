class Produs{
    constructor(id,nume,cantitate){
        this.id = id;
        this.nume = nume;
        this.cantitate = cantitate;
    }
}

const purchasesWorker = new Worker("js/worker.js")

let products = [];
let currentId = 1;

function initializeProducts(){
    let pp = JSON.parse(localStorage.getItem("products"));
    for(let x in pp){
        document.getElementById("purchasesTable").innerHTML += "<tr><td>"+pp[x]["id"]+"</td><td>"+pp[x]["nume"]+"</td><td>"+pp[x]["cantitate"]+"</td></tr>";
        product = new Produs(pp[x]["id"], pp[x]["nume"], pp[x]["cantitate"]);
        products.push(product);
        currentId += 1;
    }
}

function purchaseProduct(){
    var productName = document.getElementById("purchaseName").value;
    var productQuantity = document.getElementById("purchaseQuantity").value;

    let newProduct = new Produs(currentId,productName,productQuantity);
    products.push(newProduct);
    currentId += 1;

    localStorage.setItem("products", JSON.stringify(products));

    purchasesWorker.postMessage(newProduct)
    //console.log("Message posted to worker");
}

purchasesWorker.onmessage = (e) => {
    //console.log(e.data);
    document.getElementById("purchasesTable").innerHTML += "<tr><td>"+e.data["id"]+"</td><td>"+e.data["nume"]+"</td><td>"+e.data["cantitate"]+"</td></tr>";
};