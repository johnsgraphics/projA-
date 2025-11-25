# CabinetDoc Pro - Document Management System

## Description

CabinetDoc Pro is a comprehensive document management system designed for accounting firms and financial consultants. It provides tools for creating professional notes d'honoraires (fee notes) and special reports with live A4 preview, theme customization, and offline functionality.

## Features

### 🗂️ Document Creation
- **NOTE D'HONORAIRES**: Professional fee notes with customizable line items
- **RAPPORT SPECIAL**: Multi-page special reports for capital increase operations
- **Live A4 Preview**: Real-time 210mm × 297mm preview with pixel-perfect accuracy
- **Multi-line Support**: Auto-expanding text areas for detailed descriptions

### 🎨 Theme System
- **Built-in Themes**: BlueWave (default), Classic, Minimal
- **Custom Themes**: Upload custom JSON/CSS themes
- **Logo Integration**: Company logo placement with aspect ratio preservation
- **Print Consistency**: Identical on-screen and print output

### 🏢 Client Management
- **CRUD Operations**: Create, read, update, delete client records
- **Client Auto-fill**: Select clients to auto-populate document fields
- **Search & Filter**: Find clients quickly with advanced filtering
- **Data Persistence**: Local storage with robust serialization

### 📊 Document Library
- **Advanced Filtering**: Filter by type, date, client, status
- **Sequential Numbering**: Automatic document numbering (01/2025/HN, 01/2025/RP)
- **Renumbering**: Automatic gap removal after document deletion
- **Bulk Operations**: Multiple document management
- **Export Options**: Word document export with layout preservation

### ⚙️ Settings Management
- **Firm Information**: Company details, banking information, logo upload
- **Theme Configuration**: Built-in and custom theme management
- **Application Preferences**: User interface and behavior settings
- **Data Persistence**: All settings stored locally

### 🖨️ Print & Export
- **True A4 Printing**: @page size: A4 with 8-12mm margins
- **Word Export**: HTML to .doc conversion with styles preserved
- **Print Preview**: What you see is what you get (WYSIWYG)
- **Offline Capability**: No internet required for generation or export

### 📱 Responsive Design
- **Collapsible Sidebar**: Persistent state management with localStorage
- **Mobile Navigation**: Hamburger menu with overlay
- **SPA Navigation**: No page reloads, smooth transitions
- **Touch-friendly**: Optimized for mobile and tablet use

## Technical Stack

- **Frontend**: React 18+ with functional components and hooks
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS v3.x with custom design system
- **State Management**: Local state with localStorage persistence
- **Routing**: React Router DOM v6 with declarative routing
- **Icons**: Lucide React for consistent iconography
- **Animations**: Framer Motion for smooth transitions
- **Forms**: React Hook Form for performant form handling

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Modern web browser with ES2020+ support

### Development Setup
```bash
# Clone the repository
git clone [repository-url]
cd cabinetdoc-pro

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Serve built files from dist/ directory
```

### Offline Usage
The application works completely offline once loaded:
- Documents stored in localStorage
- Themes and settings persisted locally
- Print and export functions work without internet
- No external API dependencies

## Usage Guide

### Creating Documents

1. **Navigate to "Créer"** from the sidebar or header
2. **Select Document Type**: Choose between NOTE D'HONORAIRES or RAPPORT SPECIAL
3. **Choose Client**: Select from saved clients or create new ones
4. **Configure Theme**: Select built-in theme or upload custom theme
5. **Fill Form Fields**: Add services, amounts, dates, and descriptions
6. **Live Preview**: View real-time A4 preview on the right panel
7. **Save & Export**: Save to library and export to Word format

### Document Templates

#### NOTE D'HONORAIRES Template
- Curved teal header banner with logo placement
- Firm and client information boxes with rounded corners
- Service table with columns: DÉSIGNATION, Prix unitaire, Quantité, Total TTC
- Automatic subtotal, TVA calculation, and pill-style total
- Payment information and signature sections
- French number formatting with "DA" currency

