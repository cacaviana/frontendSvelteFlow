<script lang="ts">
  import { goto } from '$app/navigation';
</script>

<div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
  <div class="text-center max-w-lg">
    <h1 class="text-4xl font-bold text-gray-900 mb-2">FlowQuote</h1>
    <p class="text-gray-600 mb-8">Construtor Visual de Orçamentos com IA</p>

    <div class="flex gap-4 justify-center">
      <button
        onclick={() => goto('/admin/flows')}
        class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
      >
        Painel Admin
      </button>
      <button
        onclick={() => goto('/q/total-electrique-borne')}
        class="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors cursor-pointer"
      >
        Ver Questionário Demo
      </button>
    </div>
  </div>
</div>
