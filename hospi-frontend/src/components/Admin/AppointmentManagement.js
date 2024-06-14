import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentManagement = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/appointments');
            const appointmentsWithDetails = await Promise.all(
                response.data.map(async appointment => {
                    // Fetch patient and doctor details
                    const [patient, doctor] = await Promise.all([
                        fetchPersonDetails('patients', appointment.patient_id),
                        fetchPersonDetails('doctors', appointment.doctor_id)
                    ]);

                    return {
                        ...appointment,
                        patient: patient,
                        doctor: doctor
                    };
                })
            );
            setAppointments(appointmentsWithDetails);
        } catch (error) {
            console.error('Failed to fetch appointments:', error);
        }
    };

    const fetchPersonDetails = async (type, id) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/${type}/${id}`);
            return `${response.data.first_name} ${response.data.last_name}`;
        } catch (error) {
            console.error(`Failed to fetch ${type} details with id ${id}:`, error);
            return '';
        }
    };

    return (
        <div className="container">
        <h3>Appointment Management</h3>
        <div>
            <h4>All Appointments</h4>
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Appointment Date</th>
                            <th>Patient</th>
                            <th>Doctor</th>
                            <th>Status</th>
                            <th>Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map(appointment => (
                            <tr key={appointment.id}>
                                <td>{appointment.appointment_date}</td>
                                <td>{appointment.patient}</td> {/* Display patient's full name */}
                                <td>{appointment.doctor}</td> {/* Display doctor's full name */}
                                <td>{appointment.status}</td>
                                <td>{appointment.reason}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>    
    );
};

export default AppointmentManagement;
