const { resolve } = require('path')
module.exports = ctx => ({
 map: ctx.options.map,
 plugins: [
  require('postcss-simple-vars')({
   /*variables: function() {
    return require(resolve(process.cwd(), 'config/colors'))
   },
   onVariables: function(variables) {
    console.log('CSS Variables')
    console.log(JSON.stringify(variables, null, 2))
   },*/
  }),
  require('postcss-import')({ root: ctx.file.dirname }),
  require('postcss-nested')({ root: ctx.file.dirname }),
  require('autoprefixer')({
   browsers: ['last 2 versions', 'Safari 8', 'ie > 9'],
  }),
 ],
})
