const config = {
  baseUrl: 'https://nomoreparties.co/v1/apf-cohort-202',
  headers: {
    authorization: 'fecb2a02-62bd-40a1-8a78-6009bba0f478',
    'Content-Type': 'application/json'
  }
};

// Проверка ответа от сервера
const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Ошибка: ${res.status}`);
};

// Получение информации о пользователе
export const getUserInfo = () => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'GET',
    headers: config.headers,
    mode: 'cors'
  })
    .then(checkResponse);
};

// Получение карточек
export const getInitialCards = () => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'GET',
    headers: config.headers,
    mode: 'cors'
  })
    .then(checkResponse);
};

// Обновление профиля
export const updateProfile = (name, about) => {
  return fetch(`${config.baseUrl}/users/me`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      name,
      about
    }),
    mode: 'cors'
  })
    .then(checkResponse);
};

// Добавление новой карточки
export const addCard = (name, link) => {
  return fetch(`${config.baseUrl}/cards`, {
    method: 'POST',
    headers: config.headers,
    body: JSON.stringify({
      name,
      link
    }),
    mode: 'cors'
  })
    .then(checkResponse);
};

// Удаление карточки
export const deleteCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
    mode: 'cors'
  })
    .then(checkResponse);
};

// Постановка лайка
export const likeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'PUT',
    headers: config.headers,
    mode: 'cors'
  })
    .then(checkResponse);
};

// Снятие лайка
export const unlikeCard = (cardId) => {
  return fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: 'DELETE',
    headers: config.headers,
    mode: 'cors'
  })
    .then(checkResponse);
};

// Обновление аватара
export const updateAvatar = (avatar) => {
  return fetch(`${config.baseUrl}/users/me/avatar`, {
    method: 'PATCH',
    headers: config.headers,
    body: JSON.stringify({
      avatar
    }),
    mode: 'cors'
  })
    .then(checkResponse);
}; 