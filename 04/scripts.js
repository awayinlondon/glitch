// -----
// zip stuff
// -----

function listWrap(zipEntries) {
    var list = `<ul>\n${zipEntries.map(element => {return `<li><strong>Filename: </strong>${element.filename}\n</li>\n`}).join('')}</ul>`;
    var textboxElement = document.getElementById('list');
    textboxElement.innerHTML = list;
}

function zipStuff(blob) {
    console.log('zipStuff: entering function');
    // use a BlobReader to read the zip from a Blob object
    zip.createReader(new zip.BlobReader(blob), function(reader) {

        // get all entries from the zip
        reader.getEntries(function(entries) {
        if (entries.length) {
            console.log(entries);
            listWrap(entries);
            console.log("zipStuff: if entries.length");
            // get first entry content as text
            entries[0].getData(new zip.TextWriter(), function(text) {
            // text contains the entry data as a String
            console.log('entries[0].getData...');
            console.log(text);
    
            // close the zip reader
            reader.close(function() {
                // onclose callback
            });
    
            }, function(current, total) {
            // onprogress callback
            console.log("zipStuff: onprogress callback");
            });
        }
        });
    }, function(error) {
        // onerror callback
        console.log("zipStuff: onerror callback");
        console.log(error);
    });
}

function updateText(newText) {
    var textboxElement = document.getElementById('list');
    var response = `<ul><li><strong>Filename: </strong>${newText}</li></ul>`
    textboxElement.innerHTML = response;
}


const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
    const fileList = event.target.files;
    console.log(fileList);
    sFilename = fileList[0].name;
    updateText(sFilename)
    zipStuff(fileList[0]);
});

let dropArea = document.getElementById('drop-area');
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
});

function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
  }

['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
    dropArea.classList.add('highlight')
}

function unhighlight(e) {
    dropArea.classList.remove('highlight')
}

dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;

  handleFiles(files);
}

function handleFiles(files) {
    ([...files]).forEach(uploadFile)
}

function uploadFile(file) {
    console.log(file);
    console.log("file instanceof File: ".concat(file instanceof File));
    console.log("file instanceof Blob: ".concat(file instanceof File));
    sFilename = file.name;
    updateText(sFilename)
    zipStuff(file);
}
