function scrollCarrossel(direcao) {

    const carrossel = document.getElementById("carrossel");

    if (!carrossel) return;

    carrossel.scrollBy({
        left: 300 * direcao,
        behavior: "smooth"
    });

}

const PAGINAS_PRODUTOS = {

    "acessorios.html": [
        "Nano Bracelete Roxo P/m",
        "Nano Bracelete Roxo G/gg",
        "Nano Bracelete All Black P/m",
        "Nano Bracelete All Black G/gg",
        "Nano Bracelete Bordo P/m",
        "Nano Bracelete Bordo G/gg"
    ],

    "beleza.html": [
        "Colageno Drink Da Beleza Young 4k Frutas Vermelhas 160g",
        "Colageno Drink Da Beleza Young 4k Abacaxi Com Hortela 160g",
        "Serum Hidratante Corporal Vanilla Care 200g",
        "Creme Para Os Pes Lan Creme Prebiotico 90g",
        "Protetor Solar Fps 30 Protect Skin 150g",
        "Esfoliante Renover Gomage+ 90g"
    ],

    "controledePeso.html": [
        "Cha Natural Body Tea Para Controle De Peso 120g",
        "Nutri Shake Mais Chocolate",
        "Nutri Shake Mais Baunilha",
        "Slim Pro Energy",
        "Suplemento Alimentar Ativa+ 30 Capsulas",
        "Suplemento De Quitosana E Psyllium Carbo Fire 500mg"
    ],

    "cuidadoPessoal.html": [
        "Fresh Ice Aromatizante Bucal Menta Aloe Vera 15ml",
        "Fresh Ice Aromatizante Bucal Morango Aloe Vera 15ml",
        "Fresh Ice Aromatizante Bucal Black Aloe Vera 15ml",
        "Serum Hidratante Corporal Vanilla Care 200g",
        "Creme Dental Vegano Ak Essencial",
        "Sabonete Facial Limpeza Profunda Aloe Pure 200ml"
    ],

    "saudeBemEstar.html": [
        "Gel Para Massagem Doctor Fit Nano 90g",
        "Isotonico Rehidrata Tangerina 90g",
        "Isotonico Rehidrata Limao 90g",
        "Suplemento De Colageno Tipo Ii Day Flex+ 450mg",
        "Suplemento Alimentar Ak Hair Power Crescimento Capilar 60 Capsulas",
        "Alerti Mais Energia Suplemento Em Capsula Para Foco",
        "Suplemento Alimentar Em Gomas Ak Hair Gummy 30 Gomas",
        "Oleo Essencial Fresh Mint Akmos 10ml",
        "Oleo Essencial Sweet Relax Akmos Lavanda 10ml"
    ],

    "suplementacao.html": [
        "Suplemento Feminino Pro Woman 60 Capsulas",
        "Suplemento Curcuma Complex Longue Vie 30 Capsulas",
        "Suplemento Coenzima Q10 Longue Vie 30 Capsulas",
        "Suplemento Alimentar Chlorella 90 Capsulas",
        "Suplemento Super B12 Longue Vie 30 Capsulas",
        "Suplemento Full Omega Longue Vie 60 Capsulas",
        "Magnum Power Magnesio 60 Capsulas",
        "Suplemento Resveratrol Longue Vie 30 Capsulas",
        "Suplemento Relaxed Melatonina 20ml"
    ]

};

const NOMES_CATEGORIAS = {
    "acessorios.html": "Acessorios",
    "beleza.html": "Beleza",
    "controledePeso.html": "Controle De Peso",
    "cuidadoPessoal.html": "Cuidado Pessoal",
    "saudeBemEstar.html": "Saude E Bem Estar",
    "suplementacao.html": "Suplementacao"
};

const TODOS_PRODUTOS = Object.entries(PAGINAS_PRODUTOS).flatMap(
    ([pagina, nomes]) => nomes.map(nome => ({ nome, pagina }))
);

function normalizar(texto) {

    return texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9\s+]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}

function tokenizar(texto) {
    const normalizado = normalizar(texto);
    if (normalizado === "") return [];
    // Ignora tokens sem nenhuma letra/número (ex: um "+" isolado),
    // que não ajudam a encontrar nada e só travariam a busca.
    return normalizado.split(" ").filter(token => /[a-z0-9]/.test(token));
}

function palavrasCorrespondem(token, palavra) {

    if (token === palavra) return true;

    if (token.length < 3 || palavra.length < 3) return false;

    return palavra.startsWith(token) || token.startsWith(palavra);

}

