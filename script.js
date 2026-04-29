const bookingForm = document.querySelector("#bookingForm");
const formNote = document.querySelector("#formNote");
const telegramButton = document.querySelector("#telegramButton");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const dateInput = document.querySelector('input[name="date"]');
const revealItems = document.querySelectorAll(".reveal");

const BOT_TOKEN = "8691184053:AAFkIAbwi25nsZgIkXtS2Sc1hrcaddAU9q8";
const ADMIN_ID = "901985552";

if (dateInput) {
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    siteNav.classList.toggle("is-open");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
    });
  });
}

// Function to send booking to Telegram bot
async function sendToTelegramBot(booking) {
  const message = `🌐 <b>Нова заявка з сайту</b>

👤 Ім'я: ${booking.name}
📞 Телефон: ${booking.phone}
📧 Email: ${booking.email || 'Не вказано'}
💈 Послуга: ${booking.service}
📅 Дата: ${booking.date}
🕒 Час: ${booking.time}
${booking.message ? `💬 Коментар: ${booking.message}` : ''}`;

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: ADMIN_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error sending to Telegram:', error);
    return false;
  }
}


if (bookingForm) {
  bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(bookingForm);
    const booking = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      service: String(formData.get("service") || "").trim(),
      date: String(formData.get("date") || "").trim(),
      time: String(formData.get("time") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    if (
      !booking.name ||
      !booking.phone ||
      !booking.service ||
      !booking.date ||
      !booking.time
    ) {
      formNote.textContent = "Заповни всі обов'язкові поля.";
      return;
    }

    formNote.textContent = "Надсилання заявки...";
    
    // Send to Telegram bot
    const telegramSent = await sendToTelegramBot(booking);
    
    if (telegramSent) {
      formNote.textContent = "✅ Заявку надіслано! Ми з вами зв'яжемося.";
      bookingForm.reset();
    } else {
      formNote.textContent = "❌ Помилка. Спробуйте ще раз.";
    }
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -50px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

window.addEventListener("scroll", () => {
  const heroPanel = document.querySelector(".hero-panel");

  if (!heroPanel) {
    return;
  }

  const offset = Math.min(window.scrollY * 0.08, 32);
  heroPanel.style.transform = `translateY(${offset}px)`;
});