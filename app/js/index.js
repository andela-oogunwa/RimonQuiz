
'use strict';
var filesystem = require("fs");
var path = require('path');
var ipc = require('electron').ipcMain;
var remote = require('electron').remote;
var mv = require('mv');
var fs = require('fs.extra');

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
  var buttonMinimize = document.getElementById('minimize');
  var buttonSchedule = document.getElementById('schedule-btn');
  var interval;

  // setInterval(function(){
  //   var data = filesystem.readFileSync(path_to_read, 'utf-8')
  //   var filesPath = JSON.parse(data)
  //   if(filesPath && filesPath.length > 0) {
  //     console.log('showing json files:')
  //     filesPath.forEach(function(file){
  //       var files_to_move = _getAllFilesFromFolder(file.srcPath)
  //       moveFiles(files_to_move, file.srcPath, file.destPath)
  //     })
  //   }
  // },
  //   1000 * Number(elapsed_time)
  // )

function schedule() {
  console.log("schedule")
  if (interval) {
    clearInterval(interval);
  }
  if (!srcPath && !destPath) return;
  interval = setInterval(function(){
    if (shouldMoveFolder(srcPath)) {
      moveOnClick(srcPath);
    }
  }, 1000 * Number(elapsed_time))
}
  var shouldMoveFolder = function(dir) {
    var maxTime = thresholdDate()
    // return false;
    // var shouldMove = true;
    var shouldMove = filesystem.readdirSync(dir).every(function(file) {
        console.log(file);
        
// 
       // file = file.replace(/ /g, "^ ");
        var index = file.indexOf(" ");
        // var path =  index < 0 ? dir + "\\" + file : "\"" + dir + "\\" + insert(file, index, "\"");
        var path =  dir + "\\" + file;
        console.log("two");
        // var now = new Date();
        //var stat = filesystem.existsSync(path)
        var stat = filesystem.statSync(path)
        console.log("three")
        //var modified = new Date(stat.mtime);
        //console.log(stat, path)

        return Date.now() - maxTime > stat.mtime;
    });
    console.log(shouldMove);
    return shouldMove;
  };

  function thresholdDate() {
    var durationVal = $('#durationVal').val();
    var durationUnit = $('#durationUnit').val();
    // var duration = durationVal * 60  * 60;
    var duration = durationUnit == 1 ? (durationVal * 60  * 60) : (durationVal * 60  * 60 * 24)
    console.log(duration)
    return (duration*1000);
  }


  function insert(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
  }

  /*function moveFolder(dir_to_move, dest) {
    if(dest != null && dir_to_move!= null) {
      mv(dir_to_move, dest , {clobber: false, mkdirp: true}, function(err) {
        // done. it first created all the necessary directories, and then 
        // tried fs.rename, then falls back to using ncp to copy the dir 
        // to dest and then rimraf to remove the source dir 
      if (err) {
        console.log("failed! : " + err);
      } else {
        console.log("done!");
        console.log(dest)
        // var dest2 = dest+'\\moveFolder'
        // console.log(dest2)
        filesystem.access("moveFolder", 4, function(err) {
          console.log(err);
        })
        return false;
        filesystem.rename('/tmp/hello', '/tmp/world', function (err) {
          if (err) throw err;
          console.log('renamed complete');
        });
      }
        
      });
      }
  }*/

  function moveFolder(dir_to_move, dest) {
    if(dest != null && dir_to_move!= null) {
      // var newDest = dest.split('/')
      //var newDest = dest + String(Date.now())
      var splitted = dir_to_move.split(path.sep);
      var newDest = path.join(dest, splitted[splitted.length-1]);
      console.log(newDest)
      fs.move(dir_to_move, newDest , function(err) {
        // done. it first created all the necessary directories, and then 
        // tried fs.rename, then falls back to using ncp to copy the dir 
        // to dest and then rimraf to remove the source dir 
      if (err) {
        console.log("failed! : " + err);
      } else {
        console.log("done!");
        alert("FOLDER MOVED SUCCESSFULLY!")
      }
        
      });
      }
  }

  function moveOnClick(dir_to_move) {
    console.log('folder_to_move:' + dir_to_move);
    moveFolder(dir_to_move, destPath);
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
    if (shouldMoveFolder(srcPath)) {
      console.info("yeah correct")
      moveOnClick(srcPath); 
    } else {
      alert("THE FILE(S) IN THE FOLDER DO(ES) NOT MEET THE REQUIREMENT!");
      console.error("OOOOPSSS!")
    }
    
  })

  buttonClose.addEventListener("click", function (e){
    e.preventDefault();
    remote.getCurrentWindow().close()
  })

  buttonMinimize.addEventListener("click", function(e){
    e.preventDefault();
    remote.getCurrentWindow().minimize()
  })

  buttonSchedule.addEventListener("click", function(e){
    e.preventDefault();
    schedule();
  })
}())