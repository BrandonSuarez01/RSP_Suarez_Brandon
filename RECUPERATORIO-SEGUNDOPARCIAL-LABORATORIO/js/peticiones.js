export function obtenerDatos(url) {
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
            throw new Error(`Error de red - Código: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Desde la peticion', data);
           return data;
        })
        .catch(error => {
            alert('Error en la solicitud');
            console.error('Error en la solicitud:', error);
            throw error;
    });
}

export function agregarVehiculo(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log('La solicitud se completó con éxito: ', xhr.responseText);
                callback(null, xhr.responseText);
            } else {
                alert('Error en la solicitud, verifique que los datos ingresados sean correctos');
                callback('Error en la solicitud: ' + xhr.statusText);
            }
        }
    };

    xhr.send(data);
}

export async function modificarVehiculo(url, datos) {
    try {
      const respuesta = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
      });
  
      if (!respuesta.ok) {
        throw new Error(`Error en la solicitud: ${respuesta.status} ${respuesta.statusText}`);
      }
  
      const datosRespuesta = await respuesta.text();
      return datosRespuesta;
    } catch (error) {

      console.error('Error:', error.message);
      throw error; 

    }
}

export async function eliminarVehiculo(url, id) {
    try {

        const datos = { id: id };
        const respuesta = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        });

        if (!respuesta.ok) {
            throw new Error(`Error en la solicitud: ${respuesta.status} ${respuesta.statusText}`);
        }

        const datosRespuesta = await respuesta.text();
        return datosRespuesta;

    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}




