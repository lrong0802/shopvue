<template>
  <div>
    <!-- //?面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- //?分配角色对话框 -->
    <el-dialog title="分配角色" :visible.sync="setRoleDialog" width="50%" @close="resetSetRole()">
      <!-- //?表单信息 -->
      <el-form ref="setRoleRef" :model="setRoleForm" label-width="100px" :rules="setRoleRules">
        <el-form-item label="当前用户">{{setRoleForm.username}}</el-form-item>
        <el-form-item label="当前角色">{{setRoleForm.role_name}}</el-form-item>
        <el-form-item label="分配新角色" prop="rid">
          <!-- //?下拉列表 -->
          <el-select v-model="setRoleForm.rid" clearable placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- //?添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addUserDialog" width="50%" @close="resetAddUser()">
      <!-- <span>这是一段信息</span> -->
      <!-- //?表单信息 -->
      <el-form ref="addUserRef" :model="addUserForm" label-width="80px" :rules="addUserRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" type="password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- //?编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editUserDialog" width="50%" @close="resetEditUser()">
      <!-- <span>这是一段信息</span> -->
      <!-- //?表单信息 -->
      <el-form ref="editUserRef" :model="editUserForm" label-width="80px" :rules="editUserRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- //?卡片 -->
    <el-card class="box-card">
      <!-- //?布局+输入框+按钮 gutter间距-->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入搜索内容"
            v-model="querycdt.query"
            clearable
            @clear="search()"
            @keyup.enter.native="search()"
          >
            <!-- //?输入框内部的button按钮 -->
            <el-button slot="append" type="info" icon="el-icon-search" @click="search()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="18">
          <el-button type="primary" @click="showAddUser()">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- //?table表格-->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column label="状态" width="120">
          <!-- //?状态使用switch开关 ,作用域插槽获取,赋值-->
          <template slot-scope="info">
            <el-switch
              v-model="info.row.mg_state"
              @change="changeStatus(info.row,info.row.mg_state)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="240">
          <!-- //?操作使用,小按钮 -->
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditUser(info.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRole(info.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- //?分页显示 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="3"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalPage"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getUserList();
  },
  methods: {
    // 重置分配角色表单
    resetSetRole() {
      this.$refs.setRoleRef.resetFields();
    },
    // 分配角色
    setRole() {
      this.$refs.setRoleRef.validate(async valid => {
        if (valid) {
          const { data: dt } = await this.$http.put(
            `users/${this.setRoleForm.id}/role`,
            { rid: this.setRoleForm.rid }
          );
          // console.log(dt);
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg);
          }
          // 关闭,提示,刷新页面
          this.setRoleDialog = false
          this.$message.success(dt.meta.msg);
          this.getUserList()
        }
      });
    },
    // 显示分配角色
    async showSetRole(user) {
      this.setRoleDialog = true;
      this.setRoleForm = user;
      // axios请求.角色数据
      const { data: dt } = await this.$http.get("roles");
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      // ? table可以g遍历子节点children,需要修改
      dt.data.forEach(item => {
        item.son = item.children;
        delete item.children;
      });
      //   赋值给权限列表数据
      this.roleList = dt.data;
    },
    // 修改数据
    editUser() {
      this.$refs.editUserRef.validate(async valid => {
        if (valid) {
          const { data: dt } = await this.$http.put(
            "users/" + this.editUserForm.id,
            this.editUserForm
          );
          //   console.log(dt);
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg);
          }
          // 关闭对话框,更新
          this.editUserDialog = false;
          this.$message.success(dt.meta.msg);
          this.getUserList();
        }
      });
    },
    // 重置修改表单
    resetEditUser() {
      this.$refs.editUserRef.resetFields();
    },
    //  修改按钮点击,形参
    async showEditUser(id) {
      // 开启对话框
      this.editUserDialog = true;
      //   根据id查询数据
      const { data: dt } = await this.$http.get("users/" + id);
      //   console.log(dt);
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      // 赋值给表单数据对象
      this.editUserForm = dt.data;
    },
    //  删除用户,形参
    delUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "删除用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送请求
          const { data: dt } = await this.$http.delete("users/" + id);
          // console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg);
          }
          //?注意,因为有分页显示,所以需要做判断,在刷新页面
          if (this.querycdt.pagenum > 1 && this.userList.length == 1) {
            this.querycdt.pagenum--;
          }
          this.getUserList();
        })
        .catch(() => {});
    },
    //  对话框关闭的回调,重置表单
    resetAddUser() {
      this.$refs.addUserRef.resetFields();
    },
    //  添加按钮点击事件
    showAddUser() {
      // 开启对话框
      this.addUserDialog = true;
    },
    // 确认提交事件
    addUser() {
      this.$refs.addUserRef.validate(async valid => {
        if (valid) {
          const { data: dt } = await this.$http.post("users", this.addUserForm);
          //   console.log(dt);
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg);
          }
          // 关闭对话框
          this.addUserDialog = false;
          // 刷新页面
          this.getUserList();
        }
      });
    },
    // 搜索事件
    search() {
      this.getUserList();
    },
    //  状态修改
    async changeStatus(user, state) {
      const { data: dt } = await this.$http.put(
        `users/${user.id}/state/${state}`
      );
      //   console.log(dt);
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      // console.log(user);
      // 提示
      this.$message.success(dt.meta.msg);
    },
    //  分页相关设置改变事件
    handleSizeChange(val) {
      //? 当前值赋值给参数,重新请求
      this.querycdt.pagesize = val;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.querycdt.pagenum = val;
      this.getUserList();
    },
    // 获取用户数据列表
    async getUserList() {
      const { data: dt } = await this.$http.get("users", {
        params: this.querycdt
      });
      //   console.log(dt);
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      // 赋值
      this.userList = dt.data.users;
      this.totalPage = dt.data.total;
    }
  },
  data() {
    // ?手机号自定义验证,函数表达式
    var checkMobile = (rule, value, callback) => {
      if (!/^1[35789]\d{9}$/.test(value)) {
        return callback(new Error("手机号码格式错误"));
      }
      callback();
    };

    return {
      // 接收角色数据
      roleList: [],
      // 分配角色开关
      setRoleDialog: false,
      // 分配角色表单数据对象
      setRoleForm: {
        //?根据api接口
        rid: 0
      },
      // 分配角色表单验证
      setRoleRules: {
        rid: [{ required: true, message: "新角色必选", trigger: "change" }]
      },
      // 编辑用户对话框开关
      editUserDialog: false,
      // 编辑用户表单数据对象
      editUserForm: {
        email: "",
        mobile: ""
      },
      // 修改表单验证规则
      editUserRules: {
        email: [{ required: true, message: "邮箱必填", trigger: "blur" }],
        mobile: [
          { required: true, message: "手机号必填", trigger: "blur" },
          //? 自定义验证应用
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 添加用户表单验证规则
      addUserRules: {
        username: [{ required: true, message: "用户名必填", trigger: "blur" }],
        password: [{ required: true, message: "密码必填", trigger: "blur" }],
        email: [{ required: true, message: "邮箱必填", trigger: "blur" }],
        mobile: [
          { required: true, message: "手机号必填", trigger: "blur" },
          //? 自定义验证应用
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      // 添加用户表单数据对象
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 添加用户对话框开关
      addUserDialog: false,
      // 接收用户数据
      userList: [],
      // 查询参数 数据对象
      querycdt: {
        query: "",
        pagenum: 1,
        pagesize: 3
      },
      //  总页数
      totalPage: 0
    };
  }
};
</script>

<style lang="less" scoped>
</style>
