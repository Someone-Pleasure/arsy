document.addEventListener("DOMContentLoaded", function () {
  const input = document.querySelector("#user-input");
  const sendButton = document.querySelector("#send-button");
  const chatContent = document.querySelector(".chat-content");

  // Fungsi untuk mengambil data dari file JSON
  async function fetchData() {
    const files = ["matematika.json", "k3lh.json", "jpn.json", "inf.json"];
    let allData = [];
    for (const file of files) {
      const response = await fetch(`./data/${file}`);
      const data = await response.json();
      allData = allData.concat(data);
    }
    return allData;
  }

  // Fungsi untuk mencari data yang sesuai (mencocokkan frasa)
  function findMatches(query, data) {
    return data.filter((item) =>
      item.soal.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Fungsi untuk menampilkan hasil pencarian
  function displayResults(query, results) {
    const chatContent = document.querySelector(".flex-1");
    chatContent.innerHTML = ""; // Bersihkan hasil sebelumnya
  
    // Tambahkan soal yang diketik oleh user
    const userQueryDiv = document.createElement("div");
    userQueryDiv.className =
      "bg-pink-400 text-white font-bold p-2 rounded-lg mb-4 max-w-xs ml-auto";
    userQueryDiv.textContent = query;
    chatContent.appendChild(userQueryDiv);
  
    // Tampilkan setiap hasil pencarian
    results.forEach((item) => {
      // Jawaban
      const answerDiv = document.createElement("div");
      answerDiv.className =
  "bg-white p-4 rounded-lg shadow-md max-w-xs mb-4"; // Tambahkan margin-bottom untuk jarak antar blok
answerDiv.innerHTML = `
  <p class="text-gray-700 font-bold">Soal:</p>
  <p class="text-gray-900 font-semibold mb-2">${item.soal}</p>
  <p class="text-blue-600 font-bold">${item.jawaban.replace(/\n/g, "<br>")}</p>
`;
      chatContent.appendChild(answerDiv);
  
      // Gambar (hanya jika ada gambar dalam data)
      if (item.gambar) {
        const imageDiv = document.createElement("div");
        imageDiv.className =
          "bg-white p-4 rounded-lg shadow-md max-w-xs mt-4 mb-4 hover:shadow-lg transition-shadow";
        imageDiv.innerHTML = `<img src="${item.gambar}" alt="Image" class="rounded-lg"/>`;
        chatContent.appendChild(imageDiv);
      }
    });
  }

  // Fungsi untuk menampilkan animasi "SEARCHING DATA..."
  function showLoadingMessage() {
    chatContent.innerHTML = ""; // Bersihkan hasil sebelumnya
    const loadingDiv = document.createElement("div");
    loadingDiv.className =
      "bg-white text-black font-bold p-2 rounded-lg mb-4 max-w-xs ml-auto hover:bg-yellow-500 transition-colors";
    loadingDiv.textContent = "SEARCHING DATA...";
    chatContent.appendChild(loadingDiv);
  }

  // Fungsi untuk menampilkan respons "Data tidak ditemukan"
  function showNoDataMessage(query) {
    const noDataDiv = document.createElement("div");
    noDataDiv.className =
      "bg-red-500 text-white font-bold p-2 rounded-lg mb-4 max-w-xs ml-auto hover:bg-red-600 transition-colors";
    noDataDiv.textContent = `Data tidak ditemukan untuk "${query}".`;
    chatContent.appendChild(noDataDiv);
  }

  // Event listener untuk tombol kirim
  sendButton.addEventListener("click", async () => {
    const query = input.value.trim();
    if (!query) return;

    showLoadingMessage(); // Tampilkan "SEARCHING DATA..." sebelum pencarian

    const data = await fetchData();
    const results = findMatches(query, data);

    // Tunggu beberapa saat untuk simulasi proses pencarian
    setTimeout(() => {
      if (results.length > 0) {
        displayResults(query, results);
      } else {
        chatContent.innerHTML = ""; // Bersihkan hasil sebelumnya
        showNoDataMessage(query);
      }
    }, 1000); // Simulasi delay 1 detik
  });
});
