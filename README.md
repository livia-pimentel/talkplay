# TalkPlay 🗣️

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

> **🎮 Play Now (Live Demo):** [https://talkplay.vercel.app](https://talkplay.vercel.app)

TalkPlay is a free, interactive web application designed to help children
aged 3-5 with speech development delays. It makes daily pronunciation
practice engaging through interactive flashcards, allowing parents to
support and track their child's progress at home.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [Development](#-development)
- [The Team](#-the-team)
- [License](#-license)

## ✨ Features

### 🎮 Core Gameplay

- **🗣️ Text-to-Speech**: Uses the browser's native **Web Speech API**
to pronounce words clearly in a female English voice.
- **🎤 Voice Recording**: Allows children to record their
own pronunciation using the **MediaRecorder API**.
- **▶️ Instant Playback**: Children can listen to their own recordings
immediately to compare with the correct pronunciation.
- **🦁 Three Learning Categories**:
  - Animals, Foods, and Toys (30 curated flashcards with colorful illustrations).

### 🏆 Gamification & Persistence

- **💾 Auto-Save Progress**: Progress is automatically saved
to the browser's **LocalStorage**, so children can
close the tab and resume later without losing data.
- **📊 Visual Progress Bars**: Real-time feedback showing
how many words have been mastered in the current category.
- **🎉 Celebration Screen**: Fun animations and
encouraging messages appear when a category is completed.

### ⚙️ UX & Technical

- **📱 Child-Friendly Interface**: Large buttons, vibrant gradients,
and intuitive navigation designed for small hands.
- **🛡️ Browser Compatibility Check**: Automatically detects if the
browser supports the necessary Audio APIs and alerts the user if
a switch to Chrome/Edge is needed.
- **🎨 Fully Responsive**: Optimized layouts for Mobile, Tablet, and Desktop.

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.2
- **Styling**: CSS and Bootstrap with custom animations
- **Code Quality**: ESLint 9.39.1
- **Routing:** React Router DOM
- **Audio APIs:** - `MediaRecorder API` (for recording)
  - `Web Speech API` (for text-to-speech)
- **Persistence:** LocalStorage API

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/livia-pimentel/talkplay.git
   cd talkplay
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`
   (or the port shown in your terminal)

### Build for Production

```bash
npm run build
```

The optimized production build will be created in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```text
talkplay/
├── docs/                          # Documentation files
│   └── design-document.html
├── talkplay/                      # Main application directory
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── assets/
│   │   │   └── images/
│   │   │       ├── animals/       # 10 animal images
│   │   │       ├── categories/    # Category icons
│   │   │       ├── foods/         # 10 food images
│   │   │       └── toys/          # 10 toy images
│   │   ├── components/
│   │   │   ├── CategoryCard.jsx   # Reusable category card component
│   │   │   └── CategoryCard.css
│   │   ├── data/
│   │   │   ├── categories.js      # Category definitions
│   │   │   └── flashcards.js      # 30 flashcard data entries
│   │   ├── pages/
│   │   │   ├── Welcome.jsx        # Landing page
│   │   │   ├── Home.jsx           # Category selection page
│   │   │   └── FlashcardPage.jsx  # Flashcard display page
│   │   ├── styles/
│   │   │   └── global.css         # Global styles
│   │   ├── utils/
│   │   │   └── storage.js         # Local storage utilities
│   │   ├── main.jsx               # App entry point & routing
│   │   └── index.css              # Base styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── eslint.config.js
└── README.md
```

## 🎮 Usage

### For Parents and Educators

1. **Welcome Screen**: Start by clicking "Start Playing!" on the welcome screen
2. **Choose a Category**: Select from Animals, Foods, or Toys
3. **Listen:** Tap the **Speaker 🔊** button to hear the word.
4. **Record:** Tap the **Microphone 🎤** button.
   - *Note: You must click "Allow" on the browser permission popup.*
5. **Play:** Tap **Play ▶️** to hear your own voice!
6. **Finish:** Complete all 10 words to see the celebration screen!

### Navigation Flow

```text
Welcome Page (/)
         ↓
Category Selection (/categories)
         ↓
Flashcard Practice (/category/:categoryId)
```

## 💻 Development

### Code Structure

- **Components**: Reusable UI components following React best practices
- **Pages**: Route-level components for different views
- **Data**: Centralized data management for categories and flashcards
- **Utils**: Helper functions for storage and other utilities
- **Styles**: Modular CSS with component-specific and global styles

### Adding New Content

#### Adding a New Category

1. Add category definition in `src/data/categories.js`
2. Add category icon to `src/assets/images/categories/`
3. Create flashcards in `src/data/flashcards.js` with matching category ID

#### Adding New Flashcards

1. Add image to appropriate category folder in `src/assets/images/`
2. Import image in `src/data/flashcards.js`
3. Add new flashcard object to `allFlashcards` array

## 👥 The Team

This project was developed as a Capstone Project by:

- **Andrea Toreki**
- **Amon A. Vieira**
- **Livia Pimentel**

## 📄 License

This project is open source and available for educational purposes.
