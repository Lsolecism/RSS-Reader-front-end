<script setup>
import { Edit, Orange, Search, Setting, Star, SwitchButton, User } from "@element-plus/icons-vue";
import {computed, ref} from "vue";
import { defineAsyncComponent } from 'vue';
import { useUserStore } from "@/stores/useUserStore.js";
import {useCategoryStore} from "@/stores/useCategoryStore.js";

const showRatingWindow = ref(false);
const showEditWindow = ref(false);
const showInfoWindow = ref(false);
const showExitWindow = ref(false);
const showSettingWindow = ref(false);
const showHelpWindow = ref(false);
const input = ref('');
const userStore = useUserStore();
const categoryStore = useCategoryStore()
const userCategoriesArray = computed(() =>
    Object.values(categoryStore.UserCategories) // 转换为数组
);
const emit = defineEmits(['search']); // 定义向父组件传递的事件

// 动态引入窗口组件
const RatingWindow = defineAsyncComponent(() => import('@/components/mainPage/SmallWindows/RatingWindow.vue'));
const EditWindow = defineAsyncComponent(() => import('@/components/mainPage/SmallWindows/EditWindow.vue'));
const InfoWindows = defineAsyncComponent(() => import('@/components/mainPage/SmallWindows/InfoWindows.vue'));
const ExitWindow = defineAsyncComponent(() => import('@/components/mainPage/SmallWindows/ExitWindow.vue'));
const SettingWindow = defineAsyncComponent(() => import('@/components/mainPage/SmallWindows/SettingWindow.vue'));
const HelpWindow = defineAsyncComponent(() => import('@/components/mainPage/SmallWindows/HelpWindow.vue'));

// 搜索逻辑（复用给建议列表和回车事件）
const performSearch = (query) => {
  if (!query) return [];
  const searchText = query.toLowerCase();

  return userCategoriesArray.value // 使用转换后的数组
      .flatMap(category => {
        return (category.Items || []) // 防御空值
            .filter(item =>
                (item.Title?.toLowerCase() || '').includes(searchText) ||
                (item.Description?.toLowerCase() || '').includes(searchText)
            )
            .map(item => ({
              ...item,
              categoryId: category.Id,
              categoryName: category.Name
            }));
      });
};


// 自动建议搜索
const querySearch = (queryString, cb) => {
  const results = performSearch(queryString);
  cb(results.map(item => ({ ...item, value: item.Title })));
};

// 回车事件处理
const handleEnter = () => {
  const results = performSearch(input.value);
  if (results.length > 0) {
    const categoryIds = [...new Set(results.map(item => item.categoryId))];
    console.log(categoryIds);
    emit('search', categoryIds);
  }
};

</script>

<template>
  <div class="header-container">
    <div class="left-section"></div>
    <el-autocomplete
        v-model="input"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        clearable
        :prefix-icon="Search"
        class="inline-input w-50"
        placeholder="Please Input"
        @keyup.enter.native="handleEnter"
    />
    <div class="right-section">
      <img :src="`http://localhost:5000/image/${userStore.AvatarURL}`" alt="" style="width: 50px; height: 50px; border-radius: 50%;" >
      <el-text class>{{userStore.Name}}</el-text>
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-icon class="el-icon--right" size="25px">
            <Menu />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item><el-text @click="showInfoWindow = true"><el-icon><User /></el-icon>主页</el-text></el-dropdown-item>
            <el-dropdown-item><el-text @click="showRatingWindow = true"><el-icon><Star /></el-icon>评分</el-text></el-dropdown-item>
            <el-dropdown-item><el-text @click="showEditWindow = true"><el-icon><Edit /></el-icon>编辑</el-text></el-dropdown-item>
            <el-dropdown-item><el-text @click="showSettingWindow = true"><el-icon><Setting /></el-icon>设置</el-text></el-dropdown-item>
            <el-dropdown-item><el-text @click="showHelpWindow = true"><el-icon><Orange /></el-icon>帮助</el-text></el-dropdown-item>
            <el-dropdown-item divided><el-text @click="showExitWindow = true"><el-icon><SwitchButton /></el-icon>退出</el-text></el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <RatingWindow v-model="showRatingWindow" />
  <EditWindow v-model="showEditWindow"/>
  <InfoWindows v-model="showInfoWindow" />
  <ExitWindow v-model="showExitWindow"/>
  <SettingWindow v-model="showSettingWindow"/>
  <HelpWindow v-model="showHelpWindow" />
</template>

<style scoped>
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 新增 */
}

.right-section {
  display: flex;
  align-items: center;
}
</style>
