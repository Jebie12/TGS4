// Toggle dropdown menu
document.getElementById('burgerIcon').addEventListener('click', function() {
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (dropdownMenu.style.display === 'flex') {
        dropdownMenu.style.display = 'none';
    } else {
        dropdownMenu.style.display = 'flex';
    }
});

// Close dropdown menu when clicking outside
document.addEventListener('click', function(event) {
    const burgerIcon = document.getElementById('burgerIcon');
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (!burgerIcon.contains(event.target)) {
        dropdownMenu.style.display = 'none';
    }
});

// Handle form submission
document.getElementById('bisectionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get input values
    const func = document.getElementById('function').value;
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const tolerance = parseFloat(document.getElementById('tolerance').value);
    const maxIterations = parseInt(document.getElementById('maxIterations').value);

    // Clear previous results and error message
    const resultsTbody = document.querySelector('#resultsTable tbody');
    resultsTbody.innerHTML = '';
    const intervalTbody = document.querySelector('#intervalTable tbody');
    intervalTbody.innerHTML = '';
    const stepsTbody = document.querySelector('#stepsTable tbody');
    stepsTbody.innerHTML = '';
    document.getElementById('errorMessage').innerText = '';

    // Define the function
    const f = (x) => eval(func.replace(/x/g, x));

    // Bisection method
    let iteration = 0;
    let currentA = a;
    let currentB = b;
    let t, fA, fB, fT, error, decision, fTfA, fTfB;

    do {
        iteration++;
        fA = f(currentA);
        fB = f(currentB);
        t = (currentA + currentB) / 2;
        fT = f(t);
        error = Math.abs(currentB - currentA) / 2;

        // Add row to results table
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${iteration}</td>
            <td>${iteration === 1 ? a.toFixed(6) : currentA.toFixed(6)}</td>
            <td>${iteration === 1 ? b.toFixed(6) : currentB.toFixed(6)}</td>
            <td>${fA.toFixed(6)}</td>
            <td>${fB.toFixed(6)}</td>
            <td>${t.toFixed(6)}</td>
            <td>${fT.toFixed(6)}</td>
            <td>${error.toFixed(6)}</td>
        `;
        resultsTbody.appendChild(row);

        // Determine new interval
        if (fT * fA < 0) {
            decision = `[${currentA.toFixed(6)}, ${t.toFixed(6)}]`;
            currentB = t;
        } else {
            decision = `[${t.toFixed(6)}, ${currentB.toFixed(6)}]`;
            currentA = t;
        }

        fTfA = fT * fA;
        fTfB = fT * fB;

        // Add row to interval table
        const intervalRow = document.createElement('tr');
        intervalRow.innerHTML = `
            <td>f(t) * f(a) = ${fT.toFixed(6)} * ${fA.toFixed(6)} = ${fTfA.toFixed(6)} <br>Interval: [${iteration === 1 ? a.toFixed(6) : currentA.toFixed(6)}, ${t.toFixed(6)}]</td>
            <td>f(t) * f(b) = ${fT.toFixed(6)} * ${fB.toFixed(6)} = ${fTfB.toFixed(6)} <br>Interval: [${t.toFixed(6)}, ${iteration === 1 ? b.toFixed(6) : currentB.toFixed(6)}]</td>
            <td>${decision}</td>
        `;
        intervalTbody.appendChild(intervalRow);

        // Add row to steps table
        const stepsRow = document.createElement('tr');
        stepsRow.innerHTML = `
            <td>${iteration}</td>
            <td>
                Iteration ${iteration}:
                1. Calculate f(a) = ${func.replace(/x/g, iteration === 1 ? a.toFixed(6) : currentA.toFixed(6))} = ${fA.toFixed(6)}
                2. Calculate f(b) = ${func.replace(/x/g, iteration === 1 ? b.toFixed(6) : currentB.toFixed(6))} = ${fB.toFixed(6)}
                3. Calculate t = (a + b) / 2 = (${iteration === 1 ? a.toFixed(6) : currentA.toFixed(6)} + ${iteration === 1 ? b.toFixed(6) : currentB.toFixed(6)}) / 2 = ${t.toFixed(6)}
                4. Calculate f(t) = ${func.replace(/x/g, t.toFixed(6))} = ${fT.toFixed(6)}
            </td>
        `;
        stepsTbody.appendChild(stepsRow);

        // Check for convergence
        if (error < tolerance || iteration >= maxIterations) {
            break;
        }
    } while (true);

    // Check if the final error meets the tolerance
    if (error >= tolerance) {
        document.getElementById('errorMessage').innerText = 'The exact tolerance not meet';
    }
});