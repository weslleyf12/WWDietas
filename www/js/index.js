window.fn = {}
let bannersIntervalo
let bannersTimeout 
let carousel
let primeiraVezRedirecionado = true

document.addEventListener('init', function(event) {
  if (event.target.matches('#login')) {
    primeiraVezRedirecionado = true
    document.getElementById('senha-login').addEventListener('mouseup', function() {
      $('#show-hide-pass').removeClass('displayNone').addClass('displayBlock')
    })
      firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        if (user.email == 'a@a.com') {
          if (primeiraVezRedirecionado == true) {
            document.getElementById('navigator').pushPage('edit.html');
            primeiraVezRedirecionado = false
          }
        } else {
          if (primeiraVezRedirecionado == true) {
            document.getElementById('navigator').pushPage('page1.html');
            primeiraVezRedirecionado = false
          }
        }
      }
    })
  }
}, false);

document.addEventListener('init', function(event) {
  if (event.target.matches('#page2')) {
    criaUsername()
    dragItems('#userChangeDataCarousel', dragEnd_Username)
    criarArraysCardapios()
    check_PrimeiroLogin()
    fixDropdown()
    loadResources()
    document.querySelectorAll('.page__content')[1].addEventListener('scroll', changesPages2)
    carousel = document.getElementById('carousel');
    carousel.addEventListener('postchange', function() {clearSpan(); addWhiteCurrent(); stopBannerTransition()})
    bannersIntervalo = window.setInterval(changeBanner, 6000)
  }


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
  const auth = firebase.auth();
  ons.notification.prompt(mensagem)
    .then(function(input) {
      let message = input ? input : 'None';
      auth.sendPasswordResetEmail(message).then(function() {
        showToast('Email enviado')
      }).catch(function(error) {
        trataErros(error.code, error.message)
      });
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
    const total = document.querySelector('#carousel').itemCount
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
  const element = document.querySelector(elementId);if (method == 'height') {const height = window.getComputedStyle(element).height; return parseFloat(height) } else { const width = window.getComputedStyle(element).width; return parseFloat(width)} 
}

function editSelectsArtigos(x) {
  if (x == 0) {//treinos
    $('#artigos-treinos').removeClass('displayNone')
    $('#artigos-dietas').addClass('displayNone')
  } else {
    console.log(2)
    $('#artigos-treinos').addClass('displayNone')
    $('#artigos-dietas').removeClass('displayNone')
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

  showModal()
  firebase.auth().setPersistence(document.getElementById('ckb1').checked ? firebase.auth.Auth.Persistence.LOCAL : firebase.auth.Auth.Persistence.SESSION)
  .then(function() {
    firebase.auth().signInWithEmailAndPassword(emailLogin, senhaLogin).catch(function(error) {
      trataErros(error.code, error.message)
    });

    firebase.auth().onAuthStateChanged(function(user) {
      //ao fazer login, o modal é fechado
      if (user) {
        if (user.email == 'a@a.com') {
          if (primeiraVezRedirecionado == true) {
            document.getElementById('navigator').pushPage('edit.html');
            primeiraVezRedirecionado = false
          }
          hideModal()
        } else {
          if (primeiraVezRedirecionado == true) {
            document.getElementById('navigator').pushPage('page1.html');
            setInterval(changeBanner, 11000)}
            hideModal()
        }
      }
    });
  })
}


//INICIO BLOCO DE CÓDIGO

const criaUsername = () => {
  let user = firebase.auth().currentUser

  let transparencia
  let mensagem = 'Verifique seu email'
  let fnc

  user.emailVerified ? transparencia = 'transp' : fnc = 'verificaEmail'
  
  if (!user.displayName) {
    document.getElementById('helloMessage').innerHTML = 'Olá. Estamos felizes em te ver por aqui! Como você quer ser chamado?'
  } else {
    const names = user.displayName.split(' ')
    let name
    names[names.length-1] == names[0] ? name = names[0] : name = `${names[0]} ${names[names.length-1]}`
    document.getElementById('helloMessage').innerHTML = `Olá, ${name}! Estamos felizes em te ver por aqui! Como você quer ser chamado?`
  }
  
  document.getElementById('userChangeDataSubdiv').innerHTML =
  `
    <ons-input id="nome-cadastro" placeholder="Seu nome" float></ons-input><br>
    <div><input type="text" style="margin: 5px 0" class="noborder bolder changeUser" readonly="readonly" value='${user.email}'></input> <input type="text" readonly="readonly" style="color: red; margin: 0 0 10px 0" class="${transparencia} noborder bolder changeUser" onclick="${fnc}()" value='${mensagem}'></input></div>
    <button id="btnPopoverChangeName" type="button" style="transform: translateX(-50%); margin: 0 50% 10px 50%" onclick="addUserName(); hidePopover(); document.querySelector('#userChangeDataCarousel').classList.add('displayNone')" class="btn btn-outline-secondary btn-sm">Mudar nome</button>
  `
}

const showAddUserName = () => {
  $("#userChangeDataCarousel").toggleClass('displayNone draggable')
  $(".carousel").toggleClass('down-or-up')
}

fn.vleft = 0;
//dragUsername
//#userChangeDataCarousel
function dragItems(itemId, fnctEnd, target = false) { //if target true, itemId must be a major div, like ul instead of li
  const items = document.querySelectorAll(itemId);

  if (target) {for (let i = 0; i < items.length; i++) {dragItem(items[i], fnctEnd, target)}} else {dragItem(items[0], fnctEnd)}
}

function dragItem(item, fnctEnd, target = false) {
    item.ondragstart =  function(e) {
    if(target) {
      let $target; if(e.target.nodeName == 'TR') {$target = e.target} else {$target = e.target.parentNode}

      $target.style.position = 'absolute'
      let $targetHTML = $($target).children()[0]
      if (document.getElementById('delete-tr')) {} else {$($target).after(`<tr id='delete-tr'><th style='color:transparent'>${$($targetHTML).html()}</th><td colspan='3' style='background: red; border-radius: 10px; text-align: center'><ons-icon icon='trash-alt'</ons-icon></td></tr>`)}
      fn.vleft = parseInt(item.style.left || 0,10);
    } else {
      fn.vleft = parseInt(item.style.left || 0,10)
    }
  };

  item.ondrag = function(e) {
    if(target) {
      let $target; if(e.target.nodeName == 'TR') {$target = e.target} else {$target = e.target.parentNode}
      $target.style.left = parseInt(fn.vleft + e.gesture.deltaX) + 'px' 
    } else { item.style.left = parseInt(fn.vleft + e.gesture.deltaX)  +'px'}
  }

  item.addEventListener('dragend', fnctEnd);
}

function dragEnd_Username(e) {
  let bodyWidth = getSizeOf('body', 'width') //bodyWidth - tamanho da div dividido por dois porque há dois lados
  if (e.gesture.distance >= ((bodyWidth - 216 ) / 2) || e.gesture.distance <= - ((bodyWidth - 216 ) / 2)) {
    document.querySelector("#userChangeDataCarousel").style.left = 0 +'px'
    showAddUserName()
  } else {document.querySelector("#userChangeDataCarousel").style.left = 0 +'px'}
}

const addUserName = () => {
  let user = firebase.auth().currentUser;
  let nomeCadastro = document.getElementById('nome-cadastro').value
  if(nomeCadastro != null && nomeCadastro != '' && nomeCadastro != undefined) {
    user.updateProfile({
      displayName: nomeCadastro,
    }).then(function() {
      showToast(`Tudo certo, ${user.displayName}!`)
    }).catch(function(error) {
      showToast(error)
    });
    const names = nomeCadastro.split(' ')
    names[names.length-1] == names[0] ? changeUser.value = names[0] : changeUser.value = `${names[0]} ${names[names.length-1]}`
  }
}

//FIM BLOCO DE CÓDIGO

const signOut = () => {
  firebase.auth().signOut().then(function() {
    document.getElementById('navigator').resetToPage('login.html')
    primeiraVezRedirecionado = true
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

const showHide = (id) => {
  $(id).toggleClass('displayNone')
}

let showOrHide = 2
function showHidePass() {
  showOrHide++
  let obj = document.getElementById('senha-login')
  let eye = document.getElementById('show-hide-pass')
  
  if (showOrHide%2 == 0) {
    obj.type = 'password'
    eye.setAttribute('icon', 'fa-eye-slash')
  } else {
    obj.type = 'float'
    eye.setAttribute('icon', 'fa-eye');

  }
}

function cadastrar() {
  primeiraVezRedirecionado = false
  let user = firebase.auth().currentUser;
  let senhaCadastro = document.getElementById('senha-cadastro').value;
  let emailCadastro = document.getElementById('email-cadastro').value;
  let admPassw = document.getElementById('adm-passw').value;
  if (emailCadastro.length < 4) {
    showToast('Por favor, insira um email.');
    return;
  }
  if (senhaCadastro.length < 4) {
    showToast('Por favor, insira uma senha.');
    return;
  }
  showModal()
  firebase.auth().signInWithEmailAndPassword(user.email, admPassw)
  .then(function() {
    firebase.auth().createUserWithEmailAndPassword(emailCadastro, senhaCadastro)
    .then(function(){
      firebase.auth().signInWithEmailAndPassword(user.email, admPassw)
      verificaEmail()
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
  })
  .catch(function(error) {
    trataErros(error.code, error.message)
  })
}

/*function tabVisible(arg) {
  arg == 'y' ? document.querySelector('ons-tabbar').setTabbarVisibility('visible') : document.querySelector('ons-tabbar').setTabbarVisibility()
}*/

const caracteres = ['A','B','C','D','E','F','G','H','I','J','K','L','@','W','$','&','#','!','W','V','X','Z','O']
function gerarSenha(){
  let passw = Math.floor(1000* Math.random() + 1);
  passw = passw + caracteres[Math.floor(caracteres.length * Math.random() + 1)] 
  passw = passw + caracteres[Math.floor(caracteres.length * Math.random() + 1)]
  passw = passw + caracteres[Math.floor(caracteres.length * Math.random() + 1)]
  return passw
}

function verificaEmail() {
  var user = firebase.auth().currentUser;
  user.sendEmailVerification().then(function() {
    showToast('Email de verificação enviado!')
  }).catch(function(error) {
    if (error.code == 'auth/too-many-requests') {
      showToast('Email já enviado')  
    }
    showToast('Ocorreu um erro inesperado. '+error.code)
  });
}

function trataErros(errorCode, errorMessage) {
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
}

 function closeMe(elementToClose)
 {
     elementToClose.innerHTML = '';
     elementToClose.style.display = 'none';
 }

 function minimizeMe(elementToMin, maxElement)
 {
     elementToMin.style.display = 'none';
 }

function exercSegment_op1() {$('#editExerc').show(); $('#obsExerc').hide(); $('#editCardapios').hide(); $('#choose-sel-treinos-edit').show(); $('#choose-sel-cardapios').hide(); $('#editTable0').show(); $('#editTable1').hide();}
function exercSegment_op2() {$('#obsExerc').show(); $('#editExerc').hide(); $('#editCardapios').hide(); $('#choose-sel-treinos-edit').show(); $('#choose-sel-cardapios').hide(); $('#editTable0').show(); $('#editTable1').hide();}
function exercSegment_op3() {$('#editCardapios').show(); $('#editExerc').hide(); $('#obsExerc').hide(); $('#choose-sel-treinos-edit').hide(); $('#choose-sel-cardapios').show(); $('#editTable0').hide(); $('#editTable1').show(); deleteSwitch_check(); adicionaCardapiosTelaEdit('desjejum')}
function check_deleteSegment() {if (document.getElementById('deleteSwitch').checked == true)document.getElementById('deleteSwitch').click()}

// ADICIONANDO RECURSOS DO INSTRUTOR AO ALUNO

function addArtigos(id, date, title, textOrLink, paragrafos = 0) {
  
  let newArticle =
  `
  <ons-list-item  expandable>
  <ons-list-header class="artigosDate">${date}</ons-list-header>
  <p class="m-0">${title}</p>
  <div class="expandable-content">
  `
  let meio = ''

  if (paragrafos > 0) { //se tiver parágrafos, então ele adiciona todos, um por um
    new Promise((resolve) => {
      for (let i = 0; i < paragrafos; i++) {
        meio = meio + `<p>${textOrLink[i]}</p>`
      }
      resolve()
    }).then($('#'+id).append(newArticle+meio+'</div></ons-list-item>'))
  } else { //se não tiver, ele não adiciona parágrafos, e adiciona um link
    meio = `
     <a href="${textOrLink}" class="m-0">Clique aqui para ver</a>
    <div>`
    $('#'+id).append(newArticle+meio+'</div></div></ons-list-item>')
  }
}

async function loadResources() {
  $('[progress]').css('padding', '1%')

  const userEmail = firebase.auth().currentUser.email
  let paragrafos
  let emailInstrutor0
  let emailInstrutor1
  let qttd_artigos_treinos
  let qttd_artigos_dietas

  await db.doc(`alunos/${userEmail}`).get().then(e => {emailInstrutor0 = e.data().instrutores[0]; emailInstrutor1 = e.data().instrutores[1]; $('[progress]').attr('aria-valuenow', 20).addClass('w-20')})
  try {await db.doc(`admin/${emailInstrutor0}`).get().then(e => {qttd_artigos_treinos = e.data().artigos_treinos})} catch{}
  try {await db.doc(`admin/${emailInstrutor1}`).get().then(e => {qttd_artigos_dietas = e.data().artigos_dietas})} catch{}
  
  //await db.collection(`admin/${emailInstrutor}`).get().then(e => if (e.data().emailAlunos.includes(userEmail))
  // ADICIONANDO ARTIGOS TREINOS 
  const adicionando_artigos_treinos = new Promise((resolve) => { 
    for (let i = 0; i < qttd_artigos_treinos; i++) {
      db.doc(`admin/${emailInstrutor0}/artigos/${i}`).get().then(e => {
        if (e.data().text === true) {
            addArtigos('artigos-treinos', e.data().date, e.data().title, e.data().data, e.data().paragrafos)
            resolve()
        } else {
          addArtigos('artigos-treinos', e.data().date, e.data().title, e.data().link)
          resolve()
        }
      })
      $('[progress]').css('padding', '20%')
    }
  })

  const adicionando_artigos_dietas = new Promise((resolve) => { 
    for (let i = 0; i < qttd_artigos_dietas; i++) {
      db.doc(`admin/${emailInstrutor1}/artigos/${i}`).get().then(e => {
        if (e.data().text === true) {
            addArtigos('artigos-dietas', e.data().date, e.data().title, e.data().data, e.data().paragrafos)
            resolve()
        } else {
          addArtigos('artigos-dietas', e.data().date, e.data().title, e.data().link)
          resolve()
        }
      })
      $('[progress]').css('padding', '30%')
    }
  })

  let nome
  const adicionando_redes_sociais_instrutor0 = new Promise((resolve) => {
    db.doc(`admin/${emailInstrutor0}`).get().then(doc => {
      try {instrutor_treinos.wpp = doc.data().contatos[0]} catch {hideMedias.wpp0()}
      try {instrutor_treinos.insta = doc.data().contatos[1]} catch {hideMedias.insta0()}
      try {instrutor_treinos.fb = doc.data().contatos[2]} catch {hideMedias.fb0()}
      try {contatos.email(doc.data().contatos[3], 0)} catch {hideMedias.email0()}
      try {nome = doc.data().nome; $('#btnInstrutor0 > span').next().html(nome)} catch {nome = 'Seu personal trainer '}
      Object.entries(instrutor_treinos).length === 0 ? showAlert(0, nome) : {}
      resolve($('[progress]').css('padding', '40%'))
    })
  })

  const adicionando_redes_sociais_instrutor1 = new Promise((resolve) => {
    db.doc(`admin/${emailInstrutor1}`).get().then(doc => {
      try {instrutor_dietas.wpp = doc.data().contatos[0]} catch {hideMedias.wpp1()}
      try {instrutor_dietas.insta = doc.data().contatos[1]} catch {hideMedias.insta1()}
      try {instrutor_dietas.fb = doc.data().contatos[2]} catch {hideMedias.fb1()}
      try {contatos.email(doc.data().contatos[3], 0)} catch {hideMedias.email1()}
      try {nome = doc.data().nome; $('#btnInstrutor1 > span').next().html(nome)} catch {nome = 'Seu nutricionista'}
      Object.entries(instrutor_dietas).length === 0 ? showAlert(1, nome) : {}
      resolve($('[progress]').css('padding', '50%'))
      animationsPage2()
    })
  })

  adicionando_artigos_treinos.then(adicionando_artigos_dietas).then(adicionando_redes_sociais_instrutor0).then(adicionando_redes_sociais_instrutor1)
  .then(window.setTimeout(function() {$('[progressDiv]').fadeOut()}, 3000))
}

let qntdd_calls_showAlert = 0
const showAlert = (n, nome) => {
  n === 0 ? hideMedias.instrutor0() : hideMedias.instrutor1()
  qntdd_calls_showAlert++
  if (qntdd_calls_showAlert >= 2) {$('div.alert-danger').removeClass('displayNone').html('Seus instrutores não possuem redes sociais vinculadas.')} else {
  $('div.alert-danger').removeClass('displayNone').html(nome  + 'não possui redes sociais vinculadas.')
  }
}

let profissional

let contatos = new Object()
contatos.wpp = function() {window.open(`https://api.whatsapp.com/send?phone=${profissional.wpp}`, '_system', 'location=no')}
contatos.insta = function() {window.open(`${profissional.insta}`, '_system', 'location=no')}
contatos.fb = function() {window.open(`${profissional.fb}`, '_system', 'location=no')}
contatos.email = function(email, i) {$('#socialMedias'+i+' > a').attr('href', `mailto:${email}?subject=FitOptimus`)}

let instrutor_dietas = new Object()
let instrutor_treinos = new Object()

const hideMedias = {
  wpp0: () => {$("#socialMedias0 > [onclick='contatos.wpp()']").hide()},
  wpp1: () => {$("#socialMedias1 > [onclick='contatos.wpp()']").hide()},
  insta0: () => {$("#socialMedias0 > [onclick='contatos.insta()']").hide()},
  insta1: () => { $("#socialMedias1 > [onclick='contatos.insta()']").hide()},
  fb0: () => {$("#socialMedias0 > [onclick='contatos.fb()']").hide()},
  fb1: () => {$("#socialMedias1 > [onclick='contatos.fb()']").hide()},
  email0: () => {$('#socialMedias0 > a').hide()},
  email1: () => {$('#socialMedias1 > a').hide()},
  instrutor0: () => {$('#btnInstrutor0').attr('disabled', 'disabled')},
  instrutor1: () => {$('#btnInstrutor1').attr('disabled', 'disabled')}
}

function medias_instrutor0() {
  $('#socialMedias0').toggleClass('displayNone')
  profissional = instrutor_treinos
}

function medias_instrutor1() {
  $('#socialMedias1').toggleClass('displayNone')
  profissional = instrutor_dietas
}

//funcoes initPage2

function check_PrimeiroLogin() {
  let user = firebase.auth().currentUser
    if (user.displayName == null) {
      showAddUserName()
    } else if (user.displayName.length > 15) {
      const names = user.displayName.split(' ')
      names[names.length-1] == names[0] ? changeUser.value = names[0] : changeUser.value = `${names[0]} ${names[names.length-1]}`
    } else {
      changeUser.value = user.displayName
    }
}

function fixDropdown() {
  $("#dropdownMenu2").on("click", ".dropdown-toggle", function(e) { //page2 dropdown button was with some errors
    e.preventDefault();
    $(this).parent().addClass("show");
    $(this).attr("aria-expanded", "true");
    $(this).next().addClass("show"); 
  });
}

function animationsPage2() {
  $('ul[homePageHeader]').animate({height: '+=15vh'}, 1600).animate({height: '-=15vh'}, 400)
  window.setTimeout(function() {
    $('input.tamanhoFitOpt').fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(400)
  }, 2000)
}
