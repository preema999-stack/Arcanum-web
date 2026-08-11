'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, Cpu, ShieldAlert, Rocket, LineChart, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Stage {
  step: string;
  title: string;
  category: string;
  description: string;
  icon: any;
  specs: string[];
  visualOutput: {
    codeSnippet: string;
    badge: string;
    metric: string;
  };
}

const STAGES: Stage[] = [
  {
    step: '01',
    title: 'Architectural Discovery & System Blueprinting',
    category: 'PHASE 01 — AUDIT & TOPOLOGY',
    description:
      'We audit legacy infrastructure and design a modular enterprise topology with defined service boundaries, database schemas, and microservice contracts.',
    icon: Compass,
    specs: ['Domain-Driven Design (DDD)', 'Service Boundaries & Schemas', 'Legacy Dependency Audit'],
    visualOutput: {
      codeSnippet: `// Blueprint Specification
topology:
  domain: 'arcanum.enterprise'
  auth: 'OAuth2/SAML Gateway'
  isolation: 'Zero-Trust Container Mesh'`,
      badge: 'TOPOLOGY APPROVED',
      metric: 'Audit Latency: 0ms',
    },
  },
  {
    step: '02',
    title: 'Modular Full-Stack Engineering',
    category: 'PHASE 02 — CORE DEVELOPMENT',
    description:
      'Clean TypeScript and Java Spring APIs built with strict type-safety, automated unit assertions, and resilient state synchronization.',
    icon: Cpu,
    specs: ['TypeScript & Java Core', 'Strict API Contracts (gRPC)', 'High-concurrency DB Drivers'],
    visualOutput: {
      codeSnippet: `// Modular Code Generation
const ModuleEngine = new CoreEngine({
  typeSafety: 'STRICT',
  orm: 'PostgreSQL/Oracle',
  concurrency: 10000,
});`,
      badge: 'BUILD PASSED (100%)',
      metric: 'Unit Test Coverage: 98.4%',
    },
  },
  {
    step: '03',
    title: 'Zero-Trust Cryptography & Security Shield',
    category: 'PHASE 03 — SECURITY HARDENING',
    description:
      'AES-256 data encryption at rest and in transit, HSM key management, role-based authorization (RBAC), and automated penetration testing.',
    icon: ShieldAlert,
    specs: ['AES-256 GCM Vault', 'OAuth2 / SAML Single Sign-On', 'Central Bank & ISO Readiness'],
    visualOutput: {
      codeSnippet: `// Zero-Trust Security Handshake
const token = await Vault.sign({
  algorithm: 'RS256',
  kmsKeyId: 'arn:aws:kms:uae:arcanum-key',
  integrityProof: SHA256(payload),
});`,
      badge: 'ISO 27001 VERIFIED',
      metric: 'Vulnerabilities: 0',
    },
  },
  {
    step: '04',
    title: 'Zero-Downtime Deployment Pipeline',
    category: 'PHASE 04 — CONTINUOUS INTEGRATION',
    description:
      'Blue-green canary deployments and Docker/Kubernetes container orchestration ensure seamless system upgrades without operational downtime.',
    icon: Rocket,
    specs: ['Container Orchestration', 'Canary Traffic Rolling', 'Database Migration Safety'],
    visualOutput: {
      codeSnippet: `// Kubernetes Deployment Rollout
kubectl apply -f arcanum-prod.yaml
[DEPLOY] Rolling update 100% complete
[HEALTH] All 12 nodes responding 200 OK`,
      badge: 'DEPLOYED TO PROD',
      metric: 'Rollout Time: 1.4s',
    },
  },
  {
    step: '05',
    title: 'Operational Telemetry & SLA Guarantee',
    category: 'PHASE 05 — TELEMETRY & SLA',
    description:
      '24/7 automated monitoring, Prometheus metrics, real-time logging, and guaranteed 99.99% system SLA for enterprise peace of mind.',
    icon: LineChart,
    specs: ['24/7 Prometheus Metrics', 'Real-Time Audit Trail', 'Instant Incident Escalation'],
    visualOutput: {
      codeSnippet: `// Live Telemetry Monitoring
Prometheus.query('up{job="arcanum-api"}')
Result: 1.0 (100% Uptime)
Alerts Triggered: 0`,
      badge: '99.99% SLA ACTIVE',
      metric: 'Operational Status: NOMINAL',
    },
  },
];

