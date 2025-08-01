# Career-Bazaar Testing Guide & Site Map

## Overview
This document provides a comprehensive testing guide for the Career-Bazaar job portal application. Use this as your navigation map to test every page, feature, and user flow.

## User Roles & Access Levels

### 1. **Guest User (Not Logged In)**
- Can browse jobs, companies, and blog content
- Cannot apply for jobs or access personalized features
- Must register/login for advanced features

### 2. **Candidate User**
- Full access to job search, applications, and profile management
- Access to candidate dashboard with 8 tabs
- Can write and read blog posts (reward points system)

### 3. **Employer User**
- Access to employer dashboard with job posting
- Can manage job listings and view applications
- Access to candidate search and messaging

## Complete Site Navigation Map

### **Header Navigation (Always Visible)**

#### For Guest Users:
```
Logo: Career-Bazaar
├── Jobs (/jobs)
├── Companies (/companies)
├── Blog (/blog)
├── Services (/services)
├── Resources (/resources)
└── Login/Register Buttons
```

#### For Logged-in Candidates:
```
Logo: Career-Bazaar
├── Jobs (/jobs)
├── Companies (/companies)
├── Blog (/blog)
├── Services (/services)
├── Resources (/resources)
├── Reward Points Widget (shows current points)
└── User Menu Dropdown:
    ├── Profile & Resume (/candidate-dashboard#profile)
    ├── Applied Jobs (/candidate-dashboard#applied-jobs)
    ├── Saved Jobs (/candidate-dashboard#saved-jobs)
    ├── Job Alerts (/candidate-dashboard#job-alerts)
    ├── Messages (/candidate-dashboard#messages)
    ├── Meetings & Interviews (/candidate-dashboard#meetings)
    ├── Following Companies (/candidate-dashboard#following-companies)
    ├── Account Settings (/candidate-dashboard#account-settings)
    └── Logout
```

#### For Employer Users:
```
Logo: Career-Bazaar
├── Dashboard (/employer/dashboard)
├── Search Resume (/employer/search-resume)
├── Pricing (/employer/pricing)
└── User Menu with Logout
```

### **All Pages & Routes**

## 🏠 **Public Pages (No Login Required)**

### **1. Home Page** (`/`)
**Layout:** Hero section + Search bar + Featured jobs + Companies + Stats
**Testing Points:**
- Hero banner displays "Find your career, not just a job"
- Search functionality with location and experience filters
- Featured job cards are clickable
- Featured company logos link to company profiles
- "Get Started" CTA buttons work

### **2. Jobs Listing** (`/jobs`)
**Layout:** Search filters + Job cards grid + Pagination
**Testing Points:**
- Search by keyword, location, experience level
- Filter by salary range, company, job type
- Sort by relevance, date, salary
- Job cards show title, company, location, salary
- "Apply Now" button (requires login for guests)

### **3. Job Detail** (`/jobs/:id`)
**Layout:** Job info + Company card + Apply section + Similar jobs
**Testing Points:**
- Full job description displays correctly
- Company information card links to company profile
- Apply button functionality (login required for guests)
- Similar jobs recommendations
- Share job functionality

### **4. Companies Directory** (`/companies`)
**Layout:** Search + Filter + Company cards grid
**Testing Points:**
- Search companies by name
- Filter by industry, company size, location
- Company cards show logo, name, rating, job count
- "View Profile" links work correctly

### **5. Company Profile** (`/companies/:id` OR `/company/profile/:id`)
**Layout:** Company header + About + Jobs + Reviews
**Testing Points:**
- Company banner with logo, name, rating
- About section with description, website link
- Active job listings from this company
- Company statistics (employees, founded, etc.)
- "Follow Company" button (login required)

### **6. Blog Index** (`/blog`)
**Layout:** Featured articles + Search/filter + Article grid
**Testing Points:**
- Featured blog posts highlighted
- Search articles by keyword
- Filter by category (Career Tips, Interview Prep, etc.)
- Sort by latest, popular, title
- Article cards show title, excerpt, author, read time

### **7. Blog Post** (`/blog/:id`)
**Layout:** Article header + Content + Author info + Related posts
**Testing Points:**
- Full article content displays properly
- Author information and avatar
- Social sharing buttons
- Related articles recommendations
- Reading time estimate

## 🔐 **Authentication Pages**

