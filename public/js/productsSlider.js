const allProductBox = document.getElementsByClassName('product-box-layout');
const infoBox = document.querySelectorAll('.product-info');
const prevBtn = document.querySelectorAll('.prevBtn');
const nextBtn = document.querySelectorAll('.nextBtn');

const latestProduct = allProductBox[0];
const viewsProduct = allProductBox[1];

const latestPrevBtn = prevBtn[0];
const latestNextBtn = nextBtn[0];
const viewsPrevBtn = prevBtn[1];
const viewsNextBtn = nextBtn[1];
let content = '';
if (latestProduct.querySelectorAll('.product-info')) {
  content = latestProduct.querySelectorAll('.product-info');
}
// let content = latestProduct.querySelectorAll('.product-info');

const size = infoBox[0].getBoundingClientRect().width + 13;

latestPrevBtn.addEventListener('click', function () {
  if (latestProduct.dataset.nowLeft != '0') {
    latestProduct.dataset.nowLeft =
      parseInt(latestProduct.dataset.nowLeft) + size * 3;
    latestProduct.style.transform = `translateX(${latestProduct.dataset.nowLeft}px)`;
  }
});

latestNextBtn.addEventListener('click', function () {
  if (
    parseInt(latestProduct.dataset.nowLeft) > -(size * content.length - size)
  ) {
    latestProduct.dataset.nowLeft =
      parseInt(latestProduct.dataset.nowLeft) - size * 3;
    latestProduct.style.transform = `translateX(${latestProduct.dataset.nowLeft}px)`;
  }
});

if (viewsProduct) {
  viewsPrevBtn.addEventListener('click', () => {
    if (viewsProduct.dataset.nowLeft != '0') {
      viewsProduct.dataset.nowLeft =
        parseInt(viewsProduct.dataset.nowLeft) + size * 3;
      viewsProduct.style.transform = `translateX(${viewsProduct.dataset.nowLeft}px)`;
    }
  });
  viewsNextBtn.addEventListener('click', () => {
    if (
      parseInt(viewsProduct.dataset.nowLeft) > -(size * content.length - size)
    ) {
      viewsProduct.dataset.nowLeft =
        parseInt(viewsProduct.dataset.nowLeft) - size * 3;
      viewsProduct.style.transform = `translateX(${viewsProduct.dataset.nowLeft}px)`;
    }
  });
}
