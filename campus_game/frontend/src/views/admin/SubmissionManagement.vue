<template>
  <div class="submission-management">
    <el-card>
      <el-table :data="submissions" style="width: 100%">
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="problemId" label="题目ID" width="100" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'ACCEPTED'" type="success">通过</el-tag>
            <el-tag v-else-if="row.status === 'WRONG_ANSWER'" type="warning">答案错误</el-tag>
            <el-tag v-else-if="row.status === 'COMPILE_ERROR'" type="danger">编译错误</el-tag>
            <el-tag v-else type="info">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="timeUsed" label="运行时间" width="100" />
        <el-table-column prop="createTime" label="提交时间" />
        <el-table-column label="操作" width="100">
          <template #default="{ row }">
            <el-button type="primary" link @click="viewDetail(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="loadSubmissions"
        class="pagination"
      />
    </el-card>

    <el-dialog v-model="detailVisible" title="提交详情" width="70%">
      <el-descriptions v-if="currentSubmission" :column="2" border>
        <el-descriptions-item label="提交ID">{{ currentSubmission.id }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ currentSubmission.userId }}</el-descriptions-item>
        <el-descriptions-item label="题目ID">{{ currentSubmission.problemId }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag v-if="currentSubmission.status === 'ACCEPTED'" type="success">通过</el-tag>
          <el-tag v-else type="danger">{{ currentSubmission.status }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="运行时间">{{ currentSubmission.timeUsed }}ms</el-descriptions-item>
        <el-descriptions-item label="提交时间">{{ currentSubmission.createTime }}</el-descriptions-item>
        <el-descriptions-item label="提交代码" :span="2">
          <pre class="code-preview">{{ currentSubmission.code }}</pre>
        </el-descriptions-item>
        <el-descriptions-item v-if="currentSubmission.errorMessage" label="错误信息" :span="2">
          <pre>{{ currentSubmission.errorMessage }}</pre>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAdminSubmitList } from '@/api/admin'
import { ElMessage } from 'element-plus'

const submissions = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailVisible = ref(false)
const currentSubmission = ref(null)

const loadSubmissions = async () => {
  try {
    const res = await getAdminSubmitList({
      pageNum: pageNum.value,
      pageSize: pageSize.value
    })
    submissions.value = res.data.records
    total.value = res.data.total
  } catch (e) {
    ElMessage.error('加载失败')
  }
}

const viewDetail = (row) => {
  currentSubmission.value = row
  detailVisible.value = true
}

onMounted(() => {
  loadSubmissions()
})
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  justify-content: center;
}

.code-preview {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  white-space: pre-wrap;
  max-height: 400px;
  overflow-y: auto;
}
</style>
