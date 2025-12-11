<template>
  <div class="TheBookOfAnswersDivination">
    <h1>雷雨師​一百籤</h1>
    <p>Coming soon...</p>
    <router-link to="/">回到首頁</router-link>
  </div>
</template>

<style scoped>
.TheBookOfAnswersDivination {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1a1a2e;
  color: #e0e0e0;
  font-family: 'Microsoft JhengHei', 'Heiti TC', sans-serif;
}

h1 {
  font-size: 3rem;
  color: #f0e6ff;
}

p {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

a {
  color: #c0b4f0;
  text-decoration: none;
  font-size: 1.2rem;
  border: 1px solid #c0b4f0;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  transition: background-color 0.3s, color 0.3s;
}

a:hover {
  background-color: #c0b4f0;
  color: #1a1a2e;
}
</style>