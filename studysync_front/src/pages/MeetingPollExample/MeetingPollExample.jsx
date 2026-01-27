import { useState } from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import MeetingPollModal from '../../components/MeetingPollModal/MeetingPollModal';

/**
 * Example page showing how to use the MeetingPollModal component
 */
export default function MeetingPollExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitMeeting = async (meetingData) => {
    console.log('Meeting data submitted:', meetingData);
    
    // Example: Send data to backend
    // try {
    //   const response = await API.post('/meetings/schedule', meetingData);
    //   console.log('Meeting scheduled:', response.data);
    // } catch (error) {
    //   console.error('Error scheduling meeting:', error);
    // }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" fontWeight={700} color="primary.main" gutterBottom>
          Meeting Poll Demo
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Click the button below to create a new meeting poll
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          onClick={handleOpenModal}
          sx={{ borderRadius: 2, px: 4 }}
        >
          Create Meeting Poll
        </Button>
      </Box>

      {/* Meeting Poll Modal */}
      <MeetingPollModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitMeeting}
      />

      {/* Instructions */}
      <Box mt={8} p={3} bgcolor="background.paper" borderRadius={2}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          How to Use
        </Typography>
        <Typography variant="body1" paragraph>
          The Meeting Poll Modal consists of 4 steps:
        </Typography>
        <ol>
          <li>
            <Typography variant="body1" paragraph>
              <strong>Details & Location:</strong> Enter the meeting title, description, and select whether it's online or offline.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" paragraph>
              <strong>Duration & Participants:</strong> Set the meeting duration, choose a time range, and add participants.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" paragraph>
              <strong>Available Options:</strong> Select from available time slots that work for your meeting.
            </Typography>
          </li>
          <li>
            <Typography variant="body1" paragraph>
              <strong>Success:</strong> Review the scheduled meeting details and send invitations to participants.
            </Typography>
          </li>
        </ol>
      </Box>

      {/* Backend Integration Guide */}
      <Box mt={4} p={3} bgcolor="info.lighter" borderRadius={2}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Backend Integration
        </Typography>
        <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
{`// The onSubmit callback receives meeting data in this format:
{
  title: "Team Sync Meeting",
  description: "Weekly team synchronization",
  locationType: "online" | "offline",
  duration: {
    hours: 1,
    minutes: 30
  },
  timeRange: "this-week" | "next-week" | "this-month" | "next-month",
  participants: ["John Doe", "jane@example.com", ...],
  selectedSlots: [1, 2, 3] // IDs of selected time slots
}

// Example backend integration:
import API from '../../api/axiosConfig';

const handleSubmitMeeting = async (meetingData) => {
  try {
    const response = await API.post('/meetings/schedule', meetingData);
    console.log('Meeting scheduled:', response.data);
    // Show success notification
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    // Show error notification
  }
};`}
        </Typography>
      </Box>
    </Container>
  );
}
