<template>
  <el-container>
    <el-header class="header">
      <h1>El-header</h1>
    </el-header>

    <el-container>
      <el-container class="main-container">
        <el-main class="container-item">
          <div>El-container-item 1</div>
        </el-main>
        <el-main class="container-item">
          <div>El-container-item 2</div>
        </el-main>
        <el-main class="container-item">
          <div>El-container-item 3</div>
        </el-main>
      </el-container>
    </el-container>

    <el-container>
      <el-container class="main-container">
        <el-main class="container-item">
          <div>El-container-item 1</div>
        </el-main>
      </el-container>
    </el-container>

    <el-footer class="footer">
      <h2>El-footer</h2>
    </el-footer>
  </el-container>
</template>

<script setup>
// 这里可以添加你的逻辑
</script>

<style scoped>


.main-container {
  display: flex;
  justify-content: space-around;
}

.container-item {
  flex: 1;
  margin: 10px;
  padding: 20px;
  background-color: #e0e0e0;
  text-align: center;
  border: 2px solid pink;
}


</style>
