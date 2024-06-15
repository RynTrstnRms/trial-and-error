import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';

const AppointmentManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        status: 'scheduled',
        reason: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [appointmentsRes, doctorsRes, patientsRes] = await Promise.all([
                    axios.get('http://127.0.0.1:8000/api/appointments'),
                    axios.get('http://127.0.0.1:8000/api/doctors'),
                    axios.get('http://127.0.0.1:8000/api/patients')
                ]);
                setAppointments(appointmentsRes.data);
                setDoctors(doctorsRes.data);
                setPatients(patientsRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const cancelAppointment = async (appointmentId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/removeAppointments/${appointmentId}`);
            setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
        } catch (error) {
            console.error('Error cancelling appointment:', error);
        }
    };

    const getDoctorName = (doctorId) => {
        const doctor = doctors.find(doctor => doctor.id === doctorId);
        return doctor ? `${doctor.first_name} ${doctor.last_name}` : 'Unknown Doctor';
    };

    const getPatientName = (patientId) => {
        const patient = patients.find(patient => patient.id === patientId);
        return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';
    };

    const handleAddAppointment = async () => {
        try {
            await axios.post('http://127.0.0.1:8000/api/addAppointments', newAppointment);
            // Fetch the updated appointments list after adding a new appointment
            const appointmentsRes = await axios.get('http://127.0.0.1:8000/api/appointments');
            setAppointments(appointmentsRes.data);
            resetForm();
            setShowModal(false);
        } catch (error) {
            console.error('Error adding appointment:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewAppointment({ ...newAppointment, [name]: value });
    };

    const resetForm = () => {
        setNewAppointment({
            patient_id: '',
            doctor_id: '',
            appointment_date: '',
            status: 'scheduled',
            reason: ''
        });
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Spinner animation="border" />
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3>Appointment Management</h3>
                <Button variant="primary" onClick={() => setShowModal(true)}>
                    Schedule New Appointment
                </Button>
            </div>

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Appointment Date</th>
                            <th>Doctor</th>
                            <th>Patient</th>
                            <th>Status</th>
                            <th>Reason</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(appointment => (
                            <tr key={appointment.id}>
                                <td>{appointment.appointment_date}</td>
                                <td>{getDoctorName(appointment.doctor_id)}</td>
                                <td>{getPatientName(appointment.patient_id)}</td>
                                <td>{appointment.status}</td>
                                <td>{appointment.reason}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={() => cancelAppointment(appointment.id)}>
                                        Cancel
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Schedule New Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Appointment Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="appointment_date"
                                value={newAppointment.appointment_date}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Doctor</Form.Label>
                            <Form.Control
                                as="select"
                                name="doctor_id"
                                value={newAppointment.doctor_id}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Doctor</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.first_name} {doctor.last_name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Patient</Form.Label>
                            <Form.Control
                                as="select"
                                name="patient_id"
                                value={newAppointment.patient_id}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Patient</option>
                                {patients.map(patient => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.first_name} {patient.last_name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Reason</Form.Label>
                            <Form.Control
                                type="text"
                                name="reason"
                                placeholder="Reason"
                                value={newAppointment.reason}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleAddAppointment}>
                            Schedule Appointment
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AppointmentManagement;
