import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="home-container">
      <h1>{t('welcomeMessage')}</h1>
      <p>{t('homeDescription')}</p>
      <div className="generators-grid">
        <Link to="/lgtm" className="generator-card">
          <h2>{t('lgtm')}</h2>
          <p>LGTM = &quot;Looks Good To Me&quot;</p>
        </Link>
        {/* Future generators will be added here */}
      </div>
    </div>
  );
};

export default Home;
