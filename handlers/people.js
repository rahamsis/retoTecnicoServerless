const axios = require('axios'); // importamos axios para solicitudes HTTP
const AWS = require('aws-sdk'); // importamos la biblioteca AWS SDK
const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' }); //hacemos uso de la DB DynamoDB de AWS
const  mapper = require('../util/mappers/peopleMapper') //importamos el mapeo de lo que responderemos

// Exportamos la funcion asyncrona para listar la personas 
module.exports.getPeople = async (event) => {
  try {

    // conectamos a la DB
    const params = {
      TableName: 'swPeople',
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
    } else { 

      // si no hay registros consultamos la API de Star Wars
      const response = await axios.get(`https://swapi.dev/api/people/${event}/`);
      // almacenamos la data en una variable llamada data
      const data = response.data;

      //si la data contiene registros la la mapeamos a conveniencia y almacenamos en una variable
      if (data) {
        const dataApi = {
          nombre: data.name,
          altura: data.height,
          peso: data.mass,
          cabello: data.hair_color,
          ojos: data.eye_color,
          piel: data.skin_color,
          nacimiento: data.birth_year,
          genero: data.gender,
        };

        //mapeamos la misma data para guardarla en nuestra tabla de DynamoDB
        const params = {
          TableName: 'swPeople',
          Item: {
            id: event,
            name: data.name,
            height: data.height,
            mass: data.mass,
            hair_color: data.hair_color,
            eye_color: data.eye_color,
            skin_color: data.skin_color,
            birth_year: data.birth_year,
            gender: data.gender,
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

//exportamos la función asyncrona para añadir personas
module.exports.addPeople = async (data) => {
  try {

    //generamos un numero random
    const number = Math.random();
    // Multiplica el número aleatorio por 9 dígitos (10^9) para obtener un número entre 0 y 999,999,999
    const newId = Math.floor(number * 10000);

    //mapeamos los datos a salvar 
    const params = {
      TableName: 'swPeople', 
      Item: {
        id: newId,
        name: data.name,
        height: data.height,
        mass: data.mass,
        hair_color: data.hair_color,
        eye_color: data.eye_color,
        skin_color: data.skin_color,
        birth_year: data.birth_year,
        gender: data.gender,
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

//exportamos una funcion asyncrona de actualización de personas
module.exports.updatePeople = async (data) => {
  try {

    //creamos nuestra consulta a nuestra tabla
    const params = {
      TableName: 'swPeople',
      Key: {
        // Especifica las claves primarias para identificar el registro que deseas actualizar
        id: data.id,
      },
      UpdateExpression: 'SET #nombre = :valor1,height = :valor2,mass = :valor3,hair_color = :valor4, eye_color = :valor5, skin_color = :valor6, birth_year = :valor7, gender = :valor8',
      ExpressionAttributeNames: {
        '#nombre': 'name', // Define el alias '#nombre' para 'name'
      },
      ExpressionAttributeValues: {
        ':valor1': data.name,
        ':valor2': data.height,
        ':valor3': data.mass,
        ':valor4': data.hair_color,
        ':valor5': data.eye_color,
        ':valor6': data.skin_color,
        ':valor7': data.birth_year,
        ':valor8': data.gender,
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

// exportamos una función asyncrona para el borrado de registros de personas
module.exports.deletePeople = async (data) => {
  try {

    //preparamos nuestra tabla
    const params = {
      TableName: 'swPeople',
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
