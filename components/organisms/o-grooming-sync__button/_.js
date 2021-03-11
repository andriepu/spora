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
};
