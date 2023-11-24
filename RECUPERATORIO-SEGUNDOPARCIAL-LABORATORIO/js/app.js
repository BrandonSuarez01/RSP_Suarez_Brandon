import { crearTabla } from "./tabla.js";
import { Aereo, Terrestre} from "./entidades.js";
import { obtenerDatos, agregarVehiculo, modificarVehiculo, eliminarVehiculo } from "./peticiones.js";

const $pagina = document.getElementById('pagina');
const $spiner = document.getElementById('spinner');
const $divTable = document.getElementById('table');
const $textProm = document.getElementById('text-promedio');
const $divAbm = document.getElementById('abm-container');
const $select = document.getElementById('select-tipo');
const $formulario = document.forms[1];
const url = "http://localhost/backend-labo-3/vehiculoAereoTerrestre.php"
let selectedElement = '';

const $overlay = document.getElementById('overlay');

$pagina.style.display = "none";
$divAbm.style.display = "none";

obtenerDatos(url).then(data => {

    $overlay.style.display = "none";
    $pagina.style.display = "block";
    const parsedData = data;

    actualizarTabla();

    function actualizarTabla(tipo){

        while($divTable.hasChildNodes()){
            
            $divTable.removeChild($divTable.firstElementChild);
        }

        switch(tipo){
            case 'todos':
                while($divTable.hasChildNodes()){
            
                    $divTable.removeChild($divTable.firstElementChild);
                }
                $divTable.appendChild(crearTabla(parsedData));
                break;
            case 'aereo':
                while($divTable.hasChildNodes()){
            
                    $divTable.removeChild($divTable.firstElementChild);
                }
                let aereos = parsedData.filter(a => a.hasOwnProperty('altMax'));
                $divTable.appendChild(crearTabla(aereos));
                break;
            case 'terrestre':
                while($divTable.hasChildNodes()){
            
                    $divTable.removeChild($divTable.firstElementChild);
                }
                let terrestres = parsedData.filter(t => t.hasOwnProperty('cantPue'));
                $divTable.appendChild(crearTabla(terrestres));
                break;
            default:
                while($divTable.hasChildNodes()){
            
                    $divTable.removeChild($divTable.firstElementChild);
                }
                $divTable.appendChild(crearTabla(parsedData));
                break;
        }
    }

    function mostrarSpinner() {
        $overlay.style.display = 'block'
        $overlay.style.display = 'flex';
    }

    document.getElementById('select-filtro').addEventListener('change', function() {
        var valorSeleccionado = this.value;
        actualizarTabla(valorSeleccionado);
    });
   
    window.addEventListener('dblclick', (e) => {
        const target = e.target;
    
        if (target.matches("td")) {
        const id = target.parentElement.dataset.id;
        console.log("ID del elemento:", id);
        }
    });
   
    document.getElementById('calcular-prom').addEventListener('click', function(event) {
        
        event.preventDefault();
        let $filtro = document.getElementById('select-filtro');

        switch($filtro.value){
            case 'todos':
                const velocidadesAll = parsedData.map(t => parseInt(t.velMax, 10));
                const velocidadesValidadasAll = velocidadesAll.filter(velMax => !isNaN(velMax)); 
                const sumaVelocidadesAll = velocidadesValidadasAll.reduce((acumulador, velocidad) => acumulador + velocidad, 0);
                const promedioVelocidadAll = sumaVelocidadesAll / velocidadesValidadasAll.length;
                console.log(promedioVelocidadAll);
                $textProm.value = promedioVelocidadAll.toString(); 
                break;
            case 'aereo':
                let aereos = parsedData.filter(a => a.hasOwnProperty('altMax'));
                const velocidades = aereos.map(a => parseInt(a.velMax, 10));
                const velocidadesValidadas = velocidades.filter(velMax => !isNaN(velMax)); 
                const sumaVelocidades = velocidadesValidadas.reduce((acumulador, velocidad) => acumulador + velocidad, 0);
                const promedioVelocidad = sumaVelocidades / velocidadesValidadas.length;
                console.log(promedioVelocidad);
                $textProm.value = promedioVelocidad.toString();
                break;
            case 'terrestre':
                let terrestres = parsedData.filter(t => t.hasOwnProperty('cantPue'));
                const velocidadesT = terrestres.map(t => parseInt(t.velMax, 10));
                const velocidadesValidadasT = velocidadesT.filter(velMax => !isNaN(velMax)); 
                const sumaVelocidadesT = velocidadesValidadasT.reduce((acumulador, velocidad) => acumulador + velocidad, 0);
                const promedioVelocidadT = sumaVelocidadesT / velocidadesValidadasT.length;
                console.log(promedioVelocidadT);
                $textProm.value = promedioVelocidadT.toString();
                break;
        }
    });

    document.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
        const tabla = document.getElementById('table');
        const mostrar = this.checked;
        const column = this.dataset.column;
    
        const filas = tabla.querySelectorAll('tr');
    
        filas.forEach(fila => {
            const celdas = fila.querySelectorAll('td, th');
            celdas[column].style.display = mostrar ? 'table-cell' : 'none';
        });
        });
    });

    function agregarElemento() {

        mostrarSpinner();

        let id = parsedData.length + 1;
        let modelo = $formulario.inputModelo.value;
        let fab = $formulario.inputFab.value;
        let vel = $formulario.inputVel.value;
        
        let tipo = $formulario.selectTipo.value;

        let auto = $formulario.inputAutono.value;
        let alt = $formulario.inputAlt.value;

        let cantPue = $formulario.inputPue.value;
        let cantRue = $formulario.inputRue.value;

        console.log(modelo, parseInt(fab), parseInt(vel))

        if(modelo != '' && parseInt(fab) > 1885 && parseInt(vel) > 0){

            switch(tipo){
                case 'aereo':
                    if(parseInt(alt) > 0 && parseInt(auto) > 0){
                            let nuevoAereo = new Aereo(id, modelo, fab, vel, alt, auto);
                            agregarVehiculo(url, JSON.stringify(nuevoAereo), function(){
                            console.log(nuevoAereo);
                            parsedData.push(nuevoAereo);
                            localStorage.setItem("data", JSON.stringify(parsedData));
                            actualizarTabla();
                            $overlay.style.display = "none";
                            $divAbm.style.display = "none";
                        });  
                    }else{
                        alert('Error: Verifique la altura, y la autonomia.');
                        $overlay.style.display = "none";
                    }
                    
                break;
                case 'terrestre':
                    if(parseInt(cantPue) > -1 && parseInt(cantRue) > 0){
                        let nuevoTerres = new Terrestre(id, modelo, fab, vel, cantPue, cantRue);
                        agregarVehiculo(url, JSON.stringify(nuevoTerres), function(){
                            console.log(nuevoTerres);
                            parsedData.push(nuevoTerres);
                            localStorage.setItem("data", JSON.stringify(parsedData));
                            actualizarTabla()
                            $overlay.style.display = "none";
                            $divAbm.style.display = "none";
                        });
                    }else{
                        alert('Error: Verifique la cantidad de puertas, y la cantidad de ruedas.');
                        $overlay.style.display = "none";
                    }
                   
                break;
            }
        }else{
            alert('Error: Verifique el modelo, año de fabricacion y velocidad.');
            $overlay.style.display = "none";
        }
    }

    $select.addEventListener('change', function() {
        selectedElement = $select.value;

        let $inputsTerres = document.getElementById('inputsTerres'); 
        let $inputsAereo = document.getElementById('inpustsAereo'); 

        if(selectedElement == 'terrestre'){
            $inputsTerres.style.display = "block";
            $inputsAereo.style.display = "none";

            $formulario.inputAutono.value = '';
            $formulario.inputAlt.value = '';

        }else if(selectedElement == 'aereo'){
            $inputsAereo.style.display = "block";
            $inputsTerres.style.display = "none";

            $formulario.inputPue.value = '';
            $formulario.inputRue.value = '';
        }else{
            $inputsAereo.style.display = "block";
            $inputsTerres.style.display = "block";
        }
        console.log('Valor seleccionado:', selectedElement);
    });

    function cargarFormulario(vehiculo){

        let $inputsTerres = document.getElementById('inputsTerres'); 
        let $inputsAereo = document.getElementById('inpustsAereo'); 
        
        $formulario.inputId.value = vehiculo.id;
        $formulario.inputModelo.value = vehiculo.modelo;
        $formulario.inputFab.value = vehiculo.anoFab;
        $formulario.inputVel.value = vehiculo.velMax;

        if(vehiculo.cantPue || vehiculo.cantRue){
            $formulario.inputPue.value = vehiculo.cantPue;
            $formulario.inputRue.value = vehiculo.cantRue;
            $formulario.selectTipo.value = 'terrestre';
            $inputsTerres.style.display = "block";
            $inputsAereo.style.display = "none";
            $select.disabled = true;
        }else{
            $formulario.inputAutono.value = vehiculo.autonomia;
            $formulario.inputAlt.value = vehiculo.altMax;
            $formulario.selectTipo.value = 'aereo';
            $inputsAereo.style.display = "block";
            $inputsTerres.style.display = "none";
            $select.disabled = true;
        }
    }

    function limpiarForm(){
            $formulario.inputId.value="";
            $formulario.reset();
            console.log('Se limpio');
    }

    window.addEventListener('dblclick', (e) => {
        const target = e.target;

        let btnModificar  = document.getElementById('btnModificar');
        let btnEliminar = document.getElementById('btnEliminar');
        let btnConfirmar = document.getElementById('btnConfirmar')

        btnModificar.style.display = "block";
        btnEliminar.style.display = "block";
        btnConfirmar.style.display = "none";

        if (target.matches("td")) {
            limpiarForm();
            $divAbm.style.display = "block";
            $divAbm.focus();
            console.log(e.target.parentElement.dataset.id);
            let id = e.target.parentElement.dataset.id;
            cargarFormulario(parsedData.find((vehiculo) => vehiculo.id == id));
        }
    });

    async function handlerUpdate(auxVehiculo){

        mostrarSpinner();

        let indice = parsedData.findIndex(vehiculo =>{
            return auxVehiculo.id == vehiculo.id;
        });

        try {
            const resultado = await modificarVehiculo(url, auxVehiculo);

            parsedData.splice(indice, 1);
            parsedData.push(auxVehiculo);
            actualizarStorage(parsedData);
            console.log('Se guardo');
            actualizarTabla();
            $spiner.style.display = "none";
            $divAbm.style.display = "none";
            console.log('Respuesta exitosa:', resultado);
        } catch (error) {
            alert('Hubo un error al realizar la solicitud');
            console.error('Hubo un error al realizar la solicitud:', error.message);
            $divAbm.style.display = "none";
            $spiner.style.display = "none";
        }
    }

    function actualizarStorage(parsedData){
        localStorage.setItem("data", JSON.stringify(parsedData));
    }

    document.getElementById('btnModificar').addEventListener('click', function(event){
        event.preventDefault();
        
        let tipo = $formulario.selectTipo.value;
        
        let id = $formulario.inputId.value;
        let modelo = $formulario.inputModelo.value;
        let fab = $formulario.inputFab.value;
        let vel = $formulario.inputVel.value;

        let alt = $formulario.inputAlt.value;
        let auto = $formulario.inputAutono.value;
    
        let cantPue = $formulario.inputPue.value;
        let cantRue = $formulario.inputRue.value;
        
        console.log(tipo)

        if(modelo != '' && parseInt(fab) > 1885 && parseInt(vel) > 0){
            
            if(tipo == 'aereo'){
                if(parseInt(alt) > 0 && parseInt(auto) > 0){
                    let nuevoAereo = new Aereo(id, modelo, fab, vel, alt, auto);
                    handlerUpdate(nuevoAereo);
                    $divAbm.style.display = "none";
                }else{
                    alert('Error: Verifique la altura, y la autonomia.');
                    $overlay.style.display = "none";
                }
            }else if(tipo == 'terrestre'){
                if(parseInt(cantPue) > -1 && parseInt(cantRue) > 0){
                    let nuevoTerres = new Terrestre(id, modelo, fab, vel, cantPue, cantRue);
                    handlerUpdate(nuevoTerres);
                    $divAbm.style.display = "none";
                }else{
                    alert('Error: Verifique la cantidad de puertas, y la cantidad de ruedas.');
                    $overlay.style.display = "none";
                }
            }

        }else{
            alert('Error: Verifique el modelo, año de fabricacion y velocidad.');
            $overlay.style.display = "none";
        }
    });

    document.getElementById('btnAgregar').addEventListener('click', function(event){
        event.preventDefault();
        limpiarForm();
        $select.disabled = false;
        $divAbm.style.display = "block";
        $divAbm.focus();

        let btnModificar  = document.getElementById('btnModificar');
        let btnEliminar = document.getElementById('btnEliminar');
        let btnConfirmar = document.getElementById('btnConfirmar');

        btnModificar.style.display = "none";
        btnEliminar.style.display = "none";
        btnConfirmar.style.display = "block";
    
    });

    document.getElementById('btnConfirmar').addEventListener('click', function(event){
        event.preventDefault();
        agregarElemento();
        $divAbm.style.display = "none";
    });

    document.getElementById('btnEliminar').addEventListener('click', function(event){
        event.preventDefault();
        handlerDelete();
    });

    document.getElementById('btnCancelar').addEventListener('click', function(event){
        event.preventDefault();
        $divAbm.style.display = "none";
        limpiarForm();
    });

    async function handlerDelete(){

        mostrarSpinner();

        let id = parseInt($formulario.inputId.value);
        let auxId = id;

        let indice = parsedData.findIndex((vehiculo)=>{
            return auxId == vehiculo.id;
        });

        console.log(id);
        
        try {
            const resultado = await eliminarVehiculo(url, id);

            parsedData.splice(indice, 1);
            actualizarStorage(parsedData);
            actualizarTabla();

            $overlay.style.display = "none";
            $divAbm.style.display = "none";
            console.log('Respuesta exitosa:', resultado);
        } catch (error) {
            alert('Hubo un error al realizar la solicitud');
            console.error('Hubo un error al realizar la solicitud:', error.message);
            $divAbm.style.display = "none";
            $overlay.style.display = "none";
        }
    }

}).catch(error => {
    console.error('Error al obtener datos:', error);
    alert('NO HAY SERVIDOR');
});





