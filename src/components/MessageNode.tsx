import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { MessageSquare } from 'lucide-react';

const MessageNode = ({ data, selected }: any) => {
  return (
    <div className={`message-node ${selected ? 'selected' : ''}`}>
      <div className="node-header">
        <div className="node-header-left">
          <MessageSquare size={14} />
          <span>Send Message</span>
        </div>
        <div className="node-header-right">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="whatsapp" width="14" />
        </div>
      </div>
      <div className="node-body">
        {data.label || 'Text message'}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555' }}
      />
    </div>
  );
};

export default memo(MessageNode);
