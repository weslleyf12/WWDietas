const lanche = ['desjejum', 'lanche1', 'almoco', 'lanche2', 'jantar', 'ceia']
const mensagemColecaoVazia = "<div style='text-align: justify; margin: 15px'><strong>Vazio</strong>: não há coleções para este usuário. <br> <strong> Adicione</strong>: Insira o nome do treino, por exemplo 'perna', em seguida o exercício, o SxR, e as técnicas avançadas <u>entre vírgulas</u>. Na última linha insira o número deste exercício, por exemplo, '1', ele será o primeiro elemento na tabela, '2', o segundo, e se por acaso você inserir o '4' sem o '3', o '4' será o terceiro. Se você quiser reescrever um exercício específico em uma coleção (treino), basta inserir o nome dele (com diferenciação entre maiúsculo e minúsculo) e inserir o número deste exercício.</strong><br><strong>Excluir</strong>: para excluir basta habilitar a exclusão, e arrastar o exercício a ser excluído. Para excluir uma coleção inteira (treino), insira o nome (com diferenciação entre maiúsculo e minúsculo) no campo que aparecerá embaixo. Para excluir uma observação, ou você exclui toda a coleção, ou reescreva a observação, inserindo o nome do treino, para os dados atualizarem.</div>"
let arrayTreinos = new Array()

document.addEventListener('init', async function(event) {
  if (event.target.matches('#exercicios')) {
    let userEmail = firebase.auth().currentUser.email;
    await db.doc(`alunos/${userEmail}`).get().then(e => {return arrayTreinos = e.data().treinos})
      .then(function () {addThings(userEmail, 0, "tabelaExercicios", false, false); addChooseSel(userEmail)}) //true = edit page, false = não está sobrescrevendo
  }
}, false);

document.addEventListener('init', async function(event) {
  if (event.target.matches('#edit')) {
    document.querySelector("#exercSegment").setAttribute('disabled')
    document.getElementById('emailInput').addEventListener("change", function() {
      document.querySelector("#exercSegment").removeAttribute('disabled')
      criarArraysCardapios($('#emailInput').val())
      editAddExerc()
    }, false);
  }
}, false);

function criarArraysCardapios(userEmail = firebase.auth().currentUser.email) {
  let i2 = 0
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
    desjejum.length = 0;lanche1.length = 0;almoco.length = 0;lanche2.length = 0;jantar.length = 0;ceia.length = 0 //limpando os arrays para quando entrar em outra conta não ficar as mesmas dietas
      for (let i = 0; i < lanche.length; i++) {
        db.collection(`alunos/${userEmail}/cardapios/${lanche[i]}/linha`).get().then(function(doc){
          for (let i2 = 0; i2 < doc.docs.length; i2++ ) {
            getArrayCardapio(lanche[i], doc.docs[i2].data(), i2)
          }
        })
      }
    }
  })
}

/* Inserindo dados no backend */
async function addDietas() {
  const emailInputed = $('#emailInput').val()
  const nomeDoAlimento = $('#nome-do-alimento').val()
  const medidas = $('#medidas-e-qtndds').val()
  const lanche = $('#choose-sel-cardapios').val()
  const linha = $('#idTabelaDietas').val() //diz-se a qual linha se encontrará a informação

  await db.collection(`alunos/${emailInputed}/cardapios/${lanche}/linha`).doc(linha).set({
    nomeDoAlimento,
    medidas,
    linha
  }).then(showToast('Alterações encaminhadas')).catch((err) => {showToast(err)})
}

function addObs() {
  const intervaloInputed = document.getElementById('interExerc').value
  const obsExercicio = document.getElementById('observacoes').value
  const emailInputed = document.getElementById('emailInput').value
  const treinoInputed = document.getElementById('treinoInput2').value

  const obsSeparadas = obsExercicio.split(',')
  const obs1 = obsSeparadas[0]
  const obs2 = obsSeparadas[1]
  const obs3 = obsSeparadas[2]
  const obs4 = obsSeparadas[3]

  db.collection(`alunos/${emailInputed}/treinos/${treinoInputed}/obs`).doc('obs').set({
    obs1,
    obs2,
    obs3,
    obs4,
    intervalo: intervaloInputed
  }).then(showToast('Alterações encaminhadas'))
}

