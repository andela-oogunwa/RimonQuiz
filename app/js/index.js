
'use strict';
var ipc = require('electron').ipcMain;
var closeEl = document.querySelector('.close');
var mv = require('mv');


var _getAllFilesFromFolder = function(dir) {

    var filesystem = require("fs");
    var results = [];

    filesystem.readdirSync(dir).forEach(function(file) {
        console.log(file);
        console.log(dir);

       // file = file.replace(/ /g, "^ ");
        var index = file.indexOf(" ");
        var path =  index < 0 ? dir + "\\" + file : "\"" + dir + "\\" + insert(file, index, "\"");

        var now = new Date();
        var stat = filesystem.existsSync(path)
        var modified = new Date(stat.mtime);

        var diff = now - modified;

       // if(diff > 172800000) {
        	results.push(file);
        //}

    });

    console.log("### results :" + results);

    return results;
                  
};

function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}


function moveFile(srcPath, fileName, destPath){
	console.log(destPath);
  console.log(fileName);
  console.log(srcPath);

  mv(srcPath + "\\" + fileName, destPath + "\\" + fileName, function(err) {
      if(err) {
        console.log("Transfer failed : " + err);
      } else {
        console.log("done!");
      }
  });
   
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
                console.log("dest path : " + destPath);
            }, false);


            buttonEle.addEventListener("click", function(e) {
              	e.preventDefault();
              	console.log('calling function');
              	if(destPath != null && srcPath!= null) {
	             	if(movingFiles.length) {
	             		movingFiles.forEach(function(file) {
		             		moveFile(srcPath, file, destPath);
		             	});
	             	}
             	}
            })

             
})();


