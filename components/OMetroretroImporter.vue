<template lang="pug">
  .retro-importer
    h2 Import Metro Retro to Confluence

    .retro-importer__hint
      vs-alert(:hidden-content.sync="hintHidden" border color="#348ad6")
        template(#icon): i.bx.bx-info-circle
        template(#title) How to Use?
        ul.retro-importer__hint-items
          li Make sure #[strong Action Items] area on MetroRetro exacly named with #[strong Actions].
          li
            | Copy your #[strong JSON] of MetroRetro data from the #[strong Export] menu on the right-top of page.
            ul
              li Clik #[Export].
              li Select #[strong JSON] for #[strong Export Format].
              li Click #[strong View Raw].
              li Click #[strong Copy To Clipboard].

          li Paste here.
          li Finally, #[strong Import to Confluence].

    .retro-importer__editor: codemirror(
      v-model="json"
      :options="cmOption"
      )

    div(style="margin-top:24px")
      vs-button(
        :disabled="!json"
        square
        gradient
        color="primary"
        size="large"
        @click.native="doImport"
        ) Import to Confluence
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
    async doImport () {
      const loading = this.$vs.load({
        text: 'Posting to Confluence...',
      });

      const [err, { data }] = await catchify(await axios.post('/api/post-metroretro', {
        json: window.btoa(this.json),
      }));

      loading.close();

      if (!err) {
        const notif = this.$vs.notification({
          position: 'bottom-right',
          duration: 'none',
          color: '#363448',
          title: 'Import Success!',
          text: `"${data.title}" has been imported to Confluence. Click here to Visit the page.`,
          onClick: () => {
            const a = document.createElement('a');
            a.style.display = 'none';
            a.setAttribute('target', '_blank');
            a.setAttribute('href', data.url);
            a.addEventListener('click', (e) => {
              a.remove();
              notif.close();
            });
            document.body.append(a);
            a.click();
          },
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
