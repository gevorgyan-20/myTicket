import React, { useMemo } from 'react';
import { NavLink, Outlet, Link, useMatch, useNavigate } from 'react-router-dom';
import { logout } from '../api/AuthService';
import { useTranslation } from 'react-i18next';
import { 
    LayoutDashboard, 
    Film, 
    Mic, 
    Music, 
    MapPin, 
    LogOut,
    ChevronRight,
    PlusCircle
} from 'lucide-react';

const AdminLayout = () => {
    const { t } = useTranslation();
    const isVenueGridPage = useMatch('/admin/venues/:id/layout');
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            window.dispatchEvent(new Event('authChange'));
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const navItems = useMemo(() => [
        { 
            label: t('admin.sidebar.dashboard'), 
            to: '/admin', 
            icon: <LayoutDashboard size={20} />, 
            exact: true 
        },
        { 
            label: t('admin.sidebar.movies'), 
            to: '/admin/movies', 
            icon: <Film size={20} />,
            badge: t('admin.sidebar.create')
        },
        { 
            label: t('admin.sidebar.concerts'), 
            to: '/admin/concerts', 
            icon: <Music size={20} />,
            badge: t('admin.sidebar.create')
        },
        { 
            label: t('admin.sidebar.standups'), 
            to: '/admin/standups', 
            icon: <Mic size={20} />,
            badge: t('admin.sidebar.create')
        },
        { 
            label: t('admin.sidebar.venues'), 
            to: '/admin/venues', 
            icon: <MapPin size={20} /> 
        },
    ], [t]);

    return (
        <div className="flex min-h-screen bg-[#0c0c0c] text-white font-sans">
            {isVenueGridPage ? null : (
                <aside className="w-64 border-r border-purple-900/20 bg-[#0c0c0c] flex flex-col fixed h-full z-30">
                    <div className="p-6 border-b border-purple-900/20">
                        <Link to="/admin" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-purple-400 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/20 group-hover:scale-110 transition-transform">
                                <img src="/favicon.ico" alt="Logo" className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Admin<span className="text-purple-500">Panel</span></span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.exact}
                            className={({ isActive }) => `
                                flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                                ${isActive 
                                    ? 'bg-purple-600/10 text-purple-400 border border-purple-600/20 shadow-[0_0_20px_rgba(147,51,234,0.1)]' 
                                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'}
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <span className={({ isActive }) => isActive ? 'text-purple-400' : 'group-hover:text-purple-400 transition-colors'}>
                                    {item.icon}
                                </span>
                                <span className="font-medium">{item.label}</span>
                            </div>
                            {item.badge && (
                                <PlusCircle size={14} className="opacity-0 group-hover:opacity-100 text-purple-400 transition-opacity" />
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-purple-900/20">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:text-red-400 hover:bg-red-400/5 rounded-xl transition-all duration-200 group"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">{t('admin.sidebar.logout')}</span>
                    </button>
                    
                    <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-900/10">
                        <p className="text-xs text-purple-300/60 uppercase tracking-widest font-semibold mb-1">{t('admin.sidebar.role')}</p>
                        <p className="text-sm font-medium text-white">{t('admin.sidebar.administrator')}</p>
                    </div>
                </div>
            </aside>
            )}

            <main className={`flex-1 ${isVenueGridPage ? 'ml-0' : 'ml-64'} min-h-screen relative`}>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="relative z-10 max-w-screen">
                    <header className="h-20 z-20 flex items-center justify-between px-8 border-b border-purple-900/10 backdrop-blur-md bg-[#0c0c0c]/80 sticky top-0 transition-all duration-300">
                        <h2 className="text-lg font-semibold text-gray-400 flex items-center gap-2">
                           MyTicket <ChevronRight size={16} /> 
                           <span className="text-white capitalize">
                                {window.location.pathname.split('/').pop() || t('admin.sidebar.dashboard')}
                           </span>
                        </h2>
                        
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-purple-600/20 border border-purple-600/30 flex items-center justify-center">
                                <span className="text-purple-400 font-bold">A</span>
                            </div>
                        </div>
                    </header>
                    
                    <div className="p-8">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
