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
document.addEventListener("DOMContentLoaded", function(event) {
    try {
        
        const CopyPasteText = document.getElementById("copy-paste-text");
        if (!CopyPasteText) throw new Error("Text element is not found");

        
        CopyPasteText.addEventListener('cut', (event) => {
            try {
                
                const selection = document.getSelection()?.toString()?.toUpperCase() || "";

                
                if (event.clipboardData) {
                    event.clipboardData.setData('text/plain', selection);
                }
                else {
                    throw new Error("Clipboard access not available");
                }

                
                const myValue = CopyPasteText.value;
                const Start = CopyPasteText.selectionStart;
                const End = CopyPasteText.selectionEnd;
                CopyPasteText.value = myValue.slice(0, Start) + myValue.slice(End);

                
                CopyPasteText.setSelectionRange(Start, Start);

                
                setMessage("cut text: " + selection);
                event.preventDefault();
            }
            catch (error) {
                setMessage("cut operation failed", true);
                console.error("cut error", error);
                event.preventDefault();
            }
        });

        // Handle copy event (Ctrl+C)
        CopyPasteText.addEventListener('copy', (event) => {
            try {
                const selection = document.getSelection()?.toString() || "";
                setMessage("Copied text: " + selection);
            }
            catch (error) {
                setMessage("Copy operation failed", true);
                console.error("Copy error:", error);
            }
        });

        // Handle paste event (Ctrl+V)
        CopyPasteText.addEventListener('paste', (event) => {
            try {
                const clipboardData = event.clipboardData || window.clipboardData;
                if (!clipboardData) throw new Error("Clipboard access not available");
                
                const paste = clipboardData.getData('text') || "";
                setMessage("Pasted text: " + paste);
            }
            catch (error) {
                setMessage("Paste operation failed", true);
                console.error("Paste error:", error);
                event.preventDefault();
            }
        });
    }
    catch (error) {
        console.error("Initialization error:", error);
        setMessage("Failed to initialize clipboard functions", true);
    }
});