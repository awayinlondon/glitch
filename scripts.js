function drop(event) {
    evt.stopPropogation();
    evt.preventDefault();
    
    var fileList = event.dataTransfer.files;
    
    // access file via fileList
}

function dragOver(evt) {
    evt.stopPropogation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy';
}

var dropZone = document.getElementById("fileDropZone");
dropZone.addEventListener("dragover", dragOver, false);
dropZone.addEventListener("drop", drop, false);
