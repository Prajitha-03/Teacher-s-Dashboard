import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Update() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState({ name: '' });

    useEffect(() => {
        axios.get(`http://localhost:3001/students/${id}`)
            .then(res => setStudent(res.data))
            .catch(err => console.error('Error fetching student:', err));
    }, [id]);

    const handleUpdate = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3001/students/${id}`, student)
            .then(() => {
                navigate('/students');
            })
            .catch(err => console.error('Error updating student:', err));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-indigo-600 py-4 px-6">
                    <h1 className="text-2xl font-bold text-white">Update Student</h1>
                    <p className="text-indigo-200 text-sm">ID: {id}</p>
                </div>

                <form onSubmit={handleUpdate} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Student ID</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            value={student.id}
                            onChange={(e) => setStudent({ ...student, id: e.target.value })}
                            required
                        />
                    </div><div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Student Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            value={student.name}
                            onChange={(e) => setStudent({ ...student, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <Link
                            to="/students"
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-200"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
                        >
                            Update Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Update;