class Produs{
    constructor(id,nume,cantitate){
        this.id = id;
        this.nume = nume;
        this.cantitate = cantitate;
    }
}

class Shop{
    constructor(){
        this.products = []
        this.currentId = 1
    }

    addProduct(){}
}

class LocalStorageShop extends Shop{
    constructor(){
        super()
        let pp = JSON.parse(localStorage.getItem("products"));
        let product = null;
        for(let x in pp){
            document.getElementById("purchasesTable").innerHTML += "<tr><td>"+pp[x]["id"]+"</td><td>"+pp[x]["nume"]+"</td><td>"+pp[x]["cantitate"]+"</td></tr>";
            product = new Produs(pp[x]["id"], pp[x]["nume"], pp[x]["cantitate"]);
            this.products.push(product);
            this.currentId += 1;
        }
    }

    addProduct(){
        var productName = document.getElementById("purchaseName").value;
        var productQuantity = document.getElementById("purchaseQuantity").value;

        let newProduct = new Produs(this.currentId,productName,productQuantity);
        this.products.push(newProduct);
        this.currentId += 1;

        localStorage.setItem("products", JSON.stringify(this.products));

        purchasesWorker.postMessage(newProduct)
        //console.log("Message posted to worker");
    }
}

class IndexedDBShop extends Shop{
    constructor(){
        super()

        const dbName = "ProductsDB";
        const request = indexedDB.open(dbName,3);
        request.onerror = (event) => {
            console.error("IndexedDB request failed!");
        };

        request.onsuccess = function (evt) {
            this.db = request.result;

            const transaction = this.db.transaction(["id"]);
            const objectStore = transaction.objectStore("id");
            const getRequest = objectStore.getAll();
    
            getRequest.onerror = (event) => {
                console.error("Error fetching data from the IndexedDB");
            };
            getRequest.onsuccess = (event) => {
                const data = getRequest.result;
                data.forEach((item,index) =>{
                    document.getElementById("purchasesTable").innerHTML += "<tr><td>"+(index+1)+"</td><td>"+item["name"]+"</td><td>"+item["quantity"]+"</td></tr>";

                    let product = new Produs(index+1,item["name"],item["quantity"]);
                    this.products.push(product);
                    this.currentId = index+2;
                });
            };

        }.bind(this);

        request.onupgradeneeded = function(event) {
            this.db = event.target.result;

            const objStore = this.db.createObjectStore("id", { autoIncrement: true });

            objStore.createIndex("name", "name", { unique: false });
            objStore.createIndex("quantity", "quantity", { unique: false });
          
        }.bind(this);
    }

    addProduct(){
        const transaction = this.db.transaction(["id"], "readwrite");
        const objectStore = transaction.objectStore("id");

        var productName = document.getElementById("purchaseName").value;
        var productQuantity = document.getElementById("purchaseQuantity").value;

        let newProduct = { name: productName, quantity: productQuantity };
        
        const addRequest = objectStore.add(newProduct);

        addRequest.onerror = (event) => {
            console.error("Error adding data to the IndexedDB");
        };
        addRequest.onsuccess = (event) => {
            let key = addRequest.result
            console.log("Data added successfully to IndexedDB with key: " + key);

            let newProduct2 = new Produs(key, productName, productQuantity);
            this.products.push(newProduct2);
            this.currentId = key+1;
            console.log(newProduct2);   
            purchasesWorker.postMessage(newProduct2);
        };

        //console.log("Message posted to worker");
    }
}

const purchasesWorker = new Worker("js/worker.js")

let products = [];
let currentId = 1;

let shop = null;

function initializeProducts(){
    shop = new LocalStorageShop;

    const selectElement = document.getElementById("purchaseOption");

    selectElement.addEventListener("change",function(event){
        const option = event.target.value;
        if(shop){
            if(shop instanceof IndexedDBShop && option == "localStorage"){
                document.getElementById("purchasesTable").innerHTML = "<tr><th>Nr.</th><th>Nume Produs</th><th>Cantitate</th></tr>";
                shop = new LocalStorageShop;
            }
            else if(shop instanceof LocalStorageShop && option == "indexedDB"){
                document.getElementById("purchasesTable").innerHTML = "<tr><th>Nr.</th><th>Nume Produs</th><th>Cantitate</th></tr>";
                shop = new IndexedDBShop;
            }
        }
        else{
            if(option == "localStorage"){
                document.getElementById("purchasesTable").innerHTML = "<tr><th>Nr.</th><th>Nume Produs</th><th>Cantitate</th></tr>";
                shop = new LocalStorageShop;
            }
            else{
                document.getElementById("purchasesTable").innerHTML = "<tr><th>Nr.</th><th>Nume Produs</th><th>Cantitate</th></tr>";
                shop = new IndexedDBShop;
            }
        }
    });
}

function purchaseProduct(){
    if(shop === null)
        shop = new LocalStorageShop;
    shop.addProduct();
}

purchasesWorker.onmessage = (e) => {
    //console.log(e.data);
    document.getElementById("purchasesTable").innerHTML += "<tr><td>"+e.data["id"]+"</td><td>"+e.data["nume"]+"</td><td>"+e.data["cantitate"]+"</td></tr>";
};