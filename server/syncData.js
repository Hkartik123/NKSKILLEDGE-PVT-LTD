const { getSeedData } = require('./data/seedData');
const { getCollection } = require('./config/store');

async function sync() {
  console.log('Syncing official assets and images into persistent store...');
  const seed = await getSeedData();

  // 1. Update site_settings
  const settingsCol = getCollection('site_settings');
  await settingsCol.deleteMany({});
  for (const s of seed.site_settings) {
    await settingsCol.create(s);
  }
  console.log('Site settings updated with official logo.');

  // 2. Update team_members (Leadership & Team)
  const teamCol = getCollection('team_members');
  await teamCol.deleteMany({});
  for (const l of seed.leadership) {
    await teamCol.create(l);
  }
  for (const t of seed.team_members) {
    await teamCol.create(t);
  }
  console.log('Leadership & team members updated with official photos.');

  // 3. Update certifications
  const certCol = getCollection('certifications');
  await certCol.deleteMany({});
  for (const c of seed.certifications) {
    await certCol.create(c);
  }
  console.log('Certifications updated with official badges (MSME, ISO, Gov, GST).');

  // 4. Update services
  const srvCol = getCollection('services');
  await srvCol.deleteMany({});
  for (const s of seed.services) {
    await srvCol.create(s);
  }
  console.log('Services updated with official images.');

  // 5. Update programs
  const prgCol = getCollection('programs');
  await prgCol.deleteMany({});
  for (const p of seed.programs) {
    await prgCol.create(p);
  }
  console.log('Programs updated with official detail images.');

  // 6. Update branches
  const branchCol = getCollection('branches');
  await branchCol.deleteMany({});
  if (seed.branches) {
    for (const b of seed.branches) {
      await branchCol.create(b);
    }
  }
  console.log('Branches updated with Sakoli, Nagpur, and Gondia locations.');

  // 7. Update media
  const mediaCol = getCollection('media');
  await mediaCol.deleteMany({});
  if (seed.media) {
    for (const m of seed.media) {
      await mediaCol.create(m);
    }
  }
  console.log('Media library initialized with official brand and team assets.');

  console.log('All store collections successfully updated!');
}

sync();
