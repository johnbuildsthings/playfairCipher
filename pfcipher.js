var fs = require('fs');



var encrypt = function(key, direction, message){

}

var writeToFile = function(key, direction, origin, dest){
  var data = encrypt(key, direction, origin);

  if(dest){
    fs.appendFile(dest, data, encoding='utf8', function(err){
      if(err) console.log('error when writing to file', err);
    })
  }else{
    console.log(data)
  }
}

var main = function(){
  var args = process.argv.slice(2, process.argv.length);
  if(args[0] === 'help'){
    console.log("Call format: ./transpositionalCipher.js key encrypt/decrypt file/message destination/none\
      \n\nmessage file and destination must be absolute paths\
      \nif no destination is given message will print to stdout");
    return true;
  }
  if (args[2].match(/^\//g)){
    // read file
    fs.readFile(args[2], 'utf8', function(err, data){
      writeToFile(args[0], args[1], data, args[3] || null);
    })
  }else{
    writeToFile(args[0], args[1], args[2], args[3] || null);
  }
}

main();