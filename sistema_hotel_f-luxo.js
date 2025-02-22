const requisicao = require('readline-sync'); //comando necessario para simular um input em js

class Reserva { //criando a classe Reserva
    constructor(reserva_id, cliente_id, status, check_in, check_out) {
        this.reserva_id = reserva_id;
        this.cliente_id = cliente_id;
        this.status = status;
        this.check_in = check_in;
        this.check_out = check_out;
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

        //listas para armazenar dados
        this.lista_funcionarios = [];
        this.lista_clientes = [];
        this.lista_quartos = [];
        this.lista_reservas = [];

        //variaveis para definir os id's unicos
        this.func_id = 1000;
        this.cliente_id = 1000;
        this.reserva_id = 1000;

    }
    iniciar_sistema(){ //metodo para inicializacao do sistema
        while (true){
            console.log("\n-------------------------- Bem vindo ao Hotel F-Luxo --------------------------\n\nO que deseja fazer?\n");
            console.log("1 - Fazer Login\n2 - Fazer Cadastro\n3 - Sair do Programa\n");
            let escolha = requisicao.question("Selecione uma das opcoes acima: "); //mostra as opcoes e faz o usuario escolher uma dentre elas

            switch(escolha){
                case "1":

                    let tipo_login = sistema.fazer_login(); //

                    if (tipo_login[0] == "Usuario Funcionario"){
                        sistema.funcionario_logado(tipo_login[1]);

                    } else {
                        sistema.cliente_logado(tipo_login[1]);
                    }
                    break
        
                case "2":
                    sistema.fazer_cadastro(); //abre o menu de cadastro
                    break;
        
                case "3":
                    return console.log("\nSaiu do programa com exito.\n");//encerra o loop e termina o sistema
                    
                default:
                    console.log("\nPor favor, digite uma opcao valida.");//ate o usuario inserir uma opcao valida o loop eh repetido
                    break
            }
        }
    }
    fazer_login() { //metodo para fazer o login
        let manter_login = true;
        while(manter_login){
            console.log("\n-------------------------- Login --------------------------\n");
            let email = requisicao.question("Digite seu e-mail de login: "); //pede ao usuario o email e senha
            let senha = requisicao.question("Digite sua senha: ");
            let confirmacao_email = false;
            for (let i = 0; i < (this.lista_clientes.length); i++){ //passa pela lista de clientes para ver se o email esta cadastrado la
                if (email == this.lista_clientes[i].email){
                    confirmacao_email = true;
                    if (senha == this.lista_clientes[i].senha){ //caso o email esteja cadastrado, ve se a senha esta correta
                        console.log("\nSua conta foi acessada com exito!")
                        manter_login = false;
                        return ["Usuario Cliente", this.lista_clientes[i]] //retorna uma lista para ser utilizada em outro metodo para identificacao de usuario e utilizacao no sistema (cliente ou funconario)
                    }
                }
            }
            for (let i = 0; i < (this.lista_funcionarios.length); i++){ //passa pela lista de funcionarios para ver se o email esta cadastrado la
                if (email == this.lista_funcionarios[i].email){
                    confirmacao_email = true;
                    if (senha == this.lista_funcionarios[i].senha){ //caso o email esteja cadastrado, ve se a senha esta correta
                        console.log("\nSua conta foi acessada com exito!") 
                        manter_login = false;
                        return ["Usuario Funcionario", this.lista_funcionarios[i]] //retorna uma lista para ser utilizada em outro metodo para identificacao de usuario ou utilizacao no sistema(cliente ou funconario)
                    }
                }
            }
            //este bloco de condicional so sera lida caso o email nao tenha sido encontrado ou a senha esteja incorreta
            if (confirmacao_email == false){ //caso nao encontre nenhum email, confirmacao_email continua false e informa que o email nao foi encontrado
                console.log("O e-mail digitado não esta cadastrado, tente novamente.");
            } else { //caso o email tenha sido encontrado mas a senha esta incorreta informa ao usuario
                console.log("Senha incorreta."); 
                
            }
        }
    }

