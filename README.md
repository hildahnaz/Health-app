# Health App - Modern Web Implementation

This is a modern web implementation of a health monitoring application, equivalent to the Python Flask structure you outlined.

## Project Structure

```
/health_app (equivalent)
│
├── src/
│   ├── services/
│   │   └── healthService.ts          # Equivalent to app.py
│   ├── models/
│   │   └── anomalyDetection.ts       # Equivalent to anomaly_detection.py + evaluate_model.py
│   ├── pages/
│   │   └── Dashboard.tsx             # Equivalent to templates/index.html
│   ├── components/
│   │   ├── charts/
│   │   │   ├── HealthChart.tsx
│   │   │   └── AnomalyChart.tsx
│   │   └── ui/
│   │       └── DataTable.tsx
│   └── App.tsx                       # Main app entry point
```

## Features

### 🏥 Health Service (app.py equivalent)
- Real-time health data generation
- Health status monitoring
- Data streaming simulation

### 🤖 Anomaly Detection (anomaly_detection.py equivalent)
- Custom anomaly detection algorithm
- Model training and prediction
- Performance evaluation metrics

### 📊 Dashboard (index.html equivalent)
- Real-time health monitoring
- Interactive charts and visualizations
- Anomaly detection results
- Data table with sorting and pagination

### 📈 Data Simulation (simulate_data.py equivalent)
- Generates realistic health data
- 1-minute intervals for 60 minutes
- Heart rate, blood oxygen, and activity levels

### 🔍 Model Evaluation (evaluate_model.py equivalent)
- Accuracy, precision, and recall metrics
- Real-time performance monitoring
- Anomaly detection statistics

## Technology Stack

- **Frontend**: React + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

1. The application starts automatically
2. View real-time health monitoring data
3. Explore anomaly detection results
4. Analyze historical trends and patterns

## Deployment Options

This modern web app can be deployed to:
- Netlify (equivalent to Streamlit deployment)
- Vercel
- Any static hosting service

The application provides the same functionality as your Python Flask app but with enhanced interactivity, real-time updates, and modern web technologies.