const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '../../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);

const read = (collection) => {
  const filePath = getFilePath(collection);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
    return [];
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const write = (collection, data) => {
  fs.writeFileSync(getFilePath(collection), JSON.stringify(data, null, 2));
};

const find = (collection, predicate) => {
  return read(collection).find(predicate);
};

const findMany = (collection, predicate) => {
  const data = read(collection);
  return predicate ? data.filter(predicate) : data;
};

const create = (collection, item) => {
  const data = read(collection);
  const newItem = { id: crypto.randomUUID(), ...item, createdAt: new Date() };
  data.push(newItem);
  write(collection, data);
  return newItem;
};

const update = (collection, id, updates) => {
  let data = read(collection);
  let updatedItem = null;
  data = data.map(item => {
    if (item.id === id) {
      updatedItem = { ...item, ...updates, updatedAt: new Date() };
      return updatedItem;
    }
    return item;
  });
  write(collection, data);
  return updatedItem;
};

const upsert = (collection, predicate, item) => {
  let data = read(collection);
  const index = data.findIndex(predicate);
  if (index !== -1) {
    data[index] = { ...data[index], ...item, updatedAt: new Date() };
    write(collection, data);
    return data[index];
  } else {
    return create(collection, item);
  }
};

module.exports = { read, write, find, findMany, create, update, upsert };
