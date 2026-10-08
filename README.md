# ExhibitPro

### Premium Exhibition Stand & Event Services Web Platform

ExhibitPro is a modern, responsive exhibition services web application designed to showcase exhibition stand solutions, services, completed projects, service areas, company information, and contact enquiries through a polished digital experience.

The application combines a **React + Vite frontend** with **Supabase-powered authentication and content management**, allowing authorized administrators to manage website content without modifying the frontend source code.

---

## ✨ Features

### 🌐 Public Website

* Modern responsive landing page
* Company / About section
* Exhibition services showcase
* Project portfolio with individual project detail pages
* Service-area information
* Contact / enquiry functionality
* Responsive navigation and footer
* Dynamic company branding and footer content
* WhatsApp floating contact button
* Light / dark theme support
* Animated UI elements and transitions
* Custom intro/loading experience
* 404 / Not Found page

### 🗂️ Project Management

* Dynamic project listing
* Individual project detail pages
* Slug-based project routing
* Project media/content management
* Admin-controlled project information

### 🛠️ Service Management

* Dynamic services section
* Admin-managed service content
* Service-area management
* Content visibility controls

### 🔐 Admin Dashboard

The application includes a protected admin area for managing website content.

Admin functionality includes:

* Admin authentication
* Dashboard
* Home page editor
* About page editor
* Services manager
* Projects manager
* Service areas manager
* Messages / enquiries inbox
* Footer editor
* Global settings manager

Admin routes are protected using authentication and role-based access checks.

### 📝 Dynamic Content Management

Content is organized into reusable page blocks.

The custom `useContent` hook provides a centralized interface for:

* Loading page content
* Loading admin content
* Retrieving individual content blocks
* Creating/updating blocks
* Toggling block visibility
* Refreshing content

This allows the public website to consume dynamically managed content instead of hard-coded page data.

### 🎨 UI / UX

* Responsive design
* Dark/light theme support
* Smooth animations
* Lazy-loaded pages
* Loading skeletons
* Toast notifications
* Icon-based UI using Lucide React
* Image/content sliders using Swiper
* Mobile-friendly layouts

---

## 🧰 Tech Stack

| Category                 | Technology             |
| ------------------------ | ---------------------- |
| Frontend                 | React 19               |
| Build Tool               | Vite                   |
| Language                 | JavaScript / JSX       |
| Routing                  | React Router DOM       |
| Styling                  | Tailwind CSS / PostCSS |
| Backend / BaaS           | Supabase               |
| Database                 | Supabase PostgreSQL    |
| Authentication           | Supabase Auth          |
| Forms                    | React Hook Form        |
| Validation               | Zod                    |
| Animations               | Framer Motion          |
| Icons                    | Lucide React           |
| Sliders                  | Swiper                 |
| Notifications            | React Hot Toast        |
| Linting                  | Oxlint                 |
| Deployment Configuration | Vercel                 |

The dependency configuration is defined in the repository's `package.json`.

---

## 🏗️ Architecture

ExhibitPro follows a component-based React architecture with separate layers for:

```text
UI Components
      │
      ▼
Pages / Routes
      │
      ▼
Hooks / Context
      │
      ▼
Service Layer
      │
      ▼
Supabase
      │
      ├── Authentication
      ├── PostgreSQL Database
      └── Storage / Content
```

### Authentication Flow

The application uses a React `AuthContext` to maintain authentication state.

```text
User
 │
 ▼
Admin Login
 │
 ▼
Supabase Authentication
 │
 ▼
Authenticated Session
 │
 ▼
Admin User Check
 │
 ▼
Protected Admin Routes
```

The application checks the authenticated user's record in the `admin_users` table and grants admin access when the user's role is `admin`.

---

## 🚦 Routing

### Public Routes

| Route             | Purpose             |
| ----------------- | ------------------- |
| `/`               | Home                |
| `/about`          | About company       |
| `/services`       | Exhibition services |
| `/projects`       | Project portfolio   |
| `/projects/:slug` | Project details     |
| `/service-areas`  | Service areas       |
| `/contact`        | Contact / enquiry   |
| `*`               | Not Found           |

### Admin Routes

| Route                  | Purpose               |
| ---------------------- | --------------------- |
| `/admin/login`         | Admin authentication  |
| `/admin/dashboard`     | Admin dashboard       |
| `/admin/home`          | Home content editor   |
| `/admin/about`         | About content editor  |
| `/admin/services`      | Services manager      |
| `/admin/projects`      | Projects manager      |
| `/admin/service-areas` | Service areas manager |
| `/admin/messages`      | Messages / enquiries  |
| `/admin/footer`        | Footer editor         |
| `/admin/settings`      | Global settings       |

The route configuration uses lazy loading with `React.lazy()` and protects admin routes through authentication-aware route guards.

---

## 📁 Project Structure

