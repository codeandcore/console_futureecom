const path = require('path')

module.exports = {
  devServer: {
    port: 8081, // Replace with your desired port number
  },
  transpileDependencies: ['vuetify', 'cardknox-sdk-js'],
  pluginOptions: {
    critical: {
      base: path.resolve(__dirname, 'dist'),
      src: 'index.html',
      dest: 'index.html',
      inline: true,
      minify: true,
      extract: true,
      penthouse: {
        blockJSRequests: false
      } 
    }
  },
  configureWebpack: {
    resolve: {
      fallback: {
        "crypto": require.resolve("crypto-browserify"),
        "stream": false
      }
    }
  },
  chainWebpack: (config) => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap((options) => {
        options.compilerOptions.modules = [
          {
            preTransformNode(astEl) {
              if (process.env.NODE_ENV === 'production') {
                const { attrsMap, attrsList } = astEl
                const attrs = ['data-cy', ':data-cy', 'v-bind:data-cy']
                attrs.forEach((attr) => {
                  if (attrsMap[attr]) {
                    delete attrsMap[attr]
                    const index = attrsList.findIndex((x) => x.name === attr)
                    attrsList.splice(index, 1)
                  }
                })
                astEl = { ...astEl, attrsList }
              }
              return astEl
            }
          }
        ]
        return options
      })
  },

  css: {
    extract: { ignoreOrder: true },
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/styles/styles.scss";`
      }
    }
  }
}
