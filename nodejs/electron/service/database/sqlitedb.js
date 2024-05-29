'use strict';

const { Service } = require('ee-core');
const Storage = require('ee-core/storage');
const _ = require('lodash');
const path = require('path');

/**
 * sqlite数据存储
 * @class
 */
class SqlitedbService extends Service {

  constructor (ctx) {
    super(ctx);

    this.sqliteFile = 'sqlite-demo.db';
    let sqliteOptions = {
      driver: 'sqlite',
      default: {
        timeout: 6000,
        verbose: console.log // 打印sql语法
      }
    }
    this.demoSqliteDB = Storage.connection(this.sqliteFile, sqliteOptions);
  }

  /*
   * 检查并创建表 (sqlite)
   */
  async checkAndCreateTableSqlite(tableName = '') {
    if (_.isEmpty(tableName)) {
      throw new Error(`table name is required`);
    }
    // 检查表是否存在
    const userTable = this.demoSqliteDB.db.prepare('SELECT * FROM sqlite_master WHERE type=? AND name = ?');
    const result = userTable.get('table', tableName);
    //console.log('result:', result);
    if (result) {
      return;
    }

    // 创建表
    const create_table_user =
    `CREATE TABLE ${tableName}
     (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name CHAR(50) NOT NULL,
        age INT
     );`
    this.demoSqliteDB.db.exec(create_table_user);

  }


  /*
   * 增 Test data (sqlite)
   */
  async addTestDataSqlite(data) {
    //console.log("add data:", data);

    let table = 'user';
    await this.checkAndCreateTableSqlite(table);

    const insert = this.demoSqliteDB.db.prepare(`INSERT INTO ${table} (name, age) VALUES (@name, @age)`);
    insert.run(data);

    return true;
  }

  /*
   * 删 Test data (sqlite)
   */
  async delTestDataSqlite(name = '') {
    //console.log("delete name:", name);

    let table = 'user';
    await this.checkAndCreateTableSqlite(table);

    const delUser = this.demoSqliteDB.db.prepare(`DELETE FROM ${table} WHERE name = ?`);
    delUser.run(name);

    return true;
  }

  /*
   * 改 Test data (sqlite)
   */
  async updateTestDataSqlite(name= '', age = 0) {
    //console.log("update :", {name, age});

    let table = 'user';
    await this.checkAndCreateTableSqlite(table);

    const updateUser = this.demoSqliteDB.db.prepare(`UPDATE ${table} SET age = ? WHERE name = ?`);
    updateUser.run(age, name);

    return true;
  }  

  /*
   * 查 Test data (sqlite)
   */
  async getTestDataSqlite(age = 0) {
    //console.log("select :", {age});

    let table = 'user';
    await this.checkAndCreateTableSqlite(table);

    const selectUser = this.demoSqliteDB.db.prepare(`SELECT * FROM ${table} WHERE age = @age`);
    const users = selectUser.all({age: age});
    //console.log("select users:", users);
    return users;
  }  
  
  /*
   * all Test data (sqlite)
   */
  async getAllTestDataSqlite() {
    //console.log("select all user");

    let table = 'user';
    await this.checkAndCreateTableSqlite(table);

    const selectAllUser = this.demoSqliteDB.db.prepare(`SELECT * FROM ${table} `);
    const allUser =  selectAllUser.all();
    //console.log("select allUser:", allUser);
    return allUser;
  }
  
  /*
   * get data dir (sqlite)
   */
  async getDataDir() {
    const dir = this.demoSqliteDB.getStorageDir();    

    return dir;
  } 

  /*
   * set custom data dir (sqlite)
   */
  async setCustomDataDir(dir) {
    if (_.isEmpty(dir)) {
      return;
    }

    // the absolute path of the db file
    const dbFile = path.join(dir, this.sqliteFile);
    const sqliteOptions = {
      driver: 'sqlite',
      default: {
        timeout: 6000,
        verbose: console.log
      }
    }
    this.demoSqliteDB = Storage.connection(dbFile, sqliteOptions);    

    return;
  }

  /*
   * 获取所有表的名称 (sqlite)
   */
  async getAllTableNames() {
    const tableNames = this.demoSqliteDB.db.prepare("SELECT name FROM sqlite_master WHERE type='table' ");
    const result = tableNames.all();
    // console.log('getAllTableNames', result);
    return result;
  }
  
  /*
   * 根据表名获取表中数据 (sqlite)
   */
  async getTableData(tableName = '') {
    if (_.isEmpty(tableName)) {
      throw new Error(`table name is required`);
    }
    const tableData = this.demoSqliteDB.db.prepare(`SELECT * FROM ${tableName}`);
    const result = tableData.all();
    //console.log('result:', result);
    return result;
  }
  /*
   * 根据表名以及字段名field获取表中value和time数据 (sqlite)
   */
  async getTableDataByField(tableName = '', field = '') {
    if (_.isEmpty(tableName) || _.isEmpty(field)) {
      throw new Error(`table name and field are required`);
    }
    const tableData = this.demoSqliteDB.db.prepare(`SELECT value, time FROM ${tableName} WHERE field = ${field}`);
    const result = tableData.all();
    return result;
  }
  /**
   * 根据表名获取表中field字段中出现的所有唯一值
   */
  async getTableFieldValues(tableName = '') {
    if (_.isEmpty(tableName)) {
      throw new Error(`table name are required`);
    }
    const tableData = this.demoSqliteDB.db.prepare(`SELECT DISTINCT field FROM ${tableName}`);
    const result = tableData.all();
    return result;
  }
  /**
   * 根据表名获取表中的所有字段名
   */
  async getTableFields(tableName = '') {
    if (_.isEmpty(tableName)) {
      throw new Error(`table name are required`);
    }
    const tableData = this.demoSqliteDB.db.prepare(`PRAGMA table_info(${tableName})`);
    const result = tableData.all();
    // console.log('getTableFields', result);
    return result;
  }
}

SqlitedbService.toString = () => '[class SqlitedbService]';
module.exports = SqlitedbService;
