from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import os

import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Todo API",
    description="A simple Todo API using FastAPI and SQLite, with a React frontend",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the static files directory
app.mount("/assets", StaticFiles(directory="static/assets"), name="static")


# Serve the React app
@app.get("/")
async def serve_spa(path: str = ""):
    return FileResponse("static/index.html")


@app.post("/todos/", response_model=schemas.Todo, status_code=201)
async def create_todo(todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    """
    Create a new todo item.

    - **title**: required, the title of the todo item
    - **description**: optional, a more detailed description of the todo item
    - **completed**: optional, whether the todo item is completed (default: False)
    """
    db_todo = models.Todo(**todo.dict())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.get("/todos/", response_model=List[schemas.Todo])
async def read_todos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve a list of todo items.

    - **skip**: optional, number of items to skip (default: 0)
    - **limit**: optional, maximum number of items to return (default: 100)
    """
    todos = db.query(models.Todo).offset(skip).limit(limit).all()
    return todos


@app.get("/todos/{todo_id}", response_model=schemas.Todo)
async def read_todo(todo_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific todo item by its ID.

    - **todo_id**: required, the ID of the todo item to retrieve
    """
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return db_todo


@app.put("/todos/{todo_id}", response_model=schemas.Todo)
async def update_todo(todo_id: int, todo: schemas.TodoCreate, db: Session = Depends(get_db)):
    """
    Update a specific todo item.

    - **todo_id**: required, the ID of the todo item to update
    - **title**: required, the new title of the todo item
    - **description**: optional, the new description of the todo item
    - **completed**: optional, the new completion status of the todo item
    """
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    for key, value in todo.dict().items():
        setattr(db_todo, key, value)
    db.commit()
    db.refresh(db_todo)
    return db_todo


@app.delete("/todos/{todo_id}", response_model=schemas.Todo)
async def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    """
    Delete a specific todo item.

    - **todo_id**: required, the ID of the todo item to delete
    """
    db_todo = db.query(models.Todo).filter(models.Todo.id == todo_id).first()
    if db_todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(db_todo)
    db.commit()
    return db_todo


# Catch-all route to handle React Router
@app.get("/{full_path:path}")
async def serve_spa_paths(full_path: str):
    if full_path.startswith("api"):
        raise HTTPException(status_code=404, detail="API route not found")
    return FileResponse("static/index.html")
