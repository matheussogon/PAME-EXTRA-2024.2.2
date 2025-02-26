console.log("\n\n\n\n"); // bloco de codigo para simular uma tela de carregamento
let frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
let posicao = 0;

let carregando = setInterval(() => {
    process.stdout.write("\x1b[38;5;208m" + `\r                                                     ${frames[posicao]} Carregando` + "\x1b[0m" );
    posicao = (posicao + 1) % frames.length;
}, 100);

setTimeout(() => {
    clearInterval(carregando); // quando a tela de carregamento acaba, limpa o terminal, printa a logo e começa o sistema
    console.clear();
    console.log("\x1b[38;5;208m" + "----------------------------------------------------------------------------------------------------------------------------"+ "\x1b[0m");
    console.log("\x1b[38;5;208m" + `
    ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
    ██                                                                                                                ██
    ██                                                                                                                ██
    ██    ██   ██   ██████   ████████  ███████  ██            ███████        ██       ██    ██  ██    ██   ██████     ██
    ██    ██   ██  ██    ██     ██     ██       ██            ██             ██       ██    ██    ██ ██   ██    ██    ██
    ██    ███████  ██    ██     ██     █████    ██            ███████  ████  ██       ██    ██     ██     ██    ██    ██
    ██    ██   ██  ██    ██     ██     ██       ██            ██             ██       ██    ██    ██ ██   ██    ██    ██
    ██    ██   ██   ██████      ██     ███████  ███████       ██             ███████   ██████   ██    ██   ██████     ██
    ██                                                                                                                ██
    ██                                                                                                                ██
    ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
        ` + "\x1b[0m");
    console.log("\x1b[38;5;208m" + "----------------------------------------------------------------------------------------------------------------------------"+ "\x1b[0m");
    console.log("\n");
    let sistema = new Sistema();
    sistema.iniciar_sistema();

}, 1500);

const requisicao = require('readline-sync'); //comando necessario para interacao em terminal em js
const fs = require('fs');
const { threadId } = require('worker_threads');
const arquivo_banco = 'banco_de_dados.json'; // banco de dados

class Reserva { //criando a classe Reserva
    constructor(reserva_id, cliente_id, status, check_in, check_out, nome_quarto) {
        this.reserva_id = reserva_id;
        this.cliente_id = cliente_id;
        this.status = status;
        this.check_in = check_in;
        this.check_out = check_out;
        this.nome_quarto = nome_quarto; //atributo criado para facilitar o uso do sistema pelo usuario
    }
}
class Funcionario { //criando a classe Funcionario
    constructor(func_id, nome_usuario, cpf, email, senha) {
        this.func_id = func_id;
        this.nome_usuario = nome_usuario;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
    }
}
class Cliente { //criando a classe Cliente
    constructor(cliente_id, nome, data_nascimento, cpf, email, senha) {
        this.cliente_id = cliente_id;
        this.nome = nome;
        this.data_nascimento = data_nascimento;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
    }
}
class Quartos { //criando a classe Quartos
    constructor(quantidade_camas, preco_noite, nome, descricao) {
        this.quantidade_camas = quantidade_camas;
        this.preco_noite = preco_noite; 
        this.nome = nome;
        this.descricao = descricao;
    }
}
class Sistema { //criando a classe Sistema, que sera a classe principal do codigo, onde estara todos os metodos a serem utilizados
    constructor(){
        
        // estrutura padrao do banco de dados
        this.estrutura_padrao = {
            clientes: [],
            funcionarios: [],
            quartos: [],
            reservas: [],
            avaliacoes: [],
            ids: []
        };
        // carrega banco de dados
        if (fs.existsSync(arquivo_banco) && fs.statSync(arquivo_banco).size > 0) {
            let dados_brutos = fs.readFileSync(arquivo_banco, 'utf8');
            this.banco_dados = JSON.parse(dados_brutos);
        } else { // caso o arquivo json esteja vazio ou nao exista atribui a estrutura padrao
            this.banco_dados = this.estrutura_padrao; 
        }
    } 

//OBS: o metodo printar_logo() eh chamado sempre que se deseja limpar o terminal e printar a logo
    iniciar_sistema(){ //metodo para inicializacao do sistema
        while (true){
            console.log("\n\x1b[38;5;208m" + "                    -------------------------- Bem vindo ao Hotel F-Luxo --------------------------\n\n                    O que deseja fazer?\n");
            console.log("\n\x1b[38;5;208m" + "                    1 - Fazer Login\n                    2 - Fazer Cadastro\n                    3 - Sair do Programa\n");
            let escolha = requisicao.question("\x1b[38;5;208m" + "                    Selecione uma das opcoes acima: "); //mostra as opcoes e faz o usuario escolher uma dentre elas

            switch(escolha){
                case "1":

                    let login = this.fazer_login(); //variavel que chama o metodo fazer_login() para fazer login

                    if (login == "saiu"){ // caso o usuario nao queira se logar mais
                        console.log("\n\x1b[38;5;208m" + "                    Voltou ao menu principal.");

                    } else if (login[0] == "Funcionario"){ // loga com a conta como funcionario
                        this.funcionario_logado(login[1]);

                    } else { // loga com a conta como cliente
                        this.cliente_logado(login[1]); 
                    }
                    break;
        
                case "2":
                    this.fazer_cadastro(); //abre o menu de cadastro
                    break;
        
                case "3": // opcao para sair do programa
                    this.printar_logo();
                    while (true){ //loop para garantir que o usuario digire uma opcao valida (sim ou nao)
                        let confirmacao_saida = requisicao.question("\n\x1b[38;5;208m" + "                                   Tem certeza que deseja sair do aplicativo? (sim/nao): " + "\x1b[0m");
                        if (confirmacao_saida.toUpperCase() == "SIM"){ // caso seja sim, salva as informacoes no bando de dados e printa uma tela de encerramento
                            fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8');
                            console.clear();
                            console.log("\n\n\n\n"); // bloco de codigo para simular uma tela de encerramento
                            let frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
                            let posicao = 0;
                            let fechando = setInterval(() => {
                                process.stdout.write("\x1b[38;5;208m" + `\r                                                     ${frames[posicao]} Encerrando Aplicativo` + "\x1b[0m" );
                                posicao = (posicao + 1) % frames.length;
                            }, 100);
                            setTimeout(() => {
                                clearInterval(fechando); // quando a tela de finalizacao acaba, limpa o terminal e finaliza o sistema
                                console.clear();
                            }, 2500);
                            return;
                        } else if (confirmacao_saida.toUpperCase() == "NAO"){ // caso seja nao volta para o menu principal
                            this.printar_logo();
                            break;
                        } else { // para o caso de nao digitar uma opcao valida, o loop continua
                            console.log("\n\x1b[38;5;208m" + "                                   Por favor, digite uma resposta valida.");//ate o usuario inserir uma opcao valida o loop eh repetido)
                        }
                    }  
                    break;
                default: // caso o usuario nao digite uma opcao valida
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Por favor, digite uma opcao valida.");//ate o usuario inserir uma opcao valida o loop eh repetido
                    break;
            }
        }
    }

    tipo_login(){ // metodo para identificar se o usuario ira se logar como funcionario ou cliente
        this.printar_logo();
        while (true) { // loop para garantir que o usuario digite uma opcao valida
            this.printar_login();
            console.log("\x1b[38;5;208m" + "                   1 - Logar como funcionario\n                   2 - Logar como cliente\n                   3 - Voltar ao menu principal\n");
            let escolha = requisicao.question("\x1b[38;5;208m" + "                   Selecione uma das opcoes acima: "); //mostra as opcoes e faz o usuario escolher uma dentre elas
            switch(escolha){
                case "1": //caso o usuario escolha a opcao 1, o login sera do tipo funcionario
                    this.printar_logo();
                    return "tipo funcionario";
        
                case "2": //caso o usuario escolha a opcao 2, o login sera do tipo cliente
                    this.printar_logo();
                    return "tipo cliente";
        
                case "3": //encerra o loop e volta ao menu principal
                    this.printar_logo();
                    return "sair";
                    
                default: //ate o usuario inserir uma opcao valida o loop eh repetido
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Por favor, digite uma opcao valida.");
                    break
            }
        }

    } 
    buscar_funcionario(conta, senha){ // metodo para buscar usuarios
        // como nao podera ter email's iguais no banco de dados, a busca podera ser feita unificadamente 
        let confirmacao_conta = false; // busca na parte no banco de dados de funcionarios
        for (let i = 0; i < (this.banco_dados.funcionarios.length); i++){ //passa pela lista de funcionarios para ver se o email ou nome de usuario esta cadastrado la
            if (conta == this.banco_dados.funcionarios[i].email || conta == this.banco_dados.funcionarios[i].nome_usuario){
                confirmacao_conta = true; //usuario digitou um email ou nome de usuario cadastrado
                if (senha == this.banco_dados.funcionarios[i].senha){ //caso o email ou nome de usuario esteja cadastrado, ve se a senha esta correta
                    return [true, this.banco_dados.funcionarios[i]];//retorna um indicativo de que encontrou o funcionario e o funcionario encontradp
                }
            }
        }
        if (confirmacao_conta == false){ // caso a conta n seja encontrada
            return "usuario nao encontrado";
        } else { // a conta foi encontrada mas a senha estava errada
            return "senha incorreta";
        }
    }

    buscar_cliente(conta, senha){ // metodo para buscar clientes
        let confirmacao_conta = false;
        for (let i = 0; i < (this.banco_dados.clientes.length); i++){ //passa pela lista de clientes para ver se o email esta cadastrado la
            if (conta == this.banco_dados.clientes[i].email){
                confirmacao_conta = true; //usuario digitou um email cadastrado
                if (senha == this.banco_dados.clientes[i].senha){ //caso o email esteja cadastrado, ve se a senha esta correta
                    return [true, this.banco_dados.clientes[i]];//retorna um indicativo de que encontrou o cliente e o cliente encontrado
                }
            }
        }
        if (confirmacao_conta == false){ // caso a conta n seja encontrada
            return "usuario nao encontrado";
        } else { // a conta foi encontrada mas a senha estava errada
            return "senha incorreta";
        }
    }

