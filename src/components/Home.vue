<template>
  <!-- //?布局容器 -->
  <el-container>
    <el-header>
      <div class="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <!-- 退出事件 -->
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menuFlag?'':'200px'">
        <!-- //?导航菜单 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          unique-opened
          router
          :collapse="menuFlag"
          :collapse-transition="false"
        >
          <!-- //?折叠条 点击事件-->
          <div
            class="toggle_bar"
            @click="menuFlag=!menuFlag"
            :style="{width:menuFlag?'':'200px'}"
          >|||</div>
          <!-- 菜单 -->
          <el-submenu
            :index="i+''"
            v-for="(v,i) in menuList"
            :key="v.id"
            :style="{width:menuFlag?'':'200px'}"
          >
            <template slot="title">
              <!-- //?遍历每一项和下标,下标用来获取对应的图标 -->
              <i :class="'iconfont icon-'+iconList[i]"></i>
              <span>{{v.authName}}</span>
            </template>
            <el-menu-item
              :index="vv.path"
              v-for="vv in v.children"
              :key="vv.id"
              :style="{width:menuFlag?'':'200px'}"
            >
              <!-- 图标和文字分别用标签包括 -->
              <i class="el-icon-menu"></i>
              <span>{{vv.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 渲染子组件 -->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 周期函数
  created() {
    this.getMenuList();
  },
  methods: {
    // 退出
    logout() {
      this.$confirm("确定要退出吗?", "退出", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 清除token,编程式导航到登录页
          window.sessionStorage.removeItem("token");
          this.$router.push("login");
        })
        .catch(() => {});
    },
    // 获取左侧列表权限
    async getMenuList() {
      const { data: dt } = await this.$http.get("/menus");
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      // 赋值
      this.menuList = dt.data;
    }
  },
  data() {
    return {
      // 接收权限列表
      menuList: [],
      // 权限图标列表
      iconList: ["users", "tijikongjian", "shangpin", "danju", "baobiao"],
      // 菜单折叠开关
      menuFlag: false
    };
  }
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    padding-left: 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo-box {
      display: flex;
      align-items: center;
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
      span {
        color: #fff;
        font-size: 22px;
        user-select: none;
        cursor: pointer;
      }
    }
    .el-button {
      height: 50px;
    }
  }
  .el-aside {
    background-color: #333744;
    user-select: none;
    cursor: pointer;
    .toggle_bar {
      height: 25px;
      line-height: 25px;
      background-color: #4a5064;
      text-align: center;
      font-size: 12px;
      color: #fff;
      letter-spacing: 0.1em;
    }
    .el-menu-item span {
      vertical-align: middle;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
