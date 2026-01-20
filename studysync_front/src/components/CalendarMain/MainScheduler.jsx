// src/components/Calendar/MainScheduler.jsx
import React from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import { enUS } from "date-fns/locale";
import { SchedulerWrapper } from "./MainScheduler.style";


const MainScheduler = ({ selectedDate, events = [] }) => {
  return (
    <SchedulerWrapper>
      <Scheduler
        view="week"
        events={events} // Receives events from the JS file through parent
        selectedDate={selectedDate} // Synced with the mini calendar
        agenda={null} // Hide the Agenda tab

        // Display settings (optional)
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