/**
 * @des 使得访问 this.$data 就可以访问到 this._data, (prop同)，数据的代码
 * @param {MiniVue} vm
 * @return {*} void
 */
export default function stateMixin(vm) {
  Object.defineProperty(vm.prototype, '$data', {
    get: function () {
      return this._data;
    },
  });
  Object.defineProperty(vm.prototype, '$props', {
    get: function () {
      return this._props;
    },
  });
}
