<template lang="pug">
  .confluence-grooming
    h2 Import Confluence to JIRA for Grooming

    .confluence-grooming__hint
      vs-alert(:hidden-content.sync="hintHidden" border color="#348ad6")
        template(#icon): i.bx.bx-info-circle
        template(#title) How to Use?
        ul.retro-importer__hint-items
          li Select grooming document.
          li Click Send [#[i.bx.bx-send]] button.

    vs-row(align="center")
      vs-select(
        v-model="grooming"
        :key="groomings.length"
        filter
        placeholder="Select Grooming Document"
        ): vs-option(
        v-for="grooming in groomings"
        :key="grooming.id"
        :label="grooming.title"
        :value="`${grooming.id}`"
        ) {{ grooming.title }}

      .confluence-grooming__button-import
        vs-button(
          :disabled="!grooming"
          icon
          color="#489ae4"
          @click.native="doSaveJira"
          ): i.bx.bx-send
</template>

<script>
import axios from 'axios';
import catchify from 'catchify';

export default {
  data: () => ({
    hintHidden: true,

    grooming: '',
    groomings: [],
  }),

  async mounted () {
    const loading = this.$vs.load({
      text: 'Preparing data...',
    });

    const [err, resp] = await catchify(axios.get('/api/get-recent-groomings'));

    loading.close();

    if (!err) {
      this.groomings = resp.data;
    } else {
      this.$vs.notification({
        position: 'bottom-right',
        duration: 5000,
        color: 'danger',
        title: 'Get Groomings Data Failed!',
        text: err.message,
      });
    }
  },

  methods: {
    async doSaveJira () {
      const loading = this.$vs.load({
        text: 'Exporting to JIRA...',
      });

      const [err, resp] = await catchify(axios.post('/api/post-grooming-for-jira', {
        doc_id: this.grooming,
      }));

      if (!err) {
        const notif = this.$vs.notification({
          position: 'bottom-right',
          duration: 10000,
          color: '#363448',
          title: 'Export Success!',
          text: 'Grooming document has been exported to JIRA. Click here to Visit Backlog page.',
          onClick: () => {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.setAttribute('target', '_blank');
            a.setAttribute('href', resp.data.url);
            a.addEventListener('click', (e) => {
              a.remove();
              notif.close();
            });

            document.body.append(a);

            a.click();
          },
        });
      } else {
        this.$vs.notification({
          position: 'bottom-right',
          duration: 5000,
          color: 'danger',
          title: 'Export Failed!',
          text: err.message,
        });
      }

      loading.close();
    },
  },
};

</script>

<style lang="scss" scoped>
.vs-select-content {
  max-width: 288px;
}

.confluence-grooming {
  &__hint {
    margin-bottom: 24px;
  }

  &__button-import {
    margin-left: 8px;
  }
}
</style>
