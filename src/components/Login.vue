<template>
  <div class="login-container">
    <!--//? 登录盒子 -->
    <div class="login-box">
      <!-- //? logo -->
      <div class="avatar-box">
        <img src="../assets/img/logo.png" alt>
      </div>
      <!-- //?表单-组件 注意,因为没有label,所以宽度设置为0-->
      <el-form ref="loginFormRef" :model="loginForm" label-width="0px" :rules="loginRules">
        <el-form-item prop="username">
          <!-- <i class="iconfont icon-user"></i> -->
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-3702mima"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- //?布局+按钮 -->
        <el-row>
          <el-col>
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetloginForm()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    // 登录事件,表单验证通过触发
    login() {
        this.$refs.loginFormRef.validate(async valid=>{
            if(valid){
                const {data:dt} = await this.$http.post('login',this.loginForm)
                console.log(dt);
                // 失败,提示
                if(dt.meta.status!==200){
                    return this.$message.error(dt.meta.msg)
                }
                // 成功,编程式导航到首页
                this.$router.push('/home')
                // ?存储token
                window.sessionStorage.setItem('token',dt.data.token)
            }
        })
    },
    // 重置表单,
    resetloginForm() {
        this.$refs.loginFormRef.resetFields()
    }
  },
  data() {
    return {
      // 表单数据对象
      loginForm: {
        username: "admin",
        password: "123456"
      },
      // 普通验证规则
      loginRules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "用户名不能为空", trigger: "blur" }
        ]
      }
    };
  }
};
</script>

<style lang="less" scoped>
.login-container {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  .login-box {
    width: 450px;
    height: 304px;
    border-radius: 4px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar-box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      // 图片不用设置大小
      padding: 8px;
      box-shadow: 0 0 10px #eee;
      background-color: #fff;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .el-form {
      width: 100%;
      position: absolute;
      bottom: 0;
      //使其居中显示,且左右距离一样
      padding: 20px;
      box-sizing: border-box;
      .el-row {
        text-align: right;
      }
    }
  }
}
</style>
