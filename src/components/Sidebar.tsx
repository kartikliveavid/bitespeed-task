import React from 'react';
import { MessageSquare, ArrowLeft, Plus } from 'lucide-react';

interface SidebarProps {
    selectedNode: any;
    onUpdateText: (id: string, text: string) => void;
    onDeselect: () => void;
    onAddNode: (type: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedNode, onUpdateText, onDeselect, onAddNode }) => {
    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-container" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Components Section - Always Visible */}
                <div className="nodes-panel" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
                    <div className="section-title" style={{ marginBottom: '15px', fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Nodes Library
                    </div>
                    <div
                        className="dnd-node"
                        onDragStart={(event) => onDragStart(event, 'messageNode')}
                        onClick={() => onAddNode('messageNode')}
                        draggable
                        title="Drag or click to add a message node"
                    >
                        <MessageSquare size={28} strokeWidth={2} />
                        <span style={{ fontSize: '14px', fontWeight: 600 }}>Message</span>
                        <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>Click or Drag</div>
                    </div>
                </div>

                {/* Settings Section - Conditional but takes space nicely */}
                <div className="settings-container" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {selectedNode ? (
                        <div className="settings-panel" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <div className="panel-header" style={{ background: '#f8fafc' }}>
                                <button className="back-button" onClick={onDeselect} title="Close Settings">
                                    <ArrowLeft size={18} />
                                </button>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 600 }}>Node Settings</span>
                                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>ID: {selectedNode.id}</span>
                                </div>
                            </div>
                            <div className="panel-body" style={{ flex: 1, overflowY: 'auto' }}>
                                <div className="input-group">
                                    <label style={{ fontSize: '11px' }}>Message Text</label>
                                    <textarea
                                        placeholder="Type your message here..."
                                        value={selectedNode.data.label}
                                        onChange={(e) => onUpdateText(selectedNode.id, e.target.value)}
                                        style={{ minHeight: '150px' }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Plus size={20} />
                                </div>
                                <span style={{ fontSize: '13px' }}>Select a node on the canvas to edit its properties</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
