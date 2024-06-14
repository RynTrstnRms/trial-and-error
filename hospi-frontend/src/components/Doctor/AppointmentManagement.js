import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AppointmentManagement = ({ currentUser }) => {
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [editAppointmentId, setEditAppointmentId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    status: '',
    reason: '',
    appointment_date: '',
    // Add other fields as needed (e.g., patient_id, other details)
  });

  useEffect(() => {
    const fetchDoctorId = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/doctorsEmail/${currentUser.email}`);
        const doctorData = response.data;
        setDoctorId(doctorData.id);
      } catch (error) {
        console.error('Error fetching doctor ID:', error);
      }
    };

    if (currentUser) {
      fetchDoctorId();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (doctorId) {
          const response = await axios.get(`http://127.0.0.1:8000/api/appointmentsDoctor/${doctorId}`);
          const appointmentsData = response.data;

          const patientIds = [...new Set(appointmentsData.map(appointment => appointment.patient_id))];

          const patientsResponse = await Promise.all(patientIds.map(patientId =>
            axios.get(`http://127.0.0.1:8000/api/patients/${patientId}`)
          ));

          const patientsData = patientsResponse.reduce((acc, response) => {
            const patient = response.data;
            acc[patient.id] = { first_name: patient.first_name, last_name: patient.last_name };
            return acc;
          }, {});

          const combinedData = appointmentsData.map(appointment => ({
            ...appointment,
            patient_firstname: patientsData[appointment.patient_id]?.first_name || '',
            patient_lastname: patientsData[appointment.patient_id]?.last_name || ''
          }));

          setAppointments(combinedData);
        }
      } catch (error) {
        console.error('Error fetching appointments or patient data:', error);
      }
    };

    if (doctorId) {
      fetchAppointments();
    }
  }, [doctorId]);

  const updateAppointmentStatus = async (id, updatedStatus) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/appointments/${id}`, { status: updatedStatus });
      setAppointments(appointments.map(appointment =>
        appointment.id === id ? { ...appointment, status: updatedStatus } : appointment
      ));
    } catch (error) {
      console.error('Error updating appointment status:', error);
    }
  };

  const handleEdit = (appointmentId) => {
    setEditAppointmentId(appointmentId);
    const appointmentToEdit = appointments.find(appointment => appointment.id === appointmentId);
    setEditFormData({
      status: appointmentToEdit.status,
      reason: appointmentToEdit.reason,
      appointment_date: appointmentToEdit.appointment_date,
      // Populate other fields as needed
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      // Format the date to "yyyy-MM-dd" format
      const formattedDate = editFormData.appointment_date.split(' ')[0]; // Extracts "yyyy-MM-dd"
      
      await axios.put(`http://127.0.0.1:8000/api/appointments/${id}`, {
        ...editFormData,
        appointment_date: formattedDate, // Update appointment_date with formatted date
      });
  
      setAppointments(appointments.map(appointment =>
        appointment.id === id ? { ...appointment, ...editFormData } : appointment
      ));
      setEditAppointmentId(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div class="container mt-5">
    <h2>Doctor's Schedule</h2>
    <table class="table table-striped table-bordered">
      <thead class="thead-dark">
        <tr>
          <th>Date</th>
          <th>Patient First Name</th>
          <th>Patient Last Name</th>
          <th>Status</th>
          <th>Reason</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {appointments.map(appointment => (
          <tr key={appointment.id}>
            <td>{editAppointmentId === appointment.id ? (
              <input
                type="date"
                class="form-control"
                name="appointment_date"
                value={editFormData.appointment_date}
                onChange={handleEditFormChange}
              />
            ) : appointment.appointment_date}</td>
            <td>{appointment.patient_firstname}</td>
            <td>{appointment.patient_lastname}</td>
            <td>{editAppointmentId === appointment.id ? (
              <select
                class="form-control"
                name="status"
                value={editFormData.status}
                onChange={handleEditFormChange}
              >
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            ) : appointment.status}</td>
            <td>{editAppointmentId === appointment.id ? (
              <input
                type="text"
                class="form-control"
                name="reason"
                value={editFormData.reason}
                onChange={handleEditFormChange}
              />
            ) : appointment.reason}</td>
            <td>
              {editAppointmentId === appointment.id ? (
                <button class="btn btn-primary btn-sm" onClick={() => handleSaveEdit(appointment.id)}>Save</button>
              ) : (
                <>
                  <button class="btn btn-info btn-sm" onClick={() => handleEdit(appointment.id)}>Edit</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default AppointmentManagement;
