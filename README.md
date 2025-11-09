# Audio Draw - Visual Audio Patchbay Editor

A full-stack Next.js + React application for creating and managing audio patchbay setups visually using a node-based interface. Build your audio signal flow diagrams with drag-and-drop devices, validate connections, and export your setups.

![Audio Draw](docs/screenshot.png)

## Features

✨ **Interactive Node-Based Editor**
- Drag-and-drop audio devices onto canvas
- Visual representation of audio signal flow
- Custom device nodes with labeled input/output ports
- Curved Bezier connection lines with validation

🔌 **Smart Connection Validation**
- Validates signal types (audio-mono, audio-stereo, MIDI, digital, etc.)
- Prevents invalid connections (output-to-output, incompatible types)
- Visual feedback for connection attempts
- Warning system for potential issues

🎨 **Rich Device Library**
- Pre-loaded with common audio devices (mics, interfaces, mixers, processors)
- Add custom devices via UI modal
- Device categorization and search
- Support for device images and metadata

💾 **Project Management**
- Save/load projects to database
- Auto-save draft to localStorage
- Export as PNG, SVG, or JSON
- Import projects from JSON files

⏱️ **Undo/Redo with History**
- Full undo/redo support using time-travel pattern
- Keyboard shortcuts (Ctrl+Z / Ctrl+Y)
- History visualization in toolbar

⚙️ **Editor Features**
- Snap-to-grid toggle
- Zoom and pan controls
- Grid background
- Keyboard navigation
- Selection and multi-delete

## Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **React Flow** - Node-based UI
- **Zustand** - State management with persistence
- **Immer** - Immutable state updates
- **Framer Motion** - Animations
- **TailwindCSS** - Styling
- **Radix UI** - Accessible components
- **Lucide Icons** - Icon library

### Backend
- **Prisma** - ORM with SQLite (dev) / PostgreSQL (prod)
- **Next.js API Routes** - RESTful API

### Export/Import
- **dom-to-image-more** - Canvas to PNG/SVG export
- **file-saver** - File downloads

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/audio-draw.git
   cd audio-draw
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if needed (default uses local SQLite).

4. **Initialize database**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Seed database with sample devices**
   ```bash
   npm run prisma:seed
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

7. **Open browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
audio-draw/
├── components/          # React components
│   ├── DeviceNode.tsx   # Custom React Flow node
│   ├── ConnectionEdge.tsx # Custom React Flow edge
│   ├── EditorCanvas.tsx # Main editor canvas
│   ├── DevicesPalette.tsx # Device library sidebar
│   ├── Toolbar.tsx      # Editor toolbar
│   └── ui/              # Reusable UI components
├── hooks/               # Custom React hooks
│   ├── useEditorStore.ts # Zustand store with undo/redo
│   ├── useDevices.ts    # Device library management
│   └── use-toast.ts     # Toast notifications
├── lib/                 # Utility functions and logic
│   ├── deviceSchema.ts  # TypeScript types and schemas
│   ├── validation.ts    # Connection validation logic
│   ├── api.ts           # API client functions
│   ├── export.ts        # Export utilities
│   ├── utils.ts         # General utilities
│   └── prisma.ts        # Prisma client
├── pages/               # Next.js pages
│   ├── api/             # API routes
│   │   ├── devices/     # Device CRUD endpoints
│   │   └── projects/    # Project CRUD endpoints
│   ├── projects/[id].tsx # Editor page
│   └── index.tsx        # Home/dashboard page
├── prisma/              # Database schema and migrations
│   ├── schema.prisma    # Prisma schema
│   └── seed.ts          # Database seed script
├── public/              # Static assets
└── styles/              # Global styles
```

## Usage Guide

### Creating Your First Project

1. **Start a new project**
   - Click "Create New Project" on the homepage
   - You'll be taken to the editor with a blank canvas

2. **Add devices**
   - Browse the device library in the left sidebar
   - Drag a device onto the canvas
   - Devices will snap to grid (toggle with grid icon in toolbar)

