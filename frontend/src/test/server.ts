// frontend/src/test/server.ts
import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock API handlers
export const handlers = [
  // Health endpoint
  rest.get('*/api/v1/health', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: 123.45,
        version: '1.0.0',
        environment: 'test',
        database: 'connected',
        memory: {
          rss: '50.00 MB',
          heapTotal: '30.00 MB',
          heapUsed: '25.00 MB',
          external: '2.00 MB',
        },
      })
    );
  }),

  // Auth endpoints
  rest.post('*/api/v1/auth/login', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'client',
          status: 'active',
        },
        expiresIn: 3600,
      })
    );
  }),

  rest.post('*/api/v1/auth/register', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
        user: {
          id: '2',
          email: 'newuser@example.com',
          firstName: 'New',
          lastName: 'User',
          role: 'client',
          status: 'active',
        },
        expiresIn: 3600,
      })
    );
  }),

  rest.get('*/api/v1/auth/profile', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }));
    }

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          role: 'client',
          status: 'active',
        },
      })
    );
  }),

  // User endpoints
  rest.get('*/api/v1/users/profile', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'client',
        status: 'active',
      })
    );
  }),

  // Bookings endpoints
  rest.get('*/api/v1/bookings/my-bookings', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          serviceType: 'health-assessment',
          serviceName: 'Basic Health Assessment',
          scheduledDate: '2024-01-15',
          scheduledTime: '10:00',
          status: 'confirmed',
          totalPrice: 5000,
        },
      ])
    );
  }),

  rest.post('*/api/v1/bookings', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '2',
        serviceType: 'health-assessment',
        serviceName: 'Basic Health Assessment',
        scheduledDate: '2024-01-20',
        scheduledTime: '14:00',
        status: 'pending',
        totalPrice: 5000,
      })
    );
  }),

  // Company endpoints
  rest.get('*/api/v1/company/contact-info', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        phone: '+234-XXX-XXX-XXXX',
        email: 'info@royalhealthconsult.com',
        address: 'Lagos, Nigeria',
        hours: '24/7 Available',
      })
    );
  }),

  rest.get('*/api/v1/company/about', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        mission: 'To provide quality healthcare services',
        vision: 'Leading healthcare provider in Nigeria',
        values: ['Quality', 'Compassion', 'Excellence'],
      })
    );
  }),

  // Support endpoints
  rest.get('*/api/v1/support/faqs', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: '1',
          question: 'How do I book an appointment?',
          answer: 'You can book through our website or call us.',
          category: 'Booking',
        },
      ])
    );
  }),

  // Error handlers for testing error states
  rest.get('*/api/v1/error', (req, res, ctx) => {
    return res(ctx.status(500), ctx.json({ message: 'Internal Server Error' }));
  }),

  rest.get('*/api/v1/network-error', (req, res, ctx) => {
    return res.networkError('Network connection failed');
  }),
];

// Create server instance
export const server = setupServer(...handlers);