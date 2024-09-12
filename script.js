const slider = document.querySelector(".know-how__slider");
const sliderControl = document.querySelector(".know-how__slider-controls");
const slides = document.querySelectorAll(".know-how__slide");
const slidesLength = slides.length;
const slidesArr = [].slice.call(slides);

let slideCurrent = 0;
let startCoordX = 0;
let currentCoordX = 0;
let isSwiping = false;
let touchHandled = false;

const customPaginationButtons = document.querySelectorAll(".know-how__pagination-btn");

customPaginationButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        slideCurrent = index;
        updateSlider();
    });
});

const updateSlider = () => {
    slidesArr.forEach((slide, index) => {
        if (index > slideCurrent) {
            slide.classList.add("slide-on");
            slide.classList.remove("show-text");
        } else {
            slide.classList.remove("slide-on");
            slide.classList.remove("show-text");
        }
        slide.style.removeProperty("z-index");
    });

    slidesArr[slideCurrent].classList.add("show-text");

    const prevButton = document.querySelector(".know-how__slider-control--prev");
    const nextButton = document.querySelector(".know-how__slider-control--next");

    if (slideCurrent === 0) {
        prevButton.classList.add("disabled");
    } else {
        prevButton.classList.remove("disabled");
    }

    if (slideCurrent === slidesLength - 1) {
        nextButton.classList.add("disabled");
    } else {
        nextButton.classList.remove("disabled");
    }

    customPaginationButtons.forEach((button, index) => {
        const item = button.closest(".know-how__pagination-item");
        if (index === slideCurrent) {
            item.classList.add("active");
        } else {
            item.classList.remove("active");
        }
    });
};

const sliderControls = (e) => {
    const target = e.target;

    if (target.classList.contains("know-how__slider-control--next")) {
        slideCurrent = Math.min(slideCurrent + 1, slidesLength - 1);
        updateSlider();
    }

    if (target.classList.contains("know-how__slider-control--prev")) {
        slideCurrent = Math.max(slideCurrent - 1, 0);
        updateSlider();
    }
};

sliderControl.addEventListener("click", (e) => {
    if (!touchHandled) {
        sliderControls(e);
    }
    touchHandled = false;
});

sliderControl.addEventListener("touchstart", (e) => {
    touchHandled = true;
    sliderControls(e);
});

const handleStart = (event) => {
    isSwiping = true;
    startCoordX = getEventCoordX(event);
};
const handleMove = (event) => {
    if (isSwiping) {
        currentCoordX = getEventCoordX(event);

        const diff = startCoordX - currentCoordX;

        if (diff > 50) {
            slideCurrent = Math.min(slideCurrent + 1, slidesLength - 1);
            updateSlider();
            isSwiping = false;
        } else if (diff < -50) {
            slideCurrent = Math.max(slideCurrent - 1, 0);
            updateSlider();
            isSwiping = false;
        }
    }
};
const handleEnd = () => {
    isSwiping = false;
};
const getEventCoordX = (event) => {
    return event.type.startsWith("touch") ? event.touches[0].clientX : event.clientX;
};
const applyZIndex = (el) => {
    if (el.classList.contains("show-text")) {
        el.style.zIndex = 4;
    }
};
updateSlider();
slides.forEach((el) => {
    applyZIndex(el);
    const text = el.querySelector(".know-how__slide-subtitle");
    text.addEventListener("transitionend", () => {
        applyZIndex(el);
    });
});

slider.addEventListener("mousedown", handleStart);
slider.addEventListener("mousemove", handleMove);
slider.addEventListener("mouseup", handleEnd);

slider.addEventListener("touchstart", handleStart, { passive: true });
slider.addEventListener("touchmove", handleMove, { passive: true });
slider.addEventListener("touchend", handleEnd, { passive: true });
