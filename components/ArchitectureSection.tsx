'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Server, Database, Shield, Lock, Layers, RefreshCw, CheckCircle2, ChevronRight } from 'lucide-react';

interface NodeData {
  id: string;
  name: string;
  category: string;
  description: string;
  latency: string;
  status: string;
  tech: string[];
  connections: string[];
  x: number;
  y: number;
}

const NODES: NodeData[] = [
  {
    id: 'core-gateway',
    name: 'Arcanum Gateway API',
    category: 'Core Infrastructure',
    description: 'Central OAuth2 / SAML authentication, rate-limiting, and microservice traffic router.',
    latency: '3ms',
    status: 'ONLINE',
    tech: ['Node.js', 'gRPC', 'TLS 1.3', 'Redis'],
    connections: ['erp-engine', 'banking-switch', 'oms-hub', 'scholar-sis'],
    x: 50,
    y: 50,
  },
  {
    id: 'erp-engine',
    name: 'ARC ERP Ledger',
    category: 'Enterprise Finance',
    description: 'Real-time multi-currency double-entry ledger and automated supply chain workflow engine.',
    latency: '8ms',
    status: 'OPTIMAL',
    tech: ['PostgreSQL', 'TypeScript', 'Docker'],
    connections: ['payroll-module', 'oracle-modernizer'],
    x: 20,
    y: 25,
  },
  {
    id: 'banking-switch',
    name: 'Transa Banking Switch',
    category: 'Financial Grade',
    description: 'ISO 8583 message router connecting mobile banking, ATM terminals, and core banking back-office.',
    latency: '11ms',
    status: 'OPTIMAL',
    tech: ['Java Spring', 'HSM Hardware Vault', 'Kafka'],
    connections: ['scb-addons'],
    x: 80,
    y: 25,
  },
  {
    id: 'oms-hub',
    name: 'Organization Management (OMS)',
    category: 'Identity & Auth',
    description: 'Enterprise organization hierarchy management, member invitations, and granular RBAC policies.',
    latency: '4ms',
    status: 'ONLINE',
    tech: ['React', 'OAuth2', 'PostgreSQL'],
    connections: ['scholar-sis', 'clinic-hms'],
    x: 20,
    y: 75,
  },
  {
    id: 'scholar-sis',
    name: 'Scholar Educational Suite',
    category: 'Education',
    description: 'Complete student information system, gradebook calculator, and automated tuition payment gateway.',
    latency: '7ms',
    status: 'OPTIMAL',
    tech: ['Next.js', 'Tailwind', 'PostgreSQL'],
    connections: [],
    x: 80,
    y: 75,
  },
  {
    id: 'payroll-module',
    name: 'Accurate PAYROLL Engine',
    category: 'Human Capital',
    description: 'Automated salary computation, UAE WPS file generator, and statutory compliance calculator.',
    latency: '6ms',
    status: 'OPTIMAL',
    tech: ['Node.js', 'TypeScript', 'Secure Vault'],
    connections: [],
    x: 10,
    y: 50,
  },
  {
    id: 'oracle-modernizer',
    name: 'Oracle Forms Migration',
    category: 'Legacy Refactoring',
    description: 'Refactoring layer decoupling legacy Oracle Forms 12c PL/SQL stored procedures into REST APIs.',
    latency: '14ms',
    status: 'READY',
    tech: ['Oracle DB', 'Java REST API', 'Containers'],
    connections: [],
    x: 90,
    y: 50,
  },
];

