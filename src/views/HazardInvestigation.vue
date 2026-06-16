<template>
  <div class="monitor-page">
    <div class="card">
      <div class="page-header">
        <h3>隐患排查</h3>
      </div>
      <a-empty description="隐患排查模块建设中" />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.monitor-page { display: flex; flex-direction: column; gap: 16px; }
.card { background: #fff; border-radius: 8px; padding: 24px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
.page-header { margin-bottom: 24px; h3 { margin: 0; font-size: 18px; font-weight: 500; } }
</style>
