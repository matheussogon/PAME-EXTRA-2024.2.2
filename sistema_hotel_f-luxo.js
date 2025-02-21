const requisicao = require('readline-sync'); //comando necessario para simular um input em js

class Reserva {
    constructor(reserva_id, cliente_id, status, check_in, check_out) {
        this.reserva_id = reserva_id;
        this.cliente_id = cliente_id;
        this.status = status;
        this.check_in = check_in;
        this.check_out = check_out;
    }
}

class Funcionario {
    constructor(func_id, nome_usuario, cpf, email, senha) {
        this.func_id = func_id;
        this.nome_usuario = nome_usuario;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
    }
}

class Cliente {
    constructor(cliente_id, nome, data_nascimento, cpf, email, senha) {
        this.cliente_id = cliente_id;
        this.nome = nome;
        this.data_nascimento = data_nascimento;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
    }
}

class Quartos {
    constructor(quantidade_camas, preco_noite, nome, descricao) {
        this.quantidade_camas = quantidade_camas;
        this.preco_noite = preco_noite;
        this.nome = nome;
        this.descricao = descricao;
    }
}

class Sistema {
    constructor(){

    }
    iniciar_sistema(){ //metodo para inicializacao do sistema
        while (true){
            console.log("\n-------------------------- Bem vindo ao Hotel F-Luxo --------------------------\n\nO que deseja fazer?\n")
            console.log("1 - Fazer Login\n2 - Fazer Cadastro\n3 - Sair do Programa\n")
            var escolha = requisicao.question("Selecione uma das opcoes acima: ")

            switch(escolha){
                case "1":
                    console.log("entrou no fazer login")
                    break
        
                case "2":
                    console.log("entrou no cadastro")
                    break
        

                case "3":
                    return console.log("\nSaiu do programa com exito.\n")//encerra o loop e termina o sistema
                    
                default:
                    console.log("\nPor favor, digite uma opcao valida.");//ate o usuario inserir uma opcao valida o loop eh repetido
                    break
            }
        }
    }
}

var sistema = new Sistema();

sistema.iniciar_sistema();