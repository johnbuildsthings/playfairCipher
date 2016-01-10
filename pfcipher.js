#!/usr/bin/node

var fs = require('fs');

var keyMatrix = function(key){
  // returns a hash of alphabet - q ==> letter are keys and coordinates are value
  // value [row, col]
  var tempHash = {};
  var count = 0;

  key.toLowerCase().split('').forEach(function(element, index){
    if(!tempHash.hasOwnProperty(element) && element !== " "){
      tempHash[element] = [Math.floor(count/5), count%5];
      count++;
    }
  })
  for(var i=0; i<26; i++){
    // 97 === 'a'
    var letter = (String.fromCharCode(i+97) !== 'q') ? String.fromCharCode(i+97) : String.fromCharCode(i+97+1);
    if(!tempHash.hasOwnProperty(letter)){
      tempHash[letter] = [Math.floor(count/5), count%5];
      count++;
    }
  }
 
  return tempHash;
}

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

// main();
var test = keyMatrix('first example')
console.log(test);
