"use strict";

function getDateTimeStamp() {
    var date = new Date();
    var dateTimeStamp = date.toISOString();
    return dateTimeStamp;
}

function updateText(elementId, newText) {
    var textboxElement = document.getElementById(elementId);
    var current = textboxElement.innerHTML;
    var listItem = `<li><strong>${getDateTimeStamp()} </strong>${newText}</li>`;
    textboxElement.innerHTML = listItem.concat(current);
}

function log(newText) {
    updateText('log-box', newText)
}

function createDatabase() {
    log (`entering createDatabase`)
    // Declare db instance
    var db = new Dexie("FilesDB");
    // Define Database Schema
    //db.version(1).stores({files: "++id,date,filename,file"});
    db.version(1).stores({files: "++id"});
    db.version(2).stores({files: "++id, filename"});
    db.version(3).stores({files: "++id, filename, date"});
    db.open().then(function (db) {
        log ("Found database: " + db.name);
        log ("Database version: " + db.verno);
        db.tables.forEach(function (table) {
            log ("Found table: " + table.name);
            // log ("Table Schema: " + JSON.stringify(table.schema, null, 4));
        });
    }).catch('NoSuchDatabaseError', function(e) {
        // Database with that name did not exist
        log ("Database not found");
    }).catch(function (e) {
        log ("Oh uh: " + e);
    });
    return db;
} 

function listDatabases() {
    log('entering listDatabases');
    Dexie.getDatabaseNames().then((databaseNames) => {
        databaseNames.forEach((databaseName) => {
            log(`Database found: ${databaseName}`);
        });
    });
}

function deleteDatabase(){
    var db = createDatabase();
    db.delete().then(() => {
        log("Database successfully deleted");
    }).catch((err) => {
        log("Could not delete database");
    }).finally(() => {
        // Do what should be done next...
    });
}

function addEntries() {
    log('entering addEntries');
    var db = createDatabase();
    db.files.put({
        date: getDateTimeStamp(),
        filename: 'test file name',
        file: 'placeholder file'
    });
}

function readEntries() {
    log('entering readEntries');
    var db = createDatabase();
    db.files.each(function (dbEntry) {
        log("Found: " + dbEntry.file.name + ". Size: " + dbEntry.file.size);
    }).catch(function (error) {
        log(`Error: ${error}`);
    });
}

function deleteEntries() {
    log('entering deleteEntries');
    var result = Dexie.deleteDatabase('FilesDB');
    log(`Dexie delete result: ${result}`)
}

const fileSelector = document.getElementById('file-selector');
fileSelector.addEventListener('change', (event) => {
    log('entering file selector change event');
    const fileList = event.target.files;
    log(fileList);
    uploadFiles(fileList);
});

function uploadFiles(fileList) {
    log('entering upload files');
    // as FileList doesn't support forEach... neat foreach trick from https://stackoverflow.com/questions/40902437/cant-use-foreach-with-filelist
    [...fileList].forEach((file) => {
        var db = createDatabase();
        db.files.put({
            date: getDateTimeStamp(),
            filename: file.name,
            file: file
        });
    });
}

