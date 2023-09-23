//Mapeamos las variables que nos retorna la Api de Star Wars en español
const transformMap = new Map([
    ['name', 'nombre'],
    ['rotation_period', 'periodo_rotacion'],
    ['orbital_period', 'periodo_orbita'],
    ['diameter', 'diametro'],
    ['climate', 'clima'],
    ['gravity', 'gravedad'],
    ['terrain', 'terreno']
  ]);

/* exporta una función llamada transformKeys que toma un objeto como argumento y 
  realiza una transformación en sus claves (nombres de atributos) según un mapeo definido en transformMap */ 
module.exports.transformKeys = (obj) =>
Object.fromEntries(
    Object.entries(obj)
    .map(([k, v]) => [transformMap.get(k) || k, v])
);