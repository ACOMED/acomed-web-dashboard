export function serializeTemplatePayload(nodes, edges) {
  return nodes.map(node => {
    // Find if this node is the TARGET of any edge
    const incomingEdges = edges.filter(e => e.targetNodeId === node.id);
    
    let parent_question_id = null;
    let prerequisite_condition = null;

    if (incomingEdges.length > 0) {
      const edge = incomingEdges[0]; // Assuming 1 parent for simplicity
      parent_question_id = edge.sourceNodeId;
      
      if (edge.sourceHandle === 'yes') prerequisite_condition = 'EQUALS_YES';
      else if (edge.sourceHandle === 'no') prerequisite_condition = 'EQUALS_NO';
      else prerequisite_condition = 'COMPLETED'; // Default for normal out handles
    }

    return {
      question_id: node.id,
      type: node.type,
      label: node.label,
      required: node.data?.required || false,
      reg_points: node.data?.regPoints || 0,
      mat_points: node.data?.matPoints || 0,
      trigger_capa: node.data?.triggerCapa || false,
      capa_severity: node.data?.capaSeverity || 'minor',
      parent_question_id,
      prerequisite_condition
    };
  });
}
