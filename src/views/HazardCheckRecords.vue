<template>
  <div class="hazard-page">
    <div class="card">
      <div class="page-header"><h3>检查记录</h3></div>
      <a-empty description="检查记录模块建设中" />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.hazard-page { display: flex; flex-direction: column; gap: 16px; }
.card { background: #fff; border-radius: 8px; padding: 24px; box-shadow: 0 1px 2px rgba(0,0,0,0.03); }
.page-header { margin-bottom: 24px; h3 { margin: 0; font-size: 18px; font-weight: 500; } }
</style>
