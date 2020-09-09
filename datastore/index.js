const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // call counter.getNextUniqueId, with an anon function, with err, & id as parameters
  counter.getNextUniqueId((err, id) => {
    // call fs.writeFile, passing it id, text, calling the callback w/ an err
    fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
      if (err) {
        throw ('error writing new Todo');
      } else {
        callback(null, {id, text});
      }
    });
  });
};

exports.readAll = (callback) => {
  // invoke readdir, pass in the exports.dataDir path & anonFunc
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      throw ('couldn\'t read\'m matey');
    } else {
      var data = _.map(files, (id) => {
        id = id.split('.')[0];
        return {id, text: id};
      });
      callback(null, data);
    }
  });
  // var data = _.map(items, (text, id) => {
  //   return { id, text };
  // });
  // callback(null, data);
};

exports.readOne = (id, callback) => {
  fs.readFile(`${exports.dataDir}/${id}.txt`, 'utf8', (err, fileData) => {
    if (!fileData) {
      callback(new Error(`No freakin' item with id: ${id} you fool`));
    } else {
      callback(null, {id, text: fileData});
    }
  });

  // var text = items[id];
  // if (!text) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback(null, { id, text });
  // }
};

exports.update = (id, text, callback) => {
  fs.access(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(new Error('Sorry, we messed it up on update'));
    } else {
      fs.writeFile(`${exports.dataDir}/${id}.txt`, text, (err) => {
        if (err) {
          callback(new Error('Sorry, we messed it up on update'));
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  fs.unlink(`${exports.dataDir}/${id}.txt`, (err) => {
    if (err) {
      callback(new Error(`No item with this stinkin id: ${id}`));
    } else {
      callback();
    }
  });


  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
