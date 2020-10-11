function updateText(newText) {
    var textboxElement = document.getElementById('textbox');
    var response = "<strong>Filename: </strong>".concat(newText)
    textboxElement.innerHTML = response;
}


const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);
    sFilename = fileList[0].name;
    updateText(sFilename)

});

