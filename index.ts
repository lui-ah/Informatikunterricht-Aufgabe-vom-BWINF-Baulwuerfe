// Importiere das stylesheets
import './style.css';

// Importiere die Karten
import { karte0, karte1, karte2, karte3 } from './karten.mapdata'

const appDiv: HTMLElement = document.getElementById('app'); // Unser Kontainer
 
const app = (RAWDATA: string): HTMLElement[] => {
  appDiv.innerHTML = ''; // Den Kontainer leeren damit die Felder nicht untereinander auftauchen.

  const firstBreak = RAWDATA.indexOf('\n'); // Ich brauch den ersten Zeilenumbruch weil dieser nach der Breitenangabe kommt - Siehe karte0.txt
  const secondBreak = RAWDATA.indexOf('\n', firstBreak + 1); // Auch den zweiten für die Höhenangabe.
  const thirdBreak = RAWDATA.indexOf('\n', secondBreak + 1); // Nach dem dritten umbruch kommt das Feld.

  const XLEN = Number(RAWDATA.substring(0, firstBreak));
  const YLEN = Number(RAWDATA.substring(firstBreak, secondBreak));
  const FIELDDATA = RAWDATA.substring(secondBreak + 1).split('').map(cell => cell == 'X'); // Die Zeichenfolge wird zum Array und dann werden alle hügel zu 'true' und alle nicht hügel zu 'false'

  let i = 0; // Da das Feld ein Array ist brauche ich ein pointer um zu wissen wie viele Zellen ich schon erstellt habe d.h. 'i' ist das Feld auf dem ich bin das entweder 'Y' oder 'X' ist.
  for (let y = 0; y < YLEN; y++) { // Für jede Reihe auf der Karte.
    let row = document.createElement('div');
    row.setAttribute('class', 'row')
    for (let x = 0; x < XLEN + 1; x++) { // Für jede Zelle in der Reihe.
      let cell = document.createElement('div');
      cell.classList.add('cell');
      cell.classList.add(FIELDDATA[i] ? 'BLACK' : 'WHITE'); // Hier wird mithilfe von 'i' geguckt ob es ein Hügel ist um es entweder schwarz oder weiß zu machen.
      i++;
      cell.setAttribute('id', x + '-' + y); // Eine id um die Zellen wieder zu finden.
      row.appendChild(cell);
    }
    appDiv.appendChild(row) // Reihe wird dem Kontainer hinzugefügt.
    
  }
 return [].slice.call(document.querySelectorAll(".cell")); 
  
}

const isWhite = (id: string): boolean => {
  let cell = document.getElementById(id)
  return !cell || cell.classList.contains('WHITE');
}

interface Huegel { maulwurf: HTMLElement[]; huegel: HTMLElement[] }

const getHuegel = (cells: HTMLElement[]): Huegel => {
  let huegel = cells.filter(cell => cell.classList.contains('BLACK'))
  let maulwurfhuegel = huegel.filter(huegel => {
    let huegelID = huegel.id.split('-'); // [X, Y]
    let X = parseInt(huegelID[0]);
    let Y = parseInt(huegelID[1]);
    return (isWhite(`${X - 1}-${Y - 1}`) && isWhite(`${X}-${Y - 1}`) && isWhite(`${X + 1}-${Y + 1}`)&& isWhite(`${X + 1}-${Y}`)&& isWhite(`${X+ 1}-${Y - 1}`)&& isWhite(`${X}-${Y + 1}`)&& isWhite(`${X- 1}-${Y+ 1}`)&& isWhite(`${X- 1}-${Y+ 1}`) && isWhite(`${X- 1}-${Y}`))
  })
  return {maulwurf: maulwurfhuegel, huegel: huegel};
}

let cells = app(karte3);
let huegel = getHuegel(cells);

console.log(`Es gibt ${huegel.huegel.length} Hügel und ${(huegel.huegel.length - huegel.maulwurf.length) / 10} Baulwurfshügel`)
