import React from 'react';
import { lazy, Suspense } from 'react';
import { RouteObject } from 'react-router-dom';
import Loading from '../components/Loading';

const LgtmGeneratorPage = lazy(() => import('./lgtm'));

export const lgtmRoute: RouteObject = {
  path: 'lgtm',
  element: <Suspense fallback={<Loading />}>
    <LgtmGeneratorPage />
  </Suspense>
};

export default lgtmRoute;
