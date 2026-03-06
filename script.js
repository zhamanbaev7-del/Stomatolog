const BOOKING_API_URL = window.BOOKING_API_URL || "/api/booking";

const header = document.querySelector(".header");
const modal = document.getElementById("bookingModal");
const bookingForm = document.getElementById("bookingForm");
const formMessage = document.getElementById("formMessage");
const serviceSelect = document.getElementById("service");
const phoneInput = document.getElementById("phone");
const yearEl = document.getElementById("year");
const faqQuestions = document.querySelectorAll(".faq-question");
const doctorModal = document.getElementById("doctorModal");
const doctorModalTitle = document.getElementById("doctorModalTitle");
const doctorModalMeta = document.getElementById("doctorModalMeta");
const doctorModalText = document.getElementById("doctorModalText");
const doctorModalImage = document.getElementById("doctorModalImage");
const doctorModalFacts = document.getElementById("doctorModalFacts");

const doctorProfiles = {
  anna: {
    name: "Др. Анна Серикова",
    meta: "Стоматолог-терапевт, стаж 8 лет",
    text: "Специализируется на лечении кариеса, эстетической реставрации и профилактике осложнений.",
    image: "images/doctors/maxim-profile.png",
    imagePosition: "center 18%",
    facts: [
      "Профиль: терапия, художественная реставрация",
      "Более 2500 клинических случаев",
      "Работа по международным протоколам лечения",
      "Акцент на бережное и безболезненное лечение"
    ]
  },
  maxim: {
    name: "Др. Максим Ержанов",
    meta: "Ортопед-имплантолог, стаж 10 лет",
    text: "Проводит имплантацию и протезирование с цифровым планированием и прогнозируемым результатом.",
    image: "images/doctors/anna-profile.png",
    imagePosition: "center 18%",
    facts: [
      "Профиль: имплантация, тотальное протезирование",
      "Более 1500 установленных имплантов",
      "3D-планирование и навигационные шаблоны",
      "Восстановление функциональной эстетики улыбки"
    ]
  },
  alina: {
    name: "Др. Алина Турсунова",
    meta: "Детский стоматолог, стаж 6 лет",
    text: "Работает с детьми мягко и внимательно, формируя доверие к лечению с первого приема.",
    image: "images/doctors/alina-profile.png",
    imagePosition: "center 20%",
    facts: [
      "Профиль: детская терапия и профилактика",
      "Адаптационный прием без стресса",
      "ндивидуальный подход по возрасту ребенка",
      "Обучение правильной гигиене для родителей и детей"
    ]
  }
};

yearEl.textContent = new Date().getFullYear();

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 6);
});

function openModal(serviceName = "") {
  if (serviceName) {
    serviceSelect.value = serviceName;
  }
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function openDoctorModal(profileKey) {
  const profile = doctorProfiles[profileKey];
  if (!profile) return;

  doctorModalTitle.textContent = profile.name;
  doctorModalMeta.textContent = profile.meta;
  doctorModalText.textContent = profile.text;
  doctorModalImage.src = profile.image;
  doctorModalImage.alt = profile.name;
  doctorModalImage.style.objectPosition = profile.imagePosition || "center 20%";
  doctorModalFacts.innerHTML = profile.facts.map((fact) => `<li>${fact}</li>`).join("");

  doctorModal.classList.add("open");
  doctorModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeDoctorModal() {
  doctorModal.classList.remove("open");
  doctorModal.setAttribute("aria-hidden", "true");
  if (!modal.classList.contains("open")) {
    document.body.style.overflow = "";
  }
}

function attachModalHandlers() {
  const openModalButtons = document.querySelectorAll(".open-modal");
  const closeModalTargets = modal.querySelectorAll("[data-close]");
  const openDoctorButtons = document.querySelectorAll(".open-doctor-modal");
  const closeDoctorTargets = doctorModal.querySelectorAll("[data-close-doctor]");

  openModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedService = button.dataset.service || "";
      closeDoctorModal();
      openModal(selectedService);
    });
  });

  openDoctorButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const profileKey = button.dataset.doctor;
      openDoctorModal(profileKey);
    });
  });

  closeModalTargets.forEach((target) => {
    target.addEventListener("click", closeModal);
  });

  closeDoctorTargets.forEach((target) => {
    target.addEventListener("click", closeDoctorModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
    if (event.key === "Escape" && doctorModal.classList.contains("open")) {
      closeDoctorModal();
    }
  });
}

function setupPhoneMask() {
  phoneInput.addEventListener("input", (event) => {
    let value = event.target.value.replace(/\D/g, "");

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

    event.target.value = formatted;
  });
}

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

async function sendToTelegram(payload) {
  let response;
  try {
    response = await fetch(BOOKING_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error("Нет соединения с API сервером");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data.ok) {
    if (response.status === 404 && window.location.hostname.includes("github.io")) {
      throw new Error("API не найден. GitHub Pages не запускает backend, нужен внешний сервер");
    }
    throw new Error(data.error || `Ошибка API (${response.status})`);
  }

  return data;
}

function setupFormSubmit() {
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

      formMessage.textContent = "Заявка успешно отправлена. Администратор свяжется с вами в ближайшее время.";
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
}

function setupFaq() {
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const item = question.closest(".faq-item");
      const answer = item.querySelector(".faq-answer");
      const isOpen = item.classList.contains("open");

      document.querySelectorAll(".faq-item.open").forEach((openItem) => {
        openItem.classList.remove("open");
        openItem.querySelector(".faq-answer").style.maxHeight = "0px";
      });

      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
}

function setupRevealAnimation() {
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
}

attachModalHandlers();
setupPhoneMask();
setupFormSubmit();
setupFaq();
setupRevealAnimation();



