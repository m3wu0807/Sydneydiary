// ====== 基本設定：你指定的密碼 ======
const APP_PASSWORD = "20252025";

// ====== 行程資料範例：之後可以把整個雪梨行程貼進來 ======
const trips = [
  {
    id: "sydney-10d",
    name: "雪梨跨年 10 日遊",
    dateRange: "2025/12/24 – 2026/01/02",
    days: [
      {
        id: "day1",
        title: "Day 1｜抵達・入住・輕鬆散步",
        date: "2025/12/24",
        subtitle: "機場 → 飯店 → 周邊熟悉環境",
        health: {
          highCalorie: false,
          walkingTarget: 6000,
          balanced: true,
        },
        schedule: [
          {
            time: "12:15",
            endTime: "14:00",
            title: "抵達雪梨機場・入境手續",
            detail: "下機、排隊通關、領行李，視現場情況可能會拉長。",
            transport: "跟著 Airport Train 指標前往市區電車。",
            photoSpot: false,
          },
          {
            time: "14:00",
            endTime: "15:00",
            title: "搭機場快線前往飯店附近車站",
            detail: "購票後搭乘 T8 線至市區，出站後依照飯店導航步行。",
            transport: "火車＋步行約 10–15 分鐘。",
            photoSpot: false,
          },
          {
            time: "16:00",
            endTime: "18:00",
            title: "飯店附近超市・街區散步",
            detail: "採買水、零食與隔天早餐，順便熟悉周邊環境。",
            transport: "步行為主。",
            photoSpot: true,
          },
        ],
        meals: {
          breakfast: null,
          lunch: {
            name: "機上簡單餐點",
            type: "飛機餐",
            needReservation: false,
            note: "以墊肚子為主，下機後再好好吃。",
          },
          dinner: {
            name: "飯店附近隨意吃（可選評價不錯的義大利麵／漢堡）",
            type: "簡單晚餐",
            needReservation: false,
            note: "以快速補充體力為主，避免排太久。",
          },
        },
      },
      {
        id: "day2",
        title: "Day 2｜市區散步・海港・歌劇院",
        date: "2025/12/25",
        subtitle: "適合拍照的一天，步行稍多",
        health: {
          highCalorie: true,
          walkingTarget: 12000,
          balanced: false,
        },
        schedule: [
          {
            time: "09:00",
            endTime: "10:00",
            title: "早餐咖啡廳",
            detail: "找一間附近評價 4.5 以上的早午餐店，吃飽再出發。",
            transport: "步行前往咖啡廳。",
            photoSpot: true,
          },
          {
            time: "10:30",
            endTime: "12:00",
            title: "循著港口散步到歌劇院",
            detail: "沿路看港口風景，拍照、慢慢走。聖誕節人潮可能略多。",
            transport: "全程步行，注意防曬。",
            photoSpot: true,
          },
        ],
        meals: {
          breakfast: {
            name: "港邊早午餐咖啡",
            type: "早午餐・咖啡",
            needReservation: true,
            note: "熱門時段建議事先訂位，避免等太久。",
          },
          lunch: {
            name: "港邊海鮮餐廳",
            type: "海鮮",
            needReservation: true,
            note: "可以安排一間評價好、景觀佳的海鮮餐廳。",
          },
          dinner: {
            name: "輕食或超市沙拉",
            type: "清爽晚餐",
            needReservation: false,
            note: "因為中午較豐盛，晚餐可簡單一點。",
          },
        },
      },
    ],
  },
];

// ====== DOM 操作 ======
const loginSection = document.getElementById("login-section");
const appSection = document.getElementById("app-section");
const passwordInput = document.getElementById("password-input");
const loginButton = document.getElementById("login-button");
const loginError = document.getElementById("login-error");

const tripListEl = document.getElementById("trip-list");
const dayHeaderEl = document.getElementById("day-header");
const dayScheduleEl = document.getElementById("day-schedule");
const dayMealsEl = document.getElementById("day-meals");

let currentTrip = null;
let currentDay = null;

// 登入邏輯（簡單前端密碼保護）
loginButton.addEventListener("click", () => {
  const input = passwordInput.value.trim();
  if (input === APP_PASSWORD) {
    loginSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    loginError.textContent = "";
    initTrips();
  } else {
    loginError.textContent = "密碼錯誤，請再試一次。";
  }
});

passwordInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    loginButton.click();
  }
});

