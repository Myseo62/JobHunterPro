# Career-Bazaar Site Map & Navigation Structure

## 🗺️ Complete Site Architecture

```
Career-Bazaar
│
├── 🏠 PUBLIC PAGES (No Login Required)
│   ├── / (Homepage)
│   ├── /jobs (Job Listings)
│   ├── /jobs/:id (Job Details)
│   ├── /companies (Companies Directory)
│   ├── /companies/:id (Company Profile - Legacy)
│   ├── /company/profile/:id (Company Profile - New)
│   ├── /blog (Blog Index)
│   ├── /blog/:id (Blog Posts)
│   ├── /services (Services)
│   ├── /resources (Resources)
│   ├── /contact (Contact)
│   ├── /about (About Us)
│   ├── /faq (FAQ)
│   ├── /help (Help Center)
│   ├── /terms (Terms & Conditions)
│   └── /privacy (Privacy Policy)
│
├── 🔐 AUTHENTICATION
│   ├── /login (Candidate Login)
│   ├── /register (Candidate Registration)
│   ├── /auth/employer-login (Employer Login)
│   └── /auth/employer-register (Employer Registration)
│
├── 👤 CANDIDATE DASHBOARD (/candidate-dashboard)
│   ├── #profile (Profile & Resume)
│   ├── #applied-jobs (Applied Jobs)
│   ├── #saved-jobs (Saved Jobs)
│   ├── #job-alerts (Job Alerts)
│   ├── #messages (Messages)
│   ├── #meetings (Meetings & Interviews)
│   ├── #following-companies (Following Companies)
│   └── #account-settings (Account Settings)
│
├── 💼 EMPLOYER PAGES
│   ├── /employer/dashboard (Employer Dashboard)
│   │   ├── Overview Tab
│   │   ├── Post Job Tab (🚫 Hidden from header menu)
│   │   ├── Candidates Tab
│   │   ├── Team Tab
│   │   ├── Analytics Tab
│   │   ├── Subscription Tab
│   │   └── Settings Tab
│   ├── /employer/search-resume (Resume Search)
│   └── /employer/pricing (Pricing Plans)
│
└── 🏢 COMPANY MANAGEMENT
    ├── /company/dashboard (Company Dashboard)
    └── /company/settings (Company Settings)
```

## 📊 Navigation Flow Diagram

### **User Type Detection & Routing:**

```
User Visits Site
│
├── Guest User
│   ├── Can Browse: Jobs, Companies, Blog
│   ├── Cannot: Apply, Save Jobs, Access Dashboard
│   └── Must Login/Register for Protected Features
│
├── Candidate User
│   ├── Full Access to Job Search & Applications
│   ├── 8-Tab Candidate Dashboard
│   ├── Reward Points System
│   └── Blog Writing/Reading
│
├── Employer User
│   ├── 7-Tab Employer Dashboard
│   ├── Job Posting (Dashboard Only)
│   ├── Candidate Search
│   └── Application Management
│
└── Company Admin
    ├── Company Profile Management
    ├── Team Management
    └── Analytics Access
```

## 🧭 Header Navigation by User Type

### **Guest User Header:**
```
[Logo] Jobs | Companies | Blog | Services | Resources [Login] [Register]
```

### **Candidate User Header:**
```
[Logo] Jobs | Companies | Blog | Services | Resources [🏆 Points] [User Menu ▼]
                                                                    ├── Profile & Resume
                                                                    ├── Applied Jobs
                                                                    ├── Saved Jobs
                                                                    ├── Job Alerts
                                                                    ├── Messages
                                                                    ├── Meetings & Interviews
                                                                    ├── Following Companies
                                                                    ├── Account Settings
                                                                    └── Logout
```

### **Employer User Header:**
```
[Logo] Dashboard | Search Resume | Pricing [User Menu ▼]
                                            ├── Dashboard
                                            ├── Company Settings
                                            └── Logout
```

## 🎯 Key Features by Page

### **Homepage (/)**
- Hero section with job search
- Featured job listings
- Company showcases
- Statistics counters
- Call-to-action buttons

### **Jobs (/jobs)**
- Advanced search filters
- Sort and filter options
- Job cards with key details
- Pagination
- Save job functionality (logged-in users)

### **Job Detail (/jobs/:id)**
- Complete job description
- Company information card
- Apply button with login check
- Similar job recommendations
- Social sharing options

