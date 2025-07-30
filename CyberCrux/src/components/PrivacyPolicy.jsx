import React from "react";
import DashNav from "./DashNav";
import Footer from "./Footer";
import { FaShieldAlt } from "react-icons/fa";

export default function PrivacyPolicy() {
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
            Privacy Policy
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
            Your privacy is important to us. This policy explains how CyberCrux collects, uses, and protects your information.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 md:p-12">
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed">This Privacy Policy describes how CyberCrux collects, uses, and safeguards your personal information when you use our platform.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">2. Information We Collect</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 leading-relaxed">
                <li>Information you provide during registration (e.g., name, email address).</li>
                <li>Usage data, such as pages visited, features used, and time spent on the platform.</li>
                <li>Technical data, such as IP address, browser type, and device information.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">3. How We Use Information</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 leading-relaxed">
                <li>To provide and improve our services.</li>
                <li>To personalize your experience and deliver relevant content.</li>
                <li>To communicate with you about updates, features, and support.</li>
                <li>To ensure the security and integrity of our platform.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">4. Cookies</h2>
              <p className="text-gray-300 leading-relaxed">CyberCrux uses cookies and similar technologies to enhance your experience, analyze usage, and deliver personalized content. You can manage your cookie preferences in your browser settings.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">5. Data Security</h2>
              <p className="text-gray-300 leading-relaxed">We implement industry-standard security measures to protect your information. However, no method of transmission over the internet is 100% secure.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">6. Third-Party Links</h2>
              <p className="text-gray-300 leading-relaxed">Our platform may contain links to third-party websites. We are not responsible for the privacy practices or content of those sites.</p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">7. Your Rights</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2 leading-relaxed">
                <li>You may access, update, or delete your personal information at any time.</li>
                <li>You may opt out of marketing communications.</li>
                <li>Contact us for any privacy-related requests or questions.</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">8. Changes to Policy</h2>
              <p className="text-gray-300 leading-relaxed">We may update this Privacy Policy from time to time. Continued use of the platform after changes constitutes acceptance of the new policy.</p>
            </section>
            
            <section className="mb-4">
              <h2 className="text-2xl font-bold mb-4 text-white">9. Contact</h2>
              <p className="text-gray-300 leading-relaxed">If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:support@cybercrux.com" className="text-blue-400 hover:text-blue-300 transition-colors underline">support@cybercrux.com</a>.</p>
            </section>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
} 