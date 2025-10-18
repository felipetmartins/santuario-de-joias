import { spells } from './data.js';

const schoolsBar = document.getElementById('schoolsBar');
const spellsGrid = document.getElementById('spellsGrid');
const attributesList = document.getElementById('attributesList');
const selectedAttributesUl = document.getElementById('selectedAttributes');

let selectedSchool = 'sangue';
let selectedSpell = spells[selectedSchool][0];
let selectedAttributes = [];


function showSpells(school) {
  spellsGrid.innerHTML = '';
  attributesList.innerHTML = '';
  updateSelectedAttributes();


  const buttons = schoolsBar.querySelectorAll('button');
  buttons.forEach(btn => btn.classList.remove('active'));
  const selectedButton = schoolsBar.querySelector(`button[data-school="${school}"]`);
  if (selectedButton) selectedButton.classList.add('active');
  

  spellsGrid.classList.remove('sangue', 'caos', 'profana', 'ilusao', 'gelo', 'tempestade');
  spellsGrid.classList.add(school);

  const totalSpells = spells[school].length;

  const rect = spellsGrid.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const radius = rect.width / 2 * 0.8;

  spells[school].forEach((spell, index) => {
    const angle = (index * 2 * Math.PI / totalSpells) - Math.PI / 2;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);

    const btn = document.createElement('button');
    const img = document.createElement('img');
    const spellNumber = index + 1;
    img.src = `images/${school}/${spellNumber}.png`;
    img.alt = spell.nome;
    btn.setAttribute('data-spell-name', spell.nome);
    btn.appendChild(img);

    btn.style.position = 'absolute';
    btn.style.left = `${x - 40}px`;
    btn.style.top = `${y - 40}px`;

    btn.addEventListener('click', () => showAttributes(spell));
    spellsGrid.appendChild(btn);
  });


  if (selectedSpell && spells[school].includes(selectedSpell)) {
    showAttributes(selectedSpell);
  } else {
    selectedSpell = null;
    selectedAttributes = [];
    updateSelectedAttributes();
  }
}

function showAttributes(spell) {
  selectedSpell = spell;
  attributesList.innerHTML = '';

  const allButtons = spellsGrid.querySelectorAll('button');
  allButtons.forEach(btn => btn.classList.remove('selected'));
  const currentButton = [...allButtons].find(btn => btn.getAttribute('data-spell-name') === spell.nome);
  if (currentButton) currentButton.classList.add('selected');

  const jewelImage = document.getElementById('jewelImage');
  const spellName = document.getElementById('spellName');
  const spellIndex = spells[selectedSchool].findIndex(s => s.nome === spell.nome);
  jewelImage.src = `images/${selectedSchool}/${spellIndex + 1}.png`;
  jewelImage.alt = spell.nome;
  spellName.textContent = spell.nome;

  spell.atributos.forEach(attr => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = selectedAttributes.includes(attr);

    checkbox.addEventListener('change', e => {
      if (e.target.checked) {
        if (selectedAttributes.length >= 4) {
          e.target.checked = false;
          alert('Você só pode selecionar até 4 atributos.');
        } else {
          selectedAttributes.push(attr);
        }
      } else {
        selectedAttributes = selectedAttributes.filter(a => a !== attr);
      }
      updateSelectedAttributes();
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(attr));
    attributesList.appendChild(label);
  });
}

function updateSelectedAttributes() {
  selectedAttributesUl.innerHTML = '';
  selectedAttributes.forEach(attr => {
    const li = document.createElement('li');
    li.textContent = attr;
    selectedAttributesUl.appendChild(li);
  });
}

schoolsBar.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedSchool = btn.dataset.school;
    showSpells(selectedSchool);
  });
});

showSpells(selectedSchool);
