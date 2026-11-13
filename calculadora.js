const carrossel = document.querySelector('.passos');
const sobreposicao = document.querySelector('.cartao-overlay');
const botaoAnterior = document.querySelector('.botao-modal-anterior');
const botaoProximo = document.querySelector('.botao-modal-proximo');

function obterPassos() {
    return [...carrossel.querySelectorAll('[id^="passo"]')];
}

function navegarParaPasso(seletor, suave = true) {
    const passo = document.querySelector(seletor);
    const indice = [...carrossel.children].indexOf(passo);
    const largura = passo.getBoundingClientRect().width;
    const espacamento = parseFloat(getComputedStyle(carrossel).gap);
    const limite = carrossel.scrollWidth - carrossel.clientWidth;

    definirPassoAtivo(passo);
    carrossel.style.scrollSnapType = 'none';
    carrossel.scrollTo({
        left: Math.min(indice * (largura + espacamento), limite),
        behavior: suave ? 'smooth' : 'auto'
    });
}

function definirPassoAtivo(passo) {
    carrossel.querySelectorAll('[id^="passo"]').forEach((card) => {
        card.classList.toggle('card-ativo', card === passo);
    });
}

function abrirCard(passo) {
    definirPassoAtivo(passo);
    document.body.classList.add('card-modal-open');
    sobreposicao.setAttribute('aria-hidden', 'false');
    atualizarBotoesModal();
}

function fecharCard() {
    document.body.classList.remove('card-modal-open');
    sobreposicao.setAttribute('aria-hidden', 'true');
}

function atualizarBotoesModal() {
    const passos = obterPassos();
    const passoAtivo = carrossel.querySelector('.card-ativo');
    const indice = passos.indexOf(passoAtivo);

    botaoAnterior.disabled = indice <= 0;
    botaoProximo.disabled = indice === passos.length - 1;
}

function navegarNoModal(direcao) {
    const passos = obterPassos();
    const indiceAtual = passos.indexOf(carrossel.querySelector('.card-ativo'));
    const novoIndice = indiceAtual + direcao;

    if (novoIndice < 0 || novoIndice >= passos.length) {
        return;
    }

    const passo = passos[novoIndice];
    navegarParaPasso(`#${passo.id}`);
    abrirCard(passo);
    history.replaceState(null, '', `#${passo.id}`);
}

function formatarCentimetros(valor) {
    return `${valor.toFixed(1).replace('.', ',')} cm`;
}

function configurarNavegacao() {
    document.querySelectorAll('.indice').forEach((botao) => {
        botao.addEventListener('click', (evento) => {
            evento.preventDefault();
            const seletor = botao.getAttribute('href');
            navegarParaPasso(seletor);
            abrirCard(document.querySelector(seletor));
            history.replaceState(null, '', seletor);
        });
    });

    carrossel.querySelectorAll('[id^="passo"]').forEach((card) => {
        card.addEventListener('click', () => abrirCard(card));
    });

    botaoAnterior.addEventListener('click', () => navegarNoModal(-1));
    botaoProximo.addEventListener('click', () => navegarNoModal(1));
    sobreposicao.addEventListener('click', (evento) => {
        if (evento.target === sobreposicao) {
            fecharCard();
        }
    });
    document.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape') {
            fecharCard();
        }
    });
}

function configurarCalculoDoGuidao() {
    document.querySelector('#form-tamanho-guidao').addEventListener('submit', (evento) => {
        evento.preventDefault();
        const distancia = Number(document.querySelector('#distancia-acromios').value);
        const resultado = document.querySelector('#tamanho-guidao');

        if (!Number.isFinite(distancia) || distancia < 0) {
            resultado.textContent = 'Informe uma medida válida';
            return;
        }

        resultado.textContent = formatarCentimetros(distancia + 27);
    });
}

function configurarCalculoDoQuadro() {
    document.querySelector('#form-tamanho-quadro').addEventListener('submit', (evento) => {
        evento.preventDefault();
        const altura = Number(document.querySelector('#altura').value);
        const cavalo = Number(document.querySelector('#cavalo').value);
        const resultado = document.querySelector('#resultado-quadro');
        const tamanhosPorAltura = [
            { minimo: 1.65, maximo: 1.71, tamanho: 'S (15" a 16")' },
            { minimo: 1.72, maximo: 1.76, tamanho: 'M (17" a 18")' },
            { minimo: 1.77, maximo: 1.82, tamanho: 'L (19")' },
            { minimo: 1.83, maximo: 1.90, tamanho: 'XL (21")' }
        ];
        const tamanhosPorCavalo = [
            [71, 72, '15"', '46 cm'],
            [73, 74, '15,5"', '47 cm'],
            [75, 76, '16"', '49 cm'],
            [77, 78, '16,5"', '50 cm'],
            [79, 80, '17"', '51 cm'],
            [81, 82, '17"', '53 cm'],
            [83, 84, '17,5"', '54 cm'],
            [85, 86, '18"', '56 cm'],
            [87, 88, '18"', '57 cm'],
            [89, 90, '19"', '58 cm'],
            [91, 92, '19,5"', '60 cm'],
            [93, 94, '21"', '61 cm']
        ];
        const tamanhoAltura = tamanhosPorAltura.find((faixa) =>
            altura >= faixa.minimo && altura <= faixa.maximo
        );
        const tamanhoCavalo = tamanhosPorCavalo.find((faixa) =>
            cavalo >= faixa[0] && cavalo <= faixa[1]
        );

        if (!tamanhoAltura || !tamanhoCavalo) {
            resultado.textContent = 'Medidas fora da tabela';
            return;
        }

        resultado.innerHTML = `${tamanhoAltura.tamanho}<br>Estrada: ${tamanhoCavalo[3]} | MTB: ${tamanhoCavalo[2]}`;
    });
}

function configurarCalculoDoSelim() {
    document.querySelector('#form-tamanho-selim').addEventListener('submit', (evento) => {
        evento.preventDefault();
        const distancia = Number(document.querySelector('#isquios').value);
        const resultado = document.querySelector('#resultado-selim');

        if (!Number.isFinite(distancia) || distancia < 0) {
            resultado.textContent = 'Informe uma medida válida';
            return;
        }

        resultado.textContent = formatarCentimetros(distancia + 3);
    });
}

function configurarAlturaDoSelim() {
    document.querySelector('#form-altura-selim').addEventListener('submit', (evento) => {
        evento.preventDefault();
        const cavalo = Number(document.querySelector('#cavalo-selim').value);
        const resultado = document.querySelector('#resultado-altura-selim');

        if (!Number.isFinite(cavalo) || cavalo < 0) {
            resultado.textContent = 'Informe uma medida válida';
            return;
        }

        resultado.textContent = formatarCentimetros(cavalo * 1.09);
    });
}

function navegarParaHashInicial() {
    if (window.location.hash && document.querySelector(window.location.hash)) {
        window.setTimeout(() => {
            navegarParaPasso(window.location.hash, false);
            abrirCard(document.querySelector(window.location.hash));
        }, 0);
        return;
    }

    definirPassoAtivo(carrossel.querySelector('[id^="passo"]'));
}

configurarNavegacao();
configurarCalculoDoGuidao();
configurarCalculoDoQuadro();
configurarCalculoDoSelim();
configurarAlturaDoSelim();
window.addEventListener('load', navegarParaHashInicial);
