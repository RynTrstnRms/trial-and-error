import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorManagement = ({ currentUser }) => {
    const [doctor, setDoctor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newDoctor, setNewDoctor] = useState({
        id: '',
        first_name: '',
        last_name: '',
        specialization: '',
        license_number: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        // Fetch doctor data based on current user's email
        axios.get(`http://127.0.0.1:8000/api/doctorsEmail/${currentUser.email}`)
            .then(response => {
                const doctorData = response.data;
                console.log('Fetched doctor data:', doctorData); // Debug log
                setDoctor(doctorData);
                setNewDoctor(doctorData);
            })
            .catch(error => console.log(error));
    }, [currentUser.email]);

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
                    <p>ID: {doctor.id}</p>
                    <p>
                        Name:&nbsp;
                        {showModal ? (
                            <>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="first_name"
                                    value={newDoctor.first_name}
                                    onChange={handleChange}
                                />
                                <input
                                    type="text"
                                    className="form-control"
                                    name="last_name"
                                    value={newDoctor.last_name}
                                    onChange={handleChange}
                                />
                            </>
                        ) : (
                            `${doctor.first_name} ${doctor.last_name}`
                        )}
                    </p>
                    <p>
                        Specialization:&nbsp;
                        {showModal ? (
                            <input
                                type="text"
                                className="form-control"
                                name="specialization"
                                value={newDoctor.specialization}
                                onChange={handleChange}
                            />
                        ) : (
                            doctor.specialization
                        )}
                    </p>
                    <p>
                        License Number:&nbsp;
                        {showModal ? (
                            <input
                                type="text"
                                className="form-control"
                                name="license_number"
                                value={newDoctor.license_number}
                                onChange={handleChange}
                            />
                        ) : (
                            doctor.license_number
                        )}
                    </p>
                    <p>
                        Phone:&nbsp;
                        {showModal ? (
                            <input
                                type="text"
                                className="form-control"
                                name="phone"
                                value={newDoctor.phone}
                                onChange={handleChange}
                            />
                        ) : (
                            doctor.phone
                        )}
                    </p>
                    <p>
                        Email:&nbsp;
                        {showModal ? (
                            <input
                                type="text"
                                className="form-control"
                                name="email"
                                value={newDoctor.email}
                                onChange={handleChange}
                            />
                        ) : (
                            doctor.email
                        )}
                    </p>
                    {showModal ? (
                        <button className="btn btn-primary" onClick={handleUpdate}>Update Profile</button>
                    ) : (
                        <button className="btn btn-primary" onClick={() => setShowModal(true)}>Edit Profile</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default DoctorManagement;
