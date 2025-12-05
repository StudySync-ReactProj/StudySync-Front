// import { useState } from "react";
import NavBar from "../../components/Header/Header.jsx";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";

const HomePage = ({ onLogout }) => {
    return (
        <div>
            <NavBar onLogout={onLogout} />
            {/* homepage content */}
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <h1>Welcome to StudySync!</h1>
                <p>You have successfully logged in.</p>
            </div>
            <MainTitle title="Good morning!" />

        </div>
    );
}

export default HomePage;
