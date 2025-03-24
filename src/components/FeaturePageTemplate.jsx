import React from 'react';
import Header from './Header';
import Footer from './Footer';

const FeaturePageTemplate = ({ title, description, children }) => {
    return (
        <div className="min-h-screen bg-[var(--loginpage-bg2)]">
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-12 ">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4"
                        style={{color: "var(--features-title-color)"}}
                    >{title}</h1>
                    <p className="text-xl text-[var(--features-text-color)] max-w-3xl mx-auto">{description}</p>
                </div>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default FeaturePageTemplate;