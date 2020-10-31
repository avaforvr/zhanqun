// server.js
const {createServer} = require('http')
const {parse} = require('url')
const next = require('./next-vv/dist/server/next')
const fs = require('fs-extra');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production'
const app = next({dev}); // app为 next-vv\dist\next-server\server\next-server.js 的一个实例

const PROJECT_ROOT = process.cwd();

app.prepare().then(() => {
    createServer((req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const fullUrl = (req.connection.encrypted ? 'https' : 'http') + '://' + req.headers.host + req.url;
        const parsedUrl = parse(fullUrl, true)
        const {pathname, query} = parsedUrl
        const host = req.headers.host;
        const hostsConfig = JSON.parse(fs.readFileSync(path.resolve(PROJECT_ROOT, 'hosts-config.json'), 'utf-8'));
        if (hostsConfig[host]) {
            query.__appDistDir = `./${hostsConfig[host].template}${pathname}`;
        } else {
            query.__appDistDir = './base';
            res.end(`${host} has not configured`);
        }

        if (pathname === '/ha') {
            app.render(req, res, '/home', query)
        } else {
            app.render(req, res, parsedUrl.pathname, query)
        }
    }).listen(3000, (err) => {
        if (err) throw err
        console.log('> Ready on http://localhost:3000')
    })
})
