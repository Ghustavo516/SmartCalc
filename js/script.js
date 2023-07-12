//Gustavo Rodrigues (2023)

//Verificar a existencia dos operadores para serem executados primeiro
//Caso existente, encontrar a posição desse operador
//Encontrar o numero anterior e depois
//executar o calculo e armazenar
//extrair o texto da expressão matematica e preparar la para ser alterada
//substitui aquele parte da operação que tinha os operadores e substitui com o valor resultado da operação.
//retorna a expressão para continuar o loop.

var calculoConcluido = false;
function init(){
    mathExpression = document.querySelector("#calculatorValue").textContent;
    mathExpression = mathExpression

    //Adicionar a funcionalidade de verificar quando a operação finalizou
    mostraExpressãoResolucao(mathExpression);
    console.log(mathExpression);

    if(mathExpression.includes('((')){
        //Substitui os dois (( para [(, de modo para o algoritimo entender a operação.
        mathExpressionDoubleParenteses = mathExpression.replace("((", "[(");
        mathExpressionDoubleParenteses = mathExpressionDoubleParenteses.replace("))", ")]");
        mostraExpressãoResolucao(mathExpressionDoubleParenteses);
        console.log(mathExpressionDoubleParenteses); //Exibe equação alterada

        //Inicia o procedimento para solver a operação com a expressão extraida dentro do [ ]
        var concluido = false;
        while(concluido == false){
            //Extrai a expresssão dentro dos [ ]
            var posicoesElementosDuplicados = encontraPosicaoElementos(mathExpressionDoubleParenteses, '[');
            var expressao = encontraExpressaoAritmetica(posicoesElementosDuplicados.posicaoInicial, posicoesElementosDuplicados.posicaoFinal, mathExpressionDoubleParenteses);

            //Verifica a existencia de (, para dar prioridade no calculo.
            if(expressao.includes('(')){
                var posicoesElementos = encontraPosicaoElementos(expressao, '(');
                var expressaoAritmetica = encontraExpressaoAritmetica(posicoesElementos.posicaoInicial, posicoesElementos.posicaoFinal, expressao);    
                novaExpressao = interpretadorCalculo(expressaoAritmetica, expressao, true);
            }else{
                expressaoAritmetica = expressao;
                novaExpressao = interpretadorCalculo(expressaoAritmetica, expressao,  false);
            }

            //formata a expressão para calculos futuros
            verificadorDeConclusao = novaExpressao.split(' ');
            if(verificadorDeConclusao.length > 2){
                //Altera a expressão com os [ ], com a ideia de mostrar o processo de resolução.
                mathExpressionDoubleParenteses = mathExpressionDoubleParenteses.replace(expressao, novaExpressao);
            }    
            else{
                //Caso seja < 3 então ira tirar os parenteses pelo valor ja finalizado
                var posicoesElementosDuplicados = encontraPosicaoElementos(mathExpressionDoubleParenteses, '[');
                var expressao = ''
                for(var a = posicoesElementosDuplicados.posicaoInicial; a <= posicoesElementosDuplicados.posicaoFinal; a++){
                    expressao += mathExpressionDoubleParenteses[a];
                }
                //Substitui os [] apos ter efetuado o calculo, colocando o resultado obtido dentro dos []
                mathExpressionDoubleParenteses = mathExpressionDoubleParenteses.replace(expressao, novaExpressao);
                concluido = true;
            }
            mostraExpressãoResolucao(mathExpressionDoubleParenteses);
            console.log(mathExpressionDoubleParenteses);
        }
        mathExpression = mathExpressionDoubleParenteses;
    }

    while(calculoConcluido == false){
        //Caso existir o ( ), então irá calcular obedencendo as regras da matematica.
        if(mathExpression.includes('(')){
            var posicoesElementos = encontraPosicaoElementos(mathExpression, '(');
            var expressaoAritmetica = encontraExpressaoAritmetica(posicoesElementos.posicaoInicial, posicoesElementos.posicaoFinal, mathExpression);    
            mathExpression = interpretadorCalculo(expressaoAritmetica, mathExpression, true);
        }else{
            expressaoAritmetica = mathExpression;
            mathExpression = interpretadorCalculo(expressaoAritmetica, mathExpression,  false);         
        }
        //console.log(mathExpression)
        mostraExpressãoResolucao(mathExpression);
    }
    obterResposta();
}

