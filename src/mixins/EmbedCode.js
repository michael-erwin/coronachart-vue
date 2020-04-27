import qs from 'query-string'
export default {
  data () {
    return {
      window_options: {
        width: 800,
        height: 500,
        scrollbars: 1,
        resizable: 1,
        top: 50,
        left: (screen.width - 800) / 2
      }
    }
  },
  methods: {
    getEmbedText (path, width='auto') {
      const id = 'fr_' + Math.random().toString(16).substr(2, 5)
      const url = window.location.origin
      const maxw = width === 'auto' ? '' : `;max-width:${width}`
      return `<div style="margin:auto${maxw}">
<iframe src="${url}\/embeds\/${path}&id=${id}"
  id="${id}" allowtransparency="true" frameborder="0" width="100%" 
><\/iframe>
<script>
  (function(){
    var i='${id}';var f=document.getElementById(i);
    window.addEventListener('message', function(m){
      try {var d=m.data;if(d.i===i) f.height=d.v+'px'}catch(e){}
  }, false);}())
<\/script>
<\/div>`;
    },
    makeHtmlPageText (content='No code', title='Preview Embed') {
      return `<html>
      <head><title>${title}</title></head>
      <body bgcolor="#505050">${content}</body>
    </html>`
    },
    previewCode (code) {
      const html = this.makeHtmlPageText(code)
      const width = screen.width * 0.8
      const height = screen.height * 0.8
      const left = (screen.width - width) / 2
      const options = `width=${width}, height=${height}, resizable=1,`
                    + `scrollbars=1, top=50, left=${left}`
      const new_window = window.open("", "_blank", options)
      new_window.document.open()
      new_window.document.write(html)
      new_window.document.close()
    },
  }
}