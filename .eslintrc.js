module.exports = {
  root: false,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  globals: {
    BMapGL: true,
    BasicMarker: true,
    BasicInfoWindow: true,
    NORMAL: true,
    ERROR: true,
    WARN: true,
    DOWNHOLE: true,
    MILEAGE: true,
    INVEHICLE: true,
    NEW_INVEHICLE: true,
    ModalPage: true,
    PageTypeEnum: true,
    pageTypeMap: true,
    FAULT_MAP: true,
    MILEAGE_FAULT_MAP: true,
    ModalActionEnum: true,
    POSITION_ICON: true,
    ALL_FAULT_STATUS_MAP: true,
    DEVICE_TYPE: true,
    ALARM_TYPE: true,

    MAP: "readonly",
    ALERT: "readonly",
    FAULT: "readonly",
    HISTORY: "readonly",
    DEVICE: "readonly",

    DOWNLOAD_TYPE: "readonly"

  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
