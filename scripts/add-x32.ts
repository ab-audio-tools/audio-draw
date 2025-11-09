/**
 * Script to add Behringer X32 to the database
 * Run with: npx tsx scripts/add-x32.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎛️  Adding Behringer X32 to database...');

  const behringerX32 = {
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
  };

  // Check if already exists
  const existing = await prisma.device.findUnique({
    where: { slug: 'behringer-x32' },
  });

  if (existing) {
    console.log('⚠️  Behringer X32 already exists. Updating...');
    await prisma.device.update({
      where: { slug: 'behringer-x32' },
      data: behringerX32,
    });
    console.log('✅ Behringer X32 updated successfully!');
  } else {
    await prisma.device.create({
      data: behringerX32,
    });
    console.log('✅ Behringer X32 created successfully!');
  }

  console.log('\n📊 Device Details:');
  console.log(`  • 32 XLR Mic/Line Inputs`);
  console.log(`  • 16 XLR Outputs`);
  console.log(`  • 6 Aux Sends (TRS)`);
  console.log(`  • Main L/R Out (XLR)`);
  console.log(`  • 2x AES50 Network Audio (Ethernet)`);
  console.log(`  • USB Audio Interface`);
  console.log(`  • Total: ${32 + 16 + 6 + 2 + 2 + 1} ports\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
