// frontend/src/utils/__tests__/api.test.ts
import { apiRequest, api } from '../api';
import { server } from '../../test/server';
import { rest } from 'msw';

describe('API Utils', () => {
  describe('apiRequest', () => {
    it('should make successful API request', async () => {
      const response = await apiRequest('/health');
      
      expect(response.status).toBe('ok');
      expect(response.environment).toBe('test');
    });

    it('should handle 401 unauthorized errors', async () => {
      server.use(
        rest.get('*/api/v1/unauthorized', (req, res, ctx) => {
          return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }));
        })
      );

      await expect(apiRequest('/unauthorized')).rejects.toThrow('Unauthorized');
    });

    it('should handle network errors', async () => {
      server.use(
        rest.get('*/api/v1/network-error', (req, res, ctx) => {
          return res.networkError('Network connection failed');
        })
      );

      await expect(apiRequest('/network-error')).rejects.toThrow('Network error');
    });

    it('should include authorization header when token exists', async () => {
      // Mock localStorage
      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockReturnValue('test-token');

      server.use(
        rest.get('*/api/v1/protected', (req, res, ctx) => {
          const authHeader = req.headers.get('Authorization');
          if (authHeader === 'Bearer test-token') {
            return res(ctx.status(200), ctx.json({ success: true }));
          }
          return res(ctx.status(401), ctx.json({ message: 'Unauthorized' }));
        })
      );

      const response = await apiRequest('/protected');
      expect(response.success).toBe(true);

      getItemSpy.mockRestore();
    });
  });

  describe('auth API', () => {
    it('should login successfully', async () => {
      const response = await api.auth.login('test@example.com', 'password');
      
      expect(response.accessToken).toBe('mock-access-token');
      expect(response.user.email).toBe('test@example.com');
    });

    it('should register successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password',
        firstName: 'New',
        lastName: 'User',
      };

      const response = await api.auth.register(userData);
      
      expect(response.accessToken).toBe('mock-access-token');
      expect(response.user.email).toBe('newuser@example.com');
    });

    it('should get user profile', async () => {
      // Mock token in localStorage
      const getItemSpy = jest.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockReturnValue('mock-access-token');

      const response = await api.auth.profile();
      
      expect(response.success).toBe(true);
      expect(response.data.email).toBe('test@example.com');

      getItemSpy.mockRestore();
    });
  });

  describe('users API', () => {
    it('should get user profile', async () => {
      const response = await api.users.getProfile();
      
      expect(response.email).toBe('test@example.com');
      expect(response.role).toBe('client');
    });

    it('should update user profile', async () => {
      server.use(
        rest.put('*/api/v1/users/profile', (req, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              id: '1',
              email: 'updated@example.com',
              firstName: 'Updated',
              lastName: 'User',
            })
          );
        })
      );

      const userData = {
        firstName: 'Updated',
        lastName: 'User',
        email: 'updated@example.com',
      };

      const response = await api.users.updateProfile(userData);
      
      expect(response.email).toBe('updated@example.com');
      expect(response.firstName).toBe('Updated');
    });
  });

  describe('bookings API', () => {
    it('should get user bookings', async () => {
      const response = await api.bookings.myBookings();
      
      expect(Array.isArray(response)).toBe(true);
      expect(response[0].serviceType).toBe('health-assessment');
    });

    it('should create new booking', async () => {
      const bookingData = {
        serviceType: 'health-assessment',
        scheduledDate: '2024-01-20',
        scheduledTime: '14:00',
      };

      const response = await api.bookings.create(bookingData);
      
      expect(response.serviceType).toBe('health-assessment');
      expect(response.status).toBe('pending');
    });
  });
});