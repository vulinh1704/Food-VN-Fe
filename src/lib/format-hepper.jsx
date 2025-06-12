export const formatVND = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const getFormattedDate = () => {
  const date = new Date();

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // Thêm hậu tố cho ngày (st, nd, rd, th)
  const getOrdinalSuffix = (n) => {
    if (n >= 11 && n <= 13) return 'th';
    switch (n % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  const dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;

  return `${dayName}, ${monthName} ${dayWithSuffix} ${year}`;
}


export function parseToVietnamTime(isoString) {
  const date = new Date(isoString);
  const vietnamTime = new Intl.DateTimeFormat("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);

  return vietnamTime;
}

export function formatNumberWithDots(value) {
  if (value == null || value === "") return "";
  // Làm tròn về số nguyên
  const intValue = Math.round(Number(value));
  return intValue
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function unFormatNumber(value) {
  return parseFloat(value.replace(/\./g, "")) || 0;
}

export const formatDateTimeLocal = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().slice(0, 16);
};

