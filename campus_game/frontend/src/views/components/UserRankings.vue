<template>
  <div class="user-rankings">
    <el-table :data="rankingsList" stripe style="width: 100%">
      <el-table-column prop="rank" label="排名" width="80" align="center">
        <template #default="{ row }">
          <el-badge :value="row.rank" :type="getRankType(row.rank)" class="rank-badge">
            <span>#{{ row.rank }}</span>
          </el-badge>
        </template>
      </el-table-column>
      
      <el-table-column label="用户" min-width="200">
        <template #default="{ row }">
          <div class="user-cell" @click="goToProfile(row.userId)">
            <el-avatar :size="32" :src="row.avatar || defaultAvatar" />
            <div class="user-info">
              <span class="nickname">{{ row.nickname || row.username }}</span>
              <span class="username">@{{ row.username }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column prop="score" label="积分" width="100" align="center" sortable>
        <template #default="{ row }">
          <strong style="color: #f5222d;">{{ row.score }}</strong>
        </template>
      </el-table-column>
      
      <el-table-column prop="acceptedProblems" label="通过题数" width="120" align="center" sortable>
        <template #default="{ row }">
          <span>{{ row.acceptedProblems || 0 }}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-wrapper" v-if="total > pageSize">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="prev, pager, next"
        @current-change="loadRankings"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRankings } from '@/api/profile'

const emit = defineEmits(['close'])
const router = useRouter()

const rankingsList = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

const defaultAvatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

const getRankType = (rank) => {
  if (rank === 1) return 'danger'
  if (rank === 2) return 'warning'
  if (rank === 3) return ''
  return 'info'
}

const loadRankings = async () => {
  try {
    const res = await getRankings(currentPage.value, pageSize.value)
    if (res.code === 200 && res.data?.list) {
      rankingsList.value = res.data.list
    }
  } catch (e) {
    console.error(e)
  }
}

const goToProfile = (userId) => {
  router.push('/profile/' + userId)
  emit('close')
}

onMounted(() => {
  loadRankings()
})
</script>

<style scoped>
.user-rankings {
  max-height: 60vh;
  overflow-y: auto;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 4px 0;
  transition: opacity 0.2s;
}

.user-cell:hover {
  opacity: 0.8;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.nickname {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.username {
  font-size: 12px;
  color: #999;
}

.rank-badge :deep(.el-badge__content) {
  font-weight: bold;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>