    logar_funcionario(){ // metodo para pergunta e validacao de un login de funcionario
        while(true){  // loop para garantir que o usuario digite senhas e email ou nome de usuario validos
            this.printar_login();
            console.log("\x1b[38;5;208m" + "                    Digite a tecla enter com a caixa de texto vazia para sair do login.\n");
            let conta_usuario = requisicao.question("\x1b[38;5;208m" + "                    Digite seu nome de usuario ou e-mail de login: "); //pergunta o email ou o nome de usuario
            if (conta_usuario == ""){ // caso o usuario nao queira se logar mais
                console.log("\n\x1b[38;5;208m" + "                    Saindo...");
                this.printar_logo();
                return "saiu"; //retorna uma indicacao de que o usuario saiu
            }
            let senha = requisicao.question("\x1b[38;5;208m" + "                    Digite sua senha: "); // pergunta a senha
            if (senha == ""){ // caso o usuario nao queira se logar mais
                console.log("\n\x1b[38;5;208m" + "                    Saindo...");
                this.printar_logo();
                return "saiu"; //retorna uma indicacao de que o usuario saiu
            }
            let buscar_funcionario = this.buscar_funcionario(conta_usuario,senha);
            if (buscar_funcionario == "usuario nao encontrado"){ // caso do usuario nao ser encontrado
                this.printar_logo();
                console.log("\n\x1b[38;5;208m" + "                    O e-mail ou nome de usuario digitado não esta cadastrado como funcionario, tente novamente.");
            } else if (buscar_funcionario == "senha incorreta") { // caso do usuario ser encontrado mas a senha estar errada
                this.printar_logo();
                console.log("\x1b[38;5;208m" + "                    Senha incorreta."); 
            } else { // quando o login esta correto o funcionario pode entrar na conta
                this.printar_logo();
                console.log("\x1b[38;5;208m" + "                    Conta acessada com sucesso!"); 
                return buscar_funcionario[1]; // retorna o funcionario
            }
        }
    }

    logar_cliente(){  //metodo para pergunta e validacao de un login de cliente
        while(true){  // loop para garantir que o usuario digite senhas e email ou nome de usuario validos
            this.printar_login();
            console.log("\x1b[38;5;208m" + "                    Digite a tecla enter com a caixa de texto vazia para sair do login.\n");
            let conta_usuario = requisicao.question("\x1b[38;5;208m" + "                    Digite seu e-mail de login: "); //pergunta o email ou o nome de usuario
            if (conta_usuario == ""){ // caso o usuario nao queira se logar mais
                console.log("\n\x1b[38;5;208m" + "                    Saindo...");
                this.printar_logo();
                return "saiu"; //retorna uma indicacao de que o usuario saiu
            }
            let senha = requisicao.question("\x1b[38;5;208m" + "                    Digite sua senha: "); // pergunta a senha
            if (senha == ""){ // caso o usuario nao queira se logar mais
                console.log("\n\x1b[38;5;208m" + "                    Saindo...");
                this.printar_logo();
                return "saiu"; //retorna uma indicacao de que o usuario saiu
            }
            let buscar_cliente = this.buscar_cliente(conta_usuario,senha);
            if (buscar_cliente == "usuario nao encontrado"){ // caso do usuario nao ser encontrado
                this.printar_logo();
                console.log("\n\x1b[38;5;208m" + "                    O e-mail ou nome de usuario digitado não esta cadastrado como cliente, tente novamente.");
            } else if (buscar_cliente == "senha incorreta") { // caso do usuario ser encontrado mas a senha estar errada
                this.printar_logo();
                console.log("\x1b[38;5;208m" + "                    Senha incorreta."); 
            } else { // quando o login esta correto o cliente pode entrar na conta
                this.printar_logo();
                console.log("\x1b[38;5;208m" + "                    Conta acessada com sucesso!"); 
                return buscar_cliente[1]; // retorna o cliente
            }
        }
    }
    
    fazer_login() { //metodo para fazer o login
        this.printar_logo();
        let tipo_login = this.tipo_login(); // chama metodo para encontrar o tipo de login
        if (tipo_login == "tipo funcionario"){ // tipo login eh funcionario
            let funcionario = this.logar_funcionario(); // chama metodo para logar o funcionario
            if (funcionario == "saiu"){ // usuario quis sair do login
                return "saiu";
            } else {
                return ["Funcionario", funcionario]; // retorna o funcionario e uma indicacao que ele logou
            }
        } else if (tipo_login == "tipo cliente") { // tipo login eh cliente
            let cliente = this.logar_cliente(); // chama metodo para logar o cliente
            if (cliente == "saiu"){ // usuario quis sair do login
                return "saiu";
            } else {
                return ["Cliente", cliente]; // retorna o cliente e uma indicacao que ele logou
            }
        } else {
            return "saiu";
        }
    }

    fazer_cadastro(){//metodo para fazer o cadastro
        this.printar_logo();
        while(true){
            console.log("\x1b[38;5;208m" + `                                                                 
                    ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
                   █                                                   █
                   █  ▄▀▀▀  ▄▀▀▄  █▀▀▄  ▄▀▀▄  ▄▀▀▀  ▀▀█▀▀  ▄▀▀▄  ▄▀▀▄  █
                   █  █     █▄▄█  █  █  █▄▄█   ▀▀▄    █    █▀▀▄  █  █  █
                   █   ▀▀▀  ▀  ▀  ▀▀▀   ▀  ▀  ▀▀▀     ▀    ▀  ▀   ▀▀   █
                   ▀▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▀
       ` + "\x1b[0m"); // printa uma imagem de cadastro
            console.log("\x1b[38;5;208m" + "                   1 - Cadastrar como funcionario\n                   2 - Cadastrar como cliente\n                   3 - Voltar ao menu principal\n");
            let escolha = requisicao.question("\x1b[38;5;208m" + "                   Selecione uma das opcoes acima: "); //mostra as opcoes e faz o usuario escolher uma dentre elas

            switch(escolha){
                case "1": //caso o usuario escolha a opcao 1, o cadastro sera de funcionario
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    --------------------------- Cadastro - Funcionario --------------------------\n");
                    //pede os dados de cadastro ao funcionario
                    console.log("\x1b[38;5;208m" + "                    Aperte a tecla enter com a caixa de texto vazia se quiser sair do cadastro.\n");
                    let nome_usuario_func = this.perguntar_nome_usuario(); // chama o metodo para perguntar o nome de usuario
                    if (nome_usuario_func == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        this.printar_logo();
                        break;
                    }
                    let cpf_funcionario = this.perguntar_cpf(); // chama o metodo para perguntar o cpf
                    if (cpf_funcionario == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        this.printar_logo();
                        break;
                    }
                    let email_func = this.perguntar_email(); // chama o metodo para perguntar o email
                    if (email_func == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        this.printar_logo();
                        break;
                    }
                    let senha_func = this.perguntar_senha(); // chama o metodo para perguntar a senha
                    if (senha_func == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        this.printar_logo();
                        break;
                    }
                    let func_id = this.gerar_id(); // chama o metodo para gerar um id unico e aleatorio
                    this.banco_dados.funcionarios.push(new Funcionario(func_id, nome_usuario_func, cpf_funcionario, email_func, senha_func)); //armazena os dados do funcionario em um banco de dados
                    fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // salva o novo usuario no banco de dados
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Cadastro realizado com sucesso!\n"); // printa que o cadastro foi bem sucedido
                    console.log("\x1b[38;5;208m" + "                    Voce sera redirecionado ao menu de cadastramento.");
                    break;
        
                case "2":
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    ----------------------------- Cadastro - Cliente -----------------------------\n");
                    console.log("\x1b[38;5;208m" + "                    Aperte a tecla enter com a caixa de texto vazia se quiser sair do cadastro.\n");
                    //pede os dados de cadastro ao cliente
                    let nome_cliente = this.perguntar_nome(); // chama o metodo para perguntar o nome
                    if (nome_cliente == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        this.printar_logo();
                        break;
                    }
                    let data_cliente = this.perguntar_data_nascimento(); // chama o metodo para perguntar a data de nascimento
                    if (data_cliente == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        this.printar_logo();
                        break;
                    }
                    let cpf_cliente = this.perguntar_cpf(); // chama o metodo para perguntar o cpf
                    if (cpf_cliente == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        this.printar_logo();
                        break;
                    }
                    let email_cliente = this.perguntar_email(); // chama o metodo para perguntar o email
                    if (email_cliente == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        this.printar_logo();
                        break;
                    }
                    let senha_cliente = this.perguntar_senha(); // chama o metodo para perguntar a senha
                    if (senha_cliente == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        this.printar_logo();
                        break;
                    }
                    let cliente_id = this.gerar_id(); // chama o metodo para gerar um id unico e aleatorio
                    this.banco_dados.clientes.push(new Cliente(cliente_id, nome_cliente, data_cliente, cpf_cliente, email_cliente, senha_cliente)); //armazena os dados do cliente em um banco de dados
                    fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // salva o novo usuario no banco de dados
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Cadastro realizado com sucesso!\n"); // printa que o cadastro foi bem sucedido
                    console.log("\x1b[38;5;208m" + "                    Voce sera redirecionado ao menu de cadastramento.");
                    break;
        
                case "3": //encerra o loop e volta ao menu principal
                    this.printar_logo();
                    return console.log("\n\x1b[38;5;208m" + "                    Voltou ao menu principal com exito.\n");
                    
                default: //ate o usuario inserir uma opcao valida o loop eh repetido
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Por favor, digite uma opcao valida.");
                    break
            }
        }
    }

