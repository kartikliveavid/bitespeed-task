import React, { useState, useCallback, useRef, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import type { Connection, Node } from 'reactflow';
import 'reactflow/dist/style.css';

import MessageNode from './components/MessageNode';
import Sidebar from './components/Sidebar';
import './index.css';

const nodeTypes = {
  messageNode: MessageNode,
};

let id = 0;
const getId = () => `node_${id++}`;

const App = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const onConnect = useCallback(
    (params: Connection) => {
      // Multiple edges allowed from source now
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      // Use screenToFlowPosition if available (React Flow 11.x+)
      const position = reactFlowInstance.screenToFlowPosition
        ? reactFlowInstance.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        })
        : reactFlowInstance.project({
          x: event.clientX - reactFlowBounds.left,
          y: event.clientY - reactFlowBounds.top,
        });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `test message ${id + 1}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onAddNode = useCallback(
    (type: string) => {
      const newNode: Node = {
        id: getId(),
        type,
        position: { x: 100, y: 100 },
        data: { label: `test message ${id + 1}` },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const onUpdateText = useCallback((id: string, text: string) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: text,
            },
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const onSave = useCallback(() => {
    if (nodes.length > 1) {
      // Check if more than one node has empty target handles
      const nodesWithEmptyTarget = nodes.filter((node) => {
        const hasIncomingEdge = edges.some((edge) => edge.target === node.id);
        return !hasIncomingEdge;
      });

      if (nodesWithEmptyTarget.length > 1) {
        showNotification('Cannot save Flow: More than one node has empty target handles', 'error');
        return;
      }
    }
    showNotification('Success: Flow saved!', 'success');
  }, [nodes, edges]);

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  return (
    <div className="app-container">
      <header className="header">
        {notification && (
          <div className={`notification ${notification.type}`}>
            {notification.message}
          </div>
        )}
        <div className="header-left">
          {/* Logo or Title could go here */}
        </div>
        <div className="header-right">
          <button className="save-button" onClick={onSave}>
            Save Changes
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="flow-container" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar
          selectedNode={selectedNode}
          onUpdateText={onUpdateText}
          onDeselect={() => setSelectedNodeId(null)}
          onAddNode={onAddNode}
        />
      </main>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <App />
  </ReactFlowProvider>
);