function encontraPosicaoElementos(mathExpression, tipoOperacao){
    //Função responsavel por encontrar a posição do elementos ()
    if(tipoOperacao == '('){
        startReferenceElements = mathExpression.indexOf('(');
        endReferenceElements = mathExpression.indexOf(')');
    }

    if(tipoOperacao == '['){
        startReferenceElements = mathExpression.indexOf('[');
        endReferenceElements = mathExpression.indexOf(']');
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
    return expressaoAritmetica;// transforma a expressão aritmetica em array para facilitar a manipulação dos elementos
}

function interpretadorCalculo(expressaoAritmetica, mathExpression,  usoParenteses){   
    //Função responsavel por interpretar a expressão aritmetica e aplicar as regras da matematica para realizar a operação correta.
    var expressaoAritmetica = expressaoAritmetica.split(" ");
    
    //Caso na expressão tenha presente os dois operadores × e /, então a resolução sera da esquerda para direita.
    if(!(expressaoAritmetica.includes('×') && expressaoAritmetica.includes('/'))){
        //Caso contrario ira executar primeiramente um dos dois.
        if(expressaoAritmetica.includes('×') || expressaoAritmetica.includes('/')){
            if(expressaoAritmetica.includes('×')){
                var indexReference = expressaoAritmetica.indexOf('×');
                mathExpression = calculaExpressaoAritmetica(expressaoAritmetica, mathExpression, indexReference, '×', usoParenteses);
            }
            else if(expressaoAritmetica.includes('/')){
                var indexReference = expressaoAritmetica.indexOf('/');
                mathExpression = calculaExpressaoAritmetica(expressaoAritmetica, mathExpression, indexReference, '/', usoParenteses);
            }
        }else{
            //Caso os operadores (x e /) não estejam mais na expressão, então os demais operadores poderam ser executados.
            if(expressaoAritmetica.includes('+')){
                var indexReference = expressaoAritmetica.indexOf('+');
                mathExpression = calculaExpressaoAritmetica(expressaoAritmetica, mathExpression, indexReference, '+', usoParenteses); 
            }else if(expressaoAritmetica.includes('-')){
                var indexReference = expressaoAritmetica.indexOf('-');
                mathExpression = calculaExpressaoAritmetica(expressaoAritmetica, mathExpression, indexReference, '-', usoParenteses);
            }
        }

    }else{ 
        // Adicionar funcionalidade para realizar o calculo da esquerda para direita.
        for(var indice = 0; indice <= expressaoAritmetica.length; indice++){
            if(expressaoAritmetica[indice] == '+'){
                mathExpression = calculaExpressaoAritmetica(expressaoAritmetica, mathExpression, indice, '+', usoParenteses)
            }
            if(expressaoAritmetica[indice] == '-'){
                mathExpression = calculaExpressaoAritmetica(expressaoAritmetica, mathExpression, indice, '-', usoParenteses)
            }
            if(expressaoAritmetica[indice] == '×'){
                mathExpression = calculaExpressaoAritmetica(expressaoAritmetica, mathExpression, indice, '×', usoParenteses)
            } 
            if(expressaoAritmetica[indice] == '/'){
                mathExpression = calculaExpressaoAritmetica(expressaoAritmetica, mathExpression, indice, '/', usoParenteses)
            }
        }
    }
    return mathExpression  
}

function calculaExpressaoAritmetica(expressaoAritmetica, mathExpression, indice, operador, usoParenteses){
    //Função responsavel por calcular a expressão aritmemtica
    primeiroElemento = converteNumeros(expressaoAritmetica[(indice - 1)]);
    segundoElemento = converteNumeros(expressaoAritmetica[(indice + 1)]);
    
    if(operador == "+"){calculaExpressao = (primeiroElemento + segundoElemento);}
    if(operador == "-"){calculaExpressao = (primeiroElemento - segundoElemento);}
    if(operador == "×"){calculaExpressao = (primeiroElemento * segundoElemento);}
    if(operador == "/"){calculaExpressao = (primeiroElemento / segundoElemento);}

    //Verifica a quantidade de casas decimais para formatar o numero
    verificadorDecimal = calculaExpressao.toString();
    if(verificadorDecimal.includes(".")){
        var referenciaDecimal = verificadorDecimal.indexOf(".");
        var contadorCasasDecimais = verificadorDecimal.slice((referenciaDecimal + 1), verificadorDecimal.length);
        if(contadorCasasDecimais.length >= 4){
            calculaExpressao = calculaExpressao.toFixed(4);
        }  
    }

    if(usoParenteses == true){
        if(expressaoAritmetica.length > 3){
            //Caso a quantidade de elementos seja > 3, ira apenas alterar o valor ja calculado e manter o parenteses
            expressaoToReplace = primeiroElemento + " " + expressaoAritmetica[indice] + " " + segundoElemento;
            mathExpression = mathExpression.replace(expressaoToReplace, calculaExpressao);
        }else{
            //Caso seja < 3 então ira tirar os parenteses pelo valor ja finalizado
            var posicoesElementos = encontraPosicaoElementos(mathExpression, '(');
            var expressao = ''
            for(var i = posicoesElementos.posicaoInicial; i<= posicoesElementos.posicaoFinal; i++){
                expressao += mathExpression[i];
            }
            //Substitui os () apos ter efetuado o calculo, colocando o resultado obtido dentro dos ()
            mathExpression = mathExpression.replace(expressao, calculaExpressao); 
        }     
    }else{
        //Substitui os valores da expressão pelo resultado final.
        expressaoToReplace = primeiroElemento + " " + expressaoAritmetica[indice] + " " + segundoElemento;
        mathExpression = mathExpression.replace(expressaoToReplace, calculaExpressao);
    }
    return mathExpression;
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
