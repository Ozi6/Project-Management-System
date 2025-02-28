import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const ProjectManagement = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    Project Management Features
                </h1>
                {/* Add your content here */}
            </main>
            <Footer />
        </div>
    );
};

export default ProjectManagement;