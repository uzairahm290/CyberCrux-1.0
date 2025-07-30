import React from "react";
import DashNav from "./DashNav";
import Footer from "./Footer";
import { FaShieldAlt } from "react-icons/fa";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <DashNav />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-96 h-96 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-96 h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 mb-6 shadow-lg">
            <FaShieldAlt className="text-white text-3xl" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Terms of Use
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Please read these terms carefully before using CyberCrux. By accessing or using our platform, you agree to these terms.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 md:p-12">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">Welcome to CyberCrux! By accessing or using our platform, you agree to comply with and be bound by these Terms of Use. Please read them carefully before using our services.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">2. User Responsibilities</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 leading-relaxed">
                <li>Provide accurate and up-to-date information during registration and use of the platform.</li>
                <li>Maintain the confidentiality of your account credentials.</li>
                <li>Use the platform for lawful and educational purposes only.</li>
                <li>Respect other users and contribute positively to the community.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">3. Prohibited Activities</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 leading-relaxed">
                <li>Engaging in any activity that is illegal, harmful, or violates the rights of others.</li>
                <li>Attempting to gain unauthorized access to other accounts or systems.</li>
                <li>Distributing malware, spam, or other malicious content.</li>
                <li>Using the platform to harass, threaten, or abuse others.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">4. Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed">All content, including text, graphics, logos, and software, is the property of CyberCrux or its licensors. You may not reproduce, distribute, or create derivative works without explicit permission.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">5. Disclaimers</h2>
              <p className="text-gray-300 leading-relaxed">CyberCrux provides its services "as is" and makes no warranties regarding the accuracy, reliability, or availability of the platform. Use the platform at your own risk.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">6. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">CyberCrux shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">7. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">We may update these Terms of Use from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
            </section>
            
            <section className="mb-4">
              <h2 className="text-2xl font-bold mb-4 text-white">8. Contact</h2>
              <p className="text-gray-300 leading-relaxed">If you have any questions or concerns about these Terms of Use, please contact us at <a href="mailto:support@cybercrux.com" className="text-blue-400 hover:text-blue-300 transition-colors underline">support@cybercrux.com</a>.</p>
            </section>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 