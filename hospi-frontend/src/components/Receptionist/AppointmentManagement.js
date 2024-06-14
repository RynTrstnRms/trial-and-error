import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentManagement = () => {
    const [appointments, setAppointments] = useState([]);
    const [newAppointment, setNewAppointment] = useState({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        status: 'scheduled',
        reason: ''
    });
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        // Fetch appointments
        axios.get('http://127.0.0.1:8000/api/appointments')
            .then(response => {
                setAppointments(response.data); // Assuming response.data is an array of appointment objects
            })
            .catch(error => {
                console.error('Error fetching appointments:', error);
            });

        // Fetch doctors
        axios.get('http://127.0.0.1:8000/api/doctors')
            .then(response => {
                setDoctors(response.data); // Assuming response.data is an array of doctor objects
            })
            .catch(error => {
                console.error('Error fetching doctors:', error);
            });

        // Fetch patients
        axios.get('http://127.0.0.1:8000/api/patients')
            .then(response => {
                setPatients(response.data); // Assuming response.data is an array of patient objects
            })
            .catch(error => {
                console.error('Error fetching patients:', error);
            });
    }, []);

    const cancelAppointment = (appointmentId) => {
        axios.delete(`http://127.0.0.1:8000/api/removeAppointments/${appointmentId}`)
            .then(response => {
                const updatedAppointments = appointments.filter(appointment =>
                    appointment.id !== appointmentId
                );
                setAppointments(updatedAppointments);
            })
            .catch(error => {
                console.error('Error cancelling appointment:', error);
            });
    };

    const getDoctorName = (doctorId) => {
        const doctor = doctors.find(doctor => doctor.id === doctorId);
        return doctor ? `${doctor.first_name} ${doctor.last_name}` : 'Unknown Doctor';
    };

    const getPatientName = (patientId) => {
        const patient = patients.find(patient => patient.id === patientId);
        return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';
    };

    const handleAddAppointment = () => {
        axios.post('http://127.0.0.1:8000/api/addAppointments', newAppointment)
            .then(response => {
                const addedAppointment = response.data; // Assuming response.data is the newly created appointment object
                setAppointments([...appointments, addedAppointment]);
                setNewAppointment({
                    patient_id: '',
                    doctor_id: '',
                    appointment_date: '',
                    status: 'scheduled',
                    reason: ''
                });
    
                // After adding, fetch the updated appointments list
                axios.get('http://127.0.0.1:8000/api/appointments')
                    .then(response => {
                        setAppointments(response.data); // Update appointments state with the latest data
                    })
                    .catch(error => {
                        console.error('Error fetching appointments:', error);
                    });
            })
            .catch(error => {
                console.error('Error adding appointment:', error);
            });
    };
    
    

    return (
<div className="container">
    <h3>Appointment Management</h3>
    <div className="my-4">
        <h4>Your Appointments</h4>
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
                                <button className="btn btn-danger btn-sm mr-2" onClick={() => cancelAppointment(appointment.id)}>Cancel</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
    <div className="my-4">
        <h4>Schedule New Appointment</h4>
        <div className="form-group">
            <input
                type="datetime-local"
                className="form-control"
                value={newAppointment.appointment_date}
                onChange={(e) => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })}
            />
        </div>
        <div className="form-group">
            <select
                className="form-control"
                value={newAppointment.doctor_id}
                onChange={(e) => setNewAppointment({ ...newAppointment, doctor_id: e.target.value })}
            >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>{`${doctor.first_name} ${doctor.last_name}`}</option>
                ))}
            </select>
        </div>
        <div className="form-group">
            <select
                className="form-control"
                value={newAppointment.patient_id}
                onChange={(e) => setNewAppointment({ ...newAppointment, patient_id: e.target.value })}
            >
                <option value="">Select Patient</option>
                {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>{`${patient.first_name} ${patient.last_name}`}</option>
                ))}
            </select>
        </div>
        <div className="form-group">
            <input
                type="text"
                className="form-control"
                placeholder="Reason"
                value={newAppointment.reason}
                onChange={(e) => setNewAppointment({ ...newAppointment, reason: e.target.value })}
            />
        </div>
        <button className="btn btn-success" onClick={handleAddAppointment}>Schedule Appointment</button>
    </div>
</div>

    );
};

export default AppointmentManagement;
