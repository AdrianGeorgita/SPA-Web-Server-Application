alert('hello');
console.log("Hello");

setInterval(updateDate,1000);

let canvas = null;
let ctx = null;

function updateDate(){
    e = document.getElementById("myDate");
    e.innerHTML = Date();
}

function initializeInvat(){
    let e = document.getElementById("myURL");
    e.innerHTML = location.href;

    let nav = navigator.geolocation.getCurrentPosition(showLocation);

    e = document.getElementById("myBrowserCode");
    e.innerHTML = navigator.appCodeName;

    e = document.getElementById("myBrowserName");
    e.innerHTML = navigator.appName;

    e = document.getElementById("myBrowserVersion");
    e.innerHTML = navigator.appVersion;

    e = document.getElementById("myOS");
    e.innerHTML = navigator.userAgent;  

    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");

    canvas.addEventListener("mousedown",function(e){
        getMousePosition(canvas,e);
    });
}

function showLocation(position){
    e = document.getElementById("myLocation");
    e.innerHTML = "Latitude: " + position.coords.latitude + " Longitude: "+position.coords.longitude;
}

let x1 = 0;
let y1 = 0;
let x2 = 0;
let y2 = 0;
let clickNumber = 0;
let temp;

function getMousePosition(canvas, event){
    let rect = canvas.getBoundingClientRect();
    console.log("Click Number: "+clickNumber);
    if(clickNumber == 0){
            x1 = event.clientX - rect.left;
            y1 = event.clientY - rect.top;
            clickNumber = 1;
    }
    else{
        x2 = event.clientX - rect.left;
        y2 = event.clientY - rect.top;
        clickNumber = 0;


        if(x2 < x1){
            temp = x2;
            x2 = x1;
            x1 = temp;
        }

        if(y2 < y1){
            temp = y2;
            y2 = y1;
            y1 = temp;
        }

        let cc = document.getElementById("canvasFillColor").value;
        let sc = document.getElementById("canvasStrokeColor").value;

        ctx.strokeStyle = sc;
        ctx.fillStyle = cc;

        ctx.strokeRect(x1,y1,x2-x1,y2-y1);
        ctx.fillRect(x1+1,y1+1,x2-x1-1,y2-y1-1);
    }
}


function addTableRow(){
    let pos = document.getElementById("tablePosition").value;
    let color = document.getElementById("tableBackgroundColor").value;

    let table = document.getElementById("invatTable");

    if(!isNaN(pos) && pos > 0){

        //pos = parseInt(pos);

        // Daca pozitia depaseste dimensiunea tabelei, aceasta devine noua pozitie
        pos = Math.min(pos,table.rows.length);

        let newRow = table.insertRow(pos);

        for (let i = 0; i < table.rows[0].cells.length; i++) {
            let cell = document.createElement("td");
            let cellText = document.createTextNode("-");
            cell.style.color = "rgba(0,0,0,0)";
            cell.style.backgroundColor = color;
            cell.style.height = "5px";
            cell.appendChild(cellText);
            newRow.appendChild(cell);
        }
    }
    else{
        alert("Pozitia trebuie sa fie un numar valid!");
    }
}

function addTableColumn(){
    let pos = document.getElementById("tablePosition").value;
    let color = document.getElementById("tableBackgroundColor").value;

    let table = document.getElementById("invatTable");

    if(!isNaN(pos) && pos >= 0){
        //pos = parseInt(pos);

        // Daca pozitia depaseste dimensiunea tabelei, aceasta devine noua pozitie
        pos = Math.min(pos,table.rows[0].cells.length);

        for (let i = 0; i < table.rows.length; i++) {
            let newCell = table.rows[i].insertCell(pos);
        
            let cellText = document.createTextNode("-");
            newCell.style.color = "rgba(0,0,0,0)";
            newCell.style.backgroundColor = color;
            newCell.style.width = "5px";
            newCell.appendChild(cellText);
        }
    }
    else{
        alert("Pozitia trebuie sa fie un numar valid!");
    }
}