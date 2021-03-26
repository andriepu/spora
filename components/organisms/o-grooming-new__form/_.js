import axios from 'axios';
import catchify from 'catchify';

import PButton from 'primevue/button';
import PColumn from 'primevue/column';
import PDataTable from 'primevue/datatable';
import PDivider from 'primevue/divider';
import PDropdown from 'primevue/dropdown';
import PToolbar from 'primevue/toolbar';

import {
  SUMMARY_KEY,
  STORY_POINTS_KEY,
} from '~/api/constants/customfields';

export default {
  SUMMARY_KEY,
  STORY_POINTS_KEY,

  components: {
    PButton,
    PColumn,
    PDataTable,
    PDivider,
    PDropdown,
    PToolbar,
  },

  data: () => ({
    isIssuesFetched: false,

    futuresSprint: [],
    issues: [],

    selectedIssues: [],
    selectedSprint: null,

    result: null,
  }),

  watch: {
    selectedIssues () {
      this.result = null;
    },
  },

  methods: {
    getIssueUrl (key) {
      return new URL(`/browse/${key}`, process.env.JIRA_URL).href;
    },

    async doGetIssues (sprintId) {
      this.isIssuesFetched = false;

      const loader = this.$loading.show();

      const [err, resp] = await catchify(
        axios.get('/api/jira/issues', { params: { sprintId } })
          .then(({ data }) => data),
      );

      loader.hide();

      this.isIssuesFetched = true;

      if (err) {
        this.selectedSprint = null;
        this.$toast.add({
          severity: 'error',
          summary: 'Get Issues Failed!',
          detail: err.message,
          life: 3000,
        });
      } else {
        this.selectedIssues = [];
        this.issues = resp.data.sort((a, b) => (
          (b[STORY_POINTS_KEY] || Infinity) - (a[STORY_POINTS_KEY] || Infinity)
        ));
      }
    },

    async doSubmit () {
      const loader = this.$loading.show();

      const [err, resp] = await catchify(
        axios.post('/api/confluence/groomings/create', {
          issues: this.selectedIssues.map(({ key }) => key),
        }).then(({ data }) => data),
      );

      loader.hide();

      if (err) {
        this.$toast.add({
          severity: 'error',
          summary: 'Export Grooming Failed!',
          detail: err.message,
          life: 3000,
        });
      } else {
        this.result = resp.data;

        this.$toast.add({
          life: 3000,
          severity: 'success',
          summary: 'Create Grooming Success!',
          detail: 'Grooming document is successfully created.',
        });
      }
    },
  },

  async mounted () {
    const loader = this.$loading.show();

    const [err, resp] = await catchify(
      axios.get('/api/jira/board', { params: { state: 'future' } })
        .then(({ data }) => data),
    );

    loader.hide();

    if (err) {
      this.$toast.add({
        severity: 'error',
        summary: 'Fetch Data Failed!',
        detail: err.message,
        life: 3000,
      });
    } else {
      this.futuresSprint = resp.data;
    }
  },
};
