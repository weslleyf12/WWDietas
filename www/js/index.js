window.fn = {};
let bannersIntervalo
let bannersTimeout  

document.addEventListener('init', function(event) {
  if (event.target.matches('#page1')) {
    const filho = '[login]'
    const pai = 'body'
    verticalAlignMiddle(filho, pai)
      firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        fn.load('page2.html')
      }

    })
  }
}, false);

function verticalAlignMiddle(divFilho, divPai) {
  const alturaDoPai = document.querySelector(divPai).clientHeight
  const alturaDoFilho = document.querySelector(divFilho).clientHeight
  console.log(alturaDoPai, alturaDoFilho)
  const topMargin =  (alturaDoPai-alturaDoFilho)/2
  const percentageOfTopMargin = topMargin * (96/100)
  document.querySelector(divFilho).setAttribute('style', 'margin-top:'+percentageOfTopMargin+'px !important')
}

document.addEventListener('init', function(event) {
  if (event.target.matches('#page2')) {
    bannersIntervalo = window.setInterval(changeBanner, 6000)
    document.querySelector('ons-carousel').addEventListener('postchange', function() {clearSpan(); addWhiteCurrent()}
  )}
}, false);

document.addEventListener('init', function(event) {
  if (event.target.matches('#edit')) {
    showEditExerc(1) //Para iniciar com a página de editar exercicios. Se retirar essa linha, é preciso antes clicar em Exerc. para funcionar o botão 'Ok'
    let altura = getHighOf('backBtnEdit')
    document.getElementById('backBtnEdit').setAttribute('style', `color: blue; left: 98%; margin: ${((altura*35.7)/100)}px 2vw !important`)
    document.getElementById('headerEdit').setAttribute('style', `margin: ${((altura*26)/100)}px 2vw !important`)
  }
}, false);

document.addEventListener('init', function(event) {
  if (event.target.matches('#dietas')) {
    let altura = getHighOf('backBtnDieta')
    document.getElementById('backBtnDieta').setAttribute('style', `color: blue; left: 98%; margin: ${((altura*35.7)/100)}px 2vw !important`)
    document.getElementById('headerDieta').setAttribute('style', `margin: ${((altura*26)/100)}px 2vw !important`)
  }
}, false);
//bloco de código que adiciona as variáveis à tela de exercícios

document.addEventListener('swipeleft', function(event) {
  increaseIndice()
  if (event.target.matches('#tabela')) {
    let userEmail = firebase.auth().currentUser.email;
    addThings(userEmail, indice, true)
  } 
});

function arrumaArray() {
  let newArray = array.sort()
  newArray = array.filter((este, i) => array.indexOf(este) === i);
  return newArray
}

document.addEventListener('swiperight', function(event) {
  decreaseIndice()
  if (event.target.matches('#tabela')) {
    let userEmail = firebase.auth().currentUser.email;
    addThings(userEmail, indice, true)
  }
});

function decreaseIndice() {
  return indice = indice - 1
}

function increaseIndice() {
  return indice = indice+1
}

let array = new Array()
let indice = 0;

document.addEventListener('init', function(event) {
  if (event.target.matches('#exercicios')) {
    let altura = getHighOf('backBtnExerc')
    document.getElementById('backBtnExerc').setAttribute('style', `color: blue; left: 98%; margin: ${((altura*35.7)/100)}px 2vw !important`)
    document.getElementById('headerExerc').setAttribute('style', `margin: ${((altura*26)/100)}px 2vw !important`)
    let userEmail = firebase.auth().currentUser.email;
    db.collection("user-emails").where("userEmail", "==", userEmail).where("observacoes", "==", "nao").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        return array.push(doc.data().name)
      })
      addThings(userEmail, 0, false)
    });
  }
}, false);

const addThings = (email, i, boolean) => {
  zerar()
  firstTimer()
  let newArray = arrumaArray()
  let exercicio1 = new Array()
  let exercicio2 = new Array()
  let exercicio3 = new Array()
  db.collection("user-emails").where("userEmail", "==", email).where("name", "==", newArray[i]).where("observacoes", "==", "nao").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      document.getElementById('nomeDoTreino').textContent = 'Treino ' +newArray[i]
      exercicio1.push(doc.data().newExerc1)
      exercicio2.push(doc.data().newExerc2)
      exercicio3.push(doc.data().newExerc3)
    })
   if (boolean) {
      addExercicio(exercicio1, exercicio2, exercicio3, true)
    } else {addExercicio(exercicio1, exercicio2, exercicio3)}
  });
  db.collection("user-emails").where("userEmail", "==", email).where("name", "==", newArray[i]).where("observacoes", "==", "sim").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      document.getElementById('intervaloExerc').textContent = 'Intervalo entre treinos e exercícios: ' + doc.data().intervalo
      if (boolean) {
        addObs2(doc.data().obs1, doc.data().obs2, doc.data().obs3, doc.data().obs4, true)
      } else {
        addObs2(doc.data().obs1, doc.data().obs2, doc.data().obs3, doc.data().obs4)
      }
    })  
  });
}

