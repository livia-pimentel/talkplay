# TalkPlay 🗣️

TalkPlay is a free, interactive web application designed to help children aged 3-5 with speech development delays. It makes daily pronunciation practice engaging through interactive flashcards, allowing parents to support and track their child's progress at home.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Usage](#-usage)
- [Development](#-development)
- [License](#-license)

## ✨ Features

- **Interactive Flashcards**: Visual learning with colorful images across three categories
- **Three Learning Categories**:
  - 🦁 Animals (10 flashcards)
  - 🍎 Foods (10 flashcards)
  - 🧸 Toys (10 flashcards)
- **Child-Friendly Interface**: Colorful, animated UI designed for young children
- **Easy Navigation**: Simple routing between welcome, category selection, and flashcard pages
- **Responsive Design**: Works across different devices and screen sizes
- **Progress Tracking**: Local storage for tracking learning progress (in development)

## 🛠️ Tech Stack

- **Frontend Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.2
- **Styling**: CSS and Bootstrap with custom animations
- **Code Quality**: ESLint 9.39.1

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

1. Navigate to the project directory:

```bash
cd talkplay
```

1. Install dependencies:

```bash
npm install
```

1. Start the development server:

```bash
npm run dev
```

1. Open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal)

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
│   │   │   └── fashcards.js       # 30 flashcard data entries
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

## 🎮 Usage

### For Parents and Educators

1. **Welcome Screen**: Start by clicking "Start Playing!" on the welcome screen
2. **Choose a Category**: Select from Animals, Foods, or Toys
3. **Practice Words**: View flashcards with images and practice pronunciation
4. **Track Progress**: The app will remember which words have been practiced (feature in development)

### Navigation Flow

Welcome Page (/)
    ↓
Category Selection (/categories)
    ↓
Flashcard Practice (/category/:categoryId)

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
3. Create flashcards in `src/data/fashcards.js` with matching category ID

#### Adding New Flashcards

1. Add image to appropriate category folder in `src/assets/images/`
2. Import image in `src/data/fashcards.js`
3. Add new flashcard object to `allFlashcards` array

## 📄 License

This project is open source and available for educational purposes.
