import socket
import os.path
import stat
# creeaza un server socket
serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# specifica ca serverul va rula pe portul 5678, accesibil de pe orice ip al serverului
serversocket.bind(('', 5678))
# serverul poate accepta conexiuni; specifica cati clienti pot astepta la coada
serversocket.listen(5)
while True:
    print('#########################################################################')
    print('Serverul asculta potentiali clienti.')
    # asteapta conectarea unui client la server
    # metoda `accept` este blocanta => clientsocket, care reprezinta socket-ul corespunzator clientului conectat
    (clientsocket, address) = serversocket.accept()
    print('S-a conectat un client.')
    # se proceseaza cererea si se citeste prima linie de text
    cerere = ''
    linieDeStart = ''
    while True:
        data = clientsocket.recv(1024)
        cerere = cerere + data.decode()
        print('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
        pozitie = cerere.find('\r\n')
        if (pozitie > -1):
            linieDeStart = cerere[0:pozitie]
            print('S-a citit linia de start din cerere: ##### ' + linieDeStart + '#####')
            break
    print('S-a terminat cititrea.')
    # TODO interpretarea sirului de caractere `linieDeStart` pentru a extrage numele resursei cerute
    numeResursa = linieDeStart.split()[1]

    if numeResursa == "favicon.ico":
        numeResursa = "/continut/favicon.ico"

    resourceAvailable = False
    if os.path.exists(".."+numeResursa):
        resourceAvailable = True
    #print(numeResursa)
    startLine = "HTTP/1.1 404 Not Found\r\n"
    content = "\r\n"
    contentLength = str(len(content.encode('utf-8')))+"\r\n"
    contentType = "text/html;charset=utf-8\r\n"
    server = "MyFootballServer\r\n\r\n"
    if resourceAvailable:
        startLine = "HTTP/1.1 200 OK\r\n"
        file = open(".."+numeResursa,"rb")
        #print(file.readlines())
        content = ""
        #for line in file.readlines():
         #   content = content + line
        #print(content)
        contentLength = str(os.stat(".."+numeResursa).st_size)+"\r\n"  #str(len(content.encode('utf-8')))+"\r\n"
        #print(contentLength)
        type = numeResursa.split(".")[1]
        if type == "html":
            contentType = "text/html"
        elif type == "css":
            contentType = "text/css"
        elif type == "js":
            contentType = "application/js"
        elif type == "png":
            contentType = "text/png"
        elif type == "jpg" or type == "jpeg":
            contentType = "text/jpeg"
        elif type == "gif":
            contentType = "text/gif"
        elif type == "ico":
            contentType = "image/x-icon"
        else:
            contentType = "text/plain"
        contentType = contentType + "\r\n"
    response = startLine+contentLength+contentType+server
    print(response)
    #response = startLine+"Content-Length: 27\r\nContent-Type: text/plain;charset=utf-8\r\nServer: MyFootballServer\r\n\r\n"+content
    # TODO trimiterea răspunsului HTTP
    clientsocket.sendall(response.encode("utf-8"))

    print(response)

    if resourceAvailable:
        buffer = file.read(1024)
        while(buffer):
            print(buffer)
            clientsocket.send(buffer)
            buffer = file.read(1024)

    clientsocket.sendall(b'\r\n')

    clientsocket.close()
    print('S-a terminat comunicarea cu clientul.')