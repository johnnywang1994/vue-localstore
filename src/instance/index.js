import { _Vue } from '../install';
import { initStore } from './init';
import { initRoot } from './root';
import { initEventData } from './event-data';
import {
  VERSION_NAME_KEY,
  EVENT_DATA_KEY,
  ANONYMOUS,
} from '../utils';

function VueLocalStore(options = {}) {
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

export default VueLocalStore;
