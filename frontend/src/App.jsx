import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ApplicationProvider } from "./contexts/ApplicationContext";
import { AuthProvider } from "./contexts/AuthContext";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Applications from "./pages/Applications";
import Analytics from "./pages/Analytics";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import KeywordMatch from "./pages/KeywordMatch"; // NEW AI PAGE IMPORT

function AppLayout({ children }) {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="p-6 flex-1">{children}</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ApplicationProvider>
          <Routes>

            {/* PUBLIC ROUTES */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path="/register"
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            {/* PROTECTED ROUTES */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Dashboard />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/applications"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Applications />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/analytics"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Analytics />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/*  NEW AI FEATURE ROUTE */}
            <Route
              path="/ai-job-match"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <KeywordMatch />
                  </AppLayout>
                </ProtectedRoute>
              }
            />

            {/* DEFAULT ROUTES */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />

          </Routes>
        </ApplicationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
