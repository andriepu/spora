import Vue from 'vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

import 'primevue/resources/primevue.min.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

Vue.directive('tooltip', Tooltip);
Vue.use(ToastService);
Vue.use(PrimeVue, {
  theme: 'saga-blue',
  ripple: true,
});
