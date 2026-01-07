import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider } from './hooks/use-auth';
import Home from './pages/Home';
import AdminPage from './pages/Admin';

export default function App() {
    return (
        <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
            <AuthProvider>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/admin" element={<AdminPage />} />
                    </Routes>
                    <Toaster />
                </ThemeProvider>
            </AuthProvider>
        </Router>
    );
}
