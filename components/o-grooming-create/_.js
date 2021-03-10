import axios from 'axios';
import catchify from 'catchify';

import PButton from 'primevue/button';
import PColumn from 'primevue/column';
import PDataTable from 'primevue/datatable';
import PDivider from 'primevue/divider';
import PDropdown from 'primevue/dropdown';
import PToolbar from 'primevue/toolbar';

export default {
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

    selectedGrooming: null,
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
        axios.get('/api/jira/sprints/issues', { params: { sprintId } }),
      );

      loader.hide();

      this.isIssuesFetched = true;

      if (err) {
        this.$toast.add({
          severity: 'error',
          summary: 'Get Issues Failed!',
          detail: err.message,
          life: 3000,
        });
      } else {
        this.selectedIssues = [];
        this.issues = resp.data.sort((a, b) => (
          (b.story_points || Infinity) - (a.story_points || Infinity)
        ));
      }
    },

    async doSubmit () {
      const loader = this.$loading.show();

      const [err, resp] = await catchify(
        axios.post('/api/confluence/groomings/create', {
          issues: this.selectedIssues.map(({ key }) => key),
        }),
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
          summary: 'Create Retro Success!',
          detail: 'Retro document is successfully created.',
        });
      }
    },
  },

  async mounted () {
    const loader = this.$loading.show();

    const [err, resp] = await catchify(
      axios.get('/api/jira/sprints', { params: { state: 'future' } }),
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
