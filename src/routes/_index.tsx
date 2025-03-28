import React from "react";
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Index() {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-center mb-6">{t('welcomeMessage')}</h1>
      <p className="text-lg text-center mb-8">{t('homeDescription')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/lgtm" className="block p-6 bg-white shadow-md hover:shadow-lg rounded-lg transition-shadow">
          <h2 className="text-xl font-bold mb-2">{t('lgtm')}</h2>
          <p className="text-gray-600">LGTM = &quot;Looks Good To Me&quot;</p>
        </Link>
        {/* Future generators will be added here */}
      </div>
    </div>
  );
}
