const path = require('path');

module.exports = {
    entry: './src/main.js', // Il punto di partenza
    output: {
        filename: 'bundle.js', // Il file finale "frullato"
        path: path.resolve(__dirname, 'dist'), // La cartella di uscita
    },
    mode: 'development', // Per ora usiamo modalità sviluppo
};