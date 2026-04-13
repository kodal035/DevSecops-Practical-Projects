// jest-dom adds custom jest matchers for asserting on DOM nodes
// https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react';

// Mock react-router-dom to prevent module resolution errors in tests
jest.mock('react-router-dom', () => ({
  Navigate: ({ to }) => <div data-testid="navigate">{to}</div>,
}));