const lanche = ['desjejum', 'lanche1', 'almoco', 'lanche2', 'jantar', 'ceia']

function variasCoisas() {
  
  addDietas()
  editAddExerc()
  
  let cardapioNome = $('#choose-sel-cardapios').val()
  let cardapioAtual = getArrayCardapio(cardapioNome)
  let emailCliente = $('#emailInput').val()


  let promise = new Promise((resolve, reject) => {
    
    cardapioAtual.length = 0
    db.collection(emailCliente).where("lanche", "==", cardapioNome).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
         cardapioAtual[cardapioAtual.length] = doc.data()
        })
        resolve(cardapioAtual)
      })
  });

  promise
    .then(adicionaCardapiosTelaEdit(cardapioNome))
}

function criarArraysCardapios(userEmail = firebase.auth().currentUser.email) {
  let i2 = 0
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    desjejum.length = 0 //limpando os arrays para quando entrar em outra conta não ficar as mesmas dietas
    lanche1.length = 0
    almoco.length = 0
    lanche2.length = 0
    jantar.length = 0
    ceia.length = 0
      for (let i = 0; i < lanche.length; i++) {
        db.collection(userEmail).where("lanche", "==", lanche[i]).get()
          .then((querySnapshot) => { //Criando os arrays para cada lanche do dia das dietas
            i2=0 
            querySnapshot.forEach((doc) => {
              if (lanche[i] == 'desjejum') {
                desjejum[i2] = doc.data()
                i2++
              } else if (lanche[i] == 'lanche1') {
                lanche1[i2] = doc.data()
                i2++
              } else if (lanche[i] == 'almoco') {
                almoco[i2] = doc.data()
                i2++
              } else if (lanche[i] == 'lanche2') {
                id++
                lanche2[i2] = doc.data()
              } else if (lanche[i] == 'jantar') {
                jantar[i2] = doc.data()
                i2++
              } else if (lanche[i] == 'ceia') {
                ceia[i2] = doc.data()
                i2++
              }
          })
        })
      }
    }
  })
}

/* Inserindo dietas no backend */
function addDietas() {
  showToast('Alterações encaminhadas')

  let emailInputed = $('#emailInput').val()
  let nomeDoAlimento = $('#nome-do-alimento').val()
  let medidas = $('#medidas-e-qtndds').val()
  let lanche = $('#choose-sel-cardapios').val()
  let idTabela = $('#idTabelaDietas').val() //diz-se a qual linha se encontrará a informação

  db.collection(emailInputed).doc('['+lanche+']'+idTabela).set ({ // cria uma colecao com o email do usuario, ou altera essa colecao
    userEmail: emailInputed,
    lanche,
    nomeDoAlimento,
    medidas,
    idTabela
  })
}

/* Inserindo Dietas na página */
const desjejum = new Array()
const lanche1 = new Array()
const almoco = new Array()
const lanche2 = new Array()
const jantar = new Array()
const ceia = new Array()

function getArrayCardapio(stringCardapio) {
for (let i in lanche) {
  if (stringCardapio == lanche[i]) {
      if (i == 0) { return desjejum }
      if (i == 1) { return lanche1 }
      if (i == 2) { return almoco }
      if (i == 3) { return lanche2 }
      if (i == 4) { return jantar }
      if (i == 5) { return ceia }
    }
  }
}

function adicionaCardapiosTelaEdit(stringCardapio) {
  let table = `
   <table editTable class="table table-sm">
    <thead>
      <tr>
        <th scope="col">Nº</th>
        <th scope="col">Nome</th>
        <th scope="col">Medidas</th>
      </tr>
    </thead>
  `;
  let end =
    `</tbody>
  </table>
  <br>
  <br>`; //pula duas linhas para o botão não ficar na frente

  let cardapio = getArrayCardapio(stringCardapio)
  for (let i = 0; i < cardapio.length; i++) {
  table = table + 
    `<tbody>
      <tr>
        <th scope="row">${i}</th>
        <td>${cardapio[i].nomeDoAlimento}</td>
        <td>${cardapio[i].medidas}</td>
      </tr>
    `
  }

  table = table+end
  document.getElementById('editTable1').innerHTML = table
}

function addDietasToPage(arrayName, value) {
  document.getElementById(arrayName).innerHTML = '' //limpando antes de add -- adiciona NADA à tela
  let table = `
  <table class="table">
    <thead class="thead-light">
      <tr>
        <th scope="col" style="vertical-align: middle; text-align: center">Nº</th>
        <th scope="col" style="vertical-align: middle; text-align: center">Nome do Alimento</th>
        <th scope="col" style="vertical-align: middle; text-align: center">Medidas Caseiras e quantidade (em grama ou ml)</th>
      </tr>
    </thead>
  <tbody class="centered">
  `;
  let tableEnd =
    `</tbody>
  </table>`;

  let resolveTabela = new Promise(function(resultado) {
    for (let a = 0; a < lanche.length; a++) {
      if (arrayName == lanche[a]) {
        for (let i = 0; i < value.length; i++) {
          table = table +
          `<tr>
              <th scope="row">${i}</th>
              <td>${value[i].nomeDoAlimento}</td>
              <td>${value[i].medidas}</td>
          </tr>`;
        }
      }
    }
    resultado(table)
  })
  resolveTabela
    .then(newTable => table = newTable + tableEnd)
    .then(newTable => document.getElementById(arrayName).innerHTML = newTable)
}

