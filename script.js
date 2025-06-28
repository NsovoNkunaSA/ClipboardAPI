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