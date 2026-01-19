import React, { useState } from "react";
import MainScheduler from "../../components/CalendarMain/MainScheduler.jsx";
import CalendarSidebar from "../../components/CalendarSideBar/CalendarSidebar.jsx";
import { Box } from "@mui/material";
import MainTitle from "../../components/MainTitle/MainTitle.jsx";
import Wrapper from "../../components/Wrapper/Wrapper.jsx";
import { events } from "../../data/calendarData";

const CalendarSync = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    return (
        <>
            <Wrapper >
                <MainTitle title="CalendarSync" />
                <Box sx={{ display: "flex", height: "100vh", bgcolor: "#f5f7fa" }}>
                    <CalendarSidebar
                        currentDate={currentDate}
                        onDateChange={setCurrentDate}
                        events={events}
                    />
                    <Box sx={{ flex: 1, p: 3, overflow: "hidden" }}>
                        <MainScheduler
                            selectedDate={currentDate}
                            events={events}
                        />
                    </Box>
                </Box>
            </Wrapper >
        </>
    );
};

export default CalendarSync;