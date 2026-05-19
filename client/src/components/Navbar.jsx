import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Shield, LogOut, User, Menu, Moon, Sun } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    return (
        <nav className="glass sticky top-0 z-50 border-b border-white/10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="p-2 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-all">
                        <Shield className="text-primary w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tighter">
                        FRAUD<span className="text-primary">LENS</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {user ? (
                        <>
                            <Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                            <Link to="/scanner" className="hover:text-primary transition-colors">Scanner</Link>
                            <Link to="/history" className="hover:text-primary transition-colors">History</Link>
                            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span className="text-sm font-medium">{user.name}</span>
                                </div>
                                <button 
                                    onClick={() => { logout(); navigate('/'); }}
                                    className="p-2 hover:bg-danger/20 rounded-lg transition-all text-gray-400 hover:text-danger"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hover:text-primary transition-colors">Login</Link>
                            <Link to="/register" className="btn-primary">Get Started</Link>
                        </>
                    )}
                    
                    <button 
                        onClick={toggleTheme}
                        className="p-2 ml-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg transition-all"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5 text-warning" /> : <Moon className="w-5 h-5 text-secondary" />}
                    </button>
                </div>

                <button className="md:hidden p-2">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
