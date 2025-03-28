import React from 'react';
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import Loading from '../components/Loading';

const NotFoundPage = lazy(() => import('../pages/NotFound'));

export const notFoundRoute: RouteObject = {
  path: '404',
  element: <Suspense fallback={<Loading />}>
    <NotFoundPage />
  </Suspense>
};

export default notFoundRoute;
