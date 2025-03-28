import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ja' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <NavLink to="/">{t('title')}</NavLink>
      </div>
      <div className="navbar-menu">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
          {t('home')}
        </NavLink>
        <NavLink to="/lgtm" className={({ isActive }) => isActive ? 'active' : ''}>
          {t('lgtm')}
        </NavLink>
      </div>
      <button onClick={changeLanguage} className="lang-button">
        {i18n.language === 'en' ? '日本語' : 'English'}
      </button>
    </nav>
  );
};

export default Navbar;
