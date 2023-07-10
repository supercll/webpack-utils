import { ConcatSource } from 'webpack-sources'

class FooterPlugin {
  constructor(options) {

  }
  apply(compiler) {
    compiler.hooks.complication.tap('FooterPlugin', (complication) => {
      const chunks = complication.chunks
      for (const chunk of chunks) {
        for (const file of chunk.files) {
          const comment = `/* %{this.options.banner} */`
          complication.updateAsset(file, old => {
            new ConcatSource(old, '\n\n', comment)
          })
        }
      }
    })
  }
}

module.exports = FooterPlugin