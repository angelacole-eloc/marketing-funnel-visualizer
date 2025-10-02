# Marketing Funnel Visualizer

An interactive visualization tool showing marketing funnel performance across time, tactics, and budget allocation.

## Features

- **Vertical Funnel Flow**: See conversion from Awareness + Interest → Consideration + Conversion
- **Time Series View**: 6 months displayed horizontally
- **Tactic Highlighting**: Click any tactic to highlight it across all time periods
- **Budget Tracking**: Monthly budget allocations shown for each tactic
- **Interactive Tooltips**: Hover over flows to see detailed information

## Quick Start

### Option 1: Deploy to Vercel (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Sign up for free
3. Click "Add New Project"
4. Upload your project folder or connect to GitHub
5. Vercel will auto-detect settings and deploy
6. You'll get a live URL in ~1 minute

### Option 2: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Sign up for free
3. Drag and drop your project folder onto their deploy zone
4. Your site will be live immediately

### Option 3: Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
marketing-funnel-visualizer/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    └── index.css
```

## Customizing Data

Edit the `data` object in `src/App.jsx` to use your own:
- Months/time periods
- Marketing tactics
- Budget allocations
- Conversion numbers

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge)

## License

MIT
