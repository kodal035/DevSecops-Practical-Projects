const jwt = require('jsonwebtoken');
const { verifyToken, isAdmin } = require('./auth');

describe('auth middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { headers: {}, user: undefined };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('verifyToken', () => {
    test('returns 401 when authorization header is missing', () => {
      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
      expect(next).not.toHaveBeenCalled();
    });

    test('returns 401 when token is invalid', () => {
      req.headers.authorization = 'Bearer invalid-token';

      verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });

    test('calls next and sets req.user when token is valid', () => {
      const payload = { id: 1, role: 'admin' };
      const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey');
      req.headers.authorization = `Bearer ${token}`;

      verifyToken(req, res, next);

      expect(req.user.id).toBe(payload.id);
      expect(req.user.role).toBe(payload.role);
      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('isAdmin', () => {
    test('returns 403 for non-admin users', () => {
      req.user = { role: 'viewer' };

      isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied: Admins only' });
      expect(next).not.toHaveBeenCalled();
    });

    test('calls next for admin users', () => {
      req.user = { role: 'admin' };

      isAdmin(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