    fazer_cadastro(){//metodo para fazer o cadastro
        while(true){
            console.log("\n-------------------------- Cadastramento --------------------------\n");
            console.log("1 - Cadastrar como funcionario\n2 - Cadastrar como cliente\n3 - Voltar ao menu principal.\n");
            let escolha = requisicao.question("Selecione uma das opcoes acima: "); //mostra as opcoes e faz o usuario escolher uma dentre elas

            switch(escolha){
                case "1": //caso o usuario escolha a opcao 1, o cadastro sera de funcionario
                    console.log("\n-------------------------- Cadastro - Funcionario --------------------------\n");
                    //pede os dados de cadastro ao funcionario
                    while (true){ // loop para garantir que o usuario digite um nome de usuario nao existente
                        var nome_usuario_func = requisicao.question("Digite o nome de usuario desejado: ");
                        let contagem = false;
                        for (let i = 0; i < (this.lista_funcionarios.length); i++){
                            if (nome_usuario_func == this.lista_funcionarios[i].nome_usuario){ // faz uma busca no banco de dados para ver se existe o usuario digitado
                                console.log("Nome de usuario ja cadastrado, por favor tente outro.");
                                contagem = true;
                            }
                        }
                        if (contagem == false){ //caso nao encontre, o loop se encerra
                            break
                        }
                    }
                    while (true){// loop para garantir que o usuario digite um cpf valido
                        var cpf_func = requisicao.question("Digite o seu cpf (xxx.xxx.xxx-xx): ");
                        if (this.validar_cpf(cpf_func, this.lista_clientes, this.lista_funcionarios) == true){
                            break //caso o cpf seja valido o loop se encerra
                        } else if (this.validar_cpf(cpf_func, this.lista_clientes, this.lista_funcionarios) == "cpf existente") { //verifica se ja existe o cpf digitado
                            console.log("CPF ja esta cadastrado, tente outro por favor.")
                        } else{
                            console.log("CPF invalido, por favor digite novamente.");
                        }
                    }
                    while (true){ // loop para garantir que o usuario digite um email valido
                        var email_func = requisicao.question("Digite o seu email: "); // chama a funcao de validar o email com o email digitado como parametro
                        if (this.validar_email(email_func, this.lista_clientes, this.lista_funcionarios) == true){
                            break //caso o email seja valido o loop se encerra
                        } else if (this.validar_email(email_func, this.lista_clientes, this.lista_funcionarios) == "email existente") { //verifica se ja existe o email digitado
                            console.log("Email ja esta cadastrado, tente outro por favor.")
                        } else{
                            console.log("Email invalido, por favor digite novamente.");
                        }
                    }
                    while (true){ // loop para garantir que o usuario digite uma senha valida
                        var senha_func = requisicao.question("Digite a senha desejada (6 caracteres ou mais): ");
                        if (this.validar_senha(senha_func) == true){ // chama a funcao de validar a senha com a senha digitada como parametro
                            break //caso a senha seja valida o loop se encerra
                        } else {
                            console.log("Senha invalida, por favor digite novamente.");
                        }
                    }
                    this.lista_funcionarios.push(new Funcionario(this.func_id, nome_usuario_func, cpf_func, email_func, senha_func)); //armazena os dados do funcionario em um banco dedados local (lista)
                    this.func_id++; //atualiza o valor do id somando mais 1, para que no proximo cadastramento o id seja diferente
                    console.log("\nCadastro realizado com sucesso!\n");
                    console.log("Voce sera redirecionado ao menu de cadastramento.");
                    break
        
                case "2":
                    console.log("\n-------------------------- Cadastro - Cliente --------------------------\n");
                    //pede os dados de cadastro ao cliente
                    var nome_cliente = requisicao.question("Digite o seu nome: ");
                    while (true){// loop para garantir que o usuario digite uma data valida
                        var data_cliente = requisicao.question("Digite a sua data de nascimento (dd/mm/aaaa): ");
                        if (this.validar_data(data_cliente) == true){ // chama a funcao de validar a data com a data digitada como parametro
                            break //caso a data seja valida o loop se encerra
                        } else{
                            console.log("Data invalida, por favor digite novamente.");
                        }
                    }
                    while (true){// loop para garantir que o usuario digite um cpf valido
                        var cpf_cliente = requisicao.question("Digite o seu cpf (xxx.xxx.xxx-xx): ");
                        if (this.validar_cpf(cpf_cliente, this.lista_clientes, this.lista_funcionarios) == true){
                            break //caso o cpf seja valido o loop se encerra
                        } else if (this.validar_cpf(cpf_cliente, this.lista_clientes, this.lista_funcionarios) == "cpf existente") { //verifica se ja existe o cpf digitado
                            console.log("CPF ja esta cadastrado, tente outro por favor.")
                        } else{
                            console.log("CPF invalido, por favor digite novamente.");
                        }
                    }
                    while (true){ // loop para garantir que o usuario digite um email valido
                        var email_cliente = requisicao.question("Digite o seu email: "); // chama a funcao de validar o email com o email digitado como parametro
                        if (this.validar_email(email_cliente, this.lista_clientes, this.lista_funcionarios) == true){
                            break //caso o email seja valido o loop se encerra
                        } else if (this.validar_email(email_cliente, this.lista_clientes, this.lista_funcionarios) == "email existente") { //verifica se ja existe o email digitado
                            console.log("Email ja esta cadastrado, tente outro por favor.")
                        } else{
                            console.log("Email invalido, por favor digite novamente.");
                        }
                    }
                    while (true){ // loop para garantir que o usuario digite uma senha valida
                        var senha_cliente = requisicao.question("Digite a senha desejada (6 caracteres ou mais): ");
                        if (this.validar_senha(senha_cliente) == true){ // chama a funcao de validar a senha com a senha digitada como parametro
                            break //caso a senha seja valida o loop se encerra
                        } else{
                            console.log("Senha invalida, por favor digite novamente.");
                        }
                    }
                    this.lista_clientes.push(new Cliente(this.cliente_id, nome_cliente, data_cliente, cpf_cliente, email_cliente, senha_cliente)); //armazena os dados do cliente em um banco dedados local (lista)
                    this.cliente_id++; //atualiza o valor do id somando mais 1, para que no proximo cadastramento o id seja diferente
                    console.log("\nCadastro realizado com sucesso!\n");
                    console.log("Voce sera redirecionado ao menu de cadastramento.");
                    break
        
                case "3": //encerra o loop e volta ao menu principal
                    return console.log("\nVoltou ao menu principal com exito.\n");
                    
                default: //ate o usuario inserir uma opcao valida o loop eh repetido
                    console.log("\nPor favor, digite uma opcao valida.");
                    break
            }
        }
    }

