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

        //variaveis para definir os id's unicos
        this.func_id = 1000;
        this.cliente_id = 1000;

    }
    iniciar_sistema(){ //metodo para inicializacao do sistema
        while (true){
            console.log("\n-------------------------- Bem vindo ao Hotel F-Luxo --------------------------\n\nO que deseja fazer?\n");
            console.log("1 - Fazer Login\n2 - Fazer Cadastro\n3 - Sair do Programa\n");
            let escolha = requisicao.question("Selecione uma das opcoes acima: "); //mostra as opcoes e faz o usuario escolher uma dentre elas

            switch(escolha){
                case "1":
                    console.log("entrou no fazer login");
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
                        if (this.validar_cpf(cpf_func) == true){ // chama a funcao de validar o cpf com o cpf digitado como parametro
                            break //caso o cpf seja valido o loop se encerra
                        } else{
                            console.log("Cpf invalido, por favor digite novamente.");
                        }
                    }
                    while (true){ // loop para garantir que o usuario digite um email valido
                        var email_func = requisicao.question("Digite o seu email: "); // chama a funcao de validar o email com o email digitado como parametro
                        if (this.validar_email(email_func) == true){
                            break //caso o email seja valido o loop se encerra
                        } else{
                            console.log("Email invalido, por favor digite novamente.");
                        }
                    }
                    while (true){ // loop para garantir que o usuario digite uma senha valida
                        var senha_func = requisicao.question("Digite a senha desejada (6 caracteres ou mais): ");
                        if (this.validar_senha(senha_func) == true){ // chama a funcao de validar a senha com a senha digitada como parametro
                            break //caso a senha seja valida o loop se encerra
                        } else{
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
                        if (this.validar_cpf(cpf_cliente) == true){ // chama a funcao de validar o cpf com o cpf digitado como parametro
                            break //caso o cpf seja valido o loop se encerra
                        } else{
                            console.log("Cpf invalido, por favor digite novamente.");
                        }
                    }
                    while (true){ // loop para garantir que o usuario digite um email valido
                        var email_cliente = requisicao.question("Digite o seu email: "); // chama a funcao de validar o email com o email digitado como parametro
                        if (this.validar_email(email_cliente) == true){
                            break //caso o email seja valido o loop se encerra
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
                    this.lista_clientes.push(new Cliente(this.cliente_id, nome_cliente, data_cliente, cpf_cliente, email_cliente, senha_cliente)); //armazena os dados do funcionario em um banco dedados local (lista)
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

    validar_email(email){ //metodo para validacao dos emails
        const formatacao_correta = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //expressão regular para verificar o formato de um email
        return formatacao_correta.test(email); //retorna true se o email for valido, false caso contrario
    } 

    validar_cpf(cpf){ //metodo para validacao dos cpfs
        const formatacao_correta = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/; //expressão regular para verificar o formato de um cpf
        return formatacao_correta.test(cpf); //retorna true se o cpf for valido, false caso contrario
    }

    validar_senha(senha){ //metodo para validar a senha
        return senha.length >= 6; //considerou-se senha invalida aquelas tem menos de 6 caracteres, true em caso afirmativo, false caso contrario
    }

    validar_quantidade_inteira(quantidade){ //metodo para validar um numero inteiro
        const formatacao_correta = /^-?\d+$/; //expressão regular para verificar o formato de um numero inteiro
        return formatacao_correta.test(quantidade); //retorna true se o numero for valido, false caso contrario
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