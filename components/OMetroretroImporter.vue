<template lang="pug">
  .retro-importer
    h2 Import Metro Retro to Confluence
    .retro-importer__editor: codemirror(
      v-model="json"
      :options="cmOption"
      )

    div(style="margin-top:24px")
      vs-button(
        square
        flat
        gradient
        color="#2e3540"
        size="default"
        @click.native="doImport"
        ) Import to Confluence
</template>

<script>
import axios from 'axios';
import catchify from 'catchify';

export default {
  data: () => ({
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