//aqui termina o bloco

window.fn.open = function() {
  let menu = document.getElementById('menu');
  menu.open();
};

function showModal() {
  let modal = document.querySelector('ons-modal');
  modal.show();
}

function hideModal() {
  let modal = document.querySelector('ons-modal');
  modal.hide();
}

function promptPasswdReset(mensagem) {
  ons.notification.prompt(mensagem)
    .then(function(input) {
      let message = input ? input : 'None';
      sendPasswordReset(message)
    });
}

window.fn.load = function(page) {
  let content = document.getElementById('content');
  let menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};

let showToast = function(message) {
  ons.notification.toast(message, {
    timeout: 2000
  });
};

function showTip() {
  document.querySelector('[overlayBackground]').style.opacity = '0.5'
  document.querySelector('[overlay]').style.display = 'block'
}

function closeTip() {
 document.querySelector('[overlayBackground]').style.opacity = '1'
  document.querySelector('[overlay]').style.display = 'none'
}

let back = 0;

const calendar = () => {
  fn.load('calendar.html')
}

const exercicios = () => {
  fn.load('exercicios.html')
}

const dietas = () => {
  fn.load('dietas.html')
}

const showPopover = function(target) {
  document
    .getElementById('popover')
    .show(target);
};

const hidePopover = function() {
  document
    .getElementById('popover')
    .hide();
};

//dietas

function escreverMensagem(mensagem) {
  document.getElementById('popoverMessage').innerHTML = mensagem
}

function rmHr() {
  document.getElementById("segunda-1").remove();
}

function addHr() {
  document.getElementById("segunda-2").textContent = "aloha"
}
//fim dietas
function stopBannerTransition() {
  window.clearTimeout(bannersTimeout)
  window.clearInterval(bannersIntervalo)
  bannersTimeout = window.setTimeout(changeBanner, 6000)
}

function editSelects(event) {
  document.getElementById('choose-sel').removeAttribute('modifier');
}

function cadastrar() {
  let nomeCadastro = document.getElementById('nome-cadastro').value;
  let senhaCadastro = document.getElementById('senha-cadastro').value;
  let emailCadastro = document.getElementById('email-cadastro').value;

  if (emailCadastro.length < 4) {
    showToast('Por favor, insira um email.');
    return;
  }
  if (senhaCadastro.length < 4) {
    showToast('Por favor, insira uma senha.');
    return;
  }
  showModal()
  firebase.auth().createUserWithEmailAndPassword(emailCadastro, senhaCadastro)
  .then(function(){
    escreverMensagem('Olá, '+nomeCadastro+'! Estamos felizes em te ver por aqui!')
    showPopover(document.getElementById('email-cadastro'))
    hideModal()
    fn.load('page2.html')
    })
  .catch(function(error) {
    let errorCode = error.code;
    let errorMessage = error.message;

    if (errorCode === 'auth/weak-password') {
      hideModal()
      showToast('Senha muito fraca');
    } else if (errorCode === 'auth/invalid-email') {
      hideModal()
      showToast('Insira um email válido.')
    } else if (errorCode === 'auth/email-already-in-use') {
      hideModal()
      showToast('Esse email já está em uso.')
    } else {
      hideModal()
      showToast(errorMessage);
    }
  });
}

const entrar = () => {
  let emailLogin = document.getElementById('email-login').value
  let senhaLogin = document.getElementById('senha-login').value

  if (emailLogin.length < 4) {
    showToast('Por favor, insira um email.');
    return;
  }
  if (senhaLogin.length < 4) {
    showToast('Por favor, insira uma senha.');
    return;
  }

  if (emailLogin === 'admin' && senhaLogin === 'h2md2515') {
    fn.load('edit.html');
    return
  }

  showModal()
  firebase.auth().signInWithEmailAndPassword(emailLogin, senhaLogin).catch(function(error) {
    let errorCode = error.code;
    let errorMessage = error.message;
    
    if (errorCode === 'auth/wrong-password') {
      hideModal()
      showToast('E-mail ou senha inválidos.');
    } else if (errorCode === 'auth/invalid-email') {
      hideModal()
      showToast('Insira um email válido.')
    } else if (errorCode === 'auth/too-many-requests') {
      hideModal()
      showToast('Aguarde um momento para tentar novamente!')
    } else if(errorCode === 'auth/user-not-found') {
      hideModal()
      showToast('Usuário inexistente.')
    } else {
      hideModal()
      showToast(errorMessage);
    }
  });

  firebase.auth().onAuthStateChanged(function(user) {
    //ao fazer login, o modal é fechado e o usuário é encaminhado à segunda página.
    if (user) {
      hideModal()
      fn.load('page2.html')
      setInterval(changeBanner, 11000)
    }
  });
}

