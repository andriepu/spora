import { sample } from 'lodash';
import Vue from 'vue';
import Loading from 'vue-loading-overlay';

import 'vue-loading-overlay/dist/vue-loading.css';

Vue.use(Loading, {
  color: '#e31e52',
  loader: sample(['spinner', 'dots', 'bars']),
});
