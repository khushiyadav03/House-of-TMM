const BASE_URL = 'http://localhost:3000';
const ADMIN_TOKEN = btoa(JSON.stringify({admin: true, username: 'admin', timestamp: Date.now(), expires: Date.now() + (24 * 60 * 60 * 1000)}));
const headers = {'Content-Type': 'application/json', 'x-admin-token': ADMIN_TOKEN};

async function publishAll() {
  // Publish articles
  const articlesRes = await fetch(`${BASE_URL}/api/articles?limit=1000&status=draft`, {headers});
  const {articles} = await articlesRes.json();
  for (const article of articles) {
    await fetch(`${BASE_URL}/api/articles`, {method: 'PUT', headers, body: JSON.stringify({...article, status: 'published'})});
  }
  console.log(`Published ${articles.length} articles`);

  // Publish magazines
  const magazinesRes = await fetch(`${BASE_URL}/api/magazines?status=draft`, {headers});
  const magazines = await magazinesRes.json();
  for (const mag of magazines) {
    await fetch(`${BASE_URL}/api/magazines/${mag.id}`, {method: 'PUT', headers, body: JSON.stringify({...mag, status: 'published'})});
  }
  console.log(`Published ${magazines.length} magazines`);

  // Publish other items if needed
  // Add similar for brand images, cover photos, etc., setting is_active or status to true/published
}

publishAll().catch(console.error);