//fim
function attDados(newExerc, email, linha, treinoInpt) {

  let exerciciosSeparados = newExerc.split(',')
  let exercicio1 = exerciciosSeparados[0]
  let exercicio2 = exerciciosSeparados[1]
  let exercicio3 = exerciciosSeparados[2]
  
  try {
    db.collection(`alunos/${email}/treinos/${treinoInpt}/linha`).doc(linha).set({
    newExerc1: exercicio1,
    newExerc2: exercicio2,
    newExerc3: exercicio3,
    linha: linha
  }).then(showToast('Alterações encaminhadas'))
  try {db.doc(`alunos/${email}`).update({treinos: firebase.firestore.FieldValue.arrayUnion(treinoInpt)})} catch {db.doc(`alunos/${email}`).set({treinos: firebase.firestore.FieldValue.arrayUnion(treinoInpt)})}
  } catch {showToast('Inconsistência')}
}


/* Inserindo Dietas na página */
const desjejum = new Array()
const lanche1 = new Array()
const almoco = new Array()
const lanche2 = new Array()
const jantar = new Array()
const ceia = new Array()

function getArrayCardapio(stringCardapio, value = undefined, i2 = undefined) {
  for (let i in lanche) {
    if (stringCardapio == lanche[i]) {
        if (i == 0) { if(value) {desjejum[i2] = value} else { return desjejum }}
        if (i == 1) { if(value) {lanche1[i2] = value} else { return lanche1 }}
        if (i == 2) { if(value) {almoco[i2] = value} else { return almoco }}
        if (i == 3) { if(value) {lanche2[i2] = value} else { return lanche2 }}
        if (i == 4) { if(value) {jantar[i2] = value} else { return jantar }}
        if (i == 5) { if(value) {ceia[i2] = value} else { return ceia }}
    }
  }
}

