import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from './routes';

const router = createBrowserRouter(routes, {
  basename: "/image-generator"
});

function App() {
  return <RouterProvider router={router} />;
}

export default App;
