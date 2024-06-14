import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';

const DoctorManagement = () => {
    const [doctors, setDoctors] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState(null);
    const [newDoctor, setNewDoctor] = useState({
        first_name: '',
        last_name: '',
        specialization: '',
        license_number: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/doctors');
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const handleAddOrUpdateDoctor = async () => {
        try {
            if (editingDoctor) {
                await axios.put(`http://127.0.0.1:8000/api/doctors/${editingDoctor.id}`, newDoctor);
            } else {
                await axios.post('http://127.0.0.1:8000/api/addDoctors', newDoctor);
            }
            setNewDoctor({
                first_name: '',
                last_name: '',
                specialization: '',
                license_number: '',
                phone: '',
                email: ''
            });
            fetchDoctors();
            handleCloseModal();
        } catch (error) {
            console.error('Error adding/updating doctor:', error);
        }
    };

    const handleEditDoctor = (doctor) => {
        setEditingDoctor(doctor);
        setNewDoctor(doctor);
        setShowModal(true);
    };

    const handleDeleteDoctor = async (id) => {
        if (window.confirm('Are you sure you want to delete this doctor?')) {
            try {
                await axios.delete(`http://127.0.0.1:8000/api/removeDoctor/${id}`);
                fetchDoctors();
            } catch (error) {
                console.error('Error deleting doctor:', error);
            }
        }
    };

    const handleShowModal = () => {
        setEditingDoctor(null);
        setNewDoctor({
            first_name: '',
            last_name: '',
            specialization: '',
            license_number: '',
            phone: '',
            email: ''
        });
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingDoctor(null);
    };

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Doctor Management</h3>
                <Button variant="primary" onClick={handleShowModal}>
                    Add New Doctor
                </Button>
            </div>


            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Specialization</th>
                        <th>License Number</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map(doctor => (
                        <tr key={doctor.id}>
                            <td>{doctor.first_name} {doctor.last_name}</td>
                            <td>{doctor.specialization}</td>
                            <td>{doctor.license_number}</td>
                            <td>{doctor.phone}</td>
                            <td>{doctor.email}</td>
                            <td>
                                <Button variant="warning" size="sm" onClick={() => handleEditDoctor(doctor)} className="me-2">Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDeleteDoctor(doctor.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="First Name" value={newDoctor.first_name} onChange={(e) => setNewDoctor({ ...newDoctor, first_name: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Last Name" value={newDoctor.last_name} onChange={(e) => setNewDoctor({ ...newDoctor, last_name: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Specialization" value={newDoctor.specialization} onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="License Number" value={newDoctor.license_number} onChange={(e) => setNewDoctor({ ...newDoctor, license_number: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <input type="text" className="form-control" placeholder="Phone" value={newDoctor.phone} onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <input type="email" className="form-control" placeholder="Email" value={newDoctor.email} onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })} />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddOrUpdateDoctor}>
                        {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DoctorManagement;