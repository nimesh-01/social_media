import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { PlusCircle, User, LogIn, LogOut } from 'lucide-react';
import axios from 'axios';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const Navbar = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(null); // null initially to prevent flashing

    const getCookie = (name) => {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? match[2] : null;
    };

    useEffect(() => {
        const token = getCookie('token');
        setIsLoggedIn(!!token);

        // ✅ Redirect to /login if not logged in and not already on login/register page
        if (!token && pathname !== '/login' && pathname !== '/register') {
            navigate('/login');
        }

        // ✅ If already logged in and on login/register, redirect to home
        if (token && (pathname === '/login' || pathname === '/register')) {
            navigate('/');
        }

        const interval = setInterval(() => {
            const token = getCookie('token');
            setIsLoggedIn(!!token);
        }, 1000);

        return () => clearInterval(interval);
    }, [pathname, navigate]);

    const handleAuthClick = async () => {
        if (isLoggedIn) {
            try {
                await axios.get(`${backendUrl}/api/logout`, {
                    withCredentials: true,
                });
                setIsLoggedIn(false);
                navigate('/login');
            } catch (err) {
                console.error('Logout error', err);
            }
        } else {
            navigate('/login');
        }
    };

    // ✅ Hide navbar when not logged in or during null-check state
    if (!isLoggedIn) return null;

    return (
        <nav
            className="fixed bottom-0 left-0 w-full flex justify-around items-center h-14 z-50"
            style={{
                backgroundColor: '#D3D9D4',
                borderTop: '1px solid #748D92',
                boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Link to="/" style={{ color: pathname === '/' ? '#124E66' : '#2E3944' }}>
                <User size={24} />
            </Link>

            <Link to="/post" style={{ color: pathname === '/post' ? '#124E66' : '#2E3944' }}>
                <PlusCircle size={24} />
            </Link>

            <button onClick={handleAuthClick} style={{ color: '#124E66' }}>
                <LogOut size={24} />
            </button>
        </nav>
    );
};

export default Navbar;
