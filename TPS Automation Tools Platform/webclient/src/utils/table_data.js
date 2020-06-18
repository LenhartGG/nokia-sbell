export const table1Columns = [
  {
    title: '序号',
    type: 'index',
    width: 80,
    align: 'center'
  },
  {
    title: '姓名',
    align: 'center',
    key: 'name',
    editable: true
  },
  {
    title: '性别',
    align: 'center',
    key: 'sex'
  },
  {
    title: '岗位',
    align: 'center',
    key: 'work',
    editable: true
  },
  {
    title: '操作',
    align: 'center',
    width: 120,
    key: 'handle',
    handle: ['delete']
  }
];

export const table1Data = [
  {
    name: 'Aresn',
    sex: '男',
    work: '前端开发'
  },
  {
    name: 'Lison',
    sex: '男',
    work: '前端开发'
  },
  {
    name: 'lisa',
    sex: '女',
    work: '程序员鼓励师'
  }
];

export const editInlineColumns = [
  {
    title: '序号',
    type: 'index',
    width: 80,
    align: 'center'
  },
  {
    title: '姓名',
    align: 'center',
    key: 'name',
    width: 90,
    editable: true
  },
  {
    title: '性别',
    align: 'center',
    key: 'sex'
  },
  {
    title: '岗位',
    align: 'center',
    key: 'work',
    width: 150,
    editable: true
  },
  {
    title: '操作',
    align: 'center',
    width: 190,
    key: 'handle',
    handle: ['edit', 'delete']
  }
];

export const editInlineData = [
  {
    name: 'Aresn',
    sex: '男',
    work: '前端开发'
  },
  {
    name: 'Lison',
    sex: '男',
    work: '前端开发'
  },
  {
    name: 'lisa',
    sex: '女',
    work: '程序员鼓励师'
  }
];

export const editIncellColumns = [
  {
    title: '序号',
    type: 'index',
    width: 80,
    align: 'center'
  },
  {
    title: '姓名',
    align: 'center',
    key: 'name',
    width: 120,
    editable: true
  },
  {
    title: '性别',
    align: 'center',
    key: 'sex'
  },
  {
    title: '岗位',
    align: 'center',
    width: 160,
    key: 'work',
    editable: true
  },
  {
    title: '操作',
    align: 'center',
    width: 120,
    key: 'handle',
    handle: ['delete']
  }
];

export const editIncellData = [
  {
    name: 'Aresn',
    sex: '男',
    work: '前端开发'
  },
  {
    name: 'Lison',
    sex: '男',
    work: '前端开发'
  },
  {
    name: 'lisa',
    sex: '女',
    work: '程序员鼓励师'
  }
];

export const editInlineAndCellColumn = [
  {
    title: '序号',
    type: 'index',
    width: 100,
    align: 'center'
  },
  {
    title: 'neSummary_tps24',
    align: 'center',
    key: 'col1',
    width: 305,
    editable: true
  },
  {
    title: 'neSummary_tps12',
    align: 'center',
    width: 305,
    key: 'col2',
    editable: true
  },
  {
    title: '操作',
    align: 'center',
    width: 250,
    key: 'handle',
    handle: ['edit', 'delete']
  }
];

export const editInlineAndCellData = [
  {
    col1: 'getAll_port',
    col2: 'getAll_port'
  },
  {
    col1: 'getAll_vpls',
    col2: 'getAll_vpls'
  },
  {
    col1: 'getAll_sap',
    col2: 'getAll_sap'
  },
  {
    col1: 'getAll_domain',
    col2: 'getAll_domain'
  },
  {
    col1: 'getAll_association',
    col2: 'getAll_association'
  },
  {
    col1: 'getAll_portInventory',
    col2: 'getAll_portInventory'
  },
  {
    col1: 'show condition',
    col2: 'show condition'
  },
  {
    col1: 'alm',
    col2: 'alm'
  }
];

export const showCurrentColumns = [
  {
    title: '序号',
    type: 'index',
    width: 80,
    align: 'center'
  },
  {
    title: '姓名',
    align: 'center',
    key: 'name',
    width: 300,
    editable: true
  },
  {
    title: '性别',
    align: 'center',
    key: 'sex'
  },
  {
    title: '岗位',
    align: 'center',
    width: 300,
    key: 'work',
    editable: true
  }
];

const tableData = {
  table1Columns: table1Columns,
  table1Data: table1Data,
  editInlineColumns: editInlineColumns,
  editInlineData: editInlineData,
  editIncellColumns: editIncellColumns,
  editIncellData: editIncellData,
  editInlineAndCellColumn: editInlineAndCellColumn,
  editInlineAndCellData: editInlineAndCellData,
  showCurrentColumns: showCurrentColumns
};

export default tableData;