const signOut = () => {
  firebase.auth().signOut().then(function() {
    fn.load('page1.html')
      // Sign-out successful.
  }).catch(function(error) {
      showToast(error.code + error.message)
  })
}

function sendPasswordReset(emailPasswdReset) {
  firebase.auth().sendPasswordResetEmail(emailPasswdReset).then(function() {
    escreverMensagem('Email de recuperação enviado com sucesso!')
    showPopover(document.getElementById('email-login'))
  }).catch(function(error) {
    let errorCode = error.code;
    let errorMessage = error.message;
    
    if (errorCode == 'auth/invalid-email') {
      showToast('Email inválido.');
    } else if (errorCode == 'auth/user-not-found') {
      showToast('Usuário não encontrado.')
    } else {
      showToast(errorMessage)
    }
  });
}

//edit.page ons-radio checked

function showEdit() {
  document.querySelector('ons-radio[input-id="radio-2"]').checked = false;
  document.getElementById('editPage').style.display = "block";
  document.getElementById('regPage').style.display = "none";
}

function showRegister() {
  document.querySelector('ons-radio[input-id="radio-1"]').checked = false;
  document.getElementById('regPage').style.display = "block";
  document.getElementById('editPage').style.display = "none";
}

let prev = function() {
  clearSpan()
  let carousel = document.getElementById('carousel');
  carousel.prev();

  addWhiteCurrent()
};

let next = function() {
  clearSpan()
  let carousel = document.getElementById('carousel');
  carousel.next();

  addWhiteCurrent()
};

let last = function() {
  clearSpan()
  let carousel = document.getElementById('carousel');
  carousel.last();
  addWhiteCurrent()
};

let first = function() {
  clearSpan()
  let carousel = document.getElementById('carousel');
  carousel.first();
  addWhiteCurrent()
};

let changeBanner = function() {
  clearSpan()
  let carousel = document.getElementById('carousel');
  const atual = carousel.getActiveIndex()
  const quantidade = document.querySelector('ons-carousel').itemCount
  atual == quantidade-1 ? carousel.setActiveIndex(0) : carousel.next()
}

let clearSpan = function() {
  let atual = carousel.getActiveIndex()
  document.querySelector('.firstSpan').classList.remove('w3-white')
  document.querySelector('.secndSpan').classList.remove('w3-white')
  document.querySelector('.thirdSpan').classList.remove('w3-white')
}

let getByIndex = function(index) {
  clearSpan()
  let carousel = document.getElementById('carousel');
  carousel.setActiveIndex(index);

  addWhiteCurrent()
}

let addWhiteCurrent = function() {
  let atual = carousel.getActiveIndex()
  if (atual == 2) {
    document.querySelector('.firstSpan').classList.add('w3-white')
  } else if (atual == 1) {
    document.querySelector('.secndSpan').classList.add('w3-white')
  } else if (atual == 0) {
    document.querySelector('.thirdSpan').classList.add('w3-white')
  }
}

let id = 0;
let firstTime = true
function zerar() {
  return id = 0;
}
function secondTime() {
  return firstTime = false
}
function firstTimer() {
  return firstTime = true
}

function addExercicio(exercicio, Sxr, tecAvan, boolean) {

  let tableData = document.getElementById("tabelaExercicios"); 

  let table = `
  <table class="table">
    <thead class="thead-light">
      <tr>
        <th scope="col">#</th>
        <th scope="col">Exercícios</th>
        <th scope="col">SxR</th>
        <th scope="col">Técnicas Avançadas</th>
      </tr>
    </thead>
  <tbody class="centered">
  `;

  for (let i = 0; i <= exercicio.length-1; i++) {
    table = table +
    `<tr>
      <th scope="row">${i}</th>
      <td>${exercicio[i]}</td>
      <td>${Sxr[i]}</td>
      <td>${tecAvan[i]}</td>
    </tr>`
  }

  table = table +
  `</tbody>
    </table>`
  ;

  tableData.innerHTML = table;
}

