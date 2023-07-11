
function botãoResultado(){
    //Recebe o evento do usuário de clicar no botão resultado
    buttonResult = document.querySelector('#resultExpression');
    buttonResult = addEventListener('click', function(){
    mathExpression = this.document.querySelector("#mathExpressionValue").textContent;
    console.log(mathExpression);
    realizaProcedimentosDeCalculo(mathExpression);
    })
}

function realizaProcedimentosDeCalculo(mathExpression){
    //Procura os sinais de operação dentro da expressão e com base nisso atribui a regra de operação que deve executar
    mathExpression = mathExpression
    for(var i = 0; i< 5; i++){
        if(mathExpression.includes('(')){
            var posicoesElementos = encontraPosicaoElementos(mathExpression, '(');
            var expressaoAritmetica = encontraExpressaoAritmetica(posicoesElementos.posicaoInicial, posicoesElementos.posicaoFinal, mathExpression);    
            mathExpression = operacaoAritmetica(expressaoAritmetica, true);
        }else{
            mathExpression = operacaoAritmetica(mathExpression.split(' '), false)
        }
        console.log(mathExpression);
    }
}

function encontraPosicaoElementos(mathExpression, tipoOperacao){
    //Função responsavel por encotrar a posição do elementos () [] {}
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
        if(expressaoAritmetica[i] == '*'){
            mathExpression = calculaExpressaoAritmetica(expressaoAritmetica, parenteses,  i, '*')
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
    else if(operador == "-"){calculaExpressao = (primeiroElemento - segundoElemento);}
    else if(operador == "*"){calculaExpressao = (primeiroElemento * segundoElemento);}
    else calculaExpressao = (primeiroElemento / segundoElemento);

    if(parenteses == true){
        var posicoesElementos = encontraPosicaoElementos(mathExpression, '(');
        var expressao = ''
        for(var i = posicoesElementos.posicaoInicial; i<= posicoesElementos.posicaoFinal; i++){
            expressao += mathExpression[i];
        }
        mathExpression = mathExpression.replace(expressao, calculaExpressao); //Substitui os () apos ter efetuado o calculo, colocando o resultado obtido dentro dos ()
    
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

botãoResultado();