#### RAPPORT SPECIAL Template
- Same visual family as NOTE D'HONORAIRES for consistency
- Editable text sections: PRÉAMBULE, EXPOSÉ DES MOTIFS, RÉFÉRENCES, etc.
- Two configurable tables:
  - Capital increase by current account capitalization
  - Breakdown of increase by associates with automatic percentage calculation
- Multi-page support with clean page breaks
- Professional conclusion and signature sections

### Managing Clients

1. **Go to "Clients"** section
2. **Add New Client**: Fill required fields (Nom, Adresse, RC, NIF, NIS)
3. **Search & Filter**: Use search bar and filters to find clients
4. **Edit/Delete**: Manage existing client records
5. **Client Usage**: Track document usage per client

### Settings Configuration

#### Firm Information Tab
- Company name, title, and address
- Professional numbers (AGRÉMENT, NIF, NIS, AI)
- Banking information for invoices
- Logo upload with automatic scaling

#### Document Themes Tab
- Select from built-in themes (BlueWave, Classic, Minimal)
- Upload custom theme JSON files
- Theme preview and application
- Color scheme customization

#### Preferences Tab
- Application behavior settings
- Language and formatting preferences
- Default values for new documents

### Print and Export

#### Printing Documents
- Use browser's print function (Ctrl+P / Cmd+P)
- Automatic A4 formatting with proper margins
- Logo and styling preserved in print output
- Hide UI elements automatically during print

#### Word Export
- Click "Exporter Word" button in document creation
- Generates .doc file with preserved layout
- Opens in Microsoft Word or compatible software
- Maintains fonts, colors, and formatting

### Theme Customization

#### Built-in Themes
- **BlueWave**: Teal gradient headers, professional appearance
- **Classic**: Gray tones, traditional business look
- **Minimal**: Black and white, clean modern design

#### Custom Theme Upload
```json
{
  "name": "Custom Theme",
  "colors": {
    "primary": "#FF6B35",
    "secondary": "#E63946",
    "background": "#F8F9FA",
    "border": "#DEE2E6"
  },
  "banner": "bg-gradient-to-r from-orange-500 to-red-600",
  "styles": {
    "rounded": "8px",
    "shadow": "0 4px 6px rgba(0,0,0,0.1)"
  }
}
```

### Sequential Numbering

Documents are automatically numbered in format:
- **NOTE D'HONORAIRES**: `01/2025/HN`, `02/2025/HN`, etc.
- **RAPPORT SPECIAL**: `01/2025/RP`, `02/2025/RP`, etc.

Numbers are sequential per type and per year. When documents are deleted, remaining documents are renumbered to remove gaps.

### Data Persistence

All data is stored locally in browser localStorage:
- **Documents**: Complete document data with metadata
- **Clients**: Client information and usage statistics
- **Settings**: Firm information, themes, preferences
- **UI State**: Sidebar state, user preferences

Data survives browser restarts and works completely offline.

## Keyboard Shortcuts

- **Ctrl/Cmd + S**: Save current document
- **Ctrl/Cmd + P**: Print current document
- **Ctrl/Cmd + E**: Export to Word
- **Ctrl/Cmd + N**: Create new document
- **Esc**: Close modals and overlays

## Browser Support

- **Chrome/Chromium**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## File Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Core UI components
│   └── AppIcon.jsx      # Icon component
├── pages/               # Page components
│   ├── dashboard/       # Dashboard and KPIs
│   ├── document-creation/ # Document creation flow
│   ├── document-library/  # Document management
│   ├── client-management/ # Client CRUD
│   └── settings-management/ # Settings configuration
├── utils/               # Utility functions
│   └── documentUtils.js # Document-specific utilities
├── styles/              # CSS and styling
│   └── tailwind.css     # Tailwind configuration
└── App.jsx             # Main application component
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the documentation above
- Review the code comments for implementation details
- Test the application thoroughly before deployment

## Changelog

### Version 1.0.0
- Initial release with complete document management system
- NOTE D'HONORAIRES and RAPPORT SPECIAL templates
- Client management with CRUD operations
- Theme system with custom theme support
- Print and Word export functionality
- Offline-first architecture with localStorage persistence
- Responsive design with collapsible sidebar
- Sequential document numbering with gap management
