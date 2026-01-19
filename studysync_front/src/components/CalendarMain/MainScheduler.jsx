// src/components/Calendar/MainScheduler.jsx
import React from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import { enUS } from "date-fns/locale";

const MainScheduler = ({ selectedDate, events = [] }) => {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Scheduler
        view="week"
        events={events} // מקבל את האירועים מקובץ ה-JS דרך האבא
        selectedDate={selectedDate} // מסונכרן עם הלוח הקטן
        agenda={null} // הסתרת לשונית ה-Agenda
        
        // הגדרות תצוגה (אופציונלי)
        week={{
            weekDays: [0, 1, 2, 3, 4, 5], 
            weekStartOn: 0, 
            startHour: 8, 
            endHour: 20,
            step: 60,
        }}
      />
    </div>
  );
};

export default MainScheduler;