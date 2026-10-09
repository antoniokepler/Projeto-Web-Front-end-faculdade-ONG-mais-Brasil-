import { buscarVoluntariosSalvos, salvarVoluntario } from './modules/storage.js';
import { isValidCPF, maskCPF, maskPhone, maskCEP } from './modules/validator.js';

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. NAVEGAÇÃO SPA + PERSISTÊNCIA DE PÁGINA (localStorage)
     ------------------------------------------------------------------------ */
  const navLinks = document.querySelectorAll('.nav-link');
  const pages = document.querySelectorAll('.page');
  const navMenu = document.getElementById('navMenu');

  const ultimaPagina = localStorage.getItem('ong_ultima_pagina') || 'inicio';
  mostrarPagina(ultimaPagina);

  function mostrarPagina(targetId) {
    pages.forEach(page => page.classList.remove('active'));

    const targetPage = document.getElementById(targetId);
    if (targetPage) {
      targetPage.classList.add('active');
    }

    navLinks.forEach(l => l.classList.remove('active'));
    document.querySelectorAll(`.nav-link[data-target="${targetId}"]`).forEach(l => l.classList.add('active'));

    localStorage.setItem('ong_ultima_pagina', targetId);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('data-target');
      if (targetId) {
        mostrarPagina(targetId);
        if (navMenu) navMenu.classList.remove('active');
      }
    });
  });

  /* ------------------------------------------------------------------------
     2. MENU HAMBÚRGUER (MOBILE)
     ------------------------------------------------------------------------ */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburgerBtn.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });
  }

  /* ------------------------------------------------------------------------
     3. RENDERIZAÇÃO DINÂMICA DOS PROJETOS (TEMPLATES)
     ------------------------------------------------------------------------ */
  const listaDeProjetos = [
    {
      id: "fome",
      titulo: "Combate à Fome",
      descricao: "Arrecadação e distribuição de cestas básicas para famílias em situação de vulnerabilidade."
    },
    {
      id: "educacao",
      titulo: "Educação Comunitária",
      descricao: "Aulas de reforço escolar, oficinas culturais e capacitação para jovens e adultos."
    },
    {
      id: "apoio",
      titulo: "Apoio Social",
      descricao: "Encaminhamento profissional, assistência jurídica e suporte psicológico comunitário."
    },
    {
      id: "financeiro",
      titulo: "Apoio Financeiro",
      descricao: "Nos ajude contribuindo com qualquer valor para manter nossas sedes ativas."
    }
  ];

  function renderizarProjetos() {
    const container = document.getElementById('containerProjetos');
    if (!container) return;

    container.innerHTML = listaDeProjetos.map(projeto => `
      <div class="card" id="${projeto.id}">
        <h3>${projeto.titulo}</h3>
        <p>${projeto.descricao}</p>
      </div>
    `).join('');
  }

  renderizarProjetos();

  /* ------------------------------------------------------------------------
     4. RENDERIZAÇÃO DA LISTA DE VOLUNTÁRIOS
     ------------------------------------------------------------------------ */
  function renderizarListaVoluntarios() {
    const listaContainer = document.getElementById('listaVoluntarios');
    if (!listaContainer) return;

    const voluntarios = buscarVoluntariosSalvos();

    if (voluntarios.length === 0) {
      listaContainer.innerHTML = '<p style="color: var(--color-text-muted);">Nenhum voluntário cadastrado ainda.</p>';
      return;
    }

    listaContainer.innerHTML = voluntarios.map((v, index) => `
      <div class="card" style="margin-top: 10px; padding: 10px; font-size: 0.95rem;">
        <strong>#${index + 1} - ${v.nome}</strong><br>
        <span>CPF: ${v.cpf} | Tel: ${v.telefone}</span>
      </div>
    `).join('');
  }

  renderizarListaVoluntarios();

  /* ------------------------------------------------------------------------
     5. INTEGRANDO E ATUALIZANDO O CHART.JS EM TEMPO REAL
     ------------------------------------------------------------------------ */
  let meuGrafico = null;

  function inicializarOuAtualizarGrafico() {
    const ctx = document.getElementById('graficoImpacto');
    if (!ctx) return;

    const totalVoluntarios = buscarVoluntariosSalvos().length;
    const dadosProjetos = [1200 + totalVoluntarios, 450, 300, 150];

    if (meuGrafico) {
      meuGrafico.data.datasets[0].data = dadosProjetos;
      meuGrafico.data.datasets[0].label = `Voluntários / Atendimentos (Total de Cadastros: ${totalVoluntarios})`;
      meuGrafico.update();
      return;
    }

    meuGrafico = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Combate à Fome', 'Educação Comunitária', 'Apoio Social', 'Apoio Financeiro'],
        datasets: [{
          label: `Voluntários / Atendimentos (Total de Cadastros: ${totalVoluntarios})`,
          data: dadosProjetos,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(75, 192, 192, 0.6)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  inicializarOuAtualizarGrafico();

  /* ------------------------------------------------------------------------
     6. MÁSCARAS, VALIDAÇÃO E SUBMISSÃO DO FORMULÁRIO
     ------------------------------------------------------------------------ */
  const cpfInput = document.getElementById('cpf');
  const telInput = document.getElementById('telefone');
  const cepInput = document.getElementById('cep');
  const form = document.getElementById('cadForm');

  if (cpfInput) cpfInput.addEventListener('input', (e) => e.target.value = maskCPF(e.target.value));
  if (telInput) telInput.addEventListener('input', (e) => e.target.value = maskPhone(e.target.value));
  if (cepInput) cepInput.addEventListener('input', (e) => e.target.value = maskCEP(e.target.value));

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const cpfErr = document.getElementById('cpfError');

      if (!isValidCPF(cpfInput.value)) {
        cpfInput.classList.add('invalid');
        if (cpfErr) cpfErr.style.display = 'block';
        return;
      } else {
        cpfInput.classList.remove('invalid');
        if (cpfErr) cpfErr.style.display = 'none';
      }

      const novoVoluntario = {
        nome: document.getElementById('nome').value,
        cpf: cpfInput.value,
        telefone: telInput.value,
        cep: cepInput.value
      };

      // Salva usando a função importada de storage.js
      salvarVoluntario(novoVoluntario);

      alert('Cadastro realizado com sucesso!');
      
      form.reset();

      renderizarListaVoluntarios();
      inicializarOuAtualizarGrafico();
    });
  }

});