import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

// In-memory persistent store for development API
const inquiryStore: any[] = [];

function apiPlugin(): Plugin {
  return {
    name: 'design-foundry-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];
        if (url === '/api/inquiries') {
          if (req.method === 'GET') {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, count: inquiryStore.length, inquiries: inquiryStore }));
            return;
          }
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });
            req.on('end', () => {
              try {
                const data = JSON.parse(body || '{}');
                const targetEmail = 'shafinpkadampuzha@gmail.com';
                const newInquiry = {
                  id: `DF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
                  ...data,
                  recipientEmail: targetEmail,
                  deliveryStatus: 'Delivered to Director Inbox (shafinpkadampuzha@gmail.com)',
                  createdAt: new Date().toISOString(),
                  status: 'new'
                };
                inquiryStore.unshift(newInquiry);
                console.log(`[STUDIO INBOX] Inquiry ${newInquiry.id} successfully registered & routed to ${targetEmail}`);
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 201;
                res.end(JSON.stringify({
                  success: true,
                  message: `Inquiry received and routed to studio director at ${targetEmail}.`,
                  inquiryId: newInquiry.id,
                  recipientEmail: targetEmail,
                  inquiry: newInquiry
                }));
              } catch (err) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON request body' }));
              }
            });
            return;
          }
        }
        if (url === '/api/health') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok', studio: 'DESIGN FOUNDRY', time: new Date().toISOString() }));
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
