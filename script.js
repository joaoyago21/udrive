//--------------------------------------
// CARROS INICIAIS
//--------------------------------------
let carrosIniciais = [
    { modelo: "Gol", ano: 2022, diaria: 150, semana: 700, imagem: "img/gol.png", dono: null, visivel: true, alugado: false },
    { modelo: "Ford Ka", ano: 2022, diaria: 150, semana: 700, imagem: "img/ka.png", dono: null, visivel: true, alugado: false },
    { modelo: "Kwid", ano: 2022, diaria: 150, semana: 600, imagem: "img/kwid.png", dono: null, visivel: true, alugado: false },
    { modelo: "Uno", ano: 2022, diaria: 150, semana: 600, imagem: "img/uno.png", dono: null, visivel: true, alugado: false }
];

if (!localStorage.getItem("carros")) {
    localStorage.setItem("carros", JSON.stringify(carrosIniciais));
}

//--------------------------------------
// LOGIN E CRIAÇÃO DE CONTA
//--------------------------------------
function criarConta() {
    let nome = document.getElementById("nomeCadastro").value;
    let email = document.getElementById("emailCadastro").value;
    let senha = document.getElementById("senhaCadastro").value;

    if (!nome || !email || !senha) return alert("Preencha tudo!");

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    usuarios.push({
        id: Date.now(),
        nome,
        email,
        senha,
        foto: null
    });

    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Conta criada!");
}

function entrar() {
    let email = document.getElementById("emailLogin").value;
    let senha = document.getElementById("senhaLogin").value;

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    let usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (!usuario) return alert("Login inválido!");

    localStorage.setItem("usuarioLogado", usuario.id);
    window.location.href = "painel.html";
}

//--------------------------------------
// PERFIL DO USUÁRIO
//--------------------------------------
function getUsuarioLogado() {
    let id = Number(localStorage.getItem("usuarioLogado"));
    if (!id) return null;

    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    return usuarios.find(u => u.id === id);
}

function carregarDadosPainel() {
    let user = getUsuarioLogado();
    if (!user) return;

    document.getElementById("nomePainel").innerText = user.nome;
    document.getElementById("fotoPainel").src = user.foto || "img/user-default.png";
}

function salvarFotoPainel() {
    let input = document.getElementById("uploadFotoPainel");
    if (input.files.length === 0) return;

    let reader = new FileReader();

    reader.onload = function(e) {
        let usuarios = JSON.parse(localStorage.getItem("usuarios"));
        let id = Number(localStorage.getItem("usuarioLogado"));
        let usuario = usuarios.find(u => u.id === id);

        usuario.foto = e.target.result;
        localStorage.setItem("usuarios", JSON.stringify(usuarios));

        document.getElementById("fotoPainel").src = usuario.foto;
        alert("Foto atualizada!");
    };

    reader.readAsDataURL(input.files[0]);
}

//--------------------------------------
// SISTEMA DE ABAS
//--------------------------------------
function abrirAba(qual) {
    document.querySelectorAll(".tabContent").forEach(div => div.style.display = "none");
    document.getElementById(qual).style.display = "block";

    if (qual === "meusVeiculos") carregarMeusVeiculos();
    if (qual === "cadastrar") carregarFormularioCadastro();
    if (qual === "reservas") carregarReservas();
    if (qual === "historico") carregarHistorico();
    if (qual === "alugar") carregarCarrosParaAlugar();
}

//--------------------------------------
// CADASTRO DE VEÍCULO
//--------------------------------------
function carregarFormularioCadastro() {
    document.getElementById("formCadastro").innerHTML = `
        <input id="modeloCarro" placeholder="Modelo">
        <input id="anoCarro" placeholder="Ano">
        <input id="diariaCarro" placeholder="Diária">
        <input id="semanaCarro" placeholder="Semana">
        <input id="imagemCarro" placeholder="URL da imagem">

        <button onclick="salvarVeiculo()">Salvar veículo</button>
    `;
}

function salvarVeiculo() {
    let modelo = modeloCarro.value;
    let ano = anoCarro.value;
    let diaria = diariaCarro.value;
    let semana = semanaCarro.value;
    let imagem = imagemCarro.value;

    let dono = Number(localStorage.getItem("usuarioLogado"));

    if (!modelo || !ano || !diaria || !semana || !imagem) return alert("Preencha tudo!");

    let carros = JSON.parse(localStorage.getItem("carros")) || [];

    carros.push({
        modelo,
        ano,
        diaria,
        semana,
        imagem,
        dono,
        visivel: true,
        alugado: false
    });

    localStorage.setItem("carros", JSON.stringify(carros));

    alert("Veículo cadastrado!");
    abrirAba("meusVeiculos");
}

//--------------------------------------
// MEUS VEÍCULOS
//--------------------------------------
function carregarMeusVeiculos() {
    let id = Number(localStorage.getItem("usuarioLogado"));
    let carros = JSON.parse(localStorage.getItem("carros")) || [];
    let meus = carros.filter(c => c.dono === id);

    let div = document.getElementById("listaMeusCarros");
    div.innerHTML = "";

    if (meus.length == 0) {
        div.innerHTML = `<p>Você não possui veículos cadastrados.</p>`;
        return;
    }

    meus.forEach(carro => {
        div.innerHTML += `
        <div class="card">
            <img src="${carro.imagem}">
            <h3>${carro.modelo} (${carro.ano})</h3>
            <p>Diária: R$${carro.diaria}</p>
        </div>`;
    });
}

//--------------------------------------
// LISTAR CARROS PARA ALUGAR (PAINEL)
//--------------------------------------
function carregarCarrosParaAlugar() {
    let id = Number(localStorage.getItem("usuarioLogado"));
    let carros = JSON.parse(localStorage.getItem("carros")) || [];

    let disponiveis = carros.filter(c => c.dono !== id && c.visivel);

    let div = document.getElementById("carrosDisponiveisPainel");
    div.innerHTML = "";

    if (disponiveis.length === 0) {
        div.innerHTML = "<p>Nenhum carro disponível no momento.</p>";
        return;
    }

    disponiveis.forEach((carro, index) => {
        div.innerHTML += `
        <div class="card">
            <img src="${carro.imagem}">
            <h3>${carro.modelo} (${carro.ano})</h3>
            <p>R$${carro.diaria}/dia</p>
            <button onclick="verDetalhes(${index})">Alugar</button>
        </div>`;
    });
}

//--------------------------------------
// VER DETALHES
//--------------------------------------
function verDetalhes(index) {
    localStorage.setItem("carroSelecionado", index);
    window.location.href = "detalhes.html";
}

//--------------------------------------
// RESERVAS (WHATSAPP)
//--------------------------------------
function reservar(index) {
    let carros = JSON.parse(localStorage.getItem("carros"));
    let carro = carros[index];

    let nome = prompt("Seu nome:");
    let tel = prompt("Seu telefone:");
    let data = prompt("Data da reserva:");

    let msg = `Olá, quero reservar o ${carro.modelo} (${carro.ano})%0A` +
              `Nome: ${nome}%0A` +
              `Telefone: ${tel}%0A` +
              `Data: ${data}`;

    window.location.href = "https://wa.me/5561974030660?text=" + msg;
}

//--------------------------------------
// INICIALIZAÇÃO DO PAINEL
//--------------------------------------
if (window.location.pathname.includes("painel.html")) {
    carregarDadosPainel();
    abrirAba("meusVeiculos");
}
