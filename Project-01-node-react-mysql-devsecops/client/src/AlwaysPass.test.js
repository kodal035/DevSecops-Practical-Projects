import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { AuthContext } from './context/AuthContext';

const renderProtectedRoute = (user) => {
  render(
    <AuthContext.Provider value={{ user }}>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/unauthorized" element={<div>Unauthorized Page</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="admin">
                <div>Admin Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

test('redirects unauthenticated users to login', () => {
  renderProtectedRoute(null);

  expect(screen.getByText('Login Page')).toBeInTheDocument();
});

test('redirects users without the required role to unauthorized', () => {
  renderProtectedRoute({ role: 'viewer' });

  expect(screen.getByText('Unauthorized Page')).toBeInTheDocument();
});

test('allows authenticated users with the required role to access the route', () => {
  renderProtectedRoute({ role: 'admin' });

  expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
});
