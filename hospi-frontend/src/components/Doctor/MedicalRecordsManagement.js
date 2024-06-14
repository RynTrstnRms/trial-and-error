import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MedicalRecordManagement = ({ currentUser }) => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [doctorId, setDoctorId] = useState(null);
  const [editRecordId, setEditRecordId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    visit_date: '',
    diagnosis: '',
    treatment: '',
    notes: '',
  });

  const fetchMedicalRecords = async () => {
    try {
      if (doctorId) {
        const response = await axios.get(`http://127.0.0.1:8000/api/medical_recordsDoctor/${doctorId}`);
        const medicalRecordsData = response.data;

        const patientIds = [...new Set(medicalRecordsData.map(record => record.patient_id))];

        const patientsResponse = await Promise.all(patientIds.map(patientId =>
          axios.get(`http://127.0.0.1:8000/api/patients/${patientId}`)
        ));

        const patientsData = patientsResponse.reduce((acc, response) => {
          const patient = response.data;
          acc[patient.id] = { first_name: patient.first_name, last_name: patient.last_name };
          return acc;
        }, {});

        const combinedData = medicalRecordsData.map(record => ({
          ...record,
          patient_firstname: patientsData[record.patient_id]?.first_name || '',
          patient_lastname: patientsData[record.patient_id]?.last_name || ''
        }));

        setMedicalRecords(combinedData);
      }
    } catch (error) {
      console.error('Error fetching medical records or patient data:', error);
    }
  };

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
    if (doctorId) {
      fetchMedicalRecords();
    }
  }, [doctorId]);

  const handleEdit = (recordId) => {
    setEditRecordId(recordId);
    const recordToEdit = medicalRecords.find(record => record.id === recordId);
    setEditFormData({
      visit_date: recordToEdit.visit_date,
      diagnosis: recordToEdit.diagnosis,
      treatment: recordToEdit.treatment,
      notes: recordToEdit.notes,
      // Populate other fields as needed
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`http://127.0.0.1:8000/api/medicalRecords/${id}`, editFormData);
      fetchMedicalRecords(); // Refresh list after edit
      setEditRecordId(null);
    } catch (error) {
      console.error('Error updating medical record:', error);
    }
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container mt-5">
      <h2>Medical Record Management</h2>
      <table className="table table-striped table-bordered">
        <thead className="thead-dark">
          <tr>
            <th>Visit Date</th>
            <th>Patient First Name</th>
            <th>Patient Last Name</th>
            <th>Diagnosis</th>
            <th>Treatment</th>
            <th>Notes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicalRecords.map(record => (
            <tr key={record.id}>
              <td>{editRecordId === record.id ? (
                <input
                  type="date"
                  className="form-control"
                  name="visit_date"
                  value={editFormData.visit_date}
                  onChange={handleEditFormChange}
                />
              ) : record.visit_date}</td>
              <td>{record.patient_firstname}</td>
              <td>{record.patient_lastname}</td>
              <td>{editRecordId === record.id ? (
                <input
                  type="text"
                  className="form-control"
                  name="diagnosis"
                  value={editFormData.diagnosis}
                  onChange={handleEditFormChange}
                />
              ) : record.diagnosis}</td>
              <td>{editRecordId === record.id ? (
                <input
                  type="text"
                  className="form-control"
                  name="treatment"
                  value={editFormData.treatment}
                  onChange={handleEditFormChange}
                />
              ) : record.treatment}</td>
              <td>{editRecordId === record.id ? (
                <input
                  type="text"
                  className="form-control"
                  name="notes"
                  value={editFormData.notes}
                  onChange={handleEditFormChange}
                />
              ) : record.notes}</td>
              <td>
                {editRecordId === record.id ? (
                  <button className="btn btn-primary btn-sm" onClick={() => handleSaveEdit(record.id)}>Save</button>
                ) : (
                  <button className="btn btn-info btn-sm" onClick={() => handleEdit(record.id)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MedicalRecordManagement;
