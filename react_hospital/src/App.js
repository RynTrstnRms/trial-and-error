import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Registration from './components/Registration';
import AdminDashboard from './components/Admin/AdminDashboard';
import PatientDashboard from './components/Patient/PatientDashboard';
import DoctorDashboard from './components/Doctor/DoctorDashboard';
import ReceptionistDashboard from './components/Receptionist/ReceptionistDashboard';
import UserManagement from './components/Admin/UserManagement';
import DoctorManagement from './components/Admin/DoctorManagement';
import PatientManagement from './components/Admin/PatientManagement';
import AppointmentManagement from './components/Admin/AppointmentManagement';
import MedicalRecordsManagement from './components/Admin/MedicalRecordsManagement';
import DoctorManagementDoctor from './components/Doctor/DoctorManagement';
import PatientManagementDoctor from './components/Doctor/PatientManagement';
import AppointmentManagementDoctor from './components/Doctor/AppointmentManagement';
import MedicalRecordsManagementDoctor from './components/Doctor/MedicalRecordsManagement';
import AppointmentManagementPatient from './components/Patient/AppointmentManagement';
import MedicalRecordsManagementPatient from './components/Patient/MedicalRecordsManagement';
import PatientManagementReceptionist from './components/Receptionist/PatientManagement';
import AppointmentManagementReceptionist from './components/Receptionist/AppointmentManagement';
import axios from 'axios';


const App = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  const addUser = (user) => {
    const newUser = { ...user, id: users.length ? users[users.length - 1].id + 1 : 1 };
    setUsers([...users, newUser]);
  };

  const loginUser = (user) => {
    setCurrentUser(user);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('/users');
        setUsers(usersResponse.data);

        const patientsResponse = await axios.get('/patients');
        setPatients(patientsResponse.data);

        const doctorsResponse = await axios.get('/doctors');
        setDoctors(doctorsResponse.data);

        const appointmentsResponse = await axios.get('/appointments');
        setAppointments(appointmentsResponse.data);

        const medicalRecordsResponse = await axios.get('/medical_records');
        setMedicalRecords(medicalRecordsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login users={users} loginUser={loginUser} />} />
        <Route path="/register" element={<Registration addUser={addUser} />} />
        <Route path="/admindashboard/*" element={<AdminDashboard currentUser={currentUser} users={users} setUsers={setUsers} />}>
          <Route path="users" element={<UserManagement users={users} setUsers={setUsers} />} />
          <Route path="doctors" element={<DoctorManagement />} />
          <Route path="patients" element={<PatientManagement />} />
          <Route path="appointments" element={<AppointmentManagement />} />
          <Route path="records" element={<MedicalRecordsManagement />} />
        </Route>
        <Route path="/patientdashboard" element={<PatientDashboard currentUser={currentUser} />} />
        <Route path="/patientdashboard/*" element={<PatientDashboard currentUser={currentUser}/>}>
          <Route path="appointments" element={<AppointmentManagementPatient currentUser={currentUser}/>} />
          <Route path="records" element={<MedicalRecordsManagementPatient currentUser={currentUser}/>} />
        </Route>
        <Route path="/doctordashboard/*" element={<DoctorDashboard currentUser={currentUser}/>}>
          <Route path="doctors" element={<DoctorManagementDoctor currentUser={currentUser} doctors={doctors} setDoctors={setDoctors}/>} />
          <Route path="patients" element={<PatientManagementDoctor />} />
          <Route path="appointments" element={<AppointmentManagementDoctor currentUser={currentUser}/>} />
          <Route path="records" element={<MedicalRecordsManagementDoctor currentUser={currentUser}/>} />
        </Route>
        <Route path="/receptionistdashboard/*" element={<ReceptionistDashboard currentUser={currentUser}/>}>
          <Route path="patients" element={<PatientManagementReceptionist />} />
          <Route path="appointments" element={<AppointmentManagementReceptionist doctors={doctors}/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
