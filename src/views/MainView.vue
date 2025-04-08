<script setup>
import DashBoard from "@/components/mainPage/DashBoard.vue";
import Header from "@/components/mainPage/Header.vue";
import Cards from "@/components/mainPage/Cards.vue";
import { useCategoryStore } from '@/stores/useCategoryStore.js'
import { storeToRefs } from "pinia";
import { computed, ref, onMounted } from 'vue'

const categoryStore = useCategoryStore()
const { userCategories } = storeToRefs(categoryStore)

// 当前选中的分类ID（'all' 表示显示全部）
const activeCategoryId = ref('all')

// 计算要显示的卡片数据
const cardsData = computed(() => {
  if (activeCategoryId.value === 'all') {
    // 合并所有分类的卡片
    return Object.values(userCategories.value)
        .flatMap(category => category.items)
  }
  return userCategories.value[activeCategoryId.value]?.items || []
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
// 初始化显示所有卡片
onMounted(() => {
  activeCategoryId.value = 'all'
})
// 分页状态
const currentPage = ref(1)
const itemsPerPage = 6 // 每页显示的卡片数量
const paginatedCardsData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return cardsData.value.slice(start, end)
})
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
              :title="card.title"
              :description="card.description"
              :image-src="card.imageSrc"
              :card-link="card.cardLink"
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