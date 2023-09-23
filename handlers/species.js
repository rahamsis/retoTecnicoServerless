const axios = require('axios');// importamos axios para solicitudes HTTP
const AWS = require('aws-sdk');// importamos la biblioteca AWS SDK
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' }); //hacemos uso de la DB DynamoDB de AWS
const  mapper = require('../util/mappers/speciesMapper') //importamos el mapeo de lo que responderemos

// Exportamos la funcion asyncrona para listar la especies 
module.exports.getSpecies = async (event) => {
  try {

    // conectamos a la DB
    const params = {
      TableName: 'swSpecies',
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
      const response = await axios.get(`https://swapi.dev/api/species/${event}/`);
      // almacenamos la data en una variable llamada data
      const data = response.data;

      //si la data contiene registros la la mapeamos a conveniencia y almacenamos en una variable
      if (data) {
        const dataApi = {
          nombre: data.name,
          clasificacion: data.classification,
          designacion: data.designation,
          altura: data.average_height,
          color_piel: data.skin_colors,
          color_cabellos: data.hair_colors,
          color_ojos: data.eye_colors,
          lenguaje: data.language
        };

        //mapeamos la misma data para guardarla en nuestra tabla de DynamoDB
        const params = {
          TableName: 'swSpecies',
          Item: {
            id: event,
            name: data.name,
            classification: data.classification,
            designation: data.designation,
            average_height: data.average_height,
            skin_colors: data.skin_colors,
            hair_colors: data.hair_colors,
            eye_colors: data.eye_colors,
            language: data.language
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

//exportamos la función asyncrona para añadir especies
module.exports.addSpecies = async (data) => {
  try {

    //generamos un numero random
    const number = Math.random();
    // Multiplica el número aleatorio por 9 dígitos (10^9) para obtener un número entre 0 y 999,999,999
    const newId = Math.floor(number * 10000);

    //mapeamos los datos a salvar 
    const params = {
      TableName: 'swSpecies',
      Item: {
        id: newId,
        name: data.name,
        classification: data.classification,
        designation: data.designation,
        average_height: data.average_height,
        skin_colors: data.skin_colors,
        hair_colors: data.hair_colors,
        eye_colors: data.eye_colors,
        language: data.language
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

//exportamos una funcion asyncrona de actualización de especies
module.exports.updateSpecies = async (data) => {
  try {

    //creamos nuestra consulta a nuestra tabla
    const params = {
      TableName: 'swSpecies',
      Key: {
        // Especifica las claves primarias para identificar el registro que deseas actualizar
        id: data.id,
      },
      UpdateExpression: 'SET #nombre = :valor1, classification = :valor2, designation = :valor3, average_height = :valor4, skin_colors = :valor5, hair_colors = :valor6, eye_colors = :valor7, #idioma = :valor8',
      ExpressionAttributeNames: {
        '#nombre': 'name', // Define el alias '#nombre' para 'name'
        '#idioma': 'language', // Define el alias '#nombre' para 'name'
      },
      ExpressionAttributeValues: {
        ':valor1': data.name,
        ':valor2': data.classification,
        ':valor3': data.designation,
        ':valor4': data.average_height,
        ':valor5': data.skin_colors,
        ':valor6': data.hair_colors,
        ':valor7': data.eye_colors,
        ':valor8': data.language,
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
  } catch (error) {//retornamos un error en caso falle
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error al actualizar el modelo' + error }),
    };
  }
};

// exportamos una función asyncrona para el borrado de registros de especies
module.exports.deleteSpecies = async (data) => {
  try {

    //preparamos nuestra tabla
    const params = {
      TableName: 'swSpecies',
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