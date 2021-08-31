// utils
const select = query => document.querySelector(query);

const timed_class = (element, class_name, time = 1000, on_end = () => {}) => {
    element.classList.add(class_name);
    setTimeout(() => {
        element.classList.remove(class_name);
        on_end();
    }, time);
}

const light = (element, time, callback) => timed_class(element, "selected", time, callback);

// dom elements
const colors  = [select(".green"), select(".red"), select(".blue"), select(".yellow")];
const modal   = select(".message-modal");
const title   = select(".title");
const message = select(".message");

function init() {

    let points = 0;
    const stack = [];

    const color_from_stack_index = index => colors[stack[index]];

    const game_over = () => {
        colors.forEach(element => element.removeEventListener("click", click));

        title.innerText = "Game over";
        message.innerText = "Sua pontuação foi " + points + " pontos.";

        timed_class(modal, "visible", message.innerText.length * 100, init);
    }

    let user_color_index = 0;
    const click = event => {
        let color_choosed = event.target;
        light(color_choosed, 250);

        if (color_from_stack_index(user_color_index) !== color_choosed) return game_over();

        points++;
        user_color_index++;

        if (user_color_index !== stack.length) return;

        colors.forEach(element => element.removeEventListener("click", click));
        setTimeout(next, 1000);
    }

    let delay = 500;
    function next() {
        user_color_index = 0;
        stack.push(Math.random() * 4 | 0);

        // light all
        let sequence_index = 0;
        setTimeout(function next_on_sequence () {
            if (sequence_index === stack.length) return colors.forEach(element => element.addEventListener("click", click));
            else light(color_from_stack_index(sequence_index), 250, () => {
                setTimeout(next_on_sequence, delay);
            });
            sequence_index++;
        }, 1000);

        delay *= 0.9;
    }

    title.innerText = "Iniciando jogo";
    message.innerText = "O jogo será iniciado, prepare-se";
    timed_class(modal, "visible", message.innerText.length * 100, next);
}

init();