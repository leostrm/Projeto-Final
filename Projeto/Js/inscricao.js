

document.addEventListener('DOMContentLoaded', () => {
    const selectEvento = document.getElementById('select_evento');
    const infoBox = document.getElementById('info-evento');
    const spanValor = document.getElementById('span-valor');
    const spanVagas = document.getElementById('span-vagas');
    const form = document.getElementById('formulario_inscricao');
    const inputDataEvento = document.getElementById('data_evento');
    const btnCancelar = document.getElementById('btn_cancelar');

    let eventos = JSON.parse(localStorage.getItem('eventosData')) || [];
    
    
    eventos.forEach(ev => {
        if(typeof ev.vagas === 'undefined' || ev.vagas === null) {
            ev.vagas = Math.floor(Math.random() * 50) + 1; 
        }
    });

    
    selectEvento.innerHTML = '<option value="" disabled selected>Selecione</option>';

    
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); 

    eventos.forEach(ev => {

        const partesData = ev.data.split('-'); 
        const dataEvento = new Date(partesData[0], partesData[1] - 1, partesData[2]);

        
        if (dataEvento >= hoje) {
            const option = document.createElement('option');
            option.value = ev.id;
            option.textContent = ev.nome;
            selectEvento.appendChild(option);
        }
    });
    

    
    const urlParams = new URLSearchParams(window.location.search);
    const eventoIdUrl = urlParams.get('id');
    if(eventoIdUrl) {

        selectEvento.value = eventoIdUrl;
        atualizarInfo(eventoIdUrl);
    }

    
    selectEvento.addEventListener('change', (e) => {
        atualizarInfo(e.target.value);
    });

    function atualizarInfo(id) {
        const evento = eventos.find(ev => ev.id == id);
        if (evento) {
            infoBox.classList.remove('d-none');
            spanValor.innerText = `R$ ${parseFloat(evento.valor).toFixed(2)}`;
            spanVagas.innerText = evento.vagas;
            const dataFormatada = new Date(evento.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'});
            inputDataEvento.value = dataFormatada; 
        } else {
            inputDataEvento.value = '';
        }
    }

    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const eventoId = selectEvento.value;
        const evento = eventos.find(ev => ev.id == eventoId);

        if(evento && evento.vagas > 0) {
            
            evento.vagas--;
            localStorage.setItem('eventosData', JSON.stringify(eventos));
            atualizarInfo(eventoId);

            alert(`Inscrição realizada com sucesso no evento: ${evento.nome}! Vagas restantes: ${evento.vagas}`);
            window.location.href = 'index.html'; 
        } else {
            alert('Desculpe, vagas esgotadas ou evento inválido.');
        }
    });

    
    if (btnCancelar) {
        btnCancelar.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
});