export function CinematicScrollSection() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const currentStage = STAGES[activeStep];

  return (
    <section id="lifecycle" className="py-24 bg-[#f8fafc] editorial-grid border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-[#2384ba] font-mono text-xs tracking-widest uppercase block mb-2">
            05 / ARCHITECTURAL LIFECYCLE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0f172a] font-display">
            The Arcanum Engineering Lifecycle
          </h2>
          <p className="text-slate-600 text-base font-sans mt-3">
            From initial architectural blueprinting to continuous telemetry monitoring, 
            every phase of our software lifecycle is governed by strict engineering standards.
          </p>
        </div>

        {/* Step Selector Tabs & Visual Display Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Navigation Steps Column */}
          <div className="lg:col-span-5 space-y-3">
            {STAGES.map((stage, idx) => {
              const isActive = activeStep === idx;
              const Icon = stage.icon;

              return (
                <button
                  key={stage.step}
                  onClick={() => setActiveStep(idx)}
                  className={`w-full text-left p-5 rounded-lg border transition-all duration-300 flex items-start space-x-4 ${
                    isActive
                      ? 'bg-[#0f172a] text-white border-[#0f172a] shadow-lg scale-[1.01]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded flex items-center justify-center font-mono text-xs font-bold mt-0.5 shrink-0 ${
                      isActive ? 'bg-[#2384ba] text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {stage.step}
                  </div>
                  <div>
                    <span
                      className={`text-[11px] font-mono uppercase tracking-wider block mb-1 ${
                        isActive ? 'text-[#2384ba]' : 'text-slate-500'
                      }`}
                    >
                      {stage.category}
                    </span>
                    <h3
                      className={`text-base font-semibold font-display ${
                        isActive ? 'text-white' : 'text-[#0f172a]'
                      }`}
                    >
                      {stage.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Interactive Visual Frame */}
          <div className="lg:col-span-7 sticky top-28">
            <motion.div
              key={currentStage.step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-[#0f172a] text-slate-100 rounded-lg p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col justify-between min-h-[460px]"
            >
              <div>
                {/* Top Badge & Metric */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <span className="text-[#2384ba] font-mono text-xs uppercase tracking-widest">
                    STAGE {currentStage.step} EXECUTION
                  </span>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded border border-emerald-800/40">
                    {currentStage.visualOutput.badge}
                  </span>
                </div>

                {/* Stage Heading */}
                <h3 className="text-2xl font-bold text-white mb-3 font-display">
                  {currentStage.title}
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 font-sans">
                  {currentStage.description}
                </p>

                {/* Key Architectural Specs */}
                <div className="mb-6">
                  <span className="text-slate-400 font-mono text-[11px] uppercase tracking-wider block mb-2">
                    ARCHITECTURAL GUARANTEES
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {currentStage.specs.map((spec) => (
                      <div
                        key={spec}
                        className="bg-slate-900 px-3 py-2 rounded text-xs font-mono text-slate-300 border border-slate-800 flex items-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2384ba] shrink-0" />
                        <span className="truncate">{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Code Terminal Output Frame */}
                <div className="bg-black/80 rounded p-4 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
                  <pre className="text-slate-300">{currentStage.visualOutput.codeSnippet}</pre>
                </div>
              </div>

              {/* Bottom Footer Details */}
              <div className="pt-6 border-t border-slate-800 mt-6 flex items-center justify-between font-mono text-xs text-slate-400">
                <span>{currentStage.visualOutput.metric}</span>
                <span className="text-[#2384ba]">ARCANUM PIPELINE ENGINE</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
