"use strict";

console.log("Entering, and exiting!, a template scripts.js file");

function updateText(elementId, newText) {
    var textboxElement = document.getElementById(elementId);
    var current = textboxElement.innerHTML;
    var listItem = `<li><strong>Filename: </strong>${newText}</li>`;
    textboxElement.innerHTML = listItem.concat(current);
}


const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
    let elementId = 'file-list';
    const fileList = event.target.files;
    console.log(fileList);
    let sFilename = fileList[0].name;
    updateText(elementId, sFilename)
    handleFileSelection(event);

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
    let elementId = "file-list";
    console.log(file);
    sFilename = file.name;
    updateText(elementId, sFilename)
}


// Database
function logToList(text) {
    updateText('file-list', text);
}

let DBNAME = 'awaydb'
let DBVERSION = 1;

function checkIndexedDBSupport() {
    if (!window.indexedDB) {
	    logToList("IndexedDB is not supported!");
    } else {
        logToList("IndexedDB is supported")
    }
}
checkIndexedDBSupport();

function createDatabase() {
	logToList("Entering create database");
	let name = DBNAME;
    let version = 1;
  
	let req = window.indexedDB.open(name, version);
  
  req.onupgradeneeded = function(event) {
    logToList(`createDatabase(): onupgradeneeded`)

    let db = event.target.result;

    // create files
    if (!db.objectStoreNames.contains('files')) {
      db.createObjectStore('files', { autoIncrement: true });
    }
  }
	req.onerror = function(event) {
		logToList("Entering on error");
		logToList(`Database error: ${event.target.errorCode}`);
	};
	req.onsuccess = function(event) {
		logToList("Successfully opened database");	
		logToList("Closing database");
		let db = req.result;
		db.close();
	};
}

function deleteDatabase() {
  logToList("Entering delete database");
  ['myDB', 'buttonDB', DBNAME].forEach(element => {
    let name = element;
    let req = indexedDB.deleteDatabase(element);
    req.onsuccess = function () {
      logToList("Database deleted successfully " + element);	
    }
    req.onerror = function() {
      logToList("Unable to delete database " + element);	
    }
    req.onblocked = function() {
      logToList("Unable to delete database due to the operation being blocked " + element);	
    }
  });
}

// -------------------------------
// promise wrapper for indexeddb from the book 'progressive web apps'
var openDatabase = function(dbName, dbVersion) {
  return new Promise(function (resolve, reject) {
    if (!window.indexedDB) {
      reject("IndexedDB not supported");
    }

    var request = window.indexedDB.open(dbName, dbVersion);

    request.onerror = function(event) {
      reject("Database error: " + event.target.error);
    };

    request.onupgradeneeded = function(event) {
      // Upgrade code
    };

    request.onsuccess = function(event) {
      resolve(event.target.result);
    };
  });
};

var openObjectStore = function(db, storeName, transactionMode) {
  return new Promise(function (resolve, reject) {
    var objectStore = db
      .transaction(storeName, transactionMode)
      .objectStore(storeName);
    resolve(objectStore);
  });
};

var addObject = function(objectStore, object) {
  return new Promise(function (resolve, reject) {
    var request = objectStore.add(object);
    request.onsuccess = resolve;
  });
};
// end of promise wrapper for indexeddb from the book 'progressive web apps'
// -------------------------------


function addEntries() {

}

function readEntries() {
  let request = indexedDB.open(DBNAME, DBVERSION);

  request.onsuccess = function(event) {
    var db = event.target.result;
    
    // read files
    db
    .transaction('files')
    .objectStore('files')
    .getAll()
    .onsuccess = function(event) {
      var files = event.target.result;
      files.forEach((file, index) => {
        logToList(`readEntries(): ${file.name} (${file.size /1024} kilobytes)`)
      });
    }

  };
  
}

function handleFileSelection(evt) {
    console.log("handleFileSelection()");
  
    var files = evt.target.files; // The files selected by the user (as a FileList object).
    if (!files) {
      logToList("At least one selected file is invalid - do not select any folders. Please reselect and try again.");
      return;
    }
  
    // refer to the following page for info re: iterating through a FileList object (doesn't support forEach)
    // https://stackoverflow.com/questions/40902437/cant-use-foreach-with-filelist 
    Array.from(files).forEach(file => {
      // add files
      console.log('adding file');
      console.log(file);
  
      addFileToDB(file);

      let request = indexedDB.open(DBNAME, DBVERSION);
      request.onsuccess = function(event) {
        let db = event.target.result;
        let transaction = db.transaction('files', 'readwrite');
        transaction.onerror = function(event) {
          console.log("Error: ", event.target.error);
        };
        var store = transaction.objectStore("files");
        store.add(file);
      }
  
    });
  
  }

  createDatabase();
  readEntries();

  const dexieDB = new Dexie('dexie-db');
  dexieDB.version(2).stores({
      files: '++id,filename,file'
  });

function addFileToDB(file) {
    dexieDB.transaction('rw', dexieDB.files, function() {
        logToList(`adding file to db: ${file.name}`);
        dexieDB.files.add({ filename: file.name, file: file});
    }).catch(function(err) {
        logToList(`error adding file to DB: ${err}`);
    });
}

async function readFilesFromDB() {
    const databases = Dexie.getDatabaseNames();
    logToList(databases);

    var files = await dexieDB.files.toArray();
    files.forEach(element => {
        logToList(element.filename);
    });   
}

readFilesFromDB();