// purge-css.js
const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const path = require('path');

async function runPurge() {
  try {
    // En lugar de dejar que PurgeCSS busque el archivo, pasamos la configuración directamente.
    const purgeCSSResult = await new PurgeCSS().purge({
      content: [
        './*.html',
        './componentes/*.html',
        './js/**/*.js',
        './menu_interactivo/*.js'
      ],
      css: ['./css/*.css'],
      safelist: {
        standard: [
          'show', 'fade', 'modal-open', 'modal-backdrop', 'collapsing', 'collapsed',
          'carousel-item-next', 'carousel-item-start', 'carousel-item-end',
          'is-invalid', 'd-none', 'd-block', 'd-flex',
          'active', 'activo', 'inactivo', 'btn-filtro-activo', 'btn-filtro-inactivo', 'boton-anadir',
          'alert', 'alert-danger', 'alert-warning', 'alert-success', 'alert-dismissible', 'btn-close'
        ],
        deep: [
          /^alert-/, /^modal-/, /^carousel/, /^aria-/
        ]
      }
    });

    const outputDir = './dist';
    if (!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir);
    }

    for (const result of purgeCSSResult) {
      const fileName = path.basename(result.file);
      const outputPath = path.join(outputDir, fileName);
      
      console.log(`✅ Purgando: ${result.file} -> ${outputPath}`);
      fs.writeFileSync(outputPath, result.css);
    }
    
    console.log('🎉 ¡CSS purgado con éxito! Revisa la carpeta ./dist');
  } catch (error) {
    console.error('❌ Error al purgar el CSS:', error);
  }
}

runPurge();