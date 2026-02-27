document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password-input');
    const toggleVisibilityBtn = document.getElementById('toggle-visibility');
    const iconEye = document.getElementById('icon-eye');
    const iconEyeOff = document.getElementById('icon-eye-off');

    const strengthText = document.getElementById('strength-text');
    const strengthScore = document.getElementById('strength-score');
    const bars = [
        document.getElementById('bar-1'),
        document.getElementById('bar-2'),
        document.getElementById('bar-3'),
        document.getElementById('bar-4')
    ];

    const reqElements = {
        length: document.getElementById('req-length'),
        lower: document.getElementById('req-lower'),
        upper: document.getElementById('req-upper'),
        number: document.getElementById('req-number'),
        special: document.getElementById('req-special')
    };

    const strengthMessages = ['Empty', 'Weak', 'Fair', 'Good', 'Strong'];
    const strengthColors = [
        'var(--strength-0)',
        'var(--strength-1)',
        'var(--strength-2)',
        'var(--strength-3)',
        'var(--strength-4)'
    ];

    // Toggle password visibility
    toggleVisibilityBtn.addEventListener('click', () => {
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            iconEye.style.display = 'none';
            iconEyeOff.style.display = 'block';
        } else {
            passwordInput.type = 'password';
            iconEye.style.display = 'block';
            iconEyeOff.style.display = 'none';
        }
    });

    // Evaluate password strength
    passwordInput.addEventListener('input', (e) => {
        const password = e.target.value;
        const result = evaluatePassword(password);

        updateUI(result, password.length === 0);
    });

    function evaluatePassword(password) {
        let score = 0;

        const checks = {
            length: password.length >= 8,
            lower: /[a-z]/.test(password),
            upper: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };

        // Calculate score based on met requirements
        let fulfilledCount = 0;
        for (const key in checks) {
            if (checks[key]) fulfilledCount++;
        }

        if (fulfilledCount === 0) score = 0;
        else if (fulfilledCount <= 2) score = 1;
        else if (fulfilledCount <= 3) score = 2;
        else if (fulfilledCount <= 4) score = 3;
        else score = 4;

        // Penalty for very short passwords even if they contain different types
        if (password.length > 0 && password.length < 6) {
            score = 1;
        }

        return { score, checks };
    }

    function updateUI(result, isEmpty) {
        const { score, checks } = result;

        // Update score text
        if (isEmpty) {
            strengthText.textContent = 'Empty';
            strengthText.style.color = 'var(--text-secondary)';
            strengthScore.textContent = '0 / 4';
        } else {
            strengthText.textContent = strengthMessages[score];
            strengthText.style.color = strengthColors[score];
            strengthScore.textContent = `${score} / 4`;
        }

        // Update bars
        bars.forEach((bar, index) => {
            if (isEmpty) {
                bar.style.backgroundColor = 'var(--strength-0)';
            } else if (index < score) {
                // Color filled bars based on total score
                bar.style.backgroundColor = strengthColors[score];
            } else {
                bar.style.backgroundColor = 'var(--strength-0)';
            }
        });

        // Update requirements list
        for (const req in checks) {
            if (checks[req]) {
                reqElements[req].classList.add('valid');
                reqElements[req].classList.remove('invalid');
            } else {
                reqElements[req].classList.add('invalid');
                reqElements[req].classList.remove('valid');
            }
        }
    }
});
