import React from 'react';
import { RouteObject } from 'react-router-dom';
import rootRoute from './routes/root.route';
import indexRoute from './routes/_index.route';
import lgtmRoute from './routes/lgtm.route';
import notFoundRoute from './routes/notfound.route';
import { Navigate } from 'react-router-dom';

const catchAllRoute: RouteObject = {
  path: '*',
  element: <Navigate to="/404" replace />
};

rootRoute.children = [
  indexRoute,
  lgtmRoute,
  notFoundRoute,
  catchAllRoute
];

const routes: RouteObject[] = [rootRoute];

export default routes;
