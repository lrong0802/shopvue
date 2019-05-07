<template>
  <div>
    <!-- //?面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- //?卡片 -->
    <el-card class="box-card">
      <!-- //?table表格-->
      <el-table :data="rightsList" style="width: 100%" border stripe>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column label="等级" width="120">
          <!-- //?等级使用tag标签 ,作用域插槽获取,if判断-->
          <template slot-scope="info">
            <el-tag v-if="info.row.level==0">一级</el-tag>
            <el-tag v-else-if="info.row.level==1" type="success">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRightsList();
  },
  methods: {
    // 获取所有权限
    async getRightsList() {
      const { data: dt } = await this.$http.get("rights/list");
      //   console.log(dt);
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      // ? table可以g遍历子节点children,需要修改
      dt.data.forEach(item => {
        item.son = item.children;
        delete item.children;
      });
      console.log(dt);
      //   赋值给权限列表数据
      this.rightsList = dt.data;
    }
  },
  data() {
    return {
      // 所有权限列表
      rightsList: []
    };
  }
};
</script>

<style lang="less" scoped>
</style>
