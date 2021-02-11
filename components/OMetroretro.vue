<template lang="pug">
  .retro-importer
    h2 Export Metro Retro to Confluence

    .retro-importer__hint
      vs-alert(:hidden-content.sync="hintHidden" border color="#348ad6")
        template(#icon): i.bx.bx-info-circle
        template(#title) How to Use?
        ul.retro-importer__hint-items
          li Make sure #[strong Action Items] area on MetroRetro exacly named with #[strong Actions].
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
      :options="cmOption"
      )

    div(style="margin-top:24px")
      vs-button(
        :disabled="!json"
        color="#489ae4"
        @click.native="doSaveConfluence"
        ): #[i.bx.bx-export] &nbsp; Export to Confluence
</template>

<script>
import axios from 'axios';
import catchify from 'catchify';

export default {
  data: () => ({
    hintHidden: true,

    json: '',
    cmOption: {
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
  }),

  methods: {
    async doSaveConfluence () {
      const loading = this.$vs.load({
        text: 'Exporting to Confluence...',
      });

      const [err, resp] = await catchify(await axios.post('/api/post-metroretro', {
        json: window.btoa(this.json),
      }));

      loading.close();

      if (!err) {
        const notif = this.$vs.notification({
          position: 'bottom-right',
          duration: 'none',
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

    .CodeMirror-hscrollbar,
    .CodeMirror-vscrollbar {
      display: none !important;
    }
  }
}
</style>
