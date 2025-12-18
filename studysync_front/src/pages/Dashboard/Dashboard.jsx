// import { useState } from "react";
import { useUser } from "../../Contex/UserContex";
import NavBar from "../../components/Header/Header.jsx";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import CardContainerComp from "../../components/CardContainer/CardContainer.jsx";

const Dashboard = ({ onLogout, onGoToTasks }) => {
    const { user } = useUser();
    
    return (
        <div>
            <NavBar onLogout={onLogout} onGoToTasks={onGoToTasks} />
            <MainTitle title={`Good morning, ${user?.username || 'User'}!`} />
            <div>
                <CardContainerComp />
            </div>
        </div>
    );
}

export default Dashboard;
