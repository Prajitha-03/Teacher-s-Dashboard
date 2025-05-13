import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    return (
        <div className="w-69 bg-indigo-700 text-white p-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Teacher's Dashboard</h1>
            </div>
            <nav>
                <ul className="space-y-2">
                    <li>
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                `block p-2 rounded ${isActive ? 'bg-indigo-900' : 'hover:bg-indigo-600'}`
                            }
                        >
                            Overview
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/students"
                            className={({ isActive }) =>
                                `block p-2 rounded ${isActive ? 'bg-indigo-900' : 'hover:bg-indigo-600'}`
                            }
                        >
                            Students
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/quizzes"
                            className={({ isActive }) =>
                                `block p-2 rounded ${isActive ? 'bg-indigo-900' : 'hover:bg-indigo-600'}`
                            }
                        >
                            Quiz Results
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;