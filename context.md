```markdown
# 📌 Project Context & Learning Blueprint: Automated Plant Watering IoT Web App

## 🎯 Primary Goal & Learning Philosophy
- **Primary Objective:** Build an end-to-end, multi-device automated plant watering system controlled via a web dashboard.
- **Core Philosophy:** **THIS IS A LEARNING PROJECT.**
  - **Do NOT just output finished, monolithic code solutions.** Explain *why* choices are made, how components interact under the hood, and highlight trade-offs.
  - Break technical implementations into digestible steps. Ask check-in questions to ensure concepts are clear before moving to the next layer.
  - Maintain an encouraging, peer-collaborative tone.

---

## 🏗️ System Architecture Overview
The system follows a **Server-Centric Model** during initial development to keep edge hardware logic simple and allow rapid iteration.


```

[ Frontend Dashboard ] <--- (REST / WebSockets) ---> [ Node.js/TypeScript Express Backend ] <--- (Docker) ---> [ PostgreSQL DB ]
|
(Wi-Fi / HTTP / MQTT)
v
[ ESP32 Controllers ] ---> [ Relays / 5V-12V Water Pumps ]

```

### Topology & Hardware Setup
- **Topology:** Distributed "1 ESP32 + 1 Pump Node" per plant location (scalable to multi-output central nodes).
- **Physical Layout:** Microcontrollers connect over local Wi-Fi to a local backend server.
- **Actuator Strategy:** Pumps are driven by GPIO pins on the ESP32 via relays. Calibrated water delivery uses **Volume (mL)** in the UI, which the backend translates to **Duration (Seconds)** based on each channel's measured flow rate ($\text{Duration} = \frac{\text{Volume}}{\text{Flow Rate}}$).

---

## 💻 Tech Stack & Tooling

### 1. Database & Infrastructure
- **Database:** PostgreSQL running in a local **Docker** container (`postgres:16-alpine`).
- **ORM / Query Builder:** **Prisma ORM** for type-safe database queries, schema management, and automated migrations.
- **Development Server Host:** Local laptop (Node.js/Express) running PostgreSQL in Docker (designed for zero-friction migration to a 24/7 Raspberry Pi later).

### 2. Frontend Application
- **Framework & Tooling:** React + Vite + TypeScript (`frontend/`).
- **Styling:** Eco-Light Botanical Theme system in CSS with **Plus Jakarta Sans** typography and 3D CSS Perspective card flips.
- **API Service Layer:** Asynchronous `fetch()` module (`frontend/src/services/api.ts`) connecting to the Express REST API.

### 3. Edge Microcontrollers
- **Hardware:** ESP32.
- **Role (Phase 1):** Actuator execution node listening for commands and reporting analog moisture sensor readings.

---

## 🗄️ Database Schema & Data Model (Prisma / PostgreSQL)

The relational schema strictly normalizes hardware controllers, hardware output pins, plant profiles, recurring schedules, and safety rules:

```prisma
// Physical ESP32 Hardware Unit
model Controller {
  id               String             @id @default(uuid())
  deviceMacAddress String             @unique
  name             String
  isOnline         Boolean            @default(false)
  lastPingAt       DateTime?
  outputs          ControllerOutput[]
  createdAt        DateTime           @default(now())
}

// Individual Pump/Relay Pin connected to an ESP32
model ControllerOutput {
  id               String     @id @default(uuid())
  controllerId     String
  controller       Controller @relation(fields: [controllerId], references: [id], onDelete: Cascade)
  gpioPinNumber    Int
  flowRateMlPerSec Float      @default(10.00) // Hardware calibration
  plant            Plant?

  @@unique([controllerId, gpioPinNumber])
}

// Plant Profile & Safety Triggers
model Plant {
  id                   String            @id @default(uuid())
  name                 String
  species              String?
  outputChannelId      String?           @unique
  outputChannel        ControllerOutput? @relation(fields: [outputChannelId], references: [id], onDelete: SetNull)
  safetyTriggerEnabled Boolean           @default(false)
  moistureThresholdPct Float?            // e.g. 0.20 for 20%
  safetyWaterVolumeMl  Int?
  schedules            PlantSchedule[]
  createdAt            DateTime          @default(now())
}

// Recurring Watering Schedules (1 Plant : Many Schedules)
model PlantSchedule {
  id             String   @id @default(uuid())
  plantId        String
  plant          Plant    @relation(fields: [plantId], references: [id], onDelete: Cascade)
  scheduledTime  String   // HH:MM 24-hour format (e.g., "08:00")
  daysOfWeek     Int[]    // Array of days (e.g., [1, 3, 5] = Mon, Wed, Fri)
  targetVolumeMl Int      // Stored in mL for user experience
  isActive       Boolean  @default(true)
  createdAt      DateTime @default(now())
}

```

---

## 🚩 Current Project Status & Immediate Next Step

1. **Docker Setup:** `docker-compose.yml` created for local PostgreSQL on port `5432`.
2. **Backend Setup:** `backend/` initialized with TypeScript, Express, Prisma, and `.gitignore`.
3. **Database Migration:** Prisma schema defined & migrated via `npx prisma migrate dev --name init_schema` (configured for Prisma 7 with `prisma.config.ts`).
4. **Data Seeding & Verification:** Created relational seeding script `prisma/seed.ts` (executed via `tsx`) populating `Controller`, `ControllerOutput`, `Plant`, and `PlantSchedule`, verified visually in **Prisma Studio**.
5. **Express REST API Completed:**
   - Hot reloading dev server configured with `tsx --watch` (`npm run dev`).
   - Modular structure with `src/types.ts` (TypeScript request interfaces) and `src/tools.ts` (JSDoc documented hardware math functions).
   - Full CRUD endpoints (`GET /api/plants`, `GET /api/plants/:id`, `POST /api/plants`, `PUT /api/plants/:id`, `DELETE /api/plants/:id`).
   - `POST /api/plants/:id/water`: IoT watering action endpoint; calculates hardware pump run duration in seconds ($\text{Duration} = \frac{\text{Volume}}{\text{Flow Rate}}$) and outputs GPIO pin commands (`200 OK`).
6. **React / Vite Frontend Dashboard Completed:**
   - Initialized Vite + React + TypeScript app in `frontend/`.
   - Built Eco-Light design system (`index.css`) with **Plus Jakarta Sans** typography and 3D card perspective rules.
   - Built API service layer (`frontend/src/services/api.ts`) connecting to Express endpoints.
   - Built `<PlantCard />` with local volume state (`volumeMl`), custom input validation, and interactive **3D Card Flip deletion confirmation** (`isFlipped` state + `rotateY(180deg)` 3D CSS transform).
   - Built `<AddPlantModal />` modal form component to register new plants into PostgreSQL via `POST /api/plants`.
   - Built `<App />` layout with header logo ("PlantPal 🌿"), live backend status badge, and garden grid.
7. **Immediate Next Step Options:**
   - **Option 1: Complete In-Card 3D Flip Edit Form (`handleEdit`)** — Implement the `%` Edit button to display an edit form on the card back that calls `PUT /api/plants/:id` to update plant attributes or safety parameters.
   - **Option 2: Hardware ESP32 Simulator & Controller Endpoints** — Build hardware registration/heartbeat endpoints (`/api/controllers`) and a Node.js simulator script to simulate real ESP32 Wi-Fi hardware.
   - **Option 3: Real-Time Layer (WebSockets / Socket.io)** — Broadcast live watering events and moisture sensor updates between Express, Frontend, and ESP32 nodes.