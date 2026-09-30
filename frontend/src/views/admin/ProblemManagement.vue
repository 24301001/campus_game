<template>
  <div class="problem-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>题目管理</span>
          <el-button type="primary" @click="openAddDialog">添加题目</el-button>
        </div>
      </template>
      <el-table :data="problems" style="width: 100%">
        <el-table-column prop="id" label="编号" width="80" />
        <el-table-column prop="title" label="题目标题" />
        <el-table-column prop="difficulty" label="难度" width="100">
          <template #default="{ row }">
            <el-tag v-if="row.difficulty === 'EASY'" type="success">简单</el-tag>
            <el-tag v-else-if="row.difficulty === 'MEDIUM'" type="warning">中等</el-tag>
            <el-tag v-else type="danger">困难</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submitCount" label="提交次数" width="100" />
        <el-table-column prop="acceptCount" label="通过次数" width="100" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="openEditDialog(row)">编辑</el-button>
            <el-button type="danger" link @click="deleteProblem(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageNum"
        v-model:page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        @current-change="loadProblems"
        class="pagination"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="80%">
      <el-form :model="problemForm" label-width="100px">
        <el-form-item label="题目标题">
          <el-input v-model="problemForm.title" />
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="problemForm.categoryId" placeholder="请选择分类">
            <el-option v-for="cat in categories" :key="cat.id" :label="cat.name" :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="难度">
          <el-select v-model="problemForm.difficulty" placeholder="请选择难度">
            <el-option label="简单" value="EASY" />
            <el-option label="中等" value="MEDIUM" />
            <el-option label="困难" value="HARD" />
          </el-select>
        </el-form-item>
        <el-form-item label="题目描述">
          <el-input v-model="problemForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="输入描述">
          <el-input v-model="problemForm.inputDescription" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="输出描述">
          <el-input v-model="problemForm.outputDescription" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="示例输入">
          <el-input v-model="problemForm.sampleInput" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="示例输出">
          <el-input v-model="problemForm.sampleOutput" type="textarea" :rows="2" />
        </el-form-item>
        <el-form-item label="模板代码">
          <el-input v-model="problemForm.templateCode" type="textarea" :rows="10" />
        </el-form-item>
        <el-form-item label="答案代码">
          <el-input v-model="problemForm.answerCode" type="textarea" :rows="10" />
        </el-form-item>
        <el-form-item label="题解">
          <el-input v-model="problemForm.solution" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProblem">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAdminProblemList, addProblem, updateProblem, deleteProblem as deleteProblemApi, getAdminCategoryList } from '@/api/admin'
import { ElMessage, ElMessageBox } from 'element-plus'

const problems = ref([])
const categories = ref([])
const pageNum = ref(1)
const pageSize = ref(10)
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)
const problemForm = ref({})

const loadProblems = async () => {
  try {
    const res = await getAdminProblemList({
      pageNum: pageNum.value,
      pageSize: pageSize.value
    })
    problems.value = res.data.records
    total.value = res.data.total
  } catch (e) {
    ElMessage.error('加载失败')
  }
}

const loadCategories = async () => {
  try {
    const res = await getAdminCategoryList({ pageNum: 1, pageSize: 100 })
    categories.value = res.data.records
  } catch (e) {
  }
}

const openAddDialog = () => {
  isEdit.value = false
  dialogTitle.value = '添加题目'
  problemForm.value = {
    title: '',
    categoryId: null,
    difficulty: 'EASY',
    description: '',
    inputDescription: '',
    outputDescription: '',
    sampleInput: '',
    sampleOutput: '',
    templateCode: '',
    answerCode: '',
    solution: ''
  }
  dialogVisible.value = true
}

const openEditDialog = (row) => {
  isEdit.value = true
  dialogTitle.value = '编辑题目'
  problemForm.value = { ...row }
  dialogVisible.value = true
}

const saveProblem = async () => {
  try {
    if (isEdit.value) {
      await updateProblem(problemForm.value)
    } else {
      await addProblem(problemForm.value)
    }
    ElMessage.success('保存成功')
    dialogVisible.value = false
    loadProblems()
  } catch (e) {
  }
}

const deleteProblem = async (row) => {
  try {
    await ElMessageBox.confirm('确定删除该题目吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await deleteProblemApi(row.id)
    ElMessage.success('删除成功')
    loadProblems()
  } catch (e) {
  }
}

onMounted(() => {
  loadProblems()
  loadCategories()
})
</script>

<style scoped>
.pagination {
  margin-top: 20px;
  justify-content: center;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
