document.addEventListener('alpine:init', () => {
    Alpine.data('timestamps', function () {
        return {
            name: this.$persist(''),

            data: this.$persist([]),

            values: [],

            init() {
                if (!this.name) {
                    this.name = window.prompt('wie heißt du?', '');
                }

                this.values = this.getTimestampDifferences(this.data)

                let chart = new ApexCharts(this.$refs.chart, this.options)

                chart.render()

                this.$watch('data', () => {
                    this.values = this.getTimestampDifferences(this.data)
                    chart.updateOptions(this.options)
                })
            },

            getTimestampDifferences(data) {
                if (data.length === 0) {
                    return []
                }

                const values = []

                // Iterate over the timestamps
                for (let i = 0; i < data.length - 1; i++) {
                    const currentTimestamp = new Date(data[i])
                    const nextTimestamp = new Date(data[i + 1])

                    const diffMilliseconds = nextTimestamp - currentTimestamp
                    const diffMinutes = Math.round(diffMilliseconds / (1000 * 60))

                    values.push({ x: currentTimestamp.toLocaleDateString(), y: diffMinutes })
                }

                // Add the current time for the last missing timestamp
                const lastTimestamp = new Date(data[data.length - 1])
                const currentTime = new Date()
                const diffMilliseconds = currentTime - lastTimestamp
                const diffMinutes = Math.round(diffMilliseconds / (1000 * 60))

                values.push({ x: lastTimestamp.toLocaleDateString(), y: diffMinutes })

                return values
            },

            get options() {
                return {
                    chart: { type: 'bar', toolbar: false },
                    series: [{ data: this.values, }],
                }
            }
        }
    })
})
