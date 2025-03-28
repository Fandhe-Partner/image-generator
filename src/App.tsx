import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const LgtmGenerator = lazy(() => import('./pages/LgtmGenerator'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <Router basename="/image-generator">
      <Navbar />
      <main className="container">
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lgtm" element={<LgtmGenerator />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
