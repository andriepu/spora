import axios from 'axios';
import catchify from 'catchify';

import PButton from 'primevue/button';
import PColumn from 'primevue/column';
import PDataTable from 'primevue/datatable';
import PDropdown from 'primevue/dropdown';
import PSpinner from 'primevue/progressspinner';
import PTag from 'primevue/tag';
import PToolbar from 'primevue/toolbar';
import OGroomingSyncButton from '~/components/organisms/o-grooming-sync__button';
import UGroomingSync from '~/components/utilities/u-grooming-sync';

export default {
  components: {
    PButton,
    PColumn,
    PDataTable,
    PDropdown,
    PSpinner,
    PTag,
    PToolbar,
    OGroomingSyncButton,
    UGroomingSync,
  },

  data: () => ({
    isGroomingsFetched: false,

    groomings: [],
    issues: [],

    selectedGrooming: null,
    selectedIssues: [],
  }),

  methods: {
    getIssueUrl (key) {
      return new URL(`/browse/${key}`, process.env.JIRA_URL).href;
    },
    async doGetIssues (docId) {
      const loading = this.$loading.show();

      const [err, resp] = await catchify(
        axios.get(`/api/confluence/groomings/show/${docId}`)
          .then(({ data }) => data),
      );

      loading.hide();

      if (err) {
        this.selectedGrooming = null;
      } else {
        this.issues = resp.data.sort((a, b) => (
          (b.story_points || 0) - (a.story_points || 0)
        ));
      }
    },

    doSyncSelected () {
      this.selectedIssues.forEach(({ key }) => {
        this.$el.querySelector(`[data-x-sync-button="${key}"]`).click();
      });
    },
  },

  async mounted () {
    const loading = this.$loading.show();

    const [err, resp] = await catchify(
      axios.get('/api/confluence/groomings')
        .then(({ data }) => data),
    );

    this.isGroomingsFetched = true;
    loading.hide();

    if (err) {
      this.$toast.add({
        severity: 'error',
        summary: 'Get Groomings Failed!',
        detail: err.message,
        life: 3000,
      });
    } else {
      this.groomings = resp.data;
    }
  },
};
