const $bookCon = document.querySelector(".bookCon");
const $searchInput = document.querySelector(".searchInput");

let pageSize = 8;
let page = 1;
let totalResults = 0;
let groupSize = 5;
let currentPage = 1;

const createBookInfo = (bookInfo) => {
  let description = bookInfo?.description || "책 소개가 존재하지 않습니다";

  const newBookInfo = `
      <li class="book-item">
        <div class="book-card">
          <div class="book-image">
            <img src=${bookInfo.cover} alt="Book cover" />
          </div>
          <div class="book-image-back">
            <span class="description">${description}</span>
          </div>
          <div class="book-details">
            <span class="title">${bookInfo.title}</span>
            <span class="price">${bookInfo.priceStandard}원</span>
            <span class="author">${bookInfo.author}</span>
            <span class="publisher">${bookInfo.publisher}</span>
          </div>
          
          <button class="favorite">
            <img src="/heart.png" alt="Favorite" />
          </button>
        </div>
      </li>
    `;
  return newBookInfo;
};

const pagination = (totalItem) => {
  let html = "";
  if (totalItem <= 8) return;

  let totalPage = Math.ceil(totalItem / pageSize);
  let pageGroup = Math.ceil(currentPage / groupSize);

  let lastNumber = pageGroup * groupSize;
  if (lastNumber > totalPage) lastNumber = totalPage;
  let firstNumber = lastNumber - (groupSize - 1);
  if (firstNumber < 1) firstNumber = 1;

  const next = lastNumber + 1;
  const prev = firstNumber - 1;

  if (prev > 0) {
    html += `<button class="pageNumber" data-page="${prev}">Prev</button>`;
  }

  for (let i = firstNumber; i <= lastNumber; i++) {
    html += `<button class="pageNumber ${
      i === currentPage ? "active" : ""
    }" data-page="${i}">${i}</button>`;
  }

  if (next <= totalPage) {
    html += `<button class="pageNumber" data-page="${next}">Next</button>`;
  }

  document.querySelector(".pageCon").innerHTML = html;

  const pageButtons = document.querySelectorAll(".pageNumber");
  pageButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      currentPage = Number(event.target.getAttribute("data-page"));
      fetchBooks(currentPage);
    });
  });
};

const fetchBooks = (page, query) => {
  fetch(`http://localhost:3000/api/search?query=${query}&page=${page}`)
    .then((response) => response.json())
    .then((data) => {
      let totalItem = data.item.length;

      const bookHTML = data.item.map((book) => createBookInfo(book)).join("");
      $bookCon.innerHTML = bookHTML;

      const $bookItems = document.querySelectorAll(".book-item");
      $bookItems.forEach(($bookItem) => {
        const $bookImage = $bookItem.querySelector(".book-image");
        const $bookImageBack = $bookItem.querySelector(".book-image-back");
        const $bookDetails = $bookItem.querySelector(".book-details");

        $bookImage.addEventListener("mouseover", () => {
          $bookImageBack.style.display = "block";
          $bookDetails.style.display = "none";
        });

        $bookImage.addEventListener("mouseout", () => {
          $bookImageBack.style.display = "none";
          $bookDetails.style.display = "flex";
        });
      });

      pagination(totalItem);
    })
    .catch((error) => {
      console.error("API 요청 중 오류 발생:", error);
      document.getElementById("result").innerText =
        "오류 발생: " + error.message;
    });
};

$searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    query = $searchInput.value;
    currentPage = 1;
    fetchBooks(currentPage, query);
  }
});

fetchBooks(1);
