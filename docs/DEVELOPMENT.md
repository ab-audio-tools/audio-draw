# Audio Draw - Development Guide

## Architecture Overview

### State Management

The application uses **Zustand** for global state management with the following key features:

1. **Editor Store** (`hooks/useEditorStore.ts`)
   - Manages nodes, edges, viewport
   - Implements undo/redo with history stack
   - Persists settings to localStorage
   - Provides actions for all editor operations

2. **History Pattern**
   ```typescript
   // Save to history after each significant change
   addNode(node);
   saveToHistory();
   
   // Undo/Redo
   undo(); // Restores previous state
   redo(); // Restores next state
   ```

### Connection Validation Flow

1. User attempts connection in React Flow
2. `isValidConnection()` callback fires
3. Finds source and target nodes from store
4. Extracts port definitions from node data
5. Calls `validateConnection(sourcePort, targetPort)`
6. Checks direction (output→input only)
7. Checks signal type compatibility
8. Returns validation result
9. Shows toast notification if invalid
10. Creates edge if valid

### Data Flow

```
User Action
    ↓
React Component
    ↓
Zustand Action
    ↓
Immer Producer (immutable update)
    ↓
State Updated
    ↓
Components Re-render
```

## Key Design Patterns

### Custom React Flow Nodes

Each device is a custom node with:
- **Data**: Device metadata, ports, image
- **Handles**: React Flow handles for each port
- **Position**: Canvas coordinates
- **Type**: Always 'device'

```typescript
const node: Node = {
  id: 'unique-id',
  type: 'device',
  position: { x: 100, y: 100 },
  data: {
    deviceId: 'shure-sm58',
    deviceName: 'Shure SM58',
    ports: [...], // Array of DevicePort
    meta: {...}
  }
};
```

### Port Handles

Each port becomes a React Flow Handle:
- **Input ports**: `type="target"`, positioned left
- **Output ports**: `type="source"`, positioned right
- **Handle ID**: Port ID for connection tracking
- **Styling**: Color-coded by signal type

### Edge Validation

Edges store connection metadata:
```typescript
const edge: Edge = {
  id: 'edge-id',
  source: 'node-1',
  sourceHandle: 'out-1', // Port ID
  target: 'node-2',
  targetHandle: 'in-1',  // Port ID
  data: {
    signalType: 'audio-mono',
    label: 'Channel 1'
  }
};
```

## Adding New Features

### Add New Signal Type

1. **Update type definition** (`lib/deviceSchema.ts`)
   ```typescript
   export type SignalType = 
     | 'audio-mono'
     | 'your-new-type';
   ```

2. **Add compatibility rules**
   ```typescript
   export const SIGNAL_COMPATIBILITY = {
     'your-new-type': ['your-new-type', 'compatible-type'],
   };
   ```

3. **Add label and color**
   ```typescript
   export function getSignalTypeLabel(type: SignalType): string {
     const labels = {
       'your-new-type': 'Your New Type',
       // ...
     };
     return labels[type] || type;
   }
   
   export function getSignalTypeColor(type: SignalType): string {
     const colors = {
       'your-new-type': '#ff0000',
       // ...
     };
     return colors[type] || '#gray';
   }
   ```

### Add Custom Validation Rule

Edit `lib/validation.ts`:

```typescript
export function validateConnection(
  sourcePort: DevicePort,
  targetPort: DevicePort
): ValidationResult {
  // Existing checks...
  
  // Your custom rule
  if (sourcePort.signalType === 'high-voltage' && targetPort.signalType === 'low-voltage') {
    return {
      valid: false,
      message: 'Cannot connect high voltage to low voltage input'
    };
  }
  
  return { valid: true };
}
```

### Add New Device Property

1. **Update schema** (`lib/deviceSchema.ts`)
   ```typescript
   export interface DeviceMeta {
     manufacturer?: string;
     yourNewProperty?: string; // Add here
   }
   ```

2. **Update seed data** (`prisma/seed.ts`)
   ```typescript
   meta: {
     manufacturer: 'Shure',
     yourNewProperty: 'value'
   }
   ```

3. **Display in UI** (`components/DeviceNode.tsx`)
   ```typescript
   {data.meta?.yourNewProperty && (
     <span>{data.meta.yourNewProperty}</span>
   )}
   ```

## Testing Guide

### Manual Testing Checklist

**Device Management**
- [ ] Load device library
- [ ] Search devices
- [ ] Add custom device
- [ ] Device appears in palette

**Editor Operations**
- [ ] Drag device to canvas
- [ ] Move device
- [ ] Delete device
- [ ] Undo delete
- [ ] Redo delete

**Connections**
- [ ] Create valid connection
- [ ] Attempt invalid connection (shows error)
- [ ] Delete connection
- [ ] Undo connection creation

**Project Management**
- [ ] Create new project
- [ ] Save project
- [ ] Load existing project
- [ ] Delete project

**Export/Import**
- [ ] Export PNG
- [ ] Export SVG
- [ ] Export JSON
- [ ] Import JSON

### Writing Unit Tests

Create `__tests__/validation.test.ts`:

```typescript
import { validateConnection } from '@/lib/validation';
import type { DevicePort } from '@/lib/deviceSchema';

describe('validateConnection', () => {
  it('allows output to input', () => {
    const source: DevicePort = {
      id: 'out',
      name: 'Output',
      direction: 'output',
      signalType: 'audio-mono'
    };
    
    const target: DevicePort = {
      id: 'in',
      name: 'Input',
      direction: 'input',
      signalType: 'audio-mono'
    };
    
    const result = validateConnection(source, target);
    expect(result.valid).toBe(true);
  });
  
  it('rejects output to output', () => {
    // Test implementation
  });
});
```

## Performance Optimization

### Memoization

Use `React.memo` for components that receive stable props:

```typescript
export default memo(DeviceNode);
```

### Lazy Loading

Import heavy components lazily:

```typescript
const EditorCanvas = dynamic(() => import('@/components/EditorCanvas'), {
  ssr: false
});
```

### Virtualization

For large device lists, use virtualization:

```bash
npm install react-window
```

```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={devices.length}
  itemSize={80}
>
  {DeviceRow}
</FixedSizeList>
```

## Database Schema Evolution

### Adding New Field to Device

1. **Update Prisma schema**
   ```prisma
   model Device {
     // existing fields
     yourNewField String?
   }
   ```

2. **Create migration**
   ```bash
   npx prisma migrate dev --name add_your_new_field
   ```

3. **Update TypeScript types**
   ```typescript
   export interface Device {
     // existing fields
     yourNewField?: string;
   }
   ```

### Migration to PostgreSQL

Update `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/audiodraw"
```

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Run migration:
```bash
npx prisma migrate dev
```

## Common Issues

### React Flow Not Rendering

Ensure parent has defined height:
```css
.editor-container {
  height: 100vh; /* or specific height */
}
```

### Zustand State Not Persisting

Check localStorage quota and clear if needed:
```javascript
localStorage.clear();
```

### Prisma Client Out of Sync

Regenerate client:
```bash
npx prisma generate
```

## Best Practices

1. **Always save to history** after state-changing operations
2. **Validate on client and server** for security
3. **Use TypeScript strictly** - avoid `any`
4. **Keep components small** - single responsibility
5. **Test connection validation** thoroughly
6. **Document custom signal types** in README
7. **Version your project JSON** for future migrations

## Resources

- [React Flow Documentation](https://reactflow.dev/docs)
- [Zustand Guide](https://github.com/pmndrs/zustand)
- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js Documentation](https://nextjs.org/docs)
