import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BiBrain, BiMicrophone, BiMap, BiBookOpen, BiWrench, BiLaptop, BiCode, BiRocket, BiCheck, BiMedal, BiAward, BiPlay, BiTrendingUp, BiCrown, BiDiamond
} from 'react-icons/bi';
import { FaFire, FaUser, FaArrowRight } from 'react-icons/fa';
import MainNav from './MainNav';
import Footer from './Footer';

const features = [
  {
    id: 'scenarios',
    title: 'Scenario-Based Questions',
    subtitle: 'Real Interview Practice',
    description: 'Practice with realistic cybersecurity scenarios that mirror actual interview questions. Get instant AI explanations to understand every concept thoroughly.',
    icon: <BiBrain className="text-4xl" />,
    color: 'from-blue-600 to-cyan-500',
    features: [
      'Real-world interview scenarios',
      'Instant AI explanations',
      'Difficulty progression',
      'Performance tracking'
    ],
    route: '/practice',
    stats: { scenarios: '500+', categories: '20+', users: '10K+' }
  },
  {
    id: 'ai-interviews',
    title: 'Mock Voice AI Interviews',
    subtitle: 'Voice-Based Interview Practice',
    description: 'Practice with our advanced AI that simulates real interview environments through voice interactions. Build confidence for your actual interviews.',
    icon: <BiMicrophone className="text-4xl" />,
    color: 'from-purple-600 to-pink-500',
    features: [
      'Voice-based interviews',
      'Real-time AI feedback',
      'Industry-specific questions',
      'Confidence building'
    ],
    route: '/practice',
    stats: { sessions: '2K+', questions: '200+', success: '90%' }
  },
  {
    id: 'ai-explanations',
    title: 'AI Explanations',
    subtitle: 'Instant Understanding',
    description: 'Get clear, detailed explanations for every scenario and question. Our AI breaks down complex cybersecurity concepts into easy-to-understand explanations.',
    icon: <BiBrain className="text-4xl" />,
    color: 'from-green-600 to-emerald-500',
    features: [
      'Instant AI explanations',
      'Concept breakdowns',
      'Step-by-step guidance',
      'Learning reinforcement'
    ],
    route: '/practice',
    stats: { explanations: '1000+', concepts: '50+', clarity: '95%' }
  },
  {
    id: 'roadmaps',
    title: 'Learning Roadmaps',
    subtitle: 'Complete Guidelines & Resources',
    description: 'Follow structured learning paths with complete guidelines and resources. Know exactly where to get study material for every cybersecurity role.',
    icon: <BiMap className="text-4xl" />,
    color: 'from-indigo-600 to-purple-500',
    features: [
      'Complete study guidelines',
      'Resource recommendations',
      'Study material links',
      'Progress milestones'
    ],
    route: '/roadmap',
    stats: { paths: '15+', resources: '200+', success: '95%' }
  },
  {
    id: 'labs',
    title: 'Home Labs',
    subtitle: 'Build for Your Resume',
    description: 'Create practical cybersecurity labs that you can add to your resume. Step-by-step guides to build impressive projects that showcase your skills.',
    icon: <BiLaptop className="text-4xl" />,
    color: 'from-red-600 to-pink-500',
    features: [
      'Resume-worthy projects',
      'Step-by-step guides',
      'Real-world applications',
      'Portfolio building'
    ],
    route: '/labs',
    stats: { labs: '25+', projects: '50+', users: '12K+' }
  },
  {
    id: 'projects',
    title: 'Project Suggestions',
    subtitle: 'Resume Enhancement Ideas',
    description: 'Get project ideas that will make your resume stand out. From beginner to advanced, find projects that demonstrate your cybersecurity skills.',
    icon: <BiCode className="text-4xl" />,
    color: 'from-teal-600 to-cyan-500',
    features: [
      'Resume enhancement',
      'Skill demonstration',
      'Difficulty levels',
      'Implementation guides'
    ],
    route: '/projects',
    stats: { ideas: '100+', levels: '3', users: '15K+' }
  },
  {
    id: 'tools',
    title: 'Gamified Hands-on Tools',
    subtitle: 'Learn Tools Through Play',
    description: 'Master cybersecurity tools through gamified, hands-on experiences. Learn penetration testing and security tools in an interactive, engaging way.',
    icon: <BiWrench className="text-4xl" />,
    color: 'from-yellow-600 to-orange-500',
    features: [
      'Gamified learning',
      'Hands-on practice',
      'Interactive tutorials',
      'Real tool experience'
    ],
    route: '/tools',
    stats: { tools: '30+', tutorials: '100+', users: '8K+' }
  },
  {
    id: 'books',
    title: 'Free Cybersecurity Books',
    subtitle: 'Download Freely',
    description: 'Download top cybersecurity books and resources completely free. Build your knowledge base with curated materials from industry experts.',
    icon: <BiBookOpen className="text-4xl" />,
    color: 'from-amber-600 to-yellow-500',
    features: [
      'Free book downloads',
      'Curated collection',
      'Multiple formats',
      'Expert recommendations'
    ],
    route: '/books',
    stats: { books: '50+', authors: '100+', downloads: '25K+' }
  }
];

