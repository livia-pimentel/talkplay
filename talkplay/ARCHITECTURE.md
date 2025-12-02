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

