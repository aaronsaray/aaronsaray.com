const svg = document.getElementById('special-chart')

const barChart = new chartXkcd.Bar(svg, {
    title: "Percentage of Special Something",
    data: {
        labels: ['applicant #1', 'applicant #2', 'aaron'],
        datasets: [{
            data: [55, 33, 90]
        }]
    },
    options: {
        backgroundColor: "transparent",
        fontFamily: "xkcd-local"
    }
})

document.getElementById('contact').addEventListener('submit', (event) => {
    event.preventDefault()
    alert('This form is not available at this time.')
})
