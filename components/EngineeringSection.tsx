'use client';

import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2, Database, ShieldCheck } from 'lucide-react';

interface CodeSnippet {
  id: string;
  filename: string;
  language: string;
  description: string;
  code: string;
}

const SNIPPETS: CodeSnippet[] = [
  {
    id: 'erp',
    filename: 'AccurateERP.ts',
    language: 'TypeScript',
    description: 'Double-entry multi-currency financial ledger & automated audit trail.',
    code: `import { EnterpriseLedger, Currency, AuditTrail } from '@arcanum/erp-core';

export class FinancialLedgerEngine implements EnterpriseLedger {
  private readonly hsmVault: HSMVaultClient;

  constructor(config: LedgerConfig) {
    this.hsmVault = new HSMVaultClient(config.vaultEndpoint);
  }

  public async recordTransaction(entry: LedgerEntry): Promise<TransactionReceipt> {
    // Enforce dual-authorization & immutable cryptography check
    const signature = await this.hsmVault.signPayload(entry.hash);
    
    const record = await DB.transaction.create({
      data: {
        organizationId: entry.orgId,
        debitAccount: entry.debitAccount,
        creditAccount: entry.creditAccount,
        amount: entry.amount,
        currency: entry.currency || Currency.AED,
        cryptographicProof: signature,
        status: 'SYNCHRONIZED',
      },
    });

    AuditTrail.logEvent({
      action: 'FINANCIAL_TRANSACTION_RECORDED',
      ledgerId: record.id,
      timestamp: new Date().toISOString(),
    });

    return { receiptId: record.id, status: 200, latencyMs: 4.2 };
  }
}`,
  },
  {
    id: 'banking',
    filename: 'TransaBankingGateway.ts',
    language: 'TypeScript',
    description: 'ISO 8583 ATM switch bridge & biometric transaction verifier.',
    code: `import { ISO8583Message, BiometricToken } from '@arcanum/banking';

export async function processATMAuthorization(
  rawPacket: Uint8Array,
  userBiometric: BiometricToken
): Promise<ISO8583Response> {
  // Parse binary ISO 8583 financial transaction packet
  const isoMsg = ISO8583Message.unpack(rawPacket);
  
  if (isoMsg.processingCode !== '000000') {
    throw new InvalidProcessingCodeError(isoMsg.processingCode);
  }

  // Validate biometric payload with bank HSM
  const isValid = fontBiometricVerifier.verify(userBiometric, isoMsg.accountNumber);
  
  if (!isValid) {
    return ISO8583Response.decline('51', 'INSUFFICIENT_AUTHENTICATION');
  }

  // Dispatch to core banking ledger switch
  const res = await BankingSwitch.dispatch({
    terminalId: isoMsg.terminalId,
    account: isoMsg.accountNumber,
    amount: isoMsg.amountTransaction,
  });

  return ISO8583Response.approve(res.authCode);
}`,
  },
  {
    id: 'oracle',
    filename: 'OracleModernizer.sql',
    language: 'PL/SQL / REST API',
    description: 'Refactoring legacy Oracle Forms PL/SQL procedures into modern REST endpoints.',
    code: `-- Legacy Oracle Forms Stored Procedure Refactoring Pipeline
CREATE OR REPLACE PROCEDURE modernizer_export_org_structure (
    p_org_id IN NUMBER,
    p_json_output OUT CLOB
) AS
BEGIN
    SELECT json_object(
        'organization_id' VALUE org_id,
        'organization_name' VALUE org_name,
        'tax_registration_no' VALUE trn_number,
        'hierarchical_members' VALUE (
            SELECT json_arrayagg(
                json_object(
                    'user_id' VALUE user_id,
                    'role_name' VALUE role_name,
                    'access_level' VALUE access_level
                )
            ) FROM org_members WHERE org_id = p_org_id
        )
    ) INTO p_json_output
    FROM organizations
    WHERE org_id = p_org_id;

    -- Log migration audit telemetries
    INSERT INTO oracle_modernizer_telemetry (org_id, status, execution_time)
    VALUES (p_org_id, 'REST_PAYLOAD_GENERATED', SYSTIMESTAMP);
END modernizer_export_org_structure;`,
  },
];

export function CodeSandbox() {
  const [activeSnippet, setActiveSnippet] = useState<CodeSnippet>(SNIPPETS[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSnippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = activeSnippet.code.split('\n');

  return (
    <div className="bg-[#0f172a] rounded-lg border border-slate-800 shadow-2xl overflow-hidden font-mono">
      {/* Top Header Controls Bar */}
      <div className="flex flex-wrap items-center justify-between bg-slate-900/90 px-4 py-3 border-b border-slate-800">
        {/* Left Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1">
          {SNIPPETS.map((snippet) => (
            <button
              key={snippet.id}
              onClick={() => setActiveSnippet(snippet)}
              className={`px-3 py-1.5 rounded text-xs transition-all flex items-center space-x-2 ${
                activeSnippet.id === snippet.id
                  ? 'bg-[#2384ba] text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>{snippet.filename}</span>
            </button>
          ))}
        </div>

        {/* Right Copy Button & Language Badge */}
        <div className="flex items-center space-x-3 pt-2 sm:pt-0">
          <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded">
            {activeSnippet.language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Description Line */}
      <div className="bg-slate-950/70 px-4 py-2 border-b border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
        <span className="truncate">// {activeSnippet.description}</span>
        <span className="text-[#2384ba] text-[10px] uppercase font-bold tracking-wider">
          PRODUCTION ENGINE SNIPPET
        </span>
      </div>

      {/* Code Editor Body */}
      <div className="p-4 sm:p-6 text-xs sm:text-sm overflow-x-auto max-h-[460px] leading-relaxed bg-[#0b1322]" data-lenis-prevent>
        <pre className="table w-full">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-slate-800/30 font-mono">
                <td className="w-10 text-right pr-4 text-slate-600 select-none text-[11px]">
                  {idx + 1}
                </td>
                <td className="whitespace-pre text-slate-200">
                  {/* Highlight key words in Arcanum blue */}
                  {line.includes('class') || line.includes('function') || line.includes('PROCEDURE') ? (
                    <span className="text-[#2384ba] font-semibold">{line}</span>
                  ) : line.includes('import') || line.includes('export') || line.includes('CREATE') ? (
                    <span className="text-[#38bdf8]">{line}</span>
                  ) : line.includes('//') || line.includes('--') ? (
                    <span className="text-slate-500 italic">{line}</span>
                  ) : line.includes('return') || line.includes('await') ? (
                    <span className="text-amber-400 font-medium">{line}</span>
                  ) : (
                    line
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </pre>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-slate-900 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2384ba]" />
            <span>TYPESAFE</span>
          </span>
          <span>•</span>
          <span>UTF-8</span>
        </div>
        <span className="text-slate-500 font-sans">ARCANUM SOFTWARE SPECIFICATION v4.2</span>
      </div>
    </div>
  );
}

export function EngineeringSection() {
  return (
    <section id="engineering" className="py-24 bg-[#f8fafc] editorial-grid border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <span className="text-[#2384ba] font-mono text-xs tracking-widest uppercase block mb-2">
            03 / SYSTEM INTEGRATION & ENGINE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#0f172a] font-display mb-4">
            Production Software Engineering Architecture
          </h2>
          <p className="text-slate-600 text-base font-sans leading-relaxed">
            Our codebase is engineered with strict modular isolation, zero-trust security layers, 
            and high-concurrency database drivers to guarantee enterprise longevity.
          </p>
        </div>

        {/* Code Sandbox Component */}
        <CodeSandbox />
      </div>
    </section>
  );
}