//EXERCICIOS 
function addObs() {
  showToast('Alterações encaminhadas')

  let intervaloInputed = document.getElementById('interExerc').value
  let obsExercicio = document.getElementById('observacoes').value
  let emailInputed = document.getElementById('emailInput').value
  let treinoInputed = document.getElementById('treinoInput2').value

  let obsSeparadas = obsExercicio.split(',')
  let obs1 = obsSeparadas[0]
  let obs2 = obsSeparadas[1]
  let obs3 = obsSeparadas[2]
  let obs4 = obsSeparadas[3]

   db.collection(emailInputed).doc(emailInputed+"["+treinoInputed+"]").set ({ // cria uma colecao com o email do usuario, ou altera essa colecao
      obs1,
      obs2,
      obs3,
      obs4,
      intervalo: intervaloInputed,
      name: treinoInputed,
      observacoes: 'sim'
  })
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

function attDados(newExerc, email, instancia, treinoInpt) {

  let exerciciosSeparados = newExerc.split(',')
  let exercicio1 = exerciciosSeparados[0]
  let exercicio2 = exerciciosSeparados[1]
  let exercicio3 = exerciciosSeparados[2]

  db.collection(email).doc(email+"["+treinoInpt+"]"+"["+instancia+"]").set ({ // cria uma colecao com o email do usuario, ou altera essa colecao
      newExerc1: exercicio1,
      newExerc2: exercicio2,
      newExerc3: exercicio3,
      name: treinoInpt,
      instancia: instancia,
      observacoes: 'nao'
  })
}


function addExerc() {
  showToast('Alterações encaminhadas')

  let emailInputed = document.getElementById('emailInput').value
  let treinoInputed = document.getElementById('treinoInput').value

  let exerc = document.getElementById('exercInput').value
  let inst = document.getElementById('instExerc').value

  attDados(exerc, emailInputed, inst, treinoInputed)
}

const showEditExerc = (value) => {
  if (value == 1) {
    document.getElementById('editExerc').style.display = 'block'
    document.getElementById('obsExerc').style.display = 'none'
    document.getElementById('editCardapios').style.display = 'none'
    document.querySelector('#editTable0').classList.remove('displayNone')
    document.querySelector('#editTable1').classList.add('displayNone')
    document.querySelector('#choose-sel-treinos-edit').classList.remove('displayNone')
  }
  if (value == 2) {
    document.getElementById('editExerc').style.display = 'none'
    document.getElementById('obsExerc').style.display = 'block'
    document.getElementById('editCardapios').style.display = 'none'
    document.querySelector('#editTable0').classList.remove('displayNone')
    document.querySelector('#editTable1').classList.add('displayNone')
    document.querySelector('#choose-sel-treinos-edit').classList.remove('displayNone')
  }
  if (value == 3) {
    document.getElementById('editExerc').style.display = 'none'
    document.getElementById('obsExerc').style.display = 'none'
    document.getElementById('editCardapios').style.display = 'block'
    document.querySelector('#editTable0').classList.add('displayNone')
    document.querySelector('#editTable1').classList.remove('displayNone')
    document.querySelector('#choose-sel-treinos-edit').classList.add('displayNone')
    adicionaCardapiosTelaEdit($('#choose-sel-cardapios').val())
  }
}

function addExercicio(exercicio, Sxr, tecAvan, tabela, email, indice, boolean) {

  let tableData = document.getElementById(`${tabela}`); 
  let table = `
  <table class="table">
    <thead class="thead-light">
      <tr>
        <th scope="col" style="vertical-align: middle; text-align: center">Nº</th>
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

  if (boolean) { // pag edit
    let newArray = arrumaArray()
    let obs1; let obs2; let obs3; let obs4; let int
    db.collection(email).where("observacoes", "==", "sim").get().then((querySnapshot) => {
      int = querySnapshot.docs[0].data().intervalo
      // se não houver observação para tal treino, então terá um valor padrão
      for (let i = 0; i <= exercicio.length-1; i++) {
        obs1 = querySnapshot.docs[indice].data().obs1; obs2 = querySnapshot.docs[indice].data().obs2; obs3 = querySnapshot.docs[indice].data().obs3; obs4 = querySnapshot.docs[indice].data().obs4
      }
      table = table +
          `<tr>
            <th scope="row">Obs. pré</th>
              <td colspan="3">${obs1}</td>
            </tr>
            <tr>
              <th scope="row">Obs. pós</th>
              <td colspan="3">${obs2}</td>
            </tr>
            <tr>
              <th scope="row">Obs. aeróbico</th>
              <td colspan="3">${obs3}</td>
            </tr>
            <tr>
              <th scope="row">Obs. geral</th>
              <td colspan="3">${obs4}</td>
            </tr>
            <tr>
              <th scope="row">Int. </th>
              <td colspan="3">${int}</td>
            </tr>
          <tr>
        </tbody>
      </table>`
      tableData.innerHTML = table
    })
  } else {
    table = table +
    `</tbody>
      </table>`
    ;
    tableData.innerHTML = table
  }
}

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
    addThings(userEmail, indice, "tabelaExercicios", false, true)
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
    addThings(userEmail, indice, "tabelaExercicios", false, true)
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
    db.collection(userEmail).where("observacoes", "==", "nao").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        return array.push(doc.data().name)
      })
      addThings(userEmail, 0, "tabelaExercicios", false, false) //true = edit page, false = não está sobrescrevendo
      addChooseSel(userEmail)
    });
  }
}, false);

document.addEventListener('init', function(event) {
  if (event.target.matches('#edit')) {
    document.getElementById('emailInput').addEventListener("change",function() {
      criarArraysCardapios($('#emailInput').val())
      editAddExerc() //true = edit page, false = não está sobrescrevendo
    }, false);
  }
}, false);

function editSelects(event, email = firebase.auth().currentUser.email, boolean = false) {
  let newArray = arrumaArray()
  const treino = event.target.value // array treinos -> A,B,C
  let indiceDoTreino
  for (let i = 0; i <= newArray.length; i++) {
    if (newArray[i] == treino) {
      indiceDoTreino = i //indice é o número correspondente à posição da letra no array de treinos
      indice = i // indice com valor global para o drag right e left
    }
  }
  addThings(email, indiceDoTreino, "editTable0", boolean, true)
}

const addChooseSel = (email, id = 'choose-sel-treinos', boolean = true) => { //boolean true indicates that are not the edit table, but the user
  let arg
  boolean == true ? arg = 'event' : arg = `event, '${document.getElementById('emailInput').value}',${true}`
  const inicioTag = `<ons-select id='sub-${id}' onchange="editSelects(${arg.substring(0,arg.length)})">`
  let valores = ``
  const fimTag = `</ons-select>`

  let newArray = arrumaArray()
  for (let i = 0; i < newArray.length; i++) {
    valores += `<option select-id='${i}' value='${newArray[i]}'>Treino ${newArray[i]}</option>`
  }

  const html = inicioTag+valores+fimTag
  const chooseTreinos = document.getElementById(id)
  chooseTreinos.innerHTML = html
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

const addThings = (email, i, tabela, edit, boolean) => {
  let emailExerc
  zerar()
  firstTimer()
  let newArray = arrumaArray()
  let exercicio1 = new Array()
  let exercicio2 = new Array()
  let exercicio3 = new Array()
  db.collection(email).where("name", "==", newArray[i]).where("observacoes", "==", "nao").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      edit === false ? document.getElementById('nomeDoTreino').textContent = 'Treino ' +newArray[i] : console.log()
      exercicio1.push(doc.data().newExerc1)
      exercicio2.push(doc.data().newExerc2)
      exercicio3.push(doc.data().newExerc3)
    })
    edit === false ? emailExerc = email : emailExerc = document.getElementById('emailInput').value
    addExercicio(exercicio1, exercicio2, exercicio3, tabela, emailExerc, i, edit != false)
  });

  db.collection(email).where("observacoes", "==", "sim").get().then((querySnapshot) => {
    if (edit === false) {
      document.getElementById('intervaloExerc').textContent = 'Intervalo entre treinos e exercícios: ' + querySnapshot.docs[0].data().intervalo
      if (querySnapshot.docs[0].data().name != newArray[i]) { // se não houver observação para tal treino, então terá um valor padrão
        if (boolean) {
          addObs2('Indefinido', 'Indefinido', 'Indefinido', 'Indefinido', true)
        } else {
          addObs2('Indefinido', 'Indefinido', 'Indefinido', 'Indefinido')
        }
      } else {
          if (boolean) {
            addObs2(querySnapshot.docs[0].data().obs1, querySnapshot.docs[0].data().obs2, querySnapshot.docs[0].data().obs3, querySnapshot.docs[0].data().obs4, true)
          } else {
            addObs2(querySnapshot.docs[0].data().obs1, querySnapshot.docs[0].data().obs2, querySnapshot.docs[0].data().obs3, querySnapshot.docs[0].data().obs4)
        }
      }
    }
  })
}

function showTip() {
  document.querySelector('[overlayBackground]').style.opacity = '0.5'
  document.querySelector('[overlay]').style.display = 'block'
}

function closeTip() {
 document.querySelector('[overlayBackground]').style.opacity = '1'
  document.querySelector('[overlay]').style.display = 'none'
}

async function editAddExerc() {
  userEmail = document.getElementById('emailInput').value
  await db.collection(userEmail).where("observacoes", "==", "nao").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      return array.push(doc.data().name)
    })    
  })

  addThings(userEmail, 0, 'editTable0', true, false)
  addChooseSel(userEmail, 'choose-sel-treinos-edit', false)
}