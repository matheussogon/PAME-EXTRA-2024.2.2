const requisicao = require('readline-sync'); //comando necessario para interacao em terminal em js

class Reserva { //criando a classe Reserva
    constructor(reserva_id, cliente_id, status, check_in, check_out,nome_quarto) {
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

        //listas para armazenar dados
        this.lista_funcionarios = [];
        this.lista_clientes = [];
        this.lista_quartos = [];
        this.lista_reservas = [];
        this.lista_avaliacoes = [];
        this.lista_ids = [];

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
                    break;
        
                case "2":
                    sistema.fazer_cadastro(); //abre o menu de cadastro
                    break;
        
                case "3":
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
            let conta_usuario = requisicao.question("Digite seu nome de usuario ou e-mail de login: "); //pede ao usuario o email e senha
            let senha = requisicao.question("Digite sua senha: ");
            let confirmacao_conta = false;
            for (let i = 0; i < (this.lista_clientes.length); i++){ //passa pela lista de clientes para ver se o email esta cadastrado la
                if (conta_usuario == this.lista_clientes[i].email){
                    confirmacao_conta = true;
                    if (senha == this.lista_clientes[i].senha){ //caso o email esteja cadastrado, ve se a senha esta correta
                        console.log("\nSua conta foi acessada com exito!")
                        manter_login = false;
                        return ["Usuario Cliente", this.lista_clientes[i]] //retorna uma lista para ser utilizada em outro metodo para identificacao de usuario e utilizacao no sistema (cliente ou funconario)
                    }
                }
            }
            for (let i = 0; i < (this.lista_funcionarios.length); i++){ //passa pela lista de funcionarios para ver se o email esta cadastrado la
                if (conta_usuario == this.lista_funcionarios[i].email || conta_usuario == this.lista_funcionarios[i].nome_usuario){
                    confirmacao_conta = true;
                    if (senha == this.lista_funcionarios[i].senha){ //caso o email esteja cadastrado, ve se a senha esta correta
                        console.log("\nSua conta foi acessada com exito!") 
                        manter_login = false;
                        return ["Usuario Funcionario", this.lista_funcionarios[i]] //retorna uma lista para ser utilizada em outro metodo para identificacao de usuario ou utilizacao no sistema(cliente ou funconario)
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
                    let nome_usuario_func = sistema.perguntar_nome_usuario(); // chama o metodo para perguntar o nome de usuario
                    let cpf_funcionario = sistema.perguntar_cpf(); // chama o metodo para perguntar o cpf
                    let email_func = sistema.perguntar_email(); // chama o metodo para perguntar o email
                    let senha_func = sistema.perguntar_senha(); // chama o metodo para perguntar a senha
                    let func_id = sistema.gerar_id(); // chama o metodo para gerar um id unico e aleatorio
                    this.lista_funcionarios.push(new Funcionario(func_id, nome_usuario_func, cpf_funcionario, email_func, senha_func)); //armazena os dados do funcionario em um banco dedados local (lista)
                    
                    console.log("\nCadastro realizado com sucesso!\n");
                    console.log("Voce sera redirecionado ao menu de cadastramento.");
                    break;
        
                case "2":
                    console.log("\n-------------------------- Cadastro - Cliente --------------------------\n");
                    //pede os dados de cadastro ao cliente
                    let nome_cliente = sistema.perguntar_nome(); // chama o metodo para perguntar o nome
                    let data_cliente = sistema.perguntar_data_nascimento(); // chama o metodo para perguntar a data de nascimento
                    let cpf_cliente = sistema.perguntar_cpf(); // chama o metodo para perguntar o cpf
                    let email_cliente = sistema.perguntar_email(); // chama o metodo para perguntar o email
                    let senha_cliente = sistema.perguntar_senha(); // chama o metodo para perguntar a senha
                    let cliente_id = sistema.gerar_id(); // chama o metodo para gerar um id unico e aleatorio
                    this.lista_clientes.push(new Cliente(cliente_id, nome_cliente, data_cliente, cpf_cliente, email_cliente, senha_cliente)); //armazena os dados do cliente em um banco dedados local (lista)
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
                    sistema.mudar_status();
                    break;

                case "6":
                    sistema.adicionar_quarto();
                    break;
                
                case "7":
                    sistema.editar_quarto();
                    break;

                case "8":
                    sistema.excluir_quarto();
                    break;

                case "9":
                    sistema.modificar_funcionario(funcionario);
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
                    sistema.cancelar_reserva(cliente);
                    break;

                case "5":
                    console.log("\nSuas reservas:\n");
                    sistema.ver_minha_reserva(this.lista_reservas, cliente);
                    break;
                
                case "6":
                    sistema.modificar_cliente(cliente);
                    break;
                
                case "7":
                    sistema.avaliar_estadia(cliente);
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

    ver_lista(lista) { // metodo para imprimir dados de uma lista ao usuario
        if (!Array.isArray(lista) || lista.length === 0) { // verifica se a lista eh valida (array nao vazio)
            console.log("Não ha."); //informa que nao ha lista
            return;
        }
      
        let tipo = formatar_nome(lista[0].constructor.name); // determina o tipo (classe) do primeiro objeto na lista
       
        lista.forEach((obj, index) => { // para cada objeto na lista imprime os atributos com seus valores
            console.log(`${tipo.slice(0, -1)} ${index + 1}:`);
      
            Object.entries(obj).forEach(([chave, valor]) => { // itera pelos atributos de cada objeto
                let nome_bonito = sistema.formatar_atributo(chave);

                if (chave.toLowerCase() === "senha") { // se for senha substitui os caracteres por asteriscos
                    valor = "*".repeat(valor.length); 
                }
                console.log(`  ${nome_bonito}: ${valor}`);
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
                break //caso a qtd de camas seja valida o loop se encerra
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

    fazer_reserva(usuario_cliente){ //metodo para o usuario realizar uma reserva
        if (this.lista_quartos.length == 0){
            return console.log("Nao ha quartos disponiveis para fazer reserva.");
        }
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
        while(true){
            let contagem = 0;
            var nome_quarto = requisicao.question("Digite o nome do quarto que deseja fazer a reserva: ");
            for (let i = 0; i < (this.lista_quartos.length); i++){
                if (nome_quarto == this.lista_quartos[i].nome){
                    contagem++;
                }
            }
            if (contagem != 0){
                break

            } else {
                console.log("\nNome do quarto digitado nao foi encontrado.\n")
            }
        }
        let reserva_id = sistema.gerar_id(); // chama o metodo para gerar um id unico e aleatorio
        this.lista_reservas.push(new Reserva(reserva_id, usuario_cliente.cliente_id, "REALIZADA", data_checkin, data_checkout, nome_quarto)); //armazena os dados da reserva em um banco dedados local (lista)
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
            console.log("Voce nao tem reservas.");
        }
    }

    cancelar_reserva(usuario_cliente){
        let escolha = requisicao.question("Digite o ID da reserva que deseja cancelar: ")
        let contagem = 0; // variavel de contagem para contabilizar as vezes que o id do cliente sera encontrado na lista de reservas
        for (let i = 0; i < (this.lista_reservas.length); i++){
            if (usuario_cliente.cliente_id == this.lista_reservas[i].cliente_id){// faz uma busca no banco de dados para encontrar o id do cliente
                if (escolha == this.lista_reservas[i].reserva_id.toString()){ // sabendo que o usuario tem a reserva, agora analisa se o id digitado dessa reserva eh o msm que ele digitou para cancelar
                    this.lista_reservas.splice(i,1); // se encontrar, muda o status da reserva para cancelada        
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
        if (this.lista_clientes.length == 0){
            return console.log("\nNao ha reservas realizadas.");
        }
        let escolha = requisicao.question("Digite o ID da reserva que deseja alterar o status: ")
        let contagem = 0; // variavel de contagem para contabilizar as vezes que o id do cliente sera encontrado na lista de reservas
        for (let i = 0; i < (this.lista_reservas.length); i++){
            if (escolha == this.lista_reservas[i].reserva_id.toString()){ // sabendo que o usuario tem a reserva, agora analisa se o id digitado dessa reserva eh o msm que ele digitou para cancelar
                while (true){
                    let alteracao_status = requisicao.question("\nDigite o status que deseja atribuir (pendente, adiada, realizada, cancelada): ")
                    if (alteracao_status.toUpperCase() !== "PENDENTE" && 
                        alteracao_status.toUpperCase() !== "ADIADA" && 
                        alteracao_status.toUpperCase() !== "REALIZADA" && 
                        alteracao_status.toUpperCase() !== "CANCELADA") {
                        console.log("\nStatus invalido, por favor digite novamente.");

                    } else if (alteracao_status.toUpperCase() == "CANCELADA") {
                        this.lista_reservas.splice(i,1); // se for cancelada, exclui a reserva      
                        console.log("\nStatus alterado para cancelada, a reserva sera excluida.\n");
                        break;
                    } else {
                        this.lista_reservas[i].status = alteracao_status.toUpperCase(); // muda o status da reserva       
                        console.log("\nStatus alterado com sucesso!\n");
                        break;
                    }
                }
                contagem++;
            }
        }
        if (contagem == 0){ // condicional: se o id do cliente nao for encontrado na lista de reservas
            console.log("\nReserva nao encontrada.")
        }
    }

    modificar_funcionario(funcionario){ // metodo para modificar os dados do funcionario
        let posicao_funcionario;
        for (let i = 0; i < (this.lista_funcionarios.length); i++){ //encontra a posicao do usuario na lista de funcionarios de acordo com o nome de usuario
            if (funcionario.nome_usuario == this.lista_funcionarios[i].nome_usuario){
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
                    let novo_nome_usuario_func = sistema.perguntar_nome_usuario(); // chama o metodo para perguntar o nome de usuario
                    this.lista_funcionarios[posicao_funcionario].nome_usuario = novo_nome_usuario_func; // le esta linha quando o nome for valido e altera
                    break;

                case "2":
                    let novo_cpf_func = sistema.perguntar_cpf(); //chama o metodo para perguntar o cpf
                    this.lista_funcionarios[posicao_funcionario].cpf = novo_cpf_func; // le esta linha quando o cpf for valido e altera
                    console.log("\nCPF alterado com sucesso!");
                    break;
                
                case "3":
                    let novo_email_func = sistema.perguntar_email(); // chama o metodo para perguntar o email
                    this.lista_funcionarios[posicao_funcionario].email = novo_email_func; //le esta linha quando o email for valido e altera
                    console.log("\nEmail alterado com sucesso!");
                    break;
                
                case "4":
                    let nova_senha_func = sistema.perguntar_senha(); // chama o metodo para perguntar a senha
                    this.lista_funcionarios[posicao_funcionario].senha = nova_senha_func; //le esta linha quando a senha for valida e altera
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
        for (let i = 0; i < (this.lista_clientes.length); i++){ //encontra a posicao do usuario na lista de clientes de acordo com o email
            if (cliente.email == this.lista_clientes[i].email){
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
                    let nome_cliente = sistema.perguntar_nome(); //chama o metodo para perguntar o nome
                    this.lista_clientes[posicao_cliente].nome = nome_cliente;  // le esta linha quando o nome for valido e altera
                    console.log("\nNome alterado com sucesso!");
                    break;
                
                case "2":
                    let nova_data_nascimento = sistema.perguntar_data_nascimento(); //chama o metodo para perguntar a data de nascimento
                    this.lista_clientes[posicao_cliente].data_nascimento = nova_data_nascimento; // le esta linha quando a data for valido e altera
                    console.log("\nData de nascimento alterada com sucesso!");
                    break;
                    
                case "3":
                    let novo_cpf_cliente = sistema.perguntar_cpf() //chama o metodo para perguntar o cpf
                    this.lista_clientes[posicao_cliente].cpf = novo_cpf_cliente; // le esta linha quando o cpf for valido e altera
                    console.log("\nCPF alterado com sucesso!");
                    break;
                
                case "4":
                    let novo_email_cliente = sistema.perguntar_email(); // chama o metodo para perguntar o email
                    this.lista_clientes[posicao_cliente].email = novo_email_cliente; //le esta linha quando o email for valido e altera
                    console.log("\nEmail alterado com sucesso!");
                    break;

                case "5":
                    let nova_senha_cliente = sistema.perguntar_senha(); // chama o metodo para perguntar a senha
                    this.lista_clientes[posicao_cliente].senha = nova_senha_cliente; //le esta linha quando a senha for valida e altera
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
        if (this.lista_quartos.length == 0){ // caso nao haja quarto imprime a informacao para o usuario
            return console.log("\nNao ha quartos para serem editados.\n");
        }
        while (true){ // loop para garantir que o usuario digite nome de um quarto cadastrado
            let escolha = requisicao.question("\nDigite o nome do quarto que deseja editar: ");
            let resultado = sistema.encontrar_quarto(escolha);
            let posicao_quarto;
            for (let i = 0; i < (this.lista_quartos.length); i++){ //encontra a posicao do quarto na lista de quartos de acordo com o nome 
                if (escolha == this.lista_quartos[i].nome){
                    posicao_quarto = i;
                    break
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
                            while(true){
                                let qtd_camas = requisicao.question("Digite a quantidade de camas do quarto: ");
                                if (this.validar_quantidade_inteira(qtd_camas) == true){ // chama a funcao de validar a quantidadede camas com a digitada como parametro
                                    this.lista_quartos[posicao_quarto].quantidade_camas = qtd_camas;
                                    console.log("\nQuantidade de camas editada com sucesso!");
                                    break //caso a qtd de camas seja valida o loop se encerra a quantidade eh alterada
                                } else {
                                    console.log("Quantidade invalida, por favor digite novamente.");
                                }
                            }
                            break;
                        case "2":
                            while(true){
                                let preco = requisicao.question("Digite o preco por noite (Ex: xxx.xx): ");
                                if (this.validar_preco(preco) == true){ // chama a funcao de validar o preco com o digitado como parametro
                                    this.lista_quartos[posicao_quarto].preco_noite = preco;
                                    console.log("\nPreco por noite editado com sucesso!");
                                    break //caso a senha seja valida o loop se encerra e o preco eh alterado
                                } else {
                                    console.log("Valor invalido, por favor digite novamente.");
                                }
                            }
                            break;
                        case "3":
                            while(true){
                                let nome_quarto = requisicao.question("Digite o nome do quarto: ");
                                let contagem = false;
                                for (let i = 0; i < (this.lista_quartos.length); i++){
                                    if (nome_quarto == this.lista_quartos[i].nome){ // faz uma busca no banco de dados para ver se existe o nome de quarto digitado
                                        console.log("Nome de quarto ja cadastrado, por favor tente outro.");
                                        contagem = true;
                                    }
                                }
                                if (contagem == false){ //caso nao encontre, o novo nome pode ser inserido
                                    this.lista_quartos[posicao_quarto].nome = nome_quarto;
                                    console.log("\nNome do quarto editado com sucesso!");
                                    break
                                }
                            }
                            break;
                        case "4":
                            let descricao_quarto = requisicao.question("Digite a descricao do quarto: ")
                            this.lista_quartos[posicao_quarto].descricao = descricao_quarto;
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
                console.log("\nNome de quarto não encontrado.");
            }
        }
    }
    
    excluir_quarto(){
        if (this.lista_quartos.length == 0){ // caso nao haja quarto imprime a informacao para o usuario
            return console.log("\nNao ha quartos para serem excluidos.\n");
        }     
        while (true){ // loop para garantir que o usuario digite nome de um quarto cadastrado
            let escolha = requisicao.question("\nDigite o nome do quarto que deseja excluir: ");
            let resultado = sistema.encontrar_quarto(escolha);
            let posicao_quarto;
            for (let i = 0; i < (this.lista_quartos.length); i++){ //encontra a posicao do quarto na lista de quartos de acordo com o nome 
                if (escolha == this.lista_quartos[i].nome){
                    posicao_quarto = i;
                    break
                }
            }
            if (resultado == true){ // se o quarto for encontrado ele podera ser editado
                this.lista_quartos.splice(posicao_quarto,1);
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
            let avaliacao = requisicao.question("Digite a opcao da avaliacao da sua estadia: ");
            let comentario;
            if (["1", "2", "3", "4", "5"].includes(avaliacao)){ //condicional para identificar se o usuario avaliou corretamente
                while (true){ // loop para garantir que o usuario digite a resposta corretamente
                    let resposta = requisicao.question("Deseja adicionar um comentario? (sim/nao): ");
                    if (resposta.toUpperCase() == "SIM"){ //se for sim pede para inserir o comentario
                        comentario = requisicao.question("Digite o comentario: ");
                        this.lista_avaliacoes.push([avaliacao, comentario, cliente.nome]); //salva a avaliacao, o comentario e o nome do cliente avaliante na lista_avaliacos (lista de listas)
                        console.log("\nAvaliacao concluida com sucesso!");
                        break;
                    } else if (resposta.toUpperCase() == "NAO"){ // se nao, adiciona um comentario vazio
                        comentario = " ";
                        this.lista_avaliacoes.push([avaliacao, comentario, cliente.nome]); //salva a avaliacao, o comentario e o nome do cliente avaliante na lista_avaliacos (lista de listas)
                        console.log("\nAvaliacao concluida com sucesso!");
                        break
                    }else {
                        console.log("\nResposta invalida.\n");
                    }
                }
                break;
            } else {
                console.log("Avaliacao invalida, por favor tente novamente.");
            }
        }
    }

    visualizar_avaliacoes(){ // metodo para visualizacao das avaliacoes
        if (this.lista_avaliacoes.length == 0){
            return console.log("\nNao ha avaliacoes para serem exibidas.\n");
        }
        for (let i = 0; i < this.lista_avaliacoes.length; i++){
            let avaliacao_int = parseInt(this.lista_avaliacoes[i][0]);  //avaliação (primeiro item da lista interna) em inteiro
            let comentario = this.lista_avaliacoes[i][1]; //comentário (segundo item da lista interna)
            let nome_cliente = this.lista_avaliacoes[i][2]; //nome do cliente (terceiro item da lista interna)
            let estrelas = '★ '.repeat(avaliacao_int) + '☆ '.repeat(5 - avaliacao_int); // variacel para gerar estrelas de avaliacao (cheias e vazias)
            //imprime a avaliação em estrelas, o comentário e o nome do cliente
            console.log(`\nCliente: ${nome_cliente}`);
            console.log(`Avaliação: ${estrelas}`);
            console.log(`Comentário: ${comentario}`);
            console.log('------------------------');
        }
    }
    
    encontrar_quarto(nome_quarto){ // metodo para encontrar nome de quarto na lista de quarto
        for (let i = 0; i < (this.lista_quartos.length); i++){
            if (nome_quarto == this.lista_quartos[i].nome){ // faz uma busca no banco de dados para ver se existe o nome de quarto digitado
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
            for (let i = 0; i < this.lista_ids.length; i++) { // loop para encontrar o id caso ele exista
                if (this.lista_ids[i] === id) {
                    existe = true; // marca como existente e sai do loop for
                    id = Math.floor(100000000 + Math.random() * 900000000).toString(); // gera novo id e repete o processo
                    break;
                }
            }
        }
        this.lista_ids.push(id); // adiciona o id unico a lista
        return id;
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

    validar_data(data){ //metodo para validar data de nascimento
        let formatacao_correta = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/([12][0-9]{3})$/; //expressao regular para o formato dd/mm/aaaa
        if (!formatacao_correta.test(data)) { //verifica se a data está no formato correto
            console.log("Data de nascimento invalida, por favor digite novamente.");
            return false;
        }
        let [dia, mes, ano] = data.split('/').map(Number);//se o formato estiver correto, validamos a data
        if (mes < 1 || mes > 12) {//verifica se o me eh valido (1-12)
            console.log("Data de nascimento invalida, por favor digite novamente.");
            return false;
        }
        let diasPorMes = [31, (ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; //valida o dia de acordo com o mes
        if (dia < 1 || dia > diasPorMes[mes - 1]) {
            console.log("Data de nascimento invalida, por favor digite novamente.");
            return false;
        }
        // validação de idade minima (18 anos) e ano minimo (1900), pega a data do dia da execucao do codigo
        let hoje = new Date();
        let ano_atual = hoje.getFullYear();
        let mes_atual = hoje.getMonth() + 1;
        let dia_atual = hoje.getDate();
    
        if (ano < 1900) { // ano minimo para cadastr0
            console.log("Data de nascimento invalida (nasceu antes de 1900).");
            return false;
        }
        let data_nascimento = new Date(ano, mes - 1, dia); // para o caso do usuario digitar uma data posterior ao dia de hoje
        if (data_nascimento > hoje) {
            console.log("Data de nascimento invalida, por favor digite novamente.");
            return false;
        }
        let idade = ano_atual - ano;
        if (mes > mes_atual || (mes === mes_atual && dia > dia_atual)) {
            idade--; // ajusta a idade se o aniversario ainda nao aconteceu no ano atual
        }
        if (idade < 18){ // retorna true caso a idade seja maior ou igual a 18 e false caso contrario
            console.log("Data de nascimento invalida (menor de 18 anos).");
            return false
        }else
            return true 
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
            if (this.validar_cpf(cpf_usuario, this.lista_clientes, this.lista_funcionarios) == true){
                return cpf_usuario //caso o cpf seja valido o metodo se encerra e retorna o cpf
            } else if (this.validar_cpf(cpf_usuario, this.lista_clientes, this.lista_funcionarios) == "cpf existente") { //verifica se ja existe o cpf digitado
                console.log("CPF ja esta cadastrado, tente outro por favor.")
            } else{
                console.log("CPF invalido, por favor digite novamente.");
            }
        }
    }

    perguntar_email(){ // metodo para aquisicao do dado email
        while (true){ // loop para garantir que o usuario digite um email valido
            let email_usuario = requisicao.question("Digite o seu email: "); // chama a funcao de validar o email com o email digitado como parametro
            if (this.validar_email(email_usuario, this.lista_clientes, this.lista_funcionarios) == true){
                return email_usuario //caso o email seja valido retorna o email digitado
            } else if (this.validar_email(email_usuario, this.lista_clientes, this.lista_funcionarios) == "email existente") { //verifica se ja existe o email digitado
                console.log("Email ja esta cadastrado, tente outro por favor.")
            } else{
                console.log("Email invalido, por favor digite novamente.");
            }
        }
    }

    perguntar_senha(){ // metodo para aquisicao do dado senha
        while (true){ // loop para garantir que o usuario digite uma senha valida
            let senha_usuario = requisicao.question("Digite a senha desejada (6 caracteres ou mais): ");
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
            if (this.validar_data(data_nascimento) == true){ // chama a funcao de validar a data com a data digitada como parametro
                return data_nascimento //caso a data seja valida retorna a data digitada
            }
        }
    }

    perguntar_nome_usuario(){ // metodo para aquisicao do dado nome de usuario
        while (true){ // loop para garantir que o usuario digite um nome de usuario nao existente
            let nome_usuario_func = requisicao.question("Digite o nome de usuario desejado: ");
            let flag = false;
            for (let i = 0; i < (this.lista_funcionarios.length); i++){
                if (nome_usuario_func == this.lista_funcionarios[i].nome_usuario){ // faz uma busca no banco de dados para ver se existe o usuario digitado
                    console.log("Nome de usuario ja cadastrado, por favor tente outro.");
                    flag = true;
                }
            }
            if (flag == false){ //caso nao encontre retorna o nome de usuario digitado
                return nome_usuario_func
            }
        }
    }

    perguntar_nome(){
        while(true){
            let nome = requisicao.question("Digite o seu nome: ");
            if (this.validar_nome(nome) == true){
                return nome
            } else {
                console.log("Nome invalido, por favor digite novamente.");
            }
        }
    }
}
var sistema = new Sistema();
sistema.iniciar_sistema();