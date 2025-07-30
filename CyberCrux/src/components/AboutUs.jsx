import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import {
  BiBrain, BiMicrophone, BiMap, BiBookOpen, BiRocket, BiCheck, BiPlay, BiTrendingUp, BiShield, BiGroup} from 'react-icons/bi';
import { FaFire, FaUser, FaArrowRight, FaLinkedin, FaGithub, FaTwitter } from 'react-icons/fa';
import MainNav from "./MainNav";
import Footer from "./Footer";

const values = [
  {
    icon: <BiBrain className="text-4xl" />,
    title: "AI-Powered Learning",
    description: "Advanced AI explanations and voice interviews to make complex concepts simple.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: <BiShield className="text-4xl" />,
    title: "Interview-Focused",
    description: "Every feature designed to help you ace cybersecurity interviews and land your dream job.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: <BiRocket className="text-4xl" />,
    title: "Free Forever",
    description: "Access to all resources, books, and features completely free. No hidden costs.",
    color: "from-purple-600 to-purple-400"
  },
  {
    icon: <BiGroup className="text-4xl" />,
    title: "Community Driven",
    description: "Learn from peers, share knowledge, and grow together in our supportive community.",
    color: "from-yellow-500 to-orange-500"
  }
];

const team = [
  {
    name: "Hassan Ali",
    role: "Founder & Lead Developer",
    description: "Cybersecurity enthusiast and full-stack developer passionate.",
    image: "/src/assets/hacker.png",
    social: {
      linkedin: "https://www.linkedin.com/in/example-hassan",
      github: "https://github.com/example-hassan",
      twitter: "https://twitter.com/example_hassan"
    }
  },
  {
    name: "Ayesha Khan",
    role: "Community Manager",
    description: "Building a vibrant community of learners and connecting cybersecurity professionals worldwide.",
    image: "/src/assets/logo.png",
    social: {
      linkedin: "https://www.linkedin.com/in/example-ayesha",
      github: "https://github.com/example-ayesha",
      twitter: "https://twitter.com/example_ayesha"
    }
  },
  {
    name: "Usman Zafar",
    role: "CTF Designer",
    description: "Crafting real-world scenarios and hands-on labs to keep you sharp and interview-ready.",
    image: "/src/assets/hacker.png",
    social: {
      linkedin: "https://www.linkedin.com/in/example-usman",
      github: "https://github.com/example-usman",
      twitter: "https://twitter.com/example_usman"
    }
  },
  {
    name: "Sara Ahmed",
    role: "UI/UX Designer",
    description: "Creating beautiful, intuitive interfaces for the best learning and interview preparation experience.",
    image: "/src/assets/logo.png",
    social: {
      linkedin: "https://www.linkedin.com/in/example-sara",
      github: "https://github.com/example-sara",
      twitter: "https://twitter.com/example_sara"
    }
  }
];

const stats = [
  { label: 'Active Learners', value: '10,000+', icon: <FaUser className="text-2xl" /> },
  { label: 'Interview Questions', value: '500+', icon: <BiBrain className="text-2xl" /> },
  { label: 'Free Books', value: '50+', icon: <BiBookOpen className="text-2xl" /> },
  { label: 'Success Rate', value: '95%', icon: <BiTrendingUp className="text-2xl" /> }
];

export default function AboutUs() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-900 text-white">
      <MainNav />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 pb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              About CyberCrux
            </h1>
            <p className="text-xl md:text-1xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              We're on a mission to make cybersecurity interview preparation accessible, practical, and effective for students and professionals worldwide.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              {stats.map((stat, index) => (
                <div 
                  key={stat.label}
                  className={`bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/20 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="text-blue-300 mb-2 flex justify-center">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-b from-blue-950/60 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                CyberCrux was born from a simple observation: traditional cybersecurity education often fails to prepare students for real interview scenarios. We believe that interview success comes from practical experience, not just theoretical knowledge.
              </p>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Our platform combines scenario-based questions, AI-powered voice interviews, comprehensive roadmaps, hands-on labs, and free resources to create the ultimate interview preparation experience.
              </p>
              <div className="flex items-center gap-4">
                <BiCheck className="w-6 h-6 text-blue-400" />
                <span className="text-gray-300">Free forever, no hidden costs</span>
              </div>
              <div className="flex items-center gap-4">
                <BiCheck className="w-6 h-6 text-blue-400" />
                <span className="text-gray-300">AI-powered learning experience</span>
              </div>
              <div className="flex items-center gap-4">
                <BiCheck className="w-6 h-6 text-blue-400" />
                <span className="text-gray-300">Interview-focused curriculum</span>
              </div>
            </div>
            
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`} style={{ transitionDelay: '200ms' }}>
              <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">What Makes Us Different</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <BiMicrophone className="w-6 h-6 text-purple-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">Voice AI Interviews</h4>
                      <p className="text-gray-300 text-sm">Practice with realistic voice-based interviews</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <BiBrain className="w-6 h-6 text-blue-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">AI Explanations</h4>
                      <p className="text-gray-300 text-sm">Get instant, clear explanations for every concept</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <BiMap className="w-6 h-6 text-green-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">Complete Roadmaps</h4>
                      <p className="text-gray-300 text-sm">Step-by-step paths with all resources included</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <BiBookOpen className="w-6 h-6 text-yellow-400 mt-1" />
                    <div>
                      <h4 className="font-semibold text-white mb-1">Free Books</h4>
                      <p className="text-gray-300 text-sm">Download cybersecurity books completely free</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              These principles guide everything we do at CyberCrux
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={value.title}
                className={`group relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl text-center ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${value.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">{value.icon}</div>
          </div>
                <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
          </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-b from-blue-950/60 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Passionate cybersecurity professionals dedicated to your interview success
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div 
                key={member.name}
                className={`group relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 hover:shadow-2xl text-center ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <img src={member.image} alt={member.name} className="w-20 h-20 rounded-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <p className="text-blue-300 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-300 text-sm mb-6">{member.description}</p>
                <div className="flex justify-center gap-4">
                  <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-200 transition-colors">
                    <FaLinkedin className="text-xl" />
                  </a>
                  <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-200 transition-colors">
                    <FaGithub className="text-xl" />
                  </a>
                  <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-200 transition-colors">
                    <FaTwitter className="text-xl" />
                  </a>
            </div>
          </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-purple-900/60 to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Ace Your Cybersecurity Interview?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of students and professionals who trust CyberCrux for their interview preparation. Start your journey to cybersecurity success today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25"
              >
                <BiRocket className="inline w-6 h-6 mr-2" />
                Start Learning Free
              </Link>
              <Link
                to="/features"
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <BiPlay className="inline w-6 h-6 mr-2" />
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
