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
    this.tmpFilePath = path.join(STORE_DIR, `${name}.json.tmp`);
    this.data = this._load();
  }

  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error(`[Store] Error loading store ${this.name}:`, err.message);
      // Attempt recovery from tmp file if available
      try {
        if (fs.existsSync(this.tmpFilePath)) {
          const rawTmp = fs.readFileSync(this.tmpFilePath, 'utf-8');
          return JSON.parse(rawTmp);
        }
      } catch (tmpErr) {
        console.error(`[Store] Tmp recovery failed for ${this.name}:`, tmpErr.message);
      }
    }
    return [];
  }

  _save() {
    try {
      const serialized = JSON.stringify(this.data, null, 2);
      // Safe write: write to temp file then copy to destination to avoid data corruption
      fs.writeFileSync(this.tmpFilePath, serialized, 'utf-8');
      fs.copyFileSync(this.tmpFilePath, this.filePath);
      try {
        fs.unlinkSync(this.tmpFilePath);
      } catch {
        // Ignore unlink error
      }
    } catch (err) {
      console.error(`[Store] Error saving store ${this.name}:`, err.message);
      // Fallback: direct write
      try {
        fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
      } catch (fatalErr) {
        console.error(`[Store] Fatal fallback save error for ${this.name}:`, fatalErr.message);
      }
    }
  }

  reload() {
    this.data = this._load();
    return this.data;
  }

  async find(query = {}) {
    this.reload();
    let results = this.data.filter(item => {
      for (const key in query) {
        if (query[key] !== undefined && item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
    return results.map(item => ({ ...item }));
  }

  async findOne(query = {}) {
    this.reload();
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
    this.reload();
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
    this.reload();
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
    this.reload();
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
    this.reload();
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
    this.reload();
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
