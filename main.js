(() => {

  class ComponentError extends Error {
    constructor(element) {
      super(`Ошибка. Элемент "${element}" в DOM не найден`);
      this.element = element;
    }
  }

  class Component {

    constructor({
      selector,
      // showLoader = true,
      // showErrorState = true
    }) {

      this.$parent = document.querySelector(selector);
      if (!this.$parent) {
        throw new ComponentError(selector);
      }
      // this.showLoader = showLoader;
      // this.showErrorState = showErrorState;
    }


    async fetchCardData(card, id) {

      let spinner = document.createElement('div');
      spinner.classList.add('spinner-border');
      card.append(spinner);

      let cardData = await fetch(`https://fakestoreapi.com/products/${id}`)
        .then(res => res.json());

      spinner.style.display = 'none';
      return cardData;
    }

    renderCard(card, cardData) {

      let title = document.createElement('p');
      title.classList.add('store__card-title');
      title.textContent = cardData.title;
      card.append(title);

      let picture = document.createElement('img');
      picture.classList.add('store__card-img');
      picture.src = cardData.image;
      card.append(picture);

      let price = document.createElement('p');
      price.classList.add('store__card-price');
      price.textContent = `Price: ${cardData.price} Eur`;
      card.append(price);

    }

    setRefreshButton(card, id) {

      let buttonRefresh = document.createElement('button');
      buttonRefresh.classList.add('store__card-btn');
      buttonRefresh.textContent = 'Повторить загрузку';

      buttonRefresh.addEventListener('click', async () => {
        buttonRefresh.style.display = 'none';
        let cardData = await this.fetchCardData(card, id - 2); // намеренная ошибка для проверки, убрать "- 2"
        if (cardData) {
          this.renderCard(card, cardData);
        } else {
          buttonRefresh.style.display = 'block';
        }
      })
      card.append(buttonRefresh);
    }

    async create(id) {

      let card = document.createElement('div');
      card.classList.add('store__card');
      this.$parent.append(card);
      let cardData = await this.fetchCardData(card, id);
      if (cardData) {
        this.renderCard(card, cardData);
      } else {
        this.setRefreshButton(card, id);
      }
    }
  }

  class AddToCardComponent extends Component {
    constructor({
      selector,
      // showLoader = true,
      // showErrorState = true
    }) {
      super({
        selector,
        // showLoader = true,
        // showErrorState = true
      })
    }

    async create(id) {
      super.create(id);
    }

    renderCard(card, cardData) {
      super.renderCard(card, cardData);

      let _count = cardData.rating.count;

      let countBox = document.createElement('div');
      countBox.classList.add('store__card-count-box');
      card.append(countBox);

      let decrBtn = document.createElement('button');
      decrBtn.classList.add('store__card-count-btn');
      decrBtn.textContent = ' - ';
      decrBtn.addEventListener('click', () => {
        incrBtn.removeAttribute('disabled');
        decrBtn.removeAttribute('disabled');
        if (_count > 1) {
          _count = _count - 1;
          countIndicator.textContent = _count;
        } else {
          decrBtn.setAttribute('disabled', 'disabled');
        }
      })
      countBox.append(decrBtn);

      let countIndicator = document.createElement('div');
      countIndicator.classList.add('store__card-count-indicator');
      countIndicator.textContent = _count;
      countBox.append(countIndicator);

      let incrBtn = document.createElement('button');
      incrBtn.classList.add('store__card-count-btn');
      incrBtn.textContent = ' + ';
      incrBtn.addEventListener('click', () => {
        incrBtn.removeAttribute('disabled');
        decrBtn.removeAttribute('disabled');
        if (_count < cardData.rating.count) {
          _count = _count + 1;
          countIndicator.textContent = _count;
        } else {
          incrBtn.setAttribute('disabled', 'disabled');
        }
      })
      countBox.append(incrBtn);

      let addToCardBtn = document.createElement('button');
      addToCardBtn.classList.add('store__card-btn-add');
      addToCardBtn.textContent = 'Добавить в корзину';
      card.append(addToCardBtn);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {

    let container = document.getElementById('container');

    let spinner = document.createElement('div');
    spinner.classList.add('spinner-border');
    container.append(spinner);

    fetch('https://fakestoreapi.com/products/')
      .then(res => res.json())
      .then(catalog => {

        console.log(catalog);
        spinner.style.display = 'none';

        for (const item of catalog) {
          new Component({
            selector: '#container',
            // showLoader: false,
            // showErrorState: true
          }).create(item.id + 3) // // намеренная ошибка для проверки, убрать "- 2"
        }

        for (const item of catalog) {
          new AddToCardComponent({
            selector: '#container2',
            // showLoader: false,
            // showErrorState: true
          }).create(item.id + 3) // // намеренная ошибка для проверки, убрать "- 2"
        }

      })

  })

})()
