# VueLocalStore

vue LocalStorage plugin with `prefix`, `unique id` injectable for vue2.x which can be control version by `version_name` feature.


## Basic Introduction

### create instance

Same as vue-router, create localStore instance

```js
// localStore.js
import Vue from 'vue';
import VueLocalStore from 'vue-localstore';

Vue.use(VueLocalStore);

const localStore = new VueLocalStore({
  versionName: 'test_v0.0.1',
  versionNameKey: 'version_name', // default
  eventDataKey: 'event_data', // default
  prefix: '', // default
  uid: 'anonymous', // default: can be changed later by `setUid`
});

export default localStore;
```

### inject to vue intance

```js
// main.js
import Vue from 'vue';
import localStore from './localStore';

new Vue({
  localStore,
}).$mount('#app');
```

### access in component

```js
// App.vue
export default {
  mounted() {
    console.log(this.$localStore);
  },
};
```


## API Introduction

### setUid(uid)

set prefixed uid content, `uid` will be concat as bellow:

#### params
1. uid
  - type: `string`
  - default: `anonymous`

```js
const prefixedKey = `${prefix}${uid}_${key}`;
```

#### demo
```js
export default {
  created() {
    this.$localStore.setUid('good_uid_30678444');
  },
};
```

### setRoot(key, value)

set localstorage to root key(real localstorage)

#### params
1. key
  - type: `string`
2. value
  - type: `any`

#### demo
```js
export default {
  created() {
    this.$localStore.setRoot('name', 'Johnny');
  },
};
```

### getRoot(key)

get localStorage root key's value

#### params
1. key
  - type: `string`

#### demo
```js
export default {
  created() {
    this.$localStore.getRoot('name');
  },
};
```

### removeRoot(key)

remove localStorage root key

#### params
1. key
  - type: `string`

#### demo
```js
export default {
  created() {
    this.$localStore.removeRoot('name');
  },
};
```

### set(key, value)

set event data key with value, the key will be prefixed.

#### params
1. key
  - type: `string`
  - desc: will be auto prefixed before editing
2. value
  - type: `any`

#### demo
```js
export default {
  created() {
    this.$localStore.set('name', 'Johnny');
  },
};
```

### get(key)

get event data key's value, the key will be prefixed.

#### params
1. key
  - type: `string`
  - desc: will be auto prefixed before editing

#### demo
```js
export default {
  created() {
    this.$localStore.set('name', 'Johnny');
  },
};
```

### remove(key)

remove event data key, the key will be prefixed.

#### params
1. key
  - type: `string`
  - desc: will be auto prefixed before editing

#### demo
```js
export default {
  created() {
    this.$localStore.remove('name');
  },
};
```

