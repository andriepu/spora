<template lang="pug">
  .retro-importer
    h2 Export Metro Retro to Confluence

    .retro-importer__hint
        p-fieldset(collapsed toggleable legend="How to Use?")
          ul
            li Make sure #[strong Action Items] area on MetroRetro exacly named as #[strong Actions].
            li
              | Copy #[strong JSON] of MetroRetro data.
              ul
                li Click #[strong Export] that located on the right-top of page.
                li Select #[strong JSON] for the Export Format.
                li Click #[strong View Raw].
                li Click #[strong Copy To Clipboard].

            li Paste here.
            li Click #[strong Create Retro Document].

    .retro-importer__editor: codemirror(
      v-model="json"
      :options="$options.CM_OPTIONS"
      )

    .p-d-flex.p-ai-center.p-mt-3
      p-button.p-mr-4(
        :class="result ? 'p-button-success' : ''"
        :disabled="!json || result"
        icon="pi pi-angle-double-right"
        label="Create Retro Document"
        type="button"
        @click.native="doCreateRetro"
        )

      template(v-if="result")
        span
          | #[i.pi.pi-check.p-mr-1]
          | Click
          a.p-mx-1(
            v-tooltip.top="result.title"
            :href="result.url"
            target="_blank"
            ) here
          | to visit the page.
</template>

<script>
import PButton from 'primevue/button';
import PMessage from 'primevue/message';
import PFieldset from 'primevue/fieldset';

import axios from 'axios';
import catchify from 'catchify';

export default {
  components: {
    PButton,
    PMessage,
    PFieldset,
  },

  CM_OPTIONS: {
    tabSize: 4,
    styleActiveLine: true,
    lineNumbers: true,
    line: true,
    foldGutter: true,
    styleSelectedText: true,
    mode: 'text/javascript',
    keyMap: 'sublime',
    matchBrackets: true,
    showCursorWhenSelecting: true,
    theme: 'idea',
    extraKeys: { Ctrl: 'autocomplete' },
    hintOptions: {
      completeSingle: false,
    },
  },

  data: () => ({
    json: '',
    result: null,
  }),

  methods: {
    async doCreateRetro () {
      const loader = this.$loading.show();

      const [err, resp] = await catchify(
        axios.post('/api/confluence/retro/new', {
          json: window.btoa(this.json),
        }),
      );

      loader.hide();

      if (err) {
        this.$toast.add({
          severity: 'error',
          summary: 'Create Retro Failed!',
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
};

</script>

<style lang="scss" scoped>
.retro-importer {
  &__editor {
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
  }

  &__hint {
    margin-bottom: 20px;
  }

  /deep/ {
    .CodeMirror {
      height: 450px !important;
    }

    .CodeMirror-linenumber {
      padding-right: 1rem;
    }

    .CodeMirror-hscrollbar,
    .CodeMirror-vscrollbar {
      display: none !important;
    }
  }
}
</style>
