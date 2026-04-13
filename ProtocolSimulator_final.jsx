import React, { useState, useMemo, useEffect, useRef } from 'react';
import { CheckCircle2, XCircle, ShieldCheck, Lock, Unlock, Eye, Activity, Crosshair, Cpu, ShieldAlert, FileText, EyeOff, SearchCode, Fingerprint, Calculator, PowerOff } from 'lucide-react';

// ─── SEEDED RANDOM (fixes SSR hydration mismatch from Math.random()) ──────────────
function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────────────────────────
const ProtocolSimulator = () => {
  // 1. STATE CONTROL
  const [checks, setChecks] = useState({
    c1: true, // Structural Integrity (Weight: 35)
    c2: true, // Internal Sequence (Weight: 35)
    c3: true, // External Cross-Check (Weight: 15)
    c4: true, // Regulatory Protection (Weight: 15)
  });
  const [hasAnomaly, setHasAnomaly] = useState(false);
  const [isAligning, setIsAligning] = useState(false);
  const [forceOFalse, setForceOFalse] = useState(false);

  // 2. O-SPACE MATHEMATICAL MODELLING
  const historyPoints = useMemo(() => {
    const rng = seededRandom(42);
    return Array.from({ length: 40 }).map((_, i) => {
      const isOutlier = rng() > 0.85;
      const radius = isOutlier ? 35 + rng() * 15 : rng() * 12;
      const angle = (i / 40) * 2 * Math.PI;
      return {
        id: i,
        x: 50 + radius * Math.cos(angle),
        y: 50 + radius * Math.sin(angle),
        opacity: isOutlier ? 0.2 : 0.5,
      };
    });
  }, []);

  const regularityScore = useMemo(() => {
    if (hasAnomaly || forceOFalse) return 15;
    let score = 0;
    if (checks.c1) score += 35;
    if (checks.c2) score += 35;
    if (checks.c3) score += 15;
    if (checks.c4) score += 15;
    return score;
  }, [checks, hasAnomaly, forceOFalse]);

  // 3. DIAGNOSTICS & CROSS-CHECK (Boolean algebra)
  const crossCheck = useMemo(() => {
    const b1 = checks.c1 ? 1 : 0;
    const b2 = checks.c2 ? 1 : 0;
    const b3 = checks.c3 ? 1 : 0;
    const b4 = checks.c4 ? 1 : 0;
    const vectorMap = (b1 << 3) | (b2 << 2) | (b3 << 1) | b4;
    const logicalProduct = b1 * b2 * b3 * b4;
    const anomalyM = hasAnomaly ? 0 : 1;
    const overrideM = forceOFalse ? 0 : 1;
    const O_s = logicalProduct * anomalyM * overrideM;
    const expectedScore = b1 * 35 + b2 * 35 + b3 * 15 + b4 * 15;
    const isMathValid = regularityScore === (hasAnomaly || forceOFalse ? 15 : expectedScore);
    return {
      vectorMap: `0x0${vectorMap.toString(16).toUpperCase()}`,
      O_s,
      isValid: isMathValid,
      equation: `O(s) = (${b1}×${b2}×${b3}×${b4}) × ${anomalyM} × ${overrideM} = ${O_s}`,
    };
  }, [checks, regularityScore, hasAnomaly, forceOFalse]);

  // 4. FORENSIC FINDINGS
  const forensicFindings = useMemo(() => {
    const findings = [];
    if (!crossCheck.isValid) findings.push('CRITICAL: Mathematical vector cross-check failed.');
    if (forceOFalse) findings.push('OVERRIDE: [O>FALSE] O-Gate zeroed by multiplier = 0.');
    if (hasAnomaly) findings.push('ANOMALY: Interference detected. Integrity multiplier collapsed to 0.');
    if (!checks.c1) findings.push('LOGIC_ERR (Bit 3): Structural integrity s(x) invalid.');
    if (!checks.c2) findings.push('LOGIC_ERR (Bit 2): Internal sequence fails logical operation.');
    if (!checks.c3) findings.push('SYS_ERR (Bit 1): External hash cross-match failed.');
    if (!checks.c4) findings.push('REG_ERR (Bit 0): Regulatory norm (GDPR) non-conformant with space vector.');
    return findings;
  }, [checks, hasAnomaly, crossCheck, forceOFalse]);

  // 5. MODE RESOLUTION
  const mode = useMemo(() => {
    if (forceOFalse) return { id: 'FORCED_FALSE', label: 'O>FALSE OVERRIDE', color: 'text-rose-500', bg: 'bg-rose-950/50', border: 'border-rose-500', icon: PowerOff };
    if (hasAnomaly) return { id: 'ANOMALY', label: 'CRITICAL ANOMALY', color: 'text-red-500', bg: 'bg-red-950/30', border: 'border-red-500', icon: ShieldAlert };
    if (crossCheck.O_s === 1) return { id: 'PUBLISH', label: 'PUBLIC OUTPUT', color: 'text-emerald-500', bg: 'bg-emerald-950/30', border: 'border-emerald-500', icon: Unlock };
    if (checks.c1 && checks.c2 && regularityScore >= 70) return { id: 'PREVIEW', label: 'INTERNAL PREVIEW', color: 'text-amber-500', bg: 'bg-amber-950/30', border: 'border-amber-500', icon: Eye };
    return { id: 'BLOCKED', label: 'BLOCKED', color: 'text-rose-500', bg: 'bg-rose-950/30', border: 'border-rose-500', icon: Lock };
  }, [checks, hasAnomaly, regularityScore, crossCheck.O_s, forceOFalse]);

  // 6. O-SPACE POSITION
  const currentCasePos = useMemo(() => {
    if (isAligning) return { x: 50, y: 50 };
    if (crossCheck.O_s === 1) return { x: 50, y: 50 };
    const offset = (100 - regularityScore) * 0.4;
    return { x: 50 + offset, y: 50 + offset };
  }, [regularityScore, isAligning, crossCheck.O_s]);

  // 7. LIVE TIMESTAMP
  const [timestamp, setTimestamp] = useState('');
  useEffect(() => {
    setTimestamp(new Date().toISOString());
  }, []);

  // 8. HANDLERS
  const toggleCheck = (key) => {
    if (isAligning) return;
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleRecalibrate = () => {
    setIsAligning(true);
    setForceOFalse(false);
    setTimeout(() => {
      setHasAnomaly(false);
      setChecks({ c1: true, c2: true, c3: true, c4: true });
      setIsAligning(false);
    }, 2000);
  };

  const handleForceOFalse = () => {
    if (isAligning) return;
    setForceOFalse(true);
  };

  const isOutputTrue = crossCheck.O_s === 1;

  return null; // render implementation in index.html / protocol-o-visualizer.html
};

export default ProtocolSimulator;
