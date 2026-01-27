// src/components/Calendar/MainScheduler.jsx
import React, { useState } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import MeetingPollModal from "../MeetingPollModal/MeetingPollModal";
import { SchedulerWrapper } from "./MainScheduler.style";

const MainScheduler = ({ selectedDate, events = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCellData, setSelectedCellData] = useState(null);

  const handleCellClick = (data) => {
    setSelectedCellData(data);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitMeeting = (formData) => {
    console.log("Meeting Data to send to Backend:", formData);
    setIsModalOpen(false);
  };

  return (
    <SchedulerWrapper>
      <Scheduler
        view="week"
        events={events}
        selectedDate={selectedDate}
        onCellClick={handleCellClick}

        customEditor={(props) => null}

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
      <MeetingPollModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitMeeting}
      />
    </SchedulerWrapper>
  );
};
export default MainScheduler;