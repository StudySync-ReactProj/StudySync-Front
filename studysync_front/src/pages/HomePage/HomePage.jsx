// import { useState } from "react";
import NavBar from "../../components/Header/Header.jsx";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import CardContainerComp from "../../components/CardContainer/CardContainer.jsx";

const HomePage = ({ onLogout }) => {
    return (
        <div>
            <NavBar onLogout={onLogout} />
            <MainTitle title="Good morning!" />
            <div>
                <CardContainerComp />
            </div>
        </div>
    );
}

export default HomePage;
