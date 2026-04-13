import React from 'react';
import { render, screen } from '@testing-library/react';
import ProtectedRoute from './ProtectedRoute';
import { AuthContext } from './context/AuthContext';

const renderProtectedRoute = (user) => {
  render(
    <AuthContext.Provider value={{ user }}>
      <ProtectedRoute role="admin">
        <div>Admin Dashboard</div>
      </ProtectedRoute>
    </AuthContext.Provider>
  );
};

test('redirects unauthenticated users to login', () => {
  renderProtectedRoute(null);

  expect(screen.getByTestId('navigate')).toHaveTextContent('/login');
});

test('redirects users without the required role to unauthorized', () => {
  renderProtectedRoute({ role: 'viewer' });

  expect(screen.getByTestId('navigate')).toHaveTextContent('/unauthorized');
});

test('allows authenticated users with the required role to access the route', () => {
  renderProtectedRoute({ role: 'admin' });

  expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
});
