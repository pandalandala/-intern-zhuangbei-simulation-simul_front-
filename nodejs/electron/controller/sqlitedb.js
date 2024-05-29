'use strict';

const { Controller } = require('ee-core');
const Log = require('ee-core/log');
const Services = require('ee-core/services');


/**
 * example
 * @class
 */
class SqlitedbController extends Controller {

  constructor(ctx) {
    super(ctx);
  }


  /**
   * 所有方法接收两个参数
   * @param args 前端传的参数
   * @param event - ipc通信时才有值。详情见：控制器文档
   */

  /**
   * test
   */
  async test () {

    const result1 = await Services.get('example').test('electron');
    Log.info('service result1:', result1);

    Services.get('framework').test('electron');

    return 'hello electron-egg';
  }

  /**
   * 获取所有表的名称
   */
  async getAllTableNames() {
    const result = await Services.get('database.sqlitedb').getAllTableNames();
    return result;
  }
  /**
   * 根据表名获取表中数据 
   */
  async getTableData(args) {
    const { tableName } = args;
    const result = await Services.get('database.sqlitedb').getTableData(tableName);
    return result;
  }
  /**
   * 根据表名以及字段名field获取表中value和time数据 
   */
  async getTableDataByField(args) {
    const { tableName, field } = args;
    const result = await Services.get('database.sqlitedb').getTableDataByField(tableName, field);
    return result;
  }
  /**
   * 根据表名获取表中field字段中出现的所有唯一值
   */
  async getTableFieldValues(args) {
    const { tableName } = args;
    const result = await Services.get('database.sqlitedb').getTableFieldValues(tableName);
    return result;
  }
  /**
   * 根据表名获取表中的所有字段名
   */
  async getTableFields(args) {
    const { tableName } = args;
    const result = await Services.get('database.sqlitedb').getTableFields(tableName);
    return result;
  }

}

SqlitedbController.toString = () => '[class SqlitedbController]';
module.exports = SqlitedbController;  