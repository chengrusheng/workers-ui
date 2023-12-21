<template>
  <el-main>
    <!-- 查询条件 -->
    <el-form
      :model="searchModel"
      ref="searchForm"
      label-width="80px"
      :inline="true"
      size="small"
    >
      <el-form-item>
        <el-input v-model="searchModel.empName" placeholder="请输入姓名"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchModel.deptName" placeholder="请选择部门">
          <el-option
            v-for="item in deptOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchModel.empDegreeName" placeholder="请选择学历">
          <el-option
            v-for="item in empDegreeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search"
                   @click="search(pageNo,pageSize)">查询
        </el-button>
        <el-button icon="el-icon-refresh-right" @click="resetValue">重置</el-button>
        <el-button type="success" icon="el-icon-plus" @click="openAddWindow">新增</el-button>
        <el-button type="success" icon="el-icon-download" @click="exportData">导出</el-button>
      </el-form-item>
    </el-form>
    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="workerList"
      :height="tableHeight"
      border
      stripe
      style="width: 100%; margin-bottom: 10px"
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="60">
      </el-table-column>
      <el-table-column prop="empName" label="职工姓名"></el-table-column>
      <el-table-column prop="sex" label="性别"></el-table-column>
      <el-table-column prop="age" label="年龄"></el-table-column>
      <el-table-column prop="deptName" label="部门名称"></el-table-column>
      <el-table-column prop="empDegreeName" label="学历"></el-table-column>
      <el-table-column label="操作" align="center" width="290">
        <template slot-scope="scope">
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
          >编辑
          </el-button>
          <el-button
            icon="el-icon-delete"
            type="danger"
            size="small"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页工具栏 -->
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNo"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 添加和修改职工窗口 -->
    <system-dialog
      :title="workerDialog.title"
      :visible="workerDialog.visible"
      :width="workerDialog.width"
      :height="workerDialog.height"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          :model="worker"
          ref="workerForm"
          :rules="rules"
          label-width="80px"
          :inline="false"
          size="small"
        >
          <el-form-item label="姓名" prop="empName">
            <el-input v-model="worker.empName"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="worker.sex" placeholder="请选择性别">
              <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input-number v-model="worker.age" controls-position="right" :min="1" placeholder="请输入年龄"></el-input-number>
          </el-form-item>
          <el-form-item label="部门" prop="deptName">
            <el-select v-model="worker.deptName" placeholder="请选择部门">
              <el-option
                v-for="item in deptOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学历" prop="empDegreeName">
            <el-select v-model="worker.empDegreeName" placeholder="请选择学历">
              <el-option
                v-for="item in empDegreeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </system-dialog>
  </el-main>
</template>

