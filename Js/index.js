const eventosPadrao = [
    {
        id: 1,
        nome: "Encontro de Cosplayers",
        data: "2026-05-10", 
        imagem: "../img/WCS2019_Meiji-Mura.webp",
        descricao: "Mostre seu talento e paixão por personagens.",
        valor: 0,
        cargaHoraria: 4 
    },
    {
        id: 2,
        nome: "Campeonato de LoL",
        data: "2025-05-12",
        imagem: "../img/paris-france-fans-watch-an-electronic-video-game-tournament-with-the-game-league-of-legends.webp",
        descricao: "Dispute o troféu do GameFest nas arenas virtuais.",
        valor: 50,
        cargaHoraria: 8 
    },
    {
        id: 3,
        nome: "Torneio de Valorant",
        data: "2026-06-20", 
        imagem: "../img/04094f84ed7f476435f8eda702a7f21bc460c298-1920x1080.webp",
        descricao: "Batalhas 5x5 eletrizantes.",
        valor: 50,
        cargaHoraria: 6 
    },
    {
        id: 4,
        nome: "Feira de Tecnologia",
        data: "2025-05-15",
        imagem: "../img/Principais-eventos-de-games-1-1024x640-optimized.webp",
        descricao: "Explore o futuro dos games e VR.",
        valor: 20,
        cargaHoraria: 8 
    },
    {
        id: 5,
        nome: "Workshop Dev Games",
        data: "2026-07-01", 
        imagem: "../img/image.webp",
        descricao: "Aprenda design e programação de jogos.",
        valor: 100,
        cargaHoraria: 12 
    }
];


let eventos = JSON.parse(localStorage.getItem('eventosData'));


if (!eventos || eventos.length === 0 || eventos[0]?.data !== "2026-05-10" || !eventos[0].cargaHoraria) {
    eventos = eventosPadrao;
    localStorage.setItem('eventosData', JSON.stringify(eventos));
}


const containerEventos = document.getElementById('lista-eventos');
const inputBusca = document.getElementById('inputBuscaPrincipal'); 

function renderizarEventos(lista) {
    containerEventos.innerHTML = '';
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    lista.forEach(evento => {
        const isFavorito = favoritos.includes(evento.id);
        const classeFavorito = isFavorito ? 'favoritado' : '';
        const iconeCoracao = isFavorito ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';

        const dataVisual = new Date(evento.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

        
        const textoCarga = evento.cargaHoraria ? `${evento.cargaHoraria} horas` : 'Duração livre';

        const cardHTML = `
            <div class="col-12 col-md-6">
                <div class="card border-0 p-0 h-100">
                    <div class="card-body position-relative">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h3>${evento.nome}</h3>
                            <button class="btn-favorito ${classeFavorito}" onclick="toggleFavorito(${evento.id})">${iconeCoracao}</button>
                        </div>
                        <img class="img-evento" src="${evento.imagem}" alt="${evento.nome}">
                        
                        <div class="d-flex justify-content-between align-items-center mb-0">
                            <p class="text-white-50 mb-0"><small>Data: ${dataVisual}</small></p>
                            <small class="contador-tempo fw-bold text-warning" data-date="${evento.data}T00:00:00Z">Calculando...</small>
                        </div>

                        <p class="text-white-50 mb-2"><small><i class="fas fa-clock me-1"></i>Duração: ${textoCarga}</small></p>

                        <p>${evento.descricao}</p>
                        <p class="fw-bold" style="color: var(--neon-cyan)">R$ ${parseFloat(evento.valor).toFixed(2)}</p>
                        
                        <div class="d-flex justify-content-end mt-2">
                            <a href="#" class="btn btn-outline-neon-cyan me-2">Detalhes</a>
                            <a href="fazer_inscricao.html?id=${evento.id}" class="btn btn-neon-pink">Inscrever-se</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        containerEventos.innerHTML += cardHTML;
    });

    atualizarContadores();
}


function ordenarEventos(criterio) {
    let listaOrdenada = [...eventos];

    if (criterio === 'nome') {
        listaOrdenada.sort((a, b) => a.nome.localeCompare(b.nome));
    } else if (criterio === 'data') {
        
        const agora = new Date();

        listaOrdenada.sort((a, b) => {
            
            const dataA = new Date(a.data);
            const dataB = new Date(b.data);

            
            const isAFuture = dataA.getTime() > agora.getTime();
            const isBFuture = dataB.getTime() > agora.getTime();

            
            if (isAFuture === isBFuture) {
                
                return dataA - dataB;
            }

            
            if (isAFuture) {
                return -1;
            }

            
            return 1;
        });
    }
    renderizarEventos(listaOrdenada);
}



function atualizarContadores() {
    const contadores = document.querySelectorAll('.contador-tempo');
    const agora = new Date().getTime();

    contadores.forEach(contador => {
        const dataAlvo = new Date(contador.getAttribute('data-date')).getTime();
        const distancia = dataAlvo - agora;

        if (distancia < 0) {
            contador.innerHTML = "🔴 Encerrado";
            contador.classList.remove('text-warning');
            contador.classList.add('text-danger');
        } else {
            const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
            const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
            const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

            contador.innerHTML = `⏳ ${dias}d ${horas}h ${minutos}m ${segundos}s`;
        }
    });
}

setInterval(atualizarContadores, 1000);


if(inputBusca) {
    inputBusca.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase();
        const filtrados = eventos.filter(ev => 
            ev.nome.toLowerCase().includes(termo) || 
            ev.descricao.toLowerCase().includes(termo)
        );
        renderizarEventos(filtrados);
    });
}

window.toggleFavorito = function(id) {
    let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];
    
    if (favoritos.includes(id)) {
        favoritos = favoritos.filter(favId => favId !== id); 
    } else {
        favoritos.push(id); 
    }
    
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    renderizarEventos(eventos); 
};

renderizarEventos(eventos);