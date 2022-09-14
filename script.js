

document.addEventListener('DOMContentLoaded', () => {

    const imageEdit = document.querySelector('.image-edit');
    const inputsFilter = document.querySelectorAll('.filters input');

    const buttonReset = document.querySelector('.btn-reset');
    const buttonNext = document.querySelector('.btn-next');
    const buttonLoad = document.querySelector('input[type="file"]');
    const buttonSave = document.querySelector('.btn-save');

    const presets_block = document.querySelector(".presets");
    const presets = document.querySelectorAll(".presets__img");

    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext("2d");

    let indexImage = 0;

    const CLEAR_FILTERS = {
        blur: 0,
        invert: 0,
        sepia: 0,
        saturate: 100,
        hue: 0,
      };


    function filterUpdate() {
        const suffix = this.dataset.sizing || '';
        imageEdit.style.setProperty(`--${this.name}`, this.value + suffix);
        if (this.name !== 'base') {
            const outputFilter = this.nextElementSibling;
            outputFilter.innerHTML = this.value;
        }
        drawCanvas();
    }
    inputsFilter.forEach(input => input.addEventListener('input', filterUpdate));


    function filterReset() {
        inputsFilter.forEach(input => {
            const suffix = input.dataset.sizing || '';
            input.value = input.defaultValue;
            imageEdit.style.setProperty(`--${input.name}`, input.value + suffix);
            if (input.name !== 'base') {
                const outputFilter = input.nextElementSibling;
                outputFilter.innerHTML = input.value;
            }
        });
        drawCanvas();
    }
    buttonReset.addEventListener('click', filterReset);


    function getImage() {
        const imagesList = ['01.jpg', '02.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '08.jpg', '09.jpg', '10.jpg', '11.jpg', '12.jpg', '13.jpg', '14.jpg', '15.jpg', '16.jpg', '17.jpg', '18.jpg', '19.jpg', '20.jpg'];
        let pathBaseImages = "https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/";
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 12) {
            pathBaseImages = pathBaseImages + "morning/";
        } else if (hour >= 12 && hour < 18) {
            pathBaseImages = pathBaseImages + "day/";
        } else if (hour >= 18 && hour < 24) {
            pathBaseImages = pathBaseImages + "evening/";
        } else {
            pathBaseImages = pathBaseImages + "night/";
        }

        const imageSrc = pathBaseImages + imagesList[indexImage];
        imageEdit.src = imageSrc;

        indexImage++;
        if ( indexImage >= imagesList.length ) {
            indexImage = 0;
        }

        imageEdit.onload = () => {
            presets.forEach((img) => (img.src = imageEdit.src));
        };
          
        buttonNext.disabled = true;
        setTimeout(function() {
            buttonNext.disabled = false;
        }, 250);

        drawCanvas();


    }
    buttonNext.addEventListener('click', getImage);


    function loadPicture() {
        const file = buttonLoad.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            imageEdit.src = reader.result;
            drawCanvas();
        }
        reader.readAsDataURL(file);
        buttonLoad.value = null;
    }    
    buttonLoad.addEventListener('change', loadPicture);




    function setFilter(input) {
        const suffix = input.dataset.sizing || '';
        imageEdit.style.setProperty(`--${input.name}`, input.value + suffix);
        if (input.name !== 'base') {
            const outputFilter = input.nextElementSibling;
            outputFilter.innerHTML = input.value;
        }
        drawCanvas();
    }

    function applyPreset(event) {
        let filters = CLEAR_FILTERS;

        inputsFilter.forEach(input => {
            const suffix = input.dataset.sizing || '';
            if (filters[input.name] !== undefined) {
                input.value = filters[input.name];
            }    
            imageEdit.style.setProperty(`--${input.name}`, input.value + suffix);
            if (input.name !== 'base') {
                const outputFilter = input.nextElementSibling;
                outputFilter.innerHTML = input.value;
            }
        });

        filters = {};
        if (event.target.style["filter"]) {
            event.target.style["filter"].split(" ")?.forEach((el) => {
                filters[el.match(/^[a-zA-Z\-]+/)] = el.match(/\d+[^\)]+/)?.pop();
            });
        };

        inputsFilter.forEach(input => {
            const suffix = input.dataset.sizing || '';
            if (filters[input.name] !== undefined) {

                input.value = Number(filters[input.name].replace(suffix,''));
            }    
            imageEdit.style.setProperty(`--${input.name}`, input.value + suffix);
            if (input.name !== 'base') {
                const outputFilter = input.nextElementSibling;
                outputFilter.innerHTML = input.value;
            }
        });

        drawCanvas();

    }
    presets_block.addEventListener("click", applyPreset);


    function drawCanvas() {
        let imageBlur = 0;
        inputsFilter.forEach(input => {
            if (input.name === 'blur') { 
                imageBlur = input.value;
            }
        });

        const img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.src = imageEdit.src;
        img.onload = function () {
            canvas.width = img.width
            canvas.height = img.height
            ctx.filter = getComputedStyle(imageEdit).filter.replace(
                        `blur(${imageBlur}px)`, `blur(${((img.width + img.height) / (imageEdit.width + imageEdit.height)) * imageBlur}px)`)
            ctx.drawImage(img, 0, 0)
        }
    }


    function savePicture() {

        drawCanvas();

        const link = document.createElement('a');
        link.download = 'download.png';
        link.href = canvas.toDataURL("image/png");
        link.click();
        link.delete;
    }
    buttonSave.addEventListener('click', savePicture);

    drawCanvas();

});