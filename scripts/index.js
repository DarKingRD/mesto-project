// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// DOM узлы
const placesList = document.querySelector('.places__list');
const newCardPopup = document.querySelector('.popup_type_new-card');
const profileAddButton = document.querySelector('.profile__add-button');
const newCardForm = newCardPopup.querySelector('.popup__form');

const profileEditButton = document.querySelector('.profile__edit-button');
const profileFormElement = document.querySelector('.popup_type_edit');
const profileTitle = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');

// Элементы попапа с изображением
const imagePopup = document.querySelector('.popup_type_image');
const popupImage = imagePopup.querySelector('.popup__image');
const popupCaption = imagePopup.querySelector('.popup__caption');
const imagePopupClose = imagePopup.querySelector('.popup__close');

// Функция создания карточки
function createCard(cardData, deleteCallBack) {
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    const cardTitle = cardElement.querySelector('.card__title');
    const deleteButton = cardElement.querySelector('.card__delete-button');
    const likeButton = cardElement.querySelector('.card__like-button');
    
    cardImage.src = cardData.link;
    cardImage.alt = cardData.name;
    cardTitle.textContent = cardData.name;

    deleteButton.addEventListener('click', () => {
        deleteCallBack(cardElement);
    });

    likeButton.addEventListener('click', () => {
        likeButton.classList.toggle('card__like-button_is-active');
    });

    cardImage.addEventListener('click', () => {
        // Заполняем попап данными карточки
        popupImage.src = cardData.link;
        popupImage.alt = cardData.name;
        popupCaption.textContent = cardData.name;
        
        // Открываем попап с изображением
        openModal(imagePopup);
    });

    return cardElement;
}

// Функция удаления карточки
function deleteCard(cardElement) {
    cardElement.remove();
}

// Функция открытия попапа
function openModal(popup) {
    popup.classList.add('popup_is-opened');
}

// Функция закрытия попапа
function closeModal(popup) {
    popup.classList.remove('popup_is-opened');
}

function handleProfileFormSubmit(evt) {
    evt.preventDefault();

    const nameInput = profileFormElement.querySelector('.popup__input_type_name');
    const jobInput = profileFormElement.querySelector('.popup__input_type_description');

    profileTitle.textContent = nameInput.value;
    profileDescription.textContent = jobInput.value;

    closeModal(profileFormElement);
}

// Обработчик добавления карточки
function handleAddCardSubmit(evt) {
    evt.preventDefault();
    
    const cardName = newCardForm.querySelector('.popup__input_type_card-name').value;
    const cardLink = newCardForm.querySelector('.popup__input_type_url').value;
    
    const newCardData = {
        name: cardName,
        link: cardLink
    };
    
    const cardElement = createCard(newCardData, deleteCard);
    placesList.prepend(cardElement);
    
    newCardForm.reset();
    closeModal(newCardPopup);
}

// Вывести карточки на страницу
initialCards.forEach((cardData) => {
    const newCard = createCard(cardData, deleteCard);
    placesList.appendChild(newCard);
});

// Обработчики событий
profileAddButton.addEventListener('click', () => {
    openModal(newCardPopup);
});

profileEditButton.addEventListener('click', () => {
    // Получаем текущие значения из профиля
    const currentName = profileTitle.textContent;
    const currentDescription = profileDescription.textContent;
    
    // Находим поля ввода в форме
    const nameInput = profileFormElement.querySelector('.popup__input_type_name');
    const jobInput = profileFormElement.querySelector('.popup__input_type_description');
    
    // Устанавливаем значения полей
    nameInput.value = currentName;
    jobInput.value = currentDescription;
    
    // Открываем попап
    openModal(profileFormElement);
});

newCardForm.addEventListener('submit', handleAddCardSubmit);
profileFormElement.addEventListener('submit', handleProfileFormSubmit);

// Закрытие попапов по кнопке
newCardPopup.querySelector('.popup__close').addEventListener('click', () => {
    closeModal(newCardPopup);
});

profileFormElement.querySelector('.popup__close').addEventListener('click', () => {
    closeModal(profileFormElement);
});

imagePopupClose.addEventListener('click', () => {
    closeModal(imagePopup);
});

// Функции валидации
function showInputError(formElement, inputElement, errorMessage) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add('popup__input_type_error');
  errorElement.textContent = errorMessage;
  errorElement.classList.add('popup__error_visible');
}

function hideInputError(formElement, inputElement) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove('popup__input_type_error');
  errorElement.classList.remove('popup__error_visible');
  errorElement.textContent = '';
}

function checkInputValidity(formElement, inputElement) {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
}

function toggleButtonState(inputList, buttonElement) {
  if (hasInvalidInput(inputList)) {
    // Если есть невалидные поля, делаем кнопку неактивной
    buttonElement.disabled = true;
    buttonElement.classList.add('popup__button_disabled');
  } else {
    // Если все поля валидны, делаем кнопку активной
    buttonElement.disabled = false;
    buttonElement.classList.remove('popup__button_disabled');
  }
}

function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

function setEventListeners(formElement) {
  const inputList = Array.from(formElement.querySelectorAll('.popup__input'));
  const buttonElement = formElement.querySelector('.popup__button');

  // Устанавливаем начальное состояние кнопки
  toggleButtonState(inputList, buttonElement);

  // Добавляем слушатели на все поля ввода
  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', function () {
      checkInputValidity(formElement, inputElement);
      toggleButtonState(inputList, buttonElement);
    });
  });
}

// Инициализация валидации для всех форм
function enableValidation() {
  const formList = Array.from(document.querySelectorAll('.popup__form'));
  formList.forEach((formElement) => {
    setEventListeners(formElement);
  });
}

// Вызываем функцию валидации при загрузке страницы
enableValidation();

