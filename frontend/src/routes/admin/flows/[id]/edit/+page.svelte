<script lang="ts">
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import {
    SvelteFlow,
    Controls,
    MiniMap,
    Background,
    BackgroundVariant,
    type NodeTypes
  } from '@xyflow/svelte';
  import type { Node, Edge, Connection } from '@xyflow/svelte';

  import StartNode from '$lib/components/builder/nodes/StartNode.svelte';
  import QuestionNode from '$lib/components/builder/nodes/QuestionNode.svelte';
  import MessageNode from '$lib/components/builder/nodes/MessageNode.svelte';
  import EndNode from '$lib/components/builder/nodes/EndNode.svelte';
  import NodeToolbar from '$lib/components/builder/panels/NodeToolbar.svelte';
  import NodeEditor from '$lib/components/builder/panels/NodeEditor.svelte';
  import { createFlowBuilderStore } from '$lib/stores/flowBuilder.svelte';
  import { FlowsService } from '$lib/services/flows.service';
  import { SaveFlowRequest } from '$lib/dto/flows/requests';
  import type { NodeType } from '$lib/dto/flows/types';

  const store = createFlowBuilderStore();
  const service = new FlowsService();
  let saving = $state(false);
  let toast = $state('');

  const nodeTypes: NodeTypes = {
    start: StartNode as any,
    question: QuestionNode as any,
    message: MessageNode as any,
    end: EndNode as any
  };

  const selectedNode = $derived(
    store.selectedNodeId ? store.nodes.find(n => n.id === store.selectedNodeId) : null
  );

  onMount(async () => {
    const id = page.params.id;
    if (id && id !== 'new') {
      const flow = await service.getById(id);
      if (flow) {
        store.loadFlow(flow);
        return;
      }
    }
    // New flow — add start node
    store.addNode('start', { x: 300, y: 50 });
    store.hasChanges = false;
  });

  function handleAddNode(type: NodeType) {
    // Place new node below the last one
    const maxY = store.nodes.reduce((max, n) => Math.max(max, n.position.y), 0);
    store.addNode(type, { x: 300, y: maxY + 180 });
  }

  function handleConnect(connection: Connection) {
    store.addEdge({
      id: '',
      source: connection.source!,
      target: connection.target!,
      sourceHandle: connection.sourceHandle || undefined,
      animated: true
    } as Edge);
  }

  function handleNodeClick({ node: clickedNode }: { node: Node }) {
    store.selectedNodeId = clickedNode.id;
  }

  function handlePaneClick() {
    store.selectedNodeId = null;
  }

  async function handleSave() {
    saving = true;
    toast = '';
    try {
      const flowData = store.getFlowData();
      const dto = new SaveFlowRequest({
        name: store.flowName,
        nodes: flowData.nodes,
        edges: flowData.edges,
        status: 'draft'
      });
      await service.save(dto);
      store.hasChanges = false;
      toast = 'Salvo!';
      setTimeout(() => toast = '', 2500);
    } catch (e: any) {
      toast = 'Erro: ' + e.message;
    } finally {
      saving = false;
    }
  }
</script>

<div class="h-screen flex flex-col bg-gray-50">
  <!-- Header -->
  <header class="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between z-10">
    <div class="flex items-center gap-3">
      <button onclick={() => goto('/admin/flows')} class="text-gray-400 hover:text-gray-700 cursor-pointer transition-colors p-1">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
      </button>
      <div class="h-5 w-px bg-gray-200"></div>
      <input
        type="text"
        bind:value={store.flowName}
        class="text-base font-semibold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none px-1 py-0.5 transition-colors"
      />
    </div>
    <div class="flex items-center gap-2.5">
      {#if toast}
        <span class="text-xs font-medium px-2.5 py-1 rounded-full {toast.startsWith('Erro') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'} transition-all">
          {toast}
        </span>
      {/if}
      {#if store.hasChanges}
        <span class="w-2 h-2 rounded-full bg-yellow-400" title="Alterações não salvas"></span>
      {/if}
      <button
        onclick={handleSave}
        disabled={saving}
        class="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition-colors"
      >
        {saving ? 'Salvando...' : 'Salvar'}
      </button>
    </div>
  </header>

  <!-- Toolbar -->
  <div class="px-4 py-2 z-10">
    <NodeToolbar onAddNode={handleAddNode} />
  </div>

  <!-- Canvas + Editor Panel -->
  <div class="flex-1 flex overflow-hidden">
    <div class="flex-1">
      <SvelteFlow
        bind:nodes={store.nodes}
        bind:edges={store.edges}
        {nodeTypes}
        onconnect={handleConnect}
        onnodeclick={handleNodeClick}
        onpaneclick={handlePaneClick}
        fitView
        colorMode="light"
        connectionMode="loose"
      >
        <Controls position="bottom-left" />
        <MiniMap position="bottom-right" />
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} />
      </SvelteFlow>
    </div>

    {#if selectedNode}
      <NodeEditor
        node={selectedNode}
        onUpdate={(data) => store.updateNodeData(selectedNode.id, data)}
        onDelete={() => store.removeNode(selectedNode.id)}
        onClose={() => store.selectedNodeId = null}
      />
    {/if}
  </div>
</div>
