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
