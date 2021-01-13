export function initEventData(VueLocalStore) {
  VueLocalStore.prototype.set = function setPrefixedKey(key, value) {
    const { eventDataKey } = this.options;
    const skipKey = this.getPrefixedKey(key);
    this.app.$set(this.__data__[eventDataKey], skipKey, value);
    this.refreshEventData();
  }
  
  VueLocalStore.prototype.get = function getPrefixedKey(key) {
    const { eventDataKey } = this.options;
    const skipKey = this.getPrefixedKey(key);
    return this.__data__[eventDataKey][skipKey];
  }
  
  VueLocalStore.prototype.remove = function removePrefixedKey(key) {
    const { eventDataKey } = this.options;
    const skipKey = this.getPrefixedKey(key);
    this.app.$set(this.__data__[eventDataKey], skipKey, null);
    delete this.__data__[eventDataKey][skipKey];
    this.refreshEventData();
  }

  VueLocalStore.prototype.refreshEventData = function refreshEventData() {
    const { eventDataKey } = this.options;
    this.setRoot(eventDataKey, this.__data__[eventDataKey] || Object.create(null));
  }

  VueLocalStore.prototype.getPrefixedKey = function getPrefixedKey(key) {
    const { uid, prefix } = this.options;
    return `${prefix}${uid}_${key}`;
  }
}