<script>
//导入worker.js脚本
import workerApi from '@/api/worker';
//导入对话框组件
import SystemDialog from '@/components/system/SystemDialog.vue';
export default {
  name: 'workerList',
  //注册组件
  components:{
    SystemDialog
  },
  data() {
    return {
      //查询条件
      searchModel: {
        empName: '',
        deptName: '',
        empDegreeName: '',
        pageNo:1,
        pageSize:10
      },
      loading: false,
      workerList: [], //数据列表
      tableHeight: 0, //表格高度
      pageNo: 1, //当前页码
      pageSize: 10, //每页显示数量
      total: 0, //总数量
      deptOptions: [
        {
          value: '业务部',
          label: '业务部'
        },
        {
          value: '后勤部',
          label: '后勤部'
        },
        {
          value: '人事部',
          label: '人事部'
        }
      ],
      empDegreeOptions: [
        {
          value: '研究生',
          label: '研究生'
        },
        {
          value: '本科',
          label: '本科'
        },
        {
          value: '大专',
          label: '大专'
        }
      ],
      sexOptions: [
        {
          value: '男',
          label: '男'
        },
        {
          value: '女',
          label: '女'
        },
      ],
      //添加和修改窗口属性
      workerDialog: {
        title: '',
        visible: false,
        height: 250,
        width: 500
      },
      //角色对象
      worker: {
        id:"",
        empName:"",
        sex:"",
        age:"",
        deptName:"",
        empDegreeName:""
      },
      rules: {
        empName: [{ required: true, trigger: 'blur', message: '请输入职工姓名' }],
        sex: [{ required: true, trigger: 'blur', message: '请选择性别' }],
        age: [{ required: true, trigger: 'blur', message: '请输入年龄' }],
        deptName: [{ required: true, trigger: 'blur', message: '请选择部门名称' }],
        empDegreeName: [{ required: true, trigger: 'blur', message: '请选择学历' }]
      },
    }
  },
  created() {
    //调用查询角色列表的方法
    this.search();
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 220
    })
  },
  methods: {
    /**
     * 查询
     */
    async search(pageNo=1,pageSize=10) {
      this.loading = true
      this.searchModel.pageNo = pageNo;//当前页码
      this.searchModel.pageSize = pageSize;//每页显示数量
      //发送查询请求
      let res = await workerApi.getWorkerListApi(this.searchModel);
      //执行成功
      if (res.success) {
        //角色列表
        this.workerList = res.data.records;
        //总数量
        this.total = res.data.total;
        this.loading = false
      } else {
        this.$message.warning(res.message)
        this.loading = false
      }
    },
    //导出
    exportData() {
      workerApi.exportExcel(this.searchModel).then(res => {
        console.log(res)
        const link = document.createElement("a");

        // let blob = new Blob([res.data], { type: 'xlsx' });
        let blob = new Blob([res.data], { type: "application/vnd.ms-excel;charset=UTF-8" }); //知道type也可以直接填
        link.style.display = "none";
        //设置连接
        let url = URL.createObjectURL(blob);
        link.href = url;
        //导出文件名称
        link.download = "职工数据";
        //模拟点击事件
        link.click();
        document.body.removeChild(link);
      })
    },
    /**
     * 重置查询条件
     */
    resetValue() {
      //清空查询条件
      this.searchModel={};
      //重新查询
      this.search(this.pageNo, this.pageSize);
    },
    /**
     * 当每页数量发生变化时触发该事件
     */
    handleSizeChange(size) {
      this.pageSize = size; //将每页显示的数量交给成员变量
      this.search(this.pageNo, size);
    },
    /**
     * 当页码发生变化时触发该事件
     */
    handleCurrentChange(page) {
      this.pageNo = page;
      //调用查询方法
      this.search(page, this.pageSize);
    },
    /**
     * 打开添加窗口
     */
    openAddWindow() {
      //清空表单数据
      this.$resetForm("workerForm",this.worker);
      this.workerDialog.title = '新增职工'//设置窗口标题
      this.workerDialog.visible = true//显示窗口
    },
    /**
     * 窗口取消事件
     */
    onClose() {
      this.workerDialog.visible = false
    },
    /**
     * 窗口确认事件
     */
    onConfirm() {
      //表单验证
      this.$refs.workerForm.validate(async (valid)=>{
        if(valid){
          let res = null;
          //判断角色ID是否为空
          if (!this.worker.id) {
            //新增
            //发送添加请求
            res = await workerApi.addWorkerApi(this.worker);
          } else {
            //发送修改请求
            res = await workerApi.updateWorkerApi(this.worker);
          }
          //判断是否成功
          if (res.success) {
            this.$message.success(res.message);
            //刷新
            this.search(this.pageNo,this.pageSize);
            //关闭窗口
            this.workerDialog.visible = false;
          } else {
            this.$message.error(res.message);
          }
        }
      });
    },
    /**
     * 打开编辑窗口
     */
    handleEdit(row) {
      console.log(row)
      //数据回显
      this.$objCopy(row, this.worker); //将当前编辑的数据复制到role对象中
      //设置窗口标题
      this.workerDialog.title = "编辑职工";
      //显示编辑窗口
      this.workerDialog.visible = true;
    },
    /**
     * 删除
     * @param row
     */
    async handleDelete(row) {
      //确认是否删除
      let confirm =await this.$myconfirm("确定要删除该数据吗?");
      if (confirm) {
        //发送删除请求
        let res = await workerApi.deleteWorker({ id: row.id });
        //判断是否成功
        if (res.success) {
          //成功提示
          this.$message.success(res.message);
          //刷新
          this.search(this.pageNo, this.pageSize);
        } else {
          //失败提示
          this.$message.error(res.message);
        }
      }
    },
  }
}
</script>

<style scoped>

</style>
