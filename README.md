# HealthVault

HealthVault is a secure, digital health record management system designed for patients, doctors, and diagnostic centers. It streamlines the process of uploading, sharing, and searching medical records, ensuring that critical health information is always at your fingertips.

## 🚀 Key Features

- **For Patients:** Securely upload and organize medical reports, prescriptions, and bills. Share records with doctors via time-bound, secure links.
- **For Doctors:** Instant access to patient medical history, enabling faster and more accurate consultations.
- **For Diagnostic Centers:** Paperless report delivery. Upload results directly to patient profiles, reducing manual follow-ups and physical paperwork.
- **🔒 Security First:** 256-bit encryption for data at rest and in transit. Role-based access control (RBAC) ensures your data is only seen by those you authorize.
- **⚡ Smart Search:** Quickly find specific records by date, type, or tags.
- **📱 Mobile Responsive:** Accessible on any device, from desktop to mobile.

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Bootstrap, CSS3 (Vanilla)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Cloud Storage:** Cloudinary (for secure file storage)
- **Authentication:** JWT-based secure sessions

## 📂 Project Structure

```text
├── backend/            # Express server, API routes, and models
│   ├── Controllers/    # Business logic for each feature
│   ├── models/         # Mongoose schemas (User, File, etc.)
│   ├── routes/         # API endpoint definitions
│   └── config/         # Database and third-party service configs
└── Frontend/           # React application
    ├── src/
    │   ├── components/ # Reusable UI components
    │   ├── pages/      # Main application views
    │   ├── styles/     # Professional CSS theme and page styles
    │   └── assets/     # Images and icons
```

## ⚙️ Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB account (Atlas or local)
- Cloudinary account (for file uploads)

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_name
   CLOUDINARY_API_KEY=your_key
   CLOUDINARY_API_SECRET=your_secret
   ```
4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
