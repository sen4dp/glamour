class ControladorPeluqueria {
    constructor(modelo) {
        this.modelo = modelo;
        this.init();
    }

    init() {
        this.actualizarVistas();
        
        // Manejar Registro Cliente
        document.getElementById('formCliente')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombreCliente').value;
            const tel = document.getElementById('telCliente').value;
            this.modelo.agregarCliente(nombre, tel);
            e.target.reset();
            this.actualizarVistas();
            alert('¡Cliente registrado!');
        });

        // Manejar Reserva Cita
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

        // Actualizar Select de Clientes
        select.innerHTML = '<option value="">-- Seleccionar --</option>';
        this.modelo.clientes.forEach(c => {
            select.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
        });

        // Actualizar Tabla Agenda
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
                </tr>
            `;
        });
    }
}