window.fn = {}
let bannersIntervalo
let bannersTimeout 
let carousel

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
      $('#show-hide-pass').removeClass('displayNone').addClass('displayBlock')
    })
      firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        document.getElementById('navigator').pushPage('page2.html')
      }
    })
  }
}, false);

document.addEventListener('init', function(event) {
  if (event.target.matches('#page2')) {
    //IF PRIMEIRO LOGIN
    let user = firebase.auth().currentUser
    if (user.displayName == null) {showAddUserName()}
    $(".dropdown").on("click", ".dropdown-toggle", function(e) { //page2 dropdown button was with some errors
      e.preventDefault();
      $(this).parent().addClass("show");
      $(this).attr("aria-expanded", "true");
      $(this).next().addClass("show"); 
    });
    document.querySelectorAll('.page__content')[1].addEventListener('scroll', changesPages2)
    carousel = document.getElementById('carousel');
    bannersIntervalo = window.setInterval(changeBanner, 6000)
    document.querySelector('ons-carousel').addEventListener('postchange', function() {clearSpan(); addWhiteCurrent(); stopBannerTransition()}
  )}
}, false);

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

function escreverMensagem(mensagem) {
  document.getElementById('popoverMessage').innerHTML = mensagem
}

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

const getFontSize = (elementId) => { //nao usado
  let element = document.getElementById(elementId)
  let fontSize = window.getComputedStyle(element).fontSize
  return parseFloat(fontSize)
}

const getSizeOf = (elementId, method) => {
  let element = document.getElementById(elementId);if (method == 'height') {let height = window.getComputedStyle(element).height; return parseFloat(height) } else { let width = window.getComputedStyle(element).width; return parseFloat(width)} 
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

const showAddUserName = () => {
  showPopover(document.getElementById('page2.html'))
  escreverMensagem('Olá, Estamos felizes em te ver por aqui! Como você quer ser chamado?')
  document.getElementById('popoverAditional').innerHTML = '<ons-input style="padding-bottom:15px;" id="nome-cadastro" placeholder="Seu nome" float></ons-input><br>'
}

const addUserName = () => {
  let user = firebase.auth().currentUser;
  let nomeCadastro = document.getElementById('nome-cadastro').value
  console.log(nomeCadastro)
  if(nomeCadastro != null && nomeCadastro != '' && nomeCadastro != undefined) {
    user.updateProfile({
      displayName: nomeCadastro,
    }).then(function() {
      showToast(`Tudo certo, ${user.displayName}!`)
    }).catch(function(error) {
      showToast(error)
    });
  }
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
    document.querySelectorAll("[homePageHeader]")[1].classList.remove("displayNone");document.querySelectorAll("[homePageHeader]")[1].classList.add("grid")
    document.querySelectorAll("[homePageHeader]")[2].classList.remove("displayNone");document.querySelectorAll("[homePageHeader]")[2].classList.add("grid")
  }
  if (bodyWidth > 767 && page2.scrollTop < tamanhoHeader/100){
    hideHeaderPage2()
  }
}

const hideHeaderPage2 = (bt = 'no') => {
  document.querySelectorAll("[homePageHeader]")[1].classList.add("displayNone");document.querySelectorAll("[homePageHeader]")[1].classList.remove("grid")
  document.querySelectorAll("[homePageHeader]")[2].classList.add("displayNone");document.querySelectorAll("[homePageHeader]")[2].classList.remove("grid")
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

const showHide = (id) => {
  if ($(id).hasClass('displayNone')) {
    $(id).addClass('displayBlock').removeClass('displayNone');
  } else if ($(id).hasClass('displayBlock')){
    $(id).addClass('displayNone').removeClass('displayBlock');
  } else {
    $(id).addClass('displayNone')
  }
}

let showOrHide = 2
function showHidePass() {
  showOrHide++
  let obj = document.getElementById('senha-login')
  let eye = document.getElementById('show-hide-pass')
  
  if (showOrHide%2 == 0) {
    obj.type = 'float'
    eye.setAttribute('icon', 'fa-eye');
  } else {
    obj.type = 'password'
    eye.setAttribute('icon', 'fa-eye-slash')
  }
}

function cadastrar() {
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
    hideModal()
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

function tabVisible(arg) {
  arg == 'y' ? document.querySelector('ons-tabbar').setTabbarVisibility('visible') : document.querySelector('ons-tabbar').setTabbarVisibility()
}