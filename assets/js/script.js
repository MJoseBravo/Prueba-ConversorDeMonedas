
const buttonCalcular = document.getElementById("btnCalcular")
buttonCalcular.addEventListener('click', ()=>getMonedas())
const mostrarResultado = document.getElementById("resultado")


async function getMonedas(){
    
    const apiURL = "https://mindicador.cl/api"
    let res = null
    let monedas = null
    try {
        res = await fetch(apiURL)
        monedas = await res.json()
    } catch {
        mostrarResultado.innerHTML = "Error recuperando información"
        return
    }
    const monedaActual = document.getElementById("monedaActual").value
    let datosMoneda = monedas[monedaActual]
    const montoPesos = document.getElementById("pesos").value

    let resultado = 0.0
    try{
        resultado = parseFloat(montoPesos) / parseFloat(datosMoneda.valor)
    } catch {
        mostrarResultado.innerHTML = "Error de calculo"
        return
    }
    
    mostrarResultado.innerHTML = String(resultado.toFixed(2)) + " " + datosMoneda.codigo

    const historicoMoneda = await getHistoricoMoneda(monedaActual)
    mostrarGrafico(historicoMoneda)

}

async function getHistoricoMoneda(monedaActual) {
    const apiURL = "https://mindicador.cl/api/" + monedaActual
    let res = null
    let historicoMoneda = null
    try {
        res = await fetch(apiURL)
        historicoMoneda = await res.json()
        
    } catch {
        const errorGrafico = document.getElementById("errorGrafico")
        errorGrafico.innerHTML = "Error recuperando datos del gráfico"
    }
    return historicoMoneda
}

let currentChart = null

function mostrarGrafico(historicoMoneda) {
    const tipoDeGrafico = "line"
    const titulo = "Moneda en Pesos"
    const colorDeLinea = "red"
    const nombreMoneda = historicoMoneda.nombre
    const fechasMoneda = historicoMoneda.serie.map((serie) => serie.fecha.substring(0, 10))
    const valoresMoneda = historicoMoneda.serie.map((serie) => serie.valor)

    const config = {
        type: tipoDeGrafico,
        data: {
            labels: fechasMoneda.reverse().slice(-10),
            datasets: [
                {
                    label: titulo,
                    backgroundColor: colorDeLinea,
                    data: valoresMoneda.reverse().slice(-10)
                }
            ]
        }
    }
    const chartDOM = document.getElementById("myChart")
    if (currentChart != null) {
        currentChart.destroy()
    }
    currentChart = new Chart(chartDOM , config)
}

