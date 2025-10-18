import { spells } from './data.js';

const schoolsBar = document.getElementById('schoolsBar');
const spellsGrid = document.getElementById('spellsGrid');
const attributesList = document.getElementById('attributesList');
const selectedAttributesUl = document.getElementById('selectedAttributes');

let selectedSchool = null;
let selectedSpell = null;
let selectedAttributes = [];

// Função para atualizar lista de magias
function showSpells(school) {
  spellsGrid.innerHTML = '';
  attributesList.innerHTML = '';
  selectedAttributes = [];
  selectedSpell = null;
  updateSelectedAttributes();
  
  // Atualiza o botão ativo
  const buttons = schoolsBar.querySelectorAll('button');
  buttons.forEach(btn => btn.classList.remove('active'));
  const selectedButton = schoolsBar.querySelector(`button[data-school="${school}"]`);
  if (selectedButton) selectedButton.classList.add('active');
  
  // Remove todas as classes de escola e adiciona a atual
  spellsGrid.classList.remove('sangue', 'caos', 'profana', 'ilusao', 'gelo', 'tempestade');
  spellsGrid.classList.add(school);

  const totalSpells = spells[school].length;
  const radius = 220; // Raio do círculo
  const centerX = 300; // Centro X do círculo
  const centerY = 300; // Centro Y do círculo
  
  spells[school].forEach((spell, index) => {
    const angle = (index * 2 * Math.PI / totalSpells) - Math.PI/2; // Começar do topo
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    
    const btn = document.createElement('button');
    const img = document.createElement('img');
    const spellNumber = index + 1; // Começa do 1
    img.src = `images/${school}/${spellNumber}.png`;
    img.alt = spell.nome;
    btn.setAttribute('data-spell-name', spell.nome);
    btn.appendChild(img);
    
    btn.style.left = `${x - 40}px`; // 40 é metade do tamanho do botão
    btn.style.top = `${y - 40}px`;
    
    btn.addEventListener('click', () => showAttributes(spell));
    spellsGrid.appendChild(btn);
  });
}

// Função para mostrar atributos de uma magia
function showAttributes(spell) {
  selectedSpell = spell;
  attributesList.innerHTML = '';
  
  // Remove a seleção de todos os botões e adiciona ao atual
  const allButtons = spellsGrid.querySelectorAll('button');
  allButtons.forEach(btn => btn.classList.remove('selected'));
  const currentButton = [...allButtons].find(btn => btn.getAttribute('data-spell-name') === spell.nome);
  if (currentButton) currentButton.classList.add('selected');
  
  // Atualiza a imagem e o nome da magia selecionada
  const jewelImage = document.getElementById('jewelImage');
  const spellName = document.getElementById('spellName');
  // Encontra o índice do feitiço na escola atual para determinar o número da imagem
  const spellIndex = spells[selectedSchool].findIndex(s => s.nome === spell.nome);
  jewelImage.src = `images/${selectedSchool}/${spellIndex + 1}.png`;
  jewelImage.alt = spell.nome;
  spellName.textContent = spell.nome;

  spell.atributos.forEach(attr => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

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

// Atualiza lista de atributos selecionados
function updateSelectedAttributes() {
  selectedAttributesUl.innerHTML = '';
  selectedAttributes.forEach(attr => {
    const li = document.createElement('li');
    li.textContent = attr;
    selectedAttributesUl.appendChild(li);
  });
}

// Eventos de clique nas escolas
schoolsBar.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedSchool = btn.dataset.school;
    showSpells(selectedSchool);
  });
});
