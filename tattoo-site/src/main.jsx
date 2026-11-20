import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import DepoimentosCircular from './components/DepoimentosCircular.jsx';
import depoimento01 from '../assets/DEPOIMENTOS/Gabriel Souza.png';
import depoimento02 from '../assets/DEPOIMENTOS/Lana fontes.png';
import depoimento03 from '../assets/DEPOIMENTOS/Lucas Germano.png';
import depoimento04 from '../assets/DEPOIMENTOS/Luciana Brasil.png';
import depoimento05 from '../assets/DEPOIMENTOS/Michel vaz.png';
import depoimento06 from '../assets/DEPOIMENTOS/Raquel e Luiz.png';
import depoimento07 from '../assets/DEPOIMENTOS/Roberto Cruz.png';
import DepthCarousel from './components/DepthCarousel.jsx';
import SpecularButton from './components/SpecularButton.jsx';
import StarBorder from './components/StarBorder.jsx';
import jhowPortrait from '../assets/Foto do Jhow para Bio.png';
import jhowSeated from '../assets/Foto do Jhow para Bio 2 .png';
import jhowCloseup from '../assets/Foto do Jhow para Bio 3 .png';

const WHATSAPP_URL = `https://wa.me/5511985545833?text=${encodeURIComponent('Olá Jow, vim pelo seu site, eu curti muitos seus trabalhos, podemos marcar um horário?')}`;

// Depoimentos da seção DEPOIMENTOS. `preview` aparece no card e `full` no modal.
const depoimentos = [
  {
    name: 'Gabriel Souza',
    photo: depoimento01,
    preview: 'Sou amigo do Jhow faz anos, acompanhei ele desde o início. O traço dele evoluiu demais, hj é outro nível.',
    full: 'Cara, sou amigo do Jhow faz tempo, acompanhei ele desde quando ele ainda tava começando, na garagem de casa mesmo. Vi a evolução do cara de perto, sério, o traço dele hj é outro nível. Fiz o braço todo com ele e até hj o pessoal para na rua pra perguntar quem fez kkk. Vlw Jhow, tu é foda. Torus é o único lugar q eu indico pra quem me pergunta, sem medo.',
  },
  {
    name: 'Lana fontes',
    photo: depoimento02,
    preview: 'Cai no site da Torus pelo google e fiquei viciada nos trabalhos. Mandei msg no zap e já marcamos.',
    full: 'Na real tava só matando tempo no cel e caí no site da Torus. Abri a galeria e fiquei igual doida olhando as foto, fiquei mt tempo lá kkk. Nem pensei 2x, mandei msg no zap msm. O Jhow respondeu rapidinho e me explicou tudo certinho, sem enrolação. Fiz uma fine line na costela e saí de lá encantada. Recomendo demais, sério, n é papo não.',
  },
  {
    name: 'Lucas Germano',
    photo: depoimento03,
    preview: 'Amigo próximo do Jhow faz anos. Vi ele crescer na arte e hoje não perco uma sessão na Torus.',
    full: 'Eu e o Jhow somos amigos próximos faz anos, fomos vizinhos na época da escola. Acompanhei ele desde o primeiro aparelho q ele comprou, vi ele treinar em papel, vi ele melhorar, vi a Torus nascer. Hoje o cara é monstro, não tem como negar. Já fiz umas 4 e todas ficaram impecáveis. Se alguém me pergunta onde tatuar, eu falo: vai na Torus e não erra.',
  },
  {
    name: 'Luciana Brasil',
    photo: depoimento04,
    preview: 'Fui indicada por uma amiga que já tatuou com o Jhow. Superou tudo o que ela me falou.',
    full: 'Fui indicada por uma amiga, ela fez uma tatuagem com o Jhow e não parava de elogiar. Fui confiando e olha, superou o q ela falou. O atendimento é mt tranquilo, o cara explica tudo, não faz aquela pressão de querer logo. Fiz uma costela e doeu mt pouco, juro kkk. Só tenho q agradecer, vlw Jhow e vlw Torus.',
  },
  {
    name: 'Michel vaz',
    photo: depoimento05,
    preview: 'Entrei no site da Torus e fiquei de queixo caído com os trabalhos. Realismo do cara é louco.',
    full: 'Entrei no site da Torus pq um colega falou do estúdio e olha... fiquei de queixo caído com os trabalhos. Fui ver a galeria e acabei passando umas horas lá. O realismo do Jhow é mt foda, às vezes parece foto mesmo. Mandei msg, falimos do q eu queria e ele me ajudou a adaptar o desenho pro braço. Ficou melhor do q eu imaginava. Nota 10, sem erro.',
  },
  {
    name: 'Raquel e Luiz',
    photo: depoimento06,
    preview: 'Eu e o Luiz fizemos tatuagem juntos na Torus. O Jhow tratou a gente como família.',
    full: 'A gente é amigo do Jhow e não podia ser diferente: fizemos as tatuagens juntos na Torus. Ele recebeu a gente mt bem, deu um monte de dica, rimos o tempo todo. Eu fiz uma floral e o Luiz um retrato do cachorro dele, os dois ficaram lindos, mt detalhe. Já voltamos outras vezes e sempre é a mesma vibe boa. Recomendamos demais, sério, é o melhor estúdio da região.',
  },
  {
    name: 'Roberto Cruz',
    photo: depoimento07,
    preview: 'Acompanho o Jhow desde os primeiros trabalhos. Hoje a Torus é referência e eu tenho orgulho.',
    full: 'Eu acompanho o Jhow desde os primeiros trabalhos dele, quando ainda tava ali no começo, tudo simples. Hoje vejo a Torus virar referência e fico mt feliz por ele, mereceu cada passo. Já fiz umas tatuagens e todas ficaram do jeito q eu queria, com aquele cuidado que só quem gosta do q faz tem. Pra mim não tem outro lugar. Valeu Jhow, continue assim, o cara é bom demais.',
  },
];

