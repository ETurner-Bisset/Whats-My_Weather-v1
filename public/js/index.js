const date = new Date().getFullYear();

// Dynamically show wind direction

const line = document.querySelector('line');
if (line) {
  const degree = line.id;

  const rotateLine = (degree) => {
    line.style.transform = `rotateZ(${degree}deg)`;
  };

  rotateLine(degree);
}

// Get user location

const input = document.getElementById('searchQ');

const getLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    input.value = `${position.coords.latitude},${position.coords.longitude}`;
  });
};

if (navigator.geolocation) {
  const locBtn = document.getElementById('location');
  if (locBtn) {
    locBtn.style.display = 'block';
    locBtn.addEventListener('click', (e) => {
      e.preventDefault();
      getLocation();
    });
  }
}

// Show hours

const containers = document.querySelectorAll('.container');
const backdrop = document.querySelector('.backdrop');

const openHours = (btn, container) => {
  btn.addEventListener('click', () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    backdrop.classList.add('show-backdrop');
    container.classList.add('show-hours');
  });
};

const closeHours = (btn, container) => {
  btn.addEventListener('click', () => {
    container.classList.remove('show-hours');
    backdrop.classList.remove('show-backdrop');
  });
};

if (containers) {
  containers.forEach((container) => {
    openHours(
      container.childNodes[0].childNodes[11].childNodes[0].childNodes[1],
      container.childNodes[1]
    );
    closeHours(
      container.childNodes[1].childNodes[0].childNodes[1],
      container.childNodes[1]
    );
    closeHours(
      container.parentNode.parentNode.childNodes[0],
      container.childNodes[1]
    );
  });
}

// Open close about modal
const aboutBtn = document.querySelector('.footer__btn');
const modal = document.querySelector('.modal');
const closeModalBtn = document.querySelector('.modal__close');

const openModal = () => {
  modal.classList.add('show-modal');
  backdrop.classList.add('show-backdrop');
};

const closeModal = () => {
  modal.classList.remove('show-modal');
  backdrop.classList.remove('show-backdrop');
};

aboutBtn.addEventListener('click', openModal);

backdrop.addEventListener('click', closeModal);

closeModalBtn.addEventListener('click', closeModal);
