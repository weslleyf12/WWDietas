window.fn = {}
let bannersIntervalo
let bannersTimeout 
let carousel

document.addEventListener("backbutton", function() {e.preventDefault(); document.getElementById('navigator').popPage()}, false);

document.addEventListener('init', function(event) {
  if (event.target.matches('#page1')) {
    const bodyWidth = getSizeOf('body', 'width')
    if ( bodyWidth > 1024 ) {
      document.getElementById('navigator').pushPage('login.html')
    } else {document.querySelector('[pg1]').classList.remove('displayNone');document.querySelector('[pg1]').classList.add('displayBlock')}
  }
}, false);

document.addEventListener('init', function(event) {
  if (event.target.matches('#login')) {
      document.getElementById('senha-login').addEventListener('mouseup', function() {
        showHidePass(1)//show
      });
   

      firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        document.getElementById('navigator').pushPage('page2.html')
      }
    })
  }
}, false);

document.addEventListener('init', function(event) {
  if (event.target.matches('#page2')) {
    document.querySelectorAll('.page__content')[1].addEventListener('scroll', changesPages2)
    carousel = document.getElementById('carousel');
    bannersIntervalo = window.setInterval(changeBanner, 6000)
    document.querySelector('ons-carousel').addEventListener('postchange', function() {clearSpan(); addWhiteCurrent(); stopBannerTransition()}
  )}
}, false);

document.addEventListener('init', function(event) {
  if (event.target.matches('#edit')) {
    showEditExerc(1) //Para iniciar com a página de editar exercicios. Se retirar essa linha, é preciso antes clicar em Exerc. para funcionar o botão 'Ok'
  }
}, false);

document.addEventListener('swipeleft', function(event) {
  increaseIndice()
  if (event.target.matches('#tabela')) {
    let userEmail = firebase.auth().currentUser.email;
    const newArray = arrumaArray()
    indice = indice++
    if (indice >= newArray.length) {
      indice = indice - 1 //se o indice passar do valor total ele para de avancar
    }
    document.getElementById('choose-sel-treinos').selectedIndex = indice
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
    const newArray = arrumaArray()
    indice = indice - 1 
    if (indice < 0) {indice = 0}//se o indice ficar menor do que 0 ele para de descer
    document.getElementById('choose-sel-treinos').selectedIndex = indice
    addThings(userEmail, indice, true)
  }
});

function decreaseIndice() { //diz respeito ao valor atual do treino, ex: A,B,C
  return indice = indice - 1
}

function increaseIndice() {
  return indice = indice+1
}

let array = new Array()
let indice = 0;

document.addEventListener('init', function(event) {
  if (event.target.matches('#exercicios')) {
    let userEmail = firebase.auth().currentUser.email;
    db.collection("user-emails").where("userEmail", "==", userEmail).where("observacoes", "==", "nao").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        return array.push(doc.data().name)
      })
      addThings(userEmail, 0, false)
      addChooseSel(userEmail)
    });
  }
}, false);

function editSelects(event) {
  let newArray = arrumaArray()
  const treino = event.target.value // array treinos -> A,B,C
  let indiceDoTreino
  for (let i = 0; i <= newArray.length; i++) {
    if (newArray[i] == treino) {
      indiceDoTreino = i //indice é o número correspondente à posição da letra no array de treinos
      indice = i // indice com valor global para o drag right e left
    }
  }
  let userEmail = firebase.auth().currentUser.email;
  
  addThings(userEmail, indiceDoTreino, true)
}

const addChooseSel = (email) => {
  const inicioTag = `<ons-select id='choose-sel-treinos' onchange='editSelects(event)'>`
  let valores = ``
  const fimTag = `</ons-select>`

  let newArray = arrumaArray()
  for (let i = 0; i < newArray.length; i++) {
    valores += `<option select-id='${i}' value='${newArray[i]}'>Treino ${newArray[i]}</option>`
  }

  const html = inicioTag+valores+fimTag
  const chooseTreinos = document.getElementById('choose-sel-treinos')
  chooseTreinos.innerHTML = html
}

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
    addExercicio(exercicio1, exercicio2, exercicio3)
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

const exercicios = () => {
  document.getElementById('navigator').pushPage('exercicios.html')
}

