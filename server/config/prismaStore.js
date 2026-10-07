const MODEL_DELEGATES = {
  audit_logs: 'auditLog',
  blogs: 'blogPost',
  branches: 'branch',
  certificates: 'certificate',
  certifications: 'certification',
  clients: 'client',
  events: 'event',
  faqs: 'faq',
  internship_apps: 'internshipApplication',
  job_applications: 'jobApplication',
  jobs: 'jobOpening',
  leads: 'lead',
  media: 'media',
  notifications: 'notification',
  programs: 'program',
  projects: 'project',
  registrations: 'registration',
  services: 'service',
  site_settings: 'siteSetting',
  success_stories: 'successStory',
  team_members: 'teamMember',
  testimonials: 'testimonial',
  users: 'user'
};

function normalizeDocument(document) {
  return JSON.parse(JSON.stringify(document));
}

function matchesQuery(document, query) {
  return Object.keys(query).every(key =>
    query[key] === undefined || document[key] === query[key]
  );
}

function buildWhere(query) {
  const filters = [];

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) continue;
    if (key === '_id') {
      filters.push({ id: String(value) });
    } else if (value === null || typeof value === 'object') {
      return null;
    } else {
      filters.push({ payload: { path: [key], equals: value } });
    }
  }

  return filters.length ? { AND: filters } : undefined;
}

function toDate(value, fallback) {
  const date = value ? new Date(value) : fallback;
  return Number.isNaN(date.getTime()) ? fallback : date;
}

class PrismaCollection {
  constructor(prisma, name) {
    const delegateName = MODEL_DELEGATES[name];
    if (!delegateName || !prisma[delegateName]) {
      throw new Error(`Unsupported database collection: ${name}`);
    }

    this.delegate = prisma[delegateName];
  }

  async find(query = {}) {
    const where = buildWhere(query);
    const records = await this.delegate.findMany({
      ...(where ? { where } : {}),
      orderBy: [{ createdAt: 'asc' }, { id: 'asc' }]
    });
    return records
      .map(record => normalizeDocument(record.payload))
      .filter(document => matchesQuery(document, query));
  }

  async findOne(query = {}) {
    const [document] = await this.find(query);
    return document || null;
  }

  async findById(id) {
    const record = await this.delegate.findUnique({ where: { id: String(id) } });
    return record ? normalizeDocument(record.payload) : null;
  }

  async create(document) {
    const now = new Date();
    const id = document._id || `id_${now.getTime()}_${Math.random().toString(36).slice(2, 9)}`;
    const created = {
      ...document,
      _id: id,
      createdAt: document.createdAt || now.toISOString(),
      updatedAt: now.toISOString()
    };

    await this.delegate.create({
      data: {
        id: String(id),
        payload: normalizeDocument(created),
        createdAt: toDate(created.createdAt, now),
        updatedAt: now
      }
    });

    return normalizeDocument(created);
  }

  async insertMany(documents) {
    const results = [];
    for (const document of documents) {
      results.push(await this.create(document));
    }
    return results;
  }

  async importMany(documents) {
    const now = new Date();
    const records = documents.map(document => {
      if (!document || typeof document !== 'object' || Array.isArray(document) || !document._id) {
        throw new Error('Every imported record must be an object with an _id.');
      }

      const payload = normalizeDocument(document);
      return {
        id: String(payload._id),
        payload,
        createdAt: toDate(payload.createdAt, now),
        updatedAt: toDate(payload.updatedAt, now)
      };
    });

    const result = await this.delegate.createMany({
      data: records,
      skipDuplicates: true
    });
    return result.count;
  }

  async findByIdAndUpdate(id, updates) {
    const existing = await this.findById(id);
    if (!existing) return null;

    const updated = {
      ...existing,
      ...updates,
      _id: existing._id,
      updatedAt: new Date().toISOString()
    };

    await this.delegate.update({
      where: { id: String(id) },
      data: {
        payload: normalizeDocument(updated),
        updatedAt: new Date()
      }
    });

    return normalizeDocument(updated);
  }

  async findOneAndUpdate(query, updates, options = { new: true, upsert: false }) {
    const existing = await this.findOne(query);
    if (!existing) {
      return options.upsert ? this.create({ ...query, ...updates }) : null;
    }

    return this.findByIdAndUpdate(existing._id, updates);
  }

  async findByIdAndDelete(id) {
    const existing = await this.findById(id);
    if (!existing) return null;

    await this.delegate.delete({ where: { id: String(id) } });
    return existing;
  }

  async countDocuments(query = {}) {
    const where = buildWhere(query);
    if (where !== null) return this.delegate.count(where ? { where } : {});

    return (await this.find(query)).length;
  }

  async deleteMany(query = {}) {
    const where = buildWhere(query);
    if (where !== null) {
      const result = await this.delegate.deleteMany(where ? { where } : {});
      return { deletedCount: result.count };
    }

    const documents = await this.find(query);
    if (documents.length === 0) return { deletedCount: 0 };

    const result = await this.delegate.deleteMany({
      where: { id: { in: documents.map(document => String(document._id)) } }
    });
    return { deletedCount: result.count };
  }
}

const collections = new Map();

function getCollection(prisma, name) {
  if (!collections.has(name)) {
    collections.set(name, new PrismaCollection(prisma, name));
  }
  return collections.get(name);
}

module.exports = { getCollection };
