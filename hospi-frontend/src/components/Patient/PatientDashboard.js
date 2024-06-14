import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faStethoscope, faUserInjured, faCalendarAlt, faFileMedical, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const PatientDashboard = ({ currentUser, users, setUsers }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform logout action here (e.g., clear session, reset authentication state)
        navigate('/');
    };

    React.useEffect(() => {
        if (!currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    React.useEffect(() => {
        if (currentUser) {
            navigate('appointments');
        }
    }, []);

    return (
        <div className="container-fluid">
            <div className="row">
                <nav className="col-md-2 d-none d-md-block bg-dark sidebar position-fixed" style={{ height: "100%", top: 0, left: 0, zIndex: 1030 }}>
                    <div className="sidebar-sticky">
                        <ul className="nav flex-column mt-5">
                            <li className="nav-item">
                                <Link to="appointments" className="nav-link text-white">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> Appointment Management
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to="records" className="nav-link text-white">
                                    <FontAwesomeIcon icon={faFileMedical} className="mr-2" /> Medical Records Management
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>

                <main role="main" className="col-md-10 ml-md-auto px-4 container" style={{ marginLeft: "16.6%"}}>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
                        <div className="container-fluid">
                            <h2 className="navbar-brand">Patient Dashboard</h2>
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse d-flex justify-content-end" id="navbarNav">
                                <ul className="navbar-nav">
                                    <li className="nav-item pe-3">
                                        <span className="navbar-text fs-5">Welcome, {currentUser.name}</span>
                                    </li>
                                    <li className="nav-item">
                                        <button className="btn btn-outline-danger" onClick={handleLogout}>
                                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-1" /> Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>

                    <div className="container-fluid content mt-4">
                        <Outlet context={{ users, setUsers }} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default PatientDashboard;
