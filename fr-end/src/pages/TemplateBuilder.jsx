import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { api } from '../services/api';
import { serializeTemplatePayload } from '../utils/templateSerializer';

// Removed TemplateStore in favor of backend API

const NODE_TYPES = [
  { type: 'text',      icon: 'T', label: 'Text Input',       color: '#4a6fa5' },
  { type: 'boolean',   icon: 'B', label: 'Boolean (Yes/No)', color: '#3aad6e' },
  { type: 'camera',    icon: 'C', label: 'Camera/Photo',     color: '#d08a22' },
  { type: 'signature', icon: 'S', label: 'Signature',        color: '#e05c6e' },
];

const Toggle = ({ checked, onChange }) => (
  <div 
    onClick={() => onChange(!checked)}
    style={{
      width: '36px', height: '20px', borderRadius: '10px', 
      background: checked ? '#10B981' : '#d6dce6', 
      position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
    }}
  >
    <div style={{
      width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
      position: 'absolute', top: '2px', left: checked ? '18px' : '2px',
      transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
    }} />
  </div>
);

export default function TemplateBuilder() {
  const canvasRef = useRef(null);
  const svgRef   = useRef(null);
  const [nodes, setNodes]           = useState([]);
  const [edges, setEdges]           = useState([]);
  const [edgePaths, setEdgePaths]   = useState([]); // computed AFTER DOM commits
  const [selected, setSelected]     = useState(null);
  const [zoom, setZoom]             = useState(1);
  const [connecting, setConnecting] = useState(null);
  const [mousePos, setMousePos]     = useState({ x: 0, y: 0 });
  const [saveModal, setSaveModal]   = useState(false);
  const [tplName, setTplName]       = useState('');
  const [tplDesc, setTplDesc]       = useState('');
  const [savedMsg, setSavedMsg]     = useState('');
  const [savedTemplates, setSavedTemplates] = useState([]);
  const nodeCounter = useRef(0);
  const dragging = useRef(null);

  useEffect(() => {
    api.getTemplates()
      .then(res => { if (res.success && res.data) setSavedTemplates(res.data); })
      .catch(() => {});
  }, []);

  /* ── helpers: positions in UNSCALED logical space (same as index.html) ── */
  const getHandlePos = useCallback((nodeId, handle) => {
    const el = document.querySelector(`[data-nodeid="${nodeId}"] [data-handle="${handle}"]`);
    if (!el || !canvasRef.current) return null;
    const cr = canvasRef.current.getBoundingClientRect(); // canvas origin
    const hr = el.getBoundingClientRect();
    // divide by zoom → convert scaled DOM px back to logical px (same as original index.html)
    return {
      x: (hr.left - cr.left + hr.width  / 2) / zoom,
      y: (hr.top  - cr.top  + hr.height / 2) / zoom,
    };
  }, [zoom]);

  /* ── recompute edge SVG paths AFTER every DOM commit (nodes moved / zoom changed) ── */
  useLayoutEffect(() => {
    const paths = edges.map(edge => {
      const sp = getHandlePos(edge.sourceNodeId, edge.sourceHandle);
      const tp = getHandlePos(edge.targetNodeId, edge.targetHandle);
      return sp && tp ? { id: edge.id, sp, tp, sourceHandle: edge.sourceHandle } : null;
    }).filter(Boolean);
    setEdgePaths(paths);
  }, [nodes, edges, zoom, getHandlePos]);

  const drawCurve = (p1, p2) => {
    const dx = Math.abs(p2.x - p1.x) * 0.5;
    return `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
  };

  /* ── drop from palette ── */
  const onDrop = (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('nodeType');
    if (!type || !canvasRef.current) return;
    const cr = canvasRef.current.getBoundingClientRect();
    const nt = NODE_TYPES.find(n => n.type === type);
    nodeCounter.current++;
    setNodes(prev => [...prev, {
      id: `node_${nodeCounter.current}`,
      type, color: nt.color,
      label: `New ${nt.label}`,
      x: (e.clientX - cr.left) / zoom - 80,
      y: (e.clientY - cr.top)  / zoom - 40,
      data: { required: false, regPoints: 0, matPoints: 0, triggerCapa: false, capaSeverity: 'Low' }
    }]);
  };

  /* ── drag nodes ── */
  const onNodeHeadMouseDown = (e, nodeId) => {
    if (e.target.classList.contains('nb-node-delete')) return;
    e.stopPropagation();
    setSelected(nodeId);
    const node = nodes.find(n => n.id === nodeId);
    dragging.current = { nodeId, startX: e.clientX, startY: e.clientY, initX: node.x, initY: node.y };
  };

  /* ── start connection from output handle ── */
  const onHandleMouseDown = (e, nodeId, handle, isOutput) => {
    if (!isOutput) return;
    e.stopPropagation();
    e.preventDefault();
    const el = e.currentTarget;
    const cr = canvasRef.current.getBoundingClientRect(); // use canvas as reference
    const hr = el.getBoundingClientRect();
    setConnecting({
      sourceNodeId: nodeId,
      sourceHandle: handle,
      startPos: {
        x: (hr.left - cr.left + hr.width  / 2) / zoom, // logical coords
        y: (hr.top  - cr.top  + hr.height / 2) / zoom,
      }
    });
  };

  /* ── global mouse move / up ── */
  useEffect(() => {
    const onMove = (e) => {
      if (dragging.current) {
        const { nodeId, startX, startY, initX, initY } = dragging.current;
        setNodes(prev => prev.map(n => n.id === nodeId
          ? { ...n, x: initX + (e.clientX - startX) / zoom, y: initY + (e.clientY - startY) / zoom }
          : n));
      }
      if (connecting && canvasRef.current) {
        const cr = canvasRef.current.getBoundingClientRect(); // same reference as edge paths
        setMousePos({ x: (e.clientX - cr.left) / zoom, y: (e.clientY - cr.top) / zoom });
      }
    };
    const onUp = (e) => {
      dragging.current = null;
      if (connecting) {
        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (target && target.classList.contains('nb-handle') && target.classList.contains('input')) {
          const targetNodeId = target.closest('[data-nodeid]')?.dataset.nodeid;
          const targetHandle = target.dataset.handle;
          if (targetNodeId && targetNodeId !== connecting.sourceNodeId) {
            setEdges(prev => [...prev, {
              id: `e-${Date.now()}`,
              sourceNodeId: connecting.sourceNodeId,
              sourceHandle: connecting.sourceHandle,
              targetNodeId,
              targetHandle,
            }]);
          }
        }
        setConnecting(null);
      }
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [connecting, zoom]);

  /* ── delete node ── */
  const deleteNode = (nodeId) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.sourceNodeId !== nodeId && e.targetNodeId !== nodeId));
    if (selected === nodeId) setSelected(null);
  };

  const updateLabel = (nodeId, val) => setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, label: val } : n));
  const updateNodeData = (nodeId, key, val) => {
    setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, data: { ...n.data, [key]: val } } : n));
  };
  const selectedNode = nodes.find(n => n.id === selected);

  /* ── save ── */
  const handleSave = async () => {
    if (!tplName.trim()) return;
    const questions = serializeTemplatePayload(nodes, edges);
    const tpl = { 
      name: tplName, 
      description: tplDesc, 
      code: `TPL-${Date.now()}`, 
      schema: { questions, visual: { nodes, edges } } 
    };
    setSaveModal(false);
    
    try { 
      const res = await api.saveTemplate({ name: tpl.name, code: tpl.code, schema: tpl.schema }); 
      if (res.success && res.data) {
        setSavedTemplates(prev => [...prev, res.data]);
        setSavedMsg(`"${tplName}" saved!`);
        setTimeout(() => setSavedMsg(''), 3000);
      }
    } catch {}
  };

  /* ── edge label & color ── */
  const edgeStyle = (handle) => {
    if (handle === 'yes') return { stroke: '#3aad6e', label: 'Yes → In' };
    if (handle === 'no')  return { stroke: '#e05c6e', label: 'No → In' };
    return { stroke: '#4a6fa5', label: 'Out → In' };
  };

  return (
    <div className="dashboard builder-mode">
      <div className="nb-shell">

        {/* ── Palette ── */}
        <div className="nb-palette">
          <h4 className="nb-palette-title">Nodes</h4>
          {NODE_TYPES.map(({ type, icon, label, color }) => (
            <div key={type} className="nb-node-chip" draggable onDragStart={(e) => e.dataTransfer.setData('nodeType', type)}>
              <div className="chip-icon" style={{ color }}>{icon}</div> {label}
            </div>
          ))}
          {savedMsg && (
            <div style={{ marginTop: '12px', background: '#eefbee', border: '1px solid #3aad6e', borderRadius: '8px', padding: '8px 10px', fontSize: '11px', color: '#206848' }}>✓ {savedMsg}</div>
          )}
          {savedTemplates.length > 0 && (
            <>
              <h4 className="nb-palette-title" style={{ marginTop: '20px' }}>Saved</h4>
              {savedTemplates.map((t, i) => (
                <div key={i} style={{ background: '#f5f8fd', border: '1px solid #d6dce6', borderRadius: '8px', padding: '8px', marginBottom: '6px', fontSize: '11px', cursor: 'pointer' }}
                  onClick={() => { 
                    const nodesToLoad = t.schema?.visual?.nodes || t.schema?.nodes || [];
                    const edgesToLoad = t.schema?.visual?.edges || t.schema?.edges || [];
                    setNodes(nodesToLoad); 
                    setEdges(edgesToLoad); 
                    setSelected(null); 
                  }}>
                  <div style={{ fontWeight: 700, color: '#121319' }}>{t.name}</div>
                  <div style={{ color: '#88a8d4', marginTop: '2px' }}>{new Date(t.created_at || Date.now()).toLocaleDateString()}</div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* ── Canvas wrap ── */}
        <div className="nb-canvas-wrap" id="nbCanvas">

          {/* Nodes canvas */}
          <div
            className="nb-canvas"
            id="canvasArea"
            ref={canvasRef}
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => setSelected(null)}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ transform: `scale(${zoom})`, transformOrigin: '0 0', position: 'absolute', width: '100%', height: '100%' }}>
              {nodes.length === 0 && (
                <div className="nb-canvas-hint">
                  <svg viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                  Drag and drop nodes here to build your template
                </div>
              )}
              {nodes.map(node => {
                const isBoolean = node.type === 'boolean';
                return (
                  <div
                    key={node.id}
                    className={`nb-node${selected === node.id ? ' selected' : ''}`}
                    data-nodeid={node.id}
                    style={{ left: node.x, top: node.y, position: 'absolute', borderTop: `3px solid ${node.color}` }}
                    onClick={(e) => { e.stopPropagation(); setSelected(node.id); }}
                  >
                    {/* Head */}
                    <div className="nb-node-head" onMouseDown={(e) => onNodeHeadMouseDown(e, node.id)} style={{ cursor: 'grab' }}>
                      <div className="nb-node-head-icon" style={{ color: node.color, background: 'rgba(18,19,25,0.06)' }}>
                        {NODE_TYPES.find(t => t.type === node.type)?.icon}
                      </div>
                      <div className="nb-node-label">{node.label}</div>
                      <button className="nb-node-delete" onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}>&times;</button>
                    </div>
                    {/* Body */}
                    <div className="nb-node-body">
                      <div className="nb-node-field">Label</div>
                      <input
                        type="text"
                        className="nb-node-input"
                        value={node.label}
                        onChange={(e) => updateLabel(node.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                      />
                    </div>
                    {/* Handles */}
                    <div className="nb-handles">
                      {/* Input handle (left) */}
                      <div
                        className="nb-handle input"
                        data-handle="in"
                        onMouseDown={(e) => { e.stopPropagation(); onHandleMouseDown(e, node.id, 'in', false); }}
                      >
                        <div className="nb-handle-label" style={{ top: '-14px' }}>In</div>
                      </div>
                      {/* Output handle(s) (right) */}
                      {isBoolean ? (
                        <div style={{ display: 'flex', gap: '14px' }}>
                          <div className="nb-handle output" data-handle="yes" onMouseDown={(e) => { e.stopPropagation(); onHandleMouseDown(e, node.id, 'yes', true); }}>
                            <div className="nb-handle-label" style={{ top: '-14px' }}>Yes</div>
                          </div>
                          <div className="nb-handle output" data-handle="no" onMouseDown={(e) => { e.stopPropagation(); onHandleMouseDown(e, node.id, 'no', true); }}>
                            <div className="nb-handle-label" style={{ top: '-14px', color: '#e05c6e' }}>No</div>
                          </div>
                        </div>
                      ) : (
                        <div className="nb-handle output" data-handle="out" onMouseDown={(e) => { e.stopPropagation(); onHandleMouseDown(e, node.id, 'out', true); }}>
                          <div className="nb-handle-label" style={{ top: '-14px' }}>Out</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SVG edges overlay — scaled the same as canvas, so coords are in logical (unscaled) space */}
          <svg
            ref={svgRef}
            style={{
              position: 'absolute', top: 0, left: 0,
              width: '100%', height: '100%',
              pointerEvents: 'none', zIndex: 2,
              transform: `scale(${zoom})`,
              transformOrigin: '0 0',
              overflow: 'visible',
            }}
          >
            {/* Committed edges — rendered from edgePaths computed after DOM commit */}
            {edgePaths.map(({ id, sp, tp, sourceHandle }) => {
              const { stroke, label } = edgeStyle(sourceHandle);
              const mx = (sp.x + tp.x) / 2;
              const my = (sp.y + tp.y) / 2;
              return (
                <g key={id}>
                  <path d={drawCurve(sp, tp)} stroke={stroke} strokeWidth="2" fill="none" />
                  <text x={mx} y={my - 6} fill="#5c5d66" fontSize="10" fontWeight="600" textAnchor="middle">{label}</text>
                </g>
              );
            })}
            {/* Temporary connection line while dragging */}
            {connecting && connecting.startPos && (
              <path
                d={drawCurve(connecting.startPos, mousePos)}
                stroke="#7a8499"
                strokeWidth="2"
                strokeDasharray="5,5"
                fill="none"
              />
            )}
          </svg>

          {/* Toolbar */}
          <div className="nb-toolbar">
            <button className="nb-tool-btn" onClick={() => setZoom(z => Math.max(0.5, +(z - 0.1).toFixed(1)))}>-</button>
            <span className="nb-tool-btn" style={{ pointerEvents: 'none' }}>{Math.round(zoom * 100)}%</span>
            <button className="nb-tool-btn" onClick={() => setZoom(z => Math.min(2, +(z + 0.1).toFixed(1)))}>+</button>
            <button className="nb-tool-btn" onClick={() => setSaveModal(true)} style={{ background: '#4a6fa5', color: '#fff', borderColor: '#4a6fa5', fontWeight: 700 }}>Save JSON</button>
            <button className="nb-tool-btn" onClick={() => setZoom(1)}>Reset</button>
          </div>
        </div>

        {/* ── Properties sidebar ── */}
        <div className="nb-properties" style={{ background: '#fff', borderLeft: '1px solid #d6dce6', display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
          {!selectedNode ? (
            <div style={{ margin: 'auto', color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '20px' }}>
              Select a node to view properties.
            </div>
          ) : (
            <div style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#334155', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Properties</h3>
              
              {/* SECTION A: General Settings */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '14px', textTransform: 'uppercase' }}>General Settings</h4>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#334155', marginBottom: '6px', fontWeight: 500 }}>Node Label</label>
                  <input 
                    type="text" 
                    value={selectedNode.label} 
                    onChange={e => updateLabel(selectedNode.id, e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '13px', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = '#10B981'}
                    onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <label style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>Required Question</label>
                  <Toggle 
                    checked={selectedNode.data?.required || false} 
                    onChange={val => updateNodeData(selectedNode.id, 'required', val)} 
                  />
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }} />

              {/* SECTION B: Double Scoring Engine */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>Double Scoring Engine</h4>
                <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '16px', lineHeight: 1.4 }}>These points are aggregated for the final audit compliance and maturity scores.</p>
                
                <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#334155', marginBottom: '6px', fontWeight: 500 }}>Reg. Points</label>
                    <input 
                      type="number" min="0" max="5" 
                      value={selectedNode.data?.regPoints ?? 0} 
                      onChange={e => updateNodeData(selectedNode.id, 'regPoints', parseInt(e.target.value) || 0)}
                      style={{ width: '100%', padding: '8px 10px', fontSize: '13px', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#10B981'}
                      onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#334155', marginBottom: '6px', fontWeight: 500 }}>Mat. Points</label>
                    <input 
                      type="number" min="0" max="5" 
                      value={selectedNode.data?.matPoints ?? 0} 
                      onChange={e => updateNodeData(selectedNode.id, 'matPoints', parseInt(e.target.value) || 0)}
                      style={{ width: '100%', padding: '8px 10px', fontSize: '13px', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', transition: 'border-color 0.2s' }}
                      onFocus={e => e.target.style.borderColor = '#10B981'}
                      onBlur={e => e.target.style.borderColor = '#cbd5e1'}
                    />
                  </div>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '24px 0' }} />

              {/* SECTION C: Quality & Safety */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '16px', textTransform: 'uppercase' }}>Quality & Safety (CAPA)</h4>
                
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <label style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>Trigger CAPA Action</label>
                  <Toggle 
                    checked={selectedNode.data?.triggerCapa || false} 
                    onChange={val => updateNodeData(selectedNode.id, 'triggerCapa', val)} 
                  />
                </div>

                {(selectedNode.data?.triggerCapa) && (
                  <div style={{ marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ display: 'block', fontSize: '11px', color: '#334155', marginBottom: '8px', fontWeight: 600 }}>CAPA Severity Level</label>
                    <select 
                      value={selectedNode.data?.capaSeverity || 'Low'} 
                      onChange={e => updateNodeData(selectedNode.id, 'capaSeverity', e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', fontSize: '13px', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', background: '#fff', cursor: 'pointer' }}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Save Modal */}
      {saveModal && (
        <div className="modal-overlay open">
          <div className="modal-box">
            <div className="modal-head">
              <h3>Save Template</h3>
              <button className="modal-close" onClick={() => setSaveModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Template Name <span style={{ color: '#e05c6e' }}>*</span></label>
                <input type="text" className="form-control" placeholder="e.g. ISO 9001 Standard Audit" value={tplName} onChange={e => setTplName(e.target.value)} autoFocus />
              </div>
              <div className="form-group" style={{ marginTop: '12px' }}>
                <label>Description</label>
                <input type="text" className="form-control" placeholder="Short description (optional)" value={tplDesc} onChange={e => setTplDesc(e.target.value)} />
              </div>
              <div style={{ marginTop: '12px', padding: '10px', background: '#f5f8fd', borderRadius: '8px', fontSize: '11px', color: '#5c5d66' }}>
                <strong>{nodes.length} node{nodes.length !== 1 ? 's' : ''}</strong>, <strong>{edges.length} connection{edges.length !== 1 ? 's' : ''}</strong> will be saved as JSON.
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn" onClick={() => setSaveModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={!tplName.trim()} style={{ opacity: tplName.trim() ? 1 : 0.5 }}>Save Template</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
