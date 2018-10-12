const jsreport = require('jsreport')()
const client = require("jsreport-client")("http://localhost:9998", "m_user", "nms12345")


if (process.env.JSREPORT_CLI) {
  // export jsreport instance to make it possible to use jsreport-cli
  module.exports = jsreport
} else {
  jsreport.init().then(() => {
    // running
    console.log('server started....')
  }).catch((e) => {
    // error during startup
    console.error(e.stack)
    process.exit(1)
  })
}

/* aysnc function render(){
	const res = await client.render({
		template:{
			content: 'hello ',
			recipe: 'html',
			engine: 'handlebars'
		},
		data:{someText:'world!!'}
	})

	const bodyBuffer = await res.body()
	console.log(bodyBuffer.toString())
}

render().catch(console.error) */
