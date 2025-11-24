# 🌱 Gardening Planner

**Your Smart Garden Companion**

---

Gardening Planner is a full-featured web application to help you manage, track, and nurture your garden effortlessly. With smart reminders, plant journals, layout planners, and an integrated gardening community, this project offers everything you need to cultivate a healthy and beautiful garden — whether you're a beginner or a seasoned horticulturist.

---

## 🌟 Features

- **User Authentication:** Secure login and registration using Firebase Auth.
- **Personal Plant Library:** Add, edit, and manage your own collection of plants, each with species, location, image, and notes.
- **Smart Reminders:** Set and receive reminders for watering, fertilizing, pruning, and more.
- **Garden Layout Planner:** Visually design your garden grid and place your plants with drag-and-drop support.
- **Plant Health Tracking:** Record health status and maintain a health timeline for each plant.
- **Plant Journal:** Maintain logs and notes for plant growth, with photo support.
- **Weather Integration:** Real-time weather updates and gardening tips based on local weather conditions.
- **Community Wall:** Share experiences, ask questions, and connect with fellow gardeners.
- **Contact & Appointment:** Contact form with appointment booking, backed by Firestore.
- **Newsletter Subscription:** Simple newsletter signup to stay updated.
- **Responsive & Modern UI:** Clean, accessible, and mobile-friendly interface.

---

## 🚀 Live Demo

**Try the Gardening Planner web app here:**

🌱 [https://gardening-planner.netlify.app/](https://gardening-planner.netlify.app/)

> No installation needed — just open the link in your browser and explore all the features!

---

## 🗂️ Project Structure

```
gardening-planner/
│
├── assets/
│ └── images/ # Static images and icons
│
├── css/ # All stylesheets
│  ├── auth.css
│  ├── community.css
│  ├── dashboard.css
│  ├── landing.css
│  ├── layout-planner.css
│  ├── plant-journal.css
│  ├── plant-library.css
│  ├── reminders.css
│  └── styles.css
│
├── js/ # All JavaScript modules
│  ├── app.js
│  ├── appointment-form.js
│  ├── auth-guard.js
│  ├── auth.js
│  ├── community.js
│  ├── dashboard.js
│  ├── firebase-config.js
│  ├── landing-modal.js
│  ├── layout-planner.js
│  ├── login-modal.js
│  ├── plant-journal.js
│  ├── plant-library.js
│  ├── register-modal.js
│  ├── reminders.js
│  └── weather.js
├── index.html # Main landing page
├── login.html # Standalone login
├── register.html # Standalone registration page
├── dashboard.html # Main user dashboard after login
├── README.md # Project documentation
```

---

### 💻 Install & Serve (Local Development)

No build tools required!

- **Option 1:**  
  Open `index.html` directly with your browser.

- **Option 2 (Recommended):**  
  Use the [Live Server extension for VS Code](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer):
  1. Install the extension in VS Code.
  2. Right-click on `index.html` in the Explorer.
  3. Click **"Open with Live Server"**.
  4. Your default browser will open the app at `http://localhost:5500/` (or similar).

---

### 🔥 Firebase Configuration

The project is ready for Firebase integration.

- The Firebase config is in `js/firebase-config.js`.
- If you fork/deploy, [create your own Firebase project](https://console.firebase.google.com/) and update the config values.

---

### 🌐 Environment

- Modern browsers (**Chrome, Edge, Firefox, Safari**) are supported.
- **No Node.js or NPM setup required.** All dependencies use CDN links.

---

### 📝 Usage Guide

- **Landing Page:** Visit `index.html` to learn about the app and sign in/register via the modal.
- **User Dashboard:** After login/registration, you will be redirected to `dashboard.html` with sidebar navigation:
  - **Dashboard:** See your stats and weather.
  - **My Plants:** Manage your plant collection.
  - **Reminders:** Add and view reminders for plant care.
  - **Layout Planner:** Visually arrange your garden grid.
  - **Journal:** Log growth, issues, and progress for your plants.
  - **Weather:** Check current weather and gardening tips.
  - **Community:** Participate in the gardening wall.
- **Contact & Appointment:** Use the contact section on the landing page to reach the team or book appointments.
- **Newsletter:** Subscribe via the form at the bottom of the landing page.

---

### 🛡️ Technologies Used

- **Frontend:** HTML5, CSS3, Modern JavaScript (ES6+), SVG Icons
- **Frameworks/Libraries:** [Font Awesome](https://fontawesome.com/) for icons
- **Backend:** Firebase Auth, Firestore, Storage
- **APIs:** [OpenWeatherMap API](https://openweathermap.org/api) for weather

---

### 🏷️ File Responsibilities

| File/Folder                    | Purpose                                                   |
| ------------------------------ | --------------------------------------------------------- |
| `index.html`                   | Main landing page with info, features, about, and contact |
| `dashboard.html`               | Main app UI after login with all core features            |
| `login.html` / `register.html` | Standalone authentication pages (not used if using modal) |
| `js/`                          | All JavaScript modules, separated by responsibility       |
| `css/`                         | Modular and global CSS styles                             |
| `assets/`                      | Images and icons                                          |

---

### 🧑‍💻 Contribution

Want to contribute? Here’s how:

1. **Fork** the repository
2. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit your changes:**
   ```bash
   git commit -m 'Add awesome feature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature/your-feature
   ```
5. **Open a Pull Request**

> Please follow code style and comment conventions.  
> Raise an issue for bugs/feature requests!

---

### 🙋 FAQ

- **Q: How do I reset my password?**  
  **A:** Use the Firebase "Forgot Password" functionality (add as a feature).

- **Q: Why can't I see my plants after login?**  
  **A:** Make sure you are logged in and your plants were added under your account.

---

### 📄 License

This project is for educational and academic purposes.  
If you wish to use it for commercial or open-source purposes, please check with the author and acknowledge the source.

---

### 👨‍🎓 Author

**Haris Hilal**  
Software & Web Development Enthusiast  
Creator of **Gardening Planner**

📍 Baramulla, Jammu & Kashmir, India  
📧 [harislone0@gmail.com](mailto:harislone0@gmail.com)  
🌐 [LinkedIn](https://www.linkedin.com/in/haris-hilal/) | [GitHub](https://github.com/HARISLONE)

> _“Building digital tools to make nature and knowledge more accessible for everyone.”_
