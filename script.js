const TOKEN = "8741838676:AAE7-4DQuvqpiEgr_bApBVUvJshYJzECnV0";
const CHAT_ID = "2033289831";

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
    name: "Р”СЂ. РђРЅРЅР° РЎРµСЂРёРєРѕРІР°",
    meta: "РЎС‚РѕРјР°С‚РѕР»РѕРі-С‚РµСЂР°РїРµРІС‚, СЃС‚Р°Р¶ 8 Р»РµС‚",
    text: "РЎРїРµС†РёР°Р»РёР·РёСЂСѓРµС‚СЃСЏ РЅР° Р»РµС‡РµРЅРёРё РєР°СЂРёРµСЃР°, СЌСЃС‚РµС‚РёС‡РµСЃРєРѕР№ СЂРµСЃС‚Р°РІСЂР°С†РёРё Рё РїСЂРѕС„РёР»Р°РєС‚РёРєРµ РѕСЃР»РѕР¶РЅРµРЅРёР№.",
    image: "images/doctors/imagesdoctorsanna-profile.png",
    facts: [
      "РџСЂРѕС„РёР»СЊ: С‚РµСЂР°РїРёСЏ, С…СѓРґРѕР¶РµСЃС‚РІРµРЅРЅР°СЏ СЂРµСЃС‚Р°РІСЂР°С†РёСЏ",
      "Р‘РѕР»РµРµ 2500 РєР»РёРЅРёС‡РµСЃРєРёС… СЃР»СѓС‡Р°РµРІ",
      "Р Р°Р±РѕС‚Р° РїРѕ РјРµР¶РґСѓРЅР°СЂРѕРґРЅС‹Рј РїСЂРѕС‚РѕРєРѕР»Р°Рј Р»РµС‡РµРЅРёСЏ",
      "РђРєС†РµРЅС‚ РЅР° Р±РµСЂРµР¶РЅРѕРµ Рё Р±РµР·Р±РѕР»РµР·РЅРµРЅРЅРѕРµ Р»РµС‡РµРЅРёРµ"
    ]
  },
  maxim: {
    name: "Р”СЂ. РњР°РєСЃРёРј Р•СЂР¶Р°РЅРѕРІ",
    meta: "РћСЂС‚РѕРїРµРґ-РёРјРїР»Р°РЅС‚РѕР»РѕРі, СЃС‚Р°Р¶ 10 Р»РµС‚",
    text: "РџСЂРѕРІРѕРґРёС‚ РёРјРїР»Р°РЅС‚Р°С†РёСЋ Рё РїСЂРѕС‚РµР·РёСЂРѕРІР°РЅРёРµ СЃ С†РёС„СЂРѕРІС‹Рј РїР»Р°РЅРёСЂРѕРІР°РЅРёРµРј Рё РїСЂРѕРіРЅРѕР·РёСЂСѓРµРјС‹Рј СЂРµР·СѓР»СЊС‚Р°С‚РѕРј.",
    image: "images/doctors/imagesdoctorsmaxim-profile.png",
    facts: [
      "РџСЂРѕС„РёР»СЊ: РёРјРїР»Р°РЅС‚Р°С†РёСЏ, С‚РѕС‚Р°Р»СЊРЅРѕРµ РїСЂРѕС‚РµР·РёСЂРѕРІР°РЅРёРµ",
      "Р‘РѕР»РµРµ 1500 СѓСЃС‚Р°РЅРѕРІР»РµРЅРЅС‹С… РёРјРїР»Р°РЅС‚РѕРІ",
      "3D-РїР»Р°РЅРёСЂРѕРІР°РЅРёРµ Рё РЅР°РІРёРіР°С†РёРѕРЅРЅС‹Рµ С€Р°Р±Р»РѕРЅС‹",
      "Р’РѕСЃСЃС‚Р°РЅРѕРІР»РµРЅРёРµ С„СѓРЅРєС†РёРѕРЅР°Р»СЊРЅРѕР№ СЌСЃС‚РµС‚РёРєРё СѓР»С‹Р±РєРё"
    ]
  },
  alina: {
    name: "Р”СЂ. РђР»РёРЅР° РўСѓСЂСЃСѓРЅРѕРІР°",
    meta: "Р”РµС‚СЃРєРёР№ СЃС‚РѕРјР°С‚РѕР»РѕРі, СЃС‚Р°Р¶ 6 Р»РµС‚",
    text: "Р Р°Р±РѕС‚Р°РµС‚ СЃ РґРµС‚СЊРјРё РјСЏРіРєРѕ Рё РІРЅРёРјР°С‚РµР»СЊРЅРѕ, С„РѕСЂРјРёСЂСѓСЏ РґРѕРІРµСЂРёРµ Рє Р»РµС‡РµРЅРёСЋ СЃ РїРµСЂРІРѕРіРѕ РїСЂРёРµРјР°.",
    image: "images/doctors/imagesdoctorsalina-profile.png",
    facts: [
      "РџСЂРѕС„РёР»СЊ: РґРµС‚СЃРєР°СЏ С‚РµСЂР°РїРёСЏ Рё РїСЂРѕС„РёР»Р°РєС‚РёРєР°",
      "РђРґР°РїС‚Р°С†РёРѕРЅРЅС‹Р№ РїСЂРёРµРј Р±РµР· СЃС‚СЂРµСЃСЃР°",
      "РРЅРґРёРІРёРґСѓР°Р»СЊРЅС‹Р№ РїРѕРґС…РѕРґ РїРѕ РІРѕР·СЂР°СЃС‚Сѓ СЂРµР±РµРЅРєР°",
      "РћР±СѓС‡РµРЅРёРµ РїСЂР°РІРёР»СЊРЅРѕР№ РіРёРіРёРµРЅРµ РґР»СЏ СЂРѕРґРёС‚РµР»РµР№ Рё РґРµС‚РµР№"
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
    setError(nameInput, "Р’РІРµРґРёС‚Рµ РєРѕСЂСЂРµРєС‚РЅРѕРµ РёРјСЏ");
    isValid = false;
  }

  const digitsCount = phone.replace(/\D/g, "").length;
  if (digitsCount < 11) {
    setError(phoneField, "Р’РІРµРґРёС‚Рµ РєРѕСЂСЂРµРєС‚РЅС‹Р№ РЅРѕРјРµСЂ С‚РµР»РµС„РѕРЅР°");
    isValid = false;
  }

  if (!service) {
    setError(serviceField, "Р’С‹Р±РµСЂРёС‚Рµ СѓСЃР»СѓРіСѓ");
    isValid = false;
  }

  if (time.length < 3) {
    setError(timeField, "РЈРєР°Р¶РёС‚Рµ СѓРґРѕР±РЅРѕРµ РІСЂРµРјСЏ");
    isValid = false;
  }

  return isValid;
}

