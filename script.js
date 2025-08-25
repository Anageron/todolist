class Todo{
  selectors = {
    root: '[data-js-todo]',
    newTaskForm: '[data-js-todo-new-task-form]',
    newTaskInput: '[data-js-todo-new-task-input]',
    searchTaskForm: '[data-js-todo-search-task-form]',
    searchTaskInput: '[data-js-todo-search-task-input]',
    totalTasks: '[data-js-todo-total-tasks]',
    deleteAllButton: '[data-js-todo-delete-all-button]',
    list: '[data-js-todo-list]',
    item: '[data-js-todo-item]',
    itemCheckbox: '[data-js-todo-item-checkbox]',
    itemLabel: '[data-js-todo-item-label]',
    itemDeleteButton: '[data-js-todo-item-delete-button]',
    emptyMessage: '[data-js-todo-empty-message]',
  }

  stateClasses = {
    isVisible: 'is-visible',
    isDisappearing: 'is-disappearing'
  }

  localStorageKey = 'todo-items'

  constructor() {
    this.rootElement = document.querySelector(this.selectors.root);
    this.paginationElement = this.rootElement.querySelector('[data-js-todo-pagination]') 
      || document.createElement('div');
    this.paginationElement.setAttribute('data-js-todo-pagination', '');
    this.rootElement.appendChild(this.paginationElement);
    this.newTaskFormElement = document.querySelector(this.selectors.newTaskForm);
    this.newTaskInputElement = document.querySelector(this.selectors.newTaskInput);
    this.searchTaskFormElement = document.querySelector(this.selectors.searchTaskForm);
    this.searchTaskInputElement = document.querySelector(this.selectors.searchTaskInput);
    this.totalTasksElement = document.querySelector(this.selectors.totalTasks);
    this.deleteAllButtonElement = document.querySelector(this.selectors.deleteAllButton);
    this.listElement = document.querySelector(this.selectors.list);
    // this.itemElement = document.querySelector(this.selectors.item);
    // this.itemCheckboxElement = document.querySelector(this.selectors.itemCheckbox);
    // this.itemLabelElement = document.querySelector(this.selectors.itemLabel);
    // this.itemDeleteButtonElement = document.querySelector(this.selectors.itemDeleteButton);
    this.emptyMessageElement = document.querySelector(this.selectors.emptyMessage);
    this.state = {
      //items: this.getItemsFromLocalStorage(),
      items: [],
      filteredItems: null,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 10,
    }
    
    this.init()
  
  }

  async init() {
  this.state.items = await this.getItemsFromLocalStorage();
  this.render();
  this.bindEvents();
}

  async getItemsFromLocalStorage() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    
    if (!response.ok) {
      throw new Error(`Ошибка загрузки: ${response.status}`);
    }

    const rawData = await response.json(); // ← Получаем данные
    console.log('Загружено с API:', rawData);

    // Возвращаем только нужные поля: id, title, isChecked
    return rawData.map(post => ({
      id: post.id.toString(), // id должен быть строкой, если используете crypto/randomUUID
      title: post.title,
      isChecked: false // по умолчанию не выполнено
    }));
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    return []; // если ошибка — возвращаем пустой массив
  }
}

  //  getItemsFromLocalStorage() {
  //   const rawData = localStorage.getItem(this.localStorageKey)

  
  //   if(!rawData){
  //     return []
  //   }

  //   try{
  //     const parsedData = JSON.parse(rawData);
        
  //     return Array.isArray(parsedData) ? parsedData : []
  //   } catch {
  //     console.error('Todo items parse error')
  //     return []
  //   }
  // }

  saveItemsToLocalStorage() {
    localStorage.setItem(
      this.localStorageKey,
      JSON.stringify(this.state.items)
    )
  }

  createItemElement({ id, title, isChecked }) {
  const li = document.createElement('li');
  li.className = 'todo__item todo-item';
  li.dataset.jsTodoItem = '';

  li.innerHTML = `
    <input
      class="todo-item__checkbox"
      id="${id}"
      type="checkbox"
      ${isChecked ? 'checked' : ''}
      data-js-todo-item-checkbox
    />
    <label for="${id}" class="todo-item__label" data-js-todo-item-label>
      ${title}
    </label>
    <button
      class="todo-item__delete-button"
      type="button"
      aria-label="Delete"
      title="Delete"
      data-js-todo-item-delete-button
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 5L5 15M5 5L15 15" stroke="#757575" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  `;

  return li;
}


  render() {
    this.totalTasksElement.textContent = this.state.items.length

    this.deleteAllButtonElement.classList.toggle(
      this.stateClasses.isVisible,
      this.state.items.length > 0
    )

    const items = this.state.filteredItems ?? this.state.items
    
    this.listElement.textContent = '';

  //    items.forEach(item => {
  //   const itemElement = this.createItemElement(item);
  //   this.listElement.prepend(itemElement); // prepend — добавляет В НАЧАЛО
  // });
    // this.listElement.innerHTML = items.map(({id, title, isChecked})=>`
    //   <li class="todo__item todo-item" data-js-todo-item>
    //       <input
    //         class="todo-item__checkbox"
    //         id="${id}"
    //         type="checkbox"
    //         ${isChecked ? 'checked' : ''}
    //         data-js-todo-item-checkbox
    //       />
    //       <label for="${id}" class="todo-item__label" data-js-todo-item-label
    //         >${title}</label
    //       >
    //       <button
    //         class="todo-item__delete-button"
    //         type="button"
    //         aria-label="Delete"
    //         title="Delete"
    //         data-js-todo-item-delete-button
    //       >
    //         <svg
    //           width="20"
    //           height="20"
    //           viewBox="0 0 20 20"
    //           fill="none"
    //           xmlns="http://www.w3.org/2000/svg"
    //         >
    //           <path
    //             d="M15 5L5 15M5 5L15 15"
    //             stroke="#757575"
    //             stroke-width="2"
    //             stroke-linecap="round"
    //             stroke-linejoin="round"
    //           />
    //         </svg>
    //       </button>
    //     </li>
    // `).join('')

    const isEmptyFilteredItems = this.state.filteredItems?.length === 0
    const  isEmptyItems = this.state.items.length === 0

    this.emptyMessageElement.textContent = 
      isEmptyFilteredItems ? 'Tasks not found'
      : isEmptyItems ? 'There are not tasks yet'
      :''
    

    if (!isEmptyFilteredItems && !isEmptyItems) {
    const startIndex = (this.state.currentPage - 1) * this.state.itemsPerPage;
    const endIndex = startIndex + this.state.itemsPerPage;
    const paginatedItems = items.slice(startIndex, endIndex);

      paginatedItems.forEach(item => {
      const itemElement = this.createItemElement(item);
      this.listElement.append(itemElement);
    });
  }

  this.renderPagination();
  }

  // addItem(title){
  //   this.state.items.push({
  //     id: crypto?.randomUUID() ?? Date.now().toString(),
  //     title,
  //     isChecked: false,
  //   })
  //   this.saveItemsToLocalStorage()
  //   this.render()
  // }
  async addItem(title) {
 

  const newItem = {
    id: crypto?.randomUUID() ?? Date.now().toString(),
    title,
    isChecked: false,
  };

  this.state.items.unshift(newItem);
  
  this.saveItemsToLocalStorage();

  this.state.currentPage = 1;
  
  this.render();

   

  // Отправляем новую задачу на сервер (опционально)
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: newItem.title,
        body: '', // требуется для этого API
        id: newItem.id,
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    const json = await response.json();
    console.log('Задача отправлена:', json);
  } catch (error) {
    console.error('Ошибка отправки:', error);
  }
}


  // deleteItem(id){
  //   this.state.items = this.state.items.filter((item) => item.id !==id )
  //   this.saveItemsToLocalStorage()
  //   this.render()
  // }

  async deleteItem(id) {
  // Удаляем из state
  this.state.items = this.state.items.filter(item => item.id !== id);
  this.filter();
  
  // Обновляем интерфейс
  this.render();

  // Сохраняем в localStorage
  this.saveItemsToLocalStorage();
  

  // Опционально: удаляем с сервера (если это пост с API)
  // Проверим, если id — число (как в JSONPlaceholder), удаляем
   const postId = Number(id);
  if (!isNaN(postId)) {
    try {
      await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`, {
        method: 'DELETE',
      });
      console.log(`Пост с id=${postId} удалён с сервера`);
    } catch (error) {
      console.error(`Ошибка при удалении поста ${postId}:`, error);
      // Не критично — данные уже удалены локально
    }
  }
  
}
  

  toggleCheckedState(id) {
    this.state.items = this.state.items.map((item) => {
      if(item.id === id){
        return {
          ...item,
          isChecked: !item.isChecked,
        }
      }
      return item
    })
    this.saveItemsToLocalStorage()
    this.render()
  }

  filter(){
    
    const queryFormatted = this.state.searchQuery.toLowerCase()
    this.state.filteredItems = this.state.items.filter(({title}) => {
      const titleFormatted = title.toLowerCase()
      return titleFormatted.includes(queryFormatted)
    })
    this.render()
  }

  resetFilter(){
    this.state.filteredItems = null
    this.state.searchQuery = ""
    this.state.currentPage = 1
    this.render()
  }

  onNewTaskFormSubmit = (event) =>{
    event.preventDefault()

    const newTodoItemTitle = this.newTaskInputElement.value

    if(newTodoItemTitle.trim().length > 0){
      this.addItem(newTodoItemTitle)
      this.resetFilter()
      this.newTaskInputElement.value="";
      this.newTaskInputElement.focus()
    }
  }

  onSearchTaskFormSubmit = (event) =>{
    event.preventDefault()
  }

  onSearchTaskInputChange = ({target}) => {
    const value = target.value.trim()

    if(value.length > 0) {
      this.state.searchQuery = value
      this.filter()
      this.state.currentPage = 1
    } else {
      this.resetFilter()
    }
  }

  onDeleteAllButtonClick = () => {
    const isConfirmed = confirm ('Are you sure you want to delete all?')
    if(isConfirmed){
      this.state.items = []
      this.saveItemsToLocalStorage()
      this.render()
    }
  }

  onClick = ({target}) => {
    if(target.matches(this.selectors.itemDeleteButton)){
      const itemElement = target.closest(this.selectors.item)
      const itemCheckboxElement = itemElement.querySelector(this.selectors.itemCheckbox)

      itemElement.classList.add(this.stateClasses.isDisappearing)

      setTimeout(() => this.deleteItem(itemCheckboxElement.id),400)
    }
  }
  
  onChange = ({target}) => {
    if (target.matches(this.selectors.itemCheckbox)){
      this.toggleCheckedState(target.id)
    }
  }

  bindEvents(){
    this.newTaskFormElement.addEventListener('submit', this.onNewTaskFormSubmit)
   // this.searchTaskFormElement.addEventListener('submit', this.onSearchTaskFormSubmit)
    this.searchTaskInputElement.addEventListener('input', this.onSearchTaskInputChange)
    this.deleteAllButtonElement.addEventListener('click',this.onDeleteAllButtonClick)
    this.listElement.addEventListener('click',this.onClick)
    this.listElement.addEventListener('change',this.onChange)
  }

  renderPagination() {
  const items = this.state.filteredItems ?? this.state.items;
  console.log(items);
  const totalPages = Math.ceil(items.length / this.state.itemsPerPage);
  const currentPage = this.state.currentPage;

  // Очищаем
  this.paginationElement.innerHTML = '';

  if (totalPages <= 1) {
    this.paginationElement.style.display = 'none';
    return;
  }

  // Кнопка "Назад"
  const prevButton = document.createElement('button');
  prevButton.type = 'button';
  prevButton.disabled = currentPage === 1;
  prevButton.textContent = '←';
  prevButton.addEventListener('click', () => this.goToPage(currentPage - 1));
  this.paginationElement.appendChild(prevButton);

  // Всегда показываем первую страницу
  const firstButton = this.createPageButton(1, currentPage);
  this.paginationElement.appendChild(firstButton);

  // Если много страниц — добавляем "..."
  if (totalPages) {
    if (currentPage > 2) {
      const ellipsisStart = document.createElement('span');
      ellipsisStart.textContent = '...';
      ellipsisStart.style.margin = '0 4px';
      this.paginationElement.appendChild(ellipsisStart);
    }
  }

  // Показываем 3 страницы вокруг текущей
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page++) {
    if (page !== 1 && page !== totalPages) {
      const button = this.createPageButton(page, currentPage);
      this.paginationElement.appendChild(button);
    }
  }

  // Добавляем "..." перед последней, если нужно
  if (totalPages) {
    if (currentPage < totalPages - 3) {
      const ellipsisEnd = document.createElement('span');
      ellipsisEnd.textContent = '...';
      ellipsisEnd.style.margin = '0 4px';
      this.paginationElement.appendChild(ellipsisEnd);
    }
  }

  // Показываем последнюю страницу, если она не отображается
  if (totalPages > 1) {
    if (totalPages !== 1) {
      const lastButton = this.createPageButton(totalPages, currentPage);
      this.paginationElement.appendChild(lastButton);
    }
  }

  // Кнопка "Вперёд"
  const nextButton = document.createElement('button');
  nextButton.type = 'button';
  nextButton.disabled = currentPage === totalPages;
  nextButton.textContent = '→';
  nextButton.addEventListener('click', () => this.goToPage(currentPage + 1));
  this.paginationElement.appendChild(nextButton);

}

createPageButton(page, currentPage) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = page;
  button.classList.toggle('active', page === currentPage);
  button.addEventListener('click', () => this.goToPage(page));
  return button;
}

goToPage(page) {
  const items = this.state.filteredItems ?? this.state.items;
  const totalPages = Math.ceil(items.length / this.state.itemsPerPage);

  if (page < 1 || page > totalPages) return;

  this.state.currentPage = page;
  this.render(); // Перерисовываем список и пагинацию
}


}

new Todo()



