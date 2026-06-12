// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/public/LandingPage";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import RoadmapPage from "./pages/learning/RoadmapPage";
import RoadmapViewPage from "./pages/learning/RoadmapViewPage";
import TermsOfUse from "./pages/public/TermsOfUse";
import PrivacyPolicy from "./pages/public/PrivacyPolicy";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ContactUs from "./pages/public/ContactUs";
import CompetePage from "./pages/dashboard/CompetePage";
import BookPage from "./pages/learning/BookPage";
import RequireAdminAuth from "./admin/RequireAdminAuth";
import SettingsPage from "./pages/dashboard/Settings"
import DashboardPage from "./pages/dashboard/DashboardPage";
import AboutUs from "./pages/public/AboutUs"
import PracticePage from "./pages/learning/PracticePage";
import ToolsPage from "./pages/learning/ToolsPage";
import HomeLabPage from "./pages/learning/HomeLabPage";
import HomeLabViewPage from "./pages/learning/HomeLabViewPage";
import ProjectPage from "./pages/learning/ProjectPage";
import AdminDashboard from "./admin/AdminDashboard";
import BlogsAdmin from "./admin/pages/BlogsAdmin";
import RoadmapsAdmin from "./admin/pages/RoadmapsAdmin";
import BooksAdmin from "./admin/pages/BooksAdmin";
import PracticeAdmin from "./admin/pages/PracticeAdmin";
import ToolsAdmin from "./admin/pages/ToolsAdmin";
import HomeLabsAdmin from "./admin/pages/HomeLabsAdmin";
import BlogPage from "./pages/learning/BlogPage";
import BlogEditorPage from "./admin/pages/BlogEditorPage";
import AdminLogin from "./admin/AdminLogin";
import ProjectsAdmin from "./admin/pages/ProjectsAdmin";
import BadgeAdmin from "./admin/pages/BadgeAdmin";
import PracticeEditorPage from "./admin/pages/PracticeEditorPage";
import PracticeForm from "./admin/pages/PracticeForm";
import QuestionForm from "./admin/pages/QuestionForm";
import ToolPracticeAdmin from "./admin/pages/ToolPracticeAdmin";
import NotificationAdmin from "./admin/pages/NotificationAdmin";
import BlogViewPage from "./pages/learning/BlogViewPage";
import FeaturesPage from "./pages/public/FeaturesPage";
import MockInterviewPage from "./pages/learning/MockInterviewPage";
import PracticeScenarioPage from "./pages/learning/PracticeScenarioPage";
import ChatbotDemo from "./components/chatbot/ChatbotDemo";
import PublicProfile from "./pages/dashboard/PublicProfile";
import BadgesPage from "./pages/dashboard/BadgesPage";
import EmailVerificationPage from "./pages/auth/EmailVerificationPage";
import PageViewsTracker from "./components/ui/PageViewsTracker";
import { PublicRoute, ProtectedRoute } from "./components/auth/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        {/* Page Views Tracker - tracks all page views */}
        <PageViewsTracker />
        
        <Routes>
        {/* Public Routes - Redirect to dashboard if already logged in */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />
        <Route path="/verify-email/:token" element={<EmailVerificationPage />} />
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
          <Route index element={<AdminDashboard />} />
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
            <Route path="mock-interviews" element={<MockInterviewPage />} />
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
