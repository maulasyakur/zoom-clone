# Zoom Clone - React Portfolio Project

## Overview

This is a portfolio project showcasing a Zoom-like video conferencing application built with modern web technologies. It demonstrates full-stack development skills, including frontend UI/UX design, state management, and integration with third-party services for real-time communication.

The application allows users to create, manage, and join video meetings seamlessly. It's designed as a demonstration of building scalable, user-friendly interfaces using React and TypeScript.

## How It Works

The core meeting functionality leverages **Jitsi Meet**, an open-source video conferencing platform. Here's how it operates:

1. **Meeting Creation**: Users can create new meetings through an intuitive form interface. Each meeting generates a unique UUID (Universally Unique Identifier) locally on the client-side.

2. **Link Generation**: The app constructs the meeting URL by appending the generated UUID to the Jitsi Meet domain: `https://meet.jit.si/{uuid}`. This creates a secure, unique room for each meeting.

3. **Joining Meetings**: Participants can join meetings by clicking the generated link, which opens the Jitsi Meet interface directly in their browser. No additional software installation is required.

4. **Meeting Management**: The app provides features to edit meeting details, delete meetings, and view a paginated list of all scheduled meetings.

This approach ensures privacy and uniqueness for each meeting while utilizing Jitsi Meet's robust video conferencing capabilities.

## Features

- **Add Meetings**: Create new video meetings with custom titles, descriptions, and scheduling.
- **Edit Meetings**: Modify existing meeting details through a dialog interface.
- **Delete Meetings**: Remove individual meetings or perform bulk deletions.
- **Data Table**: View all meetings in a sortable, filterable table with pagination.
- **Responsive Design**: Built with Shadcn UI components for a modern, accessible interface.
- **Real-time Integration**: Seamless connection to Jitsi Meet for instant video calls.

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Shadcn UI with Tailwind CSS for consistent, customizable components
- **State Management**: React hooks for local state handling
- **Video Conferencing**: Jitsi Meet integration
- **Linting**: ESLint with TypeScript support
- **Package Management**: npm

## Installation and Setup

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd zoom-clone
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Build for production**:

   ```bash
   npm run build
   ```

5. **Preview the production build**:
   ```bash
   npm run preview
   ```

## Project Structure

- `src/App.tsx`: Main application component
- `src/components/`: Reusable UI components including meeting forms, data tables, and dialogs
- `src/lib/`: Utility functions and custom hooks
- `src/ui/`: Shadcn UI component library

## Learning Outcomes

This project demonstrates:

- Integration of third-party APIs (Jitsi Meet)
- Client-side UUID generation for unique identifiers
- Building complex forms and data tables with React
- Implementing CRUD operations in a frontend application
- Responsive design principles with modern CSS frameworks
- TypeScript for type-safe development

## Future Enhancements

Potential improvements could include:

- User authentication and authorization
- Real-time notifications for meeting updates
- Calendar integration for scheduling
- Recording and playback features
- Mobile app development with React Native

---

Built with ❤️ using React, TypeScript, and Vite.