    funcionario_logado(funcionario) { //metodo para o usuario interagir com o sistema estando logado como funcionario
        while(true) {
            console.log("\n-------------------------- Sua conta (Funcionario) --------------------------\n");
            console.log("1 - Ver meus Dados\n2 - Ver lista de Reservas\n3 - Ver lista de Quartos\n4 - Ver lista de Clientes\n5 - Mudar status da reserva (pendente, adiada, realizada, cancelada)\n6 - Adicionar Quarto\n7 - Sair da Conta")
            let escolha = requisicao.question("\nSelecione uma das opcoes acima: "); //mostra as opcoes e faz o usuario escolher uma dentre elas
            
            switch(escolha){
                case "1":
                    console.log("\nSeus dados:\n");
                    sistema.ver_dados(this.lista_funcionarios, funcionario);
                    break;
    
                case "2":
                    console.log("\nLista de Reservas:\n");
                    sistema.ver_lista(this.lista_reservas);
                    break;

                case "3":
                    console.log("\nLista de Quartos:\n");
                    sistema.ver_lista(this.lista_quartos);
                    break;
                
                case "4":
                    console.log("\nLista de Clientes:\n");
                    sistema.ver_lista(this.lista_clientes);
                    break;

                case "5":
                    console.log("\nAlterar status de reserva:\n");
                    break;

                case "6":
                    sistema.adicionar_quarto();
                    break;
    
                case "7":
                    return console.log("\nSaiu da conta com exito.\n");//encerra o loop e sai da interface de usuario logado
                
                default:
                    console.log("\nPor favor, digite uma opcao valida.");//ate o usuario inserir uma opcao valida o loop eh repetido
                    break;
            }
        }
    }

