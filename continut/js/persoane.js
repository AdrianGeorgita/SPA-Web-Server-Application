function incarcaPersoane(){
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var continut = this.responseText;;
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(continut,"text/xml");

        var persoane = xmlDoc.querySelectorAll("persoana");
        
        document.getElementById("continut").innerHTML = "<h2>Persoane</h2>"
        let divElem = document.createElement("div")
        divElem.classList.add("mainPersoane")

        var table = document.createElement("table");
        table.setAttribute("class","invatTable");

        var headerRow = document.createElement("tr");
        var headers = ["ID", "Nume", "Prenume", "Varsta", "Adresa", "Email", "Telefon Mobil", "Ocupatia"];
        headers.forEach(function(headerText) {
            var headerCell = document.createElement("th");
            headerCell.textContent = headerText;
            headerRow.appendChild(headerCell);
        });
        table.appendChild(headerRow);

        persoane.forEach(function(persoana) {
            var id = persoana.getAttribute("id");
            var nume = persoana.querySelector("nume").textContent;
            var prenume = persoana.querySelector("prenume").textContent;
            var varsta = persoana.querySelector("varsta").textContent;
            var adresa = persoana.querySelector("adresa").textContent;
            var email = persoana.querySelector("email").textContent;
            var telefonMobil = persoana.querySelector("telefon-mobil").textContent;
            var ocupatia = persoana.querySelector("ocupatia").textContent;

            var row = document.createElement("tr");
            var rowData = [id, nume, prenume, varsta, adresa, email, telefonMobil, ocupatia];
            rowData.forEach(function(data) {
                var cell = document.createElement("td");
                cell.textContent = data;
                row.appendChild(cell);
            });
            table.appendChild(row);
        });
        
        divElem.appendChild(table)

        document.getElementById("continut").innerHTML += divElem.outerHTML;
    }
    xhttp.open("GET", "resurse/persoane.xml", true);
    xhttp.send();
}

function checkAccount(){
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var continut = this.responseText;;
        
        var utilizator = document.getElementById("checkAccountUser").value;
        var parola = document.getElementById("checkAccountPassword").value;

        const obj = JSON.parse(continut);
        var isValid = false;

        isValid = obj.some(cont => cont.utilizator == utilizator && cont.parola == parola);

        if(isValid)
            document.getElementById("checkAccountLabel").innerHTML = "Datele sunt valide!";
        else
            document.getElementById("checkAccountLabel").innerHTML = "Datele sunt invalide!";
    }
    xhttp.open("GET", "resurse/utilizatori.json", true);
    xhttp.send();
}


function registerAccount(){
    var utilizator = document.getElementById("numeUtilizator").value;
    var parola = document.getElementById("parola").value;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if(xttp.readyState == 4 && xttp.status == 200){
            var continut = xttp.responseText;
        }
    }

    var url = "api/utilizatori"

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-Type","application/json");

    var data = JSON.stringify({"utilizator": utilizator, "parola": parola});

    xhttp.send(data);
}

