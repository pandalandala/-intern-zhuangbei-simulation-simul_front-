<template>

  <el-dropdown @command="handleCommand">
    <el-button type="primary">
      Sqlite_main<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu v-for="name in allTableNames" :key="name">
        <el-dropdown-item
          v-if="name.name !== 'sqlite_sequence'"
          :key = "name"
          :command = "name.name">
          {{name.name}}
      </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <div class="Echarts">
    <div>
    <el-radio-group v-model="radio" @change="handleChartsChange">
      <el-radio-button label="柱状图"></el-radio-button>
      <el-radio-button label="折线图"></el-radio-button>
      <el-radio-button label="饼图"></el-radio-button>
      <el-radio-button label="散点图"></el-radio-button>
    </el-radio-group>
    </div>
    <div class="charts2">
      <div id="charts" style="width: 600px;height:400px;"></div>
      <div id="charts_test" style="width: 600px;height:400px;"></div>
    </div>
  </div>
</template>

<script>
import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { Background, BackgroundVariant } from "@vue-flow/background";

import { ipcApiRoute } from '@/api/main';
import { ipc } from '@/utils/ipcRenderer';

import * as echarts from "echarts";
export default {
  props: {
    nodesRef: Object,
  },
  data() {
    return {
      name: '李四',
      age: 20,
      userList: [],
      search_age: 20,
      update_name: '李四',
      update_age: 31,
      delete_name: '李四',
      all_list: [],
      data_dir: '',
      ageNum:[],
      ageRate:[],
      radio:'柱状图',
      option:{},
      optionScatter:{},
      myChart: {},

      tableName: 'table1',
      tableData: [],
      fieldList: [],
      allTableNames: [],

      myChartTest: {},
      optionTest: {},
      
    };
  },
  name: 'db',
  methods:{
    init() {
      const params = {
        action: 'getDataDir',
      }
      ipc.invoke(ipcApiRoute.sqlitedbOperation, params).then(res => {
        if (res.code == -1) {
          this.$message.error('请检查sqlite是否正确安装', 5);
          return
        }

        this.data_dir = res.result;
        this.getAllTestData();
      })
    },
    myEcharts(){
      // 基于准备好的dom，初始化echarts实例
      this.myChart = echarts.init(document.getElementById('charts'));
      this.countAge();

      // 指定图表的配置项和数据
      this.option = {
        title: {
          text: 'sqlite用户年龄图'
        },
        tooltip: {},
        // legend: {
        //   orient: 'vertical',
        //   left: 'left'
        // },
        xAxis: {type: 'category'},
        yAxis: {},
        series: {
          type: 'bar',
          data: this.ageNum
        },
        // toolbox: {
        //     show: true,
        //     feature: {
        //         magicType: {type: ['line', 'bar']}
        //     }
        //   } 
      };
      this.optionScatter = {
        title: {
          text: 'sqlite用户年龄图'
        },
        tooltip: {},
        // legend: {
        // },
        dataset:{
          source: this.all_list
        },
        xAxis: {type: 'category'},
        yAxis: {},
        series: {
          type: 'scatter',
          encode: {
            x: 1,
            y: 2
          },
        },
      };
      this.myChart.setOption(this.option);

    },
    
    getAllTestData () {
      const params = {
        action: 'all',
      }
      ipc.invoke(ipcApiRoute.sqlitedbOperation, params).then(res => {
        if (res.all_list.length == 0) {
          return false;
        }
        this.all_list = res.all_list;
        this.myEcharts();
      }) 
    },
    sqlitedbOperation (ac) {
      const params = {
        action: ac,
        info: {
          name: this.name,
          age: parseInt(this.age)
        },
        search_age: parseInt(this.search_age),
        update_name: this.update_name,
        update_age: parseInt(this.update_age),
        delete_name: this.delete_name,
      }
      if (ac == 'add' && this.name.length == 0) {
        this.$message.error(`请填写数据`);
      }
      ipc.invoke(ipcApiRoute.sqlitedbOperation, params).then(res => {
        if (ac == 'get') {
          if (res.result.length == 0) {
            this.$message.error(`没有数据`);
            return;
          }
          this.userList = res.result;
        }
        if (res.all_list.length == 0) {
          this.all_list = [''];
          return;
        }
        this.all_list = res.all_list;
        this.$message.success(`success`);
      }) 
    },

    countAge() {
      for (let i = 0; i < this.all_list.length; i++) {
          const element = this.all_list[i].age;
          if (this.ageNum[element]) {
            this.ageNum[element]++;
          } else {
              this.ageNum[element] = 1;

          }
          this.ageRate[element] = this.ageNum[element] / this.all_list.length;
      }
    },

    handleChartsChange(){
      if (!this.option || !this.myChart) {
        console.log('option or myChart is null');
        return;
      }
      switch(this.radio){
        case "柱状图" :
          this.option.series.type = 'bar';
          this.option.series.data = this.ageNum;
          this.myChart.setOption(this.option);
          break;
        case "折线图" :
          this.option.series.type = 'line';
          this.option.series.data = this.ageNum;
          this.myChart.setOption(this.option);
          break;
        case "饼图" :
          this.option.series.type = 'pie';
          var pieData = Object.keys(this.ageNum).map( (key) => {
              return {
                  name: key,
                  value: this.ageNum[key]
              };
          });
          this.option.series.data = pieData;
          this.myChart.setOption(this.option);
          break;
        case "散点图" :
          this.myChart.setOption(this.optionScatter);
          break;
      }
    },

    /**
     * 获取table1中的所有数据
     */
    getDataByTable (tableName) {
      const params = {
        tableName: tableName,
      }
      ipc.invoke(ipcApiRoute.getTableData, params).then(res => {
        if (res.length == 0) {
          this.$message.error(`没有数据`);
          return;
        }
        this.tableData = res;
        console.log(this.tableData);
      }) 
    },
    /**
     * 获取table1中所有field字段
     */
    getFieldByTable (tableName) {
      const params = {
        tableName,
      }
      ipc.invoke(ipcApiRoute.getTableFieldValues, params).then(res => {
        if (res.length == 0) {
          this.$message.error(`没有数据`);
          return;
        }
        console.log(res);
        this.fieldList = res;

      })
    },

    handleSwitchChange() {
      let resData = [];
      for(let field in this.fieldList){
        if(field.value == true){
          const params = {
            tableName: this.tableName,
            field: field.field,
          }
          ipc.invoke(ipcApiRoute.getTableDataByField, params).then(res => {
            resData.add({
              field: field.field,
              data: res
            })
          })
        }
      }
      
      this.option = {
        title: {
          text: 'sqlite数据库'
        },
        tooltip: {},
        xAxis: {type: 'value'},
        yAxis: {},
        series: 
          resData.map(item => ({
          type: 'line',
          name: item.field,
          data: item.data.map(d => [d.time, d.value])
        }))
        ,
      }
      this.myChart.setOption(this.option);
    },

    getAllTableNames() {
      ipc.invoke(ipcApiRoute.getAllTableNames).then(res => {
        this.allTableNames = res;
        // console.log(this.allTableNames);
      }) 
    },
    handleCommand(command){
      this.getDataByTable(command);

      const xAxisData = [...new Set(this.tableData.map(item => item.time))];
      
      // 根据 field 分组
      const seriesData = {};
      this.tableData.forEach(item => {
        if (!seriesData[item.field]) {
          seriesData[item.field] = {
            name: item.field,
            type: 'line',
            data: []
          };
        }
        seriesData[item.field].data.push(item.value);
      });

      // 构建 series
      const series = Object.values(seriesData);

      this.optionTest = {
        tooltip: {
          // trigger: 'axis'
        },
        legend: {
          data: Object.keys(seriesData)
        },
        xAxis: {
          type: 'category',
          data: xAxisData
        },
        yAxis: {
          type: 'value'
        },
        series
      };

      this.myChartTest.setOption(this.optionTest);
    },
    //改变指向
    onEdgeUpdate({ edge, connection }) {
      const source = findNode(connection.source);
      const target = findNode(connection.target);
      console.log(source.data);
      if (source.accept !== undefined && !source.accept.includes(target.label)) {
        alert.value = true;
        return;
      } else {
        alert.value = false;
        return updateEdge(edge, connection);
      }
    },
    onConnectEdge(params) {
      const source = findNode(params.source);
      const target = findNode(params.target);
      if (source.accept !== undefined && !source.accept.includes(target.label)) {
        alert.value = true;
        return;
      } else {
        alert.value = false;
        params.type = "special";
        params.updatable = true;
        params.data = { visable: false };
        console.log(source);
        return addEdges(params);
      }
    },

  
  },
  mounted() {
    this.init();
    this.getAllTableNames();
    this.myChartTest = echarts.init(document.getElementById('charts_test'));
    
  },
  // watch: {
  //   'props.nodesRef': {
  //     handler(newVal) {
  //       addNodes([newVal]);
  //     },
  //     immediate: true
  //   }
  // }
}
</script>

<style>
.charts2 {
  display: flex;
}
</style>