import VueLocalStore from './instance';
import { install } from './install';
import {
  inBrowser,
} from './utils';

VueLocalStore.install = install;
VueLocalStore.version = '0.0.5';

if (inBrowser && window.Vue) {
  window.Vue.use(VueLocalStore);
}

export default VueLocalStore;
