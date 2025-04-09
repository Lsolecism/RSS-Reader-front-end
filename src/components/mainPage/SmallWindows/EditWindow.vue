<script setup>
import { ref} from "vue";
import { Check, Close } from '@element-plus/icons-vue'

const dialogFormVisible = defineModel()
const form = ref({
  rss_root: '',
})
const handleClick = (url) => {
  form.rss_root= url
}
const tableData = [
  {
    URL: "https://rsshub.pseudoyu.com",
    icon: Close,
  },
  {
    URL: "https://hub.slarker.me",
    icon: Close,
  },
  {
    URL: "https://rsshub.rssforever.com",
    icon: Check,
  }
]
</script>

<template>
  <el-dialog v-model="dialogFormVisible" title="编辑" width="500">
    <div>
      <el-form :model="form">
        <el-form-item label="请设置/选择你自己的RSS订阅源">
          <el-input v-model="form.rss_root" placeholder="eg:https://rsshub.app"/>
        </el-form-item>
      </el-form>
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="URL" label="URL" width="120" />
        <el-table-column prop="Online" label="Online" width="120">
          <template #default="scope">
            <el-icon :size="20">
              <component :is="scope.row.icon" />
            </el-icon>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="Operations" min-width="120">
          <template #default="scope">
            <el-button type="primary" plain size="default" @click="handleClick(scope.row.URL)">
              选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button  @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" plain @click="dialogFormVisible = false">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>