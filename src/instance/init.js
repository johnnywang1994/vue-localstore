import { localStorage } from '../utils';

export function initStore(VueLocalStore) {
  VueLocalStore.prototype.init = function init(app /* Vue component instance */) {
    app.$once('hook:destroyed', () => {
      if (this.app === app) { this.app = null; }
    });
  
    if (this.app) {
      return;
    }
  
    this.app = app;
  
    // Init
    const setupLocalStore = () => {
      const __data__ = {};
      const newVersionName = this.options.versionName;
      const { versionNameKey, eventDataKey } = this.options;
      this.app.$set(this, '__data__', __data__);

      if (newVersionName === localStorage[versionNameKey]) {
        // inject
        try {
          this.app.$set(__data__, eventDataKey, JSON.parse(localStorage[eventDataKey]));
        } catch {
          console.warn('[vue-local-store] "event_data" was not defined, use fallback empty object');
          this.app.$set(__data__, eventDataKey, Object.create(null));
        }
      }
      this.setRoot(versionNameKey, newVersionName);
      this.refreshEventData();
    }
    setupLocalStore();
  }

  VueLocalStore.prototype.setUid = function setUniqueId(uid) {
    if (!uid) return;
    this.options.uid = uid;
  }
}
