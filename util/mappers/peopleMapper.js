//Mapeamos las variables que nos retorna la Api de Star Wars en español
const transformMap = new Map([
    ['name', 'nombre'],
    ['height', 'altura'],
    ['mass', 'masa'],
    ['hair_color', 'color_cabello'],
    ['skin_color', 'color_piel'],
    ['eye_color', 'color_ojos'],
    ['birth_year', 'fecha_nacimiento'],
    ['gender', 'genero']
  ]);

/* exporta una función llamada transformKeys que toma un objeto como argumento y 
  realiza una transformación en sus claves (nombres de atributos) según un mapeo definido en transformMap */ 
module.exports.transformKeys = (obj) =>
Object.fromEntries(
    Object.entries(obj)
    .map(([k, v]) => [transformMap.get(k) || k, v])
);