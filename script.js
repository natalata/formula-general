document.addEventListener('DOMContentLoaded', () => {
    const formulario = document.getElementById('formulario');
    const resultadoDiv = document.getElementById('resultado');

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        procesarFormulario();
    });
});

function procesarFormulario() {
    const aInput = document.getElementById('a');
    const bInput = document.getElementById('b');
    const cInput = document.getElementById('c');

    const a = aInput.value.trim();
    const b = bInput.value.trim();
    const c = cInput.value.trim();

    const validacion = validarDatos(a, b, c);

    if (validacion.esValido) {
        const coeficienteA = parseFloat(a);
        const coeficienteB = parseFloat(b);
        const coeficienteC = parseFloat(c);

        const soluciones = resolverEcuacion(coeficienteA, coeficienteB, coeficienteC);
        mostrarResultado(soluciones, coeficienteA, coeficienteB, coeficienteC);
    } else {
        mostrarResultado({ error: validacion.mensaje }, null, null, null, true);
    }
}

function validarDatos(a, b, c) {
    if (a === '' || b === '' || c === '') {
        return { esValido: false, mensaje: 'Debe completar todos los campos.' };
    }

    const regexNumero = /^-?(\d+\.?\d*|\.\d+)$/;

    if (!regexNumero.test(a) || !regexNumero.test(b) || !regexNumero.test(c)) {
        return { esValido: false, mensaje: 'Solo se permiten números (ej: 2, -3, 0.5).' };
    }

    if (parseFloat(a) === 0) {
        return { esValido: false, mensaje: 'El coeficiente A no puede ser cero.' };
    }

    return { esValido: true, mensaje: '' };
}

function calcularDiscriminante(a, b, c) {
    return Math.pow(b, 2) - 4 * a * c;
}

function resolverEcuacion(a, b, c) {
    const discriminante = calcularDiscriminante(a, b, c);
    const soluciones = {
        discriminante: discriminante,
        solucion1: null,
        solucion2: null,
        tipo: ''
    };

    if (discriminante > 0) {
        soluciones.solucion1 = (-b + Math.sqrt(discriminante)) / (2 * a);
        soluciones.solucion2 = (-b - Math.sqrt(discriminante)) / (2 * a);
        soluciones.tipo = 'real-diferente';
    } else if (discriminante === 0) {
        soluciones.solucion1 = -b / (2 * a);
        soluciones.tipo = 'real-unica';
    } else {
        const parteReal = -b / (2 * a);
        const parteImaginaria = Math.sqrt(-discriminante) / (2 * a);
        soluciones.solucion1 = `${parteReal} + ${parteImaginaria}i`;
        soluciones.solucion2 = `${parteReal} - ${parteImaginaria}i`;
        soluciones.tipo = 'compleja';
    }

    return soluciones;
}

function mostrarResultado(soluciones, a, b, c, esError = false) {
    const resultadoDiv = document.getElementById('resultado');

    if (esError) {
        resultadoDiv.innerHTML = `
            <div class="error">
                <h3>⚠️ Error</h3>
                <p>${soluciones.error}</p>
            </div>
        `;
    } else {
        let html = `
            <h3>Resultado para: ${formatearEcuacion(a, b, c)}</h3>
            <p><strong>Discriminante:</strong> D = ${soluciones.discriminante}</p>
        `;

        switch (soluciones.tipo) {
            case 'real-diferente':
                html += `
                    <p class="success">Dos soluciones reales diferentes:</p>
                    <p class="solucion">x₁ = ${soluciones.solucion1.toFixed(4)}</p>
                    <p class="solucion">x₂ = ${soluciones.solucion2.toFixed(4)}</p>
                `;
                break;
            case 'real-unica':
                html += `
                    <p class="success">Una solución real:</p>
                    <p class="solucion">x = ${soluciones.solucion1.toFixed(4)}</p>
                `;
                break;
            case 'compleja':
                html += `
                    <p class="success">Dos soluciones complejas:</p>
                    <p class="solucion">x₁ = ${soluciones.solucion1}</p>
                    <p class="solucion">x₂ = ${soluciones.solucion2}</p>
                `;
                break;
        }

        resultadoDiv.innerHTML = html;
    }

    resultadoDiv.classList.add('visible');
}

function formatearEcuacion(a, b, c) {
    const formatearCoeficiente = (valor) => {
        if (valor === 1) return '';
        if (valor === -1) return '-';
        return valor;
    };

    const terminoA = formatearCoeficiente(a) + 'x²';
    const terminoB = (b >= 0 ? ' + ' : ' - ') + Math.abs(formatearCoeficiente(b)) + 'x';
    const terminoC = (c >= 0 ? ' + ' : ' - ') + Math.abs(c);

    return `${terminoA}${terminoB}${terminoC} = 0`;
}

function limpiarResultado() {
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';
    resultadoDiv.classList.remove('visible');
}

document.addEventListener('DOMContentLoaded', limpiarResultado);