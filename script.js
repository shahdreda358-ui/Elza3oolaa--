
/* =========================================================
   ALWAYS START FROM TOP ON REFRESH
========================================================= */

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("load", function () {
    window.scrollTo(0, 0);
});



/* =========================================================
   PAGE TRANSITION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    // دخول الصفحة بشكل ناعم
    document.body.classList.add("page-enter");

    setTimeout(function () {
        document.body.classList.add("page-enter-active");
    }, 50);


    // الانتقال بين الصفحات
    document.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function (event) {

            const href = this.getAttribute("href");

            if (!href) return;

            // روابط داخل نفس الصفحة
            if (href.startsWith("#")) return;

            // روابط خارجية
            if (
                href.startsWith("http") ||
                href.startsWith("mailto:") ||
                href.startsWith("tel:")
            ) {
                return;
            }

            // فتح في Tab جديد
            if (this.target === "_blank") return;

            event.preventDefault();

            // خروج ناعم
            document.body.classList.remove(
                "page-enter-active"
            );

            document.body.classList.add(
                "page-exit"
            );

            setTimeout(function () {

                window.location.href = href;

            }, 700);

        });

    });

});


/* =========================================================
   LOADER
========================================================= */

window.addEventListener("load", function () {

    setTimeout(function () {

        const loader =
            document.getElementById("loader");

        if (loader) {

            loader.style.opacity = "0";

            setTimeout(function () {

                loader.style.display = "none";

            }, 700);

        }

    }, 1200);

});


/* =========================================================
   SMOOTH SCROLL
========================================================= */

function smoothScrollTo(id) {

    const target =
        document.getElementById(id);

    if (!target) return;


    const startPosition =
        window.pageYOffset;


    const targetPosition =
        target.getBoundingClientRect().top +
        window.pageYOffset;


    const distance =
        targetPosition - startPosition;


    const duration = 1800;

    let startTime = null;


    function animation(currentTime) {

        if (startTime === null) {

            startTime = currentTime;

        }


        const timeElapsed =
            currentTime - startTime;


        const progress =
            Math.min(
                timeElapsed / duration,
                1
            );


        const ease =
            progress < 0.5
                ? 2 * progress * progress
                : 1 -
                Math.pow(
                    -2 * progress + 2,
                    2
                ) / 2;


        window.scrollTo(
            0,
            startPosition +
            distance * ease
        );


        if (timeElapsed < duration) {

            requestAnimationFrame(animation);

        }

    }


    requestAnimationFrame(animation);

}


/* تشغيل Smooth Scroll */

document.querySelectorAll(
    'a[href^="#"]'
).forEach(function (link) {

    link.addEventListener(
        "click",
        function (event) {

            const id =
                this.getAttribute("href");


            if (!id || id === "#") return;


            const target =
                document.querySelector(id);


            if (!target) return;


            event.preventDefault();


            smoothScrollTo(
                id.substring(1)
            );

        }
    );

});


/* =========================================================
   MUSIC
========================================================= */

const music =
    document.getElementById("music");

const musicBtn =
    document.getElementById("musicBtn");

let playing = false;


