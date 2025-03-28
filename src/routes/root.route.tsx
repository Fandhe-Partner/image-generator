import React from 'react';
import { RouteObject } from 'react-router-dom';
import Root from './root';

export const rootRoute: RouteObject = {
  path: '/',
  element: <Root />,
  children: [] // Children will be added in the main routes configuration
};

export default rootRoute;
