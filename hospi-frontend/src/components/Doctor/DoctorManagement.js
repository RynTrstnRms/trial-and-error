import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button,Spinner } from 'react-bootstrap';

const DoctorManagement = ({ currentUser }) => {
    const [doctor, setDoctor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newDoctor, setNewDoctor] = useState({
        id: '',
        first_name: '',
        last_name: '',
        specialization: '',
        phone: '',
        email: ''
    });

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // Check if currentUser is not null or undefined
        if (currentUser && currentUser.email) {
            setIsLoading(true); // Set loading state to true before fetching data
            // Fetch doctor data based on current user's email
            axios.get(`http://127.0.0.1:8000/api/doctorsEmail/${currentUser.email}`)
                .then(response => {
                    const doctorData = response.data;
                    console.log('Fetched doctor data:', doctorData); // Debug log
                    setDoctor(doctorData);
                    setNewDoctor(doctorData);
                    setIsLoading(false); // Set loading state to false after data is fetched
                })
                .catch(error => {
                    console.log(error);
                    setIsLoading(false); // Set loading state to false in case of error
                });
        } else {
            setIsLoading(false); // Set loading state to false if currentUser is null or undefined
        }
    }, [currentUser]);

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }



    const handleUpdate = () => {
        // Update doctor profile
        axios.put(`http://127.0.0.1:8000/api/doctors/${doctor.id}`, newDoctor)
            .then(response => {
                console.log("Doctor profile updated successfully:", response.data);
                setDoctor(prevDoctor => ({ ...prevDoctor, ...newDoctor })); // Merge the updated fields
                setShowModal(false);
            })
            .catch(error => console.log(error));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewDoctor(prevDoctor => ({
            ...prevDoctor,
            [name]: value
        }));
    };

    return (
        <div className="container">
            <h3 className="mt-4">Doctor Profile</h3>
            {doctor && (
                <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5>Doctor Details</h5>
                        <Button variant="primary" className='mb-2' onClick={() => setShowModal(true)}>
                            Edit Profile
                        </Button>
                    </div>
                    <div className="card">
                        <div className="card-body">
                            <p><strong>ID:</strong> {doctor.id}</p>
                            <p>
                                <strong>Name:</strong>&nbsp;
                                {doctor.first_name} {doctor.last_name}
                            </p>
                            <p><strong>Specialization:</strong> {doctor.specialization}</p>
                            <p><strong>Phone:</strong> {doctor.phone}</p>
                            <p><strong>Email:</strong> {doctor.email}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal for editing doctor profile */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Doctor Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="first_name" className="form-label">First Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="first_name"
                                name="first_name"
                                value={newDoctor.first_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="last_name" className="form-label">Last Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="last_name"
                                name="last_name"
                                value={newDoctor.last_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="specialization" className="form-label">Specialization</label>
                            <input
                                type="text"
                                className="form-control"
                                id="specialization"
                                name="specialization"
                                value={newDoctor.specialization}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone</label>
                            <input
                                type="text"
                                className="form-control"
                                id="phone"
                                name="phone"
                                value={newDoctor.phone}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="text"
                                className="form-control"
                                id="email"
                                name="email"
                                value={newDoctor.email}
                                onChange={handleChange}
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Update Profile
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DoctorManagement;