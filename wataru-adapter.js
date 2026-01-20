export async function adaptRequest(c) {
    const url = new URL(c.req.url);
    const query = {};
    url.searchParams.forEach((value, key) => {
        query[key] = value;
    });

    // Basic mock of Express Request object
    // Existing routes mostly use req.query. Some might use req.body or req.params.
    // We'll populate as needed.
    let body = {};
    if (c.req.method !== 'GET' && c.req.method !== 'HEAD') {
        try {
            body = await c.req.parseBody(); // handles creating body object form data or json
        } catch (e) {
            // ignore if no body
        }
    }

    // Also try to get JSON body if parseBody handled form data or failed essentially
    if (Object.keys(body).length === 0 && c.req.header('content-type')?.includes('application/json')) {
        try {
            body = await c.req.json();
        } catch (e) {
            // ignore
        }
    }


    return {
        query,
        body,
        params: c.req.param(),
        url: c.req.url,
        method: c.req.method,
        headers: c.req.header(),
        get: (headerName) => c.req.header(headerName),
        // specific to some routes that might check protocol/host
        protocol: url.protocol.replace(':', ''),
        get host() { return url.host; },
        originalUrl: url.pathname + url.search
    };
}

export function createResponse(c) {
    let responseData = null;
    let responseStatus = 200;
    let responseHeaders = {};
    let responseEnd = false; // flag to know if response is finished

    const res = {
        status: (code) => {
            responseStatus = code;
            return res; // chainable
        },
        json: (data) => {
            if (responseEnd) return;
            responseData = JSON.stringify(data);
            responseHeaders['content-type'] = 'application/json';
            responseEnd = true;
            return res;
        },
        send: (data) => {
            if (responseEnd) return;
            responseData = data;
            // try to detect content type if object
            if (typeof data === 'object') {
                responseData = JSON.stringify(data);
                responseHeaders['content-type'] = 'application/json';
            } else {
                responseHeaders['content-type'] = 'text/html'; // default to html for send? or plain text
            }
            responseEnd = true;
            return res;
        },
        end: (data) => {
            if (responseEnd) return;
            if (data) responseData = data;
            responseEnd = true;
            return res;
        },
        setHeader: (key, value) => {
            responseHeaders[key] = value;
            return res;
        },
        writeHead: (status, headers) => {
            responseStatus = status;
            if (headers) {
                Object.assign(responseHeaders, headers);
            }
            return res;
        },
        // Helper to get the final Response object for Hono to return
        _getResponse: () => {
            if (!responseData && !responseEnd) {
                // If nothing sent yet, maybe just return 200 OK empty?
                // Or wait? But our route handlers are sync or async and call res.json() eventually.
                // If async, we await them in worker.js.
                return c.text('', responseStatus);
            }
            return c.body(responseData, responseStatus, responseHeaders);
        }
    };

    return res;
}