```text
ExhibitPro/
│
├── public/
│   └── static/public assets
│
├── src/
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar
│   │   │   └── Footer
│   │   │
│   │   └── ui/
│   │       ├── IntroLoader
│   │       ├── SkeletonLoader
│   │       ├── WhatsAppFloat
│   │       └── other reusable UI components
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext
│   │
│   ├── hooks/
│   │   └── useContent.js
│   │
│   ├── pages/
│   │   ├── Home
│   │   ├── About
│   │   ├── Services
│   │   ├── Projects
│   │   ├── ServiceAreas
│   │   ├── Contact
│   │   ├── NotFound
│   │   │
│   │   └── admin/
│   │       ├── Login
│   │       ├── Dashboard
│   │       ├── HomeEditor
│   │       ├── AboutEditor
│   │       ├── ServicesEditor
│   │       ├── ProjectsManager
│   │       ├── ServiceAreasManager
│   │       ├── MessagesInbox
│   │       ├── FooterEditor
│   │       └── SettingsManager
│   │
│   ├── routes/
│   │   └── index.jsx
│   │
│   ├── services/
│   │   ├── supabaseClient.js
│   │   ├── contentApi
│   │   └── other service modules
│   │
│   ├── styles/
│   │   └── globals.css
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── supabase/
│   └── database / Supabase configuration
│
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── README.md
```

> The exact implementation can evolve as the project grows, but the application currently follows this separation of pages, components, contexts, hooks, routes, and service modules.

---

## 🔑 Environment Variables

ExhibitPro uses Vite environment variables for its Supabase configuration.

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

The Supabase client reads these values through Vite's `import.meta.env` mechanism.

### Important

Never commit sensitive credentials to GitHub.

Only use the appropriate public/publishable Supabase client key in the frontend. Do not expose a Supabase service-role key in client-side code.

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/VaibhavDubey95u/ExhibitPro.git
```

### 2. Navigate to the project

```bash
cd ExhibitPro
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create:

```text
.env
```

Add:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Start the development server

```bash
npm run dev
```

Vite will start the development server and provide a local URL in the terminal.

---

## 🧪 Available Scripts

The project provides the following npm scripts:

```bash
# Start development server
npm run dev

# Create production build
npm run build

# Preview production build locally
npm run preview

# Run Oxlint
npm run lint
```

These scripts are defined directly in the project's `package.json`.

---

## 🏭 Production Build

To generate the production build:

```bash
npm run build
```

The optimized application will be generated in:

```text
dist/
```

You can preview the production build locally with:

```bash
npm run preview
```

---

## ☁️ Deployment

The repository contains Vercel deployment configuration and is structured as a Vite single-page application.

### Vercel

Typical deployment flow:

```bash
npm install
npm run build
```

Then deploy the generated application through Vercel.

Make sure the following environment variables are configured in the deployment platform:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

For SPA routing, ensure the deployment configuration serves the application entry point for client-side routes.

---

## 🔐 Admin Access

The admin system is protected through Supabase Authentication.

The application:

1. Authenticates the user using Supabase Auth.
2. Retrieves the current session.
3. Checks the authenticated user's ID against the `admin_users` table.
4. Verifies that the user's role is `admin`.
5. Allows access to protected admin routes only when the check succeeds.

Unauthorized users are redirected to:

```text
/admin/login
```

This authorization flow is implemented in `AuthContext.jsx` and the protected route components.

---

## 🧩 Content Management

One of the main architectural features of ExhibitPro is its dynamic content system.

Instead of coupling every piece of website content directly to page components, the application uses a content API and the `useContent` hook.

```text
Page
 │
 ▼
useContent()
 │
 ▼
contentApi
 │
 ▼
Supabase
 │
 ▼
Content Blocks
```

The hook supports:

```javascript
getBlock()
saveBlock()
toggleVisibility()
refetch()
```

This makes the website easier to maintain because content can be updated from the admin interface without changing the React page implementation.

---

## ⚡ Performance & UX

The application uses several techniques to improve the user experience:

* Route-level lazy loading
* React `Suspense`
* Loading skeletons
* Session-based intro loader
* Responsive layouts
* Theme switching
* Animated interactions
* Toast-based feedback
* Component reuse

Public and admin pages are lazy-loaded through the application's route configuration.

---

## 🛡️ Security Considerations

* Authentication is handled through Supabase Auth.
* Admin access is restricted through role verification.
* Supabase credentials are supplied through environment variables.
* Sensitive credentials should never be committed to Git.
* Client-side applications should only use the appropriate public Supabase key.
* Database access should be protected with appropriate Supabase policies and permissions.

---

## 🔮 Future Improvements

Potential improvements for future versions include:

* [ ] Automated testing
* [ ] Improved accessibility auditing
* [ ] Image optimization and responsive image delivery
* [ ] Advanced analytics dashboard
* [ ] SEO metadata management from the admin panel
* [ ] Sitemap generation
* [ ] Rich project filtering/search
* [ ] Enhanced media management
* [ ] More granular admin permissions
* [ ] Automated CI/CD checks
* [ ] Performance monitoring

---

## 👨‍💻 Developer

**Vaibhav Dubey**

Software Engineering Student | Full-Stack Development | AI/ML Enthusiast

GitHub: [@VaibhavDubey95u](https://github.com/VaibhavDubey95u)

---

## 📄 License

This project does not currently specify an open-source license in the repository.

If you intend to distribute ExhibitPro as an open-source project, consider adding an appropriate `LICENSE` file.

---

## ⭐ Acknowledgements

Built using the modern React ecosystem and Supabase platform.

If you find the project useful or interesting, consider giving the repository a ⭐ on GitHub.
