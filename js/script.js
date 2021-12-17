class Select {
  constructor(selector, props) {
    this.$el = document.getElementById(selector);
    this.props = props;
    this.selector = selector;
    this.selectedId = props.selectedId;

    this.#render();
    this.#setup();
    this.currentSelected = {
      item: this.$el.querySelector(`[data-id="${this.selectedId}"]`)
    };
  }

  #setup() {
    this.$el.addEventListener('click', this.clickHandler);
    this.$text = this.$el.querySelector(`[data-value="text"]`);
    if (this.selectedId) {
      this.$text.textContent = this.current.title;
      this.$text.parentElement.classList.add('picked');
    }
  }

  #render() {
    const { items, placeholder } = this.props;
    this.$el.classList.add(this.selector);
    this.$el.innerHTML = getTemplateHTML(items, placeholder, this.selectedId);

  }

  clickHandler = e => {
    const { type } = e.target.dataset;
    if (type === 'input') {
      this.toggleOpen();
    } else if (type === 'item') {
      const { id } = e.target.dataset;
      this.selectItem(id);
      this.close();
    } else if (type === 'backdrop') {
      this.close();
    }
  }

  selectItem(id) {
    this.selectedId = Number(id);
    const selectedItem = this.$el.querySelector(`[data-id="${id}"]`);
    this.$text.textContent = selectedItem.textContent;
    selectedItem.classList.add('selected');
    this.currentSelected.item?.classList.remove('selected');
    this.currentSelected = { item: selectedItem };
    this.props.onSelect(this.current);
    this.$text.parentElement.classList.add('picked');
  }

  get current() {
    return this.props.items.find((item) => item.id === this.selectedId);
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
  // placeholder: "",
  placeholder: {
    text: "Select item...",
    className: "select__text"
  },
  // selectedId: 6,
  items: [
    { id: 1, title: "React" },
    { id: 2, title: "Vue" },
    { id: 3, title: "HTML" },
    { id: 4, title: "CSS" },
    { id: 5, title: "SASS" },
    { id: 6, title: "JS" },
    { id: 7, title: "Angular" },
    { id: 8, title: "Svelte" }
  ],
  onSelect(item) { console.log(`Selected Item is `, item) }
}

)

function getTemplateHTML(list, placeholder = {}, selectedId) {
  const items = list.map(({ id, title }) => {
    const selected = selectedId === id ? 'selected' : '';
    return `<li class="select__item ${selected}" data-type="item" data-id="${id}">${title}</li>`;
  });

  const text = placeholder.text ?? "Default item";

  const html = `
    <div class="select__backdrop" data-type="backdrop"></div>
    <div data-type="input" class="select__input">
      <span data-value="text" class="${placeholder.className || "select__text"}">${text}</span>
    </div>
    <div class="select__dropdown">
      <ul class="select__list">
        ${items.join('')}
      </ul>
    </div>
  `

  return html;
}