export function ArchitectureSection() {
  const [selectedNode, setSelectedNode] = useState<NodeData>(NODES[0]);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const activeNode = hoveredNodeId ? NODES.find((n) => n.id === hoveredNodeId) || selectedNode : selectedNode;

  return (
    <section id="architecture" className="py-24 bg-[#0f172a] text-slate-100 relative overflow-hidden dark-technical-grid">
      {/* Background Subtle Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#2384ba]/10 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-slate-800">
          <div>
            <span className="text-[#2384ba] font-mono text-xs tracking-widest uppercase block mb-2">
              02 / INFRASTRUCTURE MATRIX
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-display">
              Enterprise System Interconnections
            </h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md mt-4 md:mt-0 font-sans leading-relaxed">
            Select or hover over any node in our system architecture matrix to inspect data routing,
            latency metrics, and security protocol specs.
          </p>
        </div>

        {/* Matrix Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Interactive Node Graph Map Canvas */}
          <div className="lg:col-span-8 bg-slate-950/80 rounded-lg p-6 border border-slate-800/90 relative min-h-[420px] flex items-center justify-center">
            {/* SVG Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2384ba" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#2384ba" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {NODES.map((node) => {
                return node.connections.map((targetId) => {
                  const targetNode = NODES.find((n) => n.id === targetId);
                  if (!targetNode) return null;

                  const isConnectedToActive =
                    activeNode.id === node.id ||
                    activeNode.id === targetNode.id ||
                    activeNode.connections.includes(targetNode.id);

                  return (
                    <line
                      key={`${node.id}-${targetNode.id}`}
                      x1={`${node.x}%`}
                      y1={`${node.y}%`}
                      x2={`${targetNode.x}%`}
                      y2={`${targetNode.y}%`}
                      stroke={isConnectedToActive ? '#2384ba' : 'rgba(100, 116, 139, 0.2)'}
                      strokeWidth={isConnectedToActive ? 2 : 1}
                      strokeDasharray={isConnectedToActive ? 'none' : '4 4'}
                      className="transition-all duration-300"
                    />
                  );
                });
              })}
            </svg>

            {/* Render Nodes */}
            <div className="relative w-full h-[360px] z-10">
              {NODES.map((node) => {
                const isSelected = selectedNode.id === node.id;
                const isHovered = hoveredNodeId === node.id;
                const isConnected =
                  activeNode.id === node.id || activeNode.connections.includes(node.id);

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center focus:outline-none transition-all duration-300`}
                  >
                    {/* Node Circle Pin */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 shadow-md ${isSelected || isHovered
                          ? 'bg-[#2384ba] text-white border-white scale-110 shadow-glow'
                          : isConnected
                            ? 'bg-slate-900 text-[#2384ba] border-[#2384ba]'
                            : 'bg-slate-900 text-slate-400 border-slate-700 hover:border-slate-400'
                        }`}
                    >
                      <Server className="w-4 h-4" />
                    </div>

                    {/* Node Title Marker Label */}
                    <div className="mt-2 text-center pointer-events-none">
                      <span
                        className={`text-[11px] font-mono font-medium block px-2 py-0.5 rounded backdrop-blur-md transition-colors ${isSelected || isHovered
                            ? 'bg-[#2384ba] text-white'
                            : 'bg-slate-900/90 text-slate-300 border border-slate-800'
                          }`}
                      >
                        {node.name.split(' ')[0]}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Status Legend */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-900">
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#2384ba]" />
                <span>ACTIVE DATA CONNECTIONS</span>
              </span>
              <span>PROTOCOL: gRPC / TLS 1.3</span>
            </div>
          </div>

          {/* Node Technical Inspector Details Card */}
          <div className="lg:col-span-4 bg-slate-900/90 rounded-lg p-6 border border-slate-800 flex flex-col justify-between min-h-[420px]">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <span className="text-[#2384ba] font-mono text-xs font-medium uppercase tracking-wider">
                  {activeNode.category}
                </span>
                <span className="font-mono text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                  {activeNode.status} ({activeNode.latency})
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 font-display">{activeNode.name}</h3>
              <p className="text-slate-300 text-xs leading-relaxed mb-6 font-sans">
                {activeNode.description}
              </p>

              {/* Tech Stack Pills */}
              <div className="mb-6">
                <span className="text-slate-400 font-mono text-[11px] block mb-2 uppercase">
                  STACK & PROTOCOLS
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeNode.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 bg-slate-800 text-slate-200 text-xs font-mono rounded border border-slate-700/60"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Connections List */}
              <div>
                <span className="text-slate-400 font-mono text-[11px] block mb-2 uppercase">
                  DOWNSTREAM CONNECTIONS
                </span>
                {activeNode.connections.length > 0 ? (
                  <div className="space-y-1.5">
                    {activeNode.connections.map((cId) => {
                      const cNode = NODES.find((n) => n.id === cId);
                      return (
                        <div
                          key={cId}
                          className="flex items-center space-x-2 text-xs font-mono text-slate-300 bg-slate-950/60 px-2.5 py-1.5 rounded border border-slate-800"
                        >
                          <ChevronRight className="w-3.5 h-3.5 text-[#2384ba]" />
                          <span>{cNode?.name || cId}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-xs font-mono text-slate-500 italic">
                    Terminal end-point node.
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-slate-800 mt-6 flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-[#2384ba]" />
                <span>AES-256 ENCRYPTED</span>
              </span>
              <span className="text-[#2384ba]">ID: {activeNode.id}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