    funcionario_logado(funcionario) { //metodo para o usuario interagir com o sistema estando logado como funcionario
        this.printar_logo();
        while(true) {
            console.log("\n\x1b[38;5;208m" + "                    --------------------------- Sua conta (Funcionario) ---------------------------\n");
            console.log("\x1b[38;5;208m" + 
                "                    1 - Ver meus Dados\n" + 
                "                    2 - Ver lista de Reservas\n" + 
                "                    3 - Ver lista de Quartos\n" + 
                "                    4 - Ver lista de Clientes\n" + 
                "                    5 - Mudar status da reserva (pendente, adiada, realizada, cancelada)\n" + 
                "                    6 - Adicionar Quarto\n" + 
                "                    7 - Editar Quarto\n" + 
                "                    8 - Excluir Quarto\n" + 
                "                    9 - Modificar Dados\n" + 
                "                    10 - Visualizar Avaliacoes\n" + 
                "                    11 - Sair da Conta");
            let escolha = requisicao.question("\n\x1b[38;5;208m" + "                    Selecione uma das opcoes acima: "); //mostra as opcoes e faz o usuario escolher uma dentre elas
            
            switch(escolha){
                case "1": // opcao para ver dados
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Seus dados:\n");
                    this.ver_dados(this.banco_dados.funcionarios, funcionario); // chama o metodo para ver dados 
                    let manter_dados = requisicao.question("\n\x1b[38;5;208m" + "                    Digite a tecla enter para sair da visualizacao."); // bloco de codigo para o usuario se manter visualizando apenas seus dados
                    if (manter_dados!= "4848484848fgfgjfrjgj85t858t49jr48hr84rt4tni"){ // input praticamente impossivel do usuario digitar
                        this.printar_logo();
                        break;
                    }
                
                case "2": // opcao para ver reservas
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    ------------------------------ Lista de Reservas ------------------------------\n"+ "\x1b[0m");
                    this.ver_lista_objetos(this.banco_dados.reservas,"reserva"); // chama metodo para printar as reservas
                    let manter_rerservas = requisicao.question("\n\x1b[38;5;208m" + "                    Digite a tecla enter para sair da visualizacao."); // bloco de codigo para o usuario se manter visualizando apenas os dados
                    if (manter_rerservas != "4848484848fgfgjfrjgj85t858t49jr48hr84rt4tni"){ // input impossivel do usuario digitar
                        this.printar_logo();
                        break;
                    } 
                    
                case "3": // opcao para ver quartos
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    ------------------------------ Lista de Quartos ------------------------------\n"+ "\x1b[0m");
                    this.ver_lista_objetos(this.banco_dados.quartos,"quarto"); // chama metodo para printar os quartos
                    let manter_quartos = requisicao.question("\n\x1b[38;5;208m" + "                    Digite a tecla enter para sair da visualizacao."); // bloco de codigo para o usuario se manter visualizando apenas os dados
                    if (manter_quartos != "4848484848fgfgjfrjgj85t858t49jr48hr84rt4tni"){ // input impossivel do usuario digitar
                        this.printar_logo();
                        break;
                    } 
                
                case "4": // opcao para ver clientes
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    ------------------------------ Lista de Clientes ------------------------------\n"+ "\x1b[0m");
                    this.ver_lista_objetos(this.banco_dados.clientes,"cliente"); // chama metodo para printar os clientes
                    let manter_clientes = requisicao.question("\n\x1b[38;5;208m" + "                    Digite a tecla enter para sair da visualizacao."); // bloco de codigo para o usuario se manter visualizando apenas os dados
                    if (manter_clientes != "4848484848fgfgjfrjgj85t858t49jr48hr84rt4tni"){ // input impossivel do usuario digitar
                        this.printar_logo();
                        break;
                    }

                case "5": // opcao para alterar status de reserva
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    ------------------------------ Lista de Reservas ------------------------------\n"+ "\x1b[0m");
                    this.ver_lista_objetos(this.banco_dados.reservas,"reserva"); // mostra a lista de reservas para o funcionario poder alterar com mais clareza
                    console.log("\n\x1b[38;5;208m" + "                    Alterar status de reserva:\n");
                    this.mudar_status(); // chama metodo para alter status
                    break;

                case "6": // opcao para adicionar quarto
                    this.printar_logo();
                    this.adicionar_quarto(); // chama metodo para adicionar quarto
                    break;
                
                case "7": // opcao para editar quarto
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    ------------------------------ Lista de Quartos ------------------------------\n"+ "\x1b[0m");
                    this.ver_lista_objetos(this.banco_dados.quartos,"quarto"); // mostra lista de quartos para o funcionario poder editar com mais clareza
                    this.editar_quarto(); // chama o metodo para editar quarto
                    fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // atualiza o quarto editado no banco de dados
                    break;

                case "8": // oppcao para excluir quarto
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    ------------------------------ Lista de Quartos ------------------------------\n"+ "\x1b[0m");
                    this.ver_lista_objetos(this.banco_dados.quartos,"quarto"); // mostra lista de quartos para o funcionario poder excluir com mais clareza
                    this.excluir_quarto(); // chama o metodo para excluir quarto
                    fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // atualiza o quarto excluido no banco de dados
                    break;

                case "9": // opcao para modificar os dados
                    this.printar_logo();
                    this.modificar_funcionario(funcionario); // chama metodo para modificar dados com funcionario como parametro
                    fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // atualiza o funcionario no banco de dados
                    break;
                
                case "10": // opcao para visualizar avaliacoes
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    --------------------------------- Avaliacoes ---------------------------------\n"+ "\x1b[0m");
                    this.visualizar_avaliacoes(); // chama metodo para visualizar avaliacoes
                    let manter_avaliacoes = requisicao.question("\n\x1b[38;5;208m" + "                    Digite a tecla enter para sair da visualizacao."); // bloco de codigo para o usuario se manter visualizando apenas as avaliacoes
                    if (manter_avaliacoes != "4848484848fgfgjfrjgj85t858t49jr48hr84rt4tni"){ // input praticamente impossivel do usuario digitar
                        this.printar_logo();
                        break;
                    }
               
                case "11": // opcao para sair da conta
                    this.printar_logo();
                    return console.log("\n\x1b[38;5;208m" + "                    Saiu da conta com exito.");//encerra o loop e sai da interface de usuario logado
                
                default: // caso o usuario digite uma opcao invalida
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Por favor, digite uma opcao valida.");//ate o usuario inserir uma opcao valida o loop eh repetido
                    break;
            }
        }
    }

    cliente_logado(cliente) { //metodo para o usuario interagir com o sistema estando logado como cliente
        this.printar_logo();
        while(true){
            console.log("\n\x1b[38;5;208m" + "                    ----------------------------- Sua conta (Cliente) -----------------------------\n");
            console.log("\x1b[38;5;208m" +
                "                    1 - Ver meus Dados\n" +
                "                    2 - Ver lista de Quartos\n" +
                "                    3 - Fazer reserva\n" +
                "                    4 - Cancelar reserva\n" +
                "                    5 - Ver minhas reservas\n" +
                "                    6 - Modificar Dados\n" +
                "                    7 - Avaliar Estadia\n" +
                "                    8 - Visualizar Avaliacoes\n" +
                "                    9 - Sair da Conta"
            );
            let escolha = requisicao.question("\n\x1b[38;5;208m" + "                    Selecione uma das opcoes acima: "); //mostra as opcoes e faz o usuario escolher uma dentre elas
            
            switch(escolha){
                case "1": // opcao para cliente ver seus dados
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Seus dados:\n");
                    this.ver_dados(this.banco_dados.clientes, cliente); // chama metodo para visualizado dos dados
                    let manter_dados = requisicao.question("\n\x1b[38;5;208m" + "                    Digite a tecla enter para sair da visualizacao."); // bloco de codigo para o usuario se manter visualizando apenas seus dados
                    if (manter_dados!= "4848484848fgfgjfrjgj85t858t49jr48hr84rt4tni"){ // input praticamente impossivel do usuario digitar
                        this.printar_logo();
                        break;
                    }

                case "2": // opcao para ver quartos
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    ------------------------------ Lista de Quartos ------------------------------\n"+ "\x1b[0m");
                    this.ver_lista_objetos(this.banco_dados.quartos,"quarto"); // mostra lista de quartos para o cliente poder ver
                    let manter_quartos = requisicao.question("\n\x1b[38;5;208m" + "                    Digite a tecla enter para sair da visualizacao."); // bloco de codigo para o usuario se manter visualizando apenas os dados
                    if (manter_quartos != "4848484848fgfgjfrjgj85t858t49jr48hr84rt4tni"){ // input praticamente impossivel do usuario digitar
                        this.printar_logo();
                        break;
                    }
                
                case "3": // opcao para fazer reserva
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Quartos Disponiveis:\n" + "\x1b[0m");
                    this.ver_lista_objetos(this.banco_dados.quartos,"quarto"); // mostra os quartos ao cliente para poder fazer a reserva com mais clareza
                    console.log("\n\x1b[38;5;208m" + "                    Fazer reserva:");
                    this.fazer_reserva(cliente); // chama metodo pra fazer reserva
                    break;

                case "4": // opcao para cancelar reserva
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Suas reservas:\n");
                    this.ver_minha_reserva(this.banco_dados.reservas, cliente); // mostra as reservas do usuario para poder cancelar com mais clareza
                    console.log("\n\x1b[38;5;208m" + "                    Cancelar reserva:\n");
                    this.cancelar_reserva(cliente); // chama metodo para cancelar reserva
                    break;

                case "5": // opcao para ver reserva
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Suas reservas:\n");
                    this.ver_minha_reserva(this.banco_dados.reservas, cliente); // chama metodo para mostrar as reservas do usuario
                    let manter_visualizacao = requisicao.question("\n\x1b[38;5;208m" + "                    Digite a tecla enter para sair da visualizacao."); // bloco de codigo para o usuario se manter visualizando apenas os dados
                    if (manter_visualizacao!= "4848484848fgfgjfrjgj85t858t49jr48hr84rt4tni"){ // input praticamente impossivel do usuario digitar
                        this.printar_logo();
                        break;
                    }
                    break;
                
                case "6": // opcao para alterar dados do usuario
                    this.printar_logo();
                    this.modificar_cliente(cliente); // chama metodo para alterar os dados com cliente como parametro
                    fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // atualiza o cliente no banco de dados
                    break;
                
                case "7": // opcao para avaliar estadia
                    this.printar_logo();
                    this.avaliar_estadia(cliente);// chama metodo para avaliar estadia
                    fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); //salva as avaliacoes no banco de dados
                    break;
                
                case "8": // opcap para visualizar avaliacoes
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    --------------------------------- Avaliacoes ---------------------------------\n"+ "\x1b[0m");
                    this.visualizar_avaliacoes(); // chama metodo para visualizar avaliacoes
                    let manter_avaliacoes = requisicao.question("\n\x1b[38;5;208m" + "                    Digite a tecla enter para sair da visualizacao."); // bloco de codigo para o usuario se manter visualizando apenas as avaliacoes
                    if (manter_avaliacoes != "4848484848fgfgjfrjgj85t858t49jr48hr84rt4tni"){ // input praticamente impossivel do usuario digitar
                        this.printar_logo();
                        break;
                    }
    
                case "9": // opcap para sair da conta e voltar ao menu principal
                    this.printar_logo();
                    return console.log("\n\x1b[38;5;208m" + "                    Saiu da conta com exito.");//encerra o loop e sai da interface de usuario logado
                
                default: // caso o usuario digite uma opcao invalida
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Por favor, digite uma opcao valida.");//ate o usuario inserir uma opcao valida o loop eh repetido
                    break;
            }
        }
    }

    ver_dados(lista,usuario){ // metodo para mostrar dados do usuario
        for (let i = 0; i < (lista.length); i++){
            if (usuario.email == lista[i].email){ // faz uma busca no banco de dados para encontrar o email (utiliza o email como diferenciacao de usuario)
                for (let chave in usuario) { // itera sobre os atributos do objeto usuário e imprime de maneira formatada
                    if (usuario.hasOwnProperty(chave)) {
                        const valor = usuario[chave];
                        const nome_bonito = this.formatar_atributo(chave); // chama a função formatar_atributo para formatar o nome do atributo
                        console.log(`\x1b[38;5;208m                      ${nome_bonito}: ${valor}`);
                    }
                }
            }
        }
    }

    adicionar_quarto(){ // metodo para adicionar quartos
        console.log("\n\x1b[38;5;208m" + "                    ------------------------------------ Adicionar Quarto -------------------------------------\n");
        console.log("\x1b[38;5;208m" + "                    Digite a tecla enter com a caixa de texto vazia caso nao queira mais adicionar o quarto\n");
        
        let qtd_camas = this.perguntar_qtd_camas(); // chama metodo para perguntar a qtd de cama
        if (qtd_camas == "sair"){
            this.printar_logo();
            return console.log("\n\x1b[38;5;208m" + "                    Saindo...");
        }
        let preco_noite = this.perguntar_preco(); // chama metodo para perguntar o preco
        if (preco_noite == "sair"){
            this.printar_logo();
            return console.log("\n\x1b[38;5;208m" + "                    Saindo...");
        }
        let nome_quarto = this.perguntar_nome_quarto(); // chama metodo para perguntar o nome do quarto
        if (nome_quarto == "sair"){
            this.printar_logo();
            return console.log("\n\x1b[38;5;208m" + "                    Saindo...");
        }
        let descricao = this.perguntar_descricao(); // chama metodo para perguntar descricao
        if (descricao == "sair"){
            this.printar_logo();
            return console.log("\n\x1b[38;5;208m" + "                    Saindo...");
        }
        
        this.banco_dados.quartos.push(new Quartos(qtd_camas, preco_noite, nome_quarto, descricao)); //armazena os dados do quarto em um banco de dados
        fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // salva o novo quarto no banco de dados
        this,this.printar_logo();
        console.log("\n\x1b[38;5;208m" + "                    Quarto adicionado com sucesso!");
    }

    fazer_reserva(usuario_cliente){ //metodo para o usuario realizar uma reserva
        if (this.banco_dados.quartos.length == 0){ // caso nao tenha quartos no banco de dados
            return console.log("\x1b[38;5;208m" + "                    Nao ha quartos disponiveis para fazer reserva.");
        }
        console.log("\n\x1b[38;5;208m" + "                    Digite a tecla enter com a caixa de texto vazia caso nao queira fazer a reserva.\n");
        
        let datas = this.perguntar_checkout_e_checkin();
        if (datas == "saiu"){
            this.printar_logo();
            return console.log("\n\x1b[38;5;208m" + "                    Saindo...");
        }
        let nome_quarto = this.perguntar_nome_quarto_reserva();
        if (nome_quarto == "sair"){
            this.printar_logo();
            return console.log("\n\x1b[38;5;208m" + "                    Saindo...");
        }
        let reserva_id = this.gerar_id(); // chama o metodo para gerar um id unico e aleatorio
        
        this.banco_dados.reservas.push(new Reserva(reserva_id, usuario_cliente.cliente_id, "REALIZADA", datas[0], datas[1], nome_quarto)); //armazena os dados da reserva em um banco de dados
        fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // salva a nova reserva no banco de dados
        this.printar_logo();
        console.log("\n\x1b[38;5;208m" + "                    Reserva realizada com sucesso!");
    }

    ver_minha_reserva(lista, usuario_cliente){ // metodo para o cliente ver suas reservas
        let contagem = 0; // variavel de contagem para contabilizar as vezes que o id do cliente sera encontrado na lista de reservas
        for (let i = 0; i < (lista.length); i++){
            if (usuario_cliente.cliente_id == lista[i].cliente_id){// faz uma busca no banco de dados para encontrar o id do cliente
                console.log("\x1b[38;5;208m" + "                    Reserva" + ` ${contagem+1}:\n`);
                contagem++;
                for (let chave in lista[i]) { // itera sobre os atributos do objeto cliente e imprime de maneira formatada
                    if (lista[i].hasOwnProperty(chave)) {
                        const valor = lista[i][chave];
                        const nome_bonito = this.formatar_atributo(chave); // chama a função formatar_atributo para formatar o nome do atributo
                        console.log(`\x1b[38;5;208m                      ${nome_bonito}: ${valor}`);
                    }
                }
            console.log("\x1b[38;5;208m" + "                    -----------------------------");
            }
        }
        if (contagem == 0){ // condicional: se o id do cliente nao for encontrado na lista de reservas
            return console.log("\x1b[38;5;208m" + "                    Voce nao tem reservas.");
        }
    }

    cancelar_reserva(usuario_cliente){ // metodo para o usuario cancelar a reserva
        console.log("\x1b[38;5;208m" + "                    Digite a tecla enter com a caixa de texto vazia para sair do cancelamento.\n");
        let escolha = requisicao.question("\x1b[38;5;208m" + "                    Digite o ID da reserva que deseja cancelar: ");
        let contagem = 0; // variavel de contagem para contabilizar as vezes que o id do cliente sera encontrado na lista de reservas
        if (escolha == ""){
            this.printar_logo();
            return console.log("\n\x1b[38;5;208m" + "                    Saindo...");
        }
        for (let i = 0; i < (this.banco_dados.reservas.length); i++){
            if (usuario_cliente.cliente_id == this.banco_dados.reservas[i].cliente_id){// faz uma busca no banco de dados para encontrar o id do cliente
                if (escolha == this.banco_dados.reservas[i].reserva_id.toString()){ // sabendo que o usuario tem a reserva, agora analisa se o id digitado dessa reserva eh o msm que ele digitou para cancelar
                    this.banco_dados.reservas.splice(i,1); // se encontrar, muda o status da reserva para cancelada e a exclui
                    fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // atualiza a reserva excluida no banco de dados        
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Reserva cancelada com sucesso!");
                    contagem++;
                }
            }
        }
        if (contagem == 0){ // condicional: se o id do cliente nao for encontrado na lista de reservas
            this.printar_logo();
            console.log("\n\x1b[38;5;208m" + "                    Reserva nao encontrada.")
        }
    }

    mudar_status(){ // metodo apra o usuario alterar o status de uma reserva
        if (this.banco_dados.clientes.length == 0){ // caso nao tenha reservas
            return console.log("\n\x1b[38;5;208m" + "                    Nao ha reservas realizadas.");
        }
        console.log("\x1b[38;5;208m" + "                    Digite a tecla enter com a caixa de texto vazia para sair da alteracao.\n");
        let escolha = requisicao.question("\x1b[38;5;208m" + "                    Digite o ID da reserva que deseja alterar o status: ")
        if (escolha == ""){ // caso o usuario queira sair
            this.printar_logo();
            return console.log("\n\x1b[38;5;208m" + "                    Saindo...");
        }
        let contagem = 0; // variavel de contagem para contabilizar as vezes que o id do cliente sera encontrado na lista de reservas
        for (let i = 0; i < (this.banco_dados.reservas.length); i++){
            if (escolha == this.banco_dados.reservas[i].reserva_id.toString()){ // sabendo que o usuario tem a reserva, agora analisa se o id digitado dessa reserva eh o msm que ele digitou para cancelar
                while (true){
                    let alteracao_status = requisicao.question("\n\x1b[38;5;208m" + "                    Digite o status que deseja atribuir (pendente, adiada, realizada, cancelada) ou enter para sair: ")
                    if (alteracao_status == ""){ // caso o usuario queira sair
                        this.printar_logo();
                        return console.log("\n\x1b[38;5;208m" + "                    Saindo...");

                    } else if (alteracao_status.toUpperCase() !== "PENDENTE" && // caso o status digitado nao seja pendente, adiada, realizada ou cancelada
                        alteracao_status.toUpperCase() !== "ADIADA" && 
                        alteracao_status.toUpperCase() !== "REALIZADA" && 
                        alteracao_status.toUpperCase() !== "CANCELADA") {
                        console.log("\n\x1b[38;5;208m" + "                    Status invalido, por favor digite novamente.");

                    } else if (alteracao_status.toUpperCase() == "CANCELADA") {
                        this.banco_dados.reservas.splice(i,1); // se for cancelada, exclui a reserva
                        this.printar_logo();   
                        console.log("\n\x1b[38;5;208m" + "                    Status alterado para cancelada, a reserva sera excluida.\n");
                        break;
                        
                    } else {
                        this.banco_dados.reservas[i].status = alteracao_status.toUpperCase(); // muda o status da reserva   
                        this.printar_logo();
                        console.log("\n\x1b[38;5;208m" + "                    Status alterado com sucesso!");
                        break;
                    }
                }
                fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // atualiza o status da reserva no bando de dados
                contagem++;
            }
        }
        if (contagem == 0){ // condicional: se o id do cliente nao for encontrado na lista de reservas
            this.printar_logo();
            return console.log("\n\x1b[38;5;208m" + "                    Reserva nao encontrada.")
        }
    }

    modificar_funcionario(funcionario){ // metodo para modificar os dados do funcionario
        let posicao_funcionario;
        for (let i = 0; i < (this.banco_dados.funcionarios.length); i++){ //encontra a posicao do usuario na lista de funcionarios de acordo com o nome de usuario
            if (funcionario.nome_usuario == this.banco_dados.funcionarios[i].nome_usuario){
                posicao_funcionario = i;
                break;
            }
        }
        while (true){ // loop para garantir que o usuario digite uma opcao valida e se mantenha no menu
            console.log("\n\x1b[38;5;208m" + "                    -------------------------------- Alterar Dados --------------------------------\n");
            console.log("\x1b[38;5;208m" +
                "                    1 - Alterar Nome de Usuario\n" +
                "                    2 - Alterar CPF\n" +
                "                    3 - Alterar e-mail\n" +
                "                    4 - Alterar Senha\n" +
                "                    5 - Sair do menu de alteracao\n"
            );
            let escolha = requisicao.question("\x1b[38;5;208m" + "                    Escolha a opcao que deseja alterar: ");
            switch(escolha){

                case "1": // opcao para alterar nome de usuario
                    console.log("\n\x1b[38;5;208m" + "                    Aperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let novo_nome_usuario_func = this.perguntar_nome_usuario(); // chama o metodo para perguntar o nome de usuario
                    if (novo_nome_usuario_func == "sair"){ // caso o usuario aperte enter para sair
                        this.printar_logo();
                        break;
                    }
                    this.banco_dados.funcionarios[posicao_funcionario].nome_usuario = novo_nome_usuario_func; // le esta linha quando o nome for valido e altera
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Nome de usuario alterado com sucesso!");
                    break;

                case "2": // opcao para alterar cpf
                    console.log("\n\x1b[38;5;208m" + "                    Aperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let novo_cpf_func = this.perguntar_cpf(); //chama o metodo para perguntar o cpf
                    if (novo_cpf_func == "sair"){ // caso o usuario aperte enter para sair
                        this.printar_logo();
                        break;
                    }
                    this.banco_dados.funcionarios[posicao_funcionario].cpf = novo_cpf_func; // le esta linha quando o cpf for valido e altera
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    CPF alterado com sucesso!");
                    break;
                
                case "3": // opcao para alterar email
                    console.log("\n\x1b[38;5;208m" + "                    Aperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let novo_email_func = this.perguntar_email(); // chama o metodo para perguntar o email
                    if (novo_email_func == "sair"){ // caso o usuario aperte enter para sair
                        this.printar_logo();
                        break;
                    }
                    this.banco_dados.funcionarios[posicao_funcionario].email = novo_email_func; //le esta linha quando o email for valido e altera
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Email alterado com sucesso!");
                    break;
                
                case "4": // opcao para alterar senha
                    console.log("\n\x1b[38;5;208m" + "                    Aperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let nova_senha_func = this.perguntar_senha(); // chama o metodo para perguntar a senha
                    if (nova_senha_func == "sair"){ // caso o usuario aperte enter para sair
                        this.printar_logo();
                        break;
                    }
                    this.banco_dados.funcionarios[posicao_funcionario].senha = nova_senha_func; //le esta linha quando a senha for valida e altera
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Senha alterada com sucesso!");
                    break;
    
                case "5": // opcao para sair do menu de alteracao
                    this.printar_logo();
                    return console.log("\n\x1b[38;5;208m" + "                    Saiu do menu de alteracao com exito.\n");//encerra o loop e sai da interface
                    
                default: // caso o usuario digite uma opcao invalida
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Por favor, digite uma opcao valida.");//ate o usuario inserir uma opcao valida o loop eh repetido
                    break;
            }
        }
    }

    modificar_cliente(cliente){ // metodo para modificar os dados do cliente
        let posicao_cliente;
        for (let i = 0; i < (this.banco_dados.clientes.length); i++){ //encontra a posicao do usuario na lista de clientes de acordo com o email
            if (cliente.email == this.banco_dados.clientes[i].email){
                posicao_cliente = i;
                break;
            }
        }
        while (true){ // loop para garantir que o usuario digite uma opcao valida e se mantenha no menu
            console.log("\n\x1b[38;5;208m" + "                    -------------------------------- Alterar Dados --------------------------------\n");
            console.log("\x1b[38;5;208m" +
                "                    1 - Alterar Nome\n" +
                "                    2 - Alterar Data de Nascimento\n" +
                "                    3 - Alterar CPF\n" +
                "                    4 - Alterar e-mail\n" +
                "                    5 - Alterar Senha\n" +
                "                    6 - Sair do menu de alteracao\n"
            );
            let escolha = requisicao.question("\x1b[38;5;208m" + "                    Escolha a opcao que deseja alterar: ");

            switch(escolha){

                case "1": // opcao para alterar nome
                    console.log("\n\x1b[38;5;208m" + "                    Aperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let nome_cliente = this.perguntar_nome(); //chama o metodo para perguntar o nome
                    if (nome_cliente == "sair"){ // caso o usuario aperte enter para sair
                        this.printar_logo();
                        break;
                    }
                    this.banco_dados.clientes[posicao_cliente].nome = nome_cliente;  // le esta linha quando o nome for valido e altera
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Nome alterado com sucesso!");
                    break;
                
                case "2": // opcao para alterar data de nascimento
                    console.log("\n\x1b[38;5;208m" + "                    Aperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let nova_data_nascimento = this.perguntar_data_nascimento(); //chama o metodo para perguntar a data de nascimento
                    if (nova_data_nascimento == "sair"){ // caso o usuario aperte enter para sair
                        this.printar_logo();
                        break;
                    }
                    this.banco_dados.clientes[posicao_cliente].data_nascimento = nova_data_nascimento; // le esta linha quando a data for valido e altera
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Data de nascimento alterada com sucesso!");
                    break;
                    
                case "3": // opcao para alterar cpf
                    console.log("\n\x1b[38;5;208m" + "                    Aperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let novo_cpf_cliente = this.perguntar_cpf() //chama o metodo para perguntar o cpf
                    if (novo_cpf_cliente == "sair"){ // caso o usuario aperte enter para sair
                        this.printar_logo();
                        break;
                    }
                    this.banco_dados.clientes[posicao_cliente].cpf = novo_cpf_cliente; // le esta linha quando o cpf for valido e altera
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    CPF alterado com sucesso!");
                    break;
                
                case "4": // opcao para alterar email
                    console.log("\n\x1b[38;5;208m" + "                    Aperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let novo_email_cliente = this.perguntar_email(); // chama o metodo para perguntar o email
                    if (novo_email_cliente == "sair"){ // caso o usuario aperte enter para sair
                        this.printar_logo();
                        break;
                    }
                    this.banco_dados.clientes[posicao_cliente].email = novo_email_cliente; //le esta linha quando o email for valido e altera
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Email alterado com sucesso!");
                    break;

                case "5": // opcao para alterar senha
                    console.log("\n\x1b[38;5;208m" + "                    Aperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let nova_senha_cliente = this.perguntar_senha(); // chama o metodo para perguntar a senha
                    if (nova_senha_cliente == "sair"){ // caso o usuario aperte enter para sair
                        this.printar_logo();
                        break;
                    }
                    this.banco_dados.clientes[posicao_cliente].senha = nova_senha_cliente; //le esta linha quando a senha for valida e altera
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Senha alterada com sucesso!");
                    break;

                case "6": // opcao para sair do menu de alteracao
                    this.printar_logo();
                    return console.log("\n\x1b[38;5;208m" + "                    Saiu do menu de alteracao com exito.\n");//encerra o loop e sai da interface
                    
                default: // caso o usuario digite uma opcao invalida
                    this.printar_logo();
                    console.log("\n\x1b[38;5;208m" + "                    Por favor, digite uma opcao valida.");//ate o usuario inserir uma opcao valida o loop eh repetido
                    break;
            }
        }
    }

    editar_quarto(){ // metodo para editar quartos
        if (this.banco_dados.quartos.length == 0){ // caso nao haja quarto imprime a informacao para o usuario
            return console.log("\n\x1b[38;5;208m" + "                    Nao ha quartos para serem editados.\n");
        }
        console.log("\n\x1b[38;5;208m" + "                    Aperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.");
        while (true){ // loop para garantir que o usuario digite nome de um quarto cadastrado
            let escolha = requisicao.question("\n\x1b[38;5;208m" + "                    Digite o nome do quarto que deseja editar: ");
            if (escolha == ""){
                this.printar_logo();
                console.log("\n\x1b[38;5;208m" + "                    Saindo...");
                break;
            }
            let resultado = this.encontrar_quarto(escolha); // chama metodo de encontrar quarto para ver se ele existe
            if (resultado == true){ // se o quarto for encontrado ele podera ser editado
                let posicao_quarto = this.encontrar_pos_quarto(escolha); // chama metodo para encontrar a posicao do quarto
                this.printar_logo();
                console.log("\n\x1b[38;5;208m" + "                    Quarto encontrado!");
                while (true){
                    console.log("\n\x1b[38;5;208m" + "                    ------------------------------- Editar Quartos -------------------------------\n");
                    console.log("\x1b[38;5;208m" +
                        "                    1 - Alterar Quantidade de Camas\n" +
                        "                    2 - Alterar Preco por Noite\n" +
                        "                    3 - Alterar Nome do Quarto\n" +
                        "                    4 - Alterar Descricao do Quarto\n" +
                        "                    5 - Sair do menu de alteracao\n"
                    );
                    let escolha = requisicao.question("\x1b[38;5;208m" + "                    Escolha a opcao que deseja editar: ");
                    switch(escolha){

                        case "1": // opcao para alterar quantidade de camas
                            console.log("\n\x1b[38;5;208m" + "                    Aperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                            let qtd_camas = this.perguntar_qtd_camas(); // chama metodo para perguntar a qtd de camas
                            if (qtd_camas == "sair"){
                                this.printar_logo();
                                return console.log("\n\x1b[38;5;208m" + "                    Saindo...");
                            }
                            this.banco_dados.quartos[posicao_quarto].quantidade_camas = qtd_camas; // atualiza a qtd de camas no banco de dados
                            this.printar_logo();
                            console.log("\n\x1b[38;5;208m" + "                    Quantidade de camas editada com sucesso!");
                            break;

                        case "2": // opcao para alterar preco por noite
                            console.log("\n\x1b[38;5;208m" + "                    Aperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                            let preco = this.perguntar_preco(); // chama metodo para perguntar o preco
                            if (preco == "sair"){
                                this.printar_logo();
                                return console.log("\n\x1b[38;5;208m" + "                    Saindo...");
                            }
                            this.banco_dados.quartos[posicao_quarto].preco_noite = preco; // atualiza o preco no banco de dados
                            this.printar_logo();
                            console.log("\n\x1b[38;5;208m" + "                    Preco por noite editado com sucesso!");
                            break;

                        case "3": // opcao para alterar nome do quarto
                            console.log("\n\x1b[38;5;208m" + "                    Aperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                            let nome_quarto = this.perguntar_nome_quarto(); // chama metodo para perguntar o nome
                            if (nome_quarto == "sair"){
                                this.printar_logo();
                                return console.log("\n\x1b[38;5;208m" + "                    Saindo...");
                            }
                            this.banco_dados.quartos[posicao_quarto].nome = nome_quarto; // atualiza o nome no banco de dados
                            this.printar_logo();
                            console.log("\n\x1b[38;5;208m" + "                    Nome do quarto editado com sucesso!");
                            break;

                        case "4": // opcao para alterar descricao do quarto
                            console.log("\n\x1b[38;5;208m" + "                    Aperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                            let descricao_quarto = this.perguntar_descricao(); // chama metodo para perguntar descricao
                            if (descricao_quarto == "sair"){
                                this.printar_logo();
                                return console.log("\n\x1b[38;5;208m" + "                    Saindo...");
                            }
                            this.banco_dados.quartos[posicao_quarto].descricao = descricao_quarto;
                            this.printar_logo();
                            console.log("\n\x1b[38;5;208m" + "                    Descricao do quarto editada com sucesso!");
                            break;

                        case "5": // opcao para sair do menu de alteracao
                            this.printar_logo();
                            return console.log("\n\x1b[38;5;208m" + "                    Saiu do menu de edicao com exito.\n");//encerra o loop e sai da interface
                    
                        default: // caso osuaurio digite uma opcao invalida
                            this.printar_logo();
                            console.log("\n\x1b[38;5;208m" + "                    Por favor, digite uma opcao valida.");//ate o usuario inserir uma opcao valida o loop eh repetido
                            break;
                    }
                }
            } else { // se nao encontrar o quarto que deseja alterar printa que nao encontrou
                return console.log("\n\x1b[38;5;208m" + "                    Nome de quarto não encontrado.");
            }
        }
    }
    
    excluir_quarto(){ // metodo para exclusao de quartos
        if (this.banco_dados.quartos.length == 0){ // caso nao haja quarto imprime a informacao para o usuario
            this.printar_logo();
            return console.log("\n\x1b[38;5;208m" + "                    Nao ha quartos para serem excluidos.\n");
        }     
        console.log("\n\x1b[38;5;208m" + "                    Digite a tecla enter com a caixa de texto vazia caso nao queira mais excluir.");
        while (true){ // loop para garantir que o usuario digite nome de um quarto cadastrado
            let escolha = requisicao.question("\n\x1b[38;5;208m" + "                    Digite o nome do quarto que deseja excluir: ");
            if (escolha == ""){ // caso o usuario nao queria mais excluir, o metodo se encerra
                this.printar_logo();
                return console.log("\n\x1b[38;5;208m" + "                    Saindo...");
            }
        
            if (resultado == true){ // se o quarto for encontrado ele podera ser excluido
                let posicao_quarto = this.encontrar_pos_quarto(escolha); // chama metodo para encontrar a posicao do quarto
                this.banco_dados.quartos.splice(posicao_quarto,1); // exclui o quarto de acordo com a sua posicao
                this.printar_logo();
                return console.log("\n\x1b[38;5;208m" + "                    Quarto encontrado e removido com sucesso!");
            } else {
                console.log("\n\x1b[38;5;208m" + "                    Nome de quarto não encontrado.");
            }
        }
    }

    avaliar_estadia(cliente){ // metodo para avaliar a estadia
        while (true){ // loop para garantir que o usuario digite uma avaliacao valida
            console.log("\n\x1b[38;5;208m" + "                    ------------------------------- Avaliar Estadia -------------------------------\n");
            console.log("\x1b[38;5;208m" +
                "                    5 - Excelente\n" +
                "                    4 - Bom\n" +
                "                    3 - Mediano\n" +
                "                    2 - Ruim\n" +
                "                    1 - Pessimo\n"
            ); // imprime as avaliacoes
            
            console.log("\x1b[38;5;208m" + "                    Digite a tecla enter com a caixa de texto vazia caso queira sair da avaliacao.\n");
            let avaliacao = requisicao.question("\x1b[38;5;208m" + "                    Digite a opcao da avaliacao da sua estadia: ");
            let comentario;
            if (["1", "2", "3", "4", "5"].includes(avaliacao)){ //condicional para identificar se o usuario avaliou corretamente
                while (true){ // loop para garantir que o usuario digite a resposta corretamente
                    let resposta = requisicao.question("\x1b[38;5;208m" + "                    Deseja adicionar um comentario? (sim/nao): ");
                    if (resposta.toUpperCase() == "SIM"){ //se for sim pede para inserir o comentario
                        comentario = requisicao.question("\x1b[38;5;208m" + "                    Digite o comentario: ");
                        if (comentario == ""){ // caso o usuario queira sair
                            this.printar_logo();
                            return console.log("\n\x1b[38;5;208m" + "                    Saindo...");
                        }
                        this.banco_dados.avaliacoes.push([avaliacao, comentario, cliente.nome]); //salva a avaliacao, o comentario e o nome do cliente avaliante na lista_avaliacos (lista de listas)
                        this.printar_logo();
                        console.log("\n\x1b[38;5;208m" + "                    Avaliacao concluida com sucesso!");
                        break;
                    } else if (resposta.toUpperCase() == "NAO"){ // se nao, adiciona um comentario vazio
                        comentario = " ";
                        this.banco_dados.avaliacoes .push([avaliacao, comentario, cliente.nome]); //salva a avaliacao, o comentario e o nome do cliente avaliante na lista_avaliacos (lista de listas)
                        this.printar_logo();
                        console.log("\n\x1b[38;5;208m" + "                    Avaliacao concluida com sucesso!");
                        break;
                    } else if (resposta == ""){ // caso o usuario queira sair
                        this.printar_logo();
                        return console.log("\n\x1b[38;5;208m" + "                    Saindo...");
                    }else {
                        console.log("\n\x1b[38;5;208m" + "                    Resposta invalida.\n");
                    }
                }
                break;
            } else if (avaliacao == ""){ // caso o usuario queira sair
                this.printar_logo();
                return console.log("\n\x1b[38;5;208m" + "                    Saindo...");
            } else {
                console.log("\x1b[38;5;208m" + "                    Avaliacao invalida, por favor tente novamente.");
            }
        }
    }

    visualizar_avaliacoes(){ // metodo para visualizacao das avaliacoes
        if (this.banco_dados.avaliacoes .length == 0){
            return console.log("\n\x1b[38;5;208m" + "                    Nao ha avaliacoes para serem exibidas.\n");
        }
        for (let i = 0; i < this.banco_dados.avaliacoes .length; i++){
            let avaliacao_int = parseInt(this.banco_dados.avaliacoes [i][0]);  //avaliação (primeiro item da lista interna) em inteiro
            let comentario = this.banco_dados.avaliacoes [i][1]; //comentário (segundo item da lista interna)
            let nome_cliente = this.banco_dados.avaliacoes [i][2]; //nome do cliente (terceiro item da lista interna)
            let estrelas = '★ '.repeat(avaliacao_int) + '☆ '.repeat(5 - avaliacao_int); // variacel para gerar estrelas de avaliacao (cheias e vazias)
            //imprime a avaliação em estrelas, o comentário e o nome do cliente
            console.log(`\n\x1b[38;5;208m                    Cliente: ${nome_cliente}`);
            console.log(`\x1b[38;5;208m                    Avaliação: ${estrelas}`);
            console.log(`\x1b[38;5;208m                    Comentário: ${comentario}`);
            console.log('\x1b[38;5;208m                    ------------------------');
        }
    }

    encontrar_quarto(nome_quarto){ // metodo para encontrar nome de quarto na lista de quarto
        for (let i = 0; i < (this.banco_dados.quartos.length); i++){
            if (nome_quarto == this.banco_dados.quartos[i].nome){ // faz uma busca no banco de dados para ver se existe o nome de quarto digitado
                return true
            }
        }
        return false
    }

    gerar_id(){ // metodo para gerar aleatoriamente um id
        let id = Math.floor(100000000 + Math.random() * 900000000).toString(); // gera um id de 9 digitos
        let existe = true;
        while (existe) { // loop para garantir que o id nao seja repetido
            existe = false; // assume que o id nao existe. se realmente nao existir, o loop eh encerrado
            for (let i = 0; i < this.banco_dados.ids.length; i++) { // loop para encontrar o id caso ele exista
                if (this.banco_dados.ids[i] === id) {
                    existe = true; // marca como existente e sai do loop for
                    id = Math.floor(100000000 + Math.random() * 900000000).toString(); // gera novo id e repete o processo
                    break;
                }
            }
        }
        this.banco_dados.ids.push(id); // adiciona o id unico a lista
        fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // atualiza os ids no banco de dados
        return id;
    }

    ver_lista_objetos(lista, tipo) { // metodo para visualizacao de lista de objetos em tabela
        if (lista.length == 0){ // condional para caso nao haja elementos na lista
            return console.log("\x1b[38;5;208m                    Nao ha dados.")
        }
        let tabela = {};
        lista.forEach((item, index) => {  // define o indice customizado ("Quarto 1", "Reserva 1", etc)
            tabela[`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} ${index + 1}:`] = {};
    
            for (let [atributo, valor] of Object.entries(item)) { // itera sobre os atributos, os formata e define o valor de cada um no print
                let atributo_formatado = this.formatar_atributo(atributo);
    
                if (atributo === "senha") { //se for o atributo senha substitui por * repetido de acordo com o tamanho da senha
                    tabela[`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} ${index + 1}:`][atributo_formatado] = "*".repeat(valor.length);

                } else if (atributo === "preco_noite"){ // se for o atributo preco_noite formata com 'R$'
                    tabela[`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} ${index + 1}:`][atributo_formatado] = `R$ ${valor}`;

                } else {  // para os outros atributos  mantem o valor original
                    tabela[`${tipo.charAt(0).toUpperCase() + tipo.slice(1)} ${index + 1}:`][atributo_formatado] = valor;
                }
            }
        });
        console.table(tabela); // printa a tabela
    }

    formatar_atributo(atributo) { // metodo para formatar os atributos e utilizar nos prints de dados
            let nomes_bonitos = {
                reserva_id: "ID da Reserva",
                cliente_id: "ID do Cliente",
                status: "Status da Reserva",
                check_in: "Data de Check-in",
                check_out: "Data de Check-out",
                func_id: "ID do Funcionário",
                nome_usuario: "Nome de Usuário",
                cpf: "CPF",
                email: "E-mail",
                senha: "Senha",
                nome: "Nome",
                data_nascimento: "Data de Nascimento",
                quantidade_camas: "Quantidade de Camas",
                preco_noite: "Preço por Noite",
                descricao: "Descrição do Quarto",
                nome_quarto: "Nome do Quarto"
            };
            return nomes_bonitos[atributo] || atributo.replace(/([A-Z])/g, " $1").trim().replace(/^./, str => str.toUpperCase());
    }

    validar_email(email, lista1, lista2){ //metodo para validacao dos emails
        for (let i = 0; i < (lista1.length); i++){
            if (email == lista1[i].email){ // faz uma busca no banco de dados para ver se existe o usuario digitado de acordo com o email
                return "email existente"
            }
        }
        for (let i = 0; i < (lista2.length); i++){
            if (email == lista2[i].email){ // faz uma busca no banco de dados para ver se existe o usuario digitado de acordo com o email
                return "email existente"
            }
        }
        let formatacao_correta = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //expressão regular para verificar o formato de um email
        return formatacao_correta.test(email); //retorna true se o email for valido, false caso contrario  
    } 

    validar_cpf(cpf, lista1, lista2){ //metodo para validacao dos cpfs
        for (let i = 0; i < (lista1.length); i++){
            if (cpf == lista1[i].cpf){ // faz uma busca no banco de dados para ver se existe o usuario digitado de acordo com o email
                return "cpf existente"
            }
        }
        for (let i = 0; i < (lista2.length); i++){
            if (cpf == lista2[i].cpf){ // faz uma busca no banco de dados para ver se existe o usuario digitado de acordo com o email
                return "cpf existente"
            }
        }
        let formatacao_correta = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/; //expressão regular para verificar o formato de um cpf
        return formatacao_correta.test(cpf); //retorna true se o cpf for valido, false caso contrario
    }

    validar_senha(senha){ //metodo para validar a senha
        return senha.length >= 6; //considerou-se senha invalida aquelas tem menos de 6 caracteres, true em caso afirmativo, false caso contrario
    }

    validar_quantidade_inteira(numeroStr) { //metodo para validar um numero inteiro
        // converte a string para número
        let numero = Number(numeroStr);
        // verifica se eh um número, se eh inteiro e se eh positivo
        if (!isNaN(numero) && Number.isInteger(numero) && numero > 0) {
            return true;  // numero valido
        } else {
            return false; // numero invalido
        }
    }

    validar_data_nascimento(data){ //metodo para validar data de nascimento
        let sistema_data = this.validar_data(data);
        if (sistema_data[0]){ // chama metodo para validar formatacao da data (sistema_data[0] eh true caso a data seja valida)
            //sistema_data[3] = ano, sistema_data[2] = mes, sistema_data[1] = dia, sistema_data[0] = true
            // validação de idade minima (18 anos) e ano minimo (1900), pega a data do dia da execucao do codigo
            let hoje = new Date();
            let ano_atual = hoje.getFullYear();
            let mes_atual = hoje.getMonth() + 1;
            let dia_atual = hoje.getDate();
    
            if (sistema_data[3] < 1900) { // ano minimo para cadastro (ano esta na posicao 3)
                console.log("\x1b[38;5;208m" + "                    Data de nascimento invalida (nasceu antes de 1900).");
                return false;
            }
            let data_nascimento = this.data_posterior(sistema_data);
            if (data_nascimento == true){
                console.log("\x1b[38;5;208m" + "                    Data de nascimento invalida (data posterior ao dia de hoje).");
                return false;
            }
            let idade = ano_atual - sistema_data[3];
            if (sistema_data[3] > mes_atual || (sistema_data[3] === mes_atual && sistema_data[1] > dia_atual)) {
                idade--; // ajusta a idade se o aniversario ainda nao aconteceu no ano atual
            }
            if (idade < 18){ // retorna true caso a idade seja maior ou igual a 18 e false caso contrario
                console.log("\x1b[38;5;208m" + "                    Data de nascimento invalida (menor de 18 anos).");
                return false
            }else {
                return true
            }
        }
    }

    validar_data(data){ // metodo para validacao de formatacao de data
        let formatacao_correta = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([12][0-9]{3})$/; //expressao regular para o formato dd/mm/aaaa
        if (!formatacao_correta.test(data)) { //verifica se a data está no formato correto
            console.log("\x1b[38;5;208m" + "                    Data invalida, por favor digite novamente.");
            return [false];
        }
        let [dia, mes, ano] = data.split('/').map(Number);//se o formato estiver correto, validamos a data
        if (mes < 1 || mes > 12) {//verifica se o me eh valido (1-12)
            console.log("\x1b[38;5;208m" + "                    Data invalida, por favor digite novamente.");
            return [false];
        }
        let diasPorMes = [31, (ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //valida o dia de acordo com o mes
        if (dia < 1 || dia > diasPorMes[mes - 1]) {
            console.log("\x1b[38;5;208m" + "                    Data invalida, por favor digite novamente.");
            return [false];
        }
        return [true, dia, mes, ano]
    }

    validar_preco(preco){ // metodo para validar preco
        let formatacao_correta = /^\d+(\.\d{1,2})?$/; //expressao regular para validar preços no formato "xx.xx"
        return formatacao_correta.test(preco); //retorna true se o preco for valido, false caso contrario
    }
    
    validar_nome(nome){ // metodo para validar nomes 
        let formatacao_correta = /^[A-Za-zÀ-ÖØ-öø-ÿ ]+$/; // permite letras maiusculas, minusculas, caracteres acentuados e espaços
        return formatacao_correta.test(nome);
        
    }

    perguntar_cpf(){ // metodo para aquisicao do dado cpf
        while (true){// loop para garantir que o usuario digite um cpf valido
            let cpf_usuario = requisicao.question("\x1b[38;5;208m" + "                    Digite o seu cpf (xxx.xxx.xxx-xx): ");
            let sair = this.sair(cpf_usuario);
            if (sair == true){
                return "sair"
            }
            if (this.validar_cpf(cpf_usuario, this.banco_dados.clientes, this.banco_dados.funcionarios) == true){
                return cpf_usuario //caso o cpf seja valido o metodo se encerra e retorna o cpf
            } else if (this.validar_cpf(cpf_usuario, this.banco_dados.clientes, this.banco_dados.funcionarios) == "cpf existente") { //verifica se ja existe o cpf digitado
                console.log("\x1b[38;5;208m" + "                    CPF ja esta cadastrado, tente outro por favor.")
            } else {
                console.log("\x1b[38;5;208m" + "                    CPF invalido, por favor digite novamente.");
            }
        }
    }

    perguntar_email(){ // metodo para aquisicao do dado email
        while (true){ // loop para garantir que o usuario digite um email valido
            let email_usuario = requisicao.question("\x1b[38;5;208m" + "                    Digite o seu email: "); // chama a funcao de validar o email com o email digitado como parametro
            let sair = this.sair(email_usuario);
            if (sair == true){
                return "sair"
            }
            if (this.validar_email(email_usuario, this.banco_dados.clientes, this.banco_dados.funcionarios) == true){
                return email_usuario //caso o email seja valido retorna o email digitado
            } else if (this.validar_email(email_usuario, this.banco_dados.clientes, this.banco_dados.funcionarios) == "email existente") { //verifica se ja existe o email digitado
                console.log("\x1b[38;5;208m" + "                    Email ja esta cadastrado, tente outro por favor.")
            } else{
                console.log("\x1b[38;5;208m" + "                    Email invalido, por favor digite novamente.");
            }
        }
    }

    perguntar_senha(){ // metodo para aquisicao do dado senha
        while (true){ // loop para garantir que o usuario digite uma senha valida
            let senha_usuario = requisicao.question("\x1b[38;5;208m" + "                    Digite a senha desejada (6 caracteres ou mais): ");
            let sair = this.sair(senha_usuario);
            if (sair == true){
                return "sair"
            }
            if (this.validar_senha(senha_usuario) == true){ // chama a funcao de validar a senha com a senha digitada como parametro
                return senha_usuario //caso a senha seja valida retorna a senha digitada
            } else {
                console.log("\x1b[38;5;208m" + "                    Senha invalida, por favor digite novamente.");
            }
        }
    }

    perguntar_data_nascimento(){ // metodo para aquisicao do dado data de nascimento
        while (true){// loop para garantir que o usuario digite uma data valida
            let data_nascimento = requisicao.question("\x1b[38;5;208m" + "                    Digite a sua data de nascimento (dd/mm/aaaa): ");
            let sair = this.sair(data_nascimento);
            if (sair == true){
                return "sair"
            }
            if (this.validar_data_nascimento(data_nascimento) == true){ // chama a funcao de validar a data com a data digitada como parametro
                return data_nascimento //caso a data seja valida retorna a data digitada
            }
        }
    }

    perguntar_nome_usuario(){ // metodo para aquisicao do dado nome de usuario
        while (true){ // loop para garantir que o usuario digite um nome de usuario nao existente
            let nome_usuario_func = requisicao.question("\x1b[38;5;208m" + "                    Digite o nome de usuario desejado: ");
            let sair = this.sair(nome_usuario_func);
            if (sair == true){
                return "sair"
            }
            let flag = false;
            for (let i = 0; i < (this.banco_dados.funcionarios.length); i++){
                if (nome_usuario_func == this.banco_dados.funcionarios[i].nome_usuario){ // faz uma busca no banco de dados para ver se existe o usuario digitado
                    console.log("\x1b[38;5;208m" + "                    Nome de usuario ja cadastrado, por favor tente outro.");
                    flag = true;
                }
            }
            if (flag == false){ //caso nao encontre retorna o nome de usuario digitado
                return nome_usuario_func
            }
        }
    }

    perguntar_nome(){ // metodo para perguntar o nome ao usuario
        while(true){
            let nome = requisicao.question("\x1b[38;5;208m" + "                    Digite o seu nome: ");
            let sair = this.sair(nome);
            if (sair == true){
                return "sair"
            }
            if (this.validar_nome(nome) == true){
                return nome
            } else {
                console.log("\x1b[38;5;208m" + "                    Nome invalido, por favor digite novamente.");
            }
        }
    }
    perguntar_qtd_camas(){ // metodo para perguntar quantidade de camas
        while(true){ // loop para garantir que o usuario digite a informacao corretamente
            let qtd_camas = requisicao.question("\x1b[38;5;208m" + "                    Digite a quantidade de camas do quarto: ");
            if (this.sair(qtd_camas) == true){ // caso o usuario queira sair
                return "sair"
            }
            if (this.validar_quantidade_inteira(qtd_camas) == true){ // chama a funcao de validar a quantidadede camas com a digitada como parametro
                return qtd_camas; //caso a qtd de camas seja valida o loop se encerra
            } else {
                console.log("\x1b[38;5;208m" + "                    Quantidade invalida, por favor digite novamente.");
            }
        }
    }

    perguntar_preco(){
        while(true){ // loop para garantir que o usuario digite a informacao corretamente
            let preco_noite = requisicao.question("\x1b[38;5;208m" + "                    Digite o preco por noite (Ex: xxx.xx): ");
            if (this.sair(preco_noite) == true){ // caso o usuario queira sair
                return "sair"
            }
            if (this.validar_preco(preco_noite) == true){ // chama a funcao de validar o preco com o digitado como parametro
                return preco_noite; //caso a senha seja valida o loop se encerra
            } else {
                console.log("\x1b[38;5;208m" + "                    Valor invalido, por favor digite novamente.");
            }
        }
    }
    
    perguntar_nome_quarto(){
        while(true){ // loop para garantir que o usuario digite a informacao corretamente
            let nome_quarto = requisicao.question("\x1b[38;5;208m" + "                    Digite o nome do quarto: ");
            if (this.sair(nome_quarto) == true){ // caso o usuario queira sair
                return "sair"
            }
            let existe = this.encontrar_quarto(nome_quarto); // chama metodo para identificar se o nome digitado ja existe no bando de dados
            if (existe == true){ // faz uma busca no banco de dados para ver se existe o nome de quarto digitado
                console.log("\x1b[38;5;208m" + "                    Nome de quarto ja cadastrado, por favor tente outro.");
            } else {
                return nome_quarto;
            }
        }  
    }

    perguntar_nome_quarto_reserva(){ // metodo para perguntar nome do quarto enquanto estiver fazendo reserva
        while(true){ // loop para garantir que o usuario digite a informacao corretamente
            let nome_quarto = requisicao.question("\x1b[38;5;208m" + "                    Digite o nome do quarto: ");
            if (this.sair(nome_quarto) == true){ // caso o usuario queira sair
                return "sair"
            }
            let existe = this.encontrar_quarto(nome_quarto); // chama metodo para identificar se o nome digitado ja existe no bando de dados
            if (existe == true){ // faz uma busca no banco de dados para ver se existe o nome de quarto digitado
                return nome_quarto;
            } else {
                console.log("\x1b[38;5;208m" + "                    Quarto nao foi encontrado, tente novamente.");
            }
        }  
    }

    perguntar_descricao(){ // metodo para perguntar descricao do quarto
        let descricao_quarto = requisicao.question("\x1b[38;5;208m" + "                    Digite a descricao do quarto: ")
        if (descricao_quarto == ""){ // volta ao menu de edicao caso o usuario nao queira mais alterar
            return "sair"   
        }
        return descricao_quarto;
    }

    perguntar_checkout_e_checkin(){ // metodo para perguntar datas de checkin e checkout
        let data_checkin = this.perguntar_checkin();
            if (data_checkin == "saiu"){
                return "saiu";
            }
        while(true){ // loop para garantir que o usuario digite a informacao corretamente
            let data_checkout = requisicao.question("\x1b[38;5;208m" + "                    Digite a data de Check-out: ");
            if (data_checkout == ""){ // caso o usuario queira sair
                return "saiu";
            }
            let sistema_data_checkout = this.validar_data(data_checkout);// chama a funcao de validar a data com a data digitada como parametro
            let data_posterior = this.data_posterior(sistema_data_checkout); // chama a funcao para analisar se a data eh depois de hoje
            // variaveis criadas para analisar se a data de checkout digitada eh depois ou antes da data de checkin
            let comparar_data_checkout = new Date(sistema_data_checkout[3], sistema_data_checkout[2] - 1, sistema_data_checkout[1]); //variaveis para comparacao de datas
            let comparar_data_checkin = new Date(data_checkin[1][3], data_checkin[1][2] - 1, data_checkin[1][1])
            if (data_posterior == false){ //caso a data seja depois do dia de hoje
                console.log("\n\x1b[38;5;208m" + "                    Data invalida (data anterior ao dia de hoje).\n");
            } else if ( comparar_data_checkin >= comparar_data_checkout){ // caso a data do checkout seja antes da data do checkin
                console.log("\n\x1b[38;5;208m" + "                    Data invalida (data anterior ou igual ao check-in).\n");
            } else {
                if (sistema_data_checkout[0] == true){ 
                    return [data_checkin[0], data_checkout]; //caso a data seja valida o loop se encerra e retorna as datas
                }
            }
        }
    }

    perguntar_checkin(){ // metodo para perguntar o checkin
        while(true){ // loop para garantir que o usuario digite a informacao corretamente
            let data_checkin = requisicao.question("\x1b[38;5;208m" + "                    Digite a data de Check-in: ");
            if (data_checkin == ""){// caso o usuario queira sair
                return "saiu"
            }
            let sistema_data_checkin = this.validar_data(data_checkin);// chama a funcao de validar a data com a data digitada como parametro
            let data_posterior = this.data_posterior(sistema_data_checkin); // chama a funcao para analisar se a data eh depois de hoje
            if (data_posterior == false){
                console.log("\n\x1b[38;5;208m" + "                    Data invalida (data anterior ao dia de hoje)\n");
            } else {
                if (sistema_data_checkin[0] == true){ 
                    return [data_checkin, sistema_data_checkin] //caso a data seja valida retorna a data e uma lista com dia mes ano
                }
            }
        }
    }

    encontrar_pos_quarto(escolha){
        for (let i = 0; i < (this.banco_dados.quartos.length); i++){ //encontra a posicao do quarto na lista de quartos de acordo com o nome 
            if (escolha == this.banco_dados.quartos[i].nome){
                return i
            }
        }
    }

    sair(informacao){ // metodo para analisar se o usuario quer sair ou nao no momento da insercao de dados
        if (informacao == ""){
            console.log("\n\x1b[38;5;208m" + "                    Saindo...");
            return true
        } 
    }
    data_posterior(sistema_data){ // metodo para saber se a data digitada pelo usuario eh depois de hoje ou antes
        let hoje = new Date();
        let data = new Date(sistema_data[3], sistema_data[2] - 1, sistema_data[1]); // para o caso do usuario digitar uma data posterior ao dia de hoje
        if (data < hoje) {
            return false; // se a data digitada for menor, entao nao eh depois
        }
        return true; // le esta linha caso a data digitada seja maior, ou seja, depois
    }
    printar_logo(){ // metodo para printar a logo e limpar o terminal
        console.clear();
        console.log("\x1b[38;5;208m" + "----------------------------------------------------------------------------------------------------------------------------"+ "\x1b[0m");
        console.log("\x1b[38;5;208m" + `
    ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
    ██                                                                                                                ██
    ██                                                                                                                ██
    ██    ██   ██   ██████   ████████  ███████  ██            ███████        ██       ██    ██  ██    ██   ██████     ██
    ██    ██   ██  ██    ██     ██     ██       ██            ██             ██       ██    ██    ██ ██   ██    ██    ██
    ██    ███████  ██    ██     ██     █████    ██            ███████  ████  ██       ██    ██     ██     ██    ██    ██
    ██    ██   ██  ██    ██     ██     ██       ██            ██             ██       ██    ██    ██ ██   ██    ██    ██
    ██    ██   ██   ██████      ██     ███████  ███████       ██             ███████   ██████   ██    ██   ██████     ██
    ██                                                                                                                ██
    ██                                                                                                                ██
    ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
            ` + "\x1b[0m");
        console.log("\x1b[38;5;208m" + "----------------------------------------------------------------------------------------------------------------------------"+ "\x1b[0m");
        console.log("\n");
    }
    printar_login(){// metodo para printar imagem de login
        console.log("\x1b[38;5;208m" + `                                                                   
                                     ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
                                    █                                █
                                    █  █     ▄▀▀▀▄  ▄▀▀▀▀  █  █▄  █  █
                                    █  █     █   █  █ ▀▀█  █  █ █ █  █
                                    █  ▀▀▀▀   ▀▀▀    ▀▀▀▀  ▀  ▀  ▀   █ 
                                    ▀▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▀
` + "\x1b[0m"); // printa imagem de login
    }
}