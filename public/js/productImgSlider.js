var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function showSlides(n) {
  const slides = document.getElementsByClassName('img-box');
  const imgbutton = document.querySelectorAll('.imgbutton');
  if (slides.length !== 1) {
    if (n > slides.length) {
      slideIndex = 1;
    }
    if (n < 1) {
      slideIndex = slides.length;
    }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }

    slides[slideIndex - 1].style.display = 'block';
  } else {
    slides[slideIndex - 1].style.display = 'block';
    imgbutton.forEach((e) => {
      e.style.display = 'none';
    });
  }
}
