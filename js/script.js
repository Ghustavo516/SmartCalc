var resolucaoExpressao = [];
var calculoConcluido = false;

function realizaProcedimentosDeCalculo(){
    mathExpression = this.document.querySelector("#calculatorValue").textContent;
    mostraExpressãoResolucao(mathExpression); //Adiciona na interface o processo de operação

    //Procura os sinais de operação dentro da expressão e com base nisso atribui a regra de operação que deve executar
    mathExpression = mathExpression
    while(calculoConcluido == false){
        if(mathExpression.includes('(')){
            var posicoesElementos = encontraPosicaoElementos(mathExpression, '(');
            var expressaoAritmetica = encontraExpressaoAritmetica(posicoesElementos.posicaoInicial, posicoesElementos.posicaoFinal, mathExpression);    
            mathExpression = operacaoAritmetica(expressaoAritmetica, true);
        }else{
            mathExpression = operacaoAritmetica(mathExpression.split(' '), false)
        }
       
        console.log(mathExpression);
        mostraExpressãoResolucao(mathExpression);
        obterResposta(); //Função resposponsavel por mostrar o resultado da operação
    }
}

function encontraPosicaoElementos(mathExpression, tipoOperacao){
    //Função responsavel por encontrar a posição do elementos ()
    if(tipoOperacao == '('){
        startReferenceElements = mathExpression.indexOf('(');
        endReferenceElements = mathExpression.indexOf(')');
    }
    return {
        posicaoInicial: startReferenceElements, 
        posicaoFinal: endReferenceElements
    }
}

function encontraExpressaoAritmetica(posicaoInicial, posicaoFinal, mathExpression){
    //Função responsavel por encontrar a expressão aritmetica
    var expressaoAritmetica = "";
    for(var i = (posicaoInicial + 1); i<= (posicaoFinal - 1); i++){
        expressaoAritmetica += mathExpression[i];
    }
    return expressaoAritmetica.split(' ');// transforma a expressão aritmetica em array para facilitar a manipulação dos elementos
}

function operacaoAritmetica(expressaoAritmetica, parenteses){
    //Função responsavel por guiar qual operador aritmetico deve ser executado
    for(var i = 0; i <= expressaoAritmetica.length; i++){
        if(expressaoAritmetica[i] == '+'){
            mathExpression = calculaExpressaoAritmetica(expressaoAritmetica, parenteses,  i, '+')
        }
        if(expressaoAritmetica[i] == '-'){
            mathExpression = calculaExpressaoAritmetica(expressaoAritmetica, parenteses,  i, '-')
        }
        if(expressaoAritmetica[i] == '×'){
            mathExpression = calculaExpressaoAritmetica(expressaoAritmetica, parenteses,  i, '×')
        } 
        if(expressaoAritmetica[i] == '/'){
            mathExpression = calculaExpressaoAritmetica(expressaoAritmetica, parenteses,  i, '/')
        }
    }
    return mathExpression
}

function calculaExpressaoAritmetica(expressaoAritmetica, parenteses, indice, operador){
    //Função responsavel por calcular a expressão aritmemtica
    primeiroElemento = converteNumeros(expressaoAritmetica[(indice - 1)]);
    segundoElemento = converteNumeros(expressaoAritmetica[(indice + 1)]);

    if(operador == "+"){calculaExpressao = (primeiroElemento + segundoElemento);}
    if(operador == "-"){calculaExpressao = (primeiroElemento - segundoElemento);}
    if(operador == "×"){calculaExpressao = (primeiroElemento * segundoElemento);}
    if(operador == "/"){calculaExpressao = (primeiroElemento / segundoElemento);}
   
    expressaoAritmetica[(indice + 1)] = calculaExpressao.toString();
    
    if(parenteses == true){
        if((indice + 1) == (expressaoAritmetica.length - 1)){
            var posicoesElementos = encontraPosicaoElementos(mathExpression, '(');
            var expressao = ''
            for(var i = posicoesElementos.posicaoInicial; i<= posicoesElementos.posicaoFinal; i++){
                expressao += mathExpression[i];
            }
            mathExpression = mathExpression.replace(expressao, calculaExpressao); //Substitui os () apos ter efetuado o calculo, colocando o resultado obtido dentro dos ()
        }
    }else{
        expressaoToReplace = primeiroElemento + " " + expressaoAritmetica[indice] + " " + segundoElemento
        mathExpression = mathExpression.replace(expressaoToReplace, calculaExpressao);
    }
    return mathExpression
}

function converteNumeros(numero){
    //Função responsavel por verificar o tipo do numero se é int ou float e aplicar a devida conversão ao numero
    if(numero.includes('.')){
        numero = parseFloat(numero);
    }else{
        numero = parseInt(numero);
    }
    return numero
}

function mostraExpressãoResolucao(expressao){
    //Função responsavel por criar o elemento li e adicionar dentro da lista
    var novaExpressao = document.createElement("li");
    var resolucaoExpressao = document.querySelector("#mathExpressionValue");
    
    if(resolucaoExpressao.childNodes[resolucaoExpressao.childNodes.length - 1].textContent == resolucaoExpressao.childNodes[resolucaoExpressao.childNodes.length - 2].textContent){
        //caso operação matematica tenha finalizado, sera retornado concluido para parar o laço de repetição
        calculoConcluido = true; 
        const ultimoLi = document.querySelector('li:last-child');
        ultimoLi.remove();
    }else{ 
        //Adicionar elemento da li com conteudo a lista
        novaExpressao.textContent = expressao;
        var resolucao = document.querySelector("#mathExpressionValue");
        resolucao.appendChild(novaExpressao);
    }
}

function obterResposta(){
    //recebe a resposta de toda a expressão matematica e manipula para melhor exibir na interface
    var resolucaoExpressao = document.querySelector("#mathExpressionValue");
    var ultimoElemento = resolucaoExpressao.childNodes[resolucaoExpressao.childNodes.length - 1].textContent;

    ultimoElemento = converteNumeros(ultimoElemento);
    if(!Number.isInteger(ultimoElemento) && ultimoElemento.length >= 5){
        ultimoElemento = ultimoElemento.toFixed(3);
    }
    var resposta = document.querySelector("#calculatorValue");
    resposta.textContent = ultimoElemento;
}

var conta = '';
function inserirExpressao(elemento){
    //função responsavel por adicionar os valores quando clicado na calculadora.
    expressaoUsuario = document.querySelector("#calculatorValue");
    if(elemento == "-" || elemento == "+" || elemento == "×" || elemento == "/"){
        elemento = " " + elemento + " ";
    }
    if(elemento == "⌫"){
        expressaoUsuario.textContent = expressaoUsuario.textContent.replace(expressaoUsuario.textContent[expressaoUsuario.textContent.length - 1], "");
    }else{
        expressaoUsuario.textContent += elemento;
    }
}