class ModeloPeluqueria {
    constructor() {
        this.clientes = JSON.parse(localStorage.getItem('glamour_clientes')) || [];
        this.citas = JSON.parse(localStorage.getItem('glamour_citas')) || [];
        this.historial = JSON.parse(localStorage.getItem('glamour_historial')) || [];
    }

    agregarCliente(nombre, telefono) {
        const nuevo = { id: Date.now(), nombre, telefono };
        this.clientes.push(nuevo);
        this.guardar();
        return nuevo;
    }

    agregarCita(clienteId, servicio, fecha, hora) {
        const cliente = this.clientes.find(c => c.id == clienteId);
        const nuevaCita = { id: Date.now(), cliente: cliente.nombre, servicio, fecha, hora };
        this.citas.push(nuevaCita);
        this.guardar();
        return nuevaCita;
    }

    eliminarCita(citaId) {
        this.citas = this.citas.filter(cita => cita.id != citaId);
        this.guardar();
    }

    completarCita(citaId) {
        const citaIndex = this.citas.findIndex(cita => cita.id == citaId);
        if (citaIndex !== -1) {
            const cita = this.citas[citaIndex];
            cita.estado = 'completada';
            cita.fechaCompletado = new Date().toISOString();
            
            this.historial.push(cita);
            this.citas.splice(citaIndex, 1);
            this.guardar();
            return true;
        }
        return false;
    }

    eliminarDelHistorial(historialId) {
        this.historial = this.historial.filter(item => item.id != historialId);
        this.guardar();
    }

    obtenerHistorialOrdenado(orden = 'fecha-desc', busqueda = '') {
        let resultado = [...this.historial];

        // Filtrar por nombre
        if (busqueda.trim() !== '') {
            const termino = busqueda.toLowerCase();
            resultado = resultado.filter(item => 
                item.cliente.toLowerCase().includes(termino)
            );
        }

        // Ordenar
        switch (orden) {
            case 'fecha-desc':
                resultado.sort((a, b) => new Date(b.fecha + ' ' + b.hora) - new Date(a.fecha + ' ' + a.hora));
                break;
            case 'fecha-asc':
                resultado.sort((a, b) => new Date(a.fecha + ' ' + a.hora) - new Date(b.fecha + ' ' + b.hora));
                break;
            case 'nombre-asc':
                resultado.sort((a, b) => a.cliente.localeCompare(b.cliente));
                break;
            case 'nombre-desc':
                resultado.sort((a, b) => b.cliente.localeCompare(a.cliente));
                break;
        }

        return resultado;
    }

    guardar() {
        localStorage.setItem('glamour_clientes', JSON.stringify(this.clientes));
        localStorage.setItem('glamour_citas', JSON.stringify(this.citas));
        localStorage.setItem('glamour_historial', JSON.stringify(this.historial));
    }
}