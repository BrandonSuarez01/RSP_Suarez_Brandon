//CREAR CABECERA PARA LISTA CON OBJETOS DIFERENTES
function crearCabeceraVariosObjetos(data) {

    const cabecera = document.createElement("thead");
    const tr = document.createElement("tr");

    // Función para obtener campos únicos
    function obtenerCamposUnicos(data) {
        const camposUnicos = [];

        for (const objeto of data) {
            for (const key in objeto) {
                if (!camposUnicos.includes(key)) {
                    camposUnicos.push(key);
                }
            }
        }
        return camposUnicos;
    }

    const camposUnicos = obtenerCamposUnicos(data);

    // Crear ths para los campos únicos
    for (const campo of camposUnicos) {
        const th = document.createElement("th");
        th.textContent = campo;
        tr.appendChild(th);
    }

    cabecera.appendChild(tr);
    console.log("cabecera creada");
    return cabecera;
}
//CREAR CUERPO PARA LISTA CON OBJETOS DIFERENTES:
function crearCuerpoVariosObjetos(data){
    const cuerpo = document.createElement("tbody");

    // Función para obtener atributos únicos
    function obtenerAtributosUnicos(data) {
        const atributosUnicos = [];

        for (const objeto of data) {
            for (const atributo in objeto) {
                if (!atributosUnicos.includes(atributo)) {
                    atributosUnicos.push(atributo);
                }
            }
        }

        return atributosUnicos;
    }

    const atributosUnicos = obtenerAtributosUnicos(data);

    data.forEach(element => {
        const fila = document.createElement("tr");

        fila.setAttribute("data-id", element.id);
        
        for(const atributo of atributosUnicos) {
            const td = document.createElement("td");
            if (atributo in element) {
                td.textContent = element[atributo];
            }
            fila.appendChild(td);
            fila.classList.add("puntero");
        }

        cuerpo.appendChild(fila);
    });

    console.log("Cuerpo creado");
    return cuerpo;
}
//CREAR TABLA: (MODIFICAR A QUE FUNCIONES LLAMA SI SE TIENE UNA LISTA CON UN SOLO TIPO DE OBJETOS)
export function crearTabla(data){
    if(!Array.isArray(data) && data != null){
        return null;
    }
    const tabla = document.createElement("table");
    tabla.appendChild(crearCabeceraVariosObjetos(data));
    tabla.appendChild(crearCuerpoVariosObjetos(data));
    return tabla;
}