import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { AppShell } from './components/layout/AppShell';

// Lazy-loaded module pages
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage').then((m) => ({ default: m.DashboardPage })));
const StratejiPage = lazy(() => import('./pages/strateji/StratejiPage').then((m) => ({ default: m.StratejiPage })));
const TrendPage = lazy(() => import('./pages/trend/TrendPage').then((m) => ({ default: m.TrendPage })));
const KoleksiyonPage = lazy(() => import('./pages/koleksiyon/KoleksiyonPage').then((m) => ({ default: m.KoleksiyonPage })));
const TasarimPage = lazy(() => import('./pages/tasarim/TasarimPage').then((m) => ({ default: m.TasarimPage })));
const MaliyetPage = lazy(() => import('./pages/maliyet/MaliyetPage').then((m) => ({ default: m.MaliyetPage })));
const AnalizPage = lazy(() => import('./pages/analiz/AnalizPage').then((m) => ({ default: m.AnalizPage })));
const AyarlarPage = lazy(() => import('./pages/ayarlar/AyarlarPage').then((m) => ({ default: m.AyarlarPage })));

const PageLoader = () => (
    <div className="flex items-center justify-center h-40 text-stone-500 text-sm">Yükleniyor...</div>
);

const ProtectedRoute = ({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    if (isLoading) return <div className="min-h-screen bg-stone-950 flex items-center justify-center text-stone-500">Yükleniyor...</div>;
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (adminOnly && user?.role === 'MODULE_USER') return <Navigate to="/" />;
    return <>{children}</>;
};

function AppContent() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/" element={
                <ProtectedRoute>
                    <AppShell>
                        <Suspense fallback={<PageLoader />}>
                            <DashboardPage />
                        </Suspense>
                    </AppShell>
                </ProtectedRoute>
            } />

            <Route path="/strateji" element={
                <ProtectedRoute>
                    <AppShell>
                        <Suspense fallback={<PageLoader />}>
                            <StratejiPage />
                        </Suspense>
                    </AppShell>
                </ProtectedRoute>
            } />

            <Route path="/trend" element={
                <ProtectedRoute>
                    <AppShell>
                        <Suspense fallback={<PageLoader />}>
                            <TrendPage />
                        </Suspense>
                    </AppShell>
                </ProtectedRoute>
            } />

            <Route path="/koleksiyon" element={
                <ProtectedRoute>
                    <AppShell>
                        <Suspense fallback={<PageLoader />}>
                            <KoleksiyonPage />
                        </Suspense>
                    </AppShell>
                </ProtectedRoute>
            } />

            <Route path="/tasarim" element={
                <ProtectedRoute>
                    <AppShell>
                        <Suspense fallback={<PageLoader />}>
                            <TasarimPage />
                        </Suspense>
                    </AppShell>
                </ProtectedRoute>
            } />

            <Route path="/maliyet" element={
                <ProtectedRoute>
                    <AppShell>
                        <Suspense fallback={<PageLoader />}>
                            <MaliyetPage />
                        </Suspense>
                    </AppShell>
                </ProtectedRoute>
            } />

            <Route path="/analiz" element={
                <ProtectedRoute>
                    <AppShell>
                        <Suspense fallback={<PageLoader />}>
                            <AnalizPage />
                        </Suspense>
                    </AppShell>
                </ProtectedRoute>
            } />

            <Route path="/ayarlar" element={
                <ProtectedRoute>
                    <AppShell>
                        <Suspense fallback={<PageLoader />}>
                            <AyarlarPage />
                        </Suspense>
                    </AppShell>
                </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
