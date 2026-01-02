# Browser Modal Components

This directory contains modular components for the BrowserModal feature. Each component is self-contained and can be easily extended or modified.

## Structure

```
browser/
├── data.js              # All data (projects, content, color maps)
├── ItemCard.js          # Reusable item card component for projects
├── CashShopView.js      # Cash Shop / Projects view component
├── BrowserView.js       # Regular browser view (background, experience)
└── README.md           # This file
```

## Components

### `data.js`
- Contains all project data, content data, and helper functions
- Exports: `projectData`, `colorClassesMap`, `generateProjectContent`, `transformProjectsToItems`, `contentData`

### `ItemCard.js`
- Reusable card component for displaying project items
- Props: `item`, `onClick`
- Handles animations, hover effects, and tech icons

### `CashShopView.js`
- Complete Cash Shop view with all its features
- Props: `onClose`, `onPermissionError`, `data`, `commits`
- Handles project selection, filtering, and display

### `BrowserView.js`
- Regular browser view for background/experience pages
- Props: `type`, `data`, `onClose`
- Handles page navigation and content display

## Adding New Features

To add a new browser command/feature:

1. **Add data** in `data.js`:
   ```javascript
   export const contentData = {
       // ... existing data
       newFeature: {
           title: 'New Feature',
           pages: [/* ... */]
       }
   };
   ```

2. **Create a new view component** (if needed):
   ```javascript
   // browser/NewFeatureView.js
   export default function NewFeatureView({ onClose, data }) {
       // Your component logic
   }
   ```

3. **Update BrowserModal.js** to route to the new view:
   ```javascript
   import NewFeatureView from './browser/NewFeatureView';
   
   // In the component:
   if (type === 'newFeature') {
       return <NewFeatureView ... />;
   }
   ```

## Benefits

- **Modular**: Each feature is in its own component
- **Maintainable**: Easy to find and modify specific features
- **Reusable**: Components can be reused across different views
- **Scalable**: Easy to add new features without touching existing code