### **Companies (/companies)**
- Company directory with search
- Industry and size filters
- Company ratings and reviews
- Job count per company
- Follow company option

### **Company Profile (/companies/:id or /company/profile/:id)**
- Company overview and details
- Current job openings
- Company culture information
- Employee reviews
- Contact information

### **Blog (/blog)**
- Featured articles
- Category filtering
- Search functionality
- Author information
- Reading time estimates

### **Candidate Dashboard (/candidate-dashboard)**
- **Profile Tab:** Resume builder, skills management
- **Applied Jobs:** Application tracking and status
- **Saved Jobs:** Bookmarked positions
- **Job Alerts:** Automated job notifications
- **Messages:** Communication with employers
- **Meetings:** Interview scheduling
- **Following:** Company updates
- **Settings:** Account preferences

### **Employer Dashboard (/employer/dashboard)**
- **Overview:** Statistics and recent activity
- **Post Job:** Complete job posting form (🚫 Not in header)
- **Candidates:** Search and contact candidates
- **Team:** Manage team members
- **Analytics:** Performance metrics
- **Subscription:** Plan management
- **Settings:** Company configuration

## 🏆 Reward Points System

### **Point Values:**
- Friend Referral: 20 points
- Blog Reading: 5 points
- Blog Writing: 50 points
- Daily Login: 5 points
- Profile Completion: 50 points

### **Reward Features:**
- Header points widget
- Activity tracking
- Leaderboard
- Redemption catalog

## 🔒 Access Control Matrix

| Page/Feature | Guest | Candidate | Employer | Company Admin |
|--------------|-------|-----------|----------|---------------|
| Browse Jobs | ✅ | ✅ | ❌ | ❌ |
| Apply for Jobs | ❌ | ✅ | ❌ | ❌ |
| Company Profiles | ✅ | ✅ | ✅ | ✅ |
| Blog Reading | ✅ | ✅ | ❌ | ❌ |
| Blog Writing | ❌ | ✅ | ❌ | ❌ |
| Candidate Dashboard | ❌ | ✅ | ❌ | ❌ |
| Employer Dashboard | ❌ | ❌ | ✅ | ❌ |
| Post Jobs | ❌ | ❌ | ✅ | ✅ |
| Search Resumes | ❌ | ❌ | ✅ | ✅ |
| Company Management | ❌ | ❌ | ❌ | ✅ |

## 📱 Responsive Breakpoints

### **Desktop (1200px+):**
- Full navigation menu
- Multi-column layouts
- Detailed sidebar information

### **Tablet (768px - 1199px):**
- Collapsed navigation
- Two-column grids
- Touch-optimized buttons

### **Mobile (< 768px):**
- Hamburger menu
- Single-column layout
- Bottom navigation for dashboards
- Swipe gestures

## 🎨 Design System

### **Color Palette:**
- Primary: Purple (#6B46C1) to Green (#059669) gradient
- Secondary: Light purple and green shades
- Background: Gradient with glassmorphism effects
- Text: Dark gray (#1F2937) for primary, lighter grays for secondary

### **Typography:**
- Headers: Inter font family
- Body: System font stack
- Font sizes: 12px to 48px scale
- Font weights: 400 (normal), 500 (medium), 600 (semibold), 700 (bold)

### **UI Components:**
- Cards with subtle shadows and hover effects
- Gradient buttons with hover states
- Form inputs with focus states
- Badges for tags and status indicators
- Progress bars for profile completion

## 🧪 Testing Checklist

### **Navigation Testing:**
- [ ] All header links work correctly
- [ ] User menu dropdowns function properly
- [ ] Breadcrumb navigation where applicable
- [ ] Back button functionality
- [ ] Deep linking to dashboard tabs works

### **Authentication Flow:**
- [ ] Login/logout functionality
- [ ] Registration process
- [ ] Password reset
- [ ] Social login integration
- [ ] Role-based access control

### **Core Functionality:**
- [ ] Job search and filtering
- [ ] Job application process
- [ ] Company profile viewing
- [ ] Blog reading and writing
- [ ] Dashboard tab navigation
- [ ] Reward points accumulation

### **Responsive Design:**
- [ ] Mobile navigation menu
- [ ] Touch-friendly buttons
- [ ] Readable text on all devices
- [ ] Proper image scaling
- [ ] Optimized layouts for each breakpoint

This site map provides a complete overview of the Career-Bazaar platform structure for comprehensive testing and navigation.