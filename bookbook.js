const $bookCon = document.querySelector(".bookCon");

const createBookInfo = (bookInfo) => {
  // let description = bookInfo.description
  //   ? bookInfo.description.length > 30
  //     ? bookInfo.description.subString(0, 30) + '.."'
  //     : bookInfo.description
  //   : "내용이 존재하지 않습니다";

  const newBookInfo = `
      <li class="book-item">
        <div class="book-card">
          <div class="book-image">
            <img src=${bookInfo.cover} alt="Book cover" />
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

fetch("http://localhost:3000/api/search?query=aladdin")
  .then((response) => response.json())
  .then((data) => {
    // console.log("API 응답 데이터:", data.item);
    const bookHTML = data.item.map((book) => createBookInfo(book)).join("");
    $bookCon.innerHTML = bookHTML;
  })
  .catch((error) => {
    console.error("API 요청 중 오류 발생:", error);
    document.getElementById("result").innerText = "오류 발생: " + error.message;
  });
