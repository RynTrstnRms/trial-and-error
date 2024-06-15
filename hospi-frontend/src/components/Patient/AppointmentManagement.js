import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AppointmentManagement = ({ currentUser }) => {
    const [appointments, setAppointments] = useState([]);
    const [patientId, setPatientId] = useState(null);
    const [doctors, setDoctors] = useState([]);
    const [newAppointment, setNewAppointment] = useState({
        doctor_id: '',
        appointment_date: '',
        reason: ''
    });
    const [activeEdit, setActiveEdit] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchPatientId();
        fetchDoctors();
    }, [currentUser.email]);

    useEffect(() => {
        if (patientId) {
            fetchAppointments(patientId);
        }
    }, [patientId]);

    const fetchPatientId = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/patientsEmail/${currentUser.email}`);
            setPatientId(response.data.id);
        } catch (error) {
            console.error('Failed to fetch patient ID:', error);
        }
    };

    const fetchAppointments = async (patientId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/appointmentsPatient/${patientId}`);
            const appointmentsWithDoctorDetails = await Promise.all(
                response.data.map(async appointment => {
                    const doctorName = await fetchPersonDetails('doctors', appointment.doctor_id);
                    return { ...appointment, doctor: doctorName };
                })
            );
            setAppointments(appointmentsWithDoctorDetails);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/doctors');
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    const fetchPersonDetails = async (type, id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/${type}/${id}`);
            return `${response.data.first_name} ${response.data.last_name}`;
        } catch (error) {
            console.error(`Failed to fetch ${type} details with id ${id}:`, error);
            return 'Unknown';
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/removeAppointments/${appointmentId}`);
            setAppointments(prev => prev.filter(appt => appt.id !== appointmentId));
        } catch (error) {
            console.error('Error cancelling appointment:', error);
        }
    };

    const rescheduleAppointment = async (appointmentId, newDate, newReason) => {
        try {
            await axios.put(`http://127.0.0.1:8000/api/appointments/${appointmentId}`, {
                appointment_date: newDate,
                reason: newReason,
                status: 'scheduled'
            });
            fetchAppointments(patientId);
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
        }
    };

    const bookAppointment = async () => {
        const { doctor_id, appointment_date, reason } = newAppointment;
        if (!doctor_id || !appointment_date || !reason) {
            console.error('Please fill all fields');
            return;
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/addAppointments', {
                patient_id: patientId,
                doctor_id: parseInt(doctor_id),
                appointment_date,
                reason,
                status: 'scheduled'
            });
            fetchAppointments(patientId);
            setNewAppointment({ doctor_id: '', appointment_date: '', reason: '' });
            setShowModal(false);
        } catch (error) {
            console.error('Error booking appointment:', error);
        }
    };

    const handleEdit = (appointment) => {
        setActiveEdit(appointment.id);
    };

    const handleChange = (field, value, appointment) => {
        setAppointments(prev =>
            prev.map(appt =>
                appt.id === appointment.id ? { ...appt, [field]: value } : appt
            )
        );
    };

    const saveAppointmentChanges = (appointment) => {
        const { appointment_date, reason } = appointment;
        rescheduleAppointment(appointment.id, appointment_date, reason);
        setActiveEdit(null);
    };

    return (
        <div className="container">
            <h3>Appointment Management</h3>
            <div className="my-4">
                <h4>Your Appointments</h4>
                <div className="table-responsive">
                    <Table bordered hover>
                        <thead className="thead-dark">
                            <tr>
                                <th>Appointment Date</th>
                                <th>Doctor</th>
                                <th>Status</th>
                                <th>Reason</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(appointment => (
                                <tr key={appointment.id}>
                                    <td>
                                        {activeEdit === appointment.id ? (
                                            <Form.Control
                                                type="date"
                                                value={appointment.appointment_date}
                                                onChange={(e) => handleChange('appointment_date', e.target.value, appointment)}
                                            />
                                        ) : (
                                            appointment.appointment_date
                                        )}
                                    </td>
                                    <td>{appointment.doctor}</td>
                                    <td>{appointment.status}</td>
                                    <td>
                                        {activeEdit === appointment.id ? (
                                            <Form.Control
                                                type="text"
                                                value={appointment.reason}
                                                onChange={(e) => handleChange('reason', e.target.value, appointment)}
                                            />
                                        ) : (
                                            appointment.reason
                                        )}
                                    </td>
                                    <td>
                                        {activeEdit === appointment.id ? (
                                            <Button variant="success" className="mr-2" onClick={() => saveAppointmentChanges(appointment)}>Save</Button>
                                        ) : (
                                            <>
                                                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(appointment)}>Edit</Button>
                                                <Button variant="danger" size="sm" onClick={() => cancelAppointment(appointment.id)}>Cancel</Button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
            <div className="my-4">
                <h4>Schedule New Appointment</h4>
                <Button variant="primary" onClick={() => setShowModal(true)}>Book Appointment</Button>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Book Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="doctorSelect">
                            <Form.Label>Select Doctor</Form.Label>
                            <Form.Control
                                as="select"
                                value={newAppointment.doctor_id}
                                onChange={(e) => setNewAppointment({ ...newAppointment, doctor_id: e.target.value })}
                            >
                                <option value="">Select Doctor</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>{`${doctor.first_name} ${doctor.last_name}`}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="appointmentDate">
                            <Form.Label>Appointment Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={newAppointment.appointment_date}
                                onChange={(e) => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="appointmentReason">
                            <Form.Label>Reason</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Reason"
                                value={newAppointment.reason}
                                onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={bookAppointment}>Book Appointment</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default AppointmentManagement;
