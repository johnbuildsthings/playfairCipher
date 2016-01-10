#!/usr/bin/node

var fs = require('fs');

var keyMatrix = function(key){
  // returns a tuple ==> key matrix and a hash with keys ==> letters and value ==> coords
  // hash value [row, col]

  var matrix = [], tempHash = {}, tempString, count = 0;

  key.toLowerCase().split('').forEach(function(element, index){
    if(!tempHash.hasOwnProperty(element) && element !== " "){
      tempHash[element] = [Math.floor(count/5), count%5];
      count++;
    }
  })
  for(var i=0; i<26; i++){
    // 97
    var letter = (String.fromCharCode(i+97) !== 'q') ? String.fromCharCode(i+97) : String.fromCharCode(i+97+1);
    if(!tempHash.hasOwnProperty(letter)){
      tempHash[letter] = [Math.floor(count/5), count%5];
      count++;
    }
  }
  tempString = Object.keys(tempHash).join('');
  tempString.match(/.{1,5}/g).forEach(function(element, index){
    matrix.push(element.split(''));
  })
  return [tempHash, matrix];
}

var encryptSort = function(key, elements){
  // returns the new letters based on playfair alg

  var subDigram = '';
  var a = key[0][elements[0]].slice(0), b = key[0][elements[1]].slice(0);

  if(a[0] === b[0]){
    if(a[1] === 4){
      a[1] = 0;
    }else{
      a[1] = a[1] + 1;
    }
    if(b[1] === 4){
      b[1] = 0;
    }else{
      b[1] = b[1] + 1;
    }
  }else if(a[1] === b[1]){
    if(a[0] === 4){
      a[0] = 0;
    }else{
      a[0] = a[0] + 1;
    }
    if(b[0] === 4){
      b[0] = 0;
    }else{
      b[0] = b[0] + 1;
    }
  }else{
    var temp = [];
    temp.push([a[0], b[1]], [b[0], a[1]])
    a = temp[0];
    b = temp[1];
  }

  subDigram += key[1][a[0]][a[1]] + key[1][b[0]][b[1]];
  return subDigram;
}

var encrypt = function(key, direction, message){
  /*
    encrypt
    strip all white space out of message
    break message into digrams
    loop over digrams
      check if not length is 2 ==> add x
      check if letter are not different
        make string of rest of digrams starting with second letter of current
        make temp array of digrams with previous string
        concat original array from 0 to current and new array
        replace second letter with x
      set cipher += call encryptSort with key and digram
  */
  var cipherText = '', digrams = message.toLowerCase().split(' ').join('').match(/.{1,2}/g), key = keyMatrix(key);
  console.log(key[1]);

  for(var i=0; i<digrams.length; i++){
    if(digrams[i].length !== 2) digrams[i] += 'x';
    if(digrams[i][0] === digrams[i][1]){
      var temp = digrams[i][0] + 'x' + digrams[i][1] + digrams.splice(i+1, (i+1 - digrams.length)).join('');
      temp = temp.match(/.{1,2}/g);
      digrams = digrams.concat(temp);
    }
    cipherText += encryptSort(key, digrams[i]);
  }

  return cipherText;
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
// var testKey = keyMatrix('example key');
// var testEncrypt = encryptSort(testKey, 'ta');
// console.log(testKey[1], testEncrypt, 'ta')
// var test = encrypt('example key', 'encrypt', 'this is a test');
// console.log(test);