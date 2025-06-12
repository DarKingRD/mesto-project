import '../index.css';
import { 
  getUserInfo, 
  getInitialCards, 
  updateProfile, 
  addCard, 
  deleteCard as apiDeleteCard, 
  likeCard, 
  unlikeCard, 
  updateAvatar 
} from './api.js';
import { enableValidation } from './validate.js';
import avatar from '../images/avatar.jpg';
import logo from '../images/logo.svg';

// DOM элементы
const profileName = document.querySelector('.profile__title');
const profileDescription = document.querySelector('.profile__description');
const profileAvatar = document.querySelector('.profile__image');
const cardsContainer = document.querySelector('.places__list');
const editProfileForm = document.querySelector('.popup__form[name="edit-profile"]');
const addCardForm = document.querySelector('.popup__form[name="new-place"]');
const editAvatarForm = document.querySelector('.popup__form[name="edit-avatar"]');

// Шаблон карточки
const cardTemplate = document.querySelector('#card-template').content;

// Функция открытия попапа
function openPopup(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keydown', handleEscKey);
}

// Функция закрытия попапа
function closePopup(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener('keydown', handleEscKey);
}

// Обработчик клавиши Escape
function handleEscKey(evt) {
  if (evt.key === 'Escape') {
    const openedPopup = document.querySelector('.popup_is-opened');
    if (openedPopup) {
      closePopup(openedPopup);
    }
  }
}

// Обработчик клика по оверлею
function handleOverlayClick(evt) {
  if (evt.target === evt.currentTarget) {
    closePopup(evt.currentTarget);
  }
}

// Функция создания карточки
function createCard(cardData, userId, handleImageClick) {
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeCount = cardElement.querySelector('.card__like-count');
  const deleteButton = cardElement.querySelector('.card__delete-button');

  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  // Обработчик клика по изображению
  cardImage.addEventListener('click', () => handleImageClick(cardData));

  // Проверка, лайкнул ли текущий пользователь карточку
  if (cardData.likes.some(like => like._id === userId)) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Обработчик лайка
  likeButton.addEventListener('click', () => {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    const likeMethod = isLiked ? unlikeCard : likeCard;

    likeMethod(cardData._id)
      .then(updatedCard => {
        likeButton.classList.toggle('card__like-button_is-active');
        likeCount.textContent = updatedCard.likes.length;
      })
      .catch(err => console.log(err));
  });

  // Показываем кнопку удаления только для своих карточек
  if (cardData.owner._id === userId) {
    deleteButton.addEventListener('click', () => {
      apiDeleteCard(cardData._id)
        .then(() => {
          cardElement.remove();
        })
        .catch(err => console.log(err));
    });
  } else {
    deleteButton.remove();
  }

  return cardElement;
}

// Функция открытия попапа с изображением
function openImagePopup(cardData) {
  const imagePopup = document.querySelector('.popup_type_image');
  const popupImage = imagePopup.querySelector('.popup__image');
  const popupCaption = imagePopup.querySelector('.popup__caption');

  popupImage.src = cardData.link;
  popupImage.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  
  openPopup(imagePopup);
}

// Инициализация
let userId;

// Устанавливаем аватар и логотип через JS
document.querySelector('.profile__image').src = avatar;
document.querySelector('.logo').src = logo;

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    userId = userData._id;
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.src = userData.avatar;

    cards.forEach(card => {
      const cardElement = createCard(card, userId, openImagePopup);
      cardsContainer.append(cardElement);
    });
  })
  .catch(err => console.log(err));

// Обработчики форм
editProfileForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = evt.target.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  const nameInput = evt.target.querySelector('.popup__input_type_name');
  const jobInput = evt.target.querySelector('.popup__input_type_description');

  updateProfile(nameInput.value, jobInput.value)
    .then(userData => {
      profileName.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closePopup(evt.target.closest('.popup'));
    })
    .catch(err => console.log(err))
    .finally(() => {
      submitButton.textContent = originalText;
    });
});

addCardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = evt.target.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  const nameInput = evt.target.querySelector('.popup__input_type_card-name');
  const linkInput = evt.target.querySelector('.popup__input_type_url');

  addCard(nameInput.value, linkInput.value)
    .then(cardData => {
      const cardElement = createCard(cardData, userId, openImagePopup);
      cardsContainer.prepend(cardElement);
      closePopup(evt.target.closest('.popup'));
      evt.target.reset();
    })
    .catch(err => console.log(err))
    .finally(() => {
      submitButton.textContent = originalText;
    });
});

editAvatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const submitButton = evt.target.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';

  const avatarInput = evt.target.querySelector('.popup__input_type_url');

  updateAvatar(avatarInput.value)
    .then(userData => {
      profileAvatar.src = userData.avatar;
      closePopup(evt.target.closest('.popup'));
      evt.target.reset();
    })
    .catch(err => console.log(err))
    .finally(() => {
      submitButton.textContent = originalText;
    });
});

// Обработчики открытия/закрытия попапов
document.querySelectorAll('.popup').forEach(popup => {
  popup.addEventListener('click', handleOverlayClick);
  const closeButton = popup.querySelector('.popup__close');
  if (closeButton) {
    closeButton.addEventListener('click', () => closePopup(popup));
  }
});

// Обработчики кнопок открытия попапов
document.querySelector('.profile__edit-button').addEventListener('click', () => {
  const popup = document.querySelector('.popup_type_edit');
  const nameInput = popup.querySelector('.popup__input_type_name');
  const jobInput = popup.querySelector('.popup__input_type_description');
  
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  
  openPopup(popup);
});

document.querySelector('.profile__add-button').addEventListener('click', () => {
  const popup = document.querySelector('.popup_type_new-card');
  openPopup(popup);
});

document.querySelector('.profile__image-container').addEventListener('click', () => {
  const popup = document.querySelector('.popup_type_edit-avatar');
  openPopup(popup);
});

// Включаем валидацию форм
enableValidation();