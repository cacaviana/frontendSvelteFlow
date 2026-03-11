import { flowsMock } from '../mocks/flows';
import { environment } from '$lib/config/environment';
import type { Flow } from '$lib/dto/flows/types';

export class FlowsRepository {
  async list(): Promise<Flow[]> {
    if (environment.useMock) {
      return structuredClone(flowsMock);
    }
    const res = await fetch(`${environment.apiUrl}/api/flows`);
    if (!res.ok) throw new Error('Erro ao listar fluxos');
    return res.json();
  }

  async getById(id: string): Promise<Flow | null> {
    if (environment.useMock) {
      return structuredClone(flowsMock.find(f => f._id === id) || null);
    }
    const res = await fetch(`${environment.apiUrl}/api/flows/${id}`);
    if (!res.ok) throw new Error('Erro ao buscar fluxo');
    return res.json();
  }

  async getBySlug(slug: string): Promise<Flow | null> {
    if (environment.useMock) {
      return structuredClone(flowsMock.find(f => f.slug === slug) || null);
    }
    const res = await fetch(`${environment.apiUrl}/api/flows/slug/${slug}`);
    if (!res.ok) throw new Error('Erro ao buscar fluxo');
    return res.json();
  }

  async save(payload: Record<string, unknown>): Promise<Flow> {
    if (environment.useMock) {
      const flow: Flow = {
        _id: payload._id as string || crypto.randomUUID(),
        tenant_id: 'tenant_1',
        name: payload.name as string,
        slug: payload.slug as string,
        status: (payload.status as Flow['status']) || 'draft',
        version: 1,
        nodes: payload.nodes as Flow['nodes'],
        edges: payload.edges as Flow['edges'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const idx = flowsMock.findIndex(f => f._id === flow._id);
      if (idx >= 0) {
        flowsMock[idx] = flow;
      } else {
        flowsMock.push(flow);
      }
      return structuredClone(flow);
    }
    const method = payload._id ? 'PUT' : 'POST';
    const url = payload._id
      ? `${environment.apiUrl}/api/flows/${payload._id}`
      : `${environment.apiUrl}/api/flows`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Erro ao salvar fluxo');
    return res.json();
  }
}
