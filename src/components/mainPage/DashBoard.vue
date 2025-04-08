<template>
  <div>
    <img src="/src/assets/doraemon.png" alt="Logo" style="width: 50px; height: 50px; margin-left: 10px;" @click="handleAll"/>
    <el-menu
        id="menu"
        default-active=""
        class="el-menu-vertical"
    >
    <el-sub-menu v-for="category in fullCategories" :key="category.id" :index="String(category.id)" >
        <template #title>
          <span @click = "handleClick(String(category.id))">{{category.name}}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item v-for="item in category.items" :key="item.cardLink" :index="item.cardLink">
            {{ item.title }}
            <el-button type="text" @click.stop.prevent="deleteItem(item, category.id)" style="float: right; margin-left: 20px;">
              <el-icon><Delete /></el-icon>
            </el-button>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
      <img src="/src/assets/doraemon.png" alt="Logo" style="width: 50px; height: 50px; margin-left: 10px;" @click="showAddRssWindow = !showAddRssWindow"/>
    </el-menu>
  </div>
  <add-rss-window @add-rss="handleAddRss" v-model="showAddRssWindow"/>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import { Delete,} from '@element-plus/icons-vue'
import AddRssWindow from "@/components/mainPage/SmallWindows/addRssWindow.vue";
import { useCategoryStore } from "@/stores/useCategoryStore"
import {useUserStore} from "@/stores/useUserStore";
import {ElNotification} from "element-plus";

const userStore = useUserStore();
const userId = userStore.userId;
const categoryStore = useCategoryStore();
const emit = defineEmits(['categorySelected', 'ifAll']);
const showAddRssWindow = ref(false);
const fullCategories = computed(()=>categoryStore.fullCategories)

const handleAll = () => {
  emit('ifAll','all');
};

const handleAddRss = (formData: {rss_name: string, rss_address: string }) => {
  const newName = formData.rss_name;
  const newAddress = formData.rss_address;
  const categoryId = categoryStore.createCategory(newName)
  fetch('http://localhost:5000/rss', {
    method: 'POST',
    credentials: 'include', // 必须设置
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ action: 'addRss',userId:userId,categoryId:categoryId,rss_name:newName,rss_address:newAddress})})
      .then(response => response.json())
      .then(data =>{
        if (data.success === '500') {
          data.entries.forEach((entry: any) => {
            console.log(entry);
            console.log(entry.image_url);
            const newItem = {
              id: entry.published,
              title: entry.title,
              description: entry.summary,
              imageSrc: entry.image_url,
              cardLink: entry.link
            };
            console.log(newItem);
            categoryStore.addItem(categoryId, newItem);
          });
          ElNotification({
            title: 'Success',
            message: '添加成功',
            type: 'success',
          });
        }
        else{
          categoryStore.removeCategory(categoryId)
          ElNotification({
            title: 'Error',
            message: '添加失败',
            type: 'error',
          });
        }
      })
};

const deleteItem = (item: any, categoryId: any) => {
  categoryStore.removeItem(categoryId, item);
};

const handleClick = (key: string) => {
  console.log(key);
  console.log('被选择的列');
  emit('categorySelected', key);
};
</script>

<style>

</style>
