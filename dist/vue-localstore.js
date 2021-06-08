(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.VueLocalStore = factory());
}(this, (function () { 'use strict';

  var _Vue; // Install

  function install(Vue) {
    if (install.installed && _Vue === Vue) {
      return;
    }

    install.installed = true;
    _Vue = Vue;

    var isDef = function isDef(v) {
      return v !== undefined;
    };

    Vue.mixin({
      beforeCreate: function beforeCreate() {
        if (isDef(this.$options.localStore)) {
          this._localStoreRoot = this;
          this._localStore = this.$options.localStore;

          this._localStore.init(this);
        } else {
          this._localStoreRoot = this.$parent && this.$parent._localStoreRoot || this;
        }
      }
    });
    Object.defineProperty(Vue.prototype, '$localStore', {
      get: function get() {
        return this._localStoreRoot._localStore;
      }
    });
  }

  var inBrowser = typeof window !== 'undefined';
  var localStorage = inBrowser ? window.localStorage : Object.create(null);
  var VERSION_NAME_KEY = 'version_name';
  var EVENT_DATA_KEY = 'event_data';
  var ANONYMOUS = 'anonymous';

  function initStore(VueLocalStore) {
    VueLocalStore.prototype.init = function init(app
    /* Vue component instance */
    ) {
      var _this = this;

      app.$once('hook:destroyed', function () {
        if (_this.app === app) {
          _this.app = null;
        }
      });

      if (this.app) {
        return;
      }

      this.app = app; // Init

      var setupLocalStore = function setupLocalStore() {
        var __data__ = {};
        var newVersionName = _this.options.versionName;
        var _this$options = _this.options,
            versionNameKey = _this$options.versionNameKey,
            eventDataKey = _this$options.eventDataKey;

        _this.app.$set(_this, '__data__', __data__);

        if (newVersionName === localStorage[versionNameKey]) {
          // inject
          try {
            _this.app.$set(__data__, eventDataKey, JSON.parse(localStorage[eventDataKey]));
          } catch (_unused) {
            console.warn('[vue-local-store] "event_data" was not defined, use fallback empty object');

            _this.app.$set(__data__, eventDataKey, Object.create(null));
          }
        }

        _this.setRoot(versionNameKey, newVersionName);

        _this.syncRootData();

        _this.refreshEventData();
      };

      setupLocalStore();
    };

    VueLocalStore.prototype.setUid = function setUniqueId(uid) {
      if (!uid) return;
      this.options.uid = uid;
    };
  }

  function initRoot(VueLocalStore) {
    VueLocalStore.prototype.setRoot = function setRootKey(key, value) {
      var versionNameKey = this.options.versionNameKey; // check version_name_locked

      if (key === versionNameKey && this.__version_name_locked__) {
        console.warn("[vue-local-store] key \"version_name\" cannot be modified");
        return;
      } // set root logic


      if (typeof value === 'string') {
        localStorage[key] = value;
      } else {
        try {
          localStorage[key] = JSON.stringify(value);
        } catch (_unused) {
          console.warn("[vue-local-store] root key \"".concat(key, "\" failed to set"));
          return;
        }
      }

      this.app.$set(this.__data__, key, value); // lock version_name

      if (key === versionNameKey) {
        Object.defineProperty(this, '__version_name_locked__', {
          get: function get() {
            return true;
          }
        });
      }
    };

    VueLocalStore.prototype.getRoot = function getRootKey(key) {
      return this.__data__[key];
    };

    VueLocalStore.prototype.removeRoot = function removeRootKey(key) {
      this.app.$set(this.__data__, key, null);
      delete localStorage[key];
      delete this.__data__[key];
    };

    VueLocalStore.prototype.syncRootData = function syncRootData() {
      var _this = this;

      var keyList = Object.keys(localStorage);
      var eventDataKey = this.options.eventDataKey;
      keyList.forEach(function (key) {
        if (key === eventDataKey) return;
        var value;

        try {
          value = JSON.parse(localStorage[key]);
        } catch (_unused2) {
          value = localStorage[key];
        } finally {
          _this.app.$set(_this.__data__, key, value);
        }
      });
    };
  }

  function initEventData(VueLocalStore) {
    VueLocalStore.prototype.set = function setPrefixedKey(key, value) {
      var eventDataKey = this.options.eventDataKey;
      var skipKey = this.getPrefixedKey(key);
      this.app.$set(this.__data__[eventDataKey], skipKey, value);
      this.refreshEventData();
    };

    VueLocalStore.prototype.get = function getPrefixedKey(key) {
      var eventDataKey = this.options.eventDataKey;
      var skipKey = this.getPrefixedKey(key);
      return this.__data__[eventDataKey][skipKey];
    };

    VueLocalStore.prototype.remove = function removePrefixedKey(key) {
      var eventDataKey = this.options.eventDataKey;
      var skipKey = this.getPrefixedKey(key);
      this.app.$set(this.__data__[eventDataKey], skipKey, null);
      delete this.__data__[eventDataKey][skipKey];
      this.refreshEventData();
    };

    VueLocalStore.prototype.refreshEventData = function refreshEventData() {
      var eventDataKey = this.options.eventDataKey;
      this.setRoot(eventDataKey, this.__data__[eventDataKey] || Object.create(null));
    };

    VueLocalStore.prototype.getPrefixedKey = function getPrefixedKey(key) {
      var _this$options = this.options,
          uid = _this$options.uid,
          prefix = _this$options.prefix;
      return "".concat(prefix).concat(uid, "_").concat(key);
    };
  }

  function VueLocalStore() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    this.app = null;
    this.options = options;
    options.prefix = options.prefix || '';
    options.uid = options.uid || ANONYMOUS;
    options.versionNameKey = options.versionNameKey || VERSION_NAME_KEY;
    options.eventDataKey = options.eventDataKey || EVENT_DATA_KEY;
    return _Vue.observable(this);
  }

  initStore(VueLocalStore);
  initRoot(VueLocalStore);
  initEventData(VueLocalStore);

  VueLocalStore.install = install;
  VueLocalStore.version = '0.0.5';

  if (inBrowser && window.Vue) {
    window.Vue.use(VueLocalStore);
  }

  return VueLocalStore;

})));
