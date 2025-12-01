
document.addEventListener('DOMContentLoaded', () => {
    
    const formEvento = document.getElementById('form_cadastrar_evento');
    
    if (formEvento) {
        formEvento.addEventListener('submit', (e) => {
            e.preventDefault();

            
            const nome = document.getElementById('nome_evento').value;
            const valor = parseFloat(document.getElementById('valor').value);
            const dataInicio = document.getElementById('data_inicio').value;
            const dataFim = document.getElementById('data_fim').value;
            const cargaHoraria = parseInt(document.getElementById('carga_horaria').value);
            const imagemUrl = document.getElementById('imagem_url').value;
            const descricao = document.getElementById('descricao').value;

            
            let eventos = JSON.parse(localStorage.getItem('eventosData')) || [];
            const novoId = eventos.length > 0 ? Math.max(...eventos.map(ev => ev.id)) + 1 : 1;

            
            const novoEvento = {
                id: novoId,
                nome: nome,
                data: dataInicio, 
                imagem: imagemUrl,
                descricao: descricao,
                valor: valor,
                cargaHoraria: cargaHoraria,
                dataFim: dataFim 
            };

            
            eventos.push(novoEvento);
            localStorage.setItem('eventosData', JSON.stringify(eventos));

            alert(`Evento "${nome}" cadastrado com sucesso!`);
            
            
            window.location.href = 'index.html'; 
        });
    }

    
    const btnCancelar = document.getElementById('btn_cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'index.html';
        });
    }
});