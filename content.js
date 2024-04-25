let bottomButton = $('<div id="gotoBottom" name="myGTTButton" data-testid="back-to-top-button"><svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="20" width="20" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle;"><path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path></svg></div>')
let scrollPosition = 0;

window.addEventListener("load", function () {
    chrome.runtime.onMessage.addListener(handleMessage);
    chrome.runtime.sendMessage({
        cmd: "checkStatus",
        domain: document.domain
    }, function (res) {
        
        bottomButton.css({
            position: "fixed",
            bottom: "78px",
            right: "50px",
            height: "32px",
            width: "32px",
            'z-index': "2147483647",
            cursor: "pointer",
            "box-shadow": "rgb(97, 185, 232) 0px 0px 2px",
            "background-color": "rgba(10, 10, 10, 0.3)",
            "color": "rgba(255, 255, 255, 0.8)",
            "align-items": "center",
            "justify-content": "center",
            "display":"-webkit-flex",
            transform: "rotate(180deg)"
        })
        
        $('body').append(bottomButton);
        $('body').on('click', "#gotoBottom",gotoBottom)
        $("div[name=myGTTButton]").hover(() => {
            $("div[name=myGTTButton]").css({
                "background-color": "rgba(10, 10, 10, 0.5)",
                "color": "rgba(255, 255, 255)" 
            })
        })
        checkStatus(res.all)
    });
});


const handleMessage = (request, sender, sendResponse) => {
    try {
        switch (request.cmd) {
            case "gotoBottom":
                gotoBottom()
                break
            default:
                break
        }
    } catch (e) {
        console.error(e)
    }
}

function gotoTop() {

    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  
    const intervalId = setInterval(() => {
  
      if (scrollTop > 0) {
        scrollTop -= 50;
      }
  
      window.scrollTo(0, scrollTop);
  
      if (scrollTop <= 0) {
        clearInterval(intervalId);
        setTimeout(gotoBottom, 2000);
      }
    }, 15);
}

function gotoBottom(){
    const scrollStep = 1; // 每次滚动的步长（像素）
    const scrollInterval = 15; // 滚动的间隔时间（毫秒）

    const windowHeight = $(window).height();
    const documentHeight = $(document).height();
    scrollPosition = 0;

    const scrollIntervalId = setInterval(() => {
        if (scrollPosition >= documentHeight - windowHeight) {
            clearInterval(scrollIntervalId);
            scrollPosition = documentHeight - windowHeight;
            setTimeout(scrollToTop, 1000); // 停留2秒后回到页面顶端
        }
        scrollPosition += scrollStep;
        $("html, body").scrollTop(scrollPosition);
    }, scrollInterval);

    // 监听鼠标滚轮事件停止页面滚动
    $(window).on("wheel", stopScrolling);

    // 停止页面滚动的函数
    function stopScrolling() {
        clearInterval(scrollIntervalId); // 清除滚动的计时器
        $(window).off("wheel", stopScrolling); // 解除鼠标滚轮事件监听
    }
}

function scrollToTop() {
    gotoTop();
    const scrollIntervalId = setInterval(() => {
        scrollPosition -= scrollStep;
        if (scrollPosition <= 0) {
            scrollPosition = 0;
            clearInterval(scrollIntervalId);
            gotoBottom; // 停留5秒后继续向下滚动
        }
        $("html, body").scrollTop(scrollPosition);
    }, scrollInterval);
}


window.onscroll = function(ev) {
    bottomButton.show()
};