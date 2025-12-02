# 🏗️ TalkPlay - Architecture & Technical Design

This document provides a overview of the **TalkPlay** architecture, design decisions, and data flow. It is intended for developers and stakeholders to understand the inner workings of the application.

## 1. 💻 System Overview  
TalkPlay is a **Client-Side Single Page Application (SPA)** built with React.  
The application operates entirely within the user's browser (Client-Side), ensuring low latency, privacy, and offline capabilities.

* **Architecture Pattern:** Component-Based Architecture.
* **Backend:** None (Serverless/Static).
* **Data Persistence:** Browser `LocalStorage`.
* **Media Processing:** Native Web APIs (SpeechSynthesis & MediaRecorder).


### 🧩 Diagram

```mermaid
flowchart LR
    %% Users
    User([User / Child]) -->|Interacts| UI[Interface React]
    UI --> App[App.jsx / Router]

    %% Navagation Layer
    subgraph Views [Main Views]
        direction LR
        App --> Welcome[Welcome.jsx]
        App --> Home[Home.jsx]
        App --> Flashcard[FlashcardPage.jsx]
    end

    %% Logic Layer
    subgraph Logic [Utils & Hooks]
        Flashcard -.-> Audio[useAudioRecorder.js]
        Flashcard -.-> Speech[useSpeechSynthesis.js]
        Flashcard -.-> Store[storage.js]
        Home -.-> Store
    end

    %% Browser Layer
    subgraph Browser [Browser APIs]
        Audio -->|Mic Input| MediaAPI[MediaRecorder API]
        Speech -->|Audio Output| WebSpeech[Web Speech API]
        Store -->|Persist| DB[(LocalStorage)]
    end

    class Views,Logic,Browser box;
```

## 2. 🛠️ Tech Stack

The application uses a modern, lightweight frontend stack designed for performance, accessibility, and zero maintenance costs.

| Component | Technology | Reason for Choice |
| :--- | :--- | :--- |
| **Frontend Library** | **React 18** | Enables a component-based architecture, making UI elements (like Flashcards) reusable and state management predictable. |
| **Build Tool** | **Vite** | Chosen over Create React App (CRA) for its significantly faster dev server start-up, instant Hot Module Replacement (HMR), and optimized production builds. |
| **Routing** | **React Router DOM** | Handles client-side navigation seamlessly, allowing the app to transition between categories and flashcards without full page reloads (SPA behavior). |
| **Styling** | **CSS3 (Custom)** | We used custom CSS with Variables (`var(--color)`) and Flexbox/Grid to achieve the specific "child-friendly" aesthetic (large gradients, rounded corners) that generic frameworks often lack. |
| **Audio Input** | **MediaRecorder API** | A native browser API that allows audio capture directly in the client. **Privacy Benefit:** Audio data is processed in RAM and never uploaded to a server. |
| **Audio Output** | **Web Speech API** | Uses the device's built-in Text-to-Speech (TTS) engine. This avoids the latency, cost, and complexity of cloud-based TTS services (like Google Cloud or AWS Polly). |
| **Data Persistence** | **LocalStorage** | Simple key-value storage used to save user progress (gamification). It works offline and ensures user data remains private on their device. |
| **Deployment** | **Vercel** | Provides zero-config deployment for Vite apps, automatic SSL (HTTPS) which is **required** for microphone permissions, and CI/CD via GitHub. |

## 3. 📂 Project Structure

The project follows a modular structure, separating visual components (`components`), page views (`pages`), static data (`data`), and styling (`styles`). Note that custom hooks are located within the `utils` directory.

```text
src/
├── assets/                         # Static assets
│   └── images/                     # Organized by category (animals, foods, toys)
├── components/                     # Reusable UI Components
│   ├── CategoryCard.jsx            # Home screen navigation card
│   ├── CelebrationModal.jsx        # Popup for completion
│   ├── CompletionCelebration.jsx   # Animation logic
│   ├── Flashcard.jsx               # The main game card component
│   └── ProgressBar.jsx             # Visual progress indicator
├── data/                           # Static Configuration Data
│   ├── categories.js               # Category metadata (colors, icons)
│   └── flashcards.js               # The "Database" of words and image paths
├── pages/                          # Main Application Views
│   ├── FlashcardPage.jsx           # The core game container
│   ├── Home.jsx                    # Dashboard / Category selection
│   └── Welcome.jsx                 # Landing / Start screen
├── styles/                         # CSS Modules (Separated by component)
│   ├── CategoryCard.css            # Styles for category buttons
│   ├── CelebrationModal.css        # Styles for the popup modal
│   ├── CompletionCelebration.css   # Styles for animations
│   ├── Flashcard.css               # Layout specific to the card UI
│   ├── FlashcardAnimations.css     # Keyframes for recording/playing effects
│   ├── FlashcardMobile.css         # Mobile-specific media queries
│   ├── Home.css                    # Styles for the dashboard
│   ├── index.css                   # Global resets
│   ├── ProgressBar.css             # Styles for the progress indicator
│   ├── Toast.css                   # Styling for alert messages
│   └── Welcome.css                 # Styles for the landing page
├── utils/                          # Helper Functions & Custom Hooks
│   ├── storage.js                  # LocalStorage abstraction layer
│   ├── useAudioRecorder.js         # MediaRecorder logic & permissions
│   └── useSpeechSynthesis.js       # Text-to-Speech logic
├── App.jsx                         # Route definitions
└── main.jsx                        # Entry point
```

## 4. ⚙️ Key Implementation Details

This section outlines the specific logic used to handle media and data without a backend.

### A. Audio Recording (`utils/useAudioRecorder.js`)
We implemented a custom hook to manage the `MediaRecorder` lifecycle.
1.  **Permission:** Requests microphone access using `navigator.mediaDevices.getUserMedia`.
2.  **Recording:** Captures audio data into "chunks" (arrays of binary data) while active.
3.  **Processing:** On stop, it combines these chunks into a single `Blob`.
4.  **Playback:** Creates a temporary `Blob URL` (e.g., `blob:http://...`) allowing immediate playback in the browser without uploading to a server.

### B. Text-to-Speech (`utils/useSpeechSynthesis.js`)
The app utilizes the browser's native **Web Speech API**.
* **Voice Selection:** The logic iterates through available system voices to find a "Female English" voice for a softer, teacher-like tone.
* **Compatibility:** It handles browser differences (Chrome vs. Firefox vs. Safari) regarding how voices are loaded and named.

### C. Data Persistence (`utils/storage.js`)
To gamify the experience, we track completed words per category using the browser's **LocalStorage**.
* **Storage Key:** `talkplay_progress`
* **Data Structure:**
    ```json
    {
      "animals": ["a1", "a3"],
      "foods": ["f1"],
      "toys": []
    }
    ```
* **Why LocalStorage?** It allows the user to refresh the page or close the browser without losing their progress bar status, while keeping the app serverless and private.

---

## 5. 🚀 Deployment & Routing Strategy

### Hosting
The application is deployed as a static site on **Vercel**.

### SPA Routing Strategy (The `vercel.json` fix)
Since React Router handles navigation on the client side (e.g., `/category/animals`), a direct visit or refresh on that URL would normally cause a **404 Error** on a static server (because the file `animals.html` does not exist).

To fix this, we included a **`vercel.json`** file in the root directory:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
