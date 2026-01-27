// src/components/Calendar/MainScheduler.jsx
import React from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import { SchedulerWrapper } from "./MainScheduler.style";

const MainScheduler = ({ selectedDate, events = [] }) => {

  return (
    <SchedulerWrapper>
      <Scheduler
        view="week"
        events={events}
        selectedDate={selectedDate}
        onEventClick={(event) => {
          console.log("Event clicked:", event);
        }}
        week={{
          weekDays: [0, 1, 2, 3, 4, 5],
          weekStartOn: 0,
          startHour: 8,
          endHour: 20,
          step: 60,
        }}
      />
    </SchedulerWrapper>
  );
};
export default MainScheduler;