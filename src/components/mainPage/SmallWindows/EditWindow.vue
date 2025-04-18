<template>
  <el-dialog v-model="dialogFormVisible" title="公共RSS订阅源状态一览表" width="500">
    <div v-if="RssStore.isLoading">加载中...</div>
    <div v-else-if="RssStore.error">加载失败: {{ RssStore.error }}</div>
    <div v-else>
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column prop="URL" label="RSS订阅源" align="center" min-width="200">
          <template #default="scope">
            <span class="rss-url">{{ scope.row.URL }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前状态" align="center" width="200">
          <template #default="scope">
              <span>{{scope.row['State']}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { useRssStore } from "@/stores/useRssStore.js";
import {computed, ref} from "vue";
import {ElLoading} from "element-plus";
const dialogFormVisible = ref(false);
const RssStore = useRssStore();

// 计算属性自动响应状态变化
const tableData = computed(() => RssStore.tableData);

// 打开弹窗时检查数据
const openDialog = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载订阅源数据...'
  });
  try {
    if (!RssStore.tableData.length) {
      await RssStore.initRSS();
    }
    dialogFormVisible.value = true;
  } finally {
    loading.close();
  }
};

</script>

<style scoped>


.rss-url {
  font-size: 14px;
  color: #606266;
  transition: color 0.3s;
}

.dialog-footer {
  text-align: right;
  padding-top: 10px;
}

/* 动画效果 */

</style>
