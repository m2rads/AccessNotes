import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import postcssCustomProperties from 'postcss-custom-properties';

export default {
  plugins: [
    tailwindcss,
    autoprefixer,
    postcssCustomProperties({
      preserve: false // This option allows the plugin to replace Tailwind CSS classes with CSS variables
    }),
  ]
}
