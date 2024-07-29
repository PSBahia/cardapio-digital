
var cartItems = [];
var cartTotal = 0;
var excluir;
var valor1;
var valor2;

function mostrarAlerta(titulo, texto,) {
    Swal.fire({
        title: titulo,
        text: texto,
        icon: 'info', // Ícone do alerta (success, error, warning, info, question)
        confirmButtonText: 'Ok'
    });
}

var aviso = document.getElementById('aviso');
function criarAviso() {
  aviso.classList.remove('show');
  aviso.classList.add('mostrar');
}

function removerAviso(){
  aviso.classList.remove('mostrar');
  aviso.classList.add('show');
}


//RENDERIZAR PRODUTOS
//============================================================
function renderizarProdutos() {
  const produtosContainer = document.getElementById('products');
  produtosContainer.innerHTML = '';

  produtos.forEach(produto => {
    const produtoItem = document.createElement('li');

    let produtoHTML = `
      <h2>${produto.nome}</h2>
      <p>${produto.descricao}</p>
      <div class="adicionar">
        <p>Preço: R$ ${produto.preco.toFixed(2)}</p>
        <button id="addCar" class="addCar" onclick="addToCart('${produto.nome}', ${produto.preco})">
          <ion-icon name="add-circle-outline"></ion-icon>
        </button>
      </div>
    `;

    if (produto.nome === 'Meia/Meia') {
      produtoHTML = `
        <h2>${produto.nome}</h2>
        <p>${produto.descricao}</p>
        <select id="meia1">
          <option value="0">Selecione o sabor</option>
          ${produto.sabores.map(sabor => `<option value="${sabor.nome}" data-preco="${sabor.preco}">${sabor.nome}</option>`).join('')}
        </select>
        <select id="meia2">
          <option value="0">Selecione o sabor</option>
          ${produto.sabores.map(sabor => `<option value="${sabor.nome}" data-preco="${sabor.preco}">${sabor.nome}</option>`).join('')}
        </select>
        <div class="adicionar">
          <p>Confira o preço no Carrinho</p>
          <button id="addCar" class="addCar" onclick="meiaMeia()">
            <ion-icon name="add-circle-outline"></ion-icon>
          </button>
        </div>
      `;
    }

    produtoItem.innerHTML = produtoHTML;
    produtosContainer.appendChild(produtoItem);
  });
}

// Chama a função para renderizar os produtos na inicialização da página
document.addEventListener('DOMContentLoaded', renderizarProdutos);

//============================================================

function meiaMeia(){

  const meia1Element = document.getElementById('meia1');
  const meia2Element = document.getElementById('meia2');

  const sabor1 = meia1Element.value;
  const sabor2 = meia2Element.value;
  
  const preco1 = parseFloat(meia1Element.options[meia1Element.selectedIndex].getAttribute('data-preco'));
  const preco2 = parseFloat(meia2Element.options[meia2Element.selectedIndex].getAttribute('data-preco'));

  if (sabor1 !== '0' && sabor2 !== '0') {
    const precoMeiaMeia = (preco1 + preco2) / 2;
    addToCart(`Meia/Meia (${sabor1} / ${sabor2})`, precoMeiaMeia);
    if(sabor1 == sabor2){
      mostrarAlerta('Sabor Repetido', 'Os sabores não podem ser iguais')
      return
    }

    
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Selecione dois sabores para a pizza Meia/Meia'
    });
  }
}

//pegar Quantidade ************************************************


  function mostrarAlertaComInput() {
    return new Promise((resolve, reject) => {
      Swal.fire({
        title: "Digite a quantidade e selecione a borda recheada:",
        html: `
          <input type="number" id="quantity" class="swal2-input" min="1" placeholder="Quantidade">
          <div style="width: 100%; display: flex; align-items: center; justify-content: center; margin-top: 10px;">
          <input style="width: 30px; margin: 0.5rem 1%;" type="checkbox" id="bordaRecheada">
          <label for="bordaRecheada">
             Borda Recheada(+R$ 5,00)
          </label>
          <div/>
        `,
        showCancelButton: true,
        confirmButtonText: "Ok",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
          const quantidade = document.getElementById('quantity').value;
          const bordaRecheada = document.getElementById('bordaRecheada').checked;
          if (!quantidade || quantidade <= 0) {
            Swal.showValidationMessage("Por favor, insira uma quantidade válida.");
            return false;
          }
          return { quantidade: parseInt(quantidade), bordaRecheada: bordaRecheada };
        }
      }).then((result) => {
        if (result.isConfirmed) {
          resolve(result.value);
          showOrderConfirmation()
        } else {
          reject("Usuário cancelou.");
        }
      });
    });
  }


