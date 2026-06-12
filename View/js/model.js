class ModeloPeluqueria {
    constructor() {
        this.clientes = JSON.parse(localStorage.getItem('glamour_clientes')) || [];
        this.citas = JSON.parse(localStorage.getItem('glamour_citas')) || [];
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

    guardar() {
        localStorage.setItem('glamour_clientes', JSON.stringify(this.clientes));
        localStorage.setItem('glamour_citas', JSON.stringify(this.citas));
    }
}