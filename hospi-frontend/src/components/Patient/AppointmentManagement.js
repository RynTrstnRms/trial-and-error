import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AppointmentManagement = ({ currentUser }) => {
    const [appointments, setAppointments] = useState([]);
    const [patientId, setPatientId] = useState(null); // State to hold patientId
    const [doctors, setDoctors] = useState([]); // State to hold list of doctors
    const [newAppointment, setNewAppointment] = useState({
        doctor_id: '',
        appointment_date: '',
        reason: ''
    });
    const [activeEdit, setActiveEdit] = useState(null); // State to track active editing appointment

    useEffect(() => {
        fetchPatientId(); // Fetch patientId based on currentUser.email
        fetchDoctors(); // Fetch list of doctors
    }, [currentUser.email]);

    useEffect(() => {
        if (patientId) {
            fetchAppointments(patientId); // Fetch appointments once patientId is available
        }
    }, [patientId]);

    const fetchPatientId = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/patientsEmail/${currentUser.email}`);
            const fetchedPatientId = response.data.id; // Assuming the endpoint returns the patient's ID
            setPatientId(fetchedPatientId); // Set patientId state
        } catch (error) {
            console.error('Failed to fetch patient ID:', error);
        }
    };

    const fetchAppointments = async (patientId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/appointmentsPatient/${patientId}`);
            const appointmentsWithDoctorDetails = await Promise.all(
                response.data.map(async appointment => {
                    // Fetch doctor details for each appointment
                    const doctorName = await fetchPersonDetails('doctors', appointment.doctor_id);
                    return {
                        ...appointment,
                        doctor: doctorName
                    };
                })
            );
            setAppointments(appointmentsWithDoctorDetails);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
    };

    const fetchDoctors = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/doctors`);
            setDoctors(response.data); // Assuming response.data is an array of doctor objects
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
            return 'Unknown'; // or handle error state appropriately
        }
    };

    const cancelAppointment = (appointmentId) => {
        axios.delete(`http://127.0.0.1:8000/api/removeAppointments/${appointmentId}`)
            .then(response => {
                const updatedAppointments = appointments.map(appointment =>
                    appointment.id === appointmentId ? { ...appointment, status: 'cancelled' } : appointment
                );
                setAppointments(updatedAppointments);
                fetchAppointments(patientId);
                fetchDoctors();
                setActiveEdit(null); // Reset active editing state
            })
            .catch(error => {
                console.error('Error cancelling appointment:', error);
            });
    };

    const rescheduleAppointment = (appointmentId, newDate, newStatus, newReason) => {
        axios.put(`http://127.0.0.1:8000/api/appointments/${appointmentId}`, {
            appointment_date: newDate,
            status: newStatus,
            reason: newReason
        })
        .then(response => {
            const updatedAppointments = appointments.map(appointment =>
                appointment.id === appointmentId ? { ...appointment, appointment_date: newDate, status: newStatus, reason: newReason } : appointment
            );
            setAppointments(updatedAppointments);
            setActiveEdit(null); // Reset active editing state
        })
        .catch(error => {
            console.error('Error rescheduling appointment:', error);
        });
    };

    const bookAppointment = () => {
        const { doctor_id, appointment_date, reason } = newAppointment;

        if (!doctor_id || !appointment_date || !reason) {
            console.error('Please fill all fields'); // Add proper validation
            return;
        }

        const appointmentData = {
            patient_id: patientId,
            doctor_id: parseInt(doctor_id), // Ensure doctor_id is parsed to integer
            appointment_date: appointment_date,
            reason: reason,
            status: 'scheduled'
        };

        axios.post('http://127.0.0.1:8000/api/addAppointments', appointmentData)
            .then(response => {
                const addedAppointment = response.data; // Assuming response.data is the newly created appointment object
                setAppointments([...appointments, addedAppointment]);
                fetchAppointments(patientId);
                fetchDoctors();
                setNewAppointment({
                    doctor_id: '',
                    appointment_date: '',
                    reason: ''
                });
            })
            .catch(error => {
                console.error('Error booking appointment:', error);
            });
    };

    const handleEdit = (appointment) => {
        setActiveEdit(appointment.id); // Set the active edit appointment ID
    };

    const handleDateChange = (value, appointment) => {
        const updatedAppointments = appointments.map(appt =>
            appt.id === appointment.id ? { ...appt, updatedDate: value !== appointment.appointment_date ? value : appointment.appointment_date } : appt
        );
        setAppointments(updatedAppointments);
    };
    
    const handleStatusChange = (value, appointment) => {
        const updatedAppointments = appointments.map(appt =>
            appt.id === appointment.id ? { ...appt, updatedStatus: value !== appointment.status ? value : appointment.status } : appt
        );
        setAppointments(updatedAppointments);
    };
    
    const handleReasonChange = (value, appointment) => {
        const updatedAppointments = appointments.map(appt =>
            appt.id === appointment.id ? { ...appt, updatedReason: value !== appointment.reason ? value : appointment.reason } : appt
        );
        setAppointments(updatedAppointments);
    };
    

    const saveAppointmentChanges = (appointment) => {
        const { updatedDate, updatedStatus, updatedReason } = appointment;
    
        // Format the date to "yyyy-MM-dd" format
        const formattedDate = updatedDate.split(' ')[0]; 
    
        // Update appointment on the server
        axios.put(`http://127.0.0.1:8000/api/appointments/${appointment.id}`, {
            appointment_date: formattedDate,
            status: updatedStatus,
            reason: updatedReason
        })
        .then(response => {
            // Update locally after successful server update
            setAppointments(prevAppointments => 
                prevAppointments.map(appt =>
                    appt.id === appointment.id ? { ...appt, isEditing: false, appointment_date: formattedDate, status: updatedStatus, reason: updatedReason } : appt
                )
            );

            // Reset activeEdit state to null
            setActiveEdit(null);
    
            // Fetch appointments and doctors again to update the local state
            fetchAppointments(patientId); // Using the latest patientId
            fetchDoctors();
        })
        .catch(error => {
            console.error('Error rescheduling appointment:', error);
        });
    };
    

    return (
        <div className="container">
        <h3>Appointment Management</h3>
        <div className="my-4">
            <h4>Your Appointments</h4>
            <div className="table-responsive">
                <table className="table table-bordered table-hover">
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
                                        <input
                                            type="date"
                                            className="form-control"
                                            value={appointment.updatedDate || appointment.appointment_date}
                                            onChange={(e) => handleDateChange(e.target.value, appointment)}
                                        />
                                    ) : (
                                        appointment.appointment_date
                                    )}
                                </td>
                                <td>{appointment.doctor}</td>
                                <td>
                                    {activeEdit === appointment.id ? (
                                        <select
                                            className="form-control"
                                            value={appointment.updatedStatus || appointment.status}
                                            onChange={(e) => handleStatusChange(e.target.value, appointment)}
                                        >
                                            <option value="scheduled">Scheduled</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                            {/* Add other status options as needed */}
                                        </select>
                                    ) : (
                                        appointment.status
                                    )}
                                </td>
                                <td>
                                    {activeEdit === appointment.id ? (
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={appointment.updatedReason || appointment.reason}
                                            onChange={(e) => handleReasonChange(e.target.value, appointment)}
                                        />
                                    ) : (
                                        appointment.reason
                                    )}
                                </td>
                                <td>
                                    {activeEdit === appointment.id ? (
                                        <button className="btn btn-success mr-2" onClick={() => saveAppointmentChanges(appointment)}>Save</button>
                                    ) : (
                                        <>
                                            <button className="btn btn-primary mr-2" onClick={() => handleEdit(appointment)}>Edit</button>
                                            <button className="btn btn-danger" onClick={() => cancelAppointment(appointment.id)}>Delete</button>
                                        </>
                                    )}
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
                <input
                    type="date"
                    className="form-control"
                    value={newAppointment.appointment_date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, appointment_date: e.target.value })}
                />
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
            <button className="btn btn-primary" onClick={bookAppointment}>Book Appointment</button>
        </div>
    </div>    
    );
};

export default AppointmentManagement;