// ======================================================

var meuBotao = document.getElementById('addCar');


function addToCart(productName, price) {
  mostrarAlertaComInput()
    .then((data) => {
      const { quantidade, bordaRecheada } = data;
      
      // Se borda recheada estiver selecionada, adicione o preço adicional
      let finalPrice = price;
      if (bordaRecheada) {
        finalPrice += 5.00;
      }
      
      // Calcular o preço total com base na quantidade
      //finalPrice = finalPrice * quantidade;
      
      // Adicionar o item ao carrinho com a quantidade e preço atualizado
      cartItems.push({ name: productName, price: finalPrice, quantidade: quantidade, bordaRecheada: bordaRecheada });
      cartTotal = cartTotal + finalPrice * quantidade;
      // Atualizar o carrinho (substitua pelo seu código de atualização do carrinho)
      updateCart();
    })
    .catch((error) => {
      console.error(error);
    });
}


function removeFromCart(index) {
  var removedItem = cartItems.splice(index, 1)[0];
  cartTotal -= removedItem.price * removedItem.quantidade;

  updateCart();
}

function updateCart() {

  var cartItemsElement = document.getElementById('cart-items');
  var cartTotalElement = document.getElementById('cart-total');


  // Limpar o carrinho antes de atualizar
  cartItemsElement.innerHTML = '';

  // Adicionar itens ao carrinho
  cartItems.forEach(function(item) {
    
    var total = item.quantidade * item.price.toFixed(2)
    var listItem = document.createElement('li');
    var excluir = document.createElement('button');
    var imgExcluir = document.createElement('ion-icon');

    borda  = item.bordaRecheada ? " - Borda Recheada" : ""

    excluir.id = 'excluir';
    excluir.classList.add('excluir')
    listItem.textContent = item.quantidade + ' - ' + item.name + borda + ' - R$ ' + total;
    excluir.textContent = 'Excluir';

    imgExcluir.name = "trash"
    imgExcluir.id = 'lixeira'
    cartItemsElement.appendChild(listItem);
    //cartItemsElement.appendChild(excluir);
    cartItemsElement.appendChild(imgExcluir);

    // Adicionar evento de clique ao botão de exclusão
    imgExcluir.onclick = function() {
      removeFromCart(cartItems.indexOf(item));
    };

  });
  // Atualizar o total do carrinho
  cartTotalElement.textContent = cartTotal.toFixed(2);

}
//Enviar Pedido
function enviar() {
  
  // Obter a referência ao elemento <input> por ID
  var nome = document.getElementById('name');
  var mesa = document.getElementById('mesa');
  // Obter o valor do <input>
  var nomeValor = nome.value;
  var mesaValor = mesa.value;

  if(nomeValor == "" || mesaValor == "" ){
    mostrarAlerta('Finalizar Pedido', 'Preencha os campos nome e mesa')
    return
  }

  if (cartItems.length === 0){
    mostrarAlerta( 'Finalizar Pedido', 'Adicione ao menos um item ao carrinho')
    return
  }
  // Substitua o número abaixo pelo número de telefone desejado
  var numeroTelefone = '+5575999073162';

  // Obter os itens da lista
  var listaItens = document.getElementById('cart-items');
  var itens = [];

  for (var i = 0; i < listaItens.children.length; i++) {
    itens.push(listaItens.children[i].textContent);
  }

  // Criar a mensagem com os itens
  var mensagem = 'Nome: ' + nomeValor + '\nMesa: ' + mesaValor + '\nItens da lista:\n' + itens.join('\n') + '\nTotal: R$ ' + cartTotal.toFixed(2);

  // Codificar a mensagem para usar em um URL
  mensagem = encodeURIComponent(mensagem);

  // Criar o link para o WhatsApp
  var linkWhatsApp = 'https://wa.me/' + numeroTelefone + '?text=' + mensagem;

  // Abrir o link no navegador
  window.location.href = linkWhatsApp;

  updateCart()
  
}


//Alerta de item adicionado
function showOrderConfirmation() {
  var popup = document.getElementById('orderConfirmationPopup');
  popup.style.display = 'block';
  
  // Ocultar o pop-up após 3 segundos
  setTimeout(function() {
    popup.style.display = 'none';
  }, 3000);
}


