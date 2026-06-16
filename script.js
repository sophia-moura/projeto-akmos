// =====================
// CARROSSEL
// =====================

function scrollCarrossel(direcao) {

    const carrossel = document.getElementById("carrossel");

    if (!carrossel) return;

    carrossel.scrollBy({
        left: 300 * direcao,
        behavior: "smooth"
    });

}

// =====================
// PESQUISA
// =====================

document.addEventListener("DOMContentLoaded", () => {

    const busca = document.querySelector(".busca");

    if (!busca) return;

    // Detecta se está na página inicial
    const paginaAtual = window.location.pathname.toLowerCase();

    const ehHome =
        paginaAtual.endsWith("index.html") ||
        paginaAtual.endsWith("/") ||
        paginaAtual === "";

    // HOME -> REDIRECIONA
    if (ehHome) {

        busca.addEventListener("keydown", (e) => {

            if (e.key !== "Enter") return;

            const termo = busca.value.toLowerCase();

            if (
                termo.includes("melatonina") ||
                termo.includes("omega") ||
                termo.includes("coenzima") ||
                termo.includes("curcuma") ||
                termo.includes("magnesio")
            ) {

                window.location.href = "suplementacao.html";

            }

            else if (
                termo.includes("bracelete")
            ) {

                window.location.href = "acessorios.html";

            }

            else if (
                termo.includes("fresh") ||
                termo.includes("skin")
            ) {

                window.location.href = "cuidadoPessoal.html";

            }

            else {

                alert("Produto não encontrado.");

            }

        });

    }

    // PÁGINAS DE PRODUTOS -> FILTRA
    else {

        busca.addEventListener("input", () => {

            const termo = busca.value.toLowerCase();

            const produtos = document.querySelectorAll(".produto");

            produtos.forEach(produto => {

                const nome = produto
                    .querySelector("h3")
                    .textContent
                    .toLowerCase();

                produto.style.display =
                    nome.includes(termo)
                        ? "block"
                        : "none";

            });

        });

    }

});