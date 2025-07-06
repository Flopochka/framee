import postcssPresetEnv from 'postcss-preset-env'
import autoprefixer from 'autoprefixer'
import postcssNormalize from 'postcss-normalize'
import postcssFlexbugsFixes from 'postcss-flexbugs-fixes'
import postcssCustomProperties from 'postcss-custom-properties'

export default {
  plugins: [
    postcssPresetEnv({
      stage: 1,
      features: {
        'nesting-rules': true,
        'gap-properties': true
      }
    }),
    postcssFlexbugsFixes(),
    postcssCustomProperties({ preserve: true }), // ключевой момент
    autoprefixer(),
    postcssNormalize()
  ]
}