### **8. Candidate Login** (`/login`)
**Layout:** Login form + Social login + Register link
**Testing Points:**
- Email/password login form
- "Remember me" checkbox
- Social login buttons (Google, LinkedIn)
- "Forgot password" link
- "Create account" link to registration

### **9. Candidate Register** (`/register`)
**Layout:** Registration form + Terms acceptance
**Testing Points:**
- Full name, email, password fields
- Password strength indicator
- Terms & conditions checkbox
- Social registration options
- "Already have account" link to login

### **10. Employer Login** (`/auth/employer-login`)
**Layout:** Employer-specific login form
**Testing Points:**
- Work email and password fields
- "Create employer account" link
- "Back to candidate login" option

### **11. Employer Register** (`/auth/employer-register`)
**Layout:** Company registration form
**Testing Points:**
- Company name, industry, size fields
- Employer contact information
- Company description
- Terms acceptance for employers

## 👤 **Candidate Dashboard Pages**

### **12. Candidate Dashboard** (`/candidate-dashboard`)
**Layout:** Tabbed interface with 8 sections
**URL Hash Navigation:** Each tab accessible via `#tab-name`

#### **Tab 1: Profile & Resume** (`#profile`)
**Testing Points:**
- Personal information editing
- Resume upload/builder
- Skills management
- Experience and education sections
- Profile completion percentage
- Save/update functionality

#### **Tab 2: Applied Jobs** (`#applied-jobs`)
**Testing Points:**
- List of all job applications
- Application status tracking
- Filter by status (pending, rejected, interviewed)
- Withdraw application option
- Application timeline view

#### **Tab 3: Saved Jobs** (`#saved-jobs`)
**Testing Points:**
- Grid/list of bookmarked jobs
- Search within saved jobs
- Remove from saved jobs
- Apply directly from saved jobs
- Sort by date saved, salary

#### **Tab 4: Job Alerts** (`#job-alerts`)
**Testing Points:**
- Create new job alert form
- List of active alerts
- Edit alert criteria
- Pause/activate alerts
- Delete alerts
- Alert frequency settings

#### **Tab 5: Messages** (`#messages`)
**Testing Points:**
- Conversation list (left panel)
- Message thread view (right panel)
- Send new message
- Attach files to messages
- Message search functionality
- Mark as read/unread

#### **Tab 6: Meetings & Interviews** (`#meetings`)
**Testing Points:**
- Calendar view of upcoming interviews
- Schedule new meeting
- Interview status (scheduled, completed, cancelled)
- Meeting details and preparation notes
- Reschedule functionality

#### **Tab 7: Following Companies** (`#following-companies`)
**Testing Points:**
- Grid of followed companies
- Unfollow company option
- View company updates
- New job notifications from followed companies

#### **Tab 8: Account Settings** (`#account-settings`)
**Testing Points:**
- Personal information updates
- Password change
- Email preferences
- Privacy settings
- Notification preferences
- Account deletion option

## 💼 **Employer Pages**

### **13. Employer Dashboard** (`/employer/dashboard`)
**Layout:** Multi-tab interface with 7 sections

#### **Tab 1: Overview**
**Testing Points:**
- Active jobs counter
- Application statistics
- Recent activity feed
- Quick action buttons

#### **Tab 2: Post Job** (Hidden from header, accessible via dashboard)
**Testing Points:**
- Job posting form with all required fields
- Title, location, experience level dropdowns
- Employment type and salary range
- Job description and requirements text areas
- Required skills input
- Benefits and perks section
- Form validation and error handling
- Submit job posting functionality

#### **Tab 3: Candidates**
**Testing Points:**
- Search candidates by skills
- Filter by experience, location
- View candidate profiles
- Contact candidates
- Shortlist functionality

#### **Tab 4: Team**
**Testing Points:**
- Team member management
- Role assignments
- Access permissions

#### **Tab 5: Analytics**
**Testing Points:**
- Job posting performance
- Application metrics
- Candidate source tracking

#### **Tab 6: Subscription**
**Testing Points:**
- Current plan details
- Usage statistics
- Upgrade/downgrade options

#### **Tab 7: Settings**
**Testing Points:**
- Company profile editing
- Account preferences
- Billing information

### **14. Search Resume** (`/employer/search-resume`)
**Testing Points:**
- Advanced candidate search filters
- Skills-based search
- Experience level filtering
- Location-based results
- Download resume functionality (subscription-based)