if (music && musicBtn) {

    const savedTime =
        localStorage.getItem(
            "musicTime"
        );


    const savedPlaying =
        localStorage.getItem(
            "musicPlaying"
        );


    /* استرجاع مكان الأغنية */

    if (savedTime) {

        music.addEventListener(
            "loadedmetadata",
            function () {

                const time =
                    parseFloat(savedTime);


                if (
                    !isNaN(time) &&
                    time >= 0 &&
                    time < music.duration
                ) {

                    music.currentTime =
                        time;

                }

            },
            {
                once: true
            }
        );

    }


    /* تحديث شكل زر الموسيقى */

    function updateMusicUI() {

        if (!music.paused) {

            playing = true;

            musicBtn.innerHTML = "♫";

            musicBtn.style.background =
                "#d99bad";

        } else {

            playing = false;

            musicBtn.innerHTML = "♪";

            musicBtn.style.background =
                "rgba(255,255,255,.1)";

        }

    }


    /* تشغيل الأغنية */

    function playMusic() {

        music.play()
            .then(function () {

                playing = true;


                localStorage.setItem(
                    "musicPlaying",
                    "true"
                );


                updateMusicUI();

            })
            .catch(function () {

                console.log(
                    "المتصفح محتاج تفاعل من المستخدم لتشغيل الأغنية"
                );

            });

    }


    /* زر الموسيقى */

    musicBtn.addEventListener(
        "click",
        function () {

            if (music.paused) {

                playMusic();

            } else {

                music.pause();


                localStorage.setItem(
                    "musicPlaying",
                    "false"
                );


                updateMusicUI();

            }

        }
    );


    /* حفظ مكان الأغنية */

    setInterval(function () {

        if (!music.paused) {

            localStorage.setItem(
                "musicTime",
                music.currentTime
            );

        }

    }, 500);


    /* حفظ الحالة قبل إغلاق الصفحة */

    window.addEventListener(
        "beforeunload",
        function () {

            localStorage.setItem(
                "musicTime",
                music.currentTime
            );


            localStorage.setItem(
                "musicPlaying",
                music.paused
                    ? "false"
                    : "true"
            );

        }
    );


    /* لو الأغنية خلصت */

    music.addEventListener(
        "ended",
        function () {

            localStorage.setItem(
                "musicTime",
                "0"
            );


            localStorage.setItem(
                "musicPlaying",
                "false"
            );


            playing = false;


            updateMusicUI();

        }
    );


    /* محاولة استكمال الأغنية */

    if (savedPlaying === "true") {

        playMusic();


        function resumeMusic() {

            if (
                music.paused &&
                localStorage.getItem(
                    "musicPlaying"
                ) === "true"
            ) {

                playMusic();

            }

        }


        document.addEventListener(
            "click",
            resumeMusic,
            {
                once: true
            }
        );


        document.addEventListener(
            "touchstart",
            resumeMusic,
            {
                once: true
            }
        );

    }


    music.addEventListener(
        "play",
        updateMusicUI
    );


    music.addEventListener(
        "pause",
        updateMusicUI
    );

}


/* =========================================================
   IMAGE MODAL
========================================================= */

function openImage(card) {

    const image =
        card.querySelector("img");


    const modal =
        document.getElementById(
            "imageModal"
        );


    const modalImage =
        document.getElementById(
            "modalImage"
        );


    if (
        !image ||
        !modal ||
        !modalImage
    ) return;


    modalImage.src =
        image.src;


    modal.classList.add(
        "active"
    );

}


function closeImage() {

    const modal =
        document.getElementById(
            "imageModal"
        );


    if (modal) {

        modal.classList.remove(
            "active"
        );

    }

}


/* =========================================================
   MODAL IMAGE CLICK
========================================================= */

const modalImage =
    document.getElementById(
        "modalImage"
    );


if (modalImage) {

    modalImage.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

        }
    );

}


/* =========================================================
   LETTER TYPING
   تبدأ فقط عند الوصول للرسالة
========================================================= */

const letterElement =
    document.getElementById(
        "letterText"
    );


const originalLetter = `
غاليتي كوثوره،

بحبك كثير، وبدي تعرفي وتضل عارفة

إني بحبك ورح ضل أحبك لموت.

الله يخليلي ياكي وما يحرمني منك بيوم،

ويجمعنا سوا يا رب. 🤍🌷
`;


let typingStarted = false;

let typingFinished = false;

let typingTimer = null;


/* =========================================================
   TYPE LETTER
========================================================= */

function typeLetter() {

    if (!letterElement) return;


    // منع تشغيل الكتابة أكثر من مرة
    if (
        typingStarted ||
        typingFinished
    ) {
        return;
    }


    typingStarted = true;


    // الرسالة تبدأ فاضية
    letterElement.innerHTML = "";


    let index = 0;


    function type() {

        if (
            index >=
            originalLetter.length
        ) {

            typingFinished = true;

            typingTimer = null;

            return;

        }


        const char =
            originalLetter.charAt(
                index
            );


        if (char === "\n") {

            letterElement.innerHTML +=
                "<br>";

        } else {

            letterElement.innerHTML +=
                char;

        }


        index++;


        /*
           سرعة الكتابة

           70 = متوسطة
           90 = أبطأ
           110 = رومانسية وبطيئة
        */

        typingTimer =
            setTimeout(
                type,
                70
            );

    }


    type();

}


