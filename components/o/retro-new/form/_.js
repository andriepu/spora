import axios from 'axios';
import catchify from 'catchify';
import PButton from 'primevue/button';

export default {
  components: {
    PButton,
  },

  data: () => ({
    form: '',
    result: null,
  }),

  methods: {
    async doSubmit () {
      const loader = this.$loading.show();

      const [err, resp] = await catchify(
        axios.post('/api/confluence/retro/create', {
          json: window.btoa(this.form),
        }).then(({ data }) => data),
      );

      loader.hide();

      if (err) {
        this.$toast.add({
          severity: 'error',
          summary: 'Create Retro Failed!',
          detail: err.response.data.errorMessages[0],
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

  CM_OPTIONS: {
    tabSize: 2,
    lineNumbers: true,
    mode: 'text/javascript',
    theme: 'idea',
  },
};
