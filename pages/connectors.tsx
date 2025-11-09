/**
 * ConnectorShowcase - Test page to visualize all connector icons
 */

import React from 'react';
import Head from 'next/head';
import ConnectorIcon from '@/components/ConnectorIcon';
import { ConnectorType } from '@/lib/deviceSchema';

export default function ConnectorShowcase() {
  const connectors: { type: ConnectorType; name: string; description: string }[] = [
    { type: 'xlr', name: 'XLR', description: 'Balanced audio, 3-pin' },
    { type: 'jack-ts', name: 'Jack TS', description: 'Unbalanced mono, 1/4"' },
    { type: 'jack-trs', name: 'Jack TRS', description: 'Balanced/Stereo, 1/4"' },
    { type: 'rca', name: 'RCA', description: 'Consumer audio/video' },
    { type: 'midi-din', name: 'MIDI DIN', description: '5-pin DIN connector' },
    { type: 'usb', name: 'USB', description: 'Universal Serial Bus' },
    { type: 'ethernet', name: 'Ethernet', description: 'RJ45 network' },
    { type: 'optical', name: 'Optical', description: 'TOSLINK optical' },
    { type: 'speakon', name: 'Speakon', description: 'Speaker connector' },
    { type: 'iec', name: 'IEC', description: 'Power connector' },
  ];

  const colors = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Yellow', value: '#eab308' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#a855f7' },
    { name: 'Pink', value: '#ec4899' },
    { name: 'Gray', value: '#6b7280' },
  ];

  return (
    <>
      <Head>
        <title>Connector Graphics Showcase</title>
      </Head>

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">Connector Graphics Showcase</h1>

          {/* Input Ports Section */}
          <section className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Input Ports (Target)</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {connectors.map((connector) => (
                <div key={`input-${connector.type}`} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{connector.name}</h3>
                    <span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">INPUT</span>
                  </div>
                  <p className="mb-4 text-sm text-gray-600">{connector.description}</p>

                  {/* Small size */}
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-medium text-gray-500">Small (16px)</p>
                    <div className="flex gap-2">
                      {colors.map((color) => (
                        <div
                          key={color.value}
                          className="flex h-10 w-10 items-center justify-center rounded border-2"
                          style={{ borderColor: color.value, backgroundColor: 'white' }}
                        >
                          <ConnectorIcon type={connector.type} size={16} color={color.value} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Medium size (as used in nodes) */}
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-medium text-gray-500">Medium (14px in 24px circle)</p>
                    <div className="flex gap-2">
                      {colors.slice(0, 4).map((color) => (
                        <div
                          key={color.value}
                          className="flex items-center justify-center rounded-full"
                          style={{
                            width: 24,
                            height: 24,
                            backgroundColor: 'white',
                            border: `2px solid ${color.value}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          }}
                        >
                          <ConnectorIcon type={connector.type} size={14} color={color.value} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Large size */}
                  <div>
                    <p className="mb-2 text-xs font-medium text-gray-500">Large (32px)</p>
                    <div className="flex gap-2">
                      {colors.slice(0, 3).map((color) => (
                        <div
                          key={color.value}
                          className="flex h-16 w-16 items-center justify-center rounded-lg border-2"
                          style={{ borderColor: color.value, backgroundColor: 'white' }}
                        >
                          <ConnectorIcon type={connector.type} size={32} color={color.value} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Output Ports Section */}
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">Output Ports (Source)</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {connectors.map((connector) => (
                <div key={`output-${connector.type}`} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{connector.name}</h3>
                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-800">OUTPUT</span>
                  </div>
                  <p className="mb-4 text-sm text-gray-600">{connector.description}</p>

                  {/* Small size */}
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-medium text-gray-500">Small (16px)</p>
                    <div className="flex gap-2">
                      {colors.map((color) => (
                        <div
                          key={color.value}
                          className="flex h-10 w-10 items-center justify-center rounded border-2"
                          style={{ borderColor: color.value, backgroundColor: 'white' }}
                        >
                          <ConnectorIcon type={connector.type} size={16} color={color.value} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Medium size (as used in nodes) */}
                  <div className="mb-4">
                    <p className="mb-2 text-xs font-medium text-gray-500">Medium (14px in 24px circle)</p>
                    <div className="flex gap-2">
                      {colors.slice(0, 4).map((color) => (
                        <div
                          key={color.value}
                          className="flex items-center justify-center rounded-full"
                          style={{
                            width: 24,
                            height: 24,
                            backgroundColor: 'white',
                            border: `2px solid ${color.value}`,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          }}
                        >
                          <ConnectorIcon type={connector.type} size={14} color={color.value} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Large size */}
                  <div>
                    <p className="mb-2 text-xs font-medium text-gray-500">Large (32px)</p>
                    <div className="flex gap-2">
                      {colors.slice(0, 3).map((color) => (
                        <div
                          key={color.value}
                          className="flex h-16 w-16 items-center justify-center rounded-lg border-2"
                          style={{ borderColor: color.value, backgroundColor: 'white' }}
                        >
                          <ConnectorIcon type={connector.type} size={32} color={color.value} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Navigation */}
          <div className="mt-12 text-center">
            <a
              href="/"
              className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
            >
              ← Back to Home
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
