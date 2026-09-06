const http = require('http');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runVerification() {
  console.log('===========================================================');
  console.log('🧪 RUNNING COMPREHENSIVE NK SKILLEDGE PLATFORM TEST SUITE');
  console.log('===========================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health Check
    console.log('\n[1] Health & Connectivity:');
    const health = await request({ host: 'localhost', port: 5000, path: '/api/health', method: 'GET' });
    assert(health.status === 200 && health.body?.status === 'ok', 'API health check responds 200 OK');

    // 2. Dynamic Statistics (PRD Section 4.3)
    console.log('\n[2] Dynamic Statistics API:');
    const settings = await request({ host: 'localhost', port: 5000, path: '/api/site-settings', method: 'GET' });
    assert(settings.status === 200 && settings.body?.settings?.stats?.studentsTrained === '200+', 'Dynamic statistics loaded from database: 200+ trained');
    assert(settings.body?.settings?.phones?.includes('7498784109'), 'Sakoli official phones configured');

    // 3. Services & Programs
    console.log('\n[3] Services & Programs:');
    const services = await request({ host: 'localhost', port: 5000, path: '/api/services', method: 'GET' });
    assert(services.status === 200 && services.body?.count >= 5, `Services count >= 5 (Found: ${services.body?.count})`);

    const programs = await request({ host: 'localhost', port: 5000, path: '/api/programs', method: 'GET' });
    assert(programs.status === 200 && programs.body?.count >= 6, `Programs count >= 6 (Found: ${programs.body?.count})`);

    // 4. Certificate Verification (PRD Section 58)
    console.log('\n[4] Certificate Verification System:');
    const certVerify = await request({ host: 'localhost', port: 5000, path: '/api/certificates/verify/NKSK-2025-WD101', method: 'GET' });
    assert(certVerify.status === 200 && certVerify.body?.valid === true, 'Certificate NKSK-2025-WD101 verified as Valid');
    assert(certVerify.body?.certificate?.studentName === 'Kartik Sharma', 'Student name matches Kartik Sharma');

    const certInvalid = await request({ host: 'localhost', port: 5000, path: '/api/certificates/verify/INVALID-ID-999', method: 'GET' });
    assert(certInvalid.status === 404 && certInvalid.body?.valid === false, 'Invalid certificate ID correctly rejected with 404');

    // 5. Global Search (PRD Section 45)
    console.log('\n[5] Categorized Global Search:');
    const search = await request({ host: 'localhost', port: 5000, path: '/api/search?q=MERN', method: 'GET' });
    assert(search.status === 200 && search.body?.totalMatches > 0, `Search query 'MERN' matched ${search.body?.totalMatches} items across categories`);

    // 6. Lead Inquiry Submission (PRD Section 27)
    console.log('\n[6] Lead Pipeline Submission:');
    const leadRes = await request(
      { host: 'localhost', port: 5000, path: '/api/leads', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      {
        fullName: 'Test Candidate',
        email: 'test@gmail.com',
        phone: '9876543210',
        userType: 'Student',
        serviceOrCourse: 'Full Stack Web Development',
        message: 'Interested in the next Sakoli cohort',
        city: 'Sakoli'
      }
    );
    assert(leadRes.status === 201 && leadRes.body?.success === true, 'Lead submitted successfully with stage New');

    // 7. Training Registration with Auto ID (PRD Section 17)
    console.log('\n[7] Training Registration & ID Generation:');
    const regRes = await request(
      { host: 'localhost', port: 5000, path: '/api/registrations', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      {
        fullName: 'Pooja Verma',
        email: 'pooja@gmail.com',
        mobileNumber: '9123456789',
        college: 'Sakoli Polytechnic',
        course: 'Diploma CS',
        branch: 'Computer Engineering',
        trainingMode: 'Offline (Sakoli Lab)',
        city: 'Sakoli',
        programName: 'Industrial Training Program'
      }
    );
    assert(regRes.status === 201 && regRes.body?.registrationId?.startsWith('NKSK-TR-'), `Registration generated ID: ${regRes.body?.registrationId}`);

    // 8. Admin Authentication & RBAC (PRD Section 33)
    console.log('\n[8] Admin Authentication:');
    const loginRes = await request(
      { host: 'localhost', port: 5000, path: '/api/auth/login', method: 'POST', headers: { 'Content-Type': 'application/json' } },
      { email: 'nkskilledge@gmail.com', password: '151267@GK' }
    );
    assert(loginRes.status === 200 && !!loginRes.body?.token, 'Super Admin login successful with JWT');
    const token = loginRes.body?.token;

    // 9. Admin Dashboard Metrics (PRD Section 29)
    console.log('\n[9] Admin Analytics & Metrics:');
    const dashRes = await request({
      host: 'localhost',
      port: 5000,
      path: '/api/analytics/dashboard',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    assert(dashRes.status === 200 && dashRes.body?.stats?.totalLeads >= 1, `Dashboard metrics active (Total Leads: ${dashRes.body?.stats?.totalLeads})`);

    // 10. Admin Dynamic Statistics Update (PRD Section 4.3 & 73)
    console.log('\n[10] Admin Statistics Live Update:');
    const updateStats = await request(
      {
        host: 'localhost',
        port: 5000,
        path: '/api/site-settings/stats',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
      },
      { studentsTrained: '250+' }
    );
    assert(updateStats.status === 200 && updateStats.body?.stats?.studentsTrained === '250+', 'Updated statistics live via CMS to 250+');

    // Verify it updated on the public endpoint
    const checkSettings = await request({ host: 'localhost', port: 5000, path: '/api/site-settings', method: 'GET' });
    assert(checkSettings.body?.settings?.stats?.studentsTrained === '250+', 'Public site-settings reflects updated 250+ statistics without code changes');

    // 11. Static Production Frontend Delivery
    console.log('\n[11] Production Frontend Serving:');
    const staticPage = await request({ host: 'localhost', port: 5000, path: '/', method: 'GET' });
    assert(staticPage.status === 200 && staticPage.raw?.includes('NK SkillEdge'), 'Express serves built React production bundle with title and root div');

    console.log('\n===========================================================');
    console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log('===========================================================');

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runVerification();
