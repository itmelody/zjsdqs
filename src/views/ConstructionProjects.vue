<template>
  <div class="img-page">
    <img src="/construction-projects.png" alt="在建项目" />
    <!-- 桥梁改造提升 透明按钮覆盖层 -->
    <div class="bridge-btn" @click="showBridge = true"></div>

    <!-- 桥梁改造提升 全屏图片弹窗 -->
    <div class="overlay" v-if="showBridge">
      <img src="/bridge-projects.png" alt="桥梁改造提升" />
      <div class="back-btn" @click="showBridge = false">← 返回</div>
    </div>

    <div class="home-btn" v-if="!showBridge" @click="router.push('/cockpit')">← 返回驾驶舱</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const showBridge = ref(false)
</script>

<style scoped>
.img-page {
  width: 100vw; height: 100vh;
  background: #000; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  position: relative;
}
.img-page > img {
  width: 100%; height: 100%; object-fit: cover;
  pointer-events: none;
}

/* 桥梁改造提升 透明按钮 */
.bridge-btn {
  position: absolute;
  left: 25%; top: 5.5%;
  width: 14%; height: 4%;
  cursor: pointer;
  z-index: 10;
  background: transparent;
  transition: background 0.2s;
}
.bridge-btn:hover {
  background: rgba(91,143,249,0.15);
  border: 1px solid rgba(91,143,249,0.3);
  border-radius: 3px;
}

/* 全屏弹窗 */
.overlay {
  position: fixed; inset: 0; z-index: 100;
  background: #000;
  display: flex; align-items: center; justify-content: center;
}
.overlay img {
  width: 100%; height: 100%; object-fit: cover;
}
.back-btn, .home-btn {
  position: fixed; top: 12px; right: 20px; z-index: 200;
  padding: 6px 16px; font-size: 13px;
  color: rgba(255,255,255,0.7); background: rgba(10,22,40,0.8);
  border: 1px solid rgba(100,160,255,0.3); border-radius: 4px;
  cursor: pointer; transition: all 0.2s;
}
.back-btn:hover, .home-btn:hover { color: #fff; background: rgba(91,143,249,0.3); }
</style>
