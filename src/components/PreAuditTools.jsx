import React, { useState, useCallback, useRef, useLayoutEffect, useEffect } from "react";
import "./pre-audit-tools.css";

/* ═══════════════════════════════════════════════════════════════════
   PRE-AUDIT TOOLS: CONSTANTS & HELPERS 
   ═══════════════════════════════════════════════════════════════════ */

const FACILITIES = [
  { id: 'f1', name: 'Facility Nord' },
  { id: 'f2', name: 'hassan 2 ' },
  { id: 'f3', name: 'sbitar ayman ligassi ' },
  { id: 'f4', name: 'Facility Sud' }
];

const INSPECTORS = [
  { id: 'i1', name: 'Isabelle Bernard' },
  { id: 'i2', name: 'Ayman ligassi ' },
  { id: 'i3', name: 'Samuel Dupuis' }
];

let _counter = 0;
const genId = () => `pnode_${Date.now()}_${++_counter}`;

const createNode = (triggerCondition = null) => ({
  id: genId(),
  title: "",
  description: "",
  answer_type: "BOOLEAN",
  trigger_condition: triggerCondition,
  require_photo: false,
  require_note: false,
  children: [],
});

/* RECURSIVE STATE SYNCHRONIZATION HELPERS */
const addChildToNode = (nodes, targetId, child) =>
  nodes.map((n) =>
    n.id === targetId
      ? { ...n, children: [...n.children, child] }
      : { ...n, children: addChildToNode(n.children, targetId, child) }
  );

const updateNodeById = (nodes, id, updater) =>
  nodes.map((n) =>
    n.id === id
      ? updater(n)
      : { ...n, children: updateNodeById(n.children, id, updater) }
  );

const deleteNodeById = (nodes, id) =>
  nodes
    .filter((n) => n.id !== id)
    .map((n) => ({ ...n, children: deleteNodeById(n.children, id) }));

/* ═══════════════════════════════════════════════════════════════════
   INLINE SVG ICONS (NO EXTERNAL CRASHES)
   ═══════════════════════════════════════════════════════════════════ */
const Ico = {
  Plus: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Trash: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6H9V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  ),
  Save: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  Branch: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
      <path d="M18 9a9 9 0 01-9 9" />
    </svg>
  ),
  ClipboardCheck: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
      <path d="M9 14l2 2 4-4"></path>
    </svg>
  ),
  Camera: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  FileText: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  ),
  X: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  ),
  Building: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <line x1="9" y1="12" x2="9.01" y2="12" />
      <line x1="15" y1="12" x2="15.01" y2="12" />
    </svg>
  ),
  User: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Calendar: (p) => (
    <svg {...p} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
};