async function adicionaCardapiosTelaEdit(stringCardapio) {

  let cardapio = await getArrayCardapio(stringCardapio)

  if (cardapio == ''){$('#editTable1').html(mensagemColecaoVazia)} else {
    const end = "</tbody> </table><br> <br></ons-gesture-detector>"//pula duas linhas para o botão não ficar na frente
    let table = "<ons-gesture-detector><table editTable class='table table-sm'> <thead> <tr> <th scope='col'>Nº</th> <th scope='col'>Nome</th> <th scope='col'>Medidas</th> </tr> </thead> <tbody id='cardapioEdit'>"
    
    for (let i = 0; i < cardapio.length; i++) {
      table = table +      
       `<tr id="${cardapio[i].linha}" draggable>
            <th scope="row">${cardapio[i].linha}</th>
            <td>${cardapio[i].nomeDoAlimento}</td>
            <td>${cardapio[i].medidas}</td>
        </tr>`
    }

    table = table+end
    document.getElementById('editTable1').innerHTML = table
  }                 
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
  </table>
  `;

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
  let emailInputed = document.getElementById('emailInput').value
  let treinoInputed = document.getElementById('treinoInput').value

  let exerc = document.getElementById('exercInput').value
  let inst = document.getElementById('instExerc').value

  attDados(exerc, emailInputed, inst, treinoInputed)
}

function addExercicio(exercicio, Sxr, tecAvan, tabela, email, indice, linhas, boolean) {
  let tableData = document.getElementById(`${tabela}`); 
  let openGesture; let closeGesture; if (boolean) {openGesture = '<ons-gesture-detector>'; closeGesture = '</ons-gesture-detector>'}

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
    `<tr id="${linhas[i]}" draggable>
      <th scope="row">${boolean ? linhas[i] : i}</th>
        <td>${exercicio[i]}</td>
        <td>${Sxr[i]}</td>
        <td>${tecAvan[i]}</td>
    </tr>`
  }

  if (boolean) { // pag edit
    let obs1; let obs2; let obs3; let obs4; let int; const treino = $('#sub-choose-sel-treinos-edit').val()
    db.collection(`alunos/${email}/treinos/${treino}/obs`).doc('obs').get().then((doc) => {
      try {int = doc.data().intervalo} catch {int = 'N/A'}
      // se não houver observação para tal treino, então terá um valor padrão
      for (let i = 0; i <= exercicio.length-1; i++) {
        try {obs1 = doc.data().obs1; obs2 = doc.data().obs2; obs3 = doc.data().obs3; obs4 = doc.data().obs4}
        catch {obs1 = 'N/A'; obs2 = 'N/A'; obs3 = 'N/A'; obs4 = 'N/A'}
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

const addThings = async (email, i, tabela, edit, boolean) => {
  let emailExerc
  zerar()
  firstTimer()
  let exercicio1 = new Array()
  let exercicio2 = new Array()
  let exercicio3 = new Array()
  let linhas = new Array()
  console.log(i)
  await db.collection(`alunos/${email}/treinos/${arrayTreinos[i]}/linha`).get().then(e => e.forEach(doc => {
    edit === false ? document.getElementById('nomeDoTreino').textContent = 'Treino ' +arrayTreinos[i] : {}
    exercicio1.push(doc.data().newExerc1)
    exercicio2.push(doc.data().newExerc2)
    exercicio3.push(doc.data().newExerc3)
    linhas.push(doc.data().linha)

    edit === false ? emailExerc = email : emailExerc = document.getElementById('emailInput').value
    addExercicio(exercicio1, exercicio2, exercicio3, tabela, emailExerc, i, linhas, edit != false)
  }));
  db.doc(`alunos/${email}/treinos/${arrayTreinos[i]}/obs/obs`).get().then((doc) => {
    if (doc.exists) {
      if (edit === false) {
        document.getElementById('intervaloExerc').textContent = 'Intervalo entre treinos e exercícios: ' + doc.docs[0].data().intervalo
        if (doc.docs[0].data().name != arrayTreinos[i]) { // se não houver observação para tal treino, então terá um valor padrão
          if (boolean) {
            addObs2('Indefinido', 'Indefinido', 'Indefinido', 'Indefinido', true)
          } else {
            addObs2('Indefinido', 'Indefinido', 'Indefinido', 'Indefinido')
          }
        } else {
            if (boolean) {
              addObs2(doc.docs[0].data().obs1, doc.docs[0].data().obs2, doc.docs[0].data().obs3, doc.docs[0].data().obs4, true)
            } else {
              addObs2(doc.docs[0].data().obs1, doc.docs[0].data().obs2, doc.docs[0].data().obs3, doc.docs[0].data().obs4)
          }
        }
      }
    } else {
        if (boolean) {
          addObs2('N/d', 'N/d', 'N/d', 'N/d', true)
        } else {
          addObs2('N/d', 'N/d', 'N/d', 'N/d')
        }
        document.getElementById('intervaloExerc').textContent = 'Sem intervalo entre treinos e exercícios'
    }
  })
  return
}

function editAddExerc() {
  userEmail = document.getElementById('emailInput').value
  db.doc(`alunos/${userEmail}`).get().then(async function (e) {
    if (e.exists) {
      if (e.data().treinos.length === 0 ){$('#editTable0').html(mensagemColecaoVazia)}
      else {
        showHideChooseSels(true)
        document.getElementById('editTable0').innerHTML = ''
        document.getElementById('editTable1').innerHTML = ''
        arrayTreinos = await db.doc(`alunos/${userEmail}`).get().then(function(e) {return e.data().treinos}) //primeiro att arrayTreinos, depois chama as funcoes que irao usar ele
        addThings(userEmail, 0, 'editTable0', true, false)
        addChooseSel(userEmail, 'choose-sel-treinos-edit', false)
      }
    } else { throw new Error('E-mail inválido <strong> ou recente</strong>, não constando com dados.<br><strong> Caso o email esteja correto, adicione os campos</strong>.')}
  }).catch((q) => {
    document.getElementById('editTable0').innerHTML = q
    document.getElementById('editTable1').innerHTML = q
    document.getElementById('choose-sel-treinos-edit').style.display = 'none'
    document.getElementById('choose-sel-cardapios').style.display = 'none'
  })
}

document.addEventListener('swipeleft', function(event) {
  increaseIndice()
  if (event.target.matches('#tabela')) {
    let userEmail = firebase.auth().currentUser.email;
    indice = indice++
    if (indice >= arrayTreinos.length) {
      indice = indice - 1 //se o indice passar do valor total ele para de avancar
    }
    document.getElementById('choose-sel-treinos').selectedIndex = indice
    addThings(userEmail, indice, "tabelaExercicios", false, true)
  } 
});

document.addEventListener('swiperight', function(event) {
  decreaseIndice()
  if (event.target.matches('#tabela')) {
    let userEmail = firebase.auth().currentUser.email;
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


let indice = 0;

function editSelects(event, email = firebase.auth().currentUser.email, boolean = false) {
  const treino = event.target.value // array treinos -> A,B,C
  let indiceDoTreino
  for (let i = 0; i <= arrayTreinos.length; i++) {
    if (arrayTreinos[i] == treino) {
      indiceDoTreino = i //indice é o número correspondente à posição da letra no array de treinos
      indice = i // indice com valor global para o drag right e left
    }
  }
  let id

  boolean == true ? id = "editTable0" : id = "tabelaExercicios"
  addThings(email, indiceDoTreino, id, boolean, true)
}

const addChooseSel = (email, id = 'choose-sel-treinos', boolean = true) => { //boolean true indicates that are not the edit table, but the user
  let arg
  boolean == true ? arg = 'event' : arg = `event, '${document.getElementById('emailInput').value}',${true}`
  const inicioTag = `<ons-select id='sub-${id}' onchange="editSelects(${arg.substring(0,arg.length)})">`
  let valores = ``
  const fimTag = `</ons-select>`

  for (let i = 0; i < arrayTreinos.length; i++) {
    valores += `<option select-id='${i}' value='${arrayTreinos[i]}'>Treino ${arrayTreinos[i]}</option>`
  }

  const html = inicioTag+valores+fimTag
  const chooseTreinos = document.getElementById(id)
  chooseTreinos.innerHTML = html
}

let id = 0;
let firstTime = true
function zerar() {return id = 0;}
function secondTime() {return firstTime = false}
function firstTimer() {return firstTime = true}

function showTip() {
  document.querySelector('[overlayBackground]').style.opacity = '0.5'
  document.querySelector('[overlay]').style.display = 'block'
}

function closeTip() {
  document.querySelector('[overlayBackground]').style.opacity = '1'
  document.querySelector('[overlay]').style.display = 'none'
}

function showHideChooseSels(boolean = false) { //se booleano, então a função foi chamada pelo addEditExerc. Não precisa trocar a classe para displayNone ou inline-block vice-versa.
  if (opcaoEdit() != 2) { //se exercícios
    boolean ? $('#choose-sel-treinos-edit').removeClass('displayNone') : $('#choose-sel-treinos-edit').toggleClass('displayNone inline-block')
  } else {
    $('#choose-sel-cardapios').toggleClass('displayNone inline-block')
  }
}

function excluirDados(indice = false) { //SIGNIFICA A LINHA QUE EXCLUIRÁ
  let cardapioNome = $('#choose-sel-cardapios').val()
  let treinoNome = $('#sub-choose-sel-treinos-edit').val()
  let emailCliente = $('#emailInput').val()
  const colecaoTreino = $('#excluirTreino').val()
  const colecaoDieta = $('#excluirDieta').val()
  let excluirColecao;let treinoOuDieta;let documento
  
  if (opcaoEdit() != 2) {documento = treinoNome;treinoOuDieta = 'treinos'; excluirColecao = colecaoTreino} else {documento = cardapioNome;treinoOuDieta = 'cardapios'; excluirColecao = colecaoDieta}
  if (!indice) {deleteColecao()} else {deleteDoc()}

  function deleteColecao() {//Apagando colecao item por item, mas deixando-a existente. Plano pago pode-se alterar para remoção de coleção por completo
    ons.notification.confirm('Excluir TODA a coleção '+excluirColecao+'?').then(function(r){ if (r) {
      delete_chooseSel()
      let i = 0     
      db.collection(`alunos/${emailCliente}/${treinoOuDieta}/${excluirColecao}/linha`).get().then(e => {
        if (e.empty) {
          showToast("Documento inexistente")
        } else {
          showToast('Excluindo...')
          e.forEach(doc => {
            if (doc.exists) {
              db.collection(`alunos/${emailCliente}/${treinoOuDieta}/${documento}/linha`).doc(`${doc.data().linha}`).delete()
            } else {
              showToast("Documento inexistente")
            }     
          })
        }
      }).then(function() {
        if (opcaoEdit() != 2) {
          showToast('Coleção deletada com sucesso!')
          $('#editTable0').empty()
          delete_arrayTreinos($('#emailInput').val(), documento)
          deleteObs(emailCliente, excluirColecao)
        } else {
          criarArraysCardapios(emailCliente) /*att cardápios*/
          $('#editTable1').empty()
          showToast('Coleção deletada com sucesso!')}
          deleteSwitch_disable() //desliga caso esteja ligado
      }).catch(showToast("Erro na exclusão da coleção:" + excluirColecao))
    }})
  }

  function deleteDoc() {
    db.doc(`alunos/${emailCliente}/${treinoOuDieta}/${documento}/linha/${indice}`).get().then(doc => {
      if (doc.exists) {
        const qtddItens = document.querySelectorAll(`#editTable0 tr[id]`).length
        db.collection(`alunos/${emailCliente}/${treinoOuDieta}/${documento}/linha`).doc(indice).delete().then(function() {
          showToast("Documento deletado com sucesso!");
          if (opcaoEdit() != 2 && qtddItens == 0) {
            delete_arrayTreinos()
            delete_chooseSel()
            deleteObs(emailCliente, excluirColecao)
          } //remove do array
        }).catch(showToast("Erro na exclusão do documento "+indice+"."))
      } else {showToast("Documento inexistente")}
    })
  }

  function delete_chooseSel() {if (treinoOuDieta == 'treinos') {$(`#sub-choose-sel-treinos-edit option[value='${colecaoTreino}']`).remove()} else {$(`#choose-sel-cardapios option[value='${colecaoDieta}']`).remove()}}
  function delete_arrayTreinos() {db.doc('alunos/'+emailCliente).update({treinos: firebase.firestore.FieldValue.arrayRemove(documento)})}
}



