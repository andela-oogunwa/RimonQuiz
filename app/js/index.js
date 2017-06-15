
'use strict';
var filesystem = require("fs");
var path = require('path');
var ipc = require('electron').ipcMain;
var remote = require('electron').remote;

(function() {
  var closeEl = document.querySelector('.close');
  var files;
  var file;
  var extension;
  var srcPath;
  var destPath;
  var movingFiles;
  var input = document.getElementById("fileURL");
  var secondInput = document.getElementById("secondFileURL");
  var output = document.getElementById("fileOutput");
  var buttonEle = document.getElementById("moveFile");
  var savedFilesPath = { }
  var path_to_read = path.resolve(__dirname, "../files_path.json")
  var elapsed_time = document.querySelector('input[name=schedule]:checked').value
  var buttonClose = document.getElementById('close')

  setInterval(function(){
    var data = filesystem.readFileSync(path_to_read, 'utf-8')
    var filesPath = JSON.parse(data)
    if(filesPath && filesPath.length > 0) {
      console.log('showing json files:')
      filesPath.forEach(function(file){
        var files_to_move = _getAllFilesFromFolder(file.srcPath)
        moveFiles(files_to_move, file.srcPath, file.destPath)
      })
    }
  },
    1000 * Number(elapsed_time)
  )

  var _getAllFilesFromFolder = function(dir) {
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

  function moveFiles(files_to_move, src, dest) {
    var mv = require('mv');
    if(dest != null && src!= null) {
      if(files_to_move.length) {
        files_to_move.forEach(function(file) {
          // moveFile(srcPath, file, destPath);
          mv(src + "\\" + file, dest + "\\" + file, function(err) {
              if(err) {
                console.log("Transfer failed : " + err);
              } else {
                console.log("done!");
              }
          });
        });
      }
    }
  }

  function moveOnClick(files_to_move) {
    console.log('files_to_move:', files_to_move)
    moveFiles(files_to_move, srcPath, destPath)
    try{
      filesystem.writeFileSync(path_to_read, JSON.stringify([savedFilesPath]), 'utf-8')
    }catch(e) {
      throw e
    }
  }

  //function to select file or folder source

  input.addEventListener("change", function(e) {
    files = e.target.files;
    output.innerHTML = "";

    console.log(e);
    srcPath = e.target.files[0].path;
    savedFilesPath.srcPath = srcPath
    // console.log(movingFiles);
  }, false);

  secondInput.addEventListener("change", function(e) {
    files = e.target.files;
    output.innerHTML = "";

    console.log(e);
    destPath = e.target.files[0].path;
    savedFilesPath.destPath = destPath
    console.log("dest path : " + destPath);
  }, false);


  buttonEle.addEventListener("click", function(e) {
   e.preventDefault(); 
    console.log('calling function');
    moveOnClick(_getAllFilesFromFolder(srcPath));
  })

  buttonClose.addEventListener("click", function (e){
    e.preventDefault();
    remote.getCurrentWindow().close()
  })
}())