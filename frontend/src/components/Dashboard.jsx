import { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authAPI, tokenManager } from '../api';
import Sidebar from './Sidebar';
import Calculator from './Calculator';
import RangesView from './RangesView';
import NutsView from './NutsView';
import LanguageSwitcher from './LanguageSwitcher';

function DashboardHome({ user }) {
    const { t } = useTranslation();

    return (
        <div className="p-8">
            <div className="max-w-4xl mx-auto">
                <div className="card">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{t('dashboard.title')}</h1>
                    <p className="text-slate-600 mb-8">{t('dashboard.subtitle')}</p>

                    {user && (
                        <div className="space-y-6">
                            <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg p-6 border border-primary-200">
                                <h2 className="text-xl font-semibold text-slate-800 mb-4">{t('dashboard.userInfo')}</h2>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <span className="text-slate-600 font-medium w-32">{t('dashboard.userId')}</span>
                                        <span className="text-slate-800">{user.id}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-slate-600 font-medium w-32">{t('dashboard.username')}</span>
                                        <span className="text-slate-800 font-semibold">{user.username}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-slate-600 font-medium w-32">{t('dashboard.email')}</span>
                                        <span className="text-slate-800">{user.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div>
                                        <h3 className="font-semibold text-green-800">{t('dashboard.authSuccess')}</h3>
                                        <p className="text-green-700 text-sm">{t('dashboard.authSuccessDesc')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                                <h3 className="font-semibold text-slate-800 mb-2">{t('dashboard.appFeatures')}</h3>
                                <ul className="space-y-2 text-slate-600">
                                    <li className="flex items-center">
                                        <span className="text-primary-600 mr-2">✓</span>
                                        {t('dashboard.featureRanges')}
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-primary-600 mr-2">✓</span>
                                        {t('dashboard.featureNuts')}
                                    </li>
                                    <li className="flex items-center">
                                        <span className="text-primary-600 mr-2">✓</span>
                                        {t('dashboard.featureCalculator')}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function Dashboard() {
    const { t } = useTranslation();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await authAPI.getCurrentUser();
                setUser(userData);
            } catch (err) {
                setError(t('dashboard.errorLoading'));
                tokenManager.removeToken();
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        if (tokenManager.isAuthenticated()) {
            fetchUser();
        } else {
            navigate('/login');
        }
    }, [navigate, t]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">{t('loading')}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="card max-w-md w-full text-center">
                    <p className="text-red-600">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <div className="flex-1">
                <div className="absolute top-4 right-4 z-10">
                    <LanguageSwitcher />
                </div>
                <Routes>
                    <Route path="/" element={<DashboardHome user={user} />} />
                    <Route path="/calculator" element={<Calculator />} />
                    <Route path="/ranges" element={<RangesView />} />
                    <Route path="/nuts" element={<NutsView />} />
                </Routes>
            </div>
        </div>
    );
}

export default Dashboard;
