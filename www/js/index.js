window.fn = {};

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

let back = 0;

const calendar = () => {
  fn.load('calendar.html')
}

const exercicios = () => {
  fn.load('exercicios.html')
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

function editSelects(event) {
  document.getElementById('choose-sel').removeAttribute('modifier');
}

function dataSelecionada() {
  let data = document.getElementById('data1').value
  let year = data.slice(6,10)
  let month = data.slice(3,5)
  let text = ""
  currentYear = new Date().getFullYear()
  currentMonth = new Date().getMonth()
  currentMonth++
  console.log(`Ano ${year}, Mes ${month}, Este ano ${currentYear}, este mes ${currentMonth}`)

  if (currentYear == year && currentMonth == month) {
    text = `<h4> No próximo dia <b>${data.slice(0,2)}</b> você terá a seguinte dieta:</h4>`
  } else if (currentYear == year && currentMonth < month) {
    text = `<h4> No dia <b>${data.slice(0,2)}</b> do mês ${month} você terá a seguinte dieta:</h4>` 
  } else if (currentYear != year) {
    text = `<h4> Em ${year}, no dia <b>${data.slice(0,2)}</b>, do mês ${month} você terá a seguinte dieta:</h4>`
  } else if (month < currentMonth) {
    text = `<h4> No ano de ${year}, dia <b>${data.slice(0,2)}</b> do mês ${month}, você teve a seguinte dieta:</h4>`
  }

  document.getElementById('dietaDoDia').innerHTML = text
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
    alert('Por favor, insira uma senha.');
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