const gamificationFeatures = [
  {
    title: 'Learning Streaks',
    description: 'Build consistent learning habits with daily streaks and earn rewards for your dedication.',
    icon: <FaFire className="text-3xl" />,
    color: 'from-orange-500 to-red-500',
    stat: '🔥 7 Day Streak'
  },
  {
    title: 'Global Leaderboard',
    description: 'Compete with cybersecurity professionals worldwide and climb the global leaderboard.',
    icon: <BiMedal className="text-3xl" />,
    color: 'from-yellow-500 to-orange-500',
    stat: '🏆 #8 This Week'
  },
  {
    title: 'Achievements',
    description: 'Unlock badges and achievements as you progress through your cybersecurity journey.',
    icon: <BiAward className="text-3xl" />,
    color: 'from-purple-500 to-pink-500',
    stat: '⭐ 25 Badges'
  }
];

const stats = [
  { label: 'Active Learners', value: '10,000+', icon: <FaUser className="text-2xl" /> },
  { label: 'Interview Questions', value: '500+', icon: <BiBrain className="text-2xl" /> },
  { label: 'Free Books', value: '50+', icon: <BiBookOpen className="text-2xl" /> },
  { label: 'Success Rate', value: '95%', icon: <BiTrendingUp className="text-2xl" /> }
];

export default function FeaturesPage() {
  const [activeFeature, setActiveFeature] = useState('scenarios');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToFeature = (featureId) => {
    const element = document.getElementById(featureId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setActiveFeature(featureId);
  };

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
            <h1 className="text-5xl md:text-7xl font-bold mb-6 pb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Complete Interview Prep Platform
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Master cybersecurity interviews with senario-based questions, AI voice interviews, and comprehensive learning resources. Everything you need to ace your cybersecurity career.
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

      {/* Feature Navigation */}
      <section className="py-8 bg-white/5 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => scrollToFeature(feature.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                  activeFeature === feature.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {feature.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                id={feature.id}
                className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-700 hover:scale-105 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} shadow-lg`}>
                      <div className="text-white">{feature.icon}</div>
                    </div>
                    <Link
                      to={feature.route}
                      className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-300 group-hover:scale-110"
                    >
                      <FaArrowRight className="text-xl" />
                    </Link>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-blue-200 text-lg mb-2">{feature.subtitle}</p>
                  <p className="text-gray-300 mb-6 leading-relaxed">{feature.description}</p>

                  {/* Features List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-gray-300">
                        <BiCheck className="text-green-400 flex-shrink-0" />
                        <span className="text-sm">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(feature.stats).map(([key, value]) => (
                      <div key={key} className="bg-white/10 rounded-lg px-4 py-2">
                        <div className="text-white font-bold">{value}</div>
                        <div className="text-gray-300 text-xs capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section className="py-20 bg-gradient-to-b from-blue-950/60 to-transparent">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 pb-2 bg-gradient-to-r from-orange-400 via-yellow-400 to-pink-400 bg-clip-text text-transparent">
              Gamified Learning Experience
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Stay motivated and track your progress with interactive features that make learning fun and engaging
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {gamificationFeatures.map((feature, index) => (
              <div 
                key={feature.title}
                className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}></div>
                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl"></div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <div className="text-white text-2xl">{feature.icon}</div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  
                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">{feature.description}</p>
                  
                  {/* Stat Badge */}
                  <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                    <span className="text-lg font-bold text-yellow-400">{feature.stat}</span>
                  </div>
                </div>
                
                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
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
                to="/about-us"
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
              >
                <BiPlay className="inline w-6 h-6 mr-2" />
                Explore More
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}