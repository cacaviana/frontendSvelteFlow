<script lang="ts">
  import { goto } from '$app/navigation';
  import { FlowsService } from '$lib/services/flows.service';
  import type { Flow } from '$lib/dto/flows/types';
  import { onMount } from 'svelte';

  const service = new FlowsService();
  let flows = $state<Flow[]>([]);
  let loading = $state(true);

  onMount(async () => {
    flows = await service.list();
    loading = false;
  });

  function createNew() {
    goto('/admin/flows/new/edit');
  }

  const statusColors: Record<string, string> = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    archived: 'bg-gray-100 text-gray-600'
  };
</script>

<div class="min-h-screen bg-gray-50">
  <header class="bg-white border-b px-6 py-4 flex justify-between items-center">
    <div>
      <h1 class="text-xl font-bold text-gray-900">FlowQuote</h1>
      <p class="text-sm text-gray-500">Meus Fluxos</p>
    </div>
    <button
      onclick={createNew}
      class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer"
    >
      + Novo Fluxo
    </button>
  </header>

  <main class="max-w-5xl mx-auto p-6">
    {#if loading}
      <div class="text-center py-12 text-gray-500">Carregando...</div>
    {:else if flows.length === 0}
      <div class="text-center py-12">
        <p class="text-gray-500 mb-4">Nenhum fluxo criado ainda</p>
        <button
          onclick={createNew}
          class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer"
        >
          Criar primeiro fluxo
        </button>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each flows as flow}
          <button
            onclick={() => goto(`/admin/flows/${flow._id}/edit`)}
            class="bg-white rounded-lg border p-5 text-left hover:shadow-md transition-shadow cursor-pointer w-full"
          >
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-semibold text-gray-900">{flow.name}</h3>
              <span class="text-xs px-2 py-0.5 rounded-full {statusColors[flow.status]}">
                {flow.status}
              </span>
            </div>
            <p class="text-sm text-gray-500 mb-3">/q/{flow.slug}</p>
            <div class="text-xs text-gray-400">
              {flow.nodes.length} nós &middot; v{flow.version}
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </main>
</div>