function deleteObs(email, excluirColecao) {showToast('Excluindo observações...');db.doc(`alunos/${email}/treinos/${excluirColecao}/obs/obs`).delete()}

//GRUPO DE FUNÇÕES SWITCH EXCLUIR PÁGINA EDIT
let $askAgainEditDelete = true
function askAgainEditDelete(elem) {elem.checked ? $askAgainEditDelete = true : $askAgainEditDelete = false}
function deleteSwitch_check() {document.getElementById('deleteSwitch').checked ? enable_excluirDados() : disable_excluirDados()}
function deleteSwitch_disable() {document.getElementById('deleteSwitch').checked ? deleteSwitch_click() : {}}
function deleteSwitch_click() {document.getElementById('deleteSwitch').click()}

function enable_excluirDados() {
  $('#excluirDados').removeClass('displayNone')
  dragItems('tr[draggable]', dragEnd_tablesEdit, true)
}

function disable_excluirDados() {
  $('#excluirDados').addClass('displayNone')
  const elementosDaTabela = document.querySelectorAll('tr[draggable]')
  for (let x = 0; x < elementosDaTabela.length; x++) {
    elementosDaTabela[x].ondragstart = function(e) {}
  }
}

function dragEnd_tablesEdit(e) {
  let $target; if(e.target.nodeName == 'TR') {$target = e.target} else {$target = e.target.parentNode} //TR
  function reloadTable() {excluirDados($target.getAttribute('id')); $($target).remove(); $target.ondragstart = function(e) {}; $target.ondrag = function(e) {}; if(opcaoEdit() != 2) {editAddExerc(); deleteSwitch_click()} else {criarArraysCardapios($('#emailInput').val())}}

  $target.style.position = 'relative'
  $('#delete-tr').remove() //apaga uma div que foi adicionada como background enquanto o target era absoluto
  let tableWidth = opcaoEdit() == 2 ? $('#cardapioEdit').children().children().get()[0].offsetWidth : $('tr[style]').children().get()[0].offsetWidth //th width
  if (e.gesture.distance >= tableWidth) {
    $target.style.left = 0
    if ($askAgainEditDelete) {ons.notification.confirm('Prosseguir na exclusão do elemento '+$target.getAttribute('id')+'?').then(function(r){ if (r) {reloadTable() }})}
    else {reloadTable()}
    
  } else {$target.style.left = 0}
}

//TERMINA AQUI

function opcaoEdit() {return document.querySelector('#exercSegment')._lastActiveIndex}
function showHideDeleteData(value) {$('#excluirTreino').toggleClass('displayNone');$('#excluirDieta').toggleClass('displayNone')}