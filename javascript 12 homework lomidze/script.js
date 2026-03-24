const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const itemsLeft = document.getElementById('items-left');
const clearBtn = document.getElementById('clear-completed');
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const navLinks = Array.from(document.querySelectorAll('.nav-link'));
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
let todos = JSON.parse(localStorage.getItem('todos') || '[]');
let filter = 'all';
function save(){
  localStorage.setItem('todos', JSON.stringify(todos));
}
function render(){
  list.innerHTML = '';
  const visible = todos.filter(t => filter === 'all' ? true : filter === 'active' ? !t.done : t.done);
  visible.forEach(t => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (t.done ? ' completed' : '');
    li.dataset.id = t.id;
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!t.done;
    checkbox.addEventListener('change', () => {
      t.done = checkbox.checked;
      save();
      render();
    });
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = t.text;
    const actions = document.createElement('div');
    actions.className = 'todo-actions';
    const del = document.createElement('button');
    del.className = 'icon-btn';
    del.innerHTML = '✕';
    del.addEventListener('click', () => {
      todos = todos.filter(x => x.id !== t.id);
      save();
      render();
    });
    actions.appendChild(del);
    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(actions);
    list.appendChild(li);
  });
  const left = todos.filter(t => !t.done).length;
  itemsLeft.textContent = `${left} item${left !== 1 ? 's' : ''} left`;
  filterButtons.forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
  navLinks.forEach(n => n.classList.toggle('active', n.dataset.filter === filter));
}
form.addEventListener('submit', e => {
  e.preventDefault();
  const val = input.value.trim();
  if (!val) return;
  todos.unshift({ id: Date.now().toString(36), text: val, done: false });
  input.value = '';
  save();
  render();
});
clearBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.done);
  save();
  render();
});
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filter = btn.dataset.filter;
    render();
  });
});
navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    filter = link.dataset.filter;
    render();
  });
});
menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open);
});
render();