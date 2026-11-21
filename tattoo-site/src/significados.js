// Página /significados — mesmas imagens da /galeria, nomes tirados dos arquivos.
const artworks = Object.entries(
  import.meta.glob('../assets/Galeria/*.{jpg,jpeg,png,webp,avif}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
)
  // Foto duplicada da "Índia com lobo" removida (mantém só a completa).
  .filter(([path]) => !path.includes('ppreto'))
  .sort(([a], [b]) => a.localeCompare(b, 'pt-BR'))
  .map(([path, src]) => {
    const file = path.split('/').pop();
    return { src, name: file.replace(/\.[^.]+$/, '').trim() };
  });

// Resumos na mesma ordem dos arquivos da pasta Galeria.
// O título exibido vem direto do nome do arquivo (sem inventar nomes novos).
const INFO = [
  { category: 'espiritual', text: 'A figura de Maria em preto e branco representa devoção, proteção e serenidade. Uma forma de manter perto uma referência de fé e acolhimento.' },
  { category: 'simbolos', text: 'Uma caveira ligada à ancestralidade. Lembra a passagem do tempo, a memória de quem veio antes e o respeito pelas origens.' },
  { category: 'outros', text: 'O Coringa aparece como símbolo da ruptura com o convencional. Fala de humor sombrio, imprevisibilidade e da liberdade de ser diferente.' },
  { category: 'outros', text: 'Outra versão do Coringa, agora em preto e branco. O contraste reforça o lado mais intenso e irreverente da personagem.' },
  { category: 'animais', text: 'Um leão em traço fino. Representa coragem, liderança e força tranquila — a presença marcante de quem não precisa de exageros.' },
  { category: 'animais', featured: true, text: 'A borboleta é o símbolo clássico da transformação. Representa mudança, liberdade e renovação depois de um período de espera.' },
  { category: 'outros', text: 'Uma pin-up em fine line. Celebra beleza, atitude e confiança, com aquele toque retrô que valoriza a expressão pessoal.' },
  { category: 'animais', text: 'Outra borboleta, agora em preto e branco. Fala de delicadeza, leveza e da ideia de recomeçar com mais liberdade.' },
  { category: 'animais', text: 'Um gato com elementos surreais. Representa mistério, intuição e independência, com um ar de sonho que desafia a realidade.' },
  { category: 'outros', text: 'O retrato de uma gueixa. Carrega elegância, disciplina e mistério, além da admiração por uma estética tradicional.' },
  {
    title: 'Coringa abrindo a pele',
    category: 'outros',
    text: 'O Coringa rasga a pele e revela o que está por baixo da aparência. Representa identidade, máscaras e a parte mais crua da personalidade — a ideia de que ninguém é exatamente o que mostra.',
  },
  { category: 'espiritual', text: 'Uma mulher indígena acompanhada de um gavião. Une força, natureza e espiritualidade: visão ampla, proteção e conexão com a terra.' },
  { category: 'outros', text: 'O retrato de uma mulher indígena em preto e branco. Representa ancestralidade, beleza e resistência dos povos originários.' },
  { category: 'espiritual', featured: true, text: 'Jesus em preto e branco. Símbolo de fé, esperança e compaixão; uma devoção pessoal ou um momento importante guardado na pele.' },
  { category: 'espiritual', text: 'Outra representação de Cristo em preto e branco. Reforça a ideia de luz, orientação e presença constante em meio às dificuldades.' },
  { category: 'animais', featured: true, text: 'O leão em realismo. Sinônimo de força, coragem e orgulho, também pode representar proteção e a capacidade de enfrentar adversidades.' },
  { category: 'animais', text: 'Uma mulher ao lado de um lobo, em cores. A cena fala de instinto, lealdade e companhia, destacando a conexão entre as duas figuras.' },
  { category: 'espiritual', text: 'Odin, o deus nórdico. Representa busca por conhecimento, sacrifício e determinação — um símbolo para quem valoriza a própria jornada.' },
  { category: 'animais', text: 'Uma onça em preto e branco. Símbolo de força silenciosa, agilidade e mistério, ligada à natureza e à presença imponente.' },
  { category: 'simbolos', text: 'As pirâmides. Remetem ao Egito antigo, à busca pela eternidade e ao mistério do além, além de equilíbrio e ambição.' },
  { category: 'espiritual', featured: true, text: 'Anúbis, o guardião das almas. Simboliza proteção, julgamento e a passagem entre mundos — uma imagem de mistério e ancestralidade.' },
  { category: 'animais', text: 'Um cachorro em realismo. Lealdade e proteção, além de uma forma de manter perto a memória de um companheiro.' },
  { category: 'animais', text: 'Uma mulher indígena com um lobo. Fala de instinto, natureza e ancestralidade, misturando força feminina e espírito selvagem.' },
  { category: 'espiritual', text: 'Uma mulher indígena e uma criança. Representa carinho, proteção e continuidade — a família e aquilo que se quer preservar.' },
  { category: 'animais', text: 'Uma lula colossal. Representa o mistério do mar e o que está escondido nas profundezas, entre medo, fascínio e o desconhecido.' },
  { category: 'outros', text: 'Um rosto em preto e branco. Guarda expressão e emoção, podendo retratar alguém importante ou um estado de espírito.' },
  { category: 'outros', text: 'U peça de realismo puro: detalhe, luz e textura. Uma homenagem à capacidade da tatuagem de reproduzir a vida.' },
  { category: 'espiritual', text: 'Shiva. Ligado à criação e à destruição, representa o equilíbrio entre opostos, transformação e renovação constante.' },
  { category: 'outros', text: 'Uma composição surrealista em preto e branco. Brinca com a realidade e coloca a imaginação no lugar da lógica.' },
  { category: 'outros', text: 'Outro surrealismo em preto e branco. Imagens que se misturam e desafiam a percepção, unindo precisão e imaginação.' },
  { category: 'outros', text: 'Mais uma peça surrealista em preto e branco. O contraste entre o detalhe real e o impossível chama atenção para o que não é dito.' },
  { category: 'animais', text: 'Um tubarão colorido. Simboliza força, determinação e movimento, com o respeito pelo poder do oceano.' },
  { category: 'animais', featured: true, text: 'Um tigre colorido com elementos surreais. Representa coragem, energia e presença — uma afirmação de força e individualidade.' },
  { category: 'animais', text: 'Um tigre em realismo. Mostra o lado imponente do animal: poder, foco e a beleza dos detalhes da natureza.' },
];

const CATEGORIES = [
  { id: 'todos', label: 'Todos' },
  { id: 'animais', label: 'Animais' },
  { id: 'floral', label: 'Floral' },
  { id: 'espiritual', label: 'Espiritual' },
  { id: 'simbolos', label: 'Símbolos' },
  { id: 'palavras', label: 'Palavras' },
  { id: 'outros', label: 'Outros' },
];

const WHATSAPP_URL = `https://wa.me/5511985545833?text=${encodeURIComponent('Olá Jow, vim pelo seu site, eu curti muitos seus trabalhos, podemos marcar um horário?')}`;

const filtersEl = document.getElementById('meaning-filters');
const gridEl = document.getElementById('meaning-grid');
const emptyEl = document.getElementById('meaning-empty');

let activeCategory = 'todos';

function buildFilters() {
  if (!filtersEl) return;
  filtersEl.innerHTML = '';

  CATEGORIES.forEach((category) => {
    const count = category.id === 'todos'
      ? artworks.length
      : INFO.filter((item) => item.category === category.id).length;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'ms-filter' + (category.id === activeCategory ? ' is-active' : '');
    button.dataset.category = category.id;
    button.innerHTML = `${category.label}<span>${String(count).padStart(2, '0')}</span>`;
    button.addEventListener('click', () => {
      if (activeCategory === category.id) return;
      activeCategory = category.id;
      buildFilters();
      render();
    });
    filtersEl.appendChild(button);
  });
}

function render() {
  if (!gridEl) return;

  const items = INFO
    .map((item, index) => ({
      ...item,
      index,
      src: artworks[index].src,
      title: item.title || artworks[index].name,
    }))
    .filter((item) => artworks[item.index])
    .filter((item) => activeCategory === 'todos' || item.category === activeCategory);

  if (emptyEl) emptyEl.hidden = items.length > 0;

  gridEl.innerHTML = items.map((item) => `
    <article class="ms-card${item.featured ? ' ms-card--featured' : ''}" data-category="${item.category}">
      <div class="ms-card__media">
        <img src="${item.src}" alt="Tatuagem: ${item.title}" loading="lazy" decoding="async">
        ${item.featured ? '<span class="ms-card__badge">DESTAQUE</span>' : ''}
      </div>
      <div class="ms-card__body">
        <span class="ms-card__cat">${CATEGORIES.find((c) => c.id === item.category).label}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </div>
    </article>
  `).join('');
}

buildFilters();
render();

document.querySelector('.ms-book')?.addEventListener('click', (event) => {
  event.preventDefault();
  window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
});
