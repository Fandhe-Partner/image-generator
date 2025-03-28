import React from 'react';
import { 
  createBrowserRouter, 
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate
} from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Loading from './components/Loading';
import Root from './routes/root';

const Index = lazy(() => import('./routes/_index'));
const LgtmGenerator = lazy(() => import('./routes/lgtm'));
const NotFound = lazy(() => import('./pages/NotFound'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={
        <Suspense fallback={<Loading />}>
          <Index />
        </Suspense>
      } />
      <Route path="lgtm" element={
        <Suspense fallback={<Loading />}>
          <LgtmGenerator />
        </Suspense>
      } />
      <Route path="404" element={
        <Suspense fallback={<Loading />}>
          <NotFound />
        </Suspense>
      } />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Route>
  ),
  { basename: "/image-generator" }
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
