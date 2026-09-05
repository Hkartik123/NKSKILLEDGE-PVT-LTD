const fs = require('fs');
const path = require('path');

const STORE_DIR = path.join(__dirname, '../data/store');

if (!fs.existsSync(STORE_DIR)) {
  fs.mkdirSync(STORE_DIR, { recursive: true });
}

class JsonCollection {
  constructor(name) {
    this.name = name;
    this.filePath = path.join(STORE_DIR, `${name}.json`);
    this.data = this._load();
  }

  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error(`Error loading store ${this.name}:`, err.message);
    }
    return [];
  }

  _save() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error(`Error saving store ${this.name}:`, err.message);
    }
  }

  async find(query = {}) {
    let results = this.data.filter(item => {
      for (const key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
    // Return objects with helper methods
    return results.map(item => ({ ...item }));
  }

  async findOne(query = {}) {
    const item = this.data.find(item => {
      for (const key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
    return item ? { ...item } : null;
  }

  async findById(id) {
    return this.findOne({ _id: id });
  }

  async create(doc) {
    const _id = doc._id || 'id_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    const newDoc = {
      _id,
      ...doc,
      createdAt: doc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.push(newDoc);
    this._save();
    return { ...newDoc };
  }

  async insertMany(docs) {
    const results = [];
    for (const doc of docs) {
      const res = await this.create(doc);
      results.push(res);
    }
    return results;
  }

  async findByIdAndUpdate(id, updates, options = { new: true }) {
    const index = this.data.findIndex(item => item._id === id);
    if (index === -1) return null;
    
    this.data[index] = {
      ...this.data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this._save();
    return { ...this.data[index] };
  }

  async findOneAndUpdate(query, updates, options = { new: true, upsert: false }) {
    const index = this.data.findIndex(item => {
      for (const key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) return false;
      }
      return true;
    });

    if (index === -1) {
      if (options.upsert) {
        return this.create({ ...query, ...updates });
      }
      return null;
    }

    this.data[index] = {
      ...this.data[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this._save();
    return { ...this.data[index] };
  }

  async findByIdAndDelete(id) {
    const index = this.data.findIndex(item => item._id === id);
    if (index === -1) return null;
    const removed = this.data.splice(index, 1)[0];
    this._save();
    return removed;
  }

  async countDocuments(query = {}) {
    const items = await this.find(query);
    return items.length;
  }

  async deleteMany(query = {}) {
    const beforeCount = this.data.length;
    const keys = Object.keys(query);
    if (keys.length === 0) {
      this.data = [];
    } else {
      this.data = this.data.filter(item => {
        const matches = keys.every(key => query[key] === undefined || item[key] === query[key]);
        return !matches;
      });
    }
    this._save();
    return { deletedCount: beforeCount - this.data.length };
  }
}

const collections = {};

function getCollection(name) {
  if (!collections[name]) {
    collections[name] = new JsonCollection(name);
  }
  return collections[name];
}

module.exports = {
  getCollection
};