async function sendToTelegram({ name, phone, service, time, comment }) {
  const text =
    "РќРѕРІР°СЏ Р·Р°СЏРІРєР° СЃ СЃР°Р№С‚Р° СЃС‚РѕРјР°С‚РѕР»РѕРіРёРё\n\n" +
    `РРјСЏ: ${name}\n` +
    `РўРµР»РµС„РѕРЅ: ${phone}\n` +
    `РЈСЃР»СѓРіР°: ${service}\n` +
    `РЈРґРѕР±РЅРѕРµ РІСЂРµРјСЏ: ${time}\n` +
    `РљРѕРјРјРµРЅС‚Р°СЂРёР№: ${comment || "-"}`;

  if (TOKEN.includes("PASTE_") || CHAT_ID.includes("PASTE_")) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { ok: true, demo: true };
  }

  const botId = TOKEN.split(":")[0];
  if (CHAT_ID === botId) {
    throw new Error("CHAT_ID СѓРєР°Р·Р°РЅ РЅРµРІРµСЂРЅРѕ: СЌС‚Рѕ ID Р±РѕС‚Р°, Р° РЅРµ С‡Р°С‚Р°.");
  }

  const url =
    `https://api.telegram.org/bot${TOKEN}/sendMessage` +
    `?chat_id=${encodeURIComponent(CHAT_ID)}` +
    `&text=${encodeURIComponent(text)}`;

  const response = await fetch(url, { method: "GET" });
  const data = await response.json();

  if (!data.ok) {
    throw new Error(data.description || "РћС€РёР±РєР° РѕС‚РїСЂР°РІРєРё РІ Telegram");
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
      submitBtn.textContent = "РћС‚РїСЂР°РІРєР°...";

      await sendToTelegram(payload);

      formMessage.textContent = "Р—Р°СЏРІРєР° СѓСЃРїРµС€РЅРѕ РѕС‚РїСЂР°РІР»РµРЅР°. РђРґРјРёРЅРёСЃС‚СЂР°С‚РѕСЂ СЃРІСЏР¶РµС‚СЃСЏ СЃ РІР°РјРё РІ Р±Р»РёР¶Р°Р№С€РµРµ РІСЂРµРјСЏ.";
      formMessage.classList.add("success");

      bookingForm.reset();

      setTimeout(() => {
        closeModal();
        formMessage.textContent = "";
        formMessage.className = "form-message";
      }, 1800);
    } catch (error) {
      const reason = error?.message ? ` РџСЂРёС‡РёРЅР°: ${error.message}` : "";
      formMessage.textContent = `РќРµ СѓРґР°Р»РѕСЃСЊ РѕС‚РїСЂР°РІРёС‚СЊ Р·Р°СЏРІРєСѓ.${reason}`;
      formMessage.classList.add("error");
      console.error(error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "РћС‚РїСЂР°РІРёС‚СЊ Р·Р°СЏРІРєСѓ";
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


