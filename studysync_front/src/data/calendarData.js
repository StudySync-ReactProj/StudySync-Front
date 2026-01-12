export const events = [
  {
    event_id: 1,
    title: "Morning Sync (Daily)",
    start: new Date(new Date().setHours(9, 0)), // Today at 09:00
    end: new Date(new Date().setHours(10, 0)),
    location: "Zoom",
    color: "#1976d2" // Blue
  },
  {
    event_id: 2,
    title: "Lunch Break",
    start: new Date(new Date().setHours(13, 0)), // Today at 13:00
    end: new Date(new Date().setHours(14, 0)),
    location: "Cafeteria",
    color: "#fbc02d" // Yellow
  },
  {
    event_id: 3,
    title: "Project Submission",
    start: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
    end: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(23, 59)),
    location: "Moodle",
    color: "#d32f2f" // Red
  }
];