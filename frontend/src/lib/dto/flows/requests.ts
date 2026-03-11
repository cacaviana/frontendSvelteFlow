import type { FlowNode, FlowEdge } from './types';

export class SaveFlowRequest {
  private name: string;
  private slug: string;
  private nodes: FlowNode[];
  private edges: FlowEdge[];
  private status: string;

  constructor(data: { name: string; slug?: string; nodes: FlowNode[]; edges: FlowEdge[]; status?: string }) {
    this.name = data.name || '';
    this.slug = data.slug || data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    this.nodes = data.nodes || [];
    this.edges = data.edges || [];
    this.status = data.status || 'draft';
    if (!this.name.trim()) throw new Error('Nome do fluxo é obrigatório');
  }

  isValid(): boolean {
    return this.name.trim() !== '' && this.nodes.length > 0;
  }

  toPayload() {
    return {
      name: this.name,
      slug: this.slug,
      nodes: this.nodes,
      edges: this.edges,
      status: this.status
    };
  }

  getName() { return this.name; }
  getSlug() { return this.slug; }
}
