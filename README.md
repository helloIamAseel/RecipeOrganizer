# 🍴 Recipe Organizer

A full-stack recipe sharing platform built with React and Firebase, featuring a warm and cozy aesthetic inspired by the joy of cooking.

## 🚀 Features

- **Discover Recipes** — Browse all community recipes with live search and category filtering
- **Add & Manage Recipes** — Create recipes with title, ingredients, instructions, prep time, category, and notes
- **Edit & Delete** — Authors can edit or delete their own recipes
- **Like System** — Like recipes to save them to your Favorites page
- **Favorites** — View all recipes you've liked in one place
- **Weekly Highlights** — See the top most-liked recipes of the week
- **Authentication** — Register and login with Email/Password or Google sign-in
- **Responsive UI** — Works on mobile, tablet, and desktop

## 🛠 Tech Stack

**Frontend:**
- React + TypeScript
- Tailwind CSS
- React Router DOM

**Backend:**
- Firebase Authentication (Email/Password + Google)
- Firebase Firestore (NoSQL cloud database)
- Firebase Security Rules for data protection

**Other Tools:**
- Vite for dev server and build
- Vercel for deployment

## 🔗 Live Demo
https://recipe-organizer-lovat.vercel.app/

## 🔐 Security

Firestore rules ensure:
- Anyone can read recipes
- Only authenticated users can create recipes
- Only the author can edit or delete their own recipes