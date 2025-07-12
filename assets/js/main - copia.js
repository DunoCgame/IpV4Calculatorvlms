console.log("main")

function GeneratorContainnerHost(num){
	let ContainnerHost = document.getElementById("containner_number_host")

	ContainnerHost.innerHTML="";

	for (var i = 0; i<num.value; i++) {

		ContainnerHost.innerHTML+=`<div class="item-host">
			<label><span id="id_Host">${i+1})</span>Host</label>
			<input type="text" class="NamenumberHost1 input-item-host" id="inputNameNumberHost" placeholder="Nombre">
			<input type="number" min="0" class="numberHost1 input-item-host"  id="inputNumberHost"  placeholder="Host">
		</div>`;

	}
}


let resultadosSubredes = [];

let ContainnerResult = document.getElementById("containner_Result")

function CalculateRedIpv4(){

	let IP_Brocast=0;
	let IP_Final=0;
	let CIDR =0;
	let Mask_Netword=0;
	const Bit_Maximo_IP=32;
	const Val_max_Mask = 256;

	let IP = document.getElementById("Add_ip").value;
	let Prefijo_original = document.getElementById("Prefijo_original").value;
	let ContainnerElementosInputHost = document.querySelectorAll("#inputNumberHost").length;

		if(ContainnerElementosInputHost==0){
			
			alert("Error: No se han especificado requisitos de hosts. Añade al menos un departamento.")
		}
		else{
			/*----------captura de ip----------------------*/
			if(IP!=""){
				/*--------calculo de ip-----------------*/
			const ipParts = IP.split('.').map(Number); //separamos la direccion ip
			if (ipParts.length !== 4 || ipParts.some(part => isNaN(part) || part < 0 || part > 255)) {
               ContainnerResult.innerHTML= '';
               ContainnerResult.innerHTML= "Error: Dirección IP de red principal inválida. Asegúrate de que tenga 4 octetos numéricos (0-255).";
            }
            if (isNaN(Prefijo_original) || Prefijo_original < 1 || Prefijo_original > 31) {
               ContainnerResult.innerHTML= '';
               ContainnerResult.innerHTML= "Error: Prefijo CIDR original inválido. Debe ser un número entre 1 y 31.";
            }

			//Convertir la IP principal de la red base a un número entero
            let currentIPDecimal = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];

            //La dirección de broadcast de la red principal nos da su límite superior
            const originalNetworkSize = Math.pow(2, (Bit_Maximo_IP - Prefijo_original));
            const originalNetworkBroadcastDecimal = currentIPDecimal + originalNetworkSize - 1;

				/*--------calculo de ip-----------------*/
				/*--------------------------------------------------------------------*/
				/*--------calculo de host-----------------*/
			let Host_requeridos = document.querySelectorAll("#inputNumberHost");
			let Name_Host_requeridos = document.querySelectorAll("#inputNameNumberHost");


			if (!Array.isArray(Host_requeridos) || Host_requeridos.length === 0) {
				//ContainnerResult.innerHTML= '';
                //ContainnerResult.innerHTML+= "Error: No se han especificado requisitos de hosts. Añade al menos un departamento.";
            }
	
             // Validar cada requisito de host individualmente
            for (const req of Host_requeridos) {
                if (!req.nombre || req.nombre.trim() === '') {
                	//ContainnerResult.innerHTML= '';
                  // ContainnerResult.innerHTML+=`Error: El nombre del requisito de host no puede estar vacío.`;
                }
                if (isNaN(req.hosts) || req.hosts < 2) {
                	//ContainnerResult.innerHTML= '';
                 // ContainnerResult.innerHTML+= `Error: La cantidad de hosts para "${req.nombre}" debe ser un número y al menos 2 (para host utilizable).`;
                }
            }
					for (var i = 0; i<ContainnerElementosInputHost; i++){

						let bitsHostNecesarios = 0;
						
						while((Math.pow(2,bitsHostNecesarios)-2)<Host_requeridos[i].value){

								bitsHostNecesarios++;

							if (bitsHostNecesarios >= Bit_Maximo_IP) { // No debería pasar, pero como seguridad
	                           
							//ContainnerResult.innerHTML= '';
	                           ContainnerResult.innerHTML=`Error interno: Demasiados hosts solicitados para "${Name_Host_requeridos[i].value}". No caben en una IPv4.`;
	                        }
						}

						const nuevaMascaraCIDR = Bit_Maximo_IP - bitsHostNecesarios;
						const hostsUtilizablesPorSubred = Math.pow(2,bitsHostNecesarios) - 2;
                		const totalDireccionesSubred = Math.pow(2,bitsHostNecesarios);
					   
					     if (nuevaMascaraCIDR < Prefijo_original) {
					     	//ContainnerResult.innerHTML= '';
					                   ContainnerResult.innerHTML=`Error: La subred "${Name_Host_requeridos[i].value}" con ${Host_requeridos[i].value} hosts requiere un prefijo /${nuevaMascaraCIDR}, que es más grande que la red principal /${Prefijo_original}. No es posible subnetear de esta forma.`;
					      }


					    //console.log("currentIPDecimal",currentIPDecimal);
						//console.log("originalNetworkSize",originalNetworkSize);
					    //console.log("originalNetworkBroadcastDecimal",originalNetworkBroadcastDecimal);
						//console.log("/*************************/");
						//console.log("/",nuevaMascaraCIDR);
						//console.log("hostsUtilizablesPorSubred",hostsUtilizablesPorSubred);
						//console.log("totalDireccionesSubred",totalDireccionesSubred);

			               /*---------------------------------------------------------*/

  				// --- CÓDIGO CORREGIDO: Comprobar si la subred actual se sale del rango de la red principal ---
                // Verificamos si la dirección de broadcast de la subred propuesta excede el broadcast de la red principal
                if (currentIPDecimal + totalDireccionesSubred -1 > originalNetworkBroadcastDecimal) {
                  //ContainnerResult.innerHTML= '';

                  //ContainnerResult.innerHTML+=`Error: Las subredes requeridas exceden el tamaño de la red principal ${IP}/${Prefijo_original}. La subred "${Name_Host_requeridos[i].value}" no tiene espacio disponible.`;
                }
			 /***********************************************************************/              
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
			                	namehost:Name_Host_requeridos[i].value,
			                    hostsRequeridos: Host_requeridos[i].value,
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
			          
			               /*---------------------------------------------------------*/
					}/*cierre for*/
				/*--------calculo de host-----------------*/
				ContainnerResult.innerHTML+= `<header class="encabesado-resultado"><h1>IP de Red Principal:</h1><h2> ${IP}/${Prefijo_original}</h2></header>
					<hr>
												<section id="continnerData"></section>`

			resultadosSubredes.forEach( function(objeto, index) {

					for (const clave in objeto) {
						if (objeto.hasOwnProperty(clave)) {
							
							const valor = objeto[clave];
							
							document.getElementById("continnerData").innerHTML+=`<p>${clave} : ${valor}</p>`;
						}
					}

					 // Añadir una línea separadora entre objetos (opcional)
			        if (index < resultadosSubredes.length - 1) {
			            document.getElementById("continnerData").innerHTML+=`<br><hr><br>`;
			        }

		
			});
    


		}

		if(IP==""){
			let ElementosInputHost = document.querySelectorAll("#inputNumberHost");




		}

	}
}