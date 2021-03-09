<template lang="pug">
  .jira-grooming
    h2 Create Grooming Document

    .jira-grooming__hint.p-mt-4
      p-fieldset(collapsed toggleable legend="How to Use?")
        ul
          li Select sprint section that containing tasks that ready for grooming.
          li Select tasks that you want to take for grooming.
          li Click #[strong Export for Grooming].
          li Choose whether tasks should be appended to #[strong existing document] or #[strong create a new document].

    .p-fluid.p-mb-3: .p-field
      label(for="sprintDropdown") Select section for Grooming
      p-dropdown(
        v-model="selectedSprint"
        filter
        inputId="sprintDropdown"
        :options="futuresSprint"
        optionLabel="name"
        optionValue="id"
        placeholder="None"
        style="width:250px"
        @input="doGetIssues"
        )

    template(v-if="isIssuesFetched")
      p-divider.p-mt-5.p-mb-5

      template(v-if="!issues.length")
        .jira-grooming__empty
          | No issues exist on this section. Please select another section.

      template(v-else)
        p-toolbar
          template(#left)
            p-button(
              :disabled="!selectedIssues.length"
              icon="pi pi-plus"
              label="Export for Grooming"
              @click="doPrepareExport"
              )

            p-overlay-panel(ref="op")
              .p-mb-3 Where do you want to export selected tasks?

              .p-d-flex.p-ai-center.p-mb-2
                p-radio-button.p-mr-2(
                  v-model="isExportNew"
                  id="createNew"
                  :value="true"
                  )
                label(for="createNew") New Document

              .p-d-flex.p-ai-center
                p-radio-button.p-mr-2(
                  v-model="isExportNew"
                  id="addToExisting"
                  :value="false"
                  )

                label(for="addToExisting") Existing Document

                p-dropdown(
                  v-model="selectedGrooming"
                  :disabled="isExportNew"
                  :options="groomings"
                  optionLabel="title"
                  optionValue="id"
                  placeholder="Select existing document"
                  style="width:220px"
                  )

              p-divider

              p-button.p-button-sm(
                label="Export"
                @click="doExportGrooming"
                )

        .jira-grooming__list
          p-data-table(
            dataKey="id"
            :selection.sync="selectedIssues"
            :value="issues"
            )

            p-column(
              selectionMode="multiple"
              headerStyle="width:3rem"
              )

            p-column(
              field="key"
              header="Key"
              headerStyle="width:160px"
              )

            p-column(field="summary" header="Summary")

            p-column(
              bodyClass="p-text-right"
              field="story_points"
              header="Points"
              headerClass="p-text-right"
              headerStyle="width:100px"
              )

            p-column(
              bodyClass="p-text-center"
              header="Actions"
              headerClass="p-text-center"
              headerStyle="width:120px"
              ): template(#body="{ data }")
              p-button.p-button-rounded.p-button-text(
                icon="pi pi-window-maximize"
                title="Open detail popup"
                @click="() => slotProps.data"
                )

              a(:href="getIssueUrl(data.key)" target="_blank")
                p-button.p-button-rounded.p-button-text(
                  icon="pi pi-external-link"
                  title="Open JIRA page"
                  )
</template>

<script>
import PButton from 'primevue/button';
import PDivider from 'primevue/divider';
import PDropdown from 'primevue/dropdown';
import PDataTable from 'primevue/datatable';
import PColumn from 'primevue/column';
import PFieldset from 'primevue/fieldset';
import POverlayPanel from 'primevue/overlaypanel';
import PRadioButton from 'primevue/radiobutton';
import PToolbar from 'primevue/toolbar';

import axios from 'axios';
import catchify from 'catchify';

export default {
  components: {
    PButton,
    PColumn,
    PDataTable,
    PDivider,
    PDropdown,
    PFieldset,
    POverlayPanel,
    PRadioButton,
    PToolbar,
  },

  data: () => ({
    isExportNew: true,
    isIssuesFetched: false,

    issues: [],
    futuresSprint: [],
    groomings: [],

    selectedGrooming: null,
    selectedIssues: [],
    selectedSprint: null,
  }),

  async mounted () {
    const [err, resp] = await catchify(axios.get('/api/get-sprints', {
      params: { state: 'future' },
    }));

    if (err) {
      // TODO
    } else {
      const { futures } = resp.data;
      this.futuresSprint = futures;
    }
  },

  methods: {
    getIssueUrl (key) {
      return new URL(`/browse/${key}`, process.env.JIRA_URL).href;
    },

    async doGetIssues (sprintId) {
      this.isIssuesFetched = false;

      const [err, resp] = await catchify(axios.get('/api/get-sprint-issues', {
        params: { sprintId },
      }));

      this.isIssuesFetched = true;

      if (!err) {
        this.selectedIssues = [];
        this.issues = resp.data.sort((a, b) => (
          (b.story_points || Infinity) - (a.story_points || Infinity)
        ));
      } else {
        /* this.$vs.notification({
          position: 'bottom-right',
          duration: 5000,
          color: 'danger',
          title: 'Get Issues Failed!',
          text: err.message,
        }); */
      }
    },

    async doExportGrooming () {
      const [err, resp] = await catchify(
        axios.post('/api/post-grooming-document', {
          issues: this.selectedIssues.map(({ key }) => key),
        }),
      );

      if (err) {
        // TODO
      } else {
        console.log('sukses', resp.data.url);
      }
    },

    async doPrepareExport (e) {
      this.$refs.op.toggle(e);

      if (!this.groomings.length) {
        const [err, resp] = await catchify(
          axios.get('/api/get-recent-groomings'),
        );

        if (err) {
          // TODO
        } else {
          this.groomings = resp.data.map(grooming => ({
            ...grooming,
            title$short: grooming.title.replace(/^.*- /, ''),
          }));
        }
      }
    },
  },
};

</script>

<style lang="scss" scoped>
.jira-grooming {
  &__empty,
  &__list {
    margin-top: 30px;
  }

  &__expand-content {
    height: 230px;
    overflow: hidden;
    position: relative;

    &::after {
      content: ' ';
      background: linear-gradient(0deg, rgba(249, 252, 253, 0.8) 30%, rgba(221, 221, 221, 0) 100%);
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 90px;
    }
  }

  &__hint {
    margin-bottom: 2rem;
  }

  &__button-import {
    margin-left: 8px;
  }

  &__export {
    margin-top: 24px;
  }
}
</style>
