const requisicao = require('readline-sync'); //comando necessario para interacao em terminal em js
const fs = require('fs');
const arquivo_banco = 'banco_de_dados.json';

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
        // carregar banco de dados
        if (fs.existsSync(arquivo_banco) && fs.statSync(arquivo_banco).size > 0) {
            let dados_brutos = fs.readFileSync(arquivo_banco, 'utf8');
            this.banco_dados = JSON.parse(dados_brutos);
        } else {
            this.banco_dados = this.estrutura_padrao;
        }
    }

    iniciar_sistema(){ //metodo para inicializacao do sistema
        while (true){
            console.log("\n-------------------------- Bem vindo ao Hotel F-Luxo --------------------------\n\nO que deseja fazer?\n");
            console.log("1 - Fazer Login\n2 - Fazer Cadastro\n3 - Sair do Programa\n");
            let escolha = requisicao.question("Selecione uma das opcoes acima: "); //mostra as opcoes e faz o usuario escolher uma dentre elas

            switch(escolha){
                case "1":

                    let tipo_login = sistema.fazer_login(); //

                    if (tipo_login == "saiu"){ // caso o usuario nao queiria se logar mais
                        console.log("\nVoltou ao menu principal.");

                    } else if (tipo_login[0] == "Usuario Funcionario"){ // loga com a conta como funcionario
                        sistema.funcionario_logado(tipo_login[1]);

                    } else { // loga com a conta como cliente
                        sistema.cliente_logado(tipo_login[1]); 
                    }
                    break;
        
                case "2":
                    sistema.fazer_cadastro(); //abre o menu de cadastro
                    break;
        
                case "3":
                    //ao sair do programa o banco de dados no arquivo json eh atualizado
                    fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8');
                    return console.log("\nSaiu do programa com exito.\n");//encerra o loop e termina o sistema
                    
                default:
                    console.log("\nPor favor, digite uma opcao valida.");//ate o usuario inserir uma opcao valida o loop eh repetido
                    break;
            }
        }
    }

    fazer_login() { //metodo para fazer o login
        let manter_login = true;
        while(manter_login){
            console.log("\n-------------------------- Login --------------------------\n");
            console.log("Digite a tecla enter com a caixa de texto vazia para sair do login.\n");
            let conta_usuario = requisicao.question("Digite seu nome de usuario ou e-mail de login: "); //pede ao usuario o email e senha
            if (conta_usuario == ""){ // caso o usuario nao queira se logar mais
                console.log("\nSaindo...");
                return "saiu";
            }
            let senha = requisicao.question("Digite sua senha: ");
            if (senha == ""){ // caso o usuario nao queira se logar mais
                console.log("\nSaindo...");
                return "saiu";
            }
            let confirmacao_conta = false;
            for (let i = 0; i < (this.banco_dados.clientes.length); i++){ //passa pela lista de clientes para ver se o email esta cadastrado la
                if (conta_usuario == this.banco_dados.clientes[i].email){
                    confirmacao_conta = true;
                    if (senha == this.banco_dados.clientes[i].senha){ //caso o email esteja cadastrado, ve se a senha esta correta
                        console.log("\nSua conta foi acessada com exito!")
                        manter_login = false;
                        return ["Usuario Cliente", this.banco_dados.clientes[i]]; //retorna uma lista para ser utilizada em outro metodo para identificacao de usuario e utilizacao no sistema (cliente ou funconario)
                    }
                }
            }
            for (let i = 0; i < (this.banco_dados.funcionarios.length); i++){ //passa pela lista de funcionarios para ver se o email esta cadastrado la
                if (conta_usuario == this.banco_dados.funcionarios[i].email || conta_usuario == this.banco_dados.funcionarios[i].nome_usuario){
                    confirmacao_conta = true;
                    if (senha == this.banco_dados.funcionarios[i].senha){ //caso o email esteja cadastrado, ve se a senha esta correta
                        console.log("\nSua conta foi acessada com exito!") 
                        manter_login = false;
                        return ["Usuario Funcionario", this.banco_dados.funcionarios[i]] //retorna uma lista para ser utilizada em outro metodo para identificacao de usuario ou utilizacao no sistema(cliente ou funconario)
                    }
                }
            }
            //este bloco de condicional so sera lida caso o email nao tenha sido encontrado ou a senha esteja incorreta
            if (confirmacao_conta == false){ //caso nao encontre nenhum email, confirmacao_email continua false e informa que o email nao foi encontrado
                console.log("\nO e-mail digitado não esta cadastrado, tente novamente.");
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
                    console.log("Aperte a tecla enter com a caixa de texto vazia se quiser sair do cadastro.\n");
                    let nome_usuario_func = sistema.perguntar_nome_usuario(); // chama o metodo para perguntar o nome de usuario
                    if (nome_usuario_func == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        break;
                    }
                    let cpf_funcionario = sistema.perguntar_cpf(); // chama o metodo para perguntar o cpf
                    if (cpf_funcionario == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        break;
                    }
                    let email_func = sistema.perguntar_email(); // chama o metodo para perguntar o email
                    if (email_func == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        break;
                    }
                    let senha_func = sistema.perguntar_senha(); // chama o metodo para perguntar a senha
                    if (senha_func == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        break;
                    }
                    let func_id = sistema.gerar_id(); // chama o metodo para gerar um id unico e aleatorio
                    this.banco_dados.funcionarios.push(new Funcionario(func_id, nome_usuario_func, cpf_funcionario, email_func, senha_func)); //armazena os dados do funcionario em um banco dedados local (lista)
                    fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // salva o novo usuario no banco de dados
                    
                    console.log("\nCadastro realizado com sucesso!\n");
                    console.log("Voce sera redirecionado ao menu de cadastramento.");
                    break;
        
                case "2":
                    console.log("\n-------------------------- Cadastro - Cliente --------------------------\n");
                    console.log("Aperte a tecla enter com a caixa de texto vazia se quiser sair do cadastro.\n");
                    //pede os dados de cadastro ao cliente
                    let nome_cliente = sistema.perguntar_nome(); // chama o metodo para perguntar o nome
                    if (nome_cliente == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        break;
                    }
                    let data_cliente = sistema.perguntar_data_nascimento(); // chama o metodo para perguntar a data de nascimento
                    if (data_cliente == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        break;
                    }
                    let cpf_cliente = sistema.perguntar_cpf(); // chama o metodo para perguntar o cpf
                    if (cpf_cliente == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        break;
                    }
                    let email_cliente = sistema.perguntar_email(); // chama o metodo para perguntar o email
                    if (email_cliente == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        break;
                    }
                    let senha_cliente = sistema.perguntar_senha(); // chama o metodo para perguntar a senha
                    if (senha_cliente == 'sair'){ // se o usuario apertou enter com caixa vazia ele sai
                        break;
                    }
                    let cliente_id = sistema.gerar_id(); // chama o metodo para gerar um id unico e aleatorio
                    this.banco_dados.clientes.push(new Cliente(cliente_id, nome_cliente, data_cliente, cpf_cliente, email_cliente, senha_cliente)); //armazena os dados do cliente em um banco dedados local (lista)
                    fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // salva o novo usuario no banco de dados

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
            console.log("1 - Ver meus Dados\n2 - Ver lista de Reservas\n3 - Ver lista de Quartos\n4 - Ver lista de Clientes\n5 - Mudar status da reserva (pendente, adiada, realizada, cancelada)\n6 - Adicionar Quarto\n7 - Editar Quarto\n8 - Excluir Quarto\n9 - Modificar Dados\n10 - Visualizar Avaliacoes\n11 - Sair da Conta");
            let escolha = requisicao.question("\nSelecione uma das opcoes acima: "); //mostra as opcoes e faz o usuario escolher uma dentre elas
            
            switch(escolha){
                case "1":
                    console.log("\nSeus dados:\n");
                    sistema.ver_dados(this.banco_dados.funcionarios, funcionario);
                    break;
    
                case "2":
                    console.log("\n-------------------------- Lista de Reservas --------------------------\n");
                    sistema.ver_lista_objetos(this.banco_dados.reservas); // chama metodo para printa a lista
                    break;

                case "3":
                    console.log("\n-------------------------- Lista de Quartos --------------------------\n");
                    sistema.ver_lista_objetos(this.banco_dados.quartos); // chama metodo para printa a lista
                    break;
                
                case "4":
                    console.log("\n-------------------------- Lista de Clientes --------------------------\n");
                    sistema.ver_lista_objetos(this.banco_dados.clientes); // chama metodo para printa a lista
                    break;

                case "5":
                    console.log("\n-------------------------- Lista de Reservas --------------------------\n");
                    sistema.ver_lista_objetos(this.banco_dados.reservas); // mostra a lista de reservas para o cliente poder ver
                    console.log("\nAlterar status de reserva:\n");
                    sistema.mudar_status();
                    break;

                case "6":
                    
                    sistema.adicionar_quarto();
                    break;
                
                case "7":
                    console.log("\n-------------------------- Lista de Quartos --------------------------\n");
                    sistema.ver_lista_objetos(this.banco_dados.quartos); // mostra lista de quartos para o cliente poder ver
                    sistema.editar_quarto();
                    fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // atualiza o quarto editado no banco de dados
                    break;

                case "8":
                    console.log("\n-------------------------- Lista de Quartos --------------------------\n");
                    sistema.ver_lista_objetos(this.banco_dados.quartos); // mostra lista de quartos para o cliente poder ver
                    sistema.excluir_quarto();
                    fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // atualiza o quarto excluido no banco de dados
                    break;

                case "9":
                    sistema.modificar_funcionario(funcionario);
                    fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // atualiza o funcionario no banco de dados
                    break;
                
                case "10":
                    sistema.visualizar_avaliacoes();
                    break;
    
                case "11":
                    return console.log("\nSaiu da conta com exito.");//encerra o loop e sai da interface de usuario logado
                
                default:
                    console.log("\nPor favor, digite uma opcao valida.");//ate o usuario inserir uma opcao valida o loop eh repetido
                    break;
            }
        }
    }

    cliente_logado(cliente) { //metodo para o usuario interagir com o sistema estando logado como cliente
        while(true){
            console.log("\n-------------------------- Sua conta (Cliente) --------------------------\n");
            console.log("1 - Ver meus Dados\n2 - Ver lista de Quartos\n3 - Fazer reserva\n4 - Cancelar reserva\n5 - Ver minhas reservas\n6 - Modificar Dados\n7 - Avaliar Estadia\n8 - Visualizar Avaliacoes\n9 - Sair da Conta");
            let escolha = requisicao.question("\nSelecione uma das opcoes acima: "); //mostra as opcoes e faz o usuario escolher uma dentre elas
            
            switch(escolha){
                case "1":
                    console.log("\nSeus dados:\n");
                    sistema.ver_dados(this.banco_dados.clientes, cliente);
                    break;
    
                case "2":
                    console.log("\n-------------------------- Lista de Quartos --------------------------\n");
                    sistema.ver_lista_objetos(this.banco_dados.quartos); // mostra lista de quartos para o cliente poder ver
                    break;
                
                case "3":
                    console.log("\nQuartos Disponiveis:\n");
                    sistema.ver_lista_objetos(this.banco_dados.quartos); // mostra os quartos ao cliente
                    console.log("\nFazer reserva:");
                    sistema.fazer_reserva(cliente);
                    break;

                case "4":
                    console.log("\nSuas reservas:\n");
                    sistema.ver_minha_reserva(this.banco_dados.reservas, cliente); // mostra as reservas do usuario
                    console.log("\nCancelar reserva:\n");
                    sistema.cancelar_reserva(cliente);
                    break;

                case "5":
                    console.log("\nSuas reservas:\n");
                    sistema.ver_minha_reserva(this.banco_dados.reservas, cliente);
                    break;
                
                case "6":
                    sistema.modificar_cliente(cliente);
                    fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // atualiza o cliente no banco de dados
                    break;
                
                case "7":
                    sistema.avaliar_estadia(cliente);
                    fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); //salva as avaliacoes no banco de dados
                    break;
                
                case "8":
                    sistema.visualizar_avaliacoes();
                    break;
    
                case "9":
                    return console.log("\nSaiu da conta com exito.");//encerra o loop e sai da interface de usuario logado
                
                default:
                    console.log("\nPor favor, digite uma opcao valida.");//ate o usuario inserir uma opcao valida o loop eh repetido
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
                        console.log(`  ${nome_bonito}: ${valor}`);
                    }
                }
            }
        }
    }

    adicionar_quarto(){
        console.log("\n------------------------- Adicionar Quarto --------------------------\n");
        console.log("Digite a tecla enter com a caixa de texto vazia caso nao queira mais adicionar o quarto\n");
        while(true){
            var qtd_camas = requisicao.question("Digite a quantidade de camas do quarto: ");
            if (qtd_camas == ""){ // caso o usario queria sair
                return console.log("\nSaindo...");
            }
            if (this.validar_quantidade_inteira(qtd_camas) == true){ // chama a funcao de validar a quantidadede camas com a digitada como parametro
                break //caso a qtd de camas seja valida o loop se encerra
            } else {
                console.log("Quantidade invalida, por favor digite novamente.");
            }
        }
        while(true){
            var preco_noite = requisicao.question("Digite o preco por noite (Ex: xxx.xx): ");
            if (preco_noite == ""){ // caso o usario queria sair
                return console.log("\nSaindo...");
            }
            if (this.validar_preco(preco_noite) == true){ // chama a funcao de validar o preco com o digitado como parametro
                break //caso a senha seja valida o loop se encerra
            } else {
                console.log("Valor invalido, por favor digite novamente.");
            }
        }
        while(true){
            var nome_quarto = requisicao.question("Digite o nome do quarto: ");
            if (nome_quarto == ""){ // caso o usario queria sair
                return console.log("\nSaindo...");
            }
            let existe = sistema.encontrar_quarto(nome_quarto)  ;
            if (existe == true){ // faz uma busca no banco de dados para ver se existe o nome de quarto digitado
                console.log("Nome de quarto ja cadastrado, por favor tente outro.");
            } else {
                break;
            }
        }
        let descricao = requisicao.question("Digite a descricao do quarto: ")
        if (descricao == ""){ // caso o usario queria sair
            return console.log("\nSaindo...");
        }
        this.banco_dados.quartos.push(new Quartos(qtd_camas, preco_noite, nome_quarto, descricao)); //armazena os dados do quarto em um banco dedados local (lista)
        fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // salva o novo quarto no banco de dados
        console.log("\nQuarto adicionado com sucesso!");
    }

    fazer_reserva(usuario_cliente){ //metodo para o usuario realizar uma reserva
        if (this.banco_dados.quartos.length == 0){
            return console.log("Nao ha quartos disponiveis para fazer reserva.");
        }
        console.log("\nDigite a tecla enter com a caixa de texto vazia caso nao queira fazer a reserva.\n");
        while(true){
            var data_checkin = requisicao.question("Digite a data de Check-in: ");
            if (data_checkin == ""){
                return console.log("\nSaindo...");
            }
            let sistema_data = sistema.validar_data(data_checkin);// chama a funcao de validar a data com a data digitada como parametro
            if (sistema_data[0] == true){ // caso o usuario queira sair
                break //caso a data seja valida o loop se encerra
            } else{
                console.log("Data invalida, por favor digite novamente.");
            }
        }
        while(true){
            var data_checkout = requisicao.question("Digite a data de Check-out: ");
            if (data_checkout == ""){ // caso o usuario queira sair
                return console.log("\nSaindo...");
            }
            let sistema_data = sistema.validar_data(data_checkout); // chama a funcao de validar a data com a data digitada como parametro
            if (sistema_data[0] == true){
                break; //caso a data seja valida o loop se encerra
            }
        }
        while(true){
            var nome_quarto = requisicao.question("Digite o nome do quarto que deseja fazer a reserva: ");
            if (nome_quarto == ""){ // caso o usuario queira sair
                return console.log("\nSaindo...");
            }
            let existe = sistema.encontrar_quarto(nome_quarto);
            if (existe == false){
                console.log("\nNome do quarto digitado nao foi encontrado.\n")
            } else {
                break;
            }
        }
        let reserva_id = sistema.gerar_id(); // chama o metodo para gerar um id unico e aleatorio
        this.banco_dados.reservas.push(new Reserva(reserva_id, usuario_cliente.cliente_id, "REALIZADA", data_checkin, data_checkout, nome_quarto)); //armazena os dados da reserva em um banco dedados local (lista)
        fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // salva a nova reserva no banco de dados
        console.log("\nReserva realizada com sucesso!");
    }

    ver_minha_reserva(lista, usuario_cliente){ // metodo para o cliente ver suas reservas
        let contagem = 0; // variavel de contagem para contabilizar as vezes que o id do cliente sera encontrado na lista de reservas
        for (let i = 0; i < (lista.length); i++){
            if (usuario_cliente.cliente_id == lista[i].cliente_id){// faz uma busca no banco de dados para encontrar o id do cliente
                console.log("Reserva" + ` ${contagem+1}:\n`);
                contagem++;
                for (let chave in lista[i]) { // itera sobre os atributos do objeto usuário e imprime de maneira formatada
                    if (lista[i].hasOwnProperty(chave)) {
                        const valor = lista[i][chave];
                        const nome_bonito = this.formatar_atributo(chave); // chama a função formatar_atributo para formatar o nome do atributo
                        console.log(`  ${nome_bonito}: ${valor}`);
                    }
                }
            console.log("-----------------------------");
            }
        }
        if (contagem == 0){ // condicional: se o id do cliente nao for encontrado na lista de reservas
            return console.log("Voce nao tem reservas.");
        }
    }

    cancelar_reserva(usuario_cliente){
        console.log("Digite a tecla enter com a caixa de texto vazia para sair do cancelamento.\n");
        let escolha = requisicao.question("Digite o ID da reserva que deseja cancelar: ");
        let contagem = 0; // variavel de contagem para contabilizar as vezes que o id do cliente sera encontrado na lista de reservas
        if (escolha == ""){
            return console.log("\nSaindo...");
        }
        for (let i = 0; i < (this.banco_dados.reservas.length); i++){
            if (usuario_cliente.cliente_id == this.banco_dados.reservas[i].cliente_id){// faz uma busca no banco de dados para encontrar o id do cliente
                if (escolha == this.banco_dados.reservas[i].reserva_id.toString()){ // sabendo que o usuario tem a reserva, agora analisa se o id digitado dessa reserva eh o msm que ele digitou para cancelar
                    this.banco_dados.reservas.splice(i,1); // se encontrar, muda o status da reserva para cancelada e a exclui
                    fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // atualiza a reserva excluida no banco de dados        
                    console.log("\nReserva cancelada com sucesso!");
                    contagem++;
                }
            }
        }
        if (contagem == 0){ // condicional: se o id do cliente nao for encontrado na lista de reservas
            console.log("\nReserva nao encontrada.")
        }
    }

    mudar_status(){
        if (this.banco_dados.clientes.length == 0){
            return console.log("\nNao ha reservas realizadas.");
        }
        console.log("Digite a tecla enter com a caixa de texto vazia para sair da alteracao.\n");
        let escolha = requisicao.question("Digite o ID da reserva que deseja alterar o status: ")
        if (escolha == ""){ // caso o usuario queira sair
            return console.log("\nSaindo...");
        }
        let contagem = 0; // variavel de contagem para contabilizar as vezes que o id do cliente sera encontrado na lista de reservas
        for (let i = 0; i < (this.banco_dados.reservas.length); i++){
            if (escolha == this.banco_dados.reservas[i].reserva_id.toString()){ // sabendo que o usuario tem a reserva, agora analisa se o id digitado dessa reserva eh o msm que ele digitou para cancelar
                while (true){
                    let alteracao_status = requisicao.question("\nDigite o status que deseja atribuir (pendente, adiada, realizada, cancelada) ou enter para sair: ")
                    if (alteracao_status == ""){ // caso o usuario queira sair
                        return console.log("\nSaindo...");

                    } else if (alteracao_status.toUpperCase() !== "PENDENTE" && // caso o status digitado nao seja pendente, adiada, realizada ou cancelada
                        alteracao_status.toUpperCase() !== "ADIADA" && 
                        alteracao_status.toUpperCase() !== "REALIZADA" && 
                        alteracao_status.toUpperCase() !== "CANCELADA") {
                        console.log("\nStatus invalido, por favor digite novamente.");

                    } else if (alteracao_status.toUpperCase() == "CANCELADA") {
                        this.banco_dados.reservas.splice(i,1); // se for cancelada, exclui a reserva      
                        console.log("\nStatus alterado para cancelada, a reserva sera excluida.\n");
                        break;
                        
                    } else {
                        this.banco_dados.reservas[i].status = alteracao_status.toUpperCase(); // muda o status da reserva       
                        console.log("\nStatus alterado com sucesso!");
                        break;
                    }
                }
                fs.writeFileSync(arquivo_banco, JSON.stringify(this.banco_dados, null, 2), 'utf8'); // atualiza o status da reserva no bando de dados
                contagem++;
            }
        }
        if (contagem == 0){ // condicional: se o id do cliente nao for encontrado na lista de reservas
            return console.log("\nReserva nao encontrada.")
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
            console.log("\n-------------------------- Alterar Dados --------------------------\n");
            console.log("1 - Alterar Nome de Usuario\n2 - Alterar CPF\n3 - Alterar e-mail\n4 - Alterar Senha\n5 - Sair do menu de alteracao\n");
            let escolha = requisicao.question("Escolha a opcao que deseja alterar: ");

            switch(escolha){

                case "1":
                    console.log("\nAperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let novo_nome_usuario_func = sistema.perguntar_nome_usuario(); // chama o metodo para perguntar o nome de usuario
                    if (novo_nome_usuario_func == "sair"){ // caso o usuario aperte enter para sair
                        break;
                    }
                    this.banco_dados.funcionarios[posicao_funcionario].nome_usuario = novo_nome_usuario_func; // le esta linha quando o nome for valido e altera
                    break;

                case "2":
                    console.log("\nAperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let novo_cpf_func = sistema.perguntar_cpf(); //chama o metodo para perguntar o cpf
                    if (novo_cpf_func == "sair"){ // caso o usuario aperte enter para sair
                        break;
                    }
                    this.banco_dados.funcionarios[posicao_funcionario].cpf = novo_cpf_func; // le esta linha quando o cpf for valido e altera
                    console.log("\nCPF alterado com sucesso!");
                    break;
                
                case "3":
                    console.log("\nAperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let novo_email_func = sistema.perguntar_email(); // chama o metodo para perguntar o email
                    if (novo_email_func == "sair"){ // caso o usuario aperte enter para sair
                        break;
                    }
                    this.banco_dados.funcionarios[posicao_funcionario].email = novo_email_func; //le esta linha quando o email for valido e altera
                    console.log("\nEmail alterado com sucesso!");
                    break;
                
                case "4":
                    console.log("\nperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let nova_senha_func = sistema.perguntar_senha(); // chama o metodo para perguntar a senha
                    if (nova_senha_func == "sair"){ // caso o usuario aperte enter para sair
                        break;
                    }
                    this.banco_dados.funcionarios[posicao_funcionario].senha = nova_senha_func; //le esta linha quando a senha for valida e altera
                    console.log("\nSenha alterada com sucesso!");
                    break;
    
                case "5":
                    return console.log("\nSaiu do menu de alteracao com exito.\n");//encerra o loop e sai da interface
                    
                default:
                    console.log("\nPor favor, digite uma opcao valida.");//ate o usuario inserir uma opcao valida o loop eh repetido
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
            console.log("\n-------------------------- Alterar Dados --------------------------\n");
            console.log("1 - Alterar Nome\n2 - Alterar Data de Nascimento\n3 - Alterar CPF\n4 - Alterar e-mail\n5 - Alterar Senha\n6 - Sair do menu de alteracao\n");
            let escolha = requisicao.question("Escolha a opcao que deseja alterar: ");

            switch(escolha){

                case "1":
                    console.log("\nAperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let nome_cliente = sistema.perguntar_nome(); //chama o metodo para perguntar o nome
                    if (nome_cliente == "sair"){ // caso o usuario aperte enter para sair
                        break;
                    }
                    this.banco_dados.clientes[posicao_cliente].nome = nome_cliente;  // le esta linha quando o nome for valido e altera
                    console.log("\nNome alterado com sucesso!");
                    break;
                
                case "2":
                    console.log("\nAperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let nova_data_nascimento = sistema.perguntar_data_nascimento(); //chama o metodo para perguntar a data de nascimento
                    if (nova_data_nascimento == "sair"){ // caso o usuario aperte enter para sair
                        break;
                    }
                    this.banco_dados.clientes[posicao_cliente].data_nascimento = nova_data_nascimento; // le esta linha quando a data for valido e altera
                    console.log("\nData de nascimento alterada com sucesso!");
                    break;
                    
                case "3":
                    console.log("\nAperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let novo_cpf_cliente = sistema.perguntar_cpf() //chama o metodo para perguntar o cpf
                    if (novo_cpf_cliente == "sair"){ // caso o usuario aperte enter para sair
                        break;
                    }
                    this.banco_dados.clientes[posicao_cliente].cpf = novo_cpf_cliente; // le esta linha quando o cpf for valido e altera
                    console.log("\nCPF alterado com sucesso!");
                    break;
                
                case "4":
                    console.log("\nAperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let novo_email_cliente = sistema.perguntar_email(); // chama o metodo para perguntar o email
                    if (novo_email_cliente == "sair"){ // caso o usuario aperte enter para sair
                        break;
                    }
                    this.banco_dados.clientes[posicao_cliente].email = novo_email_cliente; //le esta linha quando o email for valido e altera
                    console.log("\nEmail alterado com sucesso!");
                    break;

                case "5":
                    console.log("\nAperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                    let nova_senha_cliente = sistema.perguntar_senha(); // chama o metodo para perguntar a senha
                    if (nova_senha_cliente == "sair"){ // caso o usuario aperte enter para sair
                        break;
                    }
                    this.banco_dados.clientes[posicao_cliente].senha = nova_senha_cliente; //le esta linha quando a senha for valida e altera
                    console.log("\nSenha alterada com sucesso!");
                    break;

                case "6":
                    return console.log("\nSaiu do menu de alteracao com exito.\n");//encerra o loop e sai da interface
                    
                default:
                    console.log("\nPor favor, digite uma opcao valida.");//ate o usuario inserir uma opcao valida o loop eh repetido
                    break;
            }
        }
    }

    editar_quarto(){ // metodo para editar quartos
        if (this.banco_dados.quartos.length == 0){ // caso nao haja quarto imprime a informacao para o usuario
            return console.log("\nNao ha quartos para serem editados.\n");
        }
        console.log("\nAperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.");
        while (true){ // loop para garantir que o usuario digite nome de um quarto cadastrado
            let escolha = requisicao.question("\nDigite o nome do quarto que deseja editar: ");
            if (escolha == ""){
                console.log("\nSaindo...");
                break;
            }
            let resultado = sistema.encontrar_quarto(escolha);
            let posicao_quarto;
            for (let i = 0; i < (this.banco_dados.quartos.length); i++){ //encontra a posicao do quarto na lista de quartos de acordo com o nome 
                if (escolha == this.banco_dados.quartos[i].nome){
                    posicao_quarto = i;
                    break;
                }
            }
            if (resultado == true){ // se o quarto for encontrado ele podera ser editado
                console.log("\nQuarto encontrado!");
                while (true){
                    console.log("\n-------------------------- Editar Quartos --------------------------\n");
                    console.log("1 - Editar quantidade de camas\n2 - Editar preco por noite\n3 - Editar nome\n4 - Editar descrição\n5 - Sair do menu de edicao\n");
                    let escolha = requisicao.question("Escolha a opcao que deseja editar: ");
                    switch(escolha){
                        case "1":
                            console.log("\nAperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                            while(true){
                                let qtd_camas = requisicao.question("Digite a quantidade de camas do quarto: ");
                                if (qtd_camas == ""){ // volta ao menu de edicao caso o usuario nao queira mais alterar
                                    console.log("\nSaindo...");
                                    break;
                                }
                                if (this.validar_quantidade_inteira(qtd_camas) == true){ // chama a funcao de validar a quantidadede camas com a digitada como parametro
                                    this.banco_dados.quartos[posicao_quarto].quantidade_camas = qtd_camas;
                                    console.log("\nQuantidade de camas editada com sucesso!");
                                    break //caso a qtd de camas seja valida o loop se encerra a quantidade eh alterada
                                } else {
                                    console.log("Quantidade invalida, por favor digite novamente.");
                                }
                            }
                            break;
                        case "2":
                            console.log("\nAperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                            while(true){
                                let preco = requisicao.question("Digite o preco por noite (Ex: xxx.xx): ");
                                if (preco == ""){ // volta ao menu de edicao caso o usuario nao queira mais alterar
                                    console.log("\nSaindo...");
                                    break;
                                }
                                if (this.validar_preco(preco) == true){ // chama a funcao de validar o preco com o digitado como parametro
                                    this.banco_dados.quartos[posicao_quarto].preco_noite = preco;
                                    console.log("\nPreco por noite editado com sucesso!");
                                    break //caso a senha seja valida o loop se encerra e o preco eh alterado
                                } else {
                                    console.log("Valor invalido, por favor digite novamente.");
                                }
                            }
                            break;
                        case "3":
                            console.log("\nAperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                            while(true){
                                let nome_quarto = requisicao.question("Digite o nome do quarto: ");
                                if (nome_quarto == ""){ // volta ao menu de edicao caso o usuario nao queira mais alterar
                                    console.log("\nSaindo...");
                                    break;
                                }
                                let existe = sistema.encontrar_quarto(nome_quarto)  ;
                                if (existe == true){ // faz uma busca no banco de dados para ver se existe o nome de quarto digitado
                                    console.log("Nome de quarto ja cadastrado, por favor tente outro.");
                                } else { //caso nao encontre, o novo nome pode ser inserido
                                    this.banco_dados.quartos[posicao_quarto].nome = nome_quarto;
                                    console.log("\nNome do quarto editado com sucesso!");
                                    break
                                }
                            }
                            break;
                        case "4":
                            console.log("\nAperte a tecla enter com a caixa de texto vazia se nao quiser mais alterar.\n");
                            let descricao_quarto = requisicao.question("Digite a descricao do quarto: ")
                            if (descricao_quarto == ""){ // volta ao menu de edicao caso o usuario nao queira mais alterar
                                console.log("\nSaindo...");
                                break;
                            }
                            this.banco_dados.quartos[posicao_quarto].descricao = descricao_quarto;
                            console.log("\nDescricao do quarto editada com sucesso!");
                            break;

                        case "5":
                            return console.log("\nSaiu do menu de edicao com exito.\n");//encerra o loop e sai da interface
                    
                        default:
                            console.log("\nPor favor, digite uma opcao valida.");//ate o usuario inserir uma opcao valida o loop eh repetido
                            break;
                    }
                }
            } else {
                return console.log("\nNome de quarto não encontrado.");
            }
        }
    }
    
    excluir_quarto(){
        if (this.banco_dados.quartos.length == 0){ // caso nao haja quarto imprime a informacao para o usuario
            return console.log("\nNao ha quartos para serem excluidos.\n");
        }     
        console.log("\nDigite a tecla enter com a caixa de texto vazia caso nao queira mais escluir.");
        while (true){ // loop para garantir que o usuario digite nome de um quarto cadastrado
            let escolha = requisicao.question("\nDigite o nome do quarto que deseja excluir: ");
            if (escolha == ""){ // caso o usuario nao queria mais excluir, o metodo se encerra
                console.log("\nSaindo...");
                break; 
            }
            let resultado = sistema.encontrar_quarto(escolha);
            let posicao_quarto;
            for (let i = 0; i < (this.banco_dados.quartos.length); i++){ //encontra a posicao do quarto na lista de quartos de acordo com o nome 
                if (escolha == this.banco_dados.quartos[i].nome){
                    posicao_quarto = i;
                    break
                }
            }
            if (resultado == true){ // se o quarto for encontrado ele podera ser editado
                this.banco_dados.quartos.splice(posicao_quarto,1);
                return console.log("\nQuarto encontrado e removido com sucesso!");
            } else {
                console.log("\nNome de quarto não encontrado.");
            }
        }
    }

    avaliar_estadia(cliente){ // metodo para avaliar a estadia
        while (true){ // loop para garantir que o usuario digite uma avaliacao valida
            console.log("\n-------------------------- Avaliar Estadia --------------------------\n");
            console.log("5 - Excelente\n4 - Bom\n3 - Mediano\n2 - Ruim\n1 - Pessimo\n") // imprime as avaliacoes
            console.log("Digite a tecla enter com a caixa de texto vazia caso queira sair da avaliacao.\n");
            let avaliacao = requisicao.question("Digite a opcao da avaliacao da sua estadia: ");
            let comentario;
            if (["1", "2", "3", "4", "5"].includes(avaliacao)){ //condicional para identificar se o usuario avaliou corretamente
                while (true){ // loop para garantir que o usuario digite a resposta corretamente
                    let resposta = requisicao.question("Deseja adicionar um comentario? (sim/nao): ");
                    if (resposta.toUpperCase() == "SIM"){ //se for sim pede para inserir o comentario
                        comentario = requisicao.question("Digite o comentario: ");
                        if (comentario == ""){ // caso o usuario queira sair
                            return console.log("\nSaindo...");
                        }
                        this.banco_dados.avaliacoes .push([avaliacao, comentario, cliente.nome]); //salva a avaliacao, o comentario e o nome do cliente avaliante na lista_avaliacos (lista de listas)
                        console.log("\nAvaliacao concluida com sucesso!");
                        break;
                    } else if (resposta.toUpperCase() == "NAO"){ // se nao, adiciona um comentario vazio
                        comentario = " ";
                        this.banco_dados.avaliacoes .push([avaliacao, comentario, cliente.nome]); //salva a avaliacao, o comentario e o nome do cliente avaliante na lista_avaliacos (lista de listas)
                        console.log("\nAvaliacao concluida com sucesso!");
                        break;
                    } else if (resposta == ""){ // caso o usuario queira sair
                        return console.log("\nSaindo...");
                    }else {
                        console.log("\nResposta invalida.\n");
                    }
                }
                break;
            } else if (avaliacao == ""){ // caso o usuario queira sair
                return console.log("\nSaindo...");
            } else {
                console.log("Avaliacao invalida, por favor tente novamente.");
            }
        }
    }

    visualizar_avaliacoes(){ // metodo para visualizacao das avaliacoes
        if (this.banco_dados.avaliacoes .length == 0){
            return console.log("\nNao ha avaliacoes para serem exibidas.\n");
        }
        for (let i = 0; i < this.banco_dados.avaliacoes .length; i++){
            let avaliacao_int = parseInt(this.banco_dados.avaliacoes [i][0]);  //avaliação (primeiro item da lista interna) em inteiro
            let comentario = this.banco_dados.avaliacoes [i][1]; //comentário (segundo item da lista interna)
            let nome_cliente = this.banco_dados.avaliacoes [i][2]; //nome do cliente (terceiro item da lista interna)
            let estrelas = '★ '.repeat(avaliacao_int) + '☆ '.repeat(5 - avaliacao_int); // variacel para gerar estrelas de avaliacao (cheias e vazias)
            //imprime a avaliação em estrelas, o comentário e o nome do cliente
            console.log(`\nCliente: ${nome_cliente}`);
            console.log(`Avaliação: ${estrelas}`);
            console.log(`Comentário: ${comentario}`);
            console.log('------------------------');
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

    gerar_id(){
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

    ver_lista_objetos(lista) {
        if (lista.length == 0){
            return console.log("\nNao ha dados para serem exibidos.\n")
        }
        lista.forEach((objeto) => {
            for (let atributo in objeto) {
                console.log(`${sistema.formatar_atributo(atributo)}: ${objeto[atributo]}`);
            }
            console.log("\n---------------------------");
        });
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
        let sistema_data = sistema.validar_data(data);
        if (sistema_data[0]){ // chama metodo para validar formatacao da data (sistema_data[0] eh true caso a data seja valida)
            //sistema_data[3] = ano, sistema_data[2] = mes, sistema_data[1] = dia, sistema_data[0] = true
            // validação de idade minima (18 anos) e ano minimo (1900), pega a data do dia da execucao do codigo
            let hoje = new Date();
            let ano_atual = hoje.getFullYear();
            let mes_atual = hoje.getMonth() + 1;
            let dia_atual = hoje.getDate();
    
            if (sistema_data[3] < 1900) { // ano minimo para cadastro (ano esta na posicao 3)
                console.log("Data de nascimento invalida (nasceu antes de 1900).");
                return false;
            }
            let data_nascimento = new Date(sistema_data[3], sistema_data[2] - 1, sistema_data[1]); // para o caso do usuario digitar uma data posterior ao dia de hoje
            if (data_nascimento > hoje) {
                console.log("Data de nascimento invalida, por favor digite novamente.");
                return false;
            }
            let idade = ano_atual - sistema_data[3];
            if (sistema_data[3] > mes_atual || (sistema_data[3] === mes_atual && sistema_data[1] > dia_atual)) {
                idade--; // ajusta a idade se o aniversario ainda nao aconteceu no ano atual
            }
            if (idade < 18){ // retorna true caso a idade seja maior ou igual a 18 e false caso contrario
                console.log("Data de nascimento invalida (menor de 18 anos).");
                return false
            }else {
                return true
            }
        }
    }

    validar_data(data){ // metodo para validacao de formatacao de data
        let formatacao_correta = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([12][0-9]{3})$/; //expressao regular para o formato dd/mm/aaaa
        if (!formatacao_correta.test(data)) { //verifica se a data está no formato correto
            console.log("Data invalida, por favor digite novamente.");
            return [false];
        }
        let [dia, mes, ano] = data.split('/').map(Number);//se o formato estiver correto, validamos a data
        if (mes < 1 || mes > 12) {//verifica se o me eh valido (1-12)
            console.log("Data invalida, por favor digite novamente.");
            return [false];
        }
        let diasPorMes = [31, (ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //valida o dia de acordo com o mes
        if (dia < 1 || dia > diasPorMes[mes - 1]) {
            console.log("Data invalida, por favor digite novamente.");
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
            let cpf_usuario = requisicao.question("Digite o seu cpf (xxx.xxx.xxx-xx): ");
            let sair = sistema.sair(cpf_usuario);
            if (sair == true){
                return "sair"
            }
            if (this.validar_cpf(cpf_usuario, this.banco_dados.clientes, this.banco_dados.funcionarios) == true){
                return cpf_usuario //caso o cpf seja valido o metodo se encerra e retorna o cpf
            } else if (this.validar_cpf(cpf_usuario, this.banco_dados.clientes, this.banco_dados.funcionarios) == "cpf existente") { //verifica se ja existe o cpf digitado
                console.log("CPF ja esta cadastrado, tente outro por favor.")
            } else {
                console.log("CPF invalido, por favor digite novamente.");
            }
        }
    }

    perguntar_email(){ // metodo para aquisicao do dado email
        while (true){ // loop para garantir que o usuario digite um email valido
            let email_usuario = requisicao.question("Digite o seu email: "); // chama a funcao de validar o email com o email digitado como parametro
            let sair = sistema.sair(email_usuario);
            if (sair == true){
                return "sair"
            }
            if (this.validar_email(email_usuario, this.banco_dados.clientes, this.banco_dados.funcionarios) == true){
                return email_usuario //caso o email seja valido retorna o email digitado
            } else if (this.validar_email(email_usuario, this.banco_dados.clientes, this.banco_dados.funcionarios) == "email existente") { //verifica se ja existe o email digitado
                console.log("Email ja esta cadastrado, tente outro por favor.")
            } else{
                console.log("Email invalido, por favor digite novamente.");
            }
        }
    }

    perguntar_senha(){ // metodo para aquisicao do dado senha
        while (true){ // loop para garantir que o usuario digite uma senha valida
            let senha_usuario = requisicao.question("Digite a senha desejada (6 caracteres ou mais): ");
            let sair = sistema.sair(senha_usuario);
            if (sair == true){
                return "sair"
            }
            if (this.validar_senha(senha_usuario) == true){ // chama a funcao de validar a senha com a senha digitada como parametro
                return senha_usuario //caso a senha seja valida retorna a senha digitada
            } else {
                console.log("Senha invalida, por favor digite novamente.");
            }
        }
    }

    perguntar_data_nascimento(){ // metodo para aquisicao do dado data de nascimento
        while (true){// loop para garantir que o usuario digite uma data valida
            let data_nascimento = requisicao.question("Digite a sua data de nascimento (dd/mm/aaaa): ");
            let sair = sistema.sair(data_nascimento);
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
            let nome_usuario_func = requisicao.question("Digite o nome de usuario desejado: ");
            let sair = sistema.sair(nome_usuario_func);
            if (sair == true){
                return "sair"
            }
            let flag = false;
            for (let i = 0; i < (this.banco_dados.funcionarios.length); i++){
                if (nome_usuario_func == this.banco_dados.funcionarios[i].nome_usuario){ // faz uma busca no banco de dados para ver se existe o usuario digitado
                    console.log("Nome de usuario ja cadastrado, por favor tente outro.");
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
            let nome = requisicao.question("Digite o seu nome: ");
            let sair = sistema.sair(nome);
            if (sair == true){
                return "sair"
            }
            if (this.validar_nome(nome) == true){
                return nome
            } else {
                console.log("Nome invalido, por favor digite novamente.");
            }
        }
    }
    sair(informacao){ // metodo para analisar se o usuario quer sair ou nao no momento da insercao de dados
        if (informacao == ""){
            console.log("\nSaindo...");
            return true
        } 
    }
}
var sistema = new Sistema();
sistema.iniciar_sistema();