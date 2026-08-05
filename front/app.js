const API_URL = 'http://localhost:3000/api';

const selectMascota = document.getElementById('mascota');
const inputFecha = document.getElementById('fecha');
const inputHora = document.getElementById('hora');
const inputMotivo = document.getElementById('motivo');
const formTurno = document.getElementById('turno-form');
const turnosContainer = document.getElementById('turnos-container');
const mensajeEstado = document.getElementById('mensaje-estado');

function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    const dia = fecha.getUTCDate().toString().padStart(2, '0');
    const mes = (fecha.getUTCMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getUTCFullYear();
    return `${dia}/${mes}/${anio}`;
}

async function cargarMascotas() {
    try {
        const respuesta = await fetch(`${API_URL}/mascotas`);
        if (!respuesta.ok) throw new Error("Error al obtener las mascotas");
        const mascotas = await respuesta.json();
        
        selectMascota.innerHTML = '<option value="">Seleccione una mascota</option>';
        
        mascotas.forEach(mascota => {
            selectMascota.innerHTML += `
                <option value="${mascota.idMascota}">
                    ${mascota.nombre} (${mascota.especie}) - Dueño: ${mascota.duenio}
                </option>`;
        });
    } catch (error) {
        console.error(error);
        selectMascota.innerHTML = '<option value="">Error al cargar mascotas</option>';
    }
}

async function cargarTurnos() {
    try {
        const respuesta = await fetch(`${API_URL}/turnos`);
        if (!respuesta.ok) throw new Error("Error al obtener los turnos");
        const turnos = await respuesta.json();
        
        if (turnos.length === 0) {
            turnosContainer.innerHTML = '<div class="empty">No hay turnos programados aún.</div>';
            return;
        }

        turnosContainer.innerHTML = '';
        turnos.forEach(turno => {
            const fechaFormateada = formatearFecha(turno.fecha);
            
            turnosContainer.innerHTML += `
                <div class="turno-card">
                    <div class="turno-header">
                        <span class="turno-fecha">Fecha: ${fechaFormateada}</span>
                        <span class="turno-badge">Hora: ${turno.hora}</span>
                    </div>
                    <h3 class="turno-mascota">Mascota: ${turno.mascota}</h3>
                    <p class="turno-especie">Especie: ${turno.especie}</p>
                    <div class="turno-dueño">
                        <strong>Dueño:</strong> ${turno.duenio}
                    </div>
                    <div class="turno-dueño">
                        <strong>Teléfono:</strong> ${turno.telefono}
                    </div>
                    <div class="turno-motivo">
                        Motivo: "${turno.motivo}"
                    </div>
                </div>
            `;
        });
    } catch (error) {
        console.error(error);
        turnosContainer.innerHTML = '<div class="loading">Error al cargar los turnos</div>';
    }
}

formTurno.addEventListener('submit', async (e) => {
    e.preventDefault();
    mostrarMensaje('', false);
    
    const nuevoTurno = {
        idMascota: Number(selectMascota.value),
        fecha: inputFecha.value,
        hora: inputHora.value,
        motivo: inputMotivo.value.trim()
    };
    
    try {
        const respuesta = await fetch(`${API_URL}/turnos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevoTurno)
        });
        
        const data = await respuesta.json();
        
        if (respuesta.ok) {
            mostrarMensaje('Turno registrado exitosamente', true);
            formTurno.reset();
            cargarTurnos();
        } else {
            mostrarMensaje(`Error: ${data.mensaje}`, false);
        }
    } catch (error) {
        console.error(error);
        mostrarMensaje('Error de conexión al registrar el turno', false);
    }
});

function mostrarMensaje(texto, esExito) {
    if (!texto) {
        mensajeEstado.style.display = 'none';
        return;
    }
    
    mensajeEstado.textContent = texto;
    mensajeEstado.className = 'mensaje ' + (esExito ? 'success' : 'error');
}

cargarMascotas();
cargarTurnos();
