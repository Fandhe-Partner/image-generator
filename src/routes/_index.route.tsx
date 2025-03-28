import React from 'react';
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import Loading from '../components/Loading';

const IndexPage = lazy(() => import('./_index'));

export const indexRoute: RouteObject = {
  index: true,
  element: <Suspense fallback={<Loading />}>
    <IndexPage />
  </Suspense>
};

export default indexRoute;
