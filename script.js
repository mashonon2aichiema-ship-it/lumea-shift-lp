const els = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("show");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.08 },
  );
  els.forEach((e) => io.observe(e));
} else els.forEach((e) => e.classList.add("show"));
// ========================================
// 購入フォーム
// ========================================

const GAS_URL =
  "https://script.google.com/macros/s/AKfycbxb1RYqC6UMLWA2peKqPmzaImelI4egK6ljBAyzL6_LrhUaBUirohHA_Fiar3yFYTue/exec";

const purchaseForm = document.getElementById("purchase-form-element");
const inputScreen = document.getElementById("form-input-screen");
const confirmScreen = document.getElementById("form-confirm-screen");
const completeScreen = document.getElementById("form-complete-screen");

const backButton = document.getElementById("back-button");
const finalSubmitButton = document.getElementById("final-submit-button");
const errorMessage = document.getElementById("form-error-message");

let formDataForSubmit = null;
let isSubmitting = false;

// 「入力内容を確認する」を押したとき
purchaseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // 必須項目を再確認
  if (!purchaseForm.checkValidity()) {
    purchaseForm.reportValidity();
    return;
  }

  const formData = new FormData(purchaseForm);

  formDataForSubmit = {
    name: formData.get("name") || "",
    kana: formData.get("kana") || "",
    postalCode: formData.get("postalCode") || "",
    prefecture: formData.get("prefecture") || "",
    city: formData.get("city") || "",
    address: formData.get("address") || "",
    building: formData.get("building") || "",
    phone: formData.get("phone") || "",
    email: formData.get("email") || "",
    paymentMethod: formData.get("paymentMethod") || "",
  };

  // 確認画面に入力内容を表示
  document.getElementById("confirm-name").textContent =
    formDataForSubmit.name;

  document.getElementById("confirm-kana").textContent =
    formDataForSubmit.kana;

  document.getElementById("confirm-postal-code").textContent =
    formDataForSubmit.postalCode;

  document.getElementById("confirm-prefecture").textContent =
    formDataForSubmit.prefecture;

  document.getElementById("confirm-city").textContent =
    formDataForSubmit.city;

  document.getElementById("confirm-address").textContent =
    formDataForSubmit.address;

  document.getElementById("confirm-building").textContent =
    formDataForSubmit.building || "なし";

  document.getElementById("confirm-phone").textContent =
    formDataForSubmit.phone;

  document.getElementById("confirm-email").textContent =
    formDataForSubmit.email;

  document.getElementById("confirm-payment-method").textContent =
    formDataForSubmit.paymentMethod;

  // 入力画面を非表示にして確認画面を表示
  inputScreen.hidden = true;
  confirmScreen.hidden = false;
  completeScreen.hidden = true;
  errorMessage.hidden = true;

  document
    .getElementById("purchase-form")
    .scrollIntoView({ behavior: "smooth", block: "start" });
});

// 「入力画面に戻る」を押したとき
backButton.addEventListener("click", function () {
  confirmScreen.hidden = true;
  inputScreen.hidden = false;
  errorMessage.hidden = true;

  document
    .getElementById("purchase-form")
    .scrollIntoView({ behavior: "smooth", block: "start" });
});

// 「注文を確定する」を押したとき
finalSubmitButton.addEventListener("click", async function () {
  // 二重送信を防ぐ
  if (isSubmitting || !formDataForSubmit) {
    return;
  }

  isSubmitting = true;
  finalSubmitButton.disabled = true;
  finalSubmitButton.textContent = "送信中…";
  errorMessage.hidden = true;

  try {
  await fetch(GAS_URL, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(formDataForSubmit),
  });

  // 送信完了
    confirmScreen.hidden = true;
    inputScreen.hidden = true;
    completeScreen.hidden = false;

    purchaseForm.reset();
    formDataForSubmit = null;

    document
      .getElementById("purchase-form")
      .scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error) {
    console.error(error);

    errorMessage.textContent =
      "送信できませんでした。通信状況をご確認のうえ、もう一度お試しください。";

    errorMessage.hidden = false;
    finalSubmitButton.disabled = false;
    finalSubmitButton.textContent = "注文を確定する →";
  } finally {
    isSubmitting = false;
  }
});