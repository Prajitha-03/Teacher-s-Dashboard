import { Link } from 'react-router-dom';

const Header = ({ title = 'Dashboard' }) => {
    return (
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                        <span className="sr-only">Notifications</span>
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                </div>
                <div className="flex items-center">
                    <span className="text-gray-600 mr-2">Teacher</span>
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                        T
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;