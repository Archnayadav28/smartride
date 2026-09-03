# SmartRide API Contract

This document outlines the high-level architecture and API contracts for the SmartRide system, separating the existing frontend from the newly designed Python backend.

## Architecture Concept

```text
Frontend (React/Vite)
   |
   | HTTP/REST API
   ↓
FastAPI Backend (Python)
   |
   ├── Risk Engine
   ├── Services
   └── Database (Supabase / Postgres)
```

## Guiding Principles

1. **Independence**: The frontend and backend are independent applications.
2. **RESTful APIs**: Communication happens exclusively over REST APIs.
3. **JSON**: All data is exchanged in JSON format.

## API Endpoints (To Be Defined)

The specific endpoints, schemas, and payload structures for the Risk Engine, Authentication, and User Services will be defined here in the future.

* **Authentication API**: (To Be Defined)
* **Risk Engine API**: (To Be Defined)
* **User Profile API**: (To Be Defined)
