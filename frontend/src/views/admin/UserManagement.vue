<template>
  <div class="user-management">
    <el-card>
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="id" label="用户ID" width="100" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="nickname" label="昵称" width="120" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.role === 'ADMIN'" type="danger">管理员</el-tag>
            <el-tag v-else type="info">普通用户</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.status === 1" type="success">启用</el-tag>
            <el-tag v-else type="danger">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalProblems" label="总提交" width="100" />
        <el-table-column prop="acceptedProblems" label="通过数" width="100" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button v-if="row.role !== 'ADMIN'" type="warning" link @click="toggleStatus(row)">
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="loadUsers"
        class="pagination"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAdminUserList, updateUserStatus } from '@/api/admin'
import { ElMessage, ElMessageBox } from 'element-plus'

const users = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)

const loadUsers = async () => {
  try {
    const res = await getAdminUserList({
      pageNum: pageNum.value,
      pageSize: pageSize.value
    })
    users.value = res.data.records
    total.value = res.data.total
  } catch (e) {
    ElMessage.error('加载失败')
  }
}

const toggleStatus = async (row) => {
  const newStatus = row.status === 1 ? 0 : 1
  const text = newStatus === 1 ? '启用' : '禁用'
  try {
    await ElMessageBox.confirm(`确定${text}该用户吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await updateUserStatus(row.id, newStatus)
    ElMessage.success(`${text}成功`)
    loadUsers()
  } catch (e) {
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  justify-content: center;
}
</style>
