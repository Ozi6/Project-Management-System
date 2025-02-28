import React from 'react';
import Header from './Header';
import Footer from './Footer';

const FeaturePageTemplate = ({ title, description, children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">{description}</p>
                </div>
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default FeaturePageTemplate;