const TYPE_META = {
  BOOLEAN: { label: "OUI / NON", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  TEXT: { label: "TEXTE", color: "#0ea5e9", bg: "rgba(14,165,233,0.12)" },
  PHOTO: { label: "PHOTO", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
};

/* ═══════════════════════════════════════════════════════════════════
   READ-ONLY SUMMARY TREE (for Confirmation Modal)
   ═══════════════════════════════════════════════════════════════════ */
function SummaryTree({ nodes, level = 0 }) {
  if (!nodes || nodes.length === 0) return null;

  return (
    <ul style={{
      listStyle: "none",
      margin: 0,
      padding: 0,
      paddingLeft: level > 0 ? "20px" : "0",
      borderLeft: level > 0 ? "2px solid #e2e8f0" : "none",
      marginLeft: level > 0 ? "8px" : "0",
      marginTop: level > 0 ? "8px" : "0",
    }}>
      {nodes.map((node) => {
        const meta = TYPE_META[node.answer_type] || TYPE_META.BOOLEAN;
        return (
          <li key={node.id} style={{ marginBottom: "10px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              padding: "10px 14px",
              background: "#f8fafc",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
            }}>
              <span style={{
                fontSize: "0.7rem",
                fontWeight: 800,
                padding: "2px 8px",
                borderRadius: "4px",
                color: meta.color,
                background: meta.bg,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
              }}>
                {meta.label}
              </span>
              <span style={{
                fontWeight: 600,
                fontSize: "0.875rem",
                color: "#0f172a",
                flex: 1,
                minWidth: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}>
                {node.title || <span style={{ color: "#94a3b8", fontStyle: "italic" }}>Sans titre</span>}
              </span>
              {node.trigger_condition && (
                <span style={{
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "999px",
                  ...(node.trigger_condition === 'OUI'
                    ? { color: "#065f46", background: "#d1fae5", border: "1px solid #a7f3d0" }
                    : { color: "#991b1b", background: "#fee2e2", border: "1px solid #fecaca" })
                }}>
                  IF {node.trigger_condition}
                </span>
              )}
              {node.require_photo && (
                <span style={{ fontSize: "0.7rem", color: "#10b981", fontWeight: 700, display: "flex", alignItems: "center", gap: "2px" }}>
                  <Ico.Camera style={{ width: "10px", height: "10px" }} />
                  Photo
                </span>
              )}
              {node.require_note && (
                <span style={{ fontSize: "0.7rem", color: "#3b82f6", fontWeight: 700, display: "flex", alignItems: "center", gap: "2px" }}>
                  <Ico.FileText style={{ width: "10px", height: "10px" }} />
                  Note
                </span>
              )}
            </div>
            {node.children && node.children.length > 0 && (
              <SummaryTree nodes={node.children} level={level + 1} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   FLOW NODE CARD (Recursive Component)
   ═══════════════════════════════════════════════════════════════════ */
function FlowNode({ node, isRoot, onAddChild, onUpdate, onDelete }) {
  const meta = TYPE_META[node.answer_type] ?? TYPE_META.BOOLEAN;
  const hasChildren = node.children && node.children.length > 0;

  const portRef = useRef(null);
  const childRowRef = useRef(null);
  const [svgLines, setSvgLines] = useState([]);

  useLayoutEffect(() => {
    if (!portRef.current || !childRowRef.current || !hasChildren) {
      setSvgLines(prev => prev.length === 0 ? prev : []);
      return;
    }

    const portRect = portRef.current.getBoundingClientRect();
    const rowRect = childRowRef.current.getBoundingClientRect();
    const childCards = childRowRef.current.querySelectorAll(":scope > .pa-child-slot > .pa-node-wrap > .pa-node-card");

    const calculatedLines = [];
    childCards.forEach((card) => {
      const cardRect = card.getBoundingClientRect();
      const sx = portRect.left + portRect.width / 2 - rowRect.left;
      const sy = portRect.bottom - rowRect.top;
      const tx = cardRect.left + cardRect.width / 2 - rowRect.left;
      const ty = cardRect.top - rowRect.top;
      const my = sy + (ty - sy) * 0.45;

      calculatedLines.push({ sx, sy, mx: sx, my, tx, ty });
    });

    setSvgLines(prev => JSON.stringify(prev) === JSON.stringify(calculatedLines) ? prev : calculatedLines);
  }, [hasChildren, node.children]);

  const triggerBadge = !isRoot && node.trigger_condition ? (
    <span style={{
      fontSize: "0.65rem",
      fontWeight: 800,
      padding: "0.2rem 0.6rem",
      borderRadius: "9999px",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      ...(node.trigger_condition === 'OUI'
        ? { color: "#065f46", background: "#d1fae5", border: "1px solid #a7f3d0" }
        : { color: "#991b1b", background: "#fee2e2", border: "1px solid #fecaca" })
    }}>
      IF {node.trigger_condition}
    </span>
  ) : null;

  return (
    <div className="pa-node-wrap">
      {/* 1. NODE UI CARD */}
      <div className="pa-node-card" style={{ "--node-color": meta.color }}>
        <div style={{ height: "4px", width: "100%", background: meta.color }} />

        <div className="pa-node-header">
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", flex: 1 }}>
            <span className="pa-node-badge" style={{ color: meta.color, background: meta.bg }}>
              {meta.label}
            </span>
            {triggerBadge}

            {/* ── Evidence Required Indicators ── */}
            <div style={{ display: "flex", gap: "4px", marginLeft: "auto" }}>
              {node.require_photo && (
                <span title="L'auditeur doit ajouter une Photo ici" style={{
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "#10b981",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "2px"
                }}>
                  <Ico.Camera style={{ width: "10px", height: "10px" }} />
                  Photo
                </span>
              )}
              {node.require_note && (
                <span title="L'auditeur doit ajouter une Note ici" style={{
                  background: "rgba(59, 130, 246, 0.15)",
                  color: "#3b82f6",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "2px"
                }}>
                  <Ico.FileText style={{ width: "10px", height: "10px" }} />
                  Note
                </span>
              )}
            </div>
          </div>
          <button className="pa-node-del" onClick={() => onDelete(node.id)} title="Supprimer">
            <Ico.Trash style={{ width: "0.8rem", height: "0.8rem" }} />
          </button>
        </div>

        {/* 2. STRICTLY CONTROLLED AUTO-SAVING COMPONENTS */}
        <div className="pa-node-body">
          <input
            className="pa-input-title"
            value={node.title}
            onChange={(e) => onUpdate(node.id, { title: e.target.value })}
            placeholder={isRoot ? "Ex: Question de préparation principale..." : "Ex: Question de suivi optionnel..."}
          />
          <textarea
            className="pa-input-desc"
            value={node.description}
            onChange={(e) => onUpdate(node.id, { description: e.target.value })}
            placeholder="Instruction ou description nécessaire..."
            rows={2}
          />

          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: "600", color: "#64748b", marginBottom: "0.25rem" }}>
              Type de réponse attendue
            </div>
            <select
              className="pa-select-type"
              value={node.answer_type}
              onChange={(e) => onUpdate(node.id, { answer_type: e.target.value })}
              style={{ color: meta.color, borderColor: `${meta.color}55`, background: meta.bg }}
            >
              <option value="BOOLEAN">OUI / NON</option>
              <option value="TEXT">TEXTE</option>
              <option value="PHOTO">PHOTO</option>
            </select>
          </div>

          {/* Trigger Condition Dropdown for non-root nodes */}
          {!isRoot && (
            <div style={{ marginTop: "0.5rem" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: "600", color: "#64748b", marginBottom: "0.25rem" }}>
                Condition de déclenchement
              </div>
              <select
                className="pa-select-type"
                value={node.trigger_condition || ""}
                onChange={(e) => onUpdate(node.id, { trigger_condition: e.target.value || null })}
                style={{ fontSize: "0.75rem", padding: "0.3rem 0.5rem", color: "#475569", borderColor: "#cbd5e1", background: "#f8fafc" }}
              >
                <option value="">Aucune</option>
                <option value="OUI">Si réponse est OUI</option>
                <option value="NON">Si réponse est NON</option>
              </select>
            </div>
          )}

          {/* Evidence Requirements */}
          <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px dashed #e2e8f0" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: "600", color: "#64748b", marginBottom: "0.5rem" }}>
              Evidence Requise
            </div>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#475569", cursor: "pointer", fontWeight: 500 }}>
                <input
                  type="checkbox"
                  checked={node.require_photo}
                  onChange={(e) => onUpdate(node.id, { require_photo: e.target.checked })}
                  style={{ accentColor: "#10b981", width: "14px", height: "14px", cursor: "pointer" }}
                />
                <Ico.Camera style={{ width: "14px", height: "14px", color: "#64748b" }} />
                Photo
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "#475569", cursor: "pointer", fontWeight: 500 }}>
                <input
                  type="checkbox"
                  checked={node.require_note}
                  onChange={(e) => onUpdate(node.id, { require_note: e.target.checked })}
                  style={{ accentColor: "#3b82f6", width: "14px", height: "14px", cursor: "pointer" }}
                />
                <Ico.FileText style={{ width: "14px", height: "14px", color: "#64748b" }} />
                Note
              </label>
            </div>
          </div>
        </div>

        {/* 3. CONDITIONAL BRANCHING GENERATOR */}
        <div className="pa-node-footer">
          {node.answer_type === "BOOLEAN" ? (
            <div ref={portRef} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", width: "100%" }}>
              <button
                className="pa-btn-branch"
                onClick={() => onAddChild(node.id, 'OUI')}
                style={{ flex: 1, justifyContent: "center" }}
              >
                <Ico.Branch style={{ width: "0.8rem", height: "0.8rem" }} />
                + Condition (OUI)
              </button>
              <button
                className="pa-btn-branch"
                onClick={() => onAddChild(node.id, 'NON')}
                style={{ flex: 1, justifyContent: "center" }}
              >
                <Ico.Branch style={{ width: "0.8rem", height: "0.8rem" }} />
                + Condition (NON)
              </button>
            </div>
          ) : (
            <div ref={portRef} className="pa-terminal">
              Fin de l'etape
            </div>
          )}
        </div>
      </div>

      {/* 4. RECURSIVE VISUAL RENDERING */}
      {hasChildren && (
        <div className="pa-children-container" ref={childRowRef}>
          <svg className="pa-svg-overlay">
            <defs>
              <marker id="arrow-yes" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0,0 L0,8 L8,4 z" fill="#10b981" opacity="0.8" />
              </marker>
              <marker id="arrow-no" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0,0 L0,8 L8,4 z" fill="#ef4444" opacity="0.8" />
              </marker>
              <marker id="arrow-neutral" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0,0 L0,8 L8,4 z" fill="#9ca3af" opacity="0.8" />
              </marker>
            </defs>
            {svgLines.map((l, i) => {
              const condition = node.children[i]?.trigger_condition;
              const path = `M ${l.sx} ${l.sy} C ${l.sx} ${l.my}, ${l.tx} ${l.my}, ${l.tx} ${l.ty}`;
              const lx = (l.sx + l.tx) / 2;
              const ly = (l.sy + l.ty) / 2;

              if (condition === 'OUI') {
                return (
                  <g key={i}>
                    <path d={path} stroke="#10b981" strokeWidth="2" fill="none" strokeDasharray="6 3" opacity="0.6" markerEnd="url(#arrow-yes)" />
                    <rect x={lx - 28} y={ly - 10} width={56} height={20} rx={10} fill="#d1fae5" stroke="#10b981" strokeWidth="1.2" />
                    <text x={lx} y={ly + 4} textAnchor="middle" fontSize="9" fontWeight="800" fill="#065f46" fontFamily="Inter, sans-serif">IF OUI</text>
                  </g>
                );
              }
              if (condition === 'NON') {
                return (
                  <g key={i}>
                    <path d={path} stroke="#ef4444" strokeWidth="2" fill="none" strokeDasharray="6 3" opacity="0.6" markerEnd="url(#arrow-no)" />
                    <rect x={lx - 28} y={ly - 10} width={56} height={20} rx={10} fill="#fee2e2" stroke="#ef4444" strokeWidth="1.2" />
                    <text x={lx} y={ly + 4} textAnchor="middle" fontSize="9" fontWeight="800" fill="#991b1b" fontFamily="Inter, sans-serif">IF NON</text>
                  </g>
                );
              }
              return (
                <g key={i}>
                  <path d={path} stroke="#9ca3af" strokeWidth="2" fill="none" strokeDasharray="6 3" opacity="0.6" markerEnd="url(#arrow-neutral)" />
                </g>
              );
            })}
          </svg>

          <div className="pa-children-row">
            {node.children.map((childNode) => (
              <div key={childNode.id} className="pa-child-slot">
                <FlowNode
                  node={childNode}
                  isRoot={false}
                  onAddChild={onAddChild}
                  onUpdate={onUpdate}
                  onDelete={onDelete}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN COMPONENT & STATE TREE CONFIG
   ═══════════════════════════════════════════════════════════════════ */
export default function PreAuditTools() {
  const [guideName, setGuideName] = useState("Guide HACCP Preparation");

  const [nodes, setNodes] = useState([]);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [missionData, setMissionData] = useState({
    facilityId: "",
    inspectorId: "",
    scheduledTime: ""
  });

  /* ── Close modal on Escape ── */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && showConfirmModal) setShowConfirmModal(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showConfirmModal]);

  const handleAddRootNode = useCallback(() => {
    setNodes((prev) => [...prev, createNode()]);
  }, []);

  const handleAddChildNode = useCallback((parentId, condition) => {
    setNodes((prev) => addChildToNode(prev, parentId, createNode(condition)));
  }, []);

  const handleUpdateNode = useCallback((id, patch) => {
    setNodes((prev) => updateNodeById(prev, id, (n) => ({ ...n, ...patch })));
  }, []);

  const handleDeleteNode = useCallback((id) => {
    setNodes((prev) => deleteNodeById(prev, id));
  }, []);

  /* Open confirmation modal */
  const handleOpenConfirm = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  /* Actual save triggered from modal */
  const handleConfirmSave = useCallback(async () => {
    setSaveStatus("saving");

    const finalPayload = {
      guideName,
      mission: missionData,
      nodes
    };
    console.log("FINAL JSON TREE PAYLOAD ->", JSON.stringify(finalPayload, null, 2));

    setTimeout(() => {
      setSaveStatus("success");
      setShowConfirmModal(false);
      setTimeout(() => setSaveStatus("idle"), 3000);
    }, 1500);
  }, [nodes, guideName, missionData]);

  const primaryBtnStyle = {
    background: "linear-gradient(135deg, #10b981, #059669)",
    color: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
    border: "none",
    fontWeight: "bold",
    padding: "10px 18px",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: saveStatus === "saving" ? "not-allowed" : "pointer",
    opacity: saveStatus === "saving" ? 0.7 : 1,
    transition: "all 0.2s ease",
    fontSize: "0.875rem",
    fontFamily: "inherit",
  };

  const ghostBtnStyle = {
    background: "transparent",
    color: "#64748b",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "10px 18px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontSize: "0.875rem",
    fontFamily: "inherit",
  };

  const selectedFacility = FACILITIES.find(f => f.id === missionData.facilityId);
  const selectedInspector = INSPECTORS.find(i => i.id === missionData.inspectorId);

  return (
    <div className="pa-builder-view" style={{ display: "block", height: "auto", overflowY: "auto", paddingBottom: "2rem" }}>
      {/* ── CONFIRMATION MODAL ── */}
      {showConfirmModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.55)",
            backdropFilter: "blur(4px)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowConfirmModal(false);
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              boxShadow: "0 24px 48px rgba(0, 0, 0, 0.2)",
              width: "100%",
              maxWidth: "640px",
              maxHeight: "85vh",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              animation: "modalEnter 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <style>{`
              @keyframes modalEnter {
                from { opacity: 0; transform: scale(0.96) translateY(8px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
              }
            `}</style>

            {/* Modal Header */}
            <div style={{
              padding: "24px 24px 16px",
              borderBottom: "1px solid #e2e8f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "1.125rem", fontWeight: 700, color: "#0f172a" }}>
                  Résumé du Template
                </h2>
                <p style={{ margin: "4px 0 0", fontSize: "0.8125rem", color: "#64748b" }}>
                  Vérifiez les détails avant l'envoi définitif
                </p>
              </div>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "8px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#f1f5f9"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                aria-label="Fermer"
              >
                <Ico.X style={{ width: "18px", height: "18px" }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
              {/* Guide Name */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
                  Nom du Guide
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                  {guideName}
                </div>
              </div>

              {/* Mission Details Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "12px",
                marginBottom: "24px",
              }}>
                <div style={{
                  padding: "12px",
                  background: "#f8fafc",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                }}>
                  <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#64748b", marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Ico.Building style={{ width: "12px", height: "12px" }} />
                    Établissement
                  </div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>
                    {selectedFacility?.name || "Non sélectionné"}
                  </div>
                </div>
                <div style={{
                  padding: "12px",
                  background: "#f8fafc",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                }}>
                  <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#64748b", marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Ico.User style={{ width: "12px", height: "12px" }} />
                    Inspecteur
                  </div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>
                    {selectedInspector?.name || "Non sélectionné"}
                  </div>
                </div>
                <div style={{
                  padding: "12px",
                  background: "#f8fafc",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                }}>
                  <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#64748b", marginBottom: "4px", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Ico.Calendar style={{ width: "12px", height: "12px" }} />
                    Date Planifiée
                  </div>
                  <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#0f172a" }}>
                    {missionData.scheduledTime
                      ? new Date(missionData.scheduledTime).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })
                      : "Non planifiée"}
                  </div>
                </div>
              </div>

              {/* Questions Tree Summary */}
              <div>
                <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
                  Arborescence des Questions ({nodes.length} racine{nodes.length > 1 ? "s" : ""})
                </div>
                {nodes.length === 0 ? (
                  <div style={{
                    padding: "24px",
                    textAlign: "center",
                    color: "#94a3b8",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    background: "#f8fafc",
                    borderRadius: "10px",
                    border: "1px dashed #cbd5e1",
                  }}>
                    Aucune question définie dans ce template.
                  </div>
                ) : (
                  <SummaryTree nodes={nodes} />
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              padding: "16px 24px 24px",
              borderTop: "1px solid #e2e8f0",
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
            }}>
              <button
                onClick={() => setShowConfirmModal(false)}
                style={ghostBtnStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                  e.currentTarget.style.borderColor = "#cbd5e1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "#e2e8f0";
                }}
              >
                Modifier
              </button>
              <button
                onClick={handleConfirmSave}
                disabled={saveStatus === "saving"}
                style={primaryBtnStyle}
                onMouseEnter={(e) => {
                  if (saveStatus !== "saving") {
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.45)";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 14px rgba(16, 185, 129, 0.3)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <Ico.Save style={{ width: "0.9rem", height: "0.9rem" }} />
                {saveStatus === "saving" ? "Envoi en cours..." : "Confirmer et Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="pa-builder-header">
        <div>
          <h1 className="pa-builder-title">
            <Ico.ClipboardCheck style={{ width: "1.5rem", height: "1.5rem", marginRight: "0.5rem", color: "#3b82f6" }} />
            Outils Pre-Audit - Workflow Builder
          </h1>
          <p className="pa-builder-subtitle">
            Synchronisation des noeuds en temps reel (Auto-Save JSON Data Tree)
          </p>
        </div>
        <button
          onClick={handleOpenConfirm}
          disabled={saveStatus === "saving"}
          style={primaryBtnStyle}
          onMouseEnter={(e) => {
            if (saveStatus !== "saving") {
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(16, 185, 129, 0.45)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 14px rgba(16, 185, 129, 0.3)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <Ico.Save style={{ width: "0.9rem", height: "0.9rem" }} />
          {saveStatus === "success" ? "Enregistre !" : "Sauvegarder le Template"}
        </button>
      </div>

      <div className="pa-builder-toolbar">
        <span className="pa-toolbar-label">Nom du Document :</span>
        <input
          className="pa-toolbar-input"
          value={guideName}
          onChange={(e) => setGuideName(e.target.value)}
          placeholder="ex: Guide HACCP 2024"
        />
        <div style={{ flex: 1 }} />
        <button className="pa-btn-add-section" onClick={handleAddRootNode}>
          <Ico.Plus style={{ width: "0.875rem", height: "0.875rem" }} />
          + Ajouter une Question Principale
        </button>
      </div>

      <div className="pa-builder-canvas" style={{ minHeight: "65vh", overflow: "visible" }}>
        {nodes.length === 0 ? (
          <div className="pa-empty-state">
            <Ico.ClipboardCheck style={{ width: "3.5rem", height: "3.5rem", opacity: 0.2 }} />
            <span>Le Workflow de preparation est vide. Ajoutez la premiere etape pour commencer.</span>
          </div>
        ) : (
          <div className="pa-root-nodes">
            {nodes.map((node) => (
              <div key={node.id} className="pa-root-slot">
                <FlowNode
                  node={node}
                  isRoot={true}
                  onAddChild={handleAddChildNode}
                  onUpdate={handleUpdateNode}
                  onDelete={handleDeleteNode}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Save Bar */}
      {nodes.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem", marginBottom: "1rem" }}>
          <button
            onClick={handleOpenConfirm}
            disabled={saveStatus === "saving"}
            style={{ ...primaryBtnStyle, padding: "12px 28px", fontSize: "1rem" }}
            onMouseEnter={(e) => {
              if (saveStatus !== "saving") {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(16, 185, 129, 0.45)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 14px rgba(16, 185, 129, 0.3)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <Ico.Save style={{ width: "1rem", height: "1rem" }} />
            Sauvegarder le Template
          </button>
        </div>
      )}

      {/* Mission Assignment Card */}
      <div style={{
        marginTop: "3rem",
        marginBottom: "2rem",
        marginLeft: "2rem",
        marginRight: "2rem",
        backgroundColor: "white",
        borderRadius: "0.75rem",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)",
        padding: "2rem"
      }}>
        <h2 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <Ico.ClipboardCheck style={{ width: "1.2rem", height: "1.2rem", color: "#6366f1" }} />
          <span style={{ color: "var(--text-color, #0f172a)" }}>Assignation de la Mission</span>
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "#64748b", marginBottom: "0.5rem" }}>Etablissement (Facility)</label>
            <select
              className="pa-toolbar-input"
              style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem" }}
              value={missionData.facilityId}
              onChange={(e) => setMissionData(p => ({ ...p, facilityId: e.target.value }))}
            >
              <option value="">Selectionner un etablissement...</option>
              {FACILITIES.map(f => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "#64748b", marginBottom: "0.5rem" }}>Inspecteur</label>
            <select
              className="pa-toolbar-input"
              style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem" }}
              value={missionData.inspectorId}
              onChange={(e) => setMissionData(p => ({ ...p, inspectorId: e.target.value }))}
            >
              <option value="">Selectionner un inspecteur...</option>
              {INSPECTORS.map(i => (
                <option key={i.id} value={i.id}>{i.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.75rem", fontWeight: "600", color: "#64748b", marginBottom: "0.5rem" }}>Date Planifiee</label>
            <input
              type="datetime-local"
              className="pa-toolbar-input"
              style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", color: "inherit" }}
              value={missionData.scheduledTime} 
              onChange={(e) => setMissionData(p => ({ ...p, scheduledTime: e.target.value }))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}