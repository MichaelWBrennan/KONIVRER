# BottomMenuBar Component

A reusable bottom navigation component for the KONIVRER application ecosystem.

## Features

- 🎨 **Consistent Theming**: Uses KONIVRER's signature #d4af37 gold color scheme
- 📱 **Responsive Design**: Works seamlessly across all screen sizes and devices
- ♿ **Accessibility**: Includes proper ARIA labels, keyboard navigation, and screen reader support
- ⚡ **Smooth Animations**: Powered by Framer Motion for fluid interactions
- 🔗 **Router Integration**: Built-in React Router Link integration for seamless navigation
- 📐 **Safe Area Support**: Handles mobile safe areas and notches properly
- 🎯 **Active State Management**: Visual feedback for current page/section

## Usage

```tsx
import BottomMenuBar from './components/BottomMenuBar';

function App() {
  return (
    <div>
      {/* Your app content */}
      <main style={{ paddingBottom: '70px' }}>
        {/* Remember to add bottom padding to prevent content overlap */}
        Your content here...
      </main>
      
      {/* Bottom navigation */}
      <BottomMenuBar />
    </div>
  );
}
```

## Customization

The component is designed to be flexible. You can:

1. **Modify Menu Items**: Edit the `menuItems` array in the component to change navigation options
2. **Update Icons**: Replace SVG icons with your preferred icon library (Font Awesome, Heroicons, etc.)
3. **Adjust Styling**: Modify the inline styles or extract to CSS modules/styled-components
4. **Add New Features**: Extend with badges, notifications, or dynamic menu items

## Integration with KONIVRER Apps

This component can be easily integrated into any of the KONIVRER application phases:

- **Phase1App**: Basic functionality with core navigation
- **Phase2App**: Enhanced features with additional menu items
- **Phase3App**: Advanced autonomous behavior with dynamic menu adaptation

## Technical Details

- **Dependencies**: React, React Router DOM, Framer Motion
- **TypeScript**: Fully typed with proper interfaces
- **Performance**: Optimized with React best practices
- **Mobile-First**: Designed primarily for mobile with desktop support

## Accessibility Features

- Semantic HTML with proper `nav` and `role` attributes
- ARIA labels for screen readers
- Keyboard navigation support
- High contrast ratios
- Touch-friendly target sizes (minimum 44px)

## Browser Support

Compatible with all modern browsers that support:
- React 18+
- ES2020
- CSS Grid and Flexbox
- CSS Custom Properties

## License

Part of the KONIVRER project ecosystem.