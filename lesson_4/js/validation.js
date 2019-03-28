function validationField(field, key) {
    const $field = document.getElementById(field);
    if (key.test($field.value)) {
        $field.classList.remove('redoutline');
        return true;
    } else {
        $field.classList.add('redoutline');
        return false;
    }
}

function hundleSubmitClick(event) {
    event.preventDefault();

    const regExpName = /^\w{5,}$/;
    const regExpTel = /^\+[78]\(\d{3}\)\d{3}-\d{4}$/;
    const regExpEmail = /^\w*[.-]?\w*[@][a-zA-Z]*.[a-zA-Z]{2,4}$/;

    const $report = document.querySelector('.report');
    let correctForm;
    correctForm = validationField('name', regExpName);
    correctForm = validationField('tel', regExpTel) && correctForm;
    correctForm = validationField('email', regExpEmail) && correctForm;
    
    if (!correctForm)
        $report.textContent = 'Введите корректные данные';
    else
        $report.textContent = '';
}
