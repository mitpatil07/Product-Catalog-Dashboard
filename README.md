# StockSync Product Catalog Dashboard

A responsive, high-performance, and visually stunning React application designed for managing a product inventory catalog. Built with **React.js**, **React Router**, and the newly released **Tailwind CSS v4** with native `@tailwindcss/vite` integration.

## ✨ Features

- **📊 Comprehensive Analytics Dashboard**:
  - Key metrics cards for **Total Products**, **Active Products**, **Inactive Products**, and **Total Inventory Value**.
  - Custom HTML/CSS-based Category Distribution visualization.
  - Critical stock-level alerting warning system.
- **🛍️ Advanced Product Management List**:
  - **View Toggle**: Switch between an elegant grid layout or a clean tabular list view.
  - **Dynamic Filters**: Filter by Category and Listing Status (All / Active / Inactive).
  - **Search**: Real-time keyword filter by product name.
  - **Sorting**: Order by Name (A-Z / Z-A) and Price (Low to High / High to Low).
  - **Pagination**: High-performance paging with page count indicators.
- **✍️ Unified Product Form (Add/Edit)**:
  - Form validation with reactive inline error messaging and touched fields tracking.
  - **Live Visual Preview**: Side-by-side product card mockup updating in real-time as you type.
  - **Custom Category Fields**: Add items in preset categories or easily write in custom category types.
- **🌓 Adaptive Theme Modes**:
  - Seamless Light and Dark modes.
  - Selector-based customization powered by Tailwind CSS v4's `@custom-variant`.
- **💾 Local Storage Persistence**:
  - Automatically preserves product lists and theme choices across browser restarts.
  - Pre-seeded with 8 mock inventory products for immediate visual inspection.
- **🔔 Toast System**:
  - Custom contextual notification pop-ups (Success / Info / Warning / Error) with smooth entrance/exit animations.

---

## 📁 Folder Structure

The project strictly follows the requested modular layout:

```text
product-dashboard/
├── dist/                  # Production build output
├── public/                # Static public assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Button.jsx     # Button configurations (variants, sizes, loading)
│   │   ├── Card.jsx       # Elegant glassmorphic container layout
│   │   ├── Modal.jsx      # Deletion gates and prompts
│   │   ├── Navbar.jsx     # Navigation bar and theme switcher toggle
│   │   └── Pagination.jsx # Paging navigator
│   ├── context/           # React Context Providers
│   │   └── ToastContext.jsx # Queue-based toast provider & hook
│   ├── hooks/             # Custom state hooks
│   │   └── useLocalStorage.js # Sync states with localStorage + mock seed data
│   ├── pages/             # Route-level views
│   │   ├── Dashboard.jsx  # Analytics overview
│   │   ├── ProductForm.jsx# Add / Edit form with live preview
│   │   └── ProductList.jsx# Main searchable catalog
│   ├── App.jsx            # Main app router wrapper
│   ├── index.css          # Tailwind CSS configuration entrypoint
│   └── main.jsx           # Mounting entrypoint
├── package.json
└── README.md
```

---

## 🛠️ Tech Stack & Packages

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Routing**: [React Router DOM 7](https://reactrouter.com/)
- **Icons**: [Lucide React 0.47](https://lucide.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Persistance**: HTML5 Local Storage API

---

## 🚀 Running the Application Locally

### Prerequisites
Make sure you have Node.js installed on your machine (v18 or higher recommended).

### Setup and Start

1. **Navigate into the folder**:
   ```bash
   cd product-dashboard
   ```

2. **Install all dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the address shown in the terminal (usually `http://localhost:5173`).

### 📦 Building for Production

To create a optimized production bundle, run:
```bash
npm run build
```

*Note for Windows users*: If running the build from directory paths containing spaces or shell characters (like `&`), npm scripts might trigger Windows command-line errors. You can bypass this shell limitation by running the bundler directly:
```bash
node node_modules/vite/bin/vite.js build
```
The compiled output will be generated inside the `dist/` folder, ready for deployment.
