const btnGuardarCliente = document.querySelector('#guardar-cliente');
const contenido = document.querySelector('#resumen .contenido');

let cliente = {
    mesa: '',
    hora: '',
    pedido: [],
}

const categorias = {
    1: 'Comida',
    2: 'Bebidas',
    3: 'Postres'
}

btnGuardarCliente.addEventListener('click', guardarCliente);


function guardarCliente() {
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    // Revisa si hay campos vacios con array method .includes
    const camposVacios = [ mesa, hora].includes('');


    if (camposVacios) {
        const existeAlerta  = document.querySelector('.alerta');

        if (!existeAlerta) {
            const alerta = document.createElement('div');
            alerta.className = 'invalid-feedback d-block text-center alerta';
            alerta.textContent = 'Todos los campos son obligatorios';
    
            document.querySelector('.modal-body form').appendChild(alerta);

            setTimeout(() => {
                alerta.remove();
            }, 2000);
        }
        return;
    }

    // Asignar datos de formulario a obj cliente
    cliente = {...cliente, mesa, hora};
    // oculta modal
    const modalForm = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalForm);
    modalBootstrap.hide();
    
    // mostrar secciones
    mostrarSecciones();
    
    // obtener platillos de la API
    obtenerPlatillos();
}

function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach( seccion => seccion.classList.remove('d-none'));
}

function obtenerPlatillos() {
    const url = 'https://json-platillos.vercel.app/platillos';

    fetch(url)
        .then( respuesta => respuesta.json())
        .then( data => mostrarPlatillos(data))
        .catch( error => console.log(error))
}

function mostrarPlatillos(platillos) {
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach( platillo => {
        const row = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');
        
        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');
        inputCantidad.onchange = ()=> {
            const cantidad = parseInt(inputCantidad.value);
            agregarPlatillo({...platillo, cantidad})
        };

        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2');

        agregar.appendChild(inputCantidad);

        row.appendChild(nombre);
        row.appendChild(precio); 
        row.appendChild(categoria); 
        row.appendChild(agregar); 
        contenido.appendChild(row);
    });
}

function agregarPlatillo(producto) {
    let { pedido } = cliente;

    // revisar que la cantidad sea mayor a 0
    if(producto.cantidad <= 0) {
        // Si por alguna razon el usuario regresa a cero el platilo, lo tengo que eliminar con el siguiente codigo
        const pedidoAct = pedido.filter( articulo => articulo.id !== producto.id )

        cliente.pedido = [...pedidoAct];
    } else {
        // Codigo para actualizar actualizar un platillo existente en el arreglo
        const existe = pedido.some( articulo => articulo.id === producto.id );
        if (existe) {
            const pedidoAct = pedido.map( articulo => {
                if (articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad;
                }
                return articulo;
            });
            cliente.pedido = [...pedidoAct];
    
        } else {
            cliente.pedido = [...pedido, producto];
        }
    } 

    imprimirHTML();
}

function imprimirHTML() {
    // Limpiar HTML
    limpiarHTML(contenido);

    // extrayendo pedido del objeto cliente
    const { pedido } = cliente;

    // Si no hay pedidos, imprimir que no hay elementos
    if (pedido.length === 0) {
        contenido.innerHTML = `
            <p class="text-center">Añade los elementos del pedido</p>
        `;
        return;
    }

    const resumen = document.createElement('div');
    resumen.className = "col-md-6 card p-3 shadow";

    const mesa = document.createElement('p');
    mesa.className = 'fw-bold';
    mesa.innerHTML = `Mesa <span class="fw-normal">${cliente.mesa}</span>`;

    const hora = document.createElement('p');
    hora.className = 'fw-bold';
    hora.innerHTML = `Hora <span class="fw-normal">${cliente.hora}</span>`;

    const titulo = document.createElement('h3');
    titulo.className = 'my-4 text-center';
    titulo.textContent = 'Platillos Pedidos';
    
    const ul = document.createElement('ul');
    ul.className = 'list-group';

    resumen.appendChild(titulo);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(ul);


    pedido.forEach( articulo => {

        const {nombre, cantidad, precio, id} = articulo;

        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';

        const nombreEl  = document.createElement('h4');
        nombreEl.className = 'text-center my-4';
        nombreEl.textContent = nombre;

        const cantidadEl = document.createElement('p');
        cantidadEl.className = 'fw-bold';
        cantidadEl.innerHTML = `Cantidad: <span class="fw-normal">${cantidad}</span>`;

        const precioEl = document.createElement('p');
        precioEl.className = 'fw-bold';
        precioEl.innerHTML = `Precio: <span class="fw-normal">$${precio}</span>`;

        const subtotal = document.createElement('p');
        subtotal.className = 'fw-bold';
        subtotal.innerHTML = `Subtotal: <span class="fw-normal">$${calcularSubtotal(precio, cantidad)}</span>`;

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar Pedido';
        btnEliminar.className = 'btn btn-danger';

        btnEliminar.onclick = ()=> eliminarPedido(id);
        
        // Agregar Elementos al li
        listItem.appendChild(nombreEl);
        listItem.appendChild(cantidadEl);
        listItem.appendChild(precioEl);
        listItem.appendChild(subtotal);
        listItem.appendChild(btnEliminar);
        
        // agregar li al ul
        ul.appendChild(listItem);
    });

    contenido.appendChild(resumen);

    // mostrar Formulario de propinas
    formularioPropinas();
}

const calcularSubtotal = (precio, cantidad)=> precio * cantidad;

function eliminarPedido(id) {

    const {pedido} = cliente;

    // ELIMINAR DEL ARREGLO
    const arregloAct = pedido.filter( element => element.id !== id);
    cliente.pedido = [...arregloAct];

    // imprimir HTML actualizado
    imprimirHTML();
    
    // Resetear el input del platillo que se elimino  
    const inputControl = document.querySelector(`#producto-${id}`);
    inputControl.value = 0;
}

function formularioPropinas() {

    const formulario = document.createElement('div');
    formulario.className = 'col-md-6 formulario';
    
    const divFormulario = document.createElement('div');
    divFormulario.className = 'card p-3 shadow';

    const titulo = document.createElement('h3');
    titulo.className = 'my-4 text-center';
    titulo.textContent = 'Propina';

    // radio Btn 10%
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.className = 'form-check-input';

    const radio10Label = document.createElement('label');
    radio10Label.textContent = '10%';
    radio10Label.className = 'form-check-label';

    const radio10div = document.createElement('div');
    radio10div.className = 'form-check';

    // agregar al div del campo radio
    radio10div.appendChild(radio10);
    radio10div.appendChild(radio10Label);


    // radio Btn 25%
    const radio25 = document.createElement('input');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = '25';
    radio25.className = 'form-check-input';

    const radio25Label = document.createElement('label');
    radio25Label.textContent = '25%';
    radio25Label.className = 'form-check-label';

    const radio25div = document.createElement('div');
    radio25div.className = 'form-check';

    // agregar al div del campo radio
    radio25div.appendChild(radio25);
    radio25div.appendChild(radio25Label);


    // radio Btn 50%
    const radio50 = document.createElement('input');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = '50';
    radio50.className = 'form-check-input';

    const radio50Label = document.createElement('label');
    radio50Label.textContent = '50%';
    radio50Label.className = 'form-check-label';

    const radio50div = document.createElement('div');
    radio50div.className = 'form-check';

    // agregar al div del campo radio
    radio50div.appendChild(radio50);
    radio50div.appendChild(radio50Label);

    // Agregar al div principal
    divFormulario.appendChild(titulo);
    divFormulario.appendChild(radio10div);
    divFormulario.appendChild(radio25div);
    divFormulario.appendChild(radio50div);

    // Agregar al formulario
    formulario.appendChild(divFormulario);

    // agregar al contenido
    contenido.appendChild(formulario);

    // seccion de calcular propina
    calcularPropina();
}

function calcularPropina() {
    const inputsRadio = document.querySelectorAll('[name="propina"]')
    
    inputsRadio.forEach( input => {
        input.onchange = ()=> {
            if (input.checked) {
                // selecciona el value del radio que contiene el prosentaje de propina
                const porcentaje = parseInt(input.value);
                
                // Calcula el resultado de todos los subtotales que hay en el pedido
                let subtotal = cliente.pedido.reduce( (total, pedido) => total + calcularSubtotal(pedido.precio, pedido.cantidad), 0);
                
                // calcula el aumento de propina
                const propina = (subtotal * porcentaje) / 100;
                
                const total = subtotal + propina;
                
                mostrarTotalHTML(subtotal, total, propina);
            }
        }
    })  
}

function mostrarTotalHTML(subtotal, total, propina) {

    const divTotales = document.createElement('div');
    divTotales.className = 'total-pagar my-5';

    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.className = 'fs-4 fw-bold mt-2';
    subtotalParrafo.innerHTML = `
        Subtotal Consumo: <span class="fw-normal">$${subtotal}</span>
    `;

    const propinaParrafo = document.createElement('p');
    propinaParrafo.className = 'fs-4 fw-bold mt-2';
    propinaParrafo.innerHTML = `
        Propina: <span class="fw-normal">$${propina}</span>
    `;

    const totalParrafo = document.createElement('p');
    totalParrafo.className = 'fs-4 fw-bold mt-2';
    totalParrafo.innerHTML = `
        Total a Pagar: <span class="fw-normal">$${total}</span>
    `;

    // LimpiarHTML
    const totalPagarDiv = document.querySelector('.total-pagar');

    totalPagarDiv && totalPagarDiv.remove();

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    // selecciona el primer div de formulario
    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales);
}

function limpiarHTML(selector) {
    while (selector.firstChild) {
        selector.removeChild(selector.firstChild);
    }
}