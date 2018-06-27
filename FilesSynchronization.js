var md5File = require('md5-file');
var fs = require('fs');
var isdir = require('isdir');
var from = "C:/Users/Ruslan/Desktop/FileSynchronization/from/";
var to = "C:/Users/Ruslan/Desktop/FileSynchronization/to/";


function synchronization(from, to) {
  fs.readdir(from, function(err, files) {
    if (err) {
      console.log("Warning 1: " + err);
    } else {
      files.forEach(function(file) {
        isdir(from + file, function(err, dir) {
          if (err) {
            console.log("Warning 2: " + err);
          } else if (dir) {
            //  console.log("dir "+file);
            fs.readdir(to + file, function(err, directory) {
              if (err) {
                fs.mkdir(to + file, function(e) {
                  synchronization(from + file + "/", to + file + "/");
                })
              } else {
                synchronization(from + file + "/", to + file + "/");
              }
            });
          } else {
            //console.log("file "+file);
            md5File(to + file, function(err, to_hash) {
              if (err) {
                // Если возникает ошибка, значит файла нет, поэтому просто копируем из from в to
                fs.createReadStream(from + file).pipe(fs.createWriteStream(to + file));
                //  console.log("Файл скопирован " + to + file);
              } else {
                // Если ошибки нет, сравниваем md5 сумму файлов
                // Если они отличаются заменяем из from в to
                md5File(from + file, function(err, from_hash) {
                  if (to_hash != from_hash) {
                    fs.createReadStream(from + file).pipe(fs.createWriteStream(to + file));
                  }
                });
              }
            });
          }
        })
      });
    }
  });
}

synchronization(from, to);