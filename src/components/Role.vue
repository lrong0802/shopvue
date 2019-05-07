<template>
  <div>
    <!-- //?面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- //?编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editRoleDialog" width="50%" @close="resetEditRole()">
      <!-- <span>这是一段信息</span> -->
      <!-- //?表单信息 -->
      <el-form ref="editRoleRef" :model="editRoleForm" label-width="80px" :rules="editRoleRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- //?添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialog" width="50%" @close="resetAddRole">
      <!-- //?为了方便获取角色id值和体现当前要修改的角色,打开对话框时,显示该表单-->
      <el-form ref="addRoleRef" :model="addRoleForm" label-width="80px" :rules="addRoleRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- //?分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="distributeRightsDialog" width="50%">
      <!-- //?为了方便获取角色id值和体现当前要修改的角色,打开对话框时,显示该表单-->
      <el-form ref="distributeRightsRef" :model="distributeRightsForm" label-width="80px">
        <el-form-item label="当前角色">{{distributeRightsForm.roleName}}</el-form-item>
      </el-form>
      <!-- //?树形控件 props配置选项-->
      <el-tree
        ref="rightTree"
        :data="rightsList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="rightsCheckedList"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributeRightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="distributeRights()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- //?卡片 -->
    <el-card class="box-card">
      <el-button type="primary" @click="showAddRole()">添加角色</el-button>
      <!-- //?table表格-->
      <el-table :data="roleList" style="width: 100%" border stripe>
        <el-table-column type="expand" width="80">
          <!-- //?展开行的内容 -->
          <template slot-scope="info">
            <el-row
              v-for="(v,i) in info.row.son"
              :key="v.id"
              align="middle"
              :style="{'border-bottom':'1px solid rgb(235, 238, 245)',
                'border-top':i==0?'1px solid rgb(235, 238, 245)':''}"
            >
              <el-col :span="5">
                <el-tag closable @close="delRoleRights(info.row,v.id)">{{v.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(vv,j) in v.children"
                  :key="vv.id"
                  align="middle"
                  :style="{'border-top':j!==0?'1px solid rgb(235, 238, 245)':''}"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="delRoleRights(info.row,vv.id)"
                    >{{vv.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="vvv in vv.children"
                      :key="vvv.id"
                      @close="delRoleRights(info.row,vvv.id)"
                    >{{vvv.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
        <el-table-column label="操作" width="320">
          <!-- //?小按钮-->
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditRole(info.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delRole(info.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-delete"
              size="mini"
              @click="showDistributeRights(info.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleList();
  },
  methods: {
    // 编辑角色
    editRole() {
      this.$refs.editRoleRef.validate(async valid => {
        if (valid) {
          const { data: dt } = await this.$http.put(
            "roles/" + this.editRoleForm.id,
            this.editRoleForm
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
    resetEditRole() {
      this.$refs.editRoleRef.resetFields();
    },
    //  修改按钮点击,形参
    async showEditUser(id) {
      // 开启对话框
      this.editRoleDialog = true;
      //   根据id查询数据
      const { data: dt } = await this.$http.get("roles/" + id);
      //   console.log(dt);
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      // 赋值给表单数据对象
      this.editRoleForm = dt.data;
    },
    // 删除角色
    delRole(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "删除用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 发送请求
          const { data: dt } = await this.$http.delete("roles/" + id);
          // console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg);
          }
          this.$message.success(dt.meta.msg);
          this.getRoleList();
        })
        .catch(() => {});
    },
    // 添加角色
    addRole() {
      // ?表单验证
      this.$refs.addRoleRef.validate(async valid => {
        if (valid) {
          const { data: dt } = await this.$http.post("roles", this.addRoleForm);
          // console.log(dt);
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg);
          }
          // 提示,刷新,关闭
          this.$message.success(dt.meta.msg);
          this.addRoleDialog = false;
          this.getRoleList();
        }
      });
    },
    // 重置表单
    resetAddRole() {
      this.$refs.addRoleRef.resetFields();
    },
    // 显示添加角色
    showAddRole() {
      this.addRoleDialog = true;
    },
    // ?定义获取第三级别权限的id值的递归函数
    getHaveRights(node, arr) {
      if (node.son) {
        node.children = node.son;
      }
      // 如果是第三级别
      if (!node.children) {
        return arr.push(node.id);
      }
      // 如果不是第三级别
      node.children.forEach(item => {
        //? 注意this的使用
        this.getHaveRights(item, arr);
      });
    },
    // 分配权限
    async distributeRights() {
      // 所有选中的key
      var arr1 = this.$refs.rightTree.getCheckedKeys();
      var arr2 = this.$refs.rightTree.getHalfCheckedKeys();
      //  ?合并数组并转化
      var rids = arr1.concat(arr2).join(",");
      // 发送请求
      const { data: dt } = await this.$http.post(
        `roles/${this.distributeRightsForm.id}/rights`,
        { rids: rids }
      );
      // console.log(dt);
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      // 提示,关闭,并刷新页面,因为没有返回新的权限,不能局部刷新
      this.$message.success(dt.meta.msg);
      this.getRoleList();
      this.distributeRightsDialog = false;
    },
    // 显示分配权限对话框
    async showDistributeRights(role) {
      // console.log(role)
      this.distributeRightsDialog = true;
      const { data: dt } = await this.$http.get("rights/tree");
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      // 赋值所有的权限
      this.rightsList = dt.data;
      // role赋值给分配权限表单数据对象
      this.distributeRightsForm = role;
      // console.log(role)
      // ?赋值拥有的权限,默认选中的id数组
      var rightsIds = [];
      this.getHaveRights(role, rightsIds);
      this.rightsCheckedList = rightsIds;
    },

    // 删除tag标签权限
    delRoleRights(role, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "删除权限", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          // 请求删除
          const { data: dt } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          );
          //   console.log(dt);
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg);
          }
          //提示
          this.$message.success(dt.meta.msg);
          // ? ★新的权限赋值给role
          role.son = dt.data;
        })
        .catch(() => {});
    },
    // 获取角色列表
    async getRoleList() {
      const { data: dt } = await this.$http.get("roles");
      //   console.log(dt);
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
      // ? table可以g遍历子节点children,需要修改
      dt.data.forEach(item => {
        item.son = item.children;
        delete item.children;
      });
      //   console.log(dt);
      //   赋值给权限列表数据
      this.roleList = dt.data;
    }
  },
  data() {
    return {
      // 编辑角色规则
      editRoleRules: {
        roleName: [{ required: true, message: "角色名必填", trigger: "blur" }]
      },
      // 编辑角色
      editRoleForm: {},
      // 添加角色表单验证
      addRoleRules: {
        roleName: [{ required: true, message: "角色名必填", trigger: "blur" }]
      },
      // 添加角色数据列表
      addRoleForm: {},
      // 添加角色开关
      addRoleDialog: false,
      // 分配权限表单信息
      distributeRightsForm: {},
      // 所有权限列表
      rightsList: [],
      // 拥有权限列表
      rightsCheckedList: [],
      // 配置项
      defaultProps: {
        children: "children",
        label: "authName",
        value: "id"
      },
      // 角色列表
      roleList: [],
      //  分配权限对话框开关
      distributeRightsDialog: false
    };
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px;
}
</style>
