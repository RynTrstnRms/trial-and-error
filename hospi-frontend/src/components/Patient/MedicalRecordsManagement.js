import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MedicalRecordsManagement = ({ currentUser }) => {
    const [medicalRecords, setMedicalRecords] = useState([]);

    useEffect(() => {
        fetchPatientId();
    }, [currentUser.email]);

    const fetchPatientId = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/patientsEmail/${currentUser.email}`);
            const patientId = response.data.id; // Assuming the endpoint returns the patient's ID
            fetchMedicalRecords(patientId);
        } catch (error) {
            console.error('Failed to fetch patient ID:', error);
        }
    };

    const fetchMedicalRecords = async (patientId) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/medical_recordsPatients/${patientId}`);
            const recordsWithDetails = await Promise.all(
                response.data.map(async record => {
                    // Fetch doctor details for each medical record
                    const doctorName = await fetchPersonDetails('doctors', record.doctor_id);
                    return {
                        ...record,
                        doctor: doctorName
                    };
                })
            );
            setMedicalRecords(recordsWithDetails);
        } catch (error) {
            console.error('Failed to fetch medical records:', error);
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

    return (
        <div className="container">
            <h3>Medical Records Management</h3>
            <div>
                <h4>All Medical Records</h4>
                <div className='table-responsive'>
                <table className="table table-bordered table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Visit Date</th>
                            <th>Doctor</th>
                            <th>Diagnosis</th>
                            <th>Treatment</th>
                            <th>Notes</th>
                            {/* You can add action buttons here if needed */}
                        </tr>
                    </thead>
                    <tbody>
                        {medicalRecords.map(record => (
                            <tr key={record.id}>
                                <td>{record.visit_date}</td>
                                <td>{record.doctor}</td> {/* Display doctor's name */}
                                <td>{record.diagnosis}</td>
                                <td>{record.treatment}</td>
                                <td>{record.notes}</td>
                                {/* You can add action buttons here if needed */}
                            </tr>
                        ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
};

export default MedicalRecordsManagement;
