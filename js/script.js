class Select {
  constructor(selector, props) {
    this.$el = document.getElementById(selector);
    this.props = props;
    this.selector = selector;
    this.dataTypes = {
      input: this.toggleOpen,
    }

    this.#setup();
    this.#render();
  }

  #setup() {
    this.$el.addEventListener('click', this.clickHandler);
    this.$text = this.$el.querySelector(`[data-value="text"]`)
  }

  #render() {
    const { items, placeholder } = this.props;
    this.$el.classList.add(this.selector);
    this.$el.innerHTML = getTemplateHTML(items, placeholder);
  }

  clickHandler = e => {
    console.log('##### e.target:', e.target);
    this.toggleOpen()
  }

  get current() {
    return this.props.items.find(item => item.id === this.selectedId);
  }

  select(id) {
    this.selectedId = id;
    this.$text.textContent = this.current.value
  }

  get isOpen() {
    return this.$el.classList.contains('open');
  }

  toggleOpen() {
    return this.isOpen ? this.close() : this.open();
  }

  open() {
    this.$el.classList.add('open');
  }

  close() {
    this.$el.classList.remove('open');
  }
}

const select = new Select('select', {
  placeholder: "Select item...",
  selectedId: 6,
  items: [
    { id: 1, title: "React" },
    { id: 2, title: "Vue" },
    { id: 3, title: "HTML" },
    { id: 4, title: "CSS" },
    { id: 5, title: "SASS" },
    { id: 6, title: "JS" },
    { id: 7, title: "Angular" },
    { id: 8, title: "Svelte" }
  ]
})

function getTemplateHTML(list, placeholder) {
  const items = list.map(({ id, title }) => {
    return `<li class="select__item" data-type="item" data-id="${id}">${title}</li>`;
  });
  const text = placeholder ?? "Default item";

  const html = `
    <div data-type="input" class="select__input">
      <span data-value="text">${text}</span>
    </div>
    <div class="select__dropdown">
      <ul class="select__list">
        ${items.join('')}
      </ul>
    </div>
  `

  return html;
}