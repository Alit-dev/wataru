import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import { routes } from './routes';
import { adaptRequest, createResponse } from './wataru-adapter';
// We need settings to be available. In Worker, we can import JSON if supported or hardcode defaults.
// For now, let's try to import it. If it fails due to bundle issues, we might need a workaround.
import settings from './settings.json';

const app = new Hono();

// Global settings
const globalSettings = settings || {};

// Middleware to augment JSON responses (from index.js)
// Hono doesn't easily intercept res.json() like Express middleware did in the same way,
// but our adapter handles res.json, so we can wrap the adapter logic or just modify the data structure in our route handler wrapper.
// Actually, the original index.js middleware monkey-patched res.json.
// We can do similar in our adapter or wrapper.

// Register all routes
routes.forEach(module => {
    if (!module.meta || !module.onStart) return;

    const method = (module.meta.method || 'get').toLowerCase();
    // Express routes might have regex or advanced patterns, but most here seem simple.
    // Using Hono's routing.
    // Note: module.meta.path might contain query params example like /spotifydl?url=
    // We need to strip that for the route definition.
    const pathPart = module.meta.path.split('?')[0];
    const routePath = '/api' + pathPart;

    console.log(`Registering ${method.toUpperCase()} ${routePath}`);

    app[method](routePath, async (c) => {
        const req = await adaptRequest(c);
        const res = createResponse(c);

        // Monkey-patch res.json to add operator info (from index.js)
        const originalJson = res.json;
        res.json = function (data) {
            if (data && typeof data === 'object') {
                const responseData = {
                    status: data.status, // preserve if exists
                    operator: (globalSettings.apiSettings && globalSettings.apiSettings.operator) || "Created Using Rynn UI",
                    ...data
                };
                return originalJson.call(this, responseData);
            }
            return originalJson.call(this, data);
        };

        try {
            await module.onStart({ req, res });
        } catch (err) {
            console.error(err);
            return c.json({ error: err.message }, 500);
        }

        return res._getResponse();
    });
});

// API Info Endpoint
app.get('/api/info', (c) => {
    const categories = {};
    routes.forEach(module => {
        if (!module.meta) return;
        const cat = module.meta.category;
        if (!categories[cat]) {
            categories[cat] = { name: cat, items: [] };
        }
        const pathPart = module.meta.path.split('?')[0];
        const routePath = '/api' + pathPart;

        categories[cat].items.push({
            name: module.meta.name,
            desc: module.meta.description,
            path: '/api' + module.meta.path, // Keeps the query param hint in the description path
            author: module.meta.author,
            method: module.meta.method || 'get'
        });
    });
    return c.json({ categories: Object.values(categories) });
});

// Static files (web folder)
// In Cloudflare Workers, we usually use Cloudflare Pages or KV for static assets.
// But valid Hono way for small assets in Worker sites:
app.get('/*', serveStatic({ root: './web' }));

// 404
app.notFound((c) => {
    return c.text('404 Not Found', 404);
});

export default app;
