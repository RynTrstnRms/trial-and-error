import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

const UserManagement = () => {
    const { users, setUsers } = useOutletContext();
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [newUser, setNewUser] = useState({ email: '', password: '', role: 'patient', name: '' });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingUser) {
            await updateUser();
        } else {
            await addUser();
        }
        setShowModal(false);
        fetchUsers();
    };

    const addUser = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/register', newUser);
            if (newUser.role === 'patient') {
                await axios.post('http://127.0.0.1:8000/api/addPatients', {
                    ...newUser,
                    first_name: newUser.name.split(' ')[0],
                    last_name: newUser.name.split(' ')[1] || '',
                });
            } else if (newUser.role === 'doctor') {
                await axios.post('http://127.0.0.1:8000/api/addDoctors', {
                    ...newUser,
                    first_name: newUser.name.split(' ')[0],
                    last_name: newUser.name.split(' ')[1] || '',
                });
            }
            resetForm();
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const updateUser = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/users/${editingUser.id}`, newUser);
            resetForm();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setNewUser({ ...user, password: '' });
        setShowModal(true);
    };

    const handleDeleteUser = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/removeUser/${id}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const resetForm = () => {
        setEditingUser(null);
        setNewUser({ email: '', password: '', role: 'patient', name: '' });
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>User Management</h3>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Add New User
                </Button>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditUser(user)}>Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingUser ? 'Edit User' : 'Add New User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Control as="select" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                                <option value="admin">Admin</option>
                                <option value="receptionist">Receptionist</option>
                                <option value="patient">Patient</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Full Name" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} required />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} required />
                        </Form.Group>

                        {!editingUser && (
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required />
                            </Form.Group>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editingUser ? updateUser : addUser}>
                        {editingUser ? 'Save Changes' : 'Add User'}
                    </Button>
                </Modal.Footer>
                
            </Modal>
        </div>
    );
};

export default UserManagement;