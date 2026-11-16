
# Job Application Tracker

A responsive web application to manage and track job applications throughout the recruitment process.

## Features

### Applications Management
- Create, view, edit and delete job applications.
- Search applications by company or role.
- Filter applications by status.
- Sort by company name and application date.
- Pagination with 10 applications per page.
- URL query parameters preserve search, filter, sorting and pagination state.
- Application details with status history timeline.
- Form validation and unsaved-changes confirmation.

### Dashboard
- Summary cards showing application statistics.
- Application status breakdown.
- Recent applications.
- Application statistics chart.

### Pipeline
- Kanban board with Wishlist, Applied, Interview, Offer and Rejected columns.
- Drag and drop applications between statuses.
- Change application status using the status selector.
- Optimistic UI updates with rollback on failure.

### Additional Features
- Light and dark themes.
- Theme follows system preference by default.
- Responsive layout for mobile, tablet and desktop.
- Loading, error and empty states.
- Debounced search.
- Chaos Mode for simulating API failures.

## Technologies Used

- React
- Vite
- JavaScript
- Redux Toolkit
- React Redux
- React Router DOM
- Tailwind CSS
- Lucide React
- JSON Server

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/siddharthdosi31/Job-application-Tracker.git
```

Navigate into the project:

```bash
cd Job-application-Tracker
```

Install dependencies:

```bash
npm install
```

### Environment Configuration

Create a `.env` file in the project root:

```env
VITE_CHAOS_MODE=false
```

Set it to `true` to enable Chaos Mode.

### Run the Application

Start the mock API server in one terminal:

```bash
npm run mock
```

Start the React development server in another terminal:

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

## Chaos Mode

Chaos Mode simulates random failures during application status updates.

Enable it in `.env`:

```env
VITE_CHAOS_MODE=true
```

When enabled, approximately 20% of status update requests fail intentionally. The Pipeline board should roll back the optimistic update and display an error message.

Restart the Vite development server after changing the environment variable.

## Project Structure

```text
src/
├── api/
│   └── applicationsApi.js
├── app/
│   └── store.js
├── components/
├── context/
│   └── ThemeContext.jsx
├── features/
│   ├── applications/
│   ├── dashboard/
│   └── pipeline/
├── hooks/
│   └── useForm.js
├── layouts/
├── routes/
├── App.jsx
└── main.jsx

mock/
└── db.json
```

## Redux Organization

Redux Toolkit is used for application-wide state management.

The store contains three feature reducers:

- **applications:** Application list, details, create, update and delete operations.
- **dashboard:** Dashboard application data and statistics.
- **pipeline:** Pipeline data and optimistic status updates.

Async operations are handled using Redux Toolkit's `createAsyncThunk`.

Memoized selectors are used for derived dashboard data.

API requests are centralized in `src/api/applicationsApi.js`.

## Future Improvements

- Bulk application actions.
- Export applications to CSV.
- Undo deleted applications.
- Additional dashboard analytics.
- Improved automated testing.

