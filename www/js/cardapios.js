const lanche = ['desjejum', 'lanche1', 'almoco', 'lanche2', 'jantar', 'ceia']

document.addEventListener('init', function() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {   
      let userEmail = firebase.auth().currentUser.email;
      for (let i = 0; i < lanche.length; i++) {
        db.collection("user-emails").where("userEmail", "==", userEmail).where("lanche", "==", lanche[i]).get().then((querySnapshot) => { //Criando os arrays para cada lanche do dia das dietas
          querySnapshot.forEach((doc) => {
            if (lanche[i] == 'desjejum') {
                desjejum.push(doc.data())
              } if (lanche[i] == 'lanche1') {
                lanche1.push(doc.data())
              } if (lanche[i] == 'almoco') {
                almoco.push(doc.data())
              } if (lanche[i] == 'lanche2') {
                lanche2.push(doc.data())
              } if (lanche[i] == 'jantar') {
                jantar.push(doc.data())
              } if (lanche[i] == 'ceia') {
                ceia.push(doc.data())
              }
          })
        })
      }
    }
  })
})

/* Inserindo dietas no backend */
function addDietas() {
  showToast('Alterações encaminhadas')

  let emailInputed = document.getElementById('emailInput3').value
  let nomeDoAlimento = document.getElementById('nome-do-alimento').value
  let medidas = document.getElementById('medidas-e-qtndds').value
  let lanche = document.getElementById('choose-sel-cardapios').value
  let idTabela = document.getElementById('idTabelaDietas').value //diz-se a qual linha se encontrará a informação
  db.collection('user-emails').doc(emailInputed+'['+lanche+']'+idTabela).set ({ // cria uma colecao com o email do usuario, ou altera essa colecao
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

function addDietasToPage(arrayName, value) {
  let table = `
  <table class="table">
    <thead class="thead-light">
      <tr>
        <th scope="col" style="vertical-align: middle; text-align: center">ID</th>
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