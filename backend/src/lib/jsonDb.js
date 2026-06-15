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
  
  let needsSeed = false;
  if (!fs.existsSync(filePath)) {
    needsSeed = true;
  } else {
    // If it exists but is just an empty array, we should re-seed it (especially for lessons)
    const content = fs.readFileSync(filePath, 'utf-8').trim();
    if (content === '[]' || content === '') {
      needsSeed = true;
    }
  }

  if (needsSeed) {
    const defaultPath = path.join(__dirname, '../../default_data', `${collection}.json`);
    if (fs.existsSync(defaultPath)) {
      console.log(`Copying default data for ${collection}`);
      fs.copyFileSync(defaultPath, filePath);
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify([]));
    return [];
  }

  const currentData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Auto-merge new default lessons into the database file on start/read
  if (collection === 'lessons') {
    const defaultPath = path.join(__dirname, '../../default_data', 'lessons.json');
    if (fs.existsSync(defaultPath)) {
      try {
        const defaultData = JSON.parse(fs.readFileSync(defaultPath, 'utf-8'));
        let merged = [...currentData];
        let hasNew = false;

        defaultData.forEach(defaultLesson => {
          // Check if lesson already exists by ID, or title + category
          const exists = currentData.some(l => 
            l.id === defaultLesson.id || 
            (l.title === defaultLesson.title && l.category === defaultLesson.category)
          );
          if (!exists) {
            merged.push(defaultLesson);
            hasNew = true;
          }
        });

        if (hasNew) {
          console.log(`Merging ${merged.length - currentData.length} new default lessons into database.`);
          merged.sort((a, b) => (a.order || 0) - (b.order || 0));
          fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
          return merged;
        }
      } catch (e) {
        console.error('Error merging default lessons:', e);
      }
    }
  }

  return currentData;
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

const remove = (collection, id) => {
  let data = read(collection);
  data = data.filter(item => item.id !== id);
  write(collection, data);
};

const removeMany = (collection, predicate) => {
  let data = read(collection);
  data = data.filter(item => !predicate(item));
  write(collection, data);
};

module.exports = { read, write, find, findMany, create, update, upsert, remove, removeMany };
