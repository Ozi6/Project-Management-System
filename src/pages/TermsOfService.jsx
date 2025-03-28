import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

const TermsOfService = () => {
  const {t} = useTranslation();
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12 bg-[var(--bg-color)]">
        <h1 className="text-3xl font-bold mb-6 text-[var(--features-icon-color)] ">{t("ToS")}</h1>
        <p className="text-sm text-[var(--features-text-color)] mb-8">{t("ToS.update")}</p>
        
        <div className="prose max-w-none text-[var(--features-title-color)] ">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. {t("ToS1")}</h2>
            <p>
            {t("ToS1d")}
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. {t("ToS2")}</h2>
            <p>
            {t("ToS2d")}
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>{t("ToS2.1")}</li>
              <li>{t("ToS2.2")}</li>
              <li>{t("ToS2.3")}</li>
              <li>{t("ToS2.4")}</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. {t("ToS3")}</h2>
            <p>
            {t("ToS3d")}
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>{t("ToS3.1")}</li>
              <li>
              {t("ToS3.2")}
              </li>
              <li>
              {t("ToS3.3")}
              </li>
              <li>
              {t("ToS3.4")}
              </li>
              <li>
              {t("ToS3.5")}
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. {t("ToS4")}</h2>
            <p>
            {t("ToS4d")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. {t("ToS5")}</h2>
            <p>
            {t("ToS5d")}
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>{t("ToS5.1")}</li>
              <li>
              {t("ToS5.2")}
              </li>
              <li>
              {t("ToS5.3")}
              </li>
              <li>
              {t("ToS5.4")}
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. {t("ToS6")}</h2>
            <p>
            {t("ToS6d")}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. {t("ToS7")}</h2>
            <p>
            {t("ToS7d")}
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
      <Footer />
    </>
  );
};

export default TermsOfService;