function incarcaPersoane(){
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function() {
        var continut = this.responseText;;
        parser = new DOMParser();
        xmlDoc = parser.parseFromString(continut,"text/xml");

        var persoane = xmlDoc.querySelectorAll("persoana");
        
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
        
        document.getElementById("continut").innerHTML = table.outerHTML;
    }
    xhttp.open("GET", "resurse/persoane.xml", true);
    xhttp.send();
}