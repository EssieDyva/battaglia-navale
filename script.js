//abbiamo deciso di memorizzare i dati in questa struttura:
//players:[{},{}] dove la cella di tipo json è fatta così:
//{
// id:string //è il codice giocatore
// posizioniNavi: [][]bool, ossia la griglia completa con true dove ho posizionato la nave, false altrimenti
// colpiNavi:[][]string, ossia la griglia completa del campo dell'avversario con tre valori possibili:
//              '' non ho ancora colpito
//              'acqua' colpo non andato a buon fine
//              'affondata' colpo andato a segno
//  navicolpite: int ossia il numero di navi che ho affondato
//}
//fasi:
//1 inizializzo i dati che mi servono, le griglie devono essere tutte prevalorizzate
//2 i giocatori a turno posizionano le navi
//3 i giocatori colpiscono fino a quando un giocatore ha affondato tutte le navi dell'avversario

//FASE 1: preparo le varibili che mi servono

// Uso una variabile numNavi per memorizzare il numero di navi da posizionare
const numNavi = 3;

// Array che contiene i dati di entrambi i giocatori
let players = [
  { id: "player1", posizioniNavi: [], colpiNavi: [], navicolpite: 0, naviPosizionate: 0 },
  { id: "player2", posizioniNavi: [], colpiNavi: [], navicolpite: 0, naviPosizionate: 0 }
];

// Inizializzo le griglie per entrambi i giocatori
players[0].posizioniNavi = createArray(4, false);
players[1].posizioniNavi = createArray(4, false);
players[0].colpiNavi = createArray(4, '');
players[1].colpiNavi = createArray(4, '');

// Uso una variabile currentPlayer per memorizzare quale giocatore sta giocando
let currentPlayer = players[0]; // Passo la referenza al JSON
console.log("currentPlayer", currentPlayer);

// Funzione per creare una griglia inizializzata con un valore specifico
function createArray(numero, initializeValue) {
  let ret = [];
  // Aggiungo n righe
  for (i = 0; i < numero; i++) {
    let riga = [];
    // Aggiungo n colonne
    for (j = 0; j < numero; j++) {
      riga.push(initializeValue);
    }
    ret.push(riga);
  }
  return ret;
}

// Evento che si attiva quando il DOM è completamente caricato
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");

  // Nascondo i bottoni e i titoli iniziali
  document.getElementById("buttonPlayer1").style.display = "none";
  document.getElementById("buttonStart").style.display = "none";
  document.getElementById("partitaTitle").style.display = "none";

  // Visualizzo quale giocatore sta giocando sull'HTML
  document.getElementById("currentPlayerID").textContent = currentPlayer.id;
});

// Funzione per passare al setup del secondo giocatore
function passaASetupGiocatore2() {
  // Resetto la griglia
  const celle = document.querySelectorAll("td");
  celle.forEach(cella => {
    cella.style.backgroundColor = 'white';
  });

  // Passo al secondo giocatore
  currentPlayer = players[1];
  console.log("currentPlayer", currentPlayer);

  // Nascondo il bottone del primo giocatore
  document.getElementById("buttonPlayer1").style.display = "none";

  // Visualizzo quale giocatore sta giocando
  document.getElementById("currentPlayerID").textContent = currentPlayer.id;
}

// Funzione per posizionare le navi
function setup(element) {
  console.log(element);

  // Ottengo le coordinate della cella cliccata dalla sua ID
  const row = element.id[0]; // Riga della cella
  const col = element.id[1]; // Colonna della cella

  // Controllo se il giocatore può posizionare una nave o rimuoverla
  // Il giocatore può posizionare una nave solo se non ha raggiunto il limite massimo (numNavi)
  // oppure può rimuovere una nave già posizionata
  if (currentPlayer.naviPosizionate < numNavi || element.style.backgroundColor == 'red') {
    if (element.style.backgroundColor == 'red') {
      // Deseleziono la cella (rimuovo la nave)
      element.style.backgroundColor = 'white';
      currentPlayer.naviPosizionate--; // Decremento il contatore delle navi posizionate
      currentPlayer.posizioniNavi[row][col] = false; // Aggiorno la griglia del giocatore
    } else {
      // Seleziono la cella (posiziono una nave)
      element.style.backgroundColor = 'red';
      currentPlayer.naviPosizionate++; // Incremento il contatore delle navi posizionate
      currentPlayer.posizioniNavi[row][col] = true; // Aggiorno la griglia del giocatore
    }
  } else {
    // Mostro un messaggio di errore se il giocatore tenta di posizionare più navi del limite
    alert("MOSSA NON AMMESSA");
  }

  // Controllo se il giocatore ha completato il posizionamento delle navi
  if (currentPlayer.id == 'player1' && currentPlayer.naviPosizionate == numNavi) {
    // Se il giocatore 1 ha posizionato tutte le navi, mostro il bottone per passare al giocatore 2
    document.getElementById("buttonPlayer1").style.display = "block";
  } else {
    // Nascondo il bottone se il giocatore 1 non ha ancora completato il posizionamento
    document.getElementById("buttonPlayer1").style.display = "none";
  }

  if (currentPlayer.id == 'player2' && currentPlayer.naviPosizionate == numNavi) {
    // Se il giocatore 2 ha posizionato tutte le navi, mostro il bottone per iniziare il gioco
    document.getElementById("buttonStart").style.display = "block";
  } else {
    // Nascondo il bottone se il giocatore 2 non ha ancora completato il posizionamento
    document.getElementById("buttonStart").style.display = "none";
  }

  console.log("currentPlayer", currentPlayer);
  console.log("players", players);
}

