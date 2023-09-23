const axios = require('axios');// importamos axios para solicitudes HTTP
const AWS = require('aws-sdk'); // importamos la biblioteca AWS SDK
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' }); //hacemos uso de la DB DynamoDB de AWS
const  mapper = require('../util/mappers/planetsMapper'); //importamos el mapeo de lo que responderemos

// Exportamos la funcion asyncrona para listar la planetas 
module.exports.getPlanets = async (event) => {
  try {

    // conectamos a la DB
    const params = {
      TableName: 'swPlanets',
      Key: {
        id: event
      },
    };

    // consultamos por el key
    const existingItem = await dynamodb.get(params).promise();

    // en caso existan datos
    if (existingItem.Item) {

      // Aplica el mapeo de nombres de atributos
      const transformedResponse = mapper.transformKeys(existingItem.Item);

      //retorna los datos mapeados
      return {
        statusCode: 200,
        body: transformedResponse,
      };
    }
    else {

      // si no hay registros consultamos la API de Star Wars
      const response = await axios.get(`https://swapi.dev/api/planets/${event}/`);
      const data = response.data;

      if (data) {
        const dataApi = {
          nombre: data.name,
          periodo_rotacion: data.rotation_period,
          periodo_orbita: data.orbital_period,
          diametro: data.diameter,
          clima: data.climate,
          gravedad: data.gravity,
          terreno: data.terrain
        };

        //mapeamos la misma data para guardarla en nuestra tabla de DynamoDB
        const params = {
          TableName: 'swPlanets',
          Item: {
            id: event,
            name: data.name,
            rotation_period: data.rotation_period,
            orbital_period: data.orbital_period,
            diameter: data.diameter,
            climate: data.climate,
            gravity: data.gravity,
            terrain: data.terrain
          },
        };
        //guardamos la data
        await dynamodb.put(params).promise();

        //retornamos la data almacenada en la variable dataApi
        return {
          statusCode: 200,
          body: dataApi,
        };

      }

    }
    // en caso falle mostramos el error
  } catch (error) {
    return {
      statusCode: 500,
      body: 'Error al obtener datos de Star Wars API' + error,
    };
  }

};

//exportamos la función asyncrona para añadir planetas
module.exports.addPlanets = async (data) => {
  try {

    //generamos un numero random
    const number = Math.random();
    // Multiplica el número aleatorio por 9 dígitos (10^9) para obtener un número entre 0 y 999,999,999
    const newId = Math.floor(number * 10000);

    //mapeamos los datos a salvar 
    const params = {
      TableName: 'swPlanets',
      Item: {
        id: newId,
        name: data.name,
        rotation_period: data.rotation_period,
        orbital_period: data.orbital_period,
        diameter: data.diameter,
        climate: data.climate,
        gravity: data.gravity,
        terrain: data.terrain
      },
    };

    // guardamos en nuestra tabla 
    await dynamodb.put(params).promise();

    //retornamos un mensaje post guardado
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Registro agregado correctamente' }),
    };
  } catch (error) { // retornamos un error en caso falle
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al crear el modelo' + error }),
    };
  }
};

//exportamos una funcion asyncrona de actualización de planetas
module.exports.updatePlanets = async (data) => {
  try {

    //creamos nuestra consulta a nuestra tabla
    const params = {
      TableName: 'swPlanets',
      Key: {
        // Especifica las claves primarias para identificar el registro que deseas actualizar
        id: data.id,
      },
      UpdateExpression: 'SET #nombre = :valor1, rotation_period = :valor2, orbital_period = :valor3, diameter = :valor4, climate = :valor5, gravity = :valor6, terrain = :valor7',
      ExpressionAttributeNames: {
        '#nombre': 'name', // Define el alias '#nombre' para 'name'
      },
      ExpressionAttributeValues: {
        ':valor1': data.name,
        ':valor2': data.rotation_period,
        ':valor3': data.orbital_period,
        ':valor4': data.diameter,
        ':valor5': data.climate,
        ':valor6': data.gravity,
        ':valor7': data.terrain,
      },
      ReturnValues: 'ALL_NEW', // Esto devuelve el registro actualizado
    };

    // almacenamos el resultado del update
    const result = await dynamodb.update(params).promise();

    //retornamos un mensaje post update
    return {
      statusCode: 200,
      body: 'Registro actualizado con éxito',
      result, // Puedes incluir detalles del resultado si es necesario
    };
  } catch (error) { //retornamos un error en caso falle
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al actualizar el modelo' + error }),
    };
  }
};

// exportamos una función asyncrona para el borrado de registros de planetas
module.exports.deletePlanets = async (data) => {
  try {

    //preparamos nuestra tabla
    const params = {
      TableName: 'swPlanets',
      Key: {
        // Especifica las claves primarias para identificar el registro que deseas actualizar
        id: data.id,
      },
    };

    //ejecutamos el delete
    const result = await dynamodb.delete(params).promise();

    //retornamos un mensaje en caso el borrado sea exitoso
    return {
      statusCode: 200,
      body: 'Registro eliminado con éxito',
      result, // Puedes incluir detalles del resultado si es necesario
    };
  } catch (error) { //retornamos un error en caso falle
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al eliminar el modelo' + error }),
    };
  }
};