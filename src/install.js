export let _Vue;

// Install
export function install(Vue) {
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;

  const isDef = (v) => v !== undefined;

  Vue.mixin({
    beforeCreate() {
      if (isDef(this.$options.localStore)) {
        this._localStoreRoot = this;
        this._localStore = this.$options.localStore;
        this._localStore.init(this);
      } else {
        this._localStoreRoot = (this.$parent && this.$parent._localStoreRoot) || this;
      }
    },
  });

  Object.defineProperty(Vue.prototype, '$localStore', {
    get () { return this._localStoreRoot._localStore }
  });
}
