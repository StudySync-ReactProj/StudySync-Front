# StudySync — Personal Study Management App

**Project by:** Shahar Girtler, Noam Sinay

## 📖 About

StudySync is a comprehensive study management application designed to help students efficiently organize and track their learning workflow. Built with React and Material-UI, this web application provides students with powerful tools to manage their academic tasks, monitor their progress, and schedule study sessions effectively.

## 🎯 Purpose

The application aims to:
- **Centralize Study Management**: Keep all study-related tasks, schedules, and progress tracking in one place
- **Enhance Productivity**: Help students visualize their workload and prioritize tasks effectively
- **Track Progress**: Monitor daily and weekly study habits with visual progress indicators
- **Organize Schedules**: Synchronize and manage study sessions through an integrated calendar system
- **Manage Tasks**: Create, organize, and track academic assignments with priority levels and due dates

## ✨ Key Features

### 📊 Dashboard
- Personalized greeting based on time of day
- Overview of study progress and statistics
- Visual representation of weekly and daily progress
- Quick access to recent tasks and upcoming deadlines
- Study streak tracking to maintain motivation

### ✅ Task Management
- Create and organize study tasks with detailed information
- Set task priorities (Low, Medium, High)
- Track task status (Not Started, In Progress, Completed)
- Set due dates and deadlines
- Edit and delete tasks as needed
- Filter and sort tasks by various criteria

### 📅 Calendar Synchronization
- Interactive calendar view for scheduling study sessions
- Add, edit, and manage study events
- Visual timeline of scheduled activities
- Side panel for quick date navigation
- Month, week, and day views
- **Google Calendar Integration**: Sync with your Google Calendar to automatically schedule meetings and study sessions based on your availability

### 🔐 User Authentication
- Secure login system with form validation
- Protected routes for authenticated users
- User session management with Redux

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 with Vite
- **UI Library**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Calendar**: React Big Calendar & FullCalendar
- **Date Management**: date-fns & Moment.js
- **Styling**: Emotion & Styled Components

## 📁 Main Application Pages

| Page               | Route          | Description                                                      |
| ------------------ | -------------- | ---------------------------------------------------------------- |
| **Login Page**     | `/login`       | User authentication with form validation                         |
| **Dashboard**      | `/dashboard`   | Main hub showing study progress, statistics, and quick overview  |
| **Tasks Page**     | `/tasks`       | Complete task management system with CRUD operations             |
| **Calendar Sync**  | `/calendar`    | Interactive calendar for scheduling and managing study sessions  |

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm preview
```

## 👥 Target Users

StudySync is designed for students who want to:
- Better organize their study schedule
- Track their learning progress over time
- Manage multiple courses and assignments
- Improve their study habits through consistent tracking
- Visualize their academic workload

