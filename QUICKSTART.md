# Audio Draw - Quick Start Guide

## Installation (5 minutes)

### Option 1: Automatic Setup (Recommended)

```bash
# Make setup script executable
chmod +x setup.sh

# Run setup
./setup.sh
```

### Option 2: Manual Setup

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client
npx prisma generate

# 3. Setup database
npx prisma migrate dev --name init

# 4. Seed with sample devices
npm run prisma:seed

# 5. Start development server
npm run dev
```

## First Steps

1. **Open your browser**
   - Navigate to http://localhost:3000

2. **Create your first project**
   - Click "Create New Project"

3. **Add devices to canvas**
   - Drag a microphone from the left sidebar
   - Drag an audio interface
   - Drag speakers

4. **Connect devices**
   - Click and drag from microphone output (right side)
   - Drop onto interface input (left side)
   - Repeat to connect interface outputs to speakers

5. **Save your work**
   - Click "Save" in the top toolbar
   - Your project is now saved to the database

6. **Export your setup**
   - Click "Export" dropdown
   - Choose PNG, SVG, or JSON

## Available Devices (Sample Library)

The seed script includes:
- **Shure SM58** - Dynamic microphone
- **Focusrite Scarlett 2i2** - Audio interface
- **Mackie CR3-X** - Monitor speakers
- **Behringer Xenyx 802** - Mixer
- **DBX 266xs** - Compressor
- **Radial Pro DI** - DI box
- **MIDI Controller** - Generic MIDI controller
- **Synthesizer** - Hardware synth

## Keyboard Shortcuts

- `Ctrl/Cmd + S` - Save project
- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Y` - Redo
- `Delete` - Delete selected items
- Mouse wheel - Zoom

## Common Tasks

### Add a Custom Device

1. Click "Add Custom Device" in the device palette
2. Enter device name and category
3. Upload an image (optional)
4. Define input ports:
   - Name (e.g., "Input 1")
   - Signal type (e.g., "audio-mono")
5. Define output ports
6. Click "Create Device"

### Export Canvas as Image

1. Click "Export" in toolbar
2. Choose "Export PNG" or "Export SVG"
3. Image downloads automatically

### Share Your Project

1. Click "Export" → "Export JSON"
2. Send the JSON file to someone
3. They can click "Import" and load your project

## Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Port 3000 already in use
```bash
PORT=3001 npm run dev
```

### Reset database
```bash
rm prisma/dev.db
npx prisma migrate dev --name init
npm run prisma:seed
```

### Clear localStorage (if editor acts weird)
Open browser console (F12) and run:
```javascript
localStorage.clear();
location.reload();
```

## Next Steps

- Read the full README.md for detailed documentation
- Check docs/DEVELOPMENT.md for advanced topics
- Explore the device library
- Create complex audio setups
- Export and share your projects

## Support

Having issues? Check:
- README.md for full documentation
- docs/DEVELOPMENT.md for development guide
- GitHub Issues for known problems

Enjoy building your audio setups! 🎵
