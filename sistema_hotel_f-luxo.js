const requisicao = require('readline-sync'); //comando necessario para simular um input em js

class Reserva {
    constructor(id, cliente_id, status, check_in, check_out) {
        this.id = id;
        this.cliente_id = cliente_id;
        this.status = status;
        this.check_in = check_in;
        this.check_out = check_out;
    }
}

class Funcionario {
    constructor(id, nome_usuario, cpf, email, senha) {
        this.id = id;
        this.nome_usuario = nome_usuario;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
    }
}

class Cliente {
    constructor(id, nome, data_nascimento, cpf, email, senha) {
        this.id = id;
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
    constructor()
}