### **15. Employer Pricing** (`/employer/pricing`)
**Testing Points:**
- Pricing tiers display
- Feature comparison table
- Subscription selection
- Payment integration

## 📄 **Static/Legal Pages**

### **16. Services** (`/services`)
**Testing Points:**
- Service offerings description
- Feature highlights
- CTA buttons

### **17. Resources** (`/resources`)
**Testing Points:**
- Career resources and guides
- Downloadable content
- External links

### **18. Terms & Conditions** (`/terms`)
**Testing Points:**
- Complete terms text
- Last updated date
- Acceptance flow

### **19. Privacy Policy** (`/privacy`)
**Testing Points:**
- Privacy policy content
- Data handling information
- Contact information

### **20. Contact** (`/contact`)
**Testing Points:**
- Contact form functionality
- Office address and map
- Phone and email display

### **21. About** (`/about`)
**Testing Points:**
- Company mission and vision
- Team member profiles
- Company history

### **22. FAQ** (`/faq`)
**Testing Points:**
- Searchable FAQ content
- Expandable question sections
- Category-based organization

### **23. Help** (`/help`)
**Testing Points:**
- Help documentation
- Support ticket creation
- Knowledge base search

## 🎯 **Reward Points System Testing**

### **Reward Actions to Test:**
1. **Friend Referral** (20 points) - Invite friends to join
2. **Blog Reading** (5 points) - Read blog articles
3. **Blog Writing** (50 points) - Write and publish blog posts
4. **Daily Login** (5 points) - First login each day
5. **Profile Completion** (50 points) - Complete profile 100%

### **Reward Features:**
- Points widget in header shows current balance
- Reward dashboard with activity history
- Leaderboard showing top users
- Redemption catalog for spending points

## 🧪 **Critical Testing Scenarios**

### **Guest User Journey:**
1. Visit homepage → Browse jobs → View job detail → Try to apply → Redirected to login
2. Search companies → View company profile → Try to follow → Login required
3. Read blog posts → Try to write blog → Login required

### **Candidate User Journey:**
1. Register → Complete profile → Earn completion points
2. Search jobs → Save jobs → Apply for jobs → Track applications
3. Set up job alerts → Receive notifications
4. Write blog post → Earn writing points
5. Daily login → Earn login points

### **Employer User Journey:**
1. Register employer account → Access dashboard
2. Post new job (via dashboard tab, not header) → Manage listings
3. Search candidates → Contact candidates
4. Review applications → Schedule interviews

## 🔍 **Key URLs for Testing**

### **Public Routes:**
- `/` - Homepage
- `/jobs` - Job listings
- `/jobs/1` - Job detail (replace 1 with actual job ID)
- `/companies` - Companies directory
- `/companies/1` - Company profile
- `/blog` - Blog index
- `/blog/1` - Blog post

### **Auth Routes:**
- `/login` - Candidate login
- `/register` - Candidate registration
- `/auth/employer-login` - Employer login
- `/auth/employer-register` - Employer registration

### **Protected Routes:**
- `/candidate-dashboard` - Main candidate dashboard
- `/employer/dashboard` - Employer dashboard
- `/employer/search-resume` - Resume search

### **Static Routes:**
- `/services`, `/resources`, `/terms`, `/privacy`, `/contact`, `/about`, `/faq`, `/help`

## 📱 **Responsive Testing Points**

### **Desktop (1200px+):**
- Full header with all navigation items
- Multi-column layouts
- Sidebar navigation in dashboards

### **Tablet (768px - 1199px):**
- Collapsed navigation menu
- Two-column layouts
- Touch-friendly buttons

### **Mobile (< 768px):**
- Hamburger menu
- Single-column layouts
- Swipe gestures for tabs
- Bottom navigation for dashboards

## 🎨 **Visual Design Elements**

### **Color Scheme:**
- Primary: Purple gradient (#6B46C1 to #059669)
- Secondary: Green accent
- Background: Purple-to-green gradient with glassmorphism

### **Typography:**
- Header font: Inter
- Body font: System fonts
- Consistent font sizes and weights

### **UI Components:**
- Cards with hover effects
- Gradient buttons
- Shadow/blur effects (glassmorphism)
- Smooth transitions and animations

Use this guide to systematically test every aspect of the Career-Bazaar platform. Each page and feature should work correctly across all supported devices and user roles.