// 初始化旅程列表
function initTrips() {
  tripListEl.innerHTML = "";
  trips.forEach((trip, index) => {
    const li = document.createElement("li");
    li.className = "trip-item";
    li.textContent = `${trip.name}｜${trip.dateRange}`;
    li.dataset.tripId = trip.id;
    li.addEventListener("click", () => selectTrip(trip.id));
    tripListEl.appendChild(li);

    if (index === 0) {
      selectTrip(trip.id);
    }
  });
}

// 選取某個旅程
function selectTrip(tripId) {
  currentTrip = trips.find((t) => t.id === tripId);
  // 更新側邊欄樣式
  document.querySelectorAll(".trip-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.tripId === tripId);
  });

  if (currentTrip && currentTrip.days.length > 0) {
    selectDay(currentTrip.days[0].id);
  } else {
    renderDay(null);
  }
}

// （簡化版）預設顯示每天的第一天，可之後擴充成 Day 列表
function selectDay(dayId) {
  if (!currentTrip) return;
  currentDay = currentTrip.days.find((d) => d.id === dayId);
  renderDay(currentDay);
}

// 渲染單日資訊
function renderDay(day) {
  if (!day) {
    dayHeaderEl.innerHTML = "<p>尚未有行程</p>";
    dayScheduleEl.innerHTML = "";
    dayMealsEl.innerHTML = "";
    return;
  }

  // Header
  const badges = [];
  if (day.health?.highCalorie) {
    badges.push('<span class="badge badge-danger">🍰 高熱量日</span>');
  }
  if (day.health?.walkingTarget) {
    badges.push(
      `<span class="badge">🚶 目標 ${day.health.walkingTarget.toLocaleString()} 步</span>`
    );
  }
  if (day.health?.balanced) {
    badges.push('<span class="badge badge-ok">✅ 飲食較平衡</span>');
  }

  dayHeaderEl.innerHTML = `
    <div>
      <div class="day-title">${day.title}</div>
      <div class="day-subtitle">${day.date}｜${day.subtitle || ""}</div>
      <div class="badge-row">
        ${badges.join("")}
      </div>
    </div>
  `;

  // Schedule
  dayScheduleEl.innerHTML = `<div class="section-title">📋 行程時間軸</div>`;
  if (!day.schedule || day.schedule.length === 0) {
    dayScheduleEl.innerHTML += `<p style="font-size:13px;color:#6b7280;">這一天還沒有填寫行程。</p>`;
  } else {
    day.schedule.forEach((b) => {
      const row = document.createElement("div");
      row.className = "schedule-row";
      row.innerHTML = `
        <div class="time-cell">${b.time}${
        b.endTime ? "–" + b.endTime : ""
      }</div>
        <div>
          <div class="block-title">${b.title}</div>
          ${
            b.detail
              ? `<div class="block-detail">${b.detail}</div>`
              : ""
          }
          <div class="block-meta">
            ${b.transport ? "🚇 " + b.transport : ""}
            ${b.photoSpot ? "　📸 適合拍照" : ""}
          </div>
        </div>
      `;
      dayScheduleEl.appendChild(row);
    });
  }

  // Meals
  dayMealsEl.innerHTML = `<div class="section-title">🍽️ 今日三餐</div>`;
  const mealsWrap = document.createElement("div");
  mealsWrap.className = "meals-grid";

  const mealOrder = [
    ["breakfast", "早餐"],
    ["lunch", "午餐"],
    ["dinner", "晚餐"],
  ];

  mealOrder.forEach(([key, label]) => {
    const meal = day.meals?.[key];
    const card = document.createElement("div");
    card.className = "meal-card";
    if (meal) {
      card.innerHTML = `
        <div class="meal-title">${label}</div>
        <div class="meal-restaurant">${meal.name}</div>
        <div class="meal-note">
          類型：${meal.type || "—"}<br/>
          ${meal.note ? meal.note : ""}
        </div>
        <div class="meal-tag">
          ${meal.needReservation ? "📅 建議預約" : "🙂 不需預約"}
        </div>
      `;
    } else {
      card.innerHTML = `
        <div class="meal-title">${label}</div>
        <div class="meal-note" style="font-size:12px;color:#9ca3af;">
          尚未安排，可之後再補。
        </div>
      `;
    }
    mealsWrap.appendChild(card);
  });

  dayMealsEl.appendChild(mealsWrap);
}
