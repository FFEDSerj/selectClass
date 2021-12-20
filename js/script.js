class Select {
  constructor(selector, props) {
    this.$el = document.getElementById(selector);
    this.props = props;
    this.selector = selector;
    this.selectedId = props.selectedId;
    this.keyboard = props.keyboard;
    this.keyCodes = {
      "Escape": "Escape",
      "Enter": "Enter",
      "ArrowUp": "ArrowUp",
      "ArrowDown": "ArrowDown",
      " ": "Space"
    };
    this.search = {
      debounce: null,
      term: ''
    }

    this.#render();
    this.#setup();
    this.$items = [...this.$el.querySelectorAll(`[data-type="item"]`)];
    this.formattedOptions = this.$items.reduce((acc, element) => {
      const { id } = element.dataset;
      const itemInfo = {
        [id]: {
          element,
          id,
          label: element.textContent,
        }
      }
      return { ...acc, ...itemInfo }
    }, {});
  }

  #setup() {
    this.$el.addEventListener('click', this.clickHandler);
    this.keyboard && this.$el.addEventListener('keyup', this.keyBoardHandler);
    this.$text = this.$el.querySelector(`[data-type="text"]`);
    if (this.selectedId) {
      this.$text.textContent = this.current.title;
      this.$text.parentElement.classList.add('picked');
      this.$el.querySelector(`[data-id="${this.selectedId}"]`).classList.add('selected');
    }
  }

  #render() {
    const { items, placeholder } = this.props;
    this.$el.classList.add(this.selector);
    this.keyboard && (this.$el.tabIndex = '0');
    this.$el.innerHTML = getTemplateHTML(items, placeholder, this.selectedId);
  }

  keyBoardHandler = e => this.useActionOnParticularKey(e.key);

  useActionOnParticularKey(key) {
    // const input = document.getElementById('keyboardInput');
    const len = Object.keys(this.formattedOptions).length;
    switch (key) {
      case " ":
        this.toggleOpen();
        break;
      case "ArrowUp":
        if (!this.selectedId) {
          this.selectItem(len)
        } else {
          this.selectedId !== 1 ? this.selectItem(this.selectedId - 1) : this.selectItem(len);
        }
        break;
      case "ArrowDown":
        if (!this.selectedId) {
          this.selectItem(1);
        } else {
          this.selectedId !== len ? this.selectItem(Number(this.selectedId) + 1) : this.selectItem(1);
        }
        break;
      case "Enter":
      case "Escape":
        this.close();
        break;
      default:
        clearTimeout(this.search.debounce);
        this.search.term += key;
        // input.textContent += key;
        // this.search.debounce = setTimeout(() => {
        //   this.search.term = '';
        //   input.textContent = '';
        // }, 500);
        this.search.debounce = setTimeout(() => this.search.term = '', 500);

        const searchedOption = Object.entries(this.formattedOptions).find(([key, option]) => {
          return option.label.toLowerCase().startsWith(this.search.term.toLocaleLowerCase());
        });
        searchedOption && this.selectItem(searchedOption[1].id);
    }
  }

  clickHandler = e => {
    const { type } = e.target.dataset;
    if (type === 'input' || type === "text") {
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
    this.selectedId && this.formattedOptions[this.selectedId].element.classList.remove('selected');
    this.formattedOptions[id].element.classList.add('selected');
    this.formattedOptions[id].element.scrollIntoView({ block: "nearest" });
    this.selectedId = id;
    this.selectedId && this.$text.parentElement.classList.add('picked');
    this.$text.textContent = this.formattedOptions[id].label;
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
  keyboard: true,
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
});

function getTemplateHTML(list, placeholder = {}, selectedId) {
  const items = list.map(({ id, title }) => {
    const selected = selectedId === id ? 'selected' : '';
    return `<li class="select__item ${selected}" data-type="item" data-id="${id}">${title}</li>`;
  });

  const text = placeholder.text ?? "Default item";

  const html = `
    <div class="select__backdrop" data-type="backdrop"></div>
    <div data-type="input" class="select__input">
      <span data-type="text" class="${placeholder.className || "select__text"}">${text}</span>
    </div>
    <div class="select__dropdown">
      <ul class="select__list">
        ${items.join('')}
      </ul>
    </div>
  `

  return html;
}
