// Common types for connection points and connections
export interface ConnectionPoint {
  id: string;
  type: 'input' | 'output';
  position: 'top' | 'right' | 'bottom' | 'left';
  connected: boolean;
  connectedTo?: string;
}

export interface Connection {
  sourceId: string;
  targetId: string;
  sourceComponentId: string;
  targetComponentId: string;
}

// Update Component interface
export interface Component {
  id?: string;
  type: string;
  props: {
    name?: string;
    text?: string;
    color?: string;
    position: {
      x: number;
      y: number;
    };
    style: Record<string, string>;
  };
  connectionPoints: ConnectionPoint[];
  connections: Connection[];
  code?: string;
}

export interface Project {
  _id: string;
  projectId: string;
  projectName: string;
  description: string;
  status: string;
  components: Component[];
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}