function addObs2(observ1, observ2, observ3, observ4, boolean) {
  let ulObs1 = document.getElementById('obs-pre')
  let ulObs2 = document.getElementById('obs-aero')
  let ulObs3 = document.getElementById('obs-treino')
  let ulObs4 = document.getElementById('obs-geral')

  if (boolean) {
    ulObs1.removeChild(document.getElementById('liObs10'))
    ulObs2.removeChild(document.getElementById('liObs20'))
    ulObs3.removeChild(document.getElementById('liObs30'))
    ulObs4.removeChild(document.getElementById('liObs40'))
  }

  let liObs1 = document.createElement('h5')
  let liObs2 = document.createElement('h5')
  let liObs3 = document.createElement('h5')
  let liObs4 = document.createElement('h5')


  liObs1.setAttribute('style', 'margin: 0px 2px; font-weight: bolder')
  liObs2.setAttribute('style', 'margin: 0px 2px; font-weight: bolder')
  liObs3.setAttribute('style', 'margin: 0px 2px; font-weight: bolder')
  liObs4.setAttribute('style', 'margin: 0px 2px; font-weight: bolder')

  liObs1.setAttribute('id', 'liObs10')
  liObs2.setAttribute('id', 'liObs20')
  liObs3.setAttribute('id', 'liObs30')
  liObs4.setAttribute('id', 'liObs40')

  liObs1.appendChild(document.createTextNode(observ1))
  liObs2.appendChild(document.createTextNode(observ2))
  liObs3.appendChild(document.createTextNode(observ3))
  liObs4.appendChild(document.createTextNode(observ4))
      
  ulObs1.appendChild(liObs1)
  ulObs2.appendChild(liObs2)
  ulObs3.appendChild(liObs3)
  ulObs4.appendChild(liObs4)
}

function addExerc() {
  showToast('Alterações encaminhadas')

  let emailInputed = document.getElementById('emailInput').value
  let treinoInputed = document.getElementById('treinoInput').value

  let exerc = document.getElementById('exercInput').value
  let inst = document.getElementById('instExerc').value

  attDados(exerc, emailInputed, inst, treinoInputed)
}

function addObs() {
  showToast('Alterações encaminhadas')

  let intervaloInputed = document.getElementById('interExerc').value
  let obsExercicio = document.getElementById('observacoes').value
  let emailInputed = document.getElementById('emailInput2').value
  let treinoInputed = document.getElementById('treinoInput2').value

  let obsSeparadas = obsExercicio.split(',')
  let obs1 = obsSeparadas[0]
  let obs2 = obsSeparadas[1]
  let obs3 = obsSeparadas[2]
  let obs4 = obsSeparadas[3]

   db.collection('user-emails').doc(emailInputed+"["+treinoInputed+"]").set ({ // cria uma colecao com o email do usuario, ou altera essa colecao
      userEmail: emailInputed,
      obs1: obs1,
      obs2: obs2,
      obs3: obs3,
      obs4: obs4,
      intervalo: intervaloInputed,
      name: treinoInputed,
      observacoes: 'sim'
  })
}

function attDados(newExerc, email, instancia, treinoInpt) {

  let exerciciosSeparados = newExerc.split(',')
  let exercicio1 = exerciciosSeparados[0]
  let exercicio2 = exerciciosSeparados[1]
  let exercicio3 = exerciciosSeparados[2]

  db.collection('user-emails').doc(email+"["+treinoInpt+"]"+"["+instancia+"]").set ({ // cria uma colecao com o email do usuario, ou altera essa colecao
      userEmail: email,
      newExerc1: exercicio1,
      newExerc2: exercicio2,
      newExerc3: exercicio3,
      name: treinoInpt,
      instancia: instancia,
      observacoes: 'nao'
  })
}

const getFontSize = (elementId) => { //nao usado
  let element = document.getElementById(elementId)
  let fontSize = window.getComputedStyle(element).fontSize
  return parseFloat(fontSize)
}

const getHighOf = (elementId) => {
  let element = document.getElementById(elementId)
  let hight = window.getComputedStyle(element).height
  return parseFloat(hight)
}

const showEditExerc = (value) => {
  if (value == 1) {
    document.getElementById('editExerc').style.display = 'block'
    document.getElementById('obsExerc').style.display = 'none'
     document.getElementById('editDietas').style.display = 'none'
  }
  if (value == 2) {
    document.getElementById('editExerc').style.display = 'none'
    document.getElementById('obsExerc').style.display = 'block'
     document.getElementById('editDietas').style.display = 'none'
  }
  if (value == 3) {
    document.getElementById('editExerc').style.display = 'none'
    document.getElementById('obsExerc').style.display = 'none'
     document.getElementById('editDietas').style.display = 'block'
  }
}