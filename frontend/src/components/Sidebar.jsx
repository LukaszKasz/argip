import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { tokenManager } from '../api';

function Sidebar() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        tokenManager.removeToken();
        navigate('/login');
    };

    const menuItems = [
        { path: '/dashboard/calculator', label: t('sidebar.calculator'), icon: '🧮' },
        { path: '/dashboard', label: t('sidebar.dashboard'), icon: '📊' },
        { path: '/dashboard/ranges', label: t('sidebar.ranges'), icon: '📏' },
        { path: '/dashboard/nuts', label: t('sidebar.nuts'), icon: '🔩' },
    ];

    return (
        <div className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 text-white min-h-screen flex flex-col shadow-xl">
            <div className="p-6 border-b border-slate-700">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Argip
                </h1>
                <p className="text-sm text-slate-400 mt-1">{t('sidebar.subtitle')}</p>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transform scale-105'
                                        : 'hover:bg-slate-700 hover:translate-x-1'
                                        }`}
                                >
                                    <span className="text-2xl">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors duration-200"
                >
                    <span className="text-2xl">🚪</span>
                    <span className="font-medium">{t('sidebar.logout')}</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
