<template lang="pug">
  .jira-grooming
    h2 Export JIRA to Confluence for Grooming

    .jira-grooming__hint
      vs-alert(:hidden-content.sync="hintHidden" border color="#348ad6")
        template(#icon): i.bx.bx-info-circle
        template(#title) How to Use?
        ul.jira-grooming__hint-items
          li Select sprint section that containing tasks that ready for grooming.
          li Click import [#[i.bx.bx-import]] button.
          li Select tasks that you want to take for grooming.
          li Click #[i.bx.bx-export] #[strong Export to Confluence].

    vs-row(align="center")
      vs-select(
        v-model="sprint"
        :key="futuresSprint.length"
        filter
        placeholder="Select Section for Grooming"
        ): vs-option(
        v-for="sprint in futuresSprint"
        :key="sprint.id"
        :label="sprint.name"
        :value="`${sprint.id}`"
        ) {{ sprint.name }}

      .jira-grooming__button-import
        vs-button(
          :disabled="!sprint"
          icon
          color="#489ae4"
          @click.native="doGetIssues(sprint)"
          ): i.bx.bx-import

    template(v-if="isIssuesFetched")
      template(v-if="!issues.length")
        .jira-grooming__empty
          | No issues exist on the section. Please select another section.

      template(v-else)
        .jira-grooming__table
          vs-table(v-model="selectedIssues" striped)
            template(#thead)
              vs-tr
                vs-th
                  vs-checkbox(
                    v-model="allIssuesSelected"
                    :indeterminate="selectedIssues.length === issues.length"
                    @change="onAllSelectedChange"
                    )
                vs-th Key
                vs-th Summary
                vs-th Story Points
            template(#tbody)
              vs-tr(v-for="issue in issues" :key="issue.id")
                vs-td
                  vs-checkbox(:val="issue" v-model="selectedIssues" @click.stop="")
                vs-td
                  a(:href="getIssueUrl(issue.key)" target="_blank" @click.stop="")
                    | {{ issue.key }}
                vs-td {{ issue.summary }}
                vs-td(style="text-align:right") {{ issue.story_points || '-' }}

                template(#expand)
                  vs-row.jira-grooming__table-expand(justify="center")
                    vs-col(offset="1" w="4")
                      h4 Implementation Detail
                      .jira-grooming__expand-content(v-html="wikiToHtml(issue.description)")

                    vs-col(w="4")
                      h4 Constraints & Assumptions
                      .jira-grooming__expand-content(v-html="wikiToHtml(issue.notes)")

                    vs-col(w="3")
                      h4 Acceptance Criteria
                      template(v-if="!issue.acceptances.length")
                        span -
                      template(v-else)
                        ul.jira-grooming__expand-content: li(
                          v-for="acc in issue.acceptances"
                          v-html="htmlNewline(acc)"
                          :key="acc"
                          )

        .jira-grooming__export
          vs-button(
            :disabled="!selectedIssues.length"
            color="#489ae4"
            @click.native="doSaveConfluence"
            ): | #[i.bx.bx-export] &nbsp; Export to Confluence

</template>

<script>
import j2m from 'jira2md';
import axios from 'axios';
import catchify from 'catchify';

export default {
  data: () => ({
    isIssuesFetched: false,

    activeSprint: null,
    futuresSprint: [],
    hintHidden: true,

    sprint: '',
    issues: [],

    selectedIssues: [],
    allIssuesSelected: false,
  }),

  async mounted () {
    const loading = this.$vs.load({
      text: 'Preparing data...',
    });

    const [err, resp] = await catchify(axios.get('/api/get-sprints', {
      params: { state: 'active,future' },
    }));

    loading.close();

    if (!err) {
      const { futures, active } = resp.data;

      this.futuresSprint = futures;
      this.activeSprint = active;
    } else {
      this.$vs.notification({
        position: 'bottom-right',
        duration: 5000,
        color: 'danger',
        title: 'Get Sprint Data Failed!',
        text: err.message,
      });
    }
  },

  methods: {
    wikiToHtml (wikiSyntax) {
      return j2m.jira_to_html(wikiSyntax);
    },
    getIssueUrl (key) {
      return new URL(`/browse/${key}`, process.env.JIRA_URL).href;
    },

    htmlNewline (str) {
      return str.replace(/\n+/g, '<br>');
    },

    async doGetIssues (sprintId) {
      this.isIssuesFetched = false;

      const loading = this.$vs.load({
        text: 'Fetching issues...',
      });

      const [err, resp] = await catchify(axios.get('/api/get-sprint-issues', {
        params: { sprintId },
      }));

      this.isIssuesFetched = true;

      loading.close();

      if (!err) {
        this.issues = resp.data.sort((a, b) => (
          (b.story_points || Infinity) - (a.story_points || Infinity)
        ));
        this.selectedIssues = this.issues.filter(issue => !issue.story_points);
      } else {
        this.$vs.notification({
          position: 'bottom-right',
          duration: 5000,
          color: 'danger',
          title: 'Get Issues Failed!',
          text: err.message,
        });
      }
    },

    async doSaveConfluence () {
      const loading = this.$vs.load({
        text: 'Exporting to Confluence...',
      });

      const path = '/api/post-grooming-for-confluence';
      const [err, resp] = await catchify(axios.post(path, {
        title: `Grooming @${this.activeSprint.name}`,
        issues: this.selectedIssues.map(({ key }) => key),
      }));

      if (!err) {
        const notif = this.$vs.notification({
          position: 'bottom-right',
          duration: 10000,
          color: '#363448',
          title: 'Export Success!',
          text: `"${resp.data.title}" has been exported to Confluence. Click here to Visit the page.`,
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

    onAllSelectedChange () {
      this.selectedIssues = this.$vs.checkAll(this.selectedIssues, this.issues);
    },
  },
};

</script>

<style lang="scss" scoped>
.jira-grooming {
  &__empty,
  &__table {
    margin-top: 30px;
  }

  &__table-expand {
    padding: 12px 0 20px;
    border-top: 1px solid #ddd;
    margin-bottom: 12px;
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
    margin-bottom: 24px;
  }

  &__button-import {
    margin-left: 8px;
  }

  &__export {
    margin-top: 24px;
  }
}
</style>
