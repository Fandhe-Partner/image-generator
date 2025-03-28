import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './NotFound.css';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>{t('notFound')}</h2>
      <Link to="/" className="back-button">{t('backToHome')}</Link>
    </div>
  );
};

export default NotFound;
