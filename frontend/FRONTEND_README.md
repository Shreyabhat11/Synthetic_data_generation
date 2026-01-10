# CTGAN Test Data Synthesis - Frontend

A beautiful, professional React frontend for the CTGAN (Conditional Tabular GAN) synthetic data generation platform.

## 🎨 Design System

The frontend features a modern, professional data science theme with:

- **Color Palette**: Teal & Blue theme optimized for data visualization
- **Typography**: Inter for body text, Space Grotesk for headings
- **Components**: Shadcn/UI with custom variants
- **Charts**: Recharts for data visualization
- **Responsive**: Mobile-first design with smooth animations

### Design Tokens

All styling uses semantic design tokens defined in `src/index.css`:

- `--primary`: Deep Teal (186 78% 36%)
- `--accent`: Vibrant Teal (174 72% 56%)
- `--chart-*`: Data visualization colors (teal, blue, green, amber, purple)

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                    # Shadcn UI components
│   ├── FileUpload.jsx        # Drag-and-drop file upload
│   ├── Chart.jsx             # Recharts wrapper component
│   └── MetricsCard.jsx       # Metric display cards
├── pages/
│   ├── Dashboard.jsx         # Landing page with workflow
│   ├── Upload.jsx            # Dataset upload page
│   ├── Generate.jsx          # Model training & generation
│   ├── Evaluate.jsx          # Quality metrics & charts
│   └── Privacy.jsx           # Privacy metrics & assessment
├── client.js                 # API client (Axios)
├── App.js                    # Main app with routing
├── index.css                 # Design system tokens
└── App.css                   # Component styles
```

## 🚀 Features

### 1. Dashboard Page
- Hero section with gradient text
- 4-step workflow visualization
- Feature highlights
- Clear call-to-action

### 2. Upload Page
- Drag-and-drop file upload
- CSV validation (max 100MB)
- Upload progress tracking
- Requirements sidebar
- Error handling with toast notifications

### 3. Generate Page
- Step-by-step workflow:
  1. Train CTGAN model
  2. Generate synthetic rows
- Progress indicators
- Download synthetic CSV
- Training tips sidebar

### 4. Evaluate Page
- Key metrics cards:
  - Statistical Similarity
  - Mean Squared Error
  - KL Divergence
  - Correlation Difference
- Interactive charts:
  - Feature distributions comparison (bar chart)
  - Correlation comparison (bar chart)
- Detailed metrics table
- Quality assessment summary

### 5. Privacy Page
- Risk assessment banner
- Privacy metrics cards:
  - Privacy Score
  - NNDR Score
  - Disclosure Risk
  - Identifiability Score
- Privacy breakdown charts
- Detailed privacy analysis
- Recommendations

## 🔧 Technical Stack

- **React 19**: Latest React with hooks
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Recharts**: Data visualization
- **Tailwind CSS**: Utility-first styling
- **Shadcn/UI**: Accessible component library
- **Lucide React**: Icon library
- **Sonner**: Toast notifications

## 🎯 API Integration

The frontend connects to the FastAPI backend via `src/client.js`:

### API Endpoints

- `POST /api/upload` - Upload CSV dataset
- `POST /api/train` - Train CTGAN model
- `POST /api/generate` - Generate synthetic data
- `GET /api/evaluate` - Get utility metrics
- `GET /api/privacy` - Get privacy metrics
- `GET /api/download` - Download synthetic CSV

### Environment Variables

The backend URL is configured in `.env`:

```env
REACT_APP_BACKEND_URL=https://testdata-forge.preview.emergentagent.com
```

## 🎨 Design Principles

1. **Token-First**: All colors use semantic design tokens
2. **Accessibility**: WCAG AA contrast ratios
3. **Responsive**: Mobile-first design
4. **Professional**: Clean, data science aesthetic
5. **Gradients**: Limited to <20% viewport (hero sections only)
6. **Typography**: Clear hierarchy with proper font scales

## 📊 Mock Data

When API endpoints fail, the app displays mock data to demonstrate the UI:

- Evaluation metrics (MSE, KL divergence, correlations)
- Privacy metrics (NNDR, disclosure risk, identifiability)
- Charts with realistic synthetic vs. real data comparisons

## 🔄 State Management

- React useState/useEffect hooks
- Loading states for async operations
- Error handling with user-friendly messages
- Progress tracking for uploads and generations

## 🎭 User Experience

- Smooth transitions and animations
- Loading spinners for async operations
- Toast notifications for success/error feedback
- Hover effects on cards and buttons
- Clear navigation with active states
- Helpful tooltips on metrics

## 📱 Responsive Design

- Mobile-first approach
- Hamburger menu for mobile navigation
- Adaptive grid layouts
- Touch-friendly buttons and inputs
- Optimized charts for small screens

## 🚦 Getting Started

The frontend is already configured and running. To restart:

```bash
sudo supervisorctl restart frontend
```

View logs:

```bash
sudo supervisorctl tail -50 frontend
```

## 🌐 Accessing the App

- Local: http://localhost:3000
- Production: https://testdata-forge.preview.emergentagent.com

## 🎨 Customization

To customize the design:

1. **Colors**: Edit CSS variables in `src/index.css`
2. **Components**: Modify Shadcn components in `src/components/ui/`
3. **Typography**: Update font imports and classes
4. **Layout**: Adjust spacing in `src/App.css`

## 📝 Notes

- The backend is already implemented and should not be modified
- API calls include proper error handling and fallback to mock data
- All components use Shadcn/UI for consistency
- Charts are responsive and use the design system colors
- Navigation is handled by React Router

## 🎉 Features Highlights

✅ Professional data science UI design
✅ Complete 5-page workflow
✅ Interactive charts with Recharts
✅ Responsive mobile layout
✅ Progress tracking and loading states
✅ Error handling with toast notifications
✅ Mock data fallback for demo purposes
✅ Accessible components (WCAG AA)
✅ Clean, maintainable code structure

---

Built with ❤️ using React + Tailwind + Shadcn/UI