3. **Connect devices**
   - Click and drag from an output port (right side)
   - Drop onto a compatible input port (left side)
   - Invalid connections will show an error message
   - Valid connections create a colored line

4. **Edit your setup**
   - Move devices by dragging
   - Select and press Delete to remove
   - Use Ctrl+Z/Ctrl+Y for undo/redo
   - Zoom with mouse wheel or toolbar buttons

5. **Save and export**
   - Click "Save" to persist to database
   - Use "Export" dropdown for PNG, SVG, or JSON
   - Import previously exported JSON files

### Adding Custom Devices

1. Click "Add Custom Device" in the device palette
2. Fill in the device information:
   - Name and category
   - Upload an image (optional)
   - Define input ports (name, signal type)
   - Define output ports (name, signal type)
3. Click "Create Device"
4. Your device will appear in the library

### Signal Types

The system supports these signal types:

- **audio-mono** - Single channel audio (XLR, 1/4" TS)
- **audio-stereo** - Stereo audio (TRS, dual mono)
- **midi** - MIDI messages (5-pin DIN)
- **digital-audio** - Digital audio (USB, Thunderbolt)
- **digital-midi** - Digital MIDI (USB MIDI)
- **spdif** - S/PDIF digital audio
- **adat** - ADAT optical audio
- **dante** - Dante networked audio
- **power** - Power connections
- **control** - Control signals

### Extending Signal Type Compatibility

Edit `lib/deviceSchema.ts` to modify the `SIGNAL_COMPATIBILITY` map:

```typescript
export const SIGNAL_COMPATIBILITY: Record<SignalType, SignalType[]> = {
  'audio-mono': ['audio-mono', 'audio-stereo'], // mono can go to mono or stereo
  // Add your custom rules here
};
```

### Validation Rules

Customize validation in `lib/validation.ts`:

- `validateConnection()` - Main validation function
- `areSignalTypesCompatible()` - Signal type compatibility check
- `wouldCreateCycle()` - Prevent feedback loops
- `validateSetup()` - Validate entire project

## API Endpoints

### Devices
- `GET /api/devices` - List all devices
- `POST /api/devices` - Create a device
- `GET /api/devices/[id]` - Get device by ID
- `PUT /api/devices/[id]` - Update device
- `DELETE /api/devices/[id]` - Delete device

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create a project
- `GET /api/projects/[id]` - Get project with full data
- `PUT /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project

## Development Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking

# Database
npm run prisma:migrate   # Run migrations
npm run prisma:generate  # Generate Prisma client
npm run prisma:studio    # Open Prisma Studio
npm run prisma:seed      # Seed database
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Set environment variables:
   ```
   DATABASE_URL=your-postgres-connection-string
   ```
4. Deploy

### Docker

```bash
docker build -t audio-draw .
docker run -p 3000:3000 audio-draw
```

## Keyboard Shortcuts

- `Ctrl/Cmd + S` - Save project
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Y` - Redo
- `Delete/Backspace` - Delete selected nodes
- `Ctrl/Cmd + A` - Select all
- Mouse wheel - Zoom in/out

## Troubleshooting

### TypeScript errors after install
Run `npm run prisma:generate` to generate Prisma client types.

### Port already in use
Change the port: `PORT=3001 npm run dev`

### Database issues
Reset database:
```bash
rm prisma/dev.db
npx prisma migrate reset
npm run prisma:seed
```

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [React Flow](https://reactflow.dev/)
- Icons by [Lucide](https://lucide.dev/)
- UI components from [Radix UI](https://www.radix-ui.com/)

## Support

For issues and questions:
- GitHub Issues: [github.com/yourusername/audio-draw/issues](https://github.com/yourusername/audio-draw/issues)
- Documentation: [docs.audiodraw.io](https://docs.audiodraw.io)

---

**Made with ❤️ for the audio engineering community**
