const $bookCon = document.querySelector(".bookCon");
const $searchInput = document.querySelector(".searchInput");
const $heartBtn = document.querySelector(".heart");
const $modal = document.getElementById("favoriteModal");
const $modalOverlay = document.getElementById("modalOverlay");
const $modalBooksList = document.querySelector("modal-books-list");
const $closeBtn = document.querySelector(".close");
const $modalBooks = document.querySelector(".modal-books");

let pageSize = 8;
let page = 1;
let totalResults = 0;
let groupSize = 5;
let currentPage = 1;

const saveToLocalStorage = (book) => {
  let favoriteBooks = JSON.parse(localStorage.getItem("favoriteBooks")) || [];

  // 개수가 넘으면 알림을 띄우는 거 말고 최신순으로 반영하게끔 했습니다
  if (favoriteBooks.length >= 20) {
    favoriteBooks.shift();
  }

  favoriteBooks.push(book);
  localStorage.setItem("favoriteBooks", JSON.stringify(favoriteBooks));
};

const addFavoriteBtnEvent = () => {
  const $favoriteBtns = document.querySelectorAll(".favorite");

  $favoriteBtns.forEach((button, _) => {
    button.addEventListener("click", () => {
      const $bookItem = button.closest(".book-item");

      const cover = $bookItem.querySelector(".book-image img").src;
      const description = $bookItem.querySelector(".description").textContent;
      const title = $bookItem.querySelector(".title").textContent;
      const priceStandard = $bookItem.querySelector(".price").textContent;
      const author = $bookItem.querySelector(".author").textContent;
      const publisher = $bookItem.querySelector(".publisher").textContent;

      const bookData = {
        cover,
        description,
        title,
        priceStandard,
        author,
        publisher,
      };

      saveToLocalStorage(bookData);

      const favoriteImg = button.querySelector("img");

      if (favoriteImg.src.includes("heart.png")) {
        favoriteImg.src = "./fullHeart.png";
      } else {
        favoriteImg.src = "./heart.png";
      }
    });
  });
};

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

      addFavoriteBtnEvent();

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

$heartBtn.addEventListener("click", () => {
  const favoriteBooks = JSON.parse(localStorage.getItem("favoriteBooks")) || [];

  // 모달 내의 도서 목록 초기화
  $modalBooks.innerHTML = "";

  if (favoriteBooks.length === 0) {
    $modalBooks.innerHTML = "<p>저장된 즐겨찾기 도서가 없습니다.</p>";
  } else {
    favoriteBooks.forEach((book) => {
      const bookHTML = `
      <li class="book-item">
        <div class="book-card">
          <div class="book-image">
            <img src=${book.cover} alt="Book cover" />
          </div>
          <div class="book-image-back">
            <span class="description">${book.description}</span>
          </div>
          <div class="book-details">
            <span class="title">${book.title}</span>
            <span class="price">${book.priceStandard}원</span>
            <span class="author">${book.author}</span>
            <span class="publisher">${book.publisher}</span>
          </div>
          <button class="favorite">
            <img src="/fullHeart.png" alt="Favorite" />
          </button>
        </div>
      </li>
      `;
      $modalBooks.innerHTML += bookHTML;
    });
    $modal.style.display = "block";
    $modalOverlay.style.display = "block";
  }

  $modal.style.display = "block";
});

$closeBtn.addEventListener("click", () => {
  $modal.style.display = "none";
  $modalOverlay.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target == $modalOverlay) {
    $modal.style.display = "none";
    $modalOverlay.style.display = "none";
  }
});

fetchBooks(1);
