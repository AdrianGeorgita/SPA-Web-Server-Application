onmessage = (e) => {
    console.log("Message received from cumparaturi.js");
    postMessage(e.data);
}