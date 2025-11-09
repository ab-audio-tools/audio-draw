import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const seedDevices = [
  {
    name: 'Shure SM58',
    slug: 'shure-sm58',
    imageUrl: '/devices/mic-sm58.svg',
    schemaJson: JSON.stringify({
      ports: [
        {
          id: 'out-1',
          name: 'XLR Out',
          direction: 'output',
          signalType: 'audio-mono',
          connectorType: 'xlr',
        },
      ],
      meta: {
        manufacturer: 'Shure',
        model: 'SM58',
        category: 'Microphone',
        description: 'Dynamic vocal microphone',
      },
    }),
  },
  {
    name: 'Focusrite Scarlett 2i2',
    slug: 'focusrite-2i2',
    imageUrl: '/devices/interface-2i2.svg',
    schemaJson: JSON.stringify({
      ports: [
        {
          id: 'in-1',
          name: 'Input 1',
          direction: 'input',
          signalType: 'audio-mono',
          connectorType: 'jack-trs',
        },
        {
          id: 'in-2',
          name: 'Input 2',
          direction: 'input',
          signalType: 'audio-mono',
          connectorType: 'jack-trs',
        },
        {
          id: 'out-l',
          name: 'Output L',
          direction: 'output',
          signalType: 'audio-mono',
          connectorType: 'jack-trs',
        },
        {
          id: 'out-r',
          name: 'Output R',
          direction: 'output',
          signalType: 'audio-mono',
          connectorType: 'jack-trs',
        },
        {
          id: 'usb',
          name: 'USB',
          direction: 'output',
          signalType: 'digital-audio',
          connectorType: 'usb',
        },
      ],
      meta: {
        manufacturer: 'Focusrite',
        model: 'Scarlett 2i2',
        category: 'Audio Interface',
        description: '2-in/2-out USB audio interface',
      },
    }),
  },
  {
    name: 'Mackie CR3-X',
    slug: 'mackie-cr3x',
    imageUrl: '/devices/speaker-mackie.svg',
    schemaJson: JSON.stringify({
      ports: [
        {
          id: 'in-l',
          name: 'Input L',
          direction: 'input',
          signalType: 'audio-mono',
        },
        {
          id: 'in-r',
          name: 'Input R',
          direction: 'input',
          signalType: 'audio-mono',
        },
      ],
      meta: {
        manufacturer: 'Mackie',
        model: 'CR3-X',
        category: 'Monitor Speaker',
        description: 'Active studio monitor',
      },
    }),
  },
  {
    name: 'Behringer Xenyx 802',
    slug: 'behringer-xenyx-802',
    imageUrl: '/devices/mixer-xenyx.svg',
    schemaJson: JSON.stringify({
      ports: [
        {
          id: 'ch1-in',
          name: 'Channel 1 In',
          direction: 'input',
          signalType: 'audio-mono',
        },
        {
          id: 'ch2-in',
          name: 'Channel 2 In',
          direction: 'input',
          signalType: 'audio-mono',
        },
        {
          id: 'ch3-in-l',
          name: 'Channel 3 In L',
          direction: 'input',
          signalType: 'audio-mono',
        },
        {
          id: 'ch3-in-r',
          name: 'Channel 3 In R',
          direction: 'input',
          signalType: 'audio-mono',
        },
        {
          id: 'main-out-l',
          name: 'Main Out L',
          direction: 'output',
          signalType: 'audio-mono',
        },
        {
          id: 'main-out-r',
          name: 'Main Out R',
          direction: 'output',
          signalType: 'audio-mono',
        },
      ],
      meta: {
        manufacturer: 'Behringer',
        model: 'Xenyx 802',
        category: 'Mixer',
        description: '8-input 2-bus mixer',
      },
    }),
  },
  {
    name: 'DBX 266xs',
    slug: 'dbx-266xs',
    imageUrl: '/devices/processor-dbx.svg',
    schemaJson: JSON.stringify({
      ports: [
        {
          id: 'in-l',
          name: 'Input L',
          direction: 'input',
          signalType: 'audio-mono',
        },
        {
          id: 'in-r',
          name: 'Input R',
          direction: 'input',
          signalType: 'audio-mono',
        },
        {
          id: 'out-l',
          name: 'Output L',
          direction: 'output',
          signalType: 'audio-mono',
        },
        {
          id: 'out-r',
          name: 'Output R',
          direction: 'output',
          signalType: 'audio-mono',
        },
      ],
      meta: {
        manufacturer: 'DBX',
        model: '266xs',
        category: 'Compressor',
        description: 'Dual compressor/gate',
      },
    }),
  },
  {
    name: 'Radial Pro DI',
    slug: 'radial-pro-di',
    imageUrl: '/devices/di-radial.svg',
    schemaJson: JSON.stringify({
      ports: [
        {
          id: 'in',
          name: 'Input',
          direction: 'input',
          signalType: 'audio-mono',
        },
        {
          id: 'thru',
          name: 'Thru',
          direction: 'output',
          signalType: 'audio-mono',
        },
        {
          id: 'xlr-out',
          name: 'XLR Out',
          direction: 'output',
          signalType: 'audio-mono',
        },
      ],
      meta: {
        manufacturer: 'Radial',
        model: 'Pro DI',
        category: 'DI Box',
        description: 'Direct box',
      },
    }),
  },
  {
    name: 'MIDI Controller',
    slug: 'midi-controller',
    imageUrl: '/devices/midi-controller.svg',
    schemaJson: JSON.stringify({
      ports: [
        {
          id: 'midi-out',
          name: 'MIDI Out',
          direction: 'output',
          signalType: 'midi',
        },
        {
          id: 'usb',
          name: 'USB',
          direction: 'output',
          signalType: 'digital-midi',
        },
      ],
      meta: {
        manufacturer: 'Generic',
        model: 'MIDI Controller',
        category: 'Controller',
        description: 'MIDI keyboard controller',
      },
    }),
  },
  {
    name: 'Synthesizer',
    slug: 'synthesizer',
    imageUrl: '/devices/synthesizer.svg',
    schemaJson: JSON.stringify({
      ports: [
        {
          id: 'midi-in',
          name: 'MIDI In',
          direction: 'input',
          signalType: 'midi',
        },
        {
          id: 'audio-out-l',
          name: 'Audio Out L',
          direction: 'output',
          signalType: 'audio-mono',
        },
        {
          id: 'audio-out-r',
          name: 'Audio Out R',
          direction: 'output',
          signalType: 'audio-mono',
        },
      ],
      meta: {
        manufacturer: 'Generic',
        model: 'Synthesizer',
        category: 'Synth',
        description: 'Hardware synthesizer',
      },
    }),
  },
  {
    name: 'Behringer X32',
    slug: 'behringer-x32',
    imageUrl: '/devices/mixer-x32.svg',
    schemaJson: JSON.stringify({
      ports: [
        // 32 Mic/Line Inputs (XLR)
        ...Array.from({ length: 32 }, (_, i) => ({
          id: `mic-in-${i + 1}`,
          name: `Mic/Line ${i + 1}`,
          direction: 'input',
          signalType: 'audio-mono',
          connectorType: 'xlr',
        })),
        // 16 XLR Outputs
        ...Array.from({ length: 16 }, (_, i) => ({
          id: `xlr-out-${i + 1}`,
          name: `XLR Out ${i + 1}`,
          direction: 'output',
          signalType: 'audio-mono',
          connectorType: 'xlr',
        })),
        // 6 Aux Send (jack TRS)
        ...Array.from({ length: 6 }, (_, i) => ({
          id: `aux-send-${i + 1}`,
          name: `Aux Send ${i + 1}`,
          direction: 'output',
          signalType: 'audio-mono',
          connectorType: 'jack-trs',
        })),
        // Main L/R Out (XLR)
        {
          id: 'main-out-l',
          name: 'Main Out L',
          direction: 'output',
          signalType: 'audio-mono',
          connectorType: 'xlr',
        },
        {
          id: 'main-out-r',
          name: 'Main Out R',
          direction: 'output',
          signalType: 'audio-mono',
          connectorType: 'xlr',
        },
        // AES50 A & B (Ethernet - digital audio networking)
        {
          id: 'aes50-a',
          name: 'AES50 A',
          direction: 'output',
          signalType: 'dante',
          connectorType: 'ethernet',
        },
        {
          id: 'aes50-b',
          name: 'AES50 B',
          direction: 'output',
          signalType: 'dante',
          connectorType: 'ethernet',
        },
        // USB Audio
        {
          id: 'usb-audio',
          name: 'USB Audio',
          direction: 'output',
          signalType: 'digital-audio',
          connectorType: 'usb',
        },
      ],
      meta: {
        manufacturer: 'Behringer',
        model: 'X32',
        category: 'Digital Mixer',
        description: '40-input, 25-bus digital mixing console',
      },
    }),
  },
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.device.deleteMany();
  await prisma.project.deleteMany();

  console.log('📦 Seeding devices...');
  for (const device of seedDevices) {
    await prisma.device.create({
      data: device,
    });
    console.log(`  ✓ Created device: ${device.name}`);
  }

  // Create a sample project
  console.log('📋 Seeding sample project...');
  await prisma.project.create({
    data: {
      name: 'My First Audio Setup',
      description: 'A simple recording setup with microphone, interface, and monitors',
      data: JSON.stringify({
        version: '1.0.0',
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 },
      }),
    },
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
