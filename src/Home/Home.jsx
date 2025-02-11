import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

function Home() {
  const [text, setText] = useState(""); // 텍스트 상태 저장
  const [tempText, setTempText] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userInput, setUserInput] = useState([]);
  const [messages, setMessages] = useState("");
  const [isInputAtBottom, setIsInputAtBottom] = useState(true);
  const [result, setResult] = useState("");
  const [meaning, setMeaning] = useState("Any word is not searched yet.");
  const [explanation, setExplanation] = useState("");
  const [example, setExample] = useState("");
  const [imgsrc1, setImgsrc1] = useState("");
  const [imgsrc2, setImgsrc2] = useState("");
  const [imgsrc3, setImgsrc3] = useState("");
  const [paragraphs, setParagraphs] = useState([]);
  const [showButtons, setShowButtons] = useState(true);
  const userLogin = localStorage.getItem("user_id");
  const kbs_news =
    "종합일간지를 보면 ‘사설(社說)’이 있습니다. 이것은 ‘글쓴이의 주장이나 의견을 써내는 논설’을 말하는데, 대개 사설을 읽어 보면 그 신문사의 입장과 시각을 어느 정도 파악할 수 있습니다. 같은 사안을 두고도 신문사마다 보는 시각 차이가 너무나 다른 경우가 많기 때문에 때때로 같은 것에 대해서도 사람마다 생각하는 것이 이렇게 다르구나 하고 놀랄 때가 있습니다. 이 ‘사설’이란 한자어는 ‘단체 사(社)’자에 ‘말씀 설(說)’자로 이루어진 것인데요, 이것과는 다른 ‘사설’이 또 있습니다. 예를 들어 ‘할 일도 많은데 웬 사설을 그렇게 늘어놓나?’와 같이 말할 수 있는데, 이것은 ‘말 사(辭)’자에 ‘말씀 설(說)’자로 이루어진 표현입니다. 원래 이 ‘사설’은 노래나 연극 따위의 사이사이에 엮어서 늘어놓는 이야기를 뜻하는 말이었습니다. 판소리에서, 창을 하는 중간 중간에 가락을 붙이지 않고 이야기하듯 엮어 나가는 부분이 있는데요, 이것을 ‘사설’이라고도 하고 ‘아니리’라고도 합니다. 그런데 오늘날에 와서는 길게 늘어놓는 잔소리나 푸념 섞인 말을 가리키게 된 것이지요. 참고로 앞서 말씀드린 ‘아니리’와 다르게 ‘판소리에서, 소리의 극적인 전개를 돕기 위해 몸짓이나 손짓으로 하는 동작’은 ‘발림’이라고 한다는 것도 참고로 함께 알아 두시면 좋겠습니다.";

  const fadeInFromTop = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isSearchBarMoved, setIsSearchBarMoved] = useState(false); // 서치바 이동 상태
  const [title, setTitle] = useState(
    "Past your text in the text-box\nor click a button for suggestions."
  );
  // variable save data user choose and line text user choose
  const [selectedText, setSelectedText] = useState(""); // this will save all text

  const [indexText, setIndexText] = useState(""); // this will save index text user choose

  const [isLoading, setIsLoading] = useState(false); // loading when backend hold on data

  useEffect(() => {
    console.log("meaning:", meaning);
    console.log("indexText:", indexText);
    console.log("explanation:", explanation);
    console.log("example:", example);
    console.log("selectedText", selectedText);
  }, [meaning, indexText, explanation, example, selectedText]);

  const setKBS = () => {
    const formatted = kbs_news
      .split(/(?<=[.!?])\s+/) // ".", "!", "?" 뒤의 공백 기준으로 분리
      .map((sentence) => sentence.trim()) // 각 문장의 앞뒤 공백 제거
      .filter(Boolean);
    setTempText(formatted);
    handleRemoveAll();
    if (title != "") {
      setTitle("");
    } else {
      setTitle("Past your text in the text-box");
    }
  };

  //
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openSidebar = () => {
    if (!isSidebarOpen) {
      toggleSidebar();
    }
  };

  const closeSidebar = () => {
    if (isSidebarOpen) {
      toggleSidebar();
    }
  };
  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
    // 만약 상위에서 받는 toggleSidebar가 있다면:
    // toggleSidebar();
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const handleHideButtons = () => {
    setShowButtons(false);
  };

  const clicked = () => {
    // check input if just space or do not enter will not send
    if (!userInput.trim()) {
      // Kiểm tra nếu input trống hoặc chỉ chứa khoảng trắng
      alert("Input cannot be empty!");
      return; // Ngăn không cho tiến trình tiếp tục
    }

    const formatted = userInput
      .split(/(?<=[.!?])\s+/) // ".", "!", "?" 뒤의 공백 기준으로 분리
      .map((sentence) => sentence.trim()) // 각 문장의 앞뒤 공백 제거
      .filter(Boolean);
    setTempText(formatted);
    setText("");
    if (title != "") {
      setTitle("");
    } 
    setMessages([...messages, { text: userInput, sender: "self" }]);
    setUserInput("");
    setIsInputAtBottom(true);
  };

  const handleRemoveAll = () => {
    // 버튼 보임 여부를 false 로 변경
    if (showButtons) {
      setShowButtons(false);
    } else {
      setShowButtons(true);
    }
  };

  // This function is used to identify the text that the user has highlighted, saved, and retrieve all the text that the user has saved.
  const handleMouseUp = (index) => {
    const selection = window.getSelection();
    const selectedString = selection.toString();

    if (!selectedString) return;

    // 노드 색칠
    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.style.backgroundColor = "yellow";
    span.style.borderRadius = "30px";
    span.style.padding = "4px 6px";
    span.textContent = selectedString;
    range.deleteContents();
    range.insertNode(span);

    // 1) UI를 위해 state 업데이트 (비동기)
    setSelectedText(selectedString);
    setIndexText(tempText[index]);

    // 2) API 호출에는 'state' 대신 바로 추출한 변수를 사용
    const API = "http://43.201.113.85:8000/gpt/search";
    const post_data = {
      user_id: userLogin,
      searching_word: selectedString, // 여기!
      context_sentence: tempText[index], // 여기!
      target_language: "korean",
    };

    openSidebar();
    setIsLoading(true); // on event loanding
    // 3) axios 호출
    axios
      .post(API, post_data)
      .then((response) => {
        // 서버 응답 예: gpt_result가 "뜻/설명/예문" 형태라고 가정
        const [text1, text2, text3] = response.data.gpt_result.split(/\//);

        // 상태 갱신 (비동기)
        setMeaning(text1);
        setExplanation(text2);
        setExample(text3);
        setImgsrc1(response.data.image_results[0]);
        setImgsrc2(response.data.image_results[1]);
        setImgsrc3(response.data.image_results[2]);
        // 콘솔에서 즉시 확인하고 싶다면 "로컬 변수"로 확인
        console.log("text1(뜻):", text1);
        console.log("text2(설명):", text2);
        console.log("text3(예문):", text3);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setIsLoading(false); // Kết thúc loading
      });
  };

  const seg_sent = (index) => {
    // 2) API 호출에는 'state' 대신 바로 추출한 변수를 사용
    const API = "http://43.201.113.85:8000/gpt/sentence-segment";
    const post_data = {
      complex_sentence: tempText[index],
      target_language: "korean",
    };

    setImgsrc1("");
    setImgsrc2("");
    setImgsrc3("");
    openSidebar();
    // 3) axios 호출
    axios
      .post(API, post_data)
      .then((response) => {
        const splitted = response.data.segmented_sentence?.split(/\//) || [];

        // 인덱스 0, 1, 2가 없을 수 있으니 각각 체크 후 상태 세팅
        setMeaning(splitted[0] || "");
        setExplanation(splitted[1] || "");
        setExample(splitted[2] || "");
      })
      .catch((err) => console.error(err));
  };

  const Review = (index) => {
    // 2) API 호출에는 'state' 대신 바로 추출한 변수를 사용
    const API = "http://43.201.113.85:8000/db/read-words";
    const post_data = {
      user_id: 19,
      target_language: "korean",
    };
    closeSidebar();

    // 3) axios 호출
    axios
      .post(API, post_data)
      .then((response) => {
        const sentences = response.data.paragraphs;

        setTempText(sentences);
        setMeaning("");
        setExplanation("");
        setExample("");
        setImgsrc1("");
        setImgsrc2("");
        setImgsrc3("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="App">
        {/* Navbar */}
        <div className="navbar flex items-center p-4 bg-white relative overflow-hidden gap-2">
          {/* 왼쪽 버튼 (Sidebar) */}
          <button
            onClick={handleSidebarToggle}
            className="px-4 py-2 bg-[#DA3C3B] text-white rounded-full hover:bg-[#b93231]"
          >
            Sidebar
          </button>

          {/* 가운데 + 오른쪽 버튼 묶음 */}
          <div
            className={`
          flex gap-2 transition-transform duration-300 
          ${isSidebarOpen ? "translate-x-full" : "translate-x-0"}
        `}
          >
            <button
              onClick={Review}
              className="px-4 py-2 bg-[#DA3C3B] text-white rounded-full hover:bg-[#b93231]"
            >
              Review
            </button>
            <button className="px-4 py-2 bg-[#DA3C3B] text-white rounded-full hover:bg-[#b93231]">
              Language
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full bg-gray-200 shadow-lg ${
              isSidebarOpen ? "w-96" : "w-0"
            } overflow-hidden transition-all duration-300 ease-in-out`}
          >
            <div className="p-4">
              <button
                onClick={toggleSidebar}
                className="mb-4 px-4 py-2 bg-[#DA3C3B] text-white rounded-full hover:bg-[#b93231]"
              >
                Close Sidebar
              </button>

              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <svg
                    aria-hidden="true"
                    class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span class="sr-only">Loading...</span>
                  {/* loading show when you have new request */}
                </div>
              ) : (
                <>
                  <p className="mb-4">{meaning}</p>
                  <p className="mb-4">{explanation}</p>
                  <p className="mb-4">{example}</p>
                  <img
                    src={imgsrc1}
                    onError="this.style.visibility='hidden'"
                    className="w-64 h-auto rounded"
                  ></img>
                  <img
                    src={imgsrc2}
                    onError="this.style.visibility='hidden'"
                    className="w-64 h-auto rounded"
                  ></img>
                  <img
                    src={imgsrc3}
                    onError="this.style.visibility='hidden'"
                    className="w-64 h-auto rounded"
                  ></img>
                </>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div
            className={`flex-1 flex flex-col items-center justify-center ${
              isSidebarOpen ? "ml-64" : "ml-0"
            } transition-all duration-300 ease-in-out`}
          >
            <div className="pb-16">
              {/* Messages */}
              <div
                className="
              whitespace-pre-wrap
              flex flex-col items-center justify-center
              space-y-4
            "
              >
                {tempText.length !== 0 &&
                  tempText.map((sentence, index) => (
                    <ul key={index}>
                      <div
                        className="
                      flex items-start
                      w-[1100px]          /* 고정 너비 설정 */
                    "
                      >
                        {/* 가위 이미지 버튼 */}
                        <button
                          className="
                        w-12 h-12         /* 버튼 자체 크기 고정 */
                        flex items-center  /* 수직/수평 가운데 정렬 */
                        justify-center
                        bg-transparent     /* 배경 투명 (테두리 X) */
                        mr-2              /* 오른쪽 간격 */
                        p-0               /* 기본 패딩 제거 */
                      "
                          onClick={() => {
                            seg_sent(index);
                          }}
                          aria-label="가위 버튼"
                          style={{ border: "none", outline: "none" }} // 혹시 남는 브라우저 기본 테두리 제거용
                        >
                          <img
                            src="src\Home\scissors.png" // 실제 이미지 경로로 바꿔주세요
                            alt="가위"
                            className="w-6 h-6"
                          />
                        </button>

                        {/* 문장(li) */}
                        <li
                          className="
                        mb-2
                        px-4 py-2
                        flex-1 break-words
                        bg-gray-100 text-black
                        rounded-[30px] shadow
                        list-none
                      "
                          onMouseUp={() => handleMouseUp(index)}
                        >
                          {sentence}
                        </li>
                      </div>
                    </ul>
                  ))}
              </div>

              <motion.h1
                className="text-center text-4xl mb-8 whitespace-pre-wrap"
                initial="hidden"
                animate="visible"
                variants={fadeInFromTop}
              >
                {title}
              </motion.h1>

              {/* Input and Send Button */}
              <div className="flex items-center gap-2 bg-white p-2 rounded-full shadow-md max-w-xl mx-auto mt-4 mb-6">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onInput={(e) => {
                    e.target.style.height = "auto"; // Reset height trước khi tính toán lại
                    e.target.style.height = `${e.target.scrollHeight}px`; // Điều chỉnh chiều cao dựa trên nội dung
                  }}
                  className="flex-1 px-4 py-2 border-none rounded-md bg-gray-100 text-gray-800 focus:outline-none"
                  placeholder="Enter Text..."
                  rows={1}
                />
                <button
                  onClick={clicked}
                  className="
                    px-6
                    py-3           /* 버튼도 높이를 조금 늘려 전체적으로 균형 맞춤 */
                    bg-[#DA3C3B]
                    text-white
                    font-medium
                    rounded-full
                    hover:bg-[#b93231]
                    transition
                    duration-300
                  "
                >
                  Send
                </button>
              </div>
              <div className="w-full flex justify-center mt-2">
                <div className="flex gap-4">
                  {showButtons && (
                    <button
                      className="
        flex items-center
        gap-2
        px-4 py-2
        text-sm
        text-gray-600
        border border-gray-300
        rounded-md
        hover:bg-gray-100
        transition-colors duration-200
      "
                      onClick={setKBS}
                    >
                      KBS
                    </button>
                  )}

                  <div className="flex gap-4">
                    {showButtons && (
                      <button
                        className="
        flex items-center
        gap-2
        px-4 py-2
        text-sm
        text-gray-600
        border border-gray-300
        rounded-md
        hover:bg-gray-100
        transition-colors duration-200
      "
                      >
                        SBS
                      </button>
                    )}

                    <div className="flex gap-4">
                      {showButtons && (
                        <button
                          className="
        flex items-center
        gap-2
        px-4 py-2
        text-sm
        text-gray-600
        border border-gray-300
        rounded-md
        hover:bg-gray-100
        transition-colors duration-200
      "
                        >
                          YTN
                        </button>
                      )}

                      <div className="flex gap-4">
                        {showButtons && (
                          <button
                            className="
        flex items-center
        gap-2
        px-4 py-2
        text-sm
        text-gray-600
        border border-gray-300
        rounded-md
        hover:bg-gray-100
        transition-colors duration-200
      "
                          >
                            MBC
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="search w-full max-w-md">
                      {/* 필요 없는 주석 처리된 부분은 그대로 두거나 제거하셔도 됩니다 */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