    cliente_logado(cliente) { //metodo para o usuario interagir com o sistema estando logado como cliente
        while(true){
            console.log("\n-------------------------- Sua conta (Cliente) --------------------------\n");
            console.log("1 - Ver meus Dados\n2 - Ver lista de Quartos\n3 - Fazer reserva\n4 - Cancelar reserva\n5 - Ver minhas reservas\n6 - Sair da Conta")
            let escolha = requisicao.question("\nSelecione uma das opcoes acima: "); //mostra as opcoes e faz o usuario escolher uma dentre elas
            
            switch(escolha){
                case "1":
                    console.log("\nSeus dados:\n");
                    sistema.ver_dados(this.lista_clientes, cliente);
                    break;
    
                case "2":
                    console.log("\nLista de Quartos:\n");
                    sistema.ver_lista(this.lista_quartos);
                    break;
                
                case "3":
                    console.log("\nFazer reserva:\n");
                    sistema.fazer_reserva(cliente);
                    break;

                case "4":
                    console.log("\nCancelar reserva:\n");
                    break;

                case "5":
                    console.log("\nSuas reservas:\n");
                    break;
    
                case "6":
                    return console.log("\nSaiu da conta com exito.\n");//encerra o loop e sai da interface de usuario logado
                
                default:
                    console.log("\nPor favor, digite uma opcao valida.");//ate o usuario inserir uma opcao valida o loop eh repetido
                    break;
            }
        }
    }
    ver_lista(lista) { // metodo para imprimir dados de uma lista ao usuario
        if (!Array.isArray(lista) || lista.length === 0) { // verifica se a lista eh valida (array nao vazio)
            console.log("Não ha."); //informa que nao ha lista
            return;
        }
      
        const tipo = formatar_nome(lista[0].constructor.name); // determina o tipo (classe) do primeiro objeto na lista
       
        lista.forEach((obj, index) => { // para cada objeto na lista imprime os atributos com seus valores
            console.log(`${tipo.slice(0, -1)} ${index + 1}:`);
      
            Object.entries(obj).forEach(([chave, valor]) => { // itera pelos atributos de cada objeto
                const nomeBonito = sistema.formatar_atributo(chave);

                if (chave.toLowerCase() === "senha") { // se for senha substitui os caracteres por asteriscos
                    valor = "*".repeat(valor.length); 
                }
                console.log(`  ${nomeBonito}: ${valor}`);
            });
            console.log("-".repeat(30));
        });

        function formatar_nome(nome) { // funcao para formatar o nome da classe
            if (!nome) return null;
            return nome.charAt(0).toUpperCase() + nome.slice(1) + "s";
        }
    }

    ver_dados(lista,usuario){ // metodo para mostrar dados do usuario
        for (let i = 0; i < (lista.length); i++){
            if (usuario.email == lista[i].email){ // faz uma busca no banco de dados para encontrar o email (utiliza o email como diferenciacao de usuario)
                for (let chave in usuario) { // itera sobre os atributos do objeto usuário e imprime de maneira formatada
                    if (usuario.hasOwnProperty(chave)) {
                        const valor = usuario[chave];
                        const nome_bonito = this.formatar_atributo(chave); // chama a função formatar_atributo para formatar o nome do atributo
                        console.log(`  ${nome_bonito}: ${valor}`);
                    }
                }
            }
        }
    }

