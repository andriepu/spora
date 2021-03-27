import PButton from 'primevue/button';

export default {
  components: {
    PButton,
  },

  props: {
    isLoading: { type: Boolean },

    isSuccess: { type: Boolean },
    isFailed: { type: Boolean },

    issueKey: { key: String },
  },

  computed: {
    issueUrl () {
      return new URL(`/browse/${this.issueKey}`, process.env.JIRA_URL).href;
    },
  },
};
