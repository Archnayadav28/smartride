from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="SmartRide Backend API",
    description="Backend for the SmartRide Tourism & Safety Platform",
    version="1.0.0"
)

# CORS middleware for allowing frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "message": "SmartRide Backend is running",
        "status": "ok"
    }
