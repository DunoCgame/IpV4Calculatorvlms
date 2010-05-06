
function Max(){

	let num = document.getElementById("number_Host").value

	document.getElementById("value_cant").innerHTML=num;

		let ContainnerHost = document.getElementById("containner_number_host")

	ContainnerHost.innerHTML="";

	for (var i = 0; i<num; i++) {

		ContainnerHost.innerHTML+=`<div class="item-host">
			<label><span id="id_Host">${i+1})</span>Host</label>
			<input type="text" class="NamenumberHost1 input-item-host" id="inputNameNumberHost" placeholder="Nombre" value="Area${i+1}">
			<input type="number" min="0" class="numberHost1 input-item-host"  id="inputNumberHost"  placeholder="0" >
		</div>`;
	}


}

function Min(){

	let num = document.getElementById("number_Host").value

	document.getElementById("value_cant").innerHTML=num;

		let ContainnerHost = document.getElementById("containner_number_host")

	ContainnerHost.innerHTML="";

	for (var i = 0; i<num; i++) {

		ContainnerHost.innerHTML+=`<div class="item-host">
			<label><span id="id_Host">${i+1})</span>Host</label>
			<input type="text" class="NamenumberHost1 input-item-host" id="inputNameNumberHost" placeholder="Nombre" value="Area${i+1}">
			<input type="number" min="0" class="numberHost1 input-item-host"  id="inputNumberHost"  placeholder="Host" value="0">
		</div>`;
	}


}

function obtenerFechaActual() {
	  const fecha = new Date();
	  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
	  return fecha.toLocaleDateString('es-ES', opciones);
}

function obtenerHoraActual() {
	  const fecha = new Date();
	  const opciones = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
	  return fecha.toLocaleTimeString('es-ES', opciones);
}



let ContainnerResult = document.getElementById("results")

