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
        <div className="w-64 bg-white min-h-screen flex flex-col shadow-lg border-r border-slate-200">
            <div className="p-6 border-b border-slate-200">
                <h1 className="text-2xl font-bold text-slate-800">
                    Argip
                </h1>
                <p className="text-sm text-slate-600 mt-1">{t('sidebar.subtitle')}</p>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-1">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                        ? 'bg-primary-50 text-primary-700 border border-primary-200 font-semibold'
                                        : 'text-slate-700 hover:bg-slate-50 border border-transparent'
                                        }`}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-200">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-700 hover:bg-red-50 border border-red-200 transition-all duration-200 font-medium"
                >
                    <span className="text-xl">🚪</span>
                    <span>{t('sidebar.logout')}</span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;
