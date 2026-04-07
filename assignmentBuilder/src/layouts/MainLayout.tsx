import React, {useState, useEffect} from "react"
import { Outlet, Link, useLocation } from "react-router-dom" // Добавили useLocation
import { logout } from "@/features/auth/authSlice";
import LogoutModal from "@/shared/components/logoutModal";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from "@/app/store";
import exitIcon from '@/assets/images/exit-icon.svg';

export default function MainLayout() {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);
    const location = useLocation(); // Хук для получения текущего пути

    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const openLogoutModal = () => setIsLogoutModalOpen(true);
    const closeLogoutModal = () => setIsLogoutModalOpen(false);

    const logoutHandler = async () => {
        try {
            closeLogoutModal();
            await dispatch(logout()).unwrap();
            // После успешного выхода можно редиректнуть на логин
            // navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    // Функция для проверки активной ссылки с поддержкой вложенных путей
    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    }

    return (
        <div className="app-container">
            <LogoutModal
                isOpen={isLogoutModalOpen}
                onConfirm={logoutHandler}
                onCancel={closeLogoutModal}
            />
            <header className="app-header">
                <nav>
                    <div className="app-header__navigation">
                        <Link 
                            className={isActive('/') ? 'active' : ''} 
                            to="/"
                        >
                            Dashboard
                        </Link>
                        <Link 
                            className={isActive('/editor') && !location.pathname.includes('/editor/new') ? 'active' : ''} 
                            to="/editor"
                        >
                            Projects
                        </Link>
                        <Link 
                            className={location.pathname === '/editor/new' ? 'active' : ''} 
                            to="/editor/new"
                        >
                            New Project
                        </Link>
                    </div>
                
                    
                    <div className="login-data__container">
                    <button onClick={openLogoutModal} className="logout-btn">
                        <img src={exitIcon} alt="Exit icon" /> 
                        <span>SignOut</span>
                    </button>
                    {/* Информация о пользователе */}
                    {user && (
                        <div className="user-info">
                            <span className="user-email">{user.id}</span>
                        </div>
                    )}
                    </div>
                </nav>
            </header>

            <aside className="app-sidebar">
                {/* Навигация по документам */}
                <div className="sidebar-section">
                    <h3>Recent Documents</h3>
                    {/* Здесь будет список недавних документов */}
                    <ul className="recent-docs-list">
                        <li>Document 1</li>
                        <li>Document 2</li>
                        <li>Document 3</li>
                    </ul>
                </div>

                <div className="sidebar-section">
                    <h3>Tools</h3>
                    <ul className="tools-list">
                        <li><Link to="/editor/template">Templates</Link></li>
                        <li><Link to="/editor/settings">Settings</Link></li>
                        <li><Link to="/editor/help">Help</Link></li>
                    </ul>
                </div>
            </aside>

            <main className="app-content">
                <Outlet />
            </main>
        </div>
    )
}