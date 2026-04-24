# 🚀 SRM Full Stack Engineering Challenge

A production-ready full stack web application that processes hierarchical node relationships and generates structured insights including trees, cycles, invalid entries, duplicate edges, and summary metrics.

Developed as part of a **Full Stack Engineering Challenge**, focusing on correctness, clean architecture, and efficient graph-based algorithms.

---

## 📌 Features

* REST API endpoint: `POST /bfhl`
* Hierarchical tree construction from directed edges
* Cycle detection using DFS
* Duplicate edge handling
* Invalid input detection and sanitization
* Multi-tree support
* Depth calculation for trees
* Summary analytics generation
* Clean and responsive frontend UI

---

## 🧠 Core Concepts

* Graph Representation (Adjacency List)
* Depth First Search (DFS)
* Cycle Detection (Recursion Stack)
* Tree Construction from Directed Graph
* HashMaps & Sets for optimization
* Input validation and preprocessing

---

## ⚙️ Tech Stack

### Backend

* Node.js
* Express.js

### Frontend

* React.js (Vite)

### Deployment

* Frontend: Vercel
* Backend: Render / Railway

---

## 🔗 Live Links

* 🌐 Frontend: **YOUR_FRONTEND_URL**
* ⚙️ Backend API: **YOUR_BACKEND_URL**
* 📂 GitHub Repo: **YOUR_GITHUB_URL**

---

## 📥 API Usage

### Endpoint

```id="u9c94j"
POST /bfhl
```

### Request

```json id="ytkkxv"
{
  "data": ["A->B", "A->C", "B->D"]
}
```

---

## 📤 Response

```json id="5shvvy"
{
  "user_id": "sushantkumar_23092004",
  "email_id": "sk0754@srmist.edu.in",
  "college_roll_number": "RA2311033010111",
  "hierarchies": [
    {
      "root": "A",
      "tree": {
        "A": {
          "B": {
            "D": {}
          },
          "C": {}
        }
      },
      "depth": 3
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

---

## ⚠️ Edge Case Handling

* Invalid formats: `"hello"`, `"1->2"`, `"A->"`
* Self-loops treated as invalid (`A->A`)
* Duplicate edges handled correctly (only first used)
* Cycle detection returns empty tree with `has_cycle: true`
* Multi-parent case handled (first parent wins)
* Input trimming supported (`" A->B "` is valid)

---

## 🧪 Sample Test Cases

### Cycle Case

```json id="54d38p"
["X->Y","Y->Z","Z->X"]
```

### Duplicate Case

```json id="scn45k"
["A->B","A->B","A->B"]
```

### Mixed Case

```json id="zhv8x2"
["A->B","B->C","X->Y","Y->X"]
```

### Invalid Input Case

```json id="qzxqxg"
["hello","1->2","A->A"," A->B "]
```

---

## 🏗️ Project Structure

```id="rt8p42"
root/
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│
├── README.md
└── .gitignore
```

---

## ▶️ Run Locally

### Backend

```bash id="37i6sb"
cd backend
npm install
npm start
```

### Frontend

```bash id="4qqlrv"
cd frontend
npm install
npm run dev
```

---

## 🚀 Deployment Notes

* Ensure CORS is enabled
* API response time < 3 seconds
* Frontend should use deployed backend URL
* Avoid hardcoding values

---

## 💡 Highlights

* Clean modular backend architecture
* Efficient graph-based processing
* Handles all defined edge cases
* Production-ready structure and deployment

---

## 👨‍💻 Author

**Sushant Kumar**
B.Tech CSE (Software Engineering)
SRM Institute of Science and Technology

---

## 📜 License

For academic and evaluation purposes.
