<template>
  <a-layout id="app-layout-header">
    <a-layout-header
      v-model="collapsed"
      theme="light"
      class="layout-header"
    >
      <div class="logo">
        <img class="pic-logo" src="~@/assets/frontpage.png">
        <!-- <span class="logo-text"> 主页 </span> -->
      </div>
      <a-menu
        class="menu-item"
        theme="dark"
        mode="horizontal"
        :selectedKeys="[current]"
        @click="menuHandle"
      >
        <a-menu-item v-for="(menuInfo, index) in menu" :key="index">
          <!-- <icon-font :type="menuInfo.icon" /> -->
          {{ menuInfo.title }}
        </a-menu-item>
      </a-menu>
    </a-layout-header>
    <a-layout>
      <a-layout-content class="layout-content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>

export default {
  name: 'AppSider',
  data() {
    return {
      collapsed: true,
      current: 'menu_2',
      menu: {
        // 'menu_1' : {
        //   //icon: 'icon-fengche',
        //   title: '网络服务器设置',
        //   pageName: 'Framework',
        //   params: {
        //     // test: 'hello'
        //   },
        // },
        'menu_2' : {
          //icon: 'icon-niudan',
          title: '目标机配置',
          pageName: 'Os',
          params: {},
        },
        'menu_3' : {
          //icon: 'icon-xiangji',
          title: '动力学模型库配置',
          pageName: 'Hardware',
          params: {},
        },
        'menu_4' : {
          //icon: 'icon-liuxing',
          title: 'GDB调试',
          pageName: 'Debug',
          params: {},
        },
        'menu_5' : {
          //icon: 'icon-gouwu',
          title: '仿真控制',
          pageName: 'Cross',
          params: {},
        },
        'menu_6' : {
          title: '数据库',
          pageName: 'DB',
          params: {},
        },
      }
    };
  },
  created () {
  },
  mounted () {
    this.menuHandle()
  },
  methods: {
    menuHandle (e) {
      console.log('sider menu e:', e);
      this.current = e ? e.key : this.current;
      console.log('sider menu current:', this.current);

      const linkInfo = this.menu[this.current]
      console.log('[home] load linkInfo:', linkInfo);
      this.$router.push({ name: linkInfo.pageName, params: linkInfo.params})
    },
    changeMenu(e) {
      console.log('sider menu e:', e);
      //this.current = e.key;
    }
  },
};
</script>
<style lang="less" scoped>
// 嵌套
#app-layout-header {
  height: 100%;
  .logo {
    // border-bottom: 1px solid #e8e8e8;
    float: left;
    width: 125px;
    height: 40px;
    margin: 16px 24px 16px 0;
  }
  .pic-logo {
    height: 30px;
    // background: rgba(139, 137, 137, 0.2);
    //margin: 16px 24px 16px 0;
    float: left;
    margin:auto;
  }
//   .logo-text{
//     color:#fff;
//     top: 50%;
//     left: 50%;
//     transform: translate(-50%, -50%);
//   }
  .layout-header {
    border-top: 1px solid #e8e8e8;
    border-right: 1px solid #e8e8e8;
  }
  .menu-item {
    .ant-menu-item {
      background-color: #fff;
      margin-top: 0px;
      margin-bottom: 0px;
      padding: 0 0px !important;
    }
  }
}
</style>
