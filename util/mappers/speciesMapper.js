//Mapeamos las variables que nos retorna la Api de Star Wars en español
const transformMap = new Map([
    ['name', 'nombre'],
    ['classification', 'clasificacion'],
    ['designation', 'designacion'],
    ['average_height', 'altura'],
    ['skin_colors', 'color_piel'],
    ['hair_colors', 'color_cabellos'],
    ['eye_colors', 'color_ojos'],
    ['language', 'lenguaje']
  ]);

/* exporta una función llamada transformKeys que toma un objeto como argumento y 
  realiza una transformación en sus claves (nombres de atributos) según un mapeo definido en transformMap */   
module.exports.transformKeys = (obj) =>
Object.fromEntries(
    Object.entries(obj)
    .map(([k, v]) => [transformMap.get(k) || k, v])
);