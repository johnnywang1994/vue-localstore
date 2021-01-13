export let _Vue;

// Install
export function install(Vue) {
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;

  const isDef = (v) => v !== undefined;

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate() {
      if (isDef(this.$options.localStore)) {
        this._localStoreRoot = this;
        this._localStore = this.$options.localStore;
        this._localStore.init(this);
      } else {
        this._localStoreRoot = (this.$parent && this.$parent._localStoreRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed() {
      registerInstance(this);
    },
  });

  Object.defineProperty(Vue.prototype, '$localStore', {
    get () { return this._localStoreRoot._localStore }
  });
}
