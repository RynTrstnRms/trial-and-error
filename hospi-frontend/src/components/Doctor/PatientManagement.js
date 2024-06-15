import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const PatientManagement = () => {
    const [patients, setPatients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingPatient, setEditingPatient] = useState(null);
    const [newPatient, setNewPatient] = useState({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        address: '',
        phone: '',
        email: '',
        emergency_contact: '',
        medical_history: ''
    });

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/patients');
            setPatients(response.data);
        } catch (error) {
            console.error('Error fetching patients:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingPatient) {
            await updatePatient();
        } else {
            await addPatient();
        }
        setShowModal(false);
        fetchPatients();
    };

    const addPatient = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/addPatients', newPatient);
            resetForm();
        } catch (error) {
            console.error('Error adding patient:', error);
        }
    };

    const updatePatient = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/patients/${editingPatient.id}`, newPatient);
            resetForm();
        } catch (error) {
            console.error('Error updating patient:', error);
        }
    };

    const handleEditPatient = (patient) => {
        setEditingPatient(patient);
        setNewPatient({ ...patient });
        setShowModal(true);
    };

    const handleDeletePatient = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/removePatient/${id}`);
            fetchPatients();
        } catch (error) {
            console.error('Error deleting patient:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewPatient({ ...newPatient, [name]: value });
    };

    const resetForm = () => {
        setEditingPatient(null);
        setNewPatient({
            first_name: '',
            last_name: '',
            date_of_birth: '',
            gender: '',
            address: '',
            phone: '',
            email: '',
            emergency_contact: '',
            medical_history: ''
        });
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Patient Management</h3>
            </div>

            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date of Birth</th>
                        <th>Gender</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Emergency Contact</th>
                        <th>Medical History</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map(patient => (
                        <tr key={patient.id}>
                            <td>{patient.first_name} {patient.last_name}</td>
                            <td>{patient.date_of_birth}</td>
                            <td>{patient.gender}</td>
                            <td>{patient.address}</td>
                            <td>{patient.phone}</td>
                            <td>{patient.email}</td>
                            <td>{patient.emergency_contact}</td>
                            <td>{patient.medical_history}</td>
                            <td>
                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditPatient(patient)}>Edit</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal show={showModal} onHide={() => { setShowModal(false); resetForm(); }}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="First Name" name="first_name" value={newPatient.first_name} onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Last Name" name="last_name" value={newPatient.last_name} onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control type="date" name="date_of_birth" value={newPatient.date_of_birth} onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Gender</Form.Label>
                            <Form.Control as="select" name="gender" value={newPatient.gender} onChange={handleInputChange} required>
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" placeholder="Address" name="address" value={newPatient.address} onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type="text" placeholder="Phone" name="phone" value={newPatient.phone} onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Email" name="email" value={newPatient.email} onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Emergency Contact</Form.Label>
                            <Form.Control type="text" placeholder="Emergency Contact" name="emergency_contact" value={newPatient.emergency_contact} onChange={handleInputChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Medical History</Form.Label>
                            <Form.Control as="textarea" placeholder="Medical History" name="medical_history" value={newPatient.medical_history} onChange={handleInputChange} required />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {editingPatient ? 'Save Changes' : 'Add Patient'}
                        </Button>
                        <Button variant="secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                            Close
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default PatientManagement;
