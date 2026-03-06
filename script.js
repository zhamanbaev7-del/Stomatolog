// script.js

// ==============================
// Telegram Bot API настройки
// ==============================
const TOKEN = "8741838676:AAE7-4DQuvqpiEgr_bApBVUvJshYJzECnV0";
const CHAT_ID = "2033289831";

// ID бота — это число до ":" в токене. Нельзя использовать его как chat_id.
const BOT_ID = TOKEN.split(":")[0];

// Элементы страницы
const header = document.querySelector(".header");
const modal = document.getElementById("bookingModal");
const openModalButtons = document.querySelectorAll(".open-modal");
const closeModalTargets = modal.querySelectorAll("[data-close]");
const bookingForm = document.getElementById("bookingForm");
const formMessage = document.getElementById("formMessage");
const serviceSelect = document.getElementById("service");
const yearEl = document.getElementById("year");
const phoneInput = document.getElementById("phone");

// Текущий год в футере
yearEl.textContent = new Date().getFullYear();

// Тень для header при скролле
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 6);
});

// Открытие модального окна
function openModal(serviceName = "") {
  if (serviceName) {
    serviceSelect.value = serviceName;
  }
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

// Закрытие модального окна
function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

// Навешиваем обработчики на кнопки "Записаться"
openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedService = button.dataset.service || "";
    openModal(selectedService);
  });
});

// Закрытие по клику на крестик/оверлей
closeModalTargets.forEach((target) => {
  target.addEventListener("click", closeModal);
});

// Закрытие по Esc
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("open")) {
    closeModal();
  }
});

// Маска телефона (простая)
phoneInput.addEventListener("input", (e) => {
  let value = e.target.value.replace(/\D/g, "");
  if (value.startsWith("8")) value = "7" + value.slice(1);
  if (!value.startsWith("7")) value = "7" + value;

  const parts = [
    value.slice(0, 1),
    value.slice(1, 4),
    value.slice(4, 7),
    value.slice(7, 9),
    value.slice(9, 11),
  ];

  let formatted = `+${parts[0]}`;
  if (parts[1]) formatted += ` (${parts[1]}`;
  if (parts[1] && parts[1].length === 3) formatted += ")";
  if (parts[2]) formatted += ` ${parts[2]}`;
  if (parts[3]) formatted += `-${parts[3]}`;
  if (parts[4]) formatted += `-${parts[4]}`;

  e.target.value = formatted;
});

// Валидация поля
function setError(input, message) {
  const group = input.closest(".form-group");
  const errorText = group.querySelector(".error-text");
  group.classList.add("error");
  errorText.textContent = message;
}

function clearError(input) {
  const group = input.closest(".form-group");
  const errorText = group.querySelector(".error-text");
  group.classList.remove("error");
  errorText.textContent = "";
}

function validateForm(formData) {
  let isValid = true;

  const name = formData.get("name").trim();
  const phone = formData.get("phone").trim();
  const service = formData.get("service").trim();
  const time = formData.get("time").trim();

  const nameInput = document.getElementById("name");
  const phoneField = document.getElementById("phone");
  const serviceField = document.getElementById("service");
  const timeField = document.getElementById("time");

  [nameInput, phoneField, serviceField, timeField].forEach(clearError);

  if (name.length < 2) {
    setError(nameInput, "Введите корректное имя");
    isValid = false;
  }

  const digitsCount = phone.replace(/\D/g, "").length;
  if (digitsCount < 11) {
    setError(phoneField, "Введите корректный номер телефона");
    isValid = false;
  }

  if (!service) {
    setError(serviceField, "Выберите услугу");
    isValid = false;
  }

  if (time.length < 3) {
    setError(timeField, "Укажите удобное время");
    isValid = false;
  }

  return isValid;
}

// Отправка в Telegram
async function sendToTelegram({ name, phone, service, time, comment }) {
  const text =
    `Новая заявка с сайта стоматологии\n\n` +
    `Имя: ${name}\n` +
    `Телефон: ${phone}\n` +
    `Услуга: ${service}\n` +
    `Удобное время: ${time}\n` +
    `Комментарий: ${comment || "-"}`;

  // Демо-режим, если токен/чат не вставлены
  if (TOKEN.includes("PASTE_") || CHAT_ID.includes("PASTE_")) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { ok: true, demo: true };
  }

  if (CHAT_ID === BOT_ID) {
    throw new Error("CHAT_ID указан неверно: это ID бота. Нужен ID вашего чата (user/group/channel).");
  }

  // GET-запрос без preflight чаще стабильнее для статических сайтов
  const url =
    `https://api.telegram.org/bot${TOKEN}/sendMessage` +
    `?chat_id=${encodeURIComponent(CHAT_ID)}` +
    `&text=${encodeURIComponent(text)}`;

  const response = await fetch(url, { method: "GET" });
  const data = await response.json();
  if (!data.ok) {
    throw new Error(data.description || "Ошибка отправки в Telegram");
  }

  return data;
}

// Обработка формы
bookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  formMessage.textContent = "";
  formMessage.className = "form-message";

  const submitBtn = bookingForm.querySelector(".submit-btn");
  const formData = new FormData(bookingForm);

  if (!validateForm(formData)) return;

  const payload = {
    name: formData.get("name").trim(),
    phone: formData.get("phone").trim(),
    service: formData.get("service").trim(),
    time: formData.get("time").trim(),
    comment: formData.get("comment").trim(),
  };

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = "Отправка...";

    await sendToTelegram(payload);

    formMessage.textContent = "Заявка успешно отправлена. Мы свяжемся с вами в ближайшее время.";
    formMessage.classList.add("success");
    bookingForm.reset();

    setTimeout(() => {
      closeModal();
      formMessage.textContent = "";
      formMessage.className = "form-message";
    }, 1800);
  } catch (error) {
    const reason = error?.message ? ` Причина: ${error.message}` : "";
    formMessage.textContent = `Не удалось отправить заявку.${reason}`;
    formMessage.classList.add("error");
    console.error(error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Отправить заявку";
  }
});

// Плавкое появление блоков при прокрутке
const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealItems.forEach((item) => observer.observe(item));
