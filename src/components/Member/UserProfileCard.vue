<template>
  <div class="user-card">
    <h4>👋 歡迎回來, {{ user.name }}</h4>
    <p><strong>Email:</strong> {{ user.email }}</p>
    <p><strong>會員起始日:</strong> {{ user.memberSince }}</p>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.user-card {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.user-card h4 {
  margin-top: 0;
  color: #333;
}
</style>