const cardapios = () => {
  document.getElementById('navigator').pushPage('cardapios.html')
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

//cardapios

function escreverMensagem(mensagem) {
  document.getElementById('popoverMessage').innerHTML = mensagem
}

function rmHr() {
  document.getElementById("segunda-1").remove();
}

function addHr() {
  document.getElementById("segunda-2").textContent = "aloha"
}
//fim cardapios

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

//banner

function stopBannerTransition() {
  window.clearTimeout(bannersTimeout)
  window.clearInterval(bannersIntervalo)
  bannersTimeout = window.setTimeout(changeBanner, 6000)
}

let last = function() {
  clearSpan()
  carousel.last();
  addWhiteCurrent()
};

let first = function() {
  clearSpan()
  carousel.first();
  addWhiteCurrent()
};

let changeBanner = function() {
  clearSpan()
  if (carousel) {
    let atual = carousel.getActiveIndex()
    const total = document.querySelector('ons-carousel').itemCount
    atual == total-1 ? carousel.setActiveIndex(0) : carousel.next()
  }
}

let clearSpan = function() {
  if (carousel) {
    atual = carousel.getActiveIndex()
    document.querySelector('[firstSpan]').classList.remove('green')
    document.querySelector('[secndSpan]').classList.remove('green')
    document.querySelector('[thirdSpan]').classList.remove('green')
  }
}

let getByIndex = function(index) {
  clearSpan()
  carousel.setActiveIndex(index);

  addWhiteCurrent()
}

let addWhiteCurrent = function() {
  let atual = carousel.getActiveIndex()
  if (atual == 2) {
    document.querySelector('[thirdSpan]').classList.add('green')
  } else if (atual == 1) {
    document.querySelector('[secndSpan').classList.add('green')
  } else if (atual == 0) {
    document.querySelector('[firstSpan]').classList.add('green')
  }
}

//fim banner

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

function addExercicio(exercicio, Sxr, tecAvan) {
  let tableData = document.getElementById("tabelaExercicios"); 

  let table = `
  <table class="table">
    <thead class="thead-light">
      <tr>
        <th scope="col" style="vertical-align: middle; text-align: center">ID</th>
        <th scope="col" style="vertical-align: middle; text-align: center">Exercícios</th>
        <th scope="col" style="vertical-align: middle; text-align: center">SxR</th>
        <th scope="col" style="vertical-align: middle; text-align: center">Técnicas Avançadas</th>
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
      obs1,
      obs2,
      obs3,
      obs4,
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

const getSizeOf = (elementId, method) => {
  let element = document.getElementById(elementId);if (method == 'height') {let height = window.getComputedStyle(element).height; return parseFloat(height) } else { let width = window.getComputedStyle(element).width; return parseFloat(width)} 
}

const showEditExerc = (value) => {
  if (value == 1) {
    document.getElementById('editExerc').style.display = 'block'
    document.getElementById('obsExerc').style.display = 'none'
    document.getElementById('editCardapios').style.display = 'none'
  }
  if (value == 2) {
    document.getElementById('editExerc').style.display = 'none'
    document.getElementById('obsExerc').style.display = 'block'
    document.getElementById('editCardapios').style.display = 'none'
  }
  if (value == 3) {
    document.getElementById('editExerc').style.display = 'none'
    document.getElementById('obsExerc').style.display = 'none'
    document.getElementById('editCardapios').style.display = 'block'
  }
}

function editSelectsArtigos(x) {
  if (x == 0) {//treinos
    document.getElementById('artigos-treinos').style.display = 'block'
    document.getElementById('artigos-dietas').style.display = 'none'
  } else {
    document.getElementById('artigos-treinos').style.display = 'none'
    document.getElementById('artigos-dietas').style.display = 'block'
  }
}
let method

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
    document.getElementById('navigator').pushPage('edit.html');
    return
  }

  showModal()
  firebase.auth().setPersistence(document.getElementById('ckb1').checked ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
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
        setInterval(changeBanner, 11000)
      }
    });
  })
}

const signOut = () => {
  firebase.auth().signOut().then(function() {
    document.getElementById('navigator').resetToPage('login.html')
  }).catch(function(error) {
    showToast(error.code + error.message)
  })
  navigator.splashscreen.show();
  window.setTimeout(function () {
    navigator.splashscreen.hide();
  }, 2000);
}

let hide = 'no' //esconder header para que nao apareca sempre que andar a barra

function changesPages2() {
  const page2 = document.getElementById('page2')
  let bodyWidth = getSizeOf('body', 'width')
  let bodyHeight = getSizeOf('body', 'height')
  const tamanhoHeader = bodyHeight*12
  if (bodyWidth > 767 && hide == 'no' && page2.scrollTop > tamanhoHeader/100) {
    document.querySelectorAll("[homePageHeader]")[1].classList.remove("displayNone")
    document.querySelectorAll("[homePageHeader]")[1].classList.add("grid")
  }
  if (bodyWidth > 767 && page2.scrollTop < tamanhoHeader/100){
    hideHeaderPage2()
  }
}

const hideHeaderPage2 = (bt = 'no') => {
  document.querySelectorAll("[homePageHeader]")[1].classList.add("displayNone")
  document.querySelectorAll("[homePageHeader]")[1].classList.remove("grid")
  if (bt == 'no') {} else {hide = 'y'}
}

const page1ToLogin = () => {
  firebase.auth().onAuthStateChanged(function(user) {
    if(user) {
      document.getElementById('navigator').pushPage('page2.html')  
    } else {
      document.getElementById('navigator').pushPage('login.html');
    }
  })
}

function showHidePass(x) {
  let obj = document.getElementById('senha-login')
  let eye1 = document.getElementById('show-hide-pass0')
  let eye2 = document.getElementById('show-hide-pass1')
  if (x == 0) {
    obj.type = 'float'
    eye1.style.display = 'none'
    eye2.style.display = 'block'
  } else {
    obj.type = 'password'
    eye2.style.display = 'none'
    eye1.style.display = 'block'
  }
}