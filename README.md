# CoreLab

CoreLab is a Learning Management System (LMS) built for Epitech Web@académie. An admin (the teacher) creates courses, lessons and quizzes. Students follow the courses, read the lessons and take the quizzes to check what they learned.

The project is split in two parts that run separately and talk to each other over HTTP:

- `server`: a Node.js and Express REST API
- `client`: a React app built with Vite

## Tech stack

Backend:

- Node.js with Express for the REST API
- MongoDB with Mongoose for the database and models, hosted on MongoDB Atlas
- JWT for authentication and bcrypt for password hashing
- Zod for validating every incoming request
- Multer for file uploads (quiz import)
- Jest and supertest for the tests
  Frontend:

- React with Vite
- Calls the API through a `/api` proxy so the two parts stay decoupled

## Features

- Two roles: admin (teacher) and student
- Authentication with JWT: signup, login and protected routes
- Courses: create, read, update and delete
- Lessons: HTML content attached to a course, with an optional available-from date
- Quizzes: multiple choice questions linked to a course or a lesson
- Quiz import from a JSON or CSV file
- Quiz attempts: a student answers a quiz and gets a score with pass or fail
- Admin can import students and see their results in a dashboard
- Validation with Zod on every route before the data reaches the database

## Project structure

```
.
├── server
│   ├── src
│   │   ├── models          Mongoose schemas (Course, Lesson, Quiz, Attempt, Notification, User)
│   │   ├── routes          Express routes
│   │   ├── controllers     route logic
│   │   ├── middleware       auth and validation middleware
│   │   ├── validators      Zod schemas
│   │   └── app.js          Express app setup
│   ├── tests               Jest test files
│   └── package.json
├── client
│   ├── src                 React components
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Prerequisites

Before you start, make sure you have:

- Node.js version 18 or higher
- npm
- A MongoDB connection string (a MongoDB Atlas account, or a local MongoDB instance)

## Installation

1. Clone the repository and go into the project folder:

```
git clone <repo-url>
cd corelab
```

2. Install the server:

```
cd server
npm install
```

3. Install the client:

```
cd ../client
npm install
```

## Environment variables

The server reads its configuration from a `.env` file placed in the `server` folder. Copy the example file and fill in your own values:

```
cd server
cp .env.example .env
```

The `.env.example` file lists the variables you need:

```
PORT=4242
MONGO_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
CLIEN_URI=
NODE_ENV=development
EMAIL_USER=
EMAIL_PASS=
```

Never commit your real `.env` file. Only `.env.example` is tracked in git.

## Running the project

You need two terminals: one for the server and one for the client.

Start the server from the `server` folder:

```
npm run dev
```

The API runs on http://localhost:4242

Start the client from the `client` folder:

```
npm run dev
```

The client runs on http://localhost:3000 and sends its `/api` calls to the server through the Vite proxy.

Then open http://localhost:3000 in your browser.

## Running the tests

The backend tests use Jest and supertest. From the `server` folder:

```
npm test
```

The tests send bad data to the courses, lessons and quizzes routes and check that the Zod validation rejects it with a 400 response.

## Main API routes

| Prefix          | What it handles           |
| --------------- | ------------------------- |
| `/api/auth`     | signup and login          |
| `/api/user`     | user data                 |
| `/api/courses`  | courses CRUD              |
| `/api/lessons`  | lessons CRUD              |
| `/api/quizzes`  | quizzes CRUD and import   |
| `/api/attempts` | quiz attempts and results |
| `/api/admin`    | admin actions             |
| `/api/progress` | student progress          |


# Database Schema — CoreLab

## User
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| firstname | String | First name |
| lastname | String | Last name |
| email | String | Unique email |
| password | String | Hashed password (bcrypt) |
| role | String | `admin` or `student` |
| status | String | `pending`, `approved`, `rejected` |
| isFirstLogin | Boolean | First login flag |
| courses | ObjectId[] | Ref → Course |

## Course
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| title | String | Course title |
| description | String | Course description |
| category | String | `Tech`, `Culture`, `First Aid`, `Other` |
| imageUrl | String | Image URL |
| cohorts | ObjectId[] | Ref → User (assigned students) |

## Lesson
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| title | String | Lesson title |
| htmlContent | String | HTML content |
| courseId | ObjectId | Ref → Course |
| availableFrom | Date | Availability date |
| order | Number | Order within the course |

## Quiz
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| title | String | Quiz title |
| courseId | ObjectId | Ref → Course |
| lessonId | ObjectId | Ref → Lesson (optional) |
| questions | Array | List of questions |
| passingScore | Number | Minimum score to pass (0-100) |

## Attempt
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| studentId | ObjectId | Ref → User |
| quizId | ObjectId | Ref → Quiz |
| score | Number | Score obtained (0-100) |
| passed | Boolean | Pass or fail |
| answers | Array | Student answers |

## Progress
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| studentId | ObjectId | Ref → User |
| courseId | ObjectId | Ref → Course |
| lastLessonIndex | Number | Last lesson viewed |
| completedLessons | ObjectId[] | Ref → Lesson |
| totalLessons | Number | Total lessons in course |
| completed | Boolean | Course completed flag |

## Notification
| Field | Type | Description |
|-------|------|-------------|
| _id | ObjectId | Unique identifier |
| userId | ObjectId | Ref → User |
| lessonId | ObjectId | Ref → Lesson |
| message | String | Notification message |
| read | Boolean | Read or unread |

## Relationships
- **User** → **Course** : a student is assigned to multiple courses (`cohorts`)
- **Course** → **Lesson** : a course contains multiple lessons (`courseId`)
- **Lesson** → **Quiz** : a quiz is linked to a lesson (`lessonId`)
- **User** → **Attempt** : a student takes multiple quiz attempts (`studentId`)
- **User** → **Progress** : a student has one progress record per course
- **User** → **Notification** : a student receives notifications for new lessons

## Team and responsibilities

The project was built by three people. The list below is each person's main focus. Roles stayed flexible, and we coordinated daily, since the frontend can only be wired once the matching backend routes are ready.

David (Person A) - Backend

- Authentication: signup, login and JWT
- User management
- Admin routes
- Admin dashboard
- Admin approval workflow and student import
- Maquette
- JWT Authentifications
- Middleware
- Protected Routes
- Admin approval workflow and student import
  
Shanisya (Person B) - Backend

- Courses, lessons and quizzes: models, routes and controllers
- Quiz import from JSON and CSV files
- Students list dashboard
- Zod validation across the routes
- Jest and supertest tests

Mohammad (Person C) - Frontend

- All the React pages
- Client-side routing
- The UI
- Wiring the pages to the API
- Page Courses 
- Page Lessons
- Editing Controllers for Courses, Lessons and Quizzes
- Page Login and Register

## Git workflow

This is non-negotiable per the brief.

- Never push directly to `main`
- Each feature lives on its own branch, for example `feature/auth`, `feature/quiz-import`, `feature/lesson-page`
- Open a Pull Request and have at least one teammate review it before it is merged
- Track what is in progress on a board (via Trello: https://trello.com/b/89bFHaKS/corelab)

---

## License

This project is licensed under the [MIT License](./LICENSE).

