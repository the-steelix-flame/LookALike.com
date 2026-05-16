# LookALike 🔍

LookALike is an AI-powered full-stack application that finds your closest facial matches. By analyzing facial geometry and converting it into high-dimensional embeddings, the platform performs real-time similarity searches against a database of users to find your twin.

## 🏗 Architecture & Tech Stack

This project is built across the entire pipeline, managing both the interactive UI and the backend machine learning infrastructure.

* **Frontend:** Next.js (App Router), React, Tailwind CSS.
* **AI Microservice:** Python, Flask, DeepFace (ArcFace model), OpenCV.
* **Database:** Vercel Postgres utilizing the `pgvector` extension for native vector similarity search.
* **Authentication & Storage:** Firebase.
* **Deployment:** Vercel (Frontend & Database) and Hugging Face Spaces (AI Embedding Service).

## ✨ Key Features

* **Live Facial Capture:** Integrated `react-webcam` allows users to seamlessly capture up to 50 live photos directly from the browser to build a robust profile.
* **Advanced Facial Embeddings:** Utilizes the RetinaFace detector backend and ArcFace model to extract highly accurate structural embeddings, avoiding simple pixel-matching.
* **Native Vector Search:** Computes cosine distance directly within the SQL query (`<=>` operator) via `pgvector` for lightning-fast similarity scoring.

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Python 3.9+
* A Vercel Postgres database with the `pgvector` extension enabled.

### 1. Run the AI Service (Local)
Navigate to the `ai-service` directory, install dependencies, and start the Flask server:
\`\`\`bash
cd ai-service
pip install -r requirements.txt
python app.py
\`\`\`
*The service will run on \`http://localhost:10000\`.*

### 2. Run the Next.js Web App
Navigate to the `apps/web` directory, install dependencies, and start the development server:
\`\`\`bash
cd apps/web
npm install
npm run dev
\`\`\`

Ensure you have your `.env.local` file configured with your Firebase credentials, Vercel Postgres connection string, and the `NEXT_PUBLIC_AI_SERVICE_URL`.

## 🧠 How the Search Works
1. A user uploads or captures an image on the client side.
2. The image is sent as a base64 string to the Python AI service.
3. DeepFace extracts a high-dimensional facial embedding.
4. The frontend passes this embedding to a Next.js API route.
5. The Postgres database runs a `pgvector` query to find the nearest neighbors based on cosine similarity, returning the top matches.
