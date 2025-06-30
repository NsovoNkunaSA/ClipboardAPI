function CopyText() {
    let value = document.getElementById("copy-text").value;
    
    navigator.clipboard.writeText(value)
        .then(function() {
            alert("Text was copied to the clipboard");
        })
        .catch(function(err) {
            alert("Failed to copy: " + err);
            console.error(err);
        });
}

function PasteText(){
    navigator.clipboard().readText()
    .then(function(ClipText){
        document.getElementById("paste-text").value=ClipText;
        alert("Text posted");
    })
    .catch(function(err){
        alert("Failed to access the clipboard"+ err);
        console.error("Error on clipboard", err);
    });
}

function setMessage(message, isError = false){
    try{
        const messageElement = document.getElementById("event-text");
        if(!messageElement) throw new Error("Message element not found");
        messageElement.innerText = message;
        if(isError){
            messageElement.style.color= 'red';
        }
        else{
            messageElement.style.color = ''; //reset to default
        }

        setTimeout(() => {
            messageElement.innerText = "";
        },2000);
    }

    catch (error){
        console.error("Error in the message sent:", error)
    }
    
}
