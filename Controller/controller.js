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
                        <button class="btn btn-danger btn-sm py-0 px-2 btn-eliminar" data-id="${cita.id}">
                            <i class="fa-solid fa-trash-can small"></i> Cancelar
                        </button>
                    </td>
                </tr>
            `;
        });

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
    }
}