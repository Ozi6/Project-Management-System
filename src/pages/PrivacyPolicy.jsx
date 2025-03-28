import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy = () => {
  const {t} = useTranslation();
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Header />
      <main className="flex-1 bg-[var(--bg-color)] pt-16">
        <div className="bg-[var(--features-icon-color)] text-[var(--bg-color)] py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">{t("PP")}</h1>
            <p className="text-xl">{t("PPd")}</p>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 py-12 bg-[var(--bg-color)] shadow-md rounded-md mt-8 mb-12">
          <p className="text-sm text-[var(--text-color3)] mb-8">{t("PP.update")}</p>
          
          <div className="prose max-w-none text-[var(--features-title-color)]">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t("PP1")}</h2>
              <p>
              {t("PP1d")}
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t("PP2")}</h2>
              <p>
              {t("PP2d")}
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>
                  <strong>{t("PP2.1")}</strong> {t("PP2.1d")}
                </li>
                <li>
                  <strong>{t("PP2.2")}</strong> {t("PP2.2d")}
                </li>
                <li>
                  <strong>{t("PP2.3")}</strong> {t("PP2.3d")}
                </li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t("PP3")}</h2>
              <p>{t("PP3d")}</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>{t("PP3.1")}</li>
                <li>{t("PP3.2")}</li>
                <li>{t("PP3.3")}</li>
                <li>{t("PP3.4")}</li>
                <li>{t("PP3.5")}</li>
                <li>{t("PP3.6")}</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t("PP4")}</h2>
              <p>
              {t("PP4d")}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">{t("PP5")}</h2>
              <p>
              {t("PP5d")}
                <br />
                <a href="mailto:planwise.team@outlook.com" className="text-[var(--features-icon-color)] hover:underline">
                  planwise.team@outlook.com
                </a>
              </p>
            </section>
          </div>
          
          <div className="mt-12 border-t border-gray-200 pt-6">
            <Link to="/" className="text-[var(--features-icon-color)] hover:underline">
              &larr; {t("ToS.return")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;