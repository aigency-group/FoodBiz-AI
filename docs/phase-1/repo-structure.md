# Repository Structure

This document outlines the main directory structure of the FoodBiz-AI project.

```
/
├── backend/            # FastAPI backend application
│   ├── services/       # Business logic (RAG, Supabase client)
│   ├── tests/          # Backend tests
│   ├── .env.example    # Environment variable template
│   ├── auth.py         # Authentication logic
│   ├── main.py         # FastAPI app entry point
│   ├── models.py       # Pydantic models
│   └── requirements.txt# Python dependencies
│
├── data/               # AI data, models, and indexes
│   ├── guidelines.md   # RAG data source
│   └── faiss_index/    # FAISS vector index
│
├── docs/               # Project documentation
│   ├── phase-1/        # Phase 1: Foundation & Bootstrap
│   ├── phase-2/        # Phase 2: Core API & Data Contracts
│   ├── phase-3/        # Phase 3: RAG Pipeline v1
│   └── phase-4/        # Phase 4: Realtime Chat & Alerts
│
├── frontend/           # Vite+React frontend application
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── guidelines/ # Guideline assets
│   │   └── styles/     # Global styles
│   ├── .env.example    # Environment variable template
│   ├── index.html      # Main HTML file
│   └── package.json    # Node.js dependencies
│
├── .gitignore          # Git ignore file
├── README.md           # Project overview and setup instructions
└── todolist.txt        # Task tracking for all roles
```
