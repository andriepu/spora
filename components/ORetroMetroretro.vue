<template lang="pug">
  .retro-importer
    h2 Export Metro Retro to Confluence

    .retro-importer__hint
      p-accordion
        p-accordion-tab(header="How to Use?")
          ul.retro-importer__hint-items
            li Make sure #[strong Action Items] area on MetroRetro exacly named as #[strong Actions].
            li
              | Copy #[strong JSON] of MetroRetro data from the #[strong Export] menu on the right-top of page.
              ul
                li Clik #[strong Export].
                li Select #[strong JSON] for #[strong Export Format].
                li Click #[strong View Raw].
                li Click #[strong Copy To Clipboard].

            li Paste here.
            li Click #[i.bx.bx-export] #[strong Export to Confluence].

    .retro-importer__editor: codemirror(
      v-model="json"
      :options="$options.CM_OPTIONS"
      )

    .p-mt-3
      p-button.p-button-outlined(
        :disabled="!json"
        icon="pi pi-angle-double-right"
        label="Export to Confluence"
        type="button"
        @click.native="doSaveConfluence"
        )
</template>

<script>
import PButton from 'primevue/button';
import PAccordion from 'primevue/accordion';
import PAccordionTab from 'primevue/accordiontab';

import axios from 'axios';
import catchify from 'catchify';

export default {
  components: {
    PButton,
    PAccordion,
    PAccordionTab,
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
    hintHidden: true,

    json: '',
  }),

  methods: {
    async doSaveConfluence () {
      const [err, resp] = await catchify(
        await axios.post('/api/post-retro-for-confluence', {
          json: window.btoa(this.json),
        }),
      );

      if (!err) {
        console.log('sukses', resp.data.url);
        /* const notif = this.$vs.notification({
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
        */
      } else {
        /*
        this.$vs.notification({
          position: 'bottom-right',
          duration: 5000,
          color: 'danger',
          title: 'Export Failed!',
          text: err.message,
        });
        */
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
