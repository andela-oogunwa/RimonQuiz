
'use strict';
var ipc = require('electron').ipcMain;
var closeEl = document.querySelector('.close');

/*(function closeWindow(){
	mainWindow.close();
})()*/



var _getAllFilesFromFolder = function(dir) {

    var filesystem = require("fs");
    var results = [];

    filesystem.readdirSync(dir).forEach(function(file) {
    	// console.log(file);

        file = dir+'/'+file;
        var stat = filesystem.statSync(file);
        var now = new Date();
        var modified = new Date(stat.mtime);

        var diff = now - modified;

        if(diff > 172800000) {
        	results.push(file);
        }

    });

    return results;
                  
};


function moveFile(filePath, destPath){
	console.log(destPath);
   var object = new ActiveXObject("Scripting.FileSystemObject");
   var file = object.GetFile(filePath);
   file.Move(destPath);
   console.log("File is moved successfully");
}

//function to select file or folder source
(function(){
            var files, 
                file, 
                extension,
                srcPath,
                destPath,
                movingFiles,
                input = document.getElementById("fileURL"), 
                secondInput = document.getElementById("secondFileURL"),
                output = document.getElementById("fileOutput"),
                buttonEle = document.getElementById("moveFile");
            
            input.addEventListener("change", function(e) {
                files = e.target.files;
                output.innerHTML = "";

                console.log(e);
                srcPath = e.target.files[0].path;

                movingFiles = _getAllFilesFromFolder(srcPath);
                console.log(movingFiles);
            }, false);

             secondInput.addEventListener("change", function(e) {
                files = e.target.files;
                output.innerHTML = "";

                console.log(e);
                destPath = e.target.files[0].path;
            }, false);


            buttonEle.addEventListener("change", function(e) {
              	e.preventDefault();
              	if(destPath != null && srcPath!= null) {
	             	if(movingFiles.length) {
	             		movingFiles.forEach(function(file) {
		             		moveFile(file, destPath);
		             	});
	             	}
             	}
            })

             
})();