function correspondeAoTexto(tokensBusca, textoAlvo) {

    if (tokensBusca.length === 0) return false;

    const palavrasAlvo = tokenizar(textoAlvo);

    return tokensBusca.every(token =>
        palavrasAlvo.some(palavra => palavrasCorrespondem(token, palavra))
    );

}

function buscarEmTodoSite(termo) {

    const tokens = tokenizar(termo);

    if (tokens.length === 0) {
        return { pagina: null, comFiltro: false };
    }

    const produtosEncontrados = TODOS_PRODUTOS.filter(produto =>
        correspondeAoTexto(tokens, produto.nome)
    );

    if (produtosEncontrados.length > 0) {
        return { pagina: produtosEncontrados[0].pagina, comFiltro: true };
    }

    const categoriaEncontrada = Object.entries(NOMES_CATEGORIAS).find(
        ([, nomeCategoria]) => correspondeAoTexto(tokens, nomeCategoria)
    );

    if (categoriaEncontrada) {
        return { pagina: categoriaEncontrada[0], comFiltro: false };
    }

    return { pagina: null, comFiltro: false };

}

document.addEventListener("DOMContentLoaded", () => {

    const busca = document.querySelector(".busca");

    if (!busca) return;

    const nomeArquivoAtual = (() => {
        const partes = window.location.pathname.split("/");
        const arquivo = decodeURIComponent(partes[partes.length - 1] || "");
        return arquivo === "" ? "index.html" : arquivo;
    })();

    const ehHome = nomeArquivoAtual.toLowerCase() === "index.html";

    function filtrarNestaPagina(termo) {

        const itens = document.querySelectorAll(".produto, .produto-card");

        if (itens.length === 0) return false;

        const tokens = tokenizar(termo);
        let algumVisivel = false;

        itens.forEach(item => {

            const titulo = item.querySelector("h3");

            if (!titulo) return;

            const corresponde =
                tokens.length === 0 || correspondeAoTexto(tokens, titulo.textContent);

            item.style.display = corresponde ? "" : "none";

            if (corresponde) algumVisivel = true;

        });

        atualizarMensagemSemResultados(tokens.length > 0 && !algumVisivel);

        return algumVisivel;

    }

    function atualizarMensagemSemResultados(mostrar) {

        const grade =
            document.querySelector(".grid-produtos") ||
            document.getElementById("carrossel");

        if (!grade) return;

        let aviso = grade.parentElement.querySelector(".aviso-busca-vazia");

        if (mostrar) {

            if (!aviso) {
                aviso = document.createElement("p");
                aviso.className = "aviso-busca-vazia";
                aviso.style.textAlign = "center";
                aviso.style.width = "100%";
                aviso.style.padding = "20px";
                aviso.style.color = "#666";
                grade.insertAdjacentElement("afterend", aviso);
            }

            aviso.textContent = "Nenhum produto encontrado.";

        } else if (aviso) {

            aviso.remove();

        }

    }

    busca.addEventListener("input", () => {
        filtrarNestaPagina(busca.value);
    });

    busca.addEventListener("keydown", (e) => {

        if (e.key !== "Enter") return;

        e.preventDefault();

        const termo = busca.value.trim();

        if (termo === "") return;

        const encontrouNestaPagina = ehHome ? false : filtrarNestaPagina(termo);

        if (encontrouNestaPagina) return;

        const resultado = buscarEmTodoSite(termo);

        if (resultado.pagina && resultado.pagina.toLowerCase() !== nomeArquivoAtual.toLowerCase()) {

            window.location.href = resultado.comFiltro
                ? `${resultado.pagina}?busca=${encodeURIComponent(termo)}`
                : resultado.pagina;

            return;

        }

        if (!resultado.pagina) {
            alert("Produto não encontrado.");
        }

    });

    const termoNaUrl = new URLSearchParams(window.location.search).get("busca");

    if (termoNaUrl) {

        busca.value = termoNaUrl;
        filtrarNestaPagina(termoNaUrl);

        const secaoProdutos = document.querySelector(".produtos");
        if (secaoProdutos) {
            secaoProdutos.scrollIntoView({ behavior: "smooth", block: "start" });
        }

    }

});

/*login e cadastro*/

function mostrarCadastro() {
    document.getElementById("login-box").style.display = "none";
    document.getElementById("cadastro-box").style.display = "block";
}

function mostrarLogin() {
    document.getElementById("cadastro-box").style.display = "none";
    document.getElementById("login-box").style.display = "block";
}

document.getElementById("cadastroForm").addEventListener("submit", function(e){
    e.preventDefault();

    alert("Cadastro realizado com sucesso!");

    mostrarLogin();
});

document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();

    alert("Login realizado!");
});