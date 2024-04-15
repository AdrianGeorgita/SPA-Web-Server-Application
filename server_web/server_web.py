import socket
import os # pentru dimensiunea fisierului
import json
import threading
import gzip


# creeaza un server socket
serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
# specifica ca serverul va rula pe portul 5678, accesibil de pe orice ip al serverului
serversocket.bind(('', 5678))
# serverul poate accepta conexiuni; specifica cati clienti pot astepta la coada
serversocket.listen(5)

def handleClient(clientsocket, address):
	print('S-a conectat un client cu adresa: '+str(address))
	# se proceseaza cererea si se citeste prima linie de text
	cerere = ''
	linieDeStart = ''
	while True:
		buf = clientsocket.recv(1024)
		if len(buf) < 1:
			break
		cerere = cerere + buf.decode()
		print('S-a citit mesajul: \n---------------------------\n' + cerere + '\n---------------------------')
		pozitie = cerere.find('\r\n')
		if (pozitie > -1 and linieDeStart == ''):
			linieDeStart = cerere[0:pozitie]
			print('S-a citit linia de start din cerere: ##### ' + linieDeStart + ' #####')
			break
	print('S-a terminat cititrea.')
	if linieDeStart == '':
		clientsocket.close()
		print('S-a terminat comunicarea cu clientul - nu s-a primit niciun mesaj.')
		return
	# interpretarea sirului de caractere `linieDeStart`
	elementeLineDeStart = linieDeStart.split()
	# TODO securizare
	numeResursaCeruta = elementeLineDeStart[1]
	if numeResursaCeruta == '/':
		numeResursaCeruta = '/index.html'

	# calea este relativa la directorul de unde a fost executat scriptul
	numeFisier = '../continut' + numeResursaCeruta
	
	fisier = None
	try:
		print(elementeLineDeStart[1])
		if not (elementeLineDeStart[1] == "/api/utilizatori"):
			# deschide fisierul pentru citire in mod binar
			fisier = open(numeFisier,'rb')

			# tip media
			numeExtensie = numeFisier[numeFisier.rfind('.')+1:]
			tipuriMedia = {
				'html': 'text/html; charset=utf-8',
				'css': 'text/css; charset=utf-',
				'js': 'text/javascript; charset=utf-8',
				'png': 'image/png',
				'jpg': 'image/jpeg',
				'jpeg': 'image/jpeg',
				'gif': 'image/gif', 
				'ico': 'image/x-icon',
				'xml': 'application/xml; charset=utf-8',
				'json': 'application/json; charset=utf-8'
			}
			tipMedia = tipuriMedia.get(numeExtensie,'text/plain; charset=utf-8')
			
			compressedContent = gzip.compress(fisier.read())

			# se trimite raspunsul
			clientsocket.sendall(b'HTTP/1.1 200 OK\r\n')
			clientsocket.sendall(('Content-Length: ' + str(len(compressedContent)) + '\r\n').encode())
			clientsocket.sendall(('Content-Type: ' + str(tipMedia) +'\r\n').encode())
			clientsocket.sendall(b'Content-Encoding: gzip\r\n')
			clientsocket.sendall(b'Server: My PW Server\r\n')
			clientsocket.sendall(b'\r\n')
			
			# trimite la server bucati din continutul compresat
			bytesSent = 0
			while bytesSent < len(compressedContent):
				# determinam indexul de sfarsit al continutului actual fara sa depasim lungimea continutului
				index = min(bytesSent+1024, len(compressedContent))
				content = compressedContent[bytesSent:index]
				clientsocket.sendall(content)
				bytesSent += len(content)
		else:
			if elementeLineDeStart[0] == "POST":
				lungime_corp = cerere.find('Content-Length: ') + len('Content-Length: ')
				pozitie_finala = cerere.find('\r\n', lungime_corp)
				lungime_date = int(cerere[lungime_corp:pozitie_finala])
				corp = cerere[cerere.find('\r\n\r\n') + 4:]

				data = json.loads(corp)

				utilizator = data.get('utilizator')
				parola = data.get('parola')

				if utilizator and parola:

					try:
						with open('../continut/resurse/utilizatori.json','r') as file:
							existingData = json.load(file)
					except FileNotFoundError:
						existingData = []

					existingData.append(data)

					with open('../continut/resurse/utilizatori.json','w') as file:
						json.dump(existingData,file)
					raspuns = 'HTTP/1.1 200 OK\r\nContent-Length: 0\r\n\r\n'
				else:
					raspuns = 'HTTP/1/1 400 Bad Request\r\nContent-Length: 0\r\n'
			else:
				raspuns = 'HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n'

			clientsocket.sendall(raspuns.encode())
			

	except IOError:
		# daca fisierul nu exista trebuie trimis un mesaj de 404 Not Found
		msg = 'Eroare! Resursa ceruta ' + numeResursaCeruta + ' nu a putut fi gasita!'
		# print(msg)
		clientsocket.sendall(b'HTTP/1.1 404 Not Found\r\n')
		clientsocket.sendall(('Content-Length: ' + str(len(msg.encode('utf-8'))) + '\r\n').encode())
		clientsocket.sendall(b'Content-Type: text/plain; charset=utf-8\r\n')
		clientsocket.sendall(b'Server: My PW Server\r\n')
		clientsocket.sendall(b'\r\n')
		clientsocket.sendall(msg.encode())

	finally:
		if fisier is not None:
			fisier.close()
	clientsocket.close()
	print('S-a terminat comunicarea cu clientul.')

while True:
	print('#########################################################################')
	print('Serverul asculta potentiali clienti.')
	# asteapta conectarea unui client la server
	# metoda `accept` este blocanta => clientsocket, care reprezinta socket-ul corespunzator clientului conectat
	(clientsocket, address) = serversocket.accept()
	
	thread = threading.Thread(target=handleClient, args=(clientsocket, address))
	thread.start()