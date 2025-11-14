# 🏭 Smart Factory Monitoring Dashboard

## ▶️▶️ Live Demo - https://indusight-board.vercel.app/

## 📘 Overview
This project is a **Smart Factory Monitoring Dashboard** built using **React**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui components**.  
It simulates a real-time Industrial IoT monitoring system, visualizing live metrics such as **temperature**, **vibration**, and **energy usage**.  
All data is simulated on the front-end, no backend or hardware devices are required.

The app demonstrates how IoT and data visualization empower industries to transition towards **Industry 4.0** through **real-time analytics**, **energy optimization**, and **predictive maintenance**.

---

## ⚙️ Features

### 🖥️ Real-Time Dashboard
- Displays **Active Devices**, **Average Temperature**, **Average Vibration**, and **Total Energy**.
- Real-time **charts** using **Recharts**.
- KPI cards update dynamically every few seconds via simulated data streams.

### ⚙️ Device Management
- List of all simulated devices with online/offline status.
- Each device shows its latest readings (temperature, vibration, energy).
- Detailed device view with historical charts and restart simulation button.

### 🚨 Alerts & Anomaly Detection
- Detects alerts when thresholds are breached:
  - Temperature > 60°C
  - Vibration > 3.0 m/s²
- Alerts categorized as **Warning** or **Critical**.
- Auto-resolves when metrics normalize.

### 🧩 Settings with Local Storage
- Customizable alert thresholds for **temperature** and **vibration**.
- Settings persist using `localStorage`.
- All components subscribe dynamically to settings changes.

### 🧠 Data Simulation
- IoT data simulated using `setInterval()` and local state updates.
- Each device updates readings periodically within realistic ranges.
- Random device status toggles mimic real factory environments.

---

## 🧱 Tech Stack

| Category | Tools |
|-----------|--------|
| Framework | React (Vite) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Data Handling | React Hooks + Context API |
| Form Handling | React Hook Form + Zod |
| Persistence | Local Storage |
| Icons | Lucide React |

---

## 📁 Folder Structure

```
src/
│
├── components/              # Reusable UI components
│   ├── layout/              # Sidebar + Topbar layout
│   └── ui/                  # shadcn/ui-based components
│
├── pages/                   # Route-based pages
│   ├── dashboard/           # KPI dashboard
│   ├── devices/             # Device list and details
│   ├── alerts/              # Alert list and handling
│   └── settings/            # Threshold customization
│
├── context/                 # App-wide context (e.g., settings, devices)
├── hooks/                   # Custom React hooks
├── utils/                   # Helper functions
├── types/                   # TypeScript interfaces
└── main.tsx                 # App entry point
```

---

## ⚡ How It Works

1. **Device simulation** updates every few seconds using random values.
2. **Dashboard page** aggregates metrics in real-time.
3. **Alerts page** filters and displays abnormal readings.
4. **Settings page** manages thresholds stored in localStorage.
5. **Recharts** visualizes temperature, vibration, and energy trends.

---

## 🎨 UI Highlights
- Modern **industrial-themed** UI built with Tailwind CSS and shadcn/ui.
- Responsive layout with sidebar navigation.
- Animated charts and live KPI updates.
- Color-coded cards and alert states.
- Smooth mobile responsiveness.

---

## 🪄 Setup & Installation

### Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed.

### Steps
```bash
# Clone the repository
git clone https://github.com/tm33976/smart-factory-monitoring-dashboard-react.git
cd smart-factory-monitoring-dashboard-react

# Install dependencies
npm install

# Run development server
npm run dev
```
Visit: **http://localhost:5173**

---

## 🧩 Real-World Applications

| Industry | Use Case |
|-----------|-----------|
| Manufacturing | Monitor equipment health and prevent downtime |
| Utilities | Analyze energy usage patterns |
| Smart Infrastructure | Oversee sensor data from remote sites |
| Predictive Maintenance | Detect anomalies before breakdowns |
| Industry 4.0 | Enable data-driven operations |

---

## 🧠 Future Enhancements
- 🌐 Integrate with real IoT APIs or MQTT
- 🗺️ Add device location maps (Leaflet.js)
- 🤖 Predictive analytics using AI models
- 🔐 Add user authentication
- 📊 Data export (CSV / PDF)

---

## 👨‍💻 Author
**Tushar Mishra**  
📍 Passionate about creating data-driven, scalable, and visually powerful dashboards.

---


