# 🚢 Maritime Captain Dashboard - Documentation

Yeh file aapko guide karegi ke aapka **Maritime Dashboard** project kaise kaam karta hai aur iske features ko kaise use karna hai.

---

## 🏗️ 1. Project Overview
Yeh ek **Full-Stack Application** hai jo jahaz (vessel) ke daily operations, fuel inventory, aur reports ko manage karne ke liye banayi gayi hai.

### **Tech Stack:**
*   **Frontend**: React.js (Vite), Tailwind CSS (for styling), Axios (for API calls).
*   **Backend**: Node.js, Express.js.
*   **Database**: MongoDB (With In-Memory fallback taake bina setup ke chale).
*   **Security**: JWT (Authentication) aur Bcrypt (Password hashing).

---

## 🛠️ 2. Project ki Chizein Kaise Kaam Karti Hain?

### **A. Registration & Login (Authentication)**
1.  Jab aap pehli baar dashboard open karte hain, aapko **Login** ya **Register** karna hota hai.
2.  Aapka data backend par jata hai, jahan password secure format mein save hota hai.
3.  Login hote hi aapko ek **JWT Token** milta hai jo aapke browser ki `localStorage` mein save ho jata hai. Isi token ki wajah se aapka account logged-in rehta hai.

### **B. Dashboard (Command Center)**
Dashboard par aapko jahaz ka current status nazar aata hai:
*   **Stats Cards**: Yeh backend se live data uthate hain (e.g., Engine Hours, Fuel Efficiency).
*   **Alerts Panel**: Top-right bell icon par click karne se critical alerts khultay hain (Low Fuel, Weather Alerts).

### **C. Oil & Fuel Inventory (Most Important ⛽)**
Inventory section jahaz ke tel (fuel) ko track karta hai.
*   **HFO / MGO Levels**: Yeh bars dikhate hain ke tel kitna bacha hai.
*   **Record Bunkering**: Jab jahaz mein naya tel dala jata hai, toh "Record Bunkering" button se aap system mein amount add kar sakte hain.
*   **Update Consumption**: Engine kitna tel pee raha hai, aap yahan manual entry karke "Days Remaining" calculate kar sakte hain.
*   **Heal/Setup**: Agar data missing ho, toh "Setup Engine Room" button click karne se system default values initialize kar deta hai.

### **D. Daily Reports System 📋**
Aap daily log aur reports yahan manage karte hain.
*   **New Report**: `+ New Report` click karne se ek interactive form khulta hai jahan aap Noon Report ya Arrival Report select karke remarks dal sakte hain.
*   **View & Update**: Har report ke aage `View` button hai. 
    *   Agar report **Pending** hai, toh aap usey view karke **Approve** kar sakte hain.
    *   Approve karte hi stats update ho jate hain.

---

## 📂 3. Project Structure (Files Guide)

```text
maritime-dashboard/
├── backend/                # Server Side Logic
│   ├── src/
│   │   ├── controllers/    # Features ka dimaag (Inventory, Auth logic)
│   │   ├── models/         # Database ki shakall (User schema, Inventory schema)
│   │   ├── routes/         # API ke rastey (/login, /inventory)
│   │   └── config/db.js    # Database connection logic
│   └── server.js           # Server startup file
│
├── frontend/               # User Interface (UI)
│   ├── src/
│   │   ├── components/     # Reusable parts (Navbar, Sidebar, Header)
│   │   ├── pages/          # Full Screens (Dashboard, Inventory, Reports)
│   │   └── services/api.js # Backend se baat karne wala bridge
```

---

## 🚀 4. Kaise Chalayein? (How to Run)

### **Method 1: Separate (Recommended for Dev)**
1.  **Backend**: `cd backend` -> `npm run dev` (Chalta hai port 5000 par).
2.  **Frontend**: `cd frontend` -> `npm run dev` (Chalta hai port 5173 par).

### **Method 2: Unified (In Unified Folder)**
*   Root folder mein jayein: `npm run dev`. Yeh ek hi command se dono (Frontend + Backend) start kar dega.

---

## 💡 5. Pro Tips
*   **Data Missing?**: Agar Inventory blank aye, toh ek bar Logout karke dobara Login karein aur "Setup" button dabayein.
*   **Backend Check**: [http://localhost:5000/health](http://localhost:5000/health) par ja kar dekhein agar backend correctly "Connected" hai.
*   **Interactive UI**: Project mein jagah jagah buttons aur animations hain, unhe hover aur click karke test karein.

---

**Yeh project ek complete Maritime SAAS product ki buniyad hai!** 🚢
