<template>
  <div class="admin-dashboard">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="用户总数" :value="100" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="题目总数" :value="50" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="提交总数" :value="500" />
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <el-statistic title="通过总数" :value="300" />
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>系统数据</span>
            </div>
          </template>
          <el-empty description="开发中..." />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
</script>

<style scoped>
.stat-card {
  text-align: center;
}
</style>