    adicionar_quarto(){
        console.log("\n------------------------- Adicionar Quarto --------------------------\n");
        while(true){
            var qtd_camas = requisicao.question("Digite a quantidade de camas do quarto: ");
            if (this.validar_quantidade_inteira(qtd_camas) == true){ // chama a funcao de validar a quantidadede camas com a digitada como parametro
                break //caso a senha seja valida o loop se encerra
            } else {
                console.log("Quantidade invalida, por favor digite novamente.");
            }
        }
        while(true){
            var preco_noite = requisicao.question("Digite o preco por noite (Ex: xxx.xx): ");
            if (this.validar_preco(preco_noite) == true){ // chama a funcao de validar o preco com o digitado como parametro
                break //caso a senha seja valida o loop se encerra
            } else {
                console.log("Valor invalido, por favor digite novamente.");
            }
        }
        while(true){
            var nome_quarto = requisicao.question("Digite o nome do quarto: ");
            let contagem = false;
            for (let i = 0; i < (this.lista_quartos.length); i++){
                if (nome_quarto == this.lista_quartos[i].nome){ // faz uma busca no banco de dados para ver se existe o nome de quarto digitado
                    console.log("Nome de quarto ja cadastrado, por favor tente outro.");
                    contagem = true;
                }
            }
            if (contagem == false){ //caso nao encontre, o loop se encerra
                break
            }
        }
        let descricao = requisicao.question("Digite a descricao do quarto: ")
        this.lista_quartos.push(new Quartos(qtd_camas, preco_noite, nome_quarto, descricao)); //armazena os dados do quarto em um banco dedados local (lista)
        console.log("\nQuarto adicionado com sucesso!\n");
    }

    fazer_reserva(usuario_cliente){
        while(true){
            var data_checkin = requisicao.question("Digite a data de Check-in: ");
            if (this.validar_data(data_checkin) == true){ // chama a funcao de validar a data com a data digitada como parametro
                break //caso a data seja valida o loop se encerra
            } else{
                console.log("Data invalida, por favor digite novamente.");
            }
        }
        while(true){
            var data_checkout = requisicao.question("Digite a data de Check-out: ");
            if (this.validar_data(data_checkout) == true){ // chama a funcao de validar a data com a data digitada como parametro
                break //caso a data seja valida o loop se encerra
            } else{
                console.log("Data invalida, por favor digite novamente.");
            }
        }
        this.lista_reservas.push(new Reserva(this.reserva_id, usuario_cliente.cliente_id, "realizado", data_checkin, data_checkout)); //armazena os dados da reserva em um banco dedados local (lista)
        this.reserva_id++; // atualiza o id de reserva
        console.log("\nReserva realizada com sucesso!\n");
    }

    formatar_atributo(atributo) { // metodo para formatar os atributos e utilizar nos prints de dados
            const nomes_bonitos = {
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
                descricao: "Descrição do Quarto"
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
        const formatacao_correta = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //expressão regular para verificar o formato de um email
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
        const formatacao_correta = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/; //expressão regular para verificar o formato de um cpf
        return formatacao_correta.test(cpf); //retorna true se o cpf for valido, false caso contrario
    }

    validar_senha(senha){ //metodo para validar a senha
        return senha.length >= 6; //considerou-se senha invalida aquelas tem menos de 6 caracteres, true em caso afirmativo, false caso contrario
    }

    validar_quantidade_inteira(numeroStr) { //metodo para validar um numero inteiro
        // Converte a string para número
        const numero = Number(numeroStr);

        // Verifica se é um número, se é inteiro e se é positivo
        if (!isNaN(numero) && Number.isInteger(numero) && numero > 0) {
            return true;  // Número válido
        } else {
            return false; // Número inválido
        }
    }
    validar_data(data){ //metodo para validar datas
        const formatacao_correta = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([12][0-9]{3})$/; //expressao regular para o formato dd/mm/aaaa
        if (!formatacao_correta.test(data)) { //verifica se a data está no formato correto
            return false;
        }
        
        const [dia, mes, ano] = data.split('/').map(Number);//se o formato estiver correto, validamos a data
        if (mes < 1 || mes > 12) {//verifica se o me eh valido (1-12)
            return false;
        }
          
        const diasPorMes = [31, (ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //valida o dia de acordo com o mes
        if (dia < 1 || dia > diasPorMes[mes - 1]) {
            return false;
        }

        return true; 
    }

    validar_preco(preco){
        const formatacao_correta = /^\d+(\.\d{1,2})?$/; //expressao regular para validar preços no formato "xx.xx"
        return formatacao_correta.test(preco); //retorna true se o preco for valido, false caso contrario
    }
}
var sistema = new Sistema();
sistema.iniciar_sistema();