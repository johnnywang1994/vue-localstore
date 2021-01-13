import { localStorage } from '../utils';

export function initRoot(VueLocalStore) {
  VueLocalStore.prototype.setRoot = function setRootKey(key, value) {
    const { versionNameKey } = this.options;
    // check version_name_locked
    if (key === versionNameKey && this.__version_name_locked__) {
      console.warn(`[vue-local-store] key "version_name" cannot be modified`);
      return;
    }
  
    // set root logic
    if (typeof value === 'string') {
      localStorage[key] = value;
    } else {
      try {
        localStorage[key] = JSON.stringify(value);
      } catch {
        console.warn(`[vue-local-store] root key "${key}" failed to set`);
        return;
      }
    }
    this.app.$set(this.__data__, key, value);
  
    // lock version_name
    if (key === versionNameKey) {
      Object.defineProperty(this, '__version_name_locked__', {
        get() { return true },
      });
    }
  }
  
  VueLocalStore.prototype.getRoot = function getRootKey(key) {
    return this.__data__[key];
  }
  
  VueLocalStore.prototype.removeRoot = function removeRootKey(key) {
    this.app.$set(this.__data__, key, null);
    delete localStorage[key];
    delete this.__data__[key];
  }
}
