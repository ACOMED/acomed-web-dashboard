import React, { useState, useCallback, useRef, useLayoutEffect } from "react";
import "./pre-audit-tools.css";

/* ═══════════════════════════════════════════════════════════════════
   PRE-AUDIT TOOLS: CONSTANTS & HELPERS 
   ═══════════════════════════════════════════════════════════════════ */

let _counter = 0;
const genId = () => `pnode_${Date.now()}_${++_counter}`;

// Structure exactly as requested:
// { id: 'uniq_id', title: '', description: '', answer_type: 'BOOLEAN', children: [] }
const createNode = () => ({
  id: genId(),
  title: "",
  description: "",
  answer_type: "BOOLEAN",
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
};

const TYPE_META = {
  BOOLEAN: { label: "OUI / NON", color: "#6366f1", bg: "rgba(99,102,241,0.12)" },
  TEXT: { label: "TEXTE", color: "#0ea5e9", bg: "rgba(14,165,233,0.12)" },
  PHOTO: { label: "PHOTO", color: "#f59e0b", bg: "rgba(245,158,11,0.12)" },
};

/* ═══════════════════════════════════════════════════════════════════
   FLOW NODE CARD (Recursive Component)
   ═══════════════════════════════════════════════════════════════════ */
// This component automatically syncs its data back to the central state instantly.
function FlowNode({ node, isRoot, onAddChild, onUpdate, onDelete }) {
  const meta = TYPE_META[node.answer_type] ?? TYPE_META.BOOLEAN;
  const hasChildren = node.children && node.children.length > 0;

  const portRef = useRef(null);
  const childRowRef = useRef(null);
  const [svgLines, setSvgLines] = useState([]);

  // Calculate SVG branch lines instantly (WITH INFINITE LOOP FIX)
  useLayoutEffect(() => {
    // 1. الفران الأول: إيلا ماكانوش الدراري (children)، كنحبسو الرسم بلا مانديرو حلقة مفرغة
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
      const my = sy + (ty - sy) * 0.45; // elbow drop

      calculatedLines.push({ sx, sy, mx: sx, my, tx, ty });
    });

    // 2. الفران الثاني: كنقارنو الخطوط الجداد مع القدام باش مانعاودوش نرسمو إيلا كانو بحال بحال
    setSvgLines(prev => JSON.stringify(prev) === JSON.stringify(calculatedLines) ? prev : calculatedLines);

  }, [hasChildren, node.children]); // <--- هاد جوج لعيبات هما لي كيحبسو الـ Infinite Loop

  return (
    <div className="pa-node-wrap">
      {/* 1. NODE UI CARD */}
      <div className="pa-node-card" style={{ "--node-color": meta.color }}>
        <div style={{ height: "4px", width: "100%", background: meta.color }} />

        <div className="pa-node-header">
          <span className="pa-node-badge" style={{ color: meta.color, background: meta.bg }}>
            {meta.label}
          </span>
          <button className="pa-node-del" onClick={() => onDelete(node.id)} title="Supprimer">
            <Ico.Trash style={{ width: "0.8rem", height: "0.8rem" }} />
          </button>
        </div>

        {/* 2. STRICTLY CONTROLLED AUTO-SAVING COMPONENTS */}
        <div className="pa-node-body">
          <input
            className="pa-input-title"
            value={node.title} // Auto-Syncing value
            onChange={(e) => onUpdate(node.id, { title: e.target.value })} // Instant patch
            placeholder={isRoot ? "Ex: Question de préparation principale..." : "Ex: Question de suivi optionnel..."}
          />
          <textarea
            className="pa-input-desc"
            value={node.description} // Auto-Syncing value
            onChange={(e) => onUpdate(node.id, { description: e.target.value })} // Instant patch
            placeholder="Instruction ou description nécessaire..."
            rows={2}
          />

          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: "600", color: "#64748b", marginBottom: "0.25rem" }}>
              Type de réponse attendue
            </div>
            <select
              className="pa-select-type"
              value={node.answer_type} // Auto-Syncing value
              onChange={(e) => onUpdate(node.id, { answer_type: e.target.value })} // Instant patch
              style={{ color: meta.color, borderColor: `${meta.color}55`, background: meta.bg }}
            >
              <option value="BOOLEAN">✅ OUI / NON</option>
              <option value="TEXT">📝 TEXTE</option>
              <option value="PHOTO">📷 PHOTO</option>
            </select>
          </div>
        </div>

        {/* 3. CONDITIONAL BRANCHING GENERATOR */}
        <div className="pa-node-footer">
          {node.answer_type === "BOOLEAN" ? (
            <button
              ref={portRef}
              className="pa-btn-branch"
              onClick={() => onAddChild(node.id)}
            >
              <Ico.Branch style={{ width: "0.8rem", height: "0.8rem" }} />
              + Add Conditional Follow-up
            </button>
          ) : (
            <div ref={portRef} className="pa-terminal">
              ⬤ Fin de l'étape
            </div>
          )}
        </div>
      </div>

      {/* 4. RECURSIVE VISUAL RENDERING */}
      {hasChildren && (
        <div className="pa-children-container" ref={childRowRef}>
          {/* SVG FLOW LINES WITH "⚡ IF YES" BADGE */}
          <svg className="pa-svg-overlay">
            <defs>
              <marker id="arrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                <path d="M0,0 L0,8 L8,4 z" fill="#10b981" opacity="0.8" />
              </marker>
            </defs>
            {svgLines.map((l, i) => {
              const path = `M ${l.sx} ${l.sy} C ${l.sx} ${l.my}, ${l.tx} ${l.my}, ${l.tx} ${l.ty}`;
              const lx = (l.sx + l.tx) / 2;
              const ly = (l.sy + l.ty) / 2;
              return (
                <g key={i}>
                  <path d={path} stroke="#10b981" strokeWidth="2" fill="none" strokeDasharray="6 3" opacity="0.6" markerEnd="url(#arrow)" />
                  <rect x={lx - 28} y={ly - 10} width={56} height={20} rx={10} fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.2" />
                  <text x={lx} y={ly + 4} textAnchor="middle" fontSize="9" fontWeight="800" fill="#92400e" fontFamily="Inter, sans-serif">
                    ⚡ IF YES
                  </text>
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
                  onAddChild={onAddChild} // Recursively passed down
                  onUpdate={onUpdate}     // Recursively passed down
                  onDelete={onDelete}     // Recursively passed down
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
  const [guideName, setGuideName] = useState("Guide HACCP Préparation");

  // REAL-TIME STATE SYNC BASE
  const [nodes, setNodes] = useState([]);
  const [saveStatus, setSaveStatus] = useState("idle");

  // Interaction: Adds a Root Node instantly UI re-draw 
  const handleAddRootNode = useCallback(() => {
    setNodes((prev) => [...prev, createNode()]);
  }, []);

  // Interaction: Appends a child explicitly linked to ParentID UI re-draw
  const handleAddChildNode = useCallback((parentId) => {
    setNodes((prev) => addChildToNode(prev, parentId, createNode()));
  }, []);

  // Sync: Patches any node nested at any level directly without dropping components
  const handleUpdateNode = useCallback((id, patch) => {
    setNodes((prev) => updateNodeById(prev, id, (n) => ({ ...n, ...patch })));
  }, []);

  const handleDeleteNode = useCallback((id) => {
    setNodes((prev) => deleteNodeById(prev, id));
  }, []);

  const handleSave = useCallback(async () => {
    setSaveStatus("saving");
    // Proof of nested state availability. The nodes array is 100% up-to-date and complete here.
    console.log("FINAL JSON TREE PAYLOAD ->", JSON.stringify({ guideName, nodes }, null, 2));

    setTimeout(() => {
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }, 1500);
  }, [nodes, guideName]);

  return (
    <div className="pa-builder-view">
      <div className="pa-builder-header">
        <div>
          <h1 className="pa-builder-title">
            <Ico.ClipboardCheck style={{ width: "1.5rem", height: "1.5rem", marginRight: "0.5rem", color: "#3b82f6" }} />
            Outils Pré-Audit - Workflow Builder
          </h1>
          <p className="pa-builder-subtitle">
            Synchronisation des nœuds en temps réel (Auto-Save JSON Data Tree)
          </p>
        </div>
        <button className="pa-btn-save" onClick={handleSave} disabled={saveStatus === "saving"}>
          <Ico.Save style={{ width: "0.9rem", height: "0.9rem" }} />
          {saveStatus === "saving" ? "Sauvegarde..." : "Enregistrer la Base"}
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

      <div className="pa-builder-canvas">
        {nodes.length === 0 ? (
          <div className="pa-empty-state">
            <Ico.ClipboardCheck style={{ width: "3.5rem", height: "3.5rem", opacity: 0.2 }} />
            <span>Le Workflow de préparation est vide. Ajoutez la première étape pour commencer.</span>
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
    </div>
  );
}
