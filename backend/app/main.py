from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import upload, train, generate, evaluate, download

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api/upload", tags=["Upload"])
app.include_router(train.router, prefix="/api/train", tags=["Train"])
app.include_router(generate.router, prefix="/api/generate", tags=["Generate"])
app.include_router(evaluate.router, prefix="/api/evaluate", tags=["Evaluate"])
app.include_router(download.router, prefix="/api/download", tags=["Download"])

@app.get("/")
def root():
    return {"message": "Synthetic Data Generation API is running"}