// Funzione per iniziare il gioco
function inizioGioco() {
  currentPlayer = players[0];

  // Nascondo i bottoni e i titoli del setup
  document.getElementById("buttonStart").style.display = "none";
  document.getElementById("setupTitle").style.display = "none";
  document.getElementById("partitaTitle").style.display = "block";

  // Visualizzo quale giocatore sta giocando
  document.getElementById("playcurrentPlayerID").textContent = currentPlayer.id;

  // Resetto la griglia e abilito il click per sparare
  const celle = document.querySelectorAll("td");
  celle.forEach(cella => {
    cella.style.backgroundColor = 'white';
    cella.setAttribute("onclick", "spara(this)");
  });
}

// Funzione per sparare su una cella
function spara(element) {
  console.log("element", element);

  // Ottengo le coordinate della cella cliccata dalla sua ID
  const row = element.id[0]; // Riga della cella
  const col = element.id[1]; // Colonna della cella

  // Controllo se il colpo è valido (la cella non è già stata colpita)
  if (currentPlayer.colpiNavi[row][col] === '') {
    // Ottengo l'avversario del giocatore attivo
    const opponent = players[1 - players.indexOf(currentPlayer)];

    // Controllo se la cella contiene una nave dell'avversario
    if (opponent.posizioniNavi[row][col] === true) {
      // Colpo a segno: aggiorno lo stato della cella e incremento il contatore delle navi colpite
      currentPlayer.colpiNavi[row][col] = 'affondata';
      opponent.navicolpite++;
      element.style.backgroundColor = 'black';
    } else {
      // Colpo mancato: aggiorno lo stato della cella
      currentPlayer.colpiNavi[row][col] = 'acqua';
      element.style.backgroundColor = 'lightblue';
    }
  } else {
    // Se la cella è già stata colpita, mostro un messaggio di errore
    alert("MOSSA NON AMMESSA");
    return; // Esco dalla funzione
  }

  // Controllo se il giocatore attivo ha vinto (ha affondato tutte le navi dell'avversario)
  const opponent = players[1 - players.indexOf(currentPlayer)];
  if (opponent.navicolpite === numNavi) {
    // Il giocatore attivo ha vinto: mostro un messaggio e abilito il pulsante di riavvio
    alert(`HA VINTO IL ${currentPlayer.id.toUpperCase()}`);
    document.getElementById("cambioGiocatore").style.display = "none"; // Nascondo il bottone per cambiare giocatore
    document.getElementById("restart").style.display = "block"; // Mostro il bottone per riavviare il gioco
  } else {
    // Il gioco continua: mostro il bottone per cambiare giocatore
    document.getElementById("cambioGiocatore").style.display = "block";
  }
}

// Funzione per cambiare giocatore
function cambiaGiocatore() {
  // Passo al giocatore successivo
  // Calcolo il prossimo giocatore alternando tra i due nell'array `players`
  currentPlayer = players[1 - players.indexOf(currentPlayer)];
  console.log("currentPlayer", currentPlayer);

  // Seleziono tutte le celle della griglia
  const celle = document.querySelectorAll("td");
  celle.forEach(cella => {
    // Resetto il colore di tutte le celle a bianco
    cella.style.backgroundColor = 'white';

    // Ottengo le coordinate della cella dalla sua ID
    const row = cella.id[0]; // Riga
    const col = cella.id[1]; // Colonna
      // Se il giocatore attivo ha colpito una nave in questa cella
      if (currentPlayer.colpiNavi[row][col] === 'affondata') {
        cella.style.backgroundColor = 'black';
      }
      // Se il giocatore attivo ha mancato in questa cella
      else if (currentPlayer.colpiNavi[row][col] === 'acqua') {
        cella.style.backgroundColor = 'lightblue';
      }
  });

  // Aggiorno l'interfaccia per mostrare il giocatore attivo
  document.getElementById("playcurrentPlayerID").textContent = currentPlayer.id;

  // Nascondo il bottone per cambiare giocatore fino alla prossima mossa
  document.getElementById("cambioGiocatore").style.display = "none";
}

// Funzione per riavviare il gioco
function restart() {
  location.reload();//ricarica la pagina tornando alla fase di setup
}