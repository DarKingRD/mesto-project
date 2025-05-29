import '../index.css';
import { enableValidation } from './validate.js';
import { openModal, closeModal } from './modal.js';
import { createCard, deleteCard } from './card.js';
import avatar from '../images/avatar.jpg';
import logo from '../images/logo.svg';

// Начальные карточки
const initialCards = [
    {
      name: "Архыз",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg",
    },
    {
      name: "Челябинская область",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg",
    },
    {
      name: "Иваново",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg",
    },
    {
      name: "Камчатка",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg",
    },
    {
      name: "Холмогорский район",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg",
    },
    {
      name: "Байкал",
      link: "https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg",
    }
];

document.addEventListener('DOMContentLoaded', () => {
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

  // Устанавливаем аватар и логотип через JS
  document.querySelector('.profile__image').style.backgroundImage = `url(${avatar})`;
  document.querySelector('.logo').src = logo;

  // Функция открытия попапа с изображением
  function openImagePopup(cardData) {
      console.log('Attempting to open image popup for:', cardData.name, imagePopup);
      popupImage.src = cardData.link;
      popupImage.alt = cardData.name;
      popupCaption.textContent = cardData.name;
      openModal(imagePopup);
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
      
      const cardElement = createCard(newCardData, deleteCard, openImagePopup);
      placesList.prepend(cardElement);
      
      newCardForm.reset();
      closeModal(newCardPopup);
  }

  // Вывести карточки на страницу
  initialCards.forEach((cardData) => {
      const newCard = createCard(cardData, deleteCard, openImagePopup);
      placesList.appendChild(newCard);
  });

  // Обработчики событий
  profileAddButton.addEventListener('click', () => {
      console.log('Attempting to open new card popup:', newCardPopup);
      openModal(newCardPopup);
  });

  profileEditButton.addEventListener('click', () => {
      const currentName = profileTitle.textContent;
      const currentDescription = profileDescription.textContent;
      
      const nameInput = profileFormElement.querySelector('.popup__input_type_name');
      const jobInput = profileFormElement.querySelector('.popup__input_type_description');
      
      nameInput.value = currentName;
      jobInput.value = currentDescription;
      
      console.log('Attempting to open edit profile popup:', profileFormElement);
      openModal(profileFormElement);
  });

  newCardForm.addEventListener('submit', handleAddCardSubmit);
  profileFormElement.addEventListener('submit', handleProfileFormSubmit);

  // Закрытие попапов по кнопке
  newCardPopup.querySelector('.popup__close').addEventListener('click', () => {
      console.log('Attempting to close new card popup:', newCardPopup);
      closeModal(newCardPopup);
  });

  profileFormElement.querySelector('.popup__close').addEventListener('click', () => {
      console.log('Attempting to close edit profile popup:', profileFormElement);
      closeModal(profileFormElement);
  });

  imagePopupClose.addEventListener('click', () => {
      console.log('Attempting to close image popup:', imagePopup);
      closeModal(imagePopup);
  });

  // Включаем валидацию форм
  enableValidation();
}); 