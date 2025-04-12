// Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// DOM узлы
const placesList = document.querySelector('.places__list');
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
        console.log('Открыть изображение: ', cardData.link);
    });

    

    return cardElement;
}
// Функция удаления карточки
function deleteCard(cardElement) {
    cardElement.remove();
}
// Вывести карточки на страницу
initialCards.forEach((cardData) => {
    const newCard = createCard(cardData, deleteCard);
    placesList.appendChild(newCard);
});
