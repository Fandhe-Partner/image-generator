import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navbar = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ja' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav className="flex items-center justify-between bg-gray-800 text-white p-4">
      <div className="text-xl font-bold">
        <NavLink to="/" className="hover:text-blue-300">{t('title')}</NavLink>
      </div>
      <div className="flex space-x-4">
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            isActive 
              ? 'text-blue-300 font-medium' 
              : 'text-white hover:text-blue-300'
          }
        >
          {t('home')}
        </NavLink>
        <NavLink 
          to="/lgtm" 
          className={({ isActive }) => 
            isActive 
              ? 'text-blue-300 font-medium' 
              : 'text-white hover:text-blue-300'
          }
        >
          {t('lgtm')}
        </NavLink>
      </div>
      <button 
        onClick={changeLanguage} 
        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
      >
        {i18n.language === 'en' ? '日本語' : 'English'}
      </button>
    </nav>
  );
};

export default Navbar;
