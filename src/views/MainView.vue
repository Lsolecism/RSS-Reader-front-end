<script setup>
import DashBoard from "@/components/mainPage/DashBoard.vue";
import Header from "@/components/mainPage/Header.vue";
import Cards from "@/components/mainPage/Cards.vue";
import { useCategoryStore } from '@/stores/useCategoryStore.js'
import { storeToRefs } from "pinia";
import { computed, ref, onMounted } from 'vue'
import {useUserStore} from "@/stores/useUserStore.js";
import router from "@/router/index.js";


const categoryStore = useCategoryStore()
const { UserCategories } = storeToRefs(categoryStore)
const Email = useUserStore().Email
// 当前选中的分类ID（'all' 表示显示全部）
const activeCategoryId = ref('all')

// 计算要显示的卡片数据
const cardsData = computed(() => {
  if (activeCategoryId.value === 'all') {
    // 合并所有分类的卡片
    return Object.values(UserCategories.value)
        .flatMap(category => category.Items)
  }
  return UserCategories.value[activeCategoryId.value]?.Items || []
})

const handleCategorySelected = (categoryId) => {
  console.log("当前分类:", categoryId)
  activeCategoryId.value = categoryId
  currentPage.value = 1
}

const handleSearch = (searchId) => {
  console.log("搜索关键词:", searchId)
  activeCategoryId.value = searchId[0]
  currentPage.value = 1
}

const handlePageChange = (page) => {
  currentPage.value = page
}

const getRssCards = () => {
  // 暂时重置所有分类，这个之后肯定是用路由守卫来进行操作
  return new Promise((resolve) => {
    Object.keys(UserCategories.value).forEach(categoryId => {
      categoryStore.removeCategory(categoryId);
    });
    fetch('http://localhost:5000/getRssCards', {
      method: 'POST',
      credentials: 'include', // 必须设置
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({Email:Email})})
        .then(response => response.json())
        .then(data =>{
          for (let i = 0; i < data["RssCards"].length; i++){
            const source = data["RssCards"][i];
            const RssUrl = source.RssUrl;
            const RssId = source["_id"];
            const categoryId = categoryStore.createCategory(source["RssName"], RssUrl)
            for (let j = 0; j < source["Articles"].length; j++) {
              const card = source["Articles"][j];
              const item = {
                Title: card["Title"],
                Description: card["Description"],
                ImageUrl: card.Content["ImageUrl"],
                Link: card["Link"],
                Published: card.Published,
                Author: card.Author,
                IsReaded: card.IsReaded,
                RssId:RssId
              };
              categoryStore.addItem(categoryId, item)
              if (!UserCategories.value[categoryId]) {}
            }
          }
        }).finally(()=>resolve())
  });
}

function getUser() {
  return new Promise((resolve) => { // 添加 Promise 包装
    fetch('http://localhost:5000/login', {
      method: 'POST',
      credentials: 'include', // 必须设置
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({action:'getUser',Email:localStorage.getItem('Email')})})
        .then(response => response.json())
        .then(data =>{
          useUserStore().setUserInfo(data.user)
        }).finally(() => resolve())
  })
}

// 初始化显示所有卡片
onMounted(async () => {
  await getUser();
  if(!useCategoryStore().HasLoaded){
    await getRssCards()
    useCategoryStore().setLoadedStatus(true)
  }
})
// 分页状态
const currentPage = ref(1)
const itemsPerPage = 6 // 每页显示的卡片数量
const paginatedCardsData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return cardsData.value.slice(start, end)
})
function sendCardLink (card) {
  useCategoryStore().setArticleIsReaded(card.Link, true)
  console.log(useCategoryStore().fullCategories)
  router.push({path: '/show', query: {Link: card.Link, RssId: card.RssId["$oid"]}});
}
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="auto">
        <DashBoard @categorySelected="handleCategorySelected" @if-all="handleCategorySelected"/>
      </el-aside>
      <el-container>
        <el-header>
          <Header @search="handleSearch"/>
        </el-header>
        <el-main class="card-flex">
          <Cards
              v-for="card in paginatedCardsData"
              :key="card.id"
              :title="card.Title"
              :description="card.Description"
              :image-src="card.ImageUrl"
              :card-link="card.Link"
              :author="card.Author"
              :published="card.Published"
              :is-readed="card.IsReaded"
              :rss-id="card.RssId"
              @click="sendCardLink(card)"
          />
        </el-main>
        <el-footer>
          <el-pagination
              :current-page="currentPage"
              :page-size="itemsPerPage"
              layout="prev, pager, next, jumper"
              :total="cardsData.length"
              @current-change="handlePageChange"
          />
        </el-footer>
      </el-container>
    </el-container>
  </div>
  <el-backtop :right="100" :bottom="100" />
</template>

<style scoped>.card-flex {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

</style>