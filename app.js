(() => {
  "use strict";

  const STORAGE_KEY = "lectura-viva-marica-currea-v1";
  const palettes = [["#e8f1eb", "#527363"], ["#f5eee4", "#917448"], ["#e9edf5", "#60708f"], ["#f3e8e7", "#9d6761"], ["#e8f0f4", "#5a7c8a"], ["#f2eee5", "#8c7956"]];
  const toLocalISO = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const dateOffset = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return toLocalISO(date);
  };
  const initialData = () => ({
    books: [
      { id: "LIB-001", title: "Cien años de soledad", author: "Gabriel García Márquez", genre: "Novela", publisher: "Editorial Sudamericana", year: 1967, isbn: "978-0307474728", copies: 4, location: "A-01", description: "Una obra fundamental de la literatura latinoamericana." },
      { id: "LIB-002", title: "El principito", author: "Antoine de Saint-Exupéry", genre: "Literatura infantil", publisher: "Salamandra", year: 1943, isbn: "978-8498381498", copies: 5, location: "B-03", description: "Un clásico sobre la amistad, la imaginación y el mundo adulto." },
      { id: "LIB-003", title: "La vorágine", author: "José Eustasio Rivera", genre: "Novela", publisher: "Editorial Panamericana", year: 1924, isbn: "978-9583007898", copies: 3, location: "A-02", description: "Novela colombiana ambientada en la selva amazónica." },
      { id: "LIB-004", title: "Matilda", author: "Roald Dahl", genre: "Literatura infantil", publisher: "Loqueleo", year: 1988, isbn: "978-8491221273", copies: 4, location: "B-01", description: "La historia de una niña extraordinaria que ama los libros." },
      { id: "LIB-005", title: "El mundo de Sofía", author: "Jostein Gaarder", genre: "Filosofía", publisher: "Siruela", year: 1991, isbn: "978-8478448159", copies: 2, location: "C-01", description: "Un viaje narrativo por la historia de la filosofía." },
      { id: "LIB-006", title: "Cuentos de la selva", author: "Horacio Quiroga", genre: "Cuento", publisher: "Editorial Norma", year: 1918, isbn: "978-9584512102", copies: 3, location: "B-04", description: "Relatos clásicos protagonizados por animales de la selva." },
      { id: "LIB-007", title: "Colombia, mi abuelo y yo", author: "Irene Vasco", genre: "Cultura colombiana", publisher: "Panamericana", year: 1996, isbn: "978-9583007928", copies: 2, location: "D-02", description: "Un recorrido por la geografía y diversidad de Colombia." },
      { id: "LIB-008", title: "El terror de sexto B", author: "Yolanda Reyes", genre: "Cuento", publisher: "Loqueleo", year: 1995, isbn: "978-9587043855", copies: 3, location: "B-02", description: "Historias divertidas y cercanas de la vida escolar." },
      { id: "LIB-009", title: "Atlas del universo", author: "Varios autores", genre: "Ciencia", publisher: "Parramón", year: 2020, isbn: "978-8434214784", copies: 2, location: "C-03", description: "Una introducción ilustrada al espacio y la astronomía." }
    ],
    students: [
      { id: "EST-1024", name: "Valentina Rojas", grade: "6°", group: "A", phone: "310 555 0142" },
      { id: "EST-1031", name: "Samuel Martínez", grade: "7°", group: "B", phone: "310 555 0198" },
      { id: "EST-1085", name: "Luciana Torres", grade: "8°", group: "A", phone: "310 555 0126" },
      { id: "EST-1112", name: "Mateo Herrera", grade: "9°", group: "C", phone: "310 555 0173" },
      { id: "EST-1160", name: "Isabella Gómez", grade: "5°", group: "B", phone: "310 555 0109" },
      { id: "EST-1204", name: "Nicolás Castro", grade: "10°", group: "A", phone: "310 555 0165" }
    ],
    loans: [
      { id: "PRE-001", bookId: "LIB-001", studentId: "EST-1024", studentName: "Valentina Rojas", grade: "6° A", loanDate: dateOffset(-5), dueDate: dateOffset(9), returnDate: "" },
      { id: "PRE-002", bookId: "LIB-003", studentId: "EST-1031", studentName: "Samuel Martínez", grade: "7° B", loanDate: dateOffset(-10), dueDate: dateOffset(-2), returnDate: "" },
      { id: "PRE-003", bookId: "LIB-004", studentId: "EST-1085", studentName: "Luciana Torres", grade: "8° A", loanDate: dateOffset(-3), dueDate: dateOffset(11), returnDate: "" },
      { id: "PRE-004", bookId: "LIB-002", studentId: "EST-1112", studentName: "Mateo Herrera", grade: "9° C", loanDate: dateOffset(-16), dueDate: dateOffset(-5), returnDate: "" },
      { id: "PRE-005", bookId: "LIB-006", studentId: "EST-1160", studentName: "Isabella Gómez", grade: "5° B", loanDate: dateOffset(-20), dueDate: dateOffset(-6), returnDate: dateOffset(-7) },
      { id: "PRE-006", bookId: "LIB-008", studentId: "EST-1204", studentName: "Nicolás Castro", grade: "10° A", loanDate: dateOffset(-8), dueDate: dateOffset(2), returnDate: "" }
    ]
  });
  let state;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    state = saved ? JSON.parse(saved) : initialData();
    if (!Array.isArray(state.books) || !Array.isArray(state.students) || !Array.isArray(state.loans)) throw new Error("Datos locales incompletos");
  } catch (error) {
    console.error("No se pudieron leer los datos guardados de la biblioteca.", error);
    state = initialData();
  }

  const $ = (selector, root = document) => root.querySelector(selector);
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const save = () => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (error) {
      console.error("No se pudieron guardar los cambios de la biblioteca.", error);
      throw new Error("No fue posible guardar los cambios en este navegador.");
    }
  };
  const todayISO = () => toLocalISO(new Date());
  const formatDate = (value) => value ? new Date(`${value}T12:00:00`).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" }) : "—";
  const activeLoans = () => state.loans.filter((loan) => !loan.returnDate);
  const isOverdue = (loan) => !loan.returnDate && loan.dueDate < todayISO();
  const getBook = (id) => state.books.find((book) => book.id === id);
  const availableCopies = (book) => book.copies - activeLoans().filter((loan) => loan.bookId === book.id).length;
  const nextId = (prefix, items) => {
    const max = items.reduce((largest, item) => {
      const number = Number(String(item.id).split("-").pop());
      return Number.isFinite(number) ? Math.max(largest, number) : largest;
    }, 0);
    return `${prefix}-${String(max + 1).padStart(3, "0")}`;
  };
  const initials = (name) => name.split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase();
  const palette = (index) => palettes[index % palettes.length];
  const bookCover = (book) => {
    const [bg, color] = palette(Math.max(0, state.books.indexOf(book)));
    return `<span class="book-mini" style="--cover:${bg};--cover-ink:${color}">${escapeHTML((book.title || "L").slice(0, 1))}</span>`;
  };
  const statusBadge = (loan) => loan.returnDate
    ? '<span class="badge badge-gray">Devuelto</span>'
    : isOverdue(loan) ? '<span class="badge badge-red">Atrasado</span>' : '<span class="badge badge-green">En préstamo</span>';
  const loanBookCell = (loan) => {
    const book = getBook(loan.bookId);
    return `<div class="book-cell">${book ? bookCover(book) : ""}<span class="cell-primary">${escapeHTML(book?.title || "Libro eliminado")}<span class="cell-secondary">${escapeHTML(loan.id)}</span></span></div>`;
  };
  const emptyTable = (message, cols) => `<tr><td colspan="${cols}"><div class="empty-state"><strong>${escapeHTML(message)}</strong>Prueba con otros términos o registra un nuevo elemento.</div></td></tr>`;
  const setHeader = (title) => { $("#breadcrumb-current").textContent = title; };
  const heading = (eyebrow, title, description, buttonLabel, buttonAction) => `
    <div class="page-heading"><div><span class="eyebrow">${eyebrow}</span><h1>${title}</h1><p>${description}</p></div>
    ${buttonLabel ? `<button class="button button-primary" data-action="${buttonAction}"><span>＋</span>${buttonLabel}</button>` : ""}</div>`;
  const renderDashboard = () => {
    const open = activeLoans();
    const overdue = open.filter(isOverdue);
    const booksTotal = state.books.reduce((sum, book) => sum + Number(book.copies || 0), 0);
    const recent = [...state.loans].sort((a, b) => b.loanDate.localeCompare(a.loanDate)).slice(0, 5);
    $("#page-dashboard").innerHTML = `${heading(`${new Date().toLocaleDateString("es-CO", { weekday: "long" }).toUpperCase()}, BUEN DÍA`, "Tu biblioteca, en un vistazo", "Un espacio para descubrir, aprender y compartir historias.", "Registrar préstamo", "new-loan")}
      <div class="stat-grid">
        <article class="stat-card"><div class="stat-top"><span>Libros en colección</span><span class="stat-icon">▤</span></div><strong>${booksTotal}</strong><div class="stat-foot"><span class="positive">${state.books.length} títulos distintos</span> en el catálogo</div></article>
        <article class="stat-card"><div class="stat-top"><span>Préstamos activos</span><span class="stat-icon gold">⇄</span></div><strong>${open.length}</strong><div class="stat-foot">${state.loans.filter((loan) => loan.returnDate && loan.returnDate.slice(0, 7) === todayISO().slice(0, 7)).length} devoluciones este mes</div></article>
        <article class="stat-card"><div class="stat-top"><span>Por devolver</span><span class="stat-icon red">◷</span></div><strong>${overdue.length}</strong><div class="stat-foot">${overdue.length ? "Requieren seguimiento" : "¡Todo al día!"}</div></article>
        <article class="stat-card"><div class="stat-top"><span>Estudiantes registrados</span><span class="stat-icon">♙</span></div><strong>${state.students.length}</strong><div class="stat-foot">De diferentes grados y cursos</div></article>
      </div>
      <div class="dashboard-grid">
        <section class="panel"><div class="panel-header"><div><h2 class="panel-title">Actividad reciente</h2><p class="panel-subtitle">Los últimos movimientos de la biblioteca</p></div><button class="text-link" data-page="loans">Ver todos →</button></div>
          <div class="table-wrap"><table><thead><tr><th>LIBRO</th><th>ESTUDIANTE</th><th>FECHA</th><th>ESTADO</th></tr></thead><tbody>${recent.length ? recent.map((loan) => `<tr><td>${loanBookCell(loan)}</td><td><span class="cell-primary">${escapeHTML(loan.studentName)}</span><span class="cell-secondary">${escapeHTML(loan.grade)}</span></td><td>${formatDate(loan.loanDate)}</td><td>${statusBadge(loan)}</td></tr>`).join("") : emptyTable("Aún no hay movimientos", 4)}</tbody></table></div>
        </section>
        <section class="panel"><div class="panel-header"><div><h2 class="panel-title">Para tener en cuenta</h2><p class="panel-subtitle">${overdue.length ? `${overdue.length} préstamo${overdue.length === 1 ? "" : "s"} necesita${overdue.length === 1 ? "" : "n"} seguimiento` : "Todo está en orden por ahora"}</p></div><span class="stat-icon ${overdue.length ? "red" : ""}">${overdue.length ? "◷" : "✓"}</span></div>
          <div class="activity-list">${overdue.length ? overdue.slice(0, 4).map((loan) => `<div class="activity-item"><span class="activity-dot overdue">!</span><div><strong>${escapeHTML(loan.studentName)} tiene un libro pendiente</strong><span>${escapeHTML(getBook(loan.bookId)?.title || "Libro")} · venció el ${formatDate(loan.dueDate)}</span></div></div>`).join("") : `<div class="activity-item"><span class="activity-dot">✓</span><div><strong>No hay devoluciones atrasadas</strong><span>Las fechas de entrega están al día.</span></div></div><div class="activity-item"><span class="activity-dot">✦</span><div><strong>${state.books.filter((book) => availableCopies(book) > 0).length} títulos disponibles</strong><span>Listos para encontrar un nuevo lector.</span></div></div>`}
          <div class="activity-item"><span class="activity-dot">＋</span><div><strong>¿Llegaron nuevos libros?</strong><span>Actualiza el catálogo para tenerlo todo al día.</span><button class="text-link" data-action="new-book">Registrar un libro →</button></div></div></div>
        </section>
      </div>`;
  };

  const renderCatalog = () => {
    const query = ($("#catalog-search")?.value || "").trim().toLowerCase();
    const genre = $("#genre-filter")?.value || "";
    const genres = [...new Set(state.books.map((book) => book.genre).filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
    const rows = state.books.filter((book) => {
      const matches = [book.id, book.title, book.author, book.genre, book.isbn, book.location].some((value) => String(value || "").toLowerCase().includes(query));
      return matches && (!genre || book.genre === genre);
    });
    $("#page-catalog").innerHTML = `${heading("COLECCIÓN ESCOLAR", "Catálogo de libros", "Organiza cada título y encuentra el libro ideal para cada lector.", "Añadir libro", "new-book")}
      <div class="toolbar"><label class="search-box"><span class="search-icon">⌕</span><input id="catalog-search" type="search" placeholder="Buscar por título, autor, código, género…" value="${escapeHTML(query)}" aria-label="Buscar libros"></label>
      <select class="filter-select" id="genre-filter" aria-label="Filtrar por género"><option value="">Todos los géneros</option>${genres.map((item) => `<option value="${escapeHTML(item)}"${item === genre ? " selected" : ""}>${escapeHTML(item)}</option>`).join("")}</select><span class="muted-note" style="margin:0 6px">${rows.length} ${rows.length === 1 ? "título" : "títulos"}</span></div>
      <section class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>CÓDIGO / LIBRO</th><th>AUTOR</th><th>GÉNERO</th><th>DISPONIBLES</th><th>UBICACIÓN</th><th>ACCIONES</th></tr></thead><tbody>${rows.length ? rows.map((book) => {
        const available = availableCopies(book);
        return `<tr><td><div class="book-cell">${bookCover(book)}<span><span class="cell-primary">${escapeHTML(book.title)}</span><span class="cell-secondary">${escapeHTML(book.id)} · ${escapeHTML(book.year || "Año n/d")}</span></span></div></td><td>${escapeHTML(book.author)}</td><td><span class="badge badge-gray">${escapeHTML(book.genre)}</span></td><td>${available > 0 ? `<span class="badge badge-green">${available} de ${book.copies}</span>` : '<span class="badge badge-red">Agotado</span>'}</td><td>${escapeHTML(book.location || "—")}</td><td><div class="action-cell"><button class="button button-secondary button-small" data-action="edit-book" data-id="${escapeHTML(book.id)}">Editar</button><button class="button button-danger button-small" data-action="delete-book" data-id="${escapeHTML(book.id)}" aria-label="Eliminar ${escapeHTML(book.title)}">×</button></div></td></tr>`;
      }).join("") : emptyTable("No encontramos libros", 6)}</tbody></table></div></section>`;
    $("#catalog-search").addEventListener("input", renderCatalog);
    $("#genre-filter").addEventListener("change", renderCatalog);
  };

  const renderLoans = () => {
    const query = ($("#loans-search")?.value || "").trim().toLowerCase();
    const filter = $("#loan-filter")?.value || "all";
    const sorted = [...state.loans].sort((a, b) => b.loanDate.localeCompare(a.loanDate));
    const rows = sorted.filter((loan) => {
      const status = loan.returnDate ? "returned" : isOverdue(loan) ? "overdue" : "active";
      const haystack = `${loan.id} ${loan.studentName} ${loan.grade} ${getBook(loan.bookId)?.title || ""} ${loan.studentId}`.toLowerCase();
      return haystack.includes(query) && (filter === "all" || filter === status);
    });
    $("#page-loans").innerHTML = `${heading("CIRCULACIÓN", "Préstamos y devoluciones", "Registra salidas, consulta vencimientos y confirma cada devolución.", "Registrar préstamo", "new-loan")}
      <div class="toolbar"><label class="search-box"><span class="search-icon">⌕</span><input id="loans-search" type="search" placeholder="Buscar por libro, estudiante o código…" value="${escapeHTML(query)}" aria-label="Buscar préstamos"></label>
      <select class="filter-select" id="loan-filter" aria-label="Filtrar préstamos"><option value="all">Todos los movimientos</option><option value="active"${filter === "active" ? " selected" : ""}>En préstamo</option><option value="overdue"${filter === "overdue" ? " selected" : ""}>Atrasados</option><option value="returned"${filter === "returned" ? " selected" : ""}>Devueltos</option></select><span class="muted-note" style="margin:0 6px">${rows.length} movimientos</span></div>
      <section class="panel table-panel"><div class="table-wrap"><table><thead><tr><th>LIBRO</th><th>ESTUDIANTE</th><th>PRÉSTAMO</th><th>FECHA DE DEVOLUCIÓN</th><th>ESTADO</th><th>ACCIÓN</th></tr></thead><tbody>${rows.length ? rows.map((loan) => `<tr><td>${loanBookCell(loan)}</td><td><span class="cell-primary">${escapeHTML(loan.studentName)}</span><span class="cell-secondary">${escapeHTML(loan.studentId)} · ${escapeHTML(loan.grade)}</span></td><td>${formatDate(loan.loanDate)}</td><td>${formatDate(loan.returnDate || loan.dueDate)}</td><td>${statusBadge(loan)}</td><td>${loan.returnDate ? '<span class="cell-secondary">Completado</span>' : `<button class="button button-secondary button-small" data-action="return-book" data-id="${escapeHTML(loan.id)}">Confirmar devolución</button>`}</td></tr>`).join("") : emptyTable("No hay movimientos con este filtro", 6)}</tbody></table></div></section>`;
    $("#loans-search").addEventListener("input", renderLoans);
    $("#loan-filter").addEventListener("change", renderLoans);
  };

  const renderStudents = () => {
    const query = ($("#students-search")?.value || "").trim().toLowerCase();
    const students = [...state.students].sort((a, b) => a.name.localeCompare(b.name, "es")).filter((student) => `${student.name} ${student.id} ${student.grade} ${student.group}`.toLowerCase().includes(query));
    $("#page-students").innerHTML = `${heading("COMUNIDAD LECTORA", "Estudiantes", "Un registro claro para que cada estudiante encuentre su próxima lectura.", "Registrar estudiante", "new-student")}
      <div class="toolbar"><label class="search-box"><span class="search-icon">⌕</span><input id="students-search" type="search" placeholder="Buscar por nombre, código o grado…" value="${escapeHTML(query)}" aria-label="Buscar estudiantes"></label><span class="muted-note" style="margin:0 6px">${students.length} registrados</span></div>
      <div class="student-grid">${students.length ? students.map((student) => {
        const loans = activeLoans().filter((loan) => loan.studentId === student.id);
        return `<article class="student-card"><div class="student-avatar">${escapeHTML(initials(student.name))}</div><div><h3>${escapeHTML(student.name)}</h3><p>${escapeHTML(student.id)} · Grado ${escapeHTML(student.grade)}${student.group ? ` ${escapeHTML(student.group)}` : ""}</p><div class="student-meta">${loans.length ? `<span class="badge ${loans.some(isOverdue) ? "badge-red" : "badge-green"}">${loans.length} libro${loans.length === 1 ? "" : "s"} prestado${loans.length === 1 ? "" : "s"}</span>` : '<span class="badge badge-gray">Sin préstamos activos</span>'}${student.phone ? `<span class="cell-secondary">${escapeHTML(student.phone)}</span>` : ""}</div></div></article>`;
      }).join("") : '<section class="panel empty-state"><strong>No encontramos estudiantes</strong>Prueba con otro nombre o registra un estudiante.</section>'}</div>`;
    $("#students-search").addEventListener("input", renderStudents);
  };

  const renderReports = () => {
    const open = activeLoans();
    const returned = state.loans.filter((loan) => loan.returnDate);
    const byGenre = state.books.reduce((counts, book) => { counts[book.genre || "Sin género"] = (counts[book.genre || "Sin género"] || 0) + Number(book.copies || 0); return counts; }, {});
    const max = Math.max(1, ...Object.values(byGenre));
    const popular = Object.entries(state.loans.reduce((counts, loan) => { counts[loan.bookId] = (counts[loan.bookId] || 0) + 1; return counts; }, {})).sort((a, b) => b[1] - a[1]).slice(0, 5);
    $("#page-reports").innerHTML = `${heading("DATOS PARA CRECER", "Informes de biblioteca", "Una mirada sencilla al uso de la colección y a la circulación de libros.", "", "")}
      <div class="report-grid"><article class="panel report-card"><span class="eyebrow">MOVIMIENTOS REGISTRADOS</span><strong>${state.loans.length}</strong><p>${open.length} préstamos activos · ${returned.length} devoluciones completadas</p></article><article class="panel report-card"><span class="eyebrow">TÍTULOS MÁS SOLICITADOS</span>${popular.length ? popular.map(([id, count], index) => `<div class="activity-item"><span class="activity-dot">${index + 1}</span><div><strong>${escapeHTML(getBook(id)?.title || "Libro eliminado")}</strong><span>${count} préstamo${count === 1 ? "" : "s"}</span></div></div>`).join("") : '<p class="muted-note">Aún no hay préstamos registrados.</p>'}</article>
      <article class="panel" style="grid-column:1/-1"><div class="panel-header"><div><h2 class="panel-title">Colección por género</h2><p class="panel-subtitle">Número de ejemplares registrados en cada categoría</p></div></div><div class="genre-list">${Object.entries(byGenre).sort((a,b) => b[1] - a[1]).map(([genre, count]) => `<div class="genre-row"><span>${escapeHTML(genre)}</span><div class="genre-bar"><span style="width:${Math.max(4, count / max * 100)}%"></span></div><strong>${count}</strong></div>`).join("")}</div></article></div>`;
  };

  const pageRenderers = { dashboard: renderDashboard, catalog: renderCatalog, loans: renderLoans, students: renderStudents, reports: renderReports };
  const pageTitles = { dashboard: "Panel general", catalog: "Catálogo de libros", loans: "Préstamos", students: "Estudiantes", reports: "Informes" };
  const renderAll = () => {
    Object.values(pageRenderers).forEach((render) => render());
    $("#nav-book-count").textContent = state.books.length;
    $("#nav-loan-count").textContent = activeLoans().length;
    $("#today-label").textContent = new Date().toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short" });
    $("#footer-year").textContent = new Date().getFullYear();
  };
  const navigate = (page) => {
    if (!pageRenderers[page]) return;
    document.querySelectorAll(".page-view").forEach((view) => view.classList.toggle("active", view.id === `page-${page}`));
    document.querySelectorAll(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.page === page));
    setHeader(pageTitles[page]);
    $("#sidebar").classList.remove("open");
  };
  const toast = (message, error = false) => {
    const item = document.createElement("div");
    item.className = `toast${error ? " error" : ""}`;
    item.textContent = message;
    $("#toast-region").append(item);
    setTimeout(() => item.remove(), 3500);
  };
  const closeModal = () => { $("#modal-backdrop").classList.remove("open"); $("#modal-backdrop").setAttribute("aria-hidden", "true"); };
  const field = (name, label, options = {}) => {
    const full = options.full ? " full" : "";
    const required = options.required ? ' <span class="required">*</span>' : "";
    let control;
    if (options.options) {
      control = `<select class="field-input" name="${name}"${options.required ? " required" : ""}>${options.options.map((option) => `<option value="${escapeHTML(option.value)}"${option.value === options.value ? " selected" : ""}>${escapeHTML(option.label)}</option>`).join("")}</select>`;
    } else if (options.textarea) {
      control = `<textarea class="field-input" name="${name}" placeholder="${escapeHTML(options.placeholder || "")}">${escapeHTML(options.value || "")}</textarea>`;
    } else {
      control = `<input class="field-input" name="${name}" type="${options.type || "text"}" value="${escapeHTML(options.value || "")}" placeholder="${escapeHTML(options.placeholder || "")}"${options.required ? " required" : ""}${options.min !== undefined ? ` min="${options.min}"` : ""}${options.max !== undefined ? ` max="${options.max}"` : ""}>`;
    }
    return `<div class="form-field${full}"><label for="field-${name}">${label}${required}</label>${control.replace(`name="${name}"`, `id="field-${name}" name="${name}"`)}</div>`;
  };
  const showModal = ({ title, fields, submit, submitLabel = "Guardar" }) => {
    $("#modal-title").textContent = title;
    $("#modal-fields").innerHTML = fields;
    $("#modal-submit").textContent = submitLabel;
    $("#modal-form").onsubmit = (event) => {
      event.preventDefault();
      const values = Object.fromEntries(new FormData(event.currentTarget).entries());
      try {
        submit(values);
        closeModal();
        renderAll();
      } catch (error) {
        console.error("No se pudo completar la operación de biblioteca.", error);
        toast(error.message || "No se pudo completar la operación.", true);
      }
    };
    $("#modal-backdrop").classList.add("open");
    $("#modal-backdrop").setAttribute("aria-hidden", "false");
    $("#modal-fields input, #modal-fields select").focus();
  };
  const openBookForm = (id = "") => {
    const book = state.books.find((item) => item.id === id);
    const genres = ["Novela", "Literatura infantil", "Cuento", "Ciencia", "Filosofía", "Poesía", "Historia", "Cultura colombiana", "Arte", "Otro"];
    showModal({
      title: book ? "Editar información del libro" : "Registrar un libro",
      fields: `${field("id", "Código del libro", { value: book?.id || nextId("LIB", state.books), placeholder: "Ej. LIB-010", required: true })}${field("title", "Nombre del libro", { value: book?.title || "", placeholder: "Título completo", required: true })}${field("author", "Autor o autora", { value: book?.author || "", placeholder: "Nombre del autor", required: true })}${field("genre", "Género", { value: book?.genre || "Novela", options: genres.map((value) => ({ value, label: value })) })}${field("publisher", "Editorial", { value: book?.publisher || "", placeholder: "Nombre de la editorial" })}${field("year", "Año de publicación", { type: "number", value: book?.year || "", min: 1000, max: new Date().getFullYear() })}${field("isbn", "ISBN", { value: book?.isbn || "", placeholder: "978-…" })}${field("copies", "Cantidad de ejemplares", { type: "number", value: book?.copies ?? 1, min: 1, required: true })}${field("location", "Ubicación / estante", { value: book?.location || "", placeholder: "Ej. A-01" })}${field("description", "Descripción", { textarea: true, full: true, value: book?.description || "", placeholder: "Una breve descripción para identificar el libro" })}`,
      submitLabel: book ? "Guardar cambios" : "Añadir al catálogo",
      submit: (values) => {
        const code = values.id.trim();
        if (state.books.some((item) => item.id.toLowerCase() === code.toLowerCase() && item.id !== id)) throw new Error("Ya existe un libro con ese código.");
        const copies = Number(values.copies);
        const currentlyLoaned = book ? book.copies - availableCopies(book) : 0;
        if (!Number.isInteger(copies) || copies < 1 || copies < currentlyLoaned) throw new Error(`La cantidad debe ser un número entero de al menos ${Math.max(1, currentlyLoaned)}.`);
        const updated = { ...values, id: code, year: values.year ? Number(values.year) : "", copies };
        if (book) {
          if (book.id !== code) state.loans.forEach((loan) => { if (loan.bookId === book.id) loan.bookId = code; });
          Object.assign(book, updated);
        }
        else state.books.push(updated);
        save();
        toast(book ? "Información del libro actualizada." : "Libro añadido al catálogo.");
      }
    });
  };
  const openLoanForm = () => {
    const availableBooks = state.books.filter((book) => availableCopies(book) > 0);
    if (!availableBooks.length) { toast("No hay ejemplares disponibles para prestar.", true); return; }
    const today = todayISO();
    const students = state.students;
    const defaultMode = students.length ? "registered" : "custom";
    const modeOptions = [
      { value: "registered", label: "Elegir estudiante registrado" },
      { value: "custom", label: "Ingresar estudiante manualmente" }
    ];
    const studentFields = `${field("studentMode", "Estudiante", { value: defaultMode, options: modeOptions, full: true })}<div class="student-fields-group${students.length ? "" : " is-hidden"}" id="registered-student-fields">${field("studentId", "Estudiante registrado", { options: students.map((student) => ({ value: student.id, label: `${student.name} · ${student.grade}${student.group ? ` ${student.group}` : ""}` })) })}</div><div class="student-fields-group${students.length ? " is-hidden" : ""}" id="custom-student-fields">${field("studentName", "Nombre completo", { placeholder: "Nombre y apellidos" })}${field("grade", "Curso / grado", { placeholder: "Ej. 6° A" })}</div>`;
    const fields = `${field("bookId", "Libro disponible", { required: true, options: availableBooks.map((book) => ({ value: book.id, label: `${book.title} · ${availableCopies(book)} disponible(s)` })) })}${studentFields}${field("loanDate", "Fecha del préstamo", { type: "date", value: today, required: true })}${field("dueDate", "Fecha de devolución", { type: "date", value: dateOffset(14), required: true })}`;
    showModal({
      title: "Registrar un préstamo",
      fields,
      submitLabel: "Confirmar préstamo",
      submit: (values) => {
        const student = values.studentMode === "registered" ? state.students.find((item) => item.id === values.studentId) : null;
        if (!getBook(values.bookId) || availableCopies(getBook(values.bookId)) < 1) throw new Error("Este libro ya no tiene ejemplares disponibles.");
        if (values.dueDate < values.loanDate) throw new Error("La fecha de devolución no puede ser anterior a la fecha del préstamo.");
        if (values.studentMode === "registered" && !student) throw new Error("Selecciona un estudiante registrado.");
        if (values.studentMode === "custom" && (!values.studentName.trim() || !values.grade.trim())) throw new Error("Escribe el nombre y el curso del estudiante.");
        const name = student?.name || values.studentName.trim();
        const loanId = nextId("PRE", state.loans);
        const studentId = student?.id || `INV-${loanId.split("-").pop()}`;
        state.loans.push({ id: loanId, bookId: values.bookId, studentId, studentName: name, grade: student ? `${student.grade}${student.group ? ` ${student.group}` : ""}` : values.grade.trim(), loanDate: values.loanDate, dueDate: values.dueDate, returnDate: "" });
        save();
        toast(`Préstamo registrado para ${name}.`);
        navigate("loans");
      }
    });
    const modeSelect = $("#field-studentMode");
    const registeredFields = $("#registered-student-fields");
    const customFields = $("#custom-student-fields");
    const registeredSelect = $("#field-studentId");
    const customName = $("#field-studentName");
    const customGrade = $("#field-grade");
    const updateStudentMode = () => {
      const isCustom = modeSelect.value === "custom";
      registeredFields.classList.toggle("is-hidden", isCustom);
      customFields.classList.toggle("is-hidden", !isCustom);
      registeredSelect.required = !isCustom;
      registeredSelect.disabled = isCustom;
      customName.required = isCustom;
      customGrade.required = isCustom;
      customName.disabled = !isCustom;
      customGrade.disabled = !isCustom;
    };
    modeSelect.addEventListener("change", updateStudentMode);
    updateStudentMode();
  };
  const openStudentForm = () => showModal({
    title: "Registrar un estudiante",
    fields: `${field("id", "Código estudiantil", { required: true, placeholder: "Ej. EST-1240" })}${field("name", "Nombre completo", { required: true, placeholder: "Nombre y apellidos" })}${field("grade", "Grado", { required: true, placeholder: "Ej. 6°" })}${field("group", "Curso / grupo", { placeholder: "Ej. A" })}${field("phone", "Teléfono de contacto", { type: "tel", placeholder: "Opcional" })}`,
    submitLabel: "Registrar estudiante",
    submit: (values) => {
      if (state.students.some((student) => student.id.toLowerCase() === values.id.trim().toLowerCase())) throw new Error("Ya existe un estudiante con ese código.");
      state.students.push({ id: values.id.trim(), name: values.name.trim(), grade: values.grade.trim(), group: values.group.trim(), phone: values.phone.trim() });
      save();
      toast("Estudiante registrado correctamente.");
      navigate("students");
    }
  });
  const handleAction = (action, id) => {
    if (action === "new-book") openBookForm();
    if (action === "edit-book") openBookForm(id);
    if (action === "new-loan") openLoanForm();
    if (action === "new-student") openStudentForm();
    if (action === "return-book") {
      const loan = state.loans.find((item) => item.id === id);
      if (!loan || loan.returnDate) return;
      loan.returnDate = todayISO();
      try { save(); } catch (error) { toast(error.message, true); return; }
      renderAll();
      toast(`Devolución de ${getBook(loan.bookId)?.title || "libro"} registrada.`);
    }
    if (action === "delete-book") {
      const book = getBook(id);
      if (!book) return;
      if (state.loans.some((loan) => loan.bookId === id)) { toast("No se puede eliminar un libro con historial de préstamos.", true); return; }
      if (window.confirm(`¿Eliminar "${book.title}" del catálogo? Esta acción no se puede deshacer.`)) {
        state.books = state.books.filter((item) => item.id !== id);
        try { save(); } catch (error) { toast(error.message, true); return; }
        renderAll();
        toast("Libro eliminado del catálogo.");
      }
    }
  };

  document.addEventListener("click", (event) => {
    const navigation = event.target.closest("[data-page]");
    if (navigation) { event.preventDefault(); navigate(navigation.dataset.page); return; }
    const action = event.target.closest("[data-action]");
    if (action) handleAction(action.dataset.action, action.dataset.id);
  });
  $("#modal-close").addEventListener("click", closeModal);
  $("#modal-cancel").addEventListener("click", closeModal);
  $("#modal-backdrop").addEventListener("click", (event) => { if (event.target === $("#modal-backdrop")) closeModal(); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });
  $("#menu-toggle").addEventListener("click", () => $("#sidebar").classList.toggle("open"));

  renderAll();
})();
