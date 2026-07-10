class ControladorPeluqueria {
    constructor(modelo) {
        this.modelo = modelo;
        this.init();
    }

    init() {
        this.actualizarVistas();
        
        document.getElementById('formCliente')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombreCliente').value;
            const tel = document.getElementById('telCliente').value;
            this.modelo.agregarCliente(nombre, tel);
            e.target.reset();
            this.actualizarVistas();
            alert('¡Cliente registrado con éxito!');
        });

        document.getElementById('formCita')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const cId = document.getElementById('selectCliente').value;
            const serv = document.getElementById('servicioCita').value;
            const fec = document.getElementById('fechaCita').value;
            const hor = document.getElementById('horaCita').value;
            this.modelo.agregarCita(cId, serv, fec, hor);
            e.target.reset();
            this.actualizarVistas();
            alert('¡Cita agendada con éxito!');
        });

        // Event listeners para historial
        document.getElementById('buscarHistorial')?.addEventListener('input', (e) => {
            this.actualizarHistorial();
        });

        document.getElementById('ordenarHistorial')?.addEventListener('change', (e) => {
            this.actualizarHistorial();
        });
    }

    actualizarVistas() {
        const select = document.getElementById('selectCliente');
        const tabla = document.getElementById('tablaAgenda');
        if(!select || !tabla) return;

        select.innerHTML = '<option value="">-- Seleccionar --</option>';
        this.modelo.clientes.forEach(c => {
            select.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
        });

        tabla.innerHTML = '';
        document.getElementById('noData').style.display = this.modelo.citas.length ? 'none' : 'block';
        document.getElementById('countCitas').innerText = `${this.modelo.citas.length} Citas`;

        this.modelo.citas.forEach(cita => {
            tabla.innerHTML += `
                <tr>
                    <td class="ps-3 fw-bold">${cita.cliente}</td>
                    <td><span class="badge bg-secondary">${cita.servicio}</span></td>
                    <td>${cita.fecha} | ${cita.hora}</td>
                    <td><span class="text-success"><i class="fa-solid fa-circle-check me-1"></i>Confirmada</span></td>
                    <td>
                        <button class="btn btn-success btn-sm py-0 px-2 btn-completar me-1" data-id="${cita.id}">
                            <i class="fa-solid fa-check small"></i> Completar
                        </button>
                        <button class="btn btn-danger btn-sm py-0 px-2 btn-eliminar" data-id="${cita.id}">
                            <i class="fa-solid fa-trash-can small"></i> Cancelar
                        </button>
                    </td>
                </tr>
            `;
        });

        // Event listeners para eliminar citas
        document.querySelectorAll('.btn-eliminar').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const botonActual = e.target.closest('.btn-eliminar');
                const idCita = botonActual.getAttribute('data-id');
                
                if (confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
                    this.modelo.eliminarCita(idCita);
                    this.actualizarVistas();
                }
            });
        });

        // Event listeners para completar citas
        document.querySelectorAll('.btn-completar').forEach(boton => {
            boton.addEventListener('click', (e) => {
                const botonActual = e.target.closest('.btn-completar');
                const idCita = botonActual.getAttribute('data-id');
                
                if (confirm('¿Marcar esta cita como completada?')) {
                    this.modelo.completarCita(idCita);
                    this.actualizarVistas();
                }
            });
        });

        // Actualizar historial
        this.actualizarHistorial();
    }

    actualizarHistorial() {
        const tablaHistorial = document.getElementById('tablaHistorial');
        const noDataHistorial = document.getElementById('noHistorialData');
        const buscarInput = document.getElementById('buscarHistorial');
        const ordenSelect = document.getElementById('ordenarHistorial');

        if (!tablaHistorial) return;

        const terminoBusqueda = buscarInput ? buscarInput.value : '';
        const orden = ordenSelect ? ordenSelect.value : 'fecha-desc';

        const historialFiltrado = this.modelo.obtenerHistorialOrdenado(orden, terminoBusqueda);

        tablaHistorial.innerHTML = '';

        if (historialFiltrado.length === 0) {
            noDataHistorial.style.display = 'block';
        } else {
            noDataHistorial.style.display = 'none';
            
            historialFiltrado.forEach(item => {
                tablaHistorial.innerHTML += `
                    <tr>
                        <td class="ps-3 fw-bold">${item.cliente}</td>
                        <td><span class="badge bg-secondary">${item.servicio}</span></td>
                        <td>${item.fecha}</td>
                        <td>${item.hora}</td>
                        <td>
                            <button class="btn btn-eliminar-historial btn-sm" data-id="${item.id}" title="Eliminar del historial">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

            // Event listeners para eliminar del historial
            document.querySelectorAll('.btn-eliminar-historial').forEach(boton => {
                boton.addEventListener('click', (e) => {
                    const botonActual = e.target.closest('.btn-eliminar-historial');
                    const idItem = botonActual.getAttribute('data-id');
                    
                    if (confirm('¿Estás seguro de que deseas eliminar esta cita del historial permanentemente?')) {
                        this.modelo.eliminarDelHistorial(idItem);
                        this.actualizarHistorial();
                    }
                });
            });
        }
    }
}