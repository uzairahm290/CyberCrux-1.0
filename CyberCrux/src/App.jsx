// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import RoadmapPage from "./components/RoadmapPage";
import RoadmapViewPage from "./components/RoadmapViewPage";
import TermsOfUse from "./components/TermsOfUse";
import PrivacyPolicy from "./components/PrivacyPolicy";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ContactUs from "./components/ContactUs";
import CompetePage from "./components/CompetePage";
import BookPage from "./components/BookPage";
import RequireAdminAuth from "./components/admin/RequireAdminAuth";
import SettingsPage from "./components/Settings"
import DashboardPage from "./components/DashboardPage";
import AboutUs from "./components/AboutUs"
import PracticePage from "./components/PracticePage";
import ToolsPage from "./components/ToolsPage";
import HomeLabPage from "./components/HomeLabPage";
import HomeLabViewPage from "./components/HomeLabViewPage";
import ProjectPage from "./components/ProjectPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import BlogsAdmin from "./components/admin/pages/BlogsAdmin";
import RoadmapsAdmin from "./components/admin/pages/RoadmapsAdmin";
import BooksAdmin from "./components/admin/pages/BooksAdmin";
import PracticeAdmin from "./components/admin/pages/PracticeAdmin";
import ToolsAdmin from "./components/admin/pages/ToolsAdmin";
import HomeLabsAdmin from "./components/admin/pages/HomeLabsAdmin";
import BlogPage from "./components/BlogPage";
import BlogEditorPage from "./components/admin/pages/BlogEditorPage";
import AdminLogin from "./components/admin/AdminLogin";
import ProjectsAdmin from "./components/admin/pages/ProjectsAdmin";
import BadgeAdmin from "./components/admin/pages/BadgeAdmin";
import PracticeEditorPage from "./components/admin/pages/PracticeEditorPage";
import PracticeForm from "./components/admin/pages/PracticeForm";
import QuestionForm from "./components/admin/pages/QuestionForm";
import ToolPracticeAdmin from "./components/admin/pages/ToolPracticeAdmin";
import NotificationAdmin from "./components/admin/pages/NotificationAdmin";
import BlogViewPage from "./components/BlogViewPage";
import FeaturesPage from "./components/FeaturesPage";
import MockInterviewPage from "./components/MockInterviewPage";
import PracticeScenarioPage from "./components/PracticeScenarioPage";
import ChatbotDemo from "./components/ChatbotDemo";
import PublicProfile from "./components/PublicProfile";
import BadgesPage from "./components/BadgesPage";
import { PublicRoute, ProtectedRoute } from "./components/ProtectedRoute";
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
      <Routes>
        {/* Public Routes - Redirect to dashboard if already logged in */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/features" element={<PublicRoute><FeaturesPage /></PublicRoute>} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/profile/:identifier" element={<PublicProfile />} />

        {/* Protected Routes - Require authentication */}
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/labs" element={<ProtectedRoute><HomeLabPage /></ProtectedRoute>} />
        <Route path="/labs/:id" element={<ProtectedRoute><HomeLabViewPage /></ProtectedRoute>} />
        <Route path="/books" element={<ProtectedRoute><BookPage /></ProtectedRoute>} />
        <Route path="/compete" element={<ProtectedRoute><CompetePage /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
        <Route path="/roadmap/:id" element={<ProtectedRoute><RoadmapViewPage /></ProtectedRoute>} />
        <Route path="/blog" element={<ProtectedRoute><BlogPage /></ProtectedRoute>} />
        <Route path="/blog/:id" element={<ProtectedRoute><BlogViewPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/practice" element={<ProtectedRoute><PracticePage /></ProtectedRoute>} />
        <Route path="/practice/:id" element={<ProtectedRoute><PracticeScenarioPage /></ProtectedRoute>} />
        <Route path="/interviews" element={<ProtectedRoute><MockInterviewPage /></ProtectedRoute>} />
        <Route path="/tools" element={<ProtectedRoute><ToolsPage /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><ProjectPage /></ProtectedRoute>} />
        <Route path="/badges" element={<ProtectedRoute><BadgesPage /></ProtectedRoute>} />
        <Route path="/chatbot-demo" element={<ProtectedRoute><ChatbotDemo /></ProtectedRoute>} />
        <Route path="/admin" element={<RequireAdminAuth />}>
          <Route element={<AdminDashboard />}>
            <Route path="blogs" element={<BlogsAdmin />} />
            <Route path="blogs/new" element={<BlogEditorPage />} />
            <Route path="blogs/edit/:id" element={<BlogEditorPage />} />
            <Route path="roadmaps" element={<RoadmapsAdmin />} />
            <Route path="books" element={<BooksAdmin />} />
            <Route path="practice" element={<PracticeAdmin />} />
            <Route path="practice/new" element={<PracticeEditorPage />} />
            <Route path="practice/edit/:id" element={<PracticeForm />} />
            <Route path="practice/:scenarioId/questions/new" element={<QuestionForm />} />
            <Route path="practice/:scenarioId/questions/edit/:questionId" element={<QuestionForm />} />
            <Route path="tools" element={<ToolsAdmin />} />
            <Route path="tool-practice" element={<ToolPracticeAdmin />} />
            <Route path="homelabs" element={<HomeLabsAdmin />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="badges" element={<BadgeAdmin />} />
            <Route path="notifications" element={<NotificationAdmin />} />
          </Route>
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Catch-all route - redirect to appropriate page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </div>
    </BrowserRouter>
  );
}