/* =========================================================
   START LETTER WHEN IT APPEARS ON SCREEN
========================================================= */

if (letterElement) {

    const letterSection =
        letterElement.closest("section") ||
        letterElement;


    /*
       نخلي الرسالة فاضية تمامًا
       قبل ما تظهر على الشاشة
    */

    letterElement.innerHTML = "";


    const letterObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting &&
                            !typingStarted &&
                            !typingFinished
                        ) {

                            typeLetter();

                            /*
                               بعد ما نوصل للرسالة
                               مش محتاجين نراقبها تاني
                            */

                            letterObserver.disconnect();

                        }

                    }
                );

            },
            {
                threshold: 0.3
            }
        );


    letterObserver.observe(
        letterSection
    );

}


/* =========================================================
   LOVE COUNTER
========================================================= */

function startLoveCounter() {

    const daysElement =
        document.getElementById(
            "days"
        );


    const hoursElement =
        document.getElementById(
            "hours"
        );


    const minutesElement =
        document.getElementById(
            "minutes"
        );


    const secondsElement =
        document.getElementById(
            "seconds"
        );


    /* التأكد من وجود العناصر */

    if (
        !daysElement ||
        !hoursElement ||
        !minutesElement ||
        !secondsElement
    ) {

        console.log(
            "Counter elements not found!"
        );

        return;

    }


    /* تاريخ بداية العلاقة */

    const startDate =
        new Date(
            "2024-07-07T00:00:00"
        );


    function updateCounter() {

        const now =
            new Date();


        const difference =
            now.getTime() -
            startDate.getTime();


        if (difference < 0) {

            daysElement.textContent =
                "0";


            hoursElement.textContent =
                "00";


            minutesElement.textContent =
                "00";


            secondsElement.textContent =
                "00";


            return;

        }


        const totalSeconds =
            Math.floor(
                difference / 1000
            );


        const days =
            Math.floor(
                totalSeconds / 86400
            );


        const hours =
            Math.floor(
                (totalSeconds % 86400) /
                3600
            );


        const minutes =
            Math.floor(
                (totalSeconds % 3600) /
                60
            );


        const seconds =
            totalSeconds % 60;


        daysElement.textContent =
            days;


        hoursElement.textContent =
            String(hours).padStart(
                2,
                "0"
            );


        minutesElement.textContent =
            String(minutes).padStart(
                2,
                "0"
            );


        secondsElement.textContent =
            String(seconds).padStart(
                2,
                "0"
            );

    }


    /* تشغيل الكاونتر فورًا */

    updateCounter();


    /* تحديث كل ثانية */

    setInterval(
        updateCounter,
        1000
    );

}


/* =========================================================
   START COUNTER
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        startLoveCounter
    );

} else {

    startLoveCounter();

}


/* =========================================================
   FLIP PHOTO CARD
========================================================= */

function flipCard(card) {

    card.classList.toggle(
        "flipped"
    );


    createLoveEffects(card);

}


/* =========================================================
   HEARTS & FLOWERS EFFECT
========================================================= */

function createLoveEffects(card) {

    const symbols = [
        "🤍",
        "♡",
        "💗",
        "💖",
        "🌷",
        "🌸",
        "✨"
    ];


    for (
        let i = 0;
        i < 15;
        i++
    ) {

        const effect =
            document.createElement(
                "span"
            );


        effect.className =
            "love-effect";


        effect.innerHTML =
            symbols[
            Math.floor(
                Math.random() *
                symbols.length
            )
            ];


        effect.style.left =
            Math.random() *
            100 +
            "%";


        effect.style.top =
            Math.random() *
            100 +
            "%";


        const size =
            Math.random() *
            12 +
            14;


        effect.style.fontSize =
            size +
            "px";


        effect.style.animationDelay =
            Math.random() *
            0.5 +
            "s";


        card.appendChild(
            effect
        );


        setTimeout(
            function () {

                effect.remove();

            },
            2500
        );

    }

}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeImage();

        }

    }
);
