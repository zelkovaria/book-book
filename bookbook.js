const $bookCon = document.querySelector(".bookCon");

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

fetch("http://localhost:3000/api/search?query=연금술사")
  .then((response) => response.json())
  .then((data) => {
    // console.log("API 응답 데이터:", data.item);
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
  })
  .catch((error) => {
    console.error("API 요청 중 오류 발생:", error);
    document.getElementById("result").innerText = "오류 발생: " + error.message;
  });