function CalculateRedIpv4(){

	const Bit_Maximo_IP=32;
	const Val_max_Mask = 256;

	let IP = document.getElementById("Add_ip").value;
	let Prefijo_original = document.getElementById("Prefijo_original").value;
	let ContainnerElementosInputHost = document.querySelectorAll("#inputNumberHost").length;

	if(ContainnerElementosInputHost==0){
			
		alert("Error: No se han especificado requisitos de hosts. Añade al menos un departamento.")
	
	}
	else{
			if(IP!="" && Prefijo_original!=""){
				
				let resultadosSubredes = [];
				/*--------calculo de ip-----------------*/
				const ipParts = IP.split('.').map(Number); //separamos la direccion ip

				/*----------Validaciones---------------------*/
				if (ipParts.length !== 4 || ipParts.some(part => isNaN(part) || part < 0 || part > 255)) {
	              	 ContainnerResult.innerHTML= '';
	              	 ContainnerResult.innerHTML= `<p style="color:red; font-size:20px">Error: Dirección IP de red principal inválida. Asegúrate de que tenga 4 octetos numéricos (0-255).</p>`;
	            }
	            if (isNaN(Prefijo_original) || Prefijo_original < 1 || Prefijo_original > 31) {
	               	ContainnerResult.innerHTML= '';
	               	ContainnerResult.innerHTML= `<p style="color:red; font-size:20px">Error: Prefijo CIDR original inválido. Debe ser un número entre 1 y 31.</p>`;
	            }

	  

	            /*------------------------------------------------------------*/
				        //Convertir la IP principal de la red base a un número entero
			            let currentIPDecimal = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];

			            //La dirección de broadcast de la red principal nos da su límite superior
			            const originalNetworkSize = Math.pow(2, (Bit_Maximo_IP - Prefijo_original));
			            const originalNetworkBroadcastDecimal = (currentIPDecimal + originalNetworkSize - 1);
						/*--------calculo de ip-----------------*/

						/*##################################################################################*/

						/*----------Calculo de Host--------------*/
				let AlmacenHost =[];
				let Host_requeridos = document.querySelectorAll("#inputNumberHost");
					Host_requeridos.forEach((element, index)=>{
							if(element.value==""){
								ContainnerResult.innerHTML= '';
	                  			ContainnerResult.innerHTML=`<p style="color:red; font-size:20px">Error: El valor host no puede estar vacío.</p>`;
							}	
						});
				let Name_Host_requeridos = document.querySelectorAll("#inputNameNumberHost");
						Name_Host_requeridos.forEach((element, index)=>{
							if(element.value==""){
								ContainnerResult.innerHTML= '';
	                  			ContainnerResult.innerHTML=`<p style="color:red; font-size:20px">Error: El nombre del requisito de host no puede estar vacío.</p>`;
							}	
						});

			for(let i=0;i<ContainnerElementosInputHost; i++ ){

				AlmacenHost.push({name:Name_Host_requeridos[i].value,host:Host_requeridos[i].value})

			}

			const sortedRequisitosHosts = AlmacenHost.slice().sort((a, b) => b.hosts - a.hosts);
			
			/*--------------------------------------*/

			for (const req of sortedRequisitosHosts){
			
				    const hostsNecesarios = req.host;
                    const nombreSubred = req.name.trim(); // Asegurarse de que no haya espacios extra

                  		let bitsHostNecesarios = 0;
						
						while((Math.pow(2,bitsHostNecesarios)-2)<hostsNecesarios){

							bitsHostNecesarios++;

							if (bitsHostNecesarios >= Bit_Maximo_IP) {
	                           
								ContainnerResult.innerHTML=``;
	                            ContainnerResult.innerHTML=`<p style="color:red; font-size:20px">Error interno: Demasiados hosts solicitados para "${hostsNecesarios}". No caben en una IPv4.</p>`;
	                        }
						}

						const nuevaMascaraCIDR = Bit_Maximo_IP - bitsHostNecesarios;

						if (nuevaMascaraCIDR < Prefijo_original) {
				
					     	ContainnerResult.innerHTML= ``;
					            ContainnerResult.innerHTML=`<p style="color:red; font-size:20px">Error: La subred "${nombreSubred}" con ${hostsNecesarios} hosts requiere un prefijo /${nuevaMascaraCIDR}, que es más grande que la red principal /${Prefijo_original}. No es posible subnetear de esta forma.</p>`;
					     
					     }

						const hostsUtilizablesPorSubred = Math.pow(2,bitsHostNecesarios) - 2;
                		const totalDireccionesSubred = Math.pow(2,bitsHostNecesarios);
					   
			
               			 /*----------------------------------------*/
               			 // Verificamos si la dirección de broadcast de la subred propuesta excede el broadcast de la red principal
		                if (currentIPDecimal + totalDireccionesSubred -1 > originalNetworkBroadcastDecimal) {
		                	ContainnerResult.innerHTML= ``;
		                    ContainnerResult.innerHTML=`<p style="color:red; font-size:20px">Error: Las subredes requeridas exceden el tamaño de la red principal ${IP}/${Prefijo_original}. La subred "${nombreSubred}" no tiene espacio disponible.</p>`;
		                }

                	 // Convertir la IP de red actual de decimal a formato punteado
			                const ipRedActualPunteada = [
			                    (currentIPDecimal >>> 24) & 0xFF,
			                    (currentIPDecimal >>> 16) & 0xFF,
			                    (currentIPDecimal >>> 8) & 0xFF,
			                    currentIPDecimal & 0xFF
			                ].join('.');

			                // Calcular la dirección de broadcast
			                const broadcastIPDecimal = currentIPDecimal + totalDireccionesSubred - 1;
			                const broadcastIPPunteada = [
			                    (broadcastIPDecimal >>> 24) & 0xFF,
			                    (broadcastIPDecimal >>> 16) & 0xFF,
			                    (broadcastIPDecimal >>> 8) & 0xFF,
			                    broadcastIPDecimal & 0xFF
			                ].join('.');

			                // Calcular el rango de IPs utilizables
			                const primeraIPUtilizableDecimal = currentIPDecimal + 1;
			                const primeraIPUtilizablePunteada = [
			                    (primeraIPUtilizableDecimal >>> 24) & 0xFF,
			                    (primeraIPUtilizableDecimal >>> 16) & 0xFF,
			                    (primeraIPUtilizableDecimal >>> 8) & 0xFF,
			                    primeraIPUtilizableDecimal & 0xFF
			                ].join('.');

			                const ultimaIPUtilizableDecimal = broadcastIPDecimal - 1;
			                const ultimaIPUtilizablePunteada = [
			                    (ultimaIPUtilizableDecimal >>> 24) & 0xFF,
			                    (ultimaIPUtilizableDecimal >>> 16) & 0xFF,
			                    (ultimaIPUtilizableDecimal >>> 8) & 0xFF,
			                    ultimaIPUtilizableDecimal & 0xFF
			                ].join('.');

			                // Calcular la máscara decimal punteada
			                let mascaraDecimal = [];
			                for (let i = 0; i < 4; i++) {
			                    let octet = 0;
			                    for (let j = 0; j < 8; j++) {
			                        if ((i * 8 + j) < nuevaMascaraCIDR) {
			                            octet = (octet << 1) | 1;
			                        } else {
			                            octet = (octet << 1) | 0;
			                        }
			                    }
			                    mascaraDecimal.push(octet);
			                }
			                const mascaraPunteada = mascaraDecimal.join('.');

			                // Almacenar el resultado para esta subred
			                resultadosSubredes.push({
			                    nombre: nombreSubred,
			                    hostsRequeridos: hostsNecesarios,
			                    hostsUtilizables: hostsUtilizablesPorSubred,
			                    nuevaMascaraCIDR: `/${nuevaMascaraCIDR}`,
			                    mascaraDecimal: mascaraPunteada,
			                    ipRed: ipRedActualPunteada,
			                    rangoIPs: `${primeraIPUtilizablePunteada} - ${ultimaIPUtilizablePunteada}`,
			                    broadcast: broadcastIPPunteada,
			                    totalDirecciones: totalDireccionesSubred
			                });

			                // Mover a la siguiente dirección de red para la próxima subred
			                currentIPDecimal += totalDireccionesSubred;

			}


			/**cierre for**/

			console.log(resultadosSubredes)
			// Clear previous content
ContainnerResult.innerHTML = '';

// Create header
const header = document.createElement('header');
header.className = 'encabesado-resultado';
header.innerHTML = `
    <section class="sub-Encabesado1">
        <label class="labelfecha">Fecha: <span>${obtenerFechaActual()}</span></label>
        <label class="labelHora">Hora:<span>${obtenerHoraActual()}</span></label>
    </section>
    <section class="sub-Encabesado2">
        <h2 style="margin-left:11px">IP de Red Principal:</h2><h3>${IP}/${Prefijo_original}</h3>
    </section>`;
ContainnerResult.appendChild(header);

// Create table
const table = document.createElement('table');
table.style="margin-left:11.5px";
const thead = document.createElement('thead');
thead.innerHTML = `
    <tr>
        <th>No.</th>
        <th>Nombre</th>
        <th>Hosts Req.</th>
        <th>Hosts Util.</th>
        <th>CIDR</th>
        <th>Máscara</th>
        <th>IP de Red</th>
        <th>Rango IPs Util.</th>
        <th>Broadcast</th>
    </tr>`;
table.appendChild(thead);

const tbody = document.createElement('tbody');
resultadosSubredes.forEach((subred, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${subred.nombre}</td>
        <td>${subred.hostsRequeridos}</td>
        <td>${subred.hostsUtilizables}</td>
        <td>${subred.nuevaMascaraCIDR}</td>
        <td>${subred.mascaraDecimal}</td>
        <td>${subred.ipRed}</td>
        <td>${subred.rangoIPs}</td>
        <td>${subred.broadcast}</td>`;
    tbody.appendChild(tr);
});
table.appendChild(tbody);
ContainnerResult.appendChild(table);

			/*----------Calculo de Host--------------*/
				
		}

			if(IP==""){
				let ElementosInputHost = document.querySelectorAll("#inputNumberHost");




			}
	}
}


function imprimirDivDirecto(idDelDiv) {
    const divContenido = document.getElementById(idDelDiv);

    if (!divContenido) {
        console.error(`Error: No se encontró el elemento con el ID "${idDelDiv}".`);
        return;
    }

    // Guardar el contenido original del body
    const contenidoOriginalBody = document.body.innerHTML;

    // Reemplazar el contenido del body con solo el div a imprimir
    document.body.innerHTML = divContenido.innerHTML;

    // Imprimir
    window.print();

    // Restaurar el contenido original del body
    document.body.innerHTML = contenidoOriginalBody;
}