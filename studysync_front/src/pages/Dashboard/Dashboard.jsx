// import { useState } from "react";
import NavBar from "../../components/Header/Header.jsx";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import CardContainerComp from "../../components/CardContainer/CardContainer.jsx";

const Dashboard = ({ onLogout, onGoToTasks }) => {
    return (
        <div>
            <NavBar onLogout={onLogout} onGoToTasks={onGoToTasks} />
            <MainTitle title="Good morning!" />
            <div>
                <CardContainerComp />
            </div>
        </div>
    );
}

export default Dashboard;
