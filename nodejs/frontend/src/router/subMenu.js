/**
 * 子菜单
 */
export default {
  framework: {
    menu_100: {
      icon: "profile",
      title: "通信",
      pageName: "FrameworkSocketIpc",
      params: {},
    },
    menu_101: {
      icon: "profile",
      title: "http服务",
      pageName: "FrameworkSocketHttpServer",
      params: {},
    },
    menu_102: {
      icon: "profile",
      title: "socket服务",
      pageName: "FrameworkSocketSocketServer",
      params: {},
    },
    menu_103: {
      icon: "profile",
      title: "json数据库",
      pageName: "FrameworkJsonDBIndex",
      params: {},
    },
    menu_104: {
      icon: "profile",
      title: "sqlite数据库",
      pageName: "FrameworkSqliteDBIndex",
      params: {},
    },
    menu_105: {
      icon: "profile",
      title: "任务",
      pageName: "FrameworkJobsIndex",
      params: {},
    },
    menu_106: {
      icon: "profile",
      title: "自动更新",
      pageName: "FrameworkUpdaterIndex",
      params: {},
    },
    menu_107: {
      icon: "profile",
      title: "软件调用",
      pageName: "FrameworkSoftwareIndex",
      params: {},
    },
    menu_108: {
      icon: "profile",
      title: "java",
      pageName: "FrameworkJavaIndex",
      params: {},
    },
    menu_109: {
      icon: "profile",
      title: "测试",
      pageName: "FrameworkTestApiIndex",
      params: {},
    },
  },
  os: {
    menu_100: {
      icon: "profile",
      title: "片内设备集(soc)",
      pageName: "OsCoreIndex",
      params: {},
      id: 1,
      nodeItemList: [
        {
          label: "3803片内设备集",
          value: {
            width: 120,
            height: 60,
            api: [
              {
                label: "",
                style: {
                  width: "0",
                  height: "0",
                  backgroundColor: "transparent",
                  top: "18px",
                },
              },
              {
                label: "",
                style: {
                  width: "0",
                  height: "0",
                  backgroundColor: "transparent",
                  top: "42px",
                },
              }
            ],
            meta: {
              label: "3803片内设备集",
              name: "3803片内设备集",
              group: "片内设备集",
              realName: "BM3803CPU1.bus_m",
              accept: [
                "预留"
              ],
            },
          },
        },
        {
          label: "tms570片内设备集",
          value: {
            width: 120,
            height: 60,
            meta: {
              label: "tms570片内设备集",
              name: "tms570片内设备集",
              group: "指令核",
              accept: [
                "预留"
              ],
            },
          },
        },
      ],
    },
    // menu_101: {
    //   icon: "profile",
    //   title: "片内设备集",
    //   pageName: "OsCoreIndex",
    //   params: {},
    //   id: 2,
    //   nodeItemList: [
    //     {
    //       label: "sci串口",
    //       value: {
    //         width: 120,
    //         height: 60,
    //         bacColor: "#BCDBC1",
    //         api: [
    //           {
    //             label: "R",
    //             style: {
    //               width: "8px",
    //               height: "15px",
    //               backgroundColor: "#999999",
    //               top: "18px",
    //             },
    //           },
    //           {
    //             label: "W",
    //             style: {
    //               width: "8px",
    //               height: "15px",
    //               backgroundColor: "#999999",
    //               top: "42px",
    //             },
    //           }
    //         ],
    //         meta: {
    //           label: "sci串口",
    //           name: "sci串口",
    //           group: "片内设备",
    //           accept: [
    //             "3803指令核",
    //             "tms570指令核",
    //             "串口",
    //             "AD",
    //             "DA",
    //             "gpio（片外）",
    //             "1553B",
    //           ],
    //         },
    //       },
    //     },
    //     {
    //       label: "gpio（片内）",
    //       value: {
    //         width: 120,
    //         height: 60,
    //         bacColor: "#BCDBC1",
    //         meta: {
    //           label: "gpio（片内）",
    //           name: "gpio（片内）",
    //           group: "片内设备",
    //           accept: [
    //             "3803指令核",
    //             "tms570指令核",
    //             "串口",
    //             "AD",
    //             "DA",
    //             "gpio（片外）",
    //             "1553B",
    //           ],
    //         },
    //       },
    //     },
    //     {
    //       label: "中断控制器",
    //       value: {
    //         width: 120,
    //         height: 60,
    //         bacColor: "#BCDBC1",
    //         meta: {
    //           label: "中断控制器",
    //           name: "中断控制器",
    //           group: "片内设备",
    //           accept: [
    //             "3803指令核",
    //             "tms570指令核",
    //             "串口",
    //             "AD",
    //             "DA",
    //             "gpio（片外）",
    //             "1553B",
    //           ],
    //         },
    //       },
    //     },
    //     {
    //       label: "定时器",
    //       value: {
    //         width: 120,
    //         height: 60,
    //         bacColor: "#BCDBC1",
    //         meta: {
    //           label: "定时器",
    //           name: "定时器",
    //           group: "片内设备",
    //           accept: [
    //             "3803指令核",
    //             "tms570指令核",
    //             "串口",
    //             "AD",
    //             "DA",
    //             "gpio（片外）",
    //             "1553B",
    //           ],
    //         },
    //       },
    //     },
    //     {
    //       label: "设备总线",
    //       value: {
    //         width: 120,
    //         height: 60,
    //         bacColor: "#BCDBC1",
    //         meta: {
    //           label: "设备总线",
    //           name: "设备总线",
    //           realName: "bus.amba_pv_s[0]",
    //           group: "片内设备",
    //           accept: [
    //             "3803指令核",
    //             "tms570指令核",
    //             "串口",
    //             "AD",
    //             "DA",
    //             "gpio（片外）",
    //             "1553B",
    //           ],
    //         },
    //       },
    //     },
    //   ],
    // },
    menu_101: {
      icon: "profile",
      title: "片外设备",
      pageName: "OsCoreIndex",
      params: {},
      id: 3,
      nodeItemList: [
        {
          label: "预留",
          value: {
            width: 120,
            height: 60,
            api: [
              {
                label: "",
                style: {
                  width: "0",
                  height: "0",
                  backgroundColor: "transparent",
                  top: "18px",
                },
              },
              {
                label: "",
                style: {
                  width: "0",
                  height: "0",
                  backgroundColor: "transparent",
                  top: "42px",
                },
              }
            ],
            meta: {
              label: "预留",
              name: "预留",
              group: "片外设备",
              accpet: [
                "3803片内设备集",
                "tms570片内设备集",
              ],
            },
          },
        },
        {
          label: "预留",
          value: {
            width: 120,
            height: 60,
            api: [
              {
                label: "",
                style: {
                  width: "0",
                  height: "0",
                  backgroundColor: "transparent",
                  top: "18px",
                },
              },
              {
                label: "",
                style: {
                  width: "0",
                  height: "0",
                  backgroundColor: "transparent",
                  top: "42px",
                },
              }
            ],
            meta: {
              label: "预留",
              name: "预留",
              group: "片外设备",
              accpet: [
                "3803片内设备集",
                "tms570片内设备集",
              ],
            },
          },
        },
        {
          label: "预留",
          value: {
            width: 120,
            height: 60,
            api: [
              {
                label: "",
                style: {
                  width: "0",
                  height: "0",
                  backgroundColor: "transparent",
                  top: "18px",
                },
              },
              {
                label: "",
                style: {
                  width: "0",
                  height: "0",
                  backgroundColor: "transparent",
                  top: "42px",
                },
              }
            ],
            meta: {
              label: "预留",
              name: "预留",
              group: "片外设备",
              accpet: [
                "3803片内设备集",
                "tms570片内设备集",
              ],
            },
          },
        },
        {
          label: "预留",
          value: {
            width: 120,
            height: 60,
            api: [
              {
                label: "",
                style: {
                  width: "0",
                  height: "0",
                  backgroundColor: "transparent",
                  top: "18px",
                },
              },
              {
                label: "",
                style: {
                  width: "0",
                  height: "0",
                  backgroundColor: "transparent",
                  top: "42px",
                },
              }
            ],
            meta: {
              label: "预留",
              name: "预留",
              group: "片外设备",
              accpet: [
                "3803片内设备集",
                "tms570片内设备集",
              ],
            },
          },
        },
        // {
        //   label: "gpio（片外）",
        //   value: {
        //     width: 120,
        //     height: 60,
        //     bacColor: "#B9C9E6",
        //     meta: {
        //       label: "gpio（片外）",
        //       name: "gpio（片外）",
        //       group: "片外设备",
        //       accpet: [
        //         "sci串口",
        //         "gpio（片内）",
        //         "中断控制器",
        //         "定时器",
        //         "设备总线",
        //       ],
        //     },
        //   },
        // },
        // {
        //   label: "AD",
        //   value: {
        //     width: 120,
        //     height: 60,
        //     bacColor: "#B9C9E6",
        //     meta: {
        //       label: "AD",
        //       name: "AD",
        //       group: "片外设备",
        //       accpet: [
        //         "sci串口",
        //         "gpio（片内）",
        //         "中断控制器",
        //         "定时器",
        //         "设备总线",
        //       ],
        //     },
        //   },
        // },
        // {
        //   label: "DA",
        //   value: {
        //     width: 120,
        //     height: 60,
        //     bacColor: "#B9C9E6",
        //     meta: {
        //       label: "DA",
        //       name: "DA",
        //       group: "片外设备",
        //       accpet: [
        //         "sci串口",
        //         "gpio（片内）",
        //         "中断控制器",
        //         "定时器",
        //         "设备总线",
        //       ],
        //     },
        //   },
        // },
        // {
        //   label: "1553B",
        //   value: {
        //     width: 120,
        //     height: 60,
        //     bacColor: "#B9C9E6",
        //     meta: {
        //       label: "1553B",
        //       name: "1553B",
        //       accpet: [
        //         "sci串口",
        //         "gpio（片内）",
        //         "中断控制器",
        //         "定时器",
        //         "设备总线",
        //       ],
        //     },
        //   },
        // },
      ],
    },
    menu_103: {
      icon: "profile",
      title: "虚拟网络端口",
      pageName: "OsCoreIndex",
      params: {},
      id: 4,
      nodeItemList: [
        {
          label: "DDS_Client",
          value: {
            width: 120,
            height: 60,
            group: "虚拟网络端口",
            meta: {
              label: "DDS_Client",
              name: "DDS_Client",
            },
          },
        },
      ],
    },
  },
  hardware: {
    menu_100: {
      id: 0,
      icon: "profile",
      title: "输入输出端口",
      pageName: "HardwarePrinterIndex",
      params: {},
    },
  },
  debug: {
    menu_100: {
      icon: "profile",
      title: "gdb调试",
      pageName: "DebugIndex",
      params: {},
    },
  },
  cross: {
    // menu_100: {
    //   id: "menu_100",
    //   icon: "profile",
    //   title: "遥控遥测",
    //   pageName: "CrossGoIndex",
    //   params: {},
    // },
    menu_100: {
      id: "menu_100",
      icon: "profile",
      title: "模型参数监控",
      pageName: "CrossMonitorIndex",
      params: {},
    },
    // menu_102: {
    //   id: "menu_102",
    //   icon: "profile",
    //   title: "节点数据处理",
    //   pageName: "CrossGoIndex",
    //   params: {},
    // },
    menu_103: {
      id: "menu_103",
      icon: "profile",
      title: "仿真控制",
      pageName: "CrossControlIndex",
      params: {},
    },
    menu_104: {
      id: "menu_104",
      icon: "profile",
      title: "一键启动",
      pageName: "CrossGoIndex",
      params: {},
    },
  },
  db: {
    menu_100: {
      icon: "profile",
      title: "Sqlite数据库",
      pageName: "DBIndex",
      params: {},
      id: 1,
      children: [
        // {
        //   id: 1,
        //   title: "User",
        //   nodeItemList: [
        //     {
        //       label: "id",
        //       value: {
        //         width: 120,
        //         height: 40,
        //         meta: {
        //           label: "id",
        //           name: "id",
        //         },
        //       },
        //     },
        //     {
        //       label: "name",
        //       value: {
        //         width: 120,
        //         height: 40,
        //         meta: {
        //           label: "name",
        //           name: "name",
        //         },
        //       },
        //     },
        //   ],
        // },
        // {
        //   id: 2,
        //   title: "Table1",
        //   nodeItemList: [
        //     {
        //       label: "field",
        //       value: {
        //         width: 120,
        //         height: 40,
        //         meta: {
        //           label: "field",
        //           name: "field",
        //         },
        //       },
        //     },
        //   ],
        // },
        // {
        //   id: 3,
        //   title: "Table2",
        // }
      ]
    },
  },
};