const jhowPhotos = [
  { image: jhowPortrait, alt: 'Retrato em preto e branco do Jhow' },
  { image: jhowSeated, alt: 'Jhow sentado no estúdio' },
  { image: jhowCloseup, alt: 'Retrato aproximado do Jhow' },
];

let depoimentosRoot;
let jhowRoot;
let sessaoRoot;
let galeriaRoot;
let clienteRoot;
let significadosRoot;

window.initMeaningButton = () => {
  const container = document.querySelector('#significados-button-root');
  if (!container || significadosRoot) return;

  significadosRoot = createRoot(container);
  flushSync(() => {
    significadosRoot.render(
      <StarBorder
        as="a"
        href="/significados"
        color="#ffffff"
        trailColor="#ffffff"
        duration={4}
        direction="clockwise"
        stars={1}
        trailLength={0.3}
        thickness={1}
        radius={6}
        glow={0.6}
        hover="lap"
        sparkle={false}
        theme="dark"
      >
        Significados
        <svg className="galeria-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 17L17 7" />
          <path d="M8 7h9v9" />
        </svg>
      </StarBorder>,
    );
  });
};

window.initClientInfoButton = () => {
  const container = document.querySelector('#cliente-button-root');
  if (!container || clienteRoot) return;

  clienteRoot = createRoot(container);
  flushSync(() => {
    clienteRoot.render(
      <StarBorder
        as="a"
        href="/informacoes-do-cliente"
        color="#ffffff"
        trailColor="#ffffff"
        duration={4}
        direction="clockwise"
        stars={1}
        trailLength={0.3}
        thickness={1}
        radius={6}
        glow={0.6}
        hover="lap"
        sparkle={false}
        theme="dark"
      >
        Informações do cliente
        <svg className="galeria-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 17L17 7" />
          <path d="M8 7h9v9" />
        </svg>
      </StarBorder>,
    );
  });
};

window.initGaleriaButton = () => {
  const container = document.querySelector('#galeria-button-root');
  if (!container || galeriaRoot) return;

  galeriaRoot = createRoot(container);
  flushSync(() => {
    galeriaRoot.render(
      <StarBorder
        as="a"
        href="/galeria"
        color="#ffffff"
        trailColor="#ffffff"
        duration={4}
        direction="clockwise"
        stars={1}
        trailLength={0.3}
        thickness={1}
        radius={6}
        glow={0.6}
        hover="lap"
        sparkle={false}
        clickPulse
        theme="dark"
      >
        Entrar na galeria
        <svg className="galeria-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 17L17 7" />
          <path d="M8 7h9v9" />
        </svg>
      </StarBorder>,
    );
  });
};

window.initSessaoButton = () => {
  const container = document.querySelector('#sessao-button-root');
  if (!container || sessaoRoot) return;

  sessaoRoot = createRoot(container);
  flushSync(() => {
    sessaoRoot.render(
      <SpecularButton
        size="lg"
        radius={18}
        tint="#ffffff"
        tintOpacity={0.04}
        textColor="#f5f5f5"
        lineColor="#ffffff"
        baseColor="#525252"
        intensity={1}
        idleIntensity={0.35}
        shineSize={10}
        shineFade={34}
        thickness={1.2}
        glow={1}
        followMouse
        proximity={250}
        onClick={() => window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer')}
      >
        marcar uma sessão
      </SpecularButton>,
    );
  });
};

window.initDepoimentosCarousel = () => {
  const container = document.querySelector('#depoimentos-carousel-root');
  if (!container || depoimentosRoot) return;

  depoimentosRoot = createRoot(container);
  flushSync(() => {
    depoimentosRoot.render(
      <DepoimentosCircular items={depoimentos} />,
    );
  });

  requestAnimationFrame(() => window.ScrollTrigger?.refresh());
};

window.initJhowCarousel = () => {
  const container = document.querySelector('#jhow-carousel-root');
  if (!container || jhowRoot) return;

  jhowRoot = createRoot(container);
  flushSync(() => {
    jhowRoot.render(
      <DepthCarousel
        items={jhowPhotos}
        cardWidth={300}
        cardHeight={420}
        radius={8}
        tint="#0a0a0a"
        depth={150}
        spread={56}
        tilt={16}
        tiltDirection="right"
        perspective={1300}
        visibleCards={2.2}
        falloff={0.17}
        blur={2}
        duration={700}
        loop
        showControls
        showIndicators
        captureWheel={false}
        onReady={(api) => { window.jhowCarouselApi = api; }}
        className="jhow-depth-carousel"
      />,
    );
  });
};
