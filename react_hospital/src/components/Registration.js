import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

const Registration = () => {
  const [role, setRole] = useState('patient');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const navigate = useNavigate();

  const handleRegistration = () => {
    const name = `${firstName} ${lastName}`;
    const userData = {
      name,
      email,
      password,
      role,
    };

    // First send request to /login endpoint
    fetch('http://127.0.0.1:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.errors) {
          alert('Error during login: ' + JSON.stringify(data.errors));
        } else {
          // Now send request to either /patient or /doctor endpoint
          if (role === 'patient') {
            registerPatient();
          } else if (role === 'doctor') {
            registerDoctor();
          }
        }
      })
      .catch(error => console.error('Error during login:', error));
  };

  const registerPatient = () => {
    const patientData = {
      first_name: firstName,
      last_name: lastName,
      date_of_birth: dateOfBirth,
      gender,
      address,
      phone,
      email,
      emergency_contact: emergencyContact,
      medical_history: medicalHistory,
    };

    fetch('http://127.0.0.1:8000/api/addPatients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.errors) {
          alert('Error registering patient: ' + JSON.stringify(data.errors));
        } else {
          alert('Patient account created successfully! Please log in.');
          navigate('/');
        }
      })
      .catch(error => console.error('Error registering patient:', error));
  };

  const registerDoctor = () => {
    const doctorData = {
      first_name: firstName,
      last_name: lastName,
      specialization,
      license_number: licenseNumber,
      phone,
      email,
    };

    fetch('http://127.0.0.1:8000/api/addDoctors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(doctorData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.errors) {
          alert('Error registering doctor: ' + JSON.stringify(data.errors));
        } else {
          alert('Doctor account created successfully! Please log in.');
          navigate('/');
        }
      })
      .catch(error => console.error('Error registering doctor:', error));
  };

  return (
    <section className="" style={{ backgroundColor: '#1679AB' }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-10">
            <div className="card" style={{ borderRadius: '1rem', backgroundColor: '#f0f0f0' }}>
              <div className="row g-0">
                <div className="">
                  <div className="card-body p-4 p-lg-5 text-black">

                    <form>
                      <h2 className="fw-bold mb-3 pb-3" style={{ letterSpacing: '1px' }}>Create your Account</h2>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="role">Role</label>
                        <select
                          id="role"
                          className="form-control form-control-lg"
                          value={role}
                          onChange={e => setRole(e.target.value)}
                        >
                          <option value="patient">Patient</option>
                          <option value="doctor">Doctor</option>
                        </select>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="firstName">First Name</label>
                            <input
                              type="text"
                              id="firstName"
                              className="form-control form-control-lg"
                              value={firstName}
                              onChange={e => setFirstName(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="lastName">Last Name</label>
                            <input
                              type="text"
                              id="lastName"
                              className="form-control form-control-lg"
                              value={lastName}
                              onChange={e => setLastName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {role === 'patient' && (
                        <>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="dateOfBirth">Date of Birth</label>
                                <input
                                  type="date"
                                  id="dateOfBirth"
                                  className="form-control form-control-lg"
                                  value={dateOfBirth}
                                  onChange={e => setDateOfBirth(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="gender">Gender</label>
                                <select
                                  id="gender"
                                  className="form-control form-control-lg"
                                  value={gender}
                                  onChange={e => setGender(e.target.value)}
                                >
                                  <option value="" disabled>Select gender</option>
                                  <option value="Male">Male</option>
                                  <option value="Female">Female</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="address">Address</label>
                                <input
                                  type="text"
                                  id="address"
                                  className="form-control form-control-lg"
                                  value={address}
                                  onChange={e => setAddress(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="emergencyContact">Emergency Contact</label>
                                <input
                                  type="text"
                                  id="emergencyContact"
                                  className="form-control form-control-lg"
                                  value={emergencyContact}
                                  onChange={e => setEmergencyContact(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="medicalHistory">Medical History</label>
                            <textarea
                              type="text"
                              id="medicalHistory"
                              className="form-control form-control-lg"
                              value={medicalHistory}
                              onChange={e => setMedicalHistory(e.target.value)}
                            />
                          </div>
                        </>
                      )}

                      {role === 'doctor' && (
                        <>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="specialization">Specialization</label>
                                <input
                                  type="text"
                                  id="specialization"
                                  className="form-control form-control-lg"
                                  value={specialization}
                                  onChange={e => setSpecialization(e.target.value)}
                                />
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="licenseNumber">License Number</label>
                                <input
                                  type="text"
                                  id="licenseNumber"
                                  className="form-control form-control-lg"
                                  value={licenseNumber}
                                  onChange={e => setLicenseNumber(e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="phone">Phone</label>
                            <input
                              type="tel"
                              id="phone"
                              className="form-control form-control-lg"
                              value={phone}
                              onChange={e => setPhone(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-outline mb-4">
                            <label className="form-label" htmlFor="email">Email</label>
                            <input
                              type="email"
                              id="email"
                              className="form-control form-control-lg"
                              value={email}
                              onChange={e => setEmail(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="password">Password</label>
                        <input
                          type="password"
                          id="password"
                          className="form-control form-control-lg"
                          value={password}
                          onChange={e => setPassword(e.target.value)}
                        />
                      </div>

                      <button className="btn btn-dark btn-lg btn-block" type="button" onClick={handleRegistration}>Register</button>
                      <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>Already have an account? <a href="/" style={{ color: '#393f81' }}>Login here</a></p>
                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;
