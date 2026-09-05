const models = require('../models');
const { getSeedData } = require('../data/seedData');

async function seedDatabase() {
  try {
    const userCount = await models.User.countDocuments();
    if (userCount > 0) {
      console.log('Database already initialized with data.');
      return;
    }

    console.log('🌱 Initializing database with full NK SkillEdge PRD seed data...');
    const seed = await getSeedData();

    // 1. Seed Users
    for (const u of seed.users) {
      await models.User.create(u);
    }
    // 2. Site settings & stats
    for (const s of seed.site_settings) {
      await models.SiteSetting.create(s);
    }
    // 3. Team members & Leadership
    for (const l of seed.leadership) {
      await models.TeamMember.create({ ...l, isLeadership: true });
    }
    for (const t of seed.team_members) {
      await models.TeamMember.create({ ...t, isLeadership: false });
    }
    // 4. Services
    for (const s of seed.services) {
      await models.Service.create(s);
    }
    // 5. Training Programs
    for (const p of seed.programs) {
      await models.Program.create(p);
    }
    // 6. Projects
    for (const p of seed.projects) {
      await models.Project.create(p);
    }
    // 7. Clients
    for (const c of seed.clients) {
      await models.Client.create(c);
    }
    // 8. Testimonials
    for (const t of seed.testimonials) {
      await models.Testimonial.create(t);
    }
    // 9. Success Stories
    for (const ss of seed.success_stories) {
      await models.SuccessStory.create(ss);
    }
    // 10. Blogs
    for (const b of seed.blogs) {
      await models.BlogPost.create(b);
    }
    // 11. Events
    for (const e of seed.events) {
      await models.Event.create(e);
    }
    // 12. Jobs
    for (const j of seed.jobs) {
      await models.JobOpening.create(j);
    }
    // 13. FAQs
    for (const f of seed.faqs) {
      await models.FAQ.create(f);
    }
    // 14. Certifications
    for (const c of seed.certifications) {
      await models.Certification.create(c);
    }
    // 15. Verifiable Certificates
    for (const cr of seed.certificates) {
      await models.Certificate.create(cr);
    }
    // 16. Branches
    if (seed.branches) {
      for (const br of seed.branches) {
        await models.Branch.create(br);
      }
    }
    // 17. Media Assets
    if (seed.media) {
      for (const m of seed.media) {
        await models.Media.create(m);
      }
    }

    console.log('✅ Seed data successfully imported!');
  } catch (err) {
    console.error('❌ Error seeding database:', err);
  }
}

module.exports = {
  seedDatabase
};
