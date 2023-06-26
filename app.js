const debug = [
    new Date('2023-06-21T12:00:21.817Z'),
    new Date('2023-06-23T12:10:21.817Z'),
    new Date('2023-06-23T18:10:21.817Z'),
];

document.addEventListener('alpine:init', () => {
    Alpine.data('timestamps', function () {
        return {
            name: this.$persist(''),

            // data: debug,
            data: this.$persist([]),

            values: [],

            init() {
                if (!this.name) {
                    this.name = window.prompt('wie heißt du?', '');
                }

                this.values = this.getTimestampDifferences(this.data)

                this.$watch('data', () => {
                    this.values = this.getTimestampDifferences(this.data)
                })
            },

            remove(index) {
                this.data.splice(index, 1)
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

                    const diffInMilliseconds = nextTimestamp - currentTimestamp

                    values.push({ x: currentTimestamp.toLocaleDateString(), y: diffInMilliseconds })
                }

                // Add the current time for the last missing timestamp
                const lastTimestamp = new Date(data[data.length - 1])
                const currentTime = new Date()

                const diffInMilliseconds = currentTime - lastTimestamp

                values.push({ x: lastTimestamp.toLocaleDateString(), y: diffInMilliseconds })

                return values
            },

            getSeconds(milliseconds) {
                return Math.floor(milliseconds / (1000))
            },
            getMinutes(milliseconds) {
                return Math.floor(milliseconds / (1000 * 60))
            },
            getHours(milliseconds) {
                return Math.floor(milliseconds / (1000 * 60 * 60))
            },
            getDays(milliseconds) {
                return Math.floor(milliseconds / (1000 * 60 * 60 * 24))
            },
            getWeeks(milliseconds) {
                return Math.floor(milliseconds / (1000 * 60 * 60 * 24 * 7))
            },

            getDisplayValue(milliseconds) {
                const seconds = this.getSeconds(milliseconds)
                const minutes = this.getMinutes(milliseconds)
                const hours = this.getHours(milliseconds)
                const days = this.getDays(milliseconds)
                const weeks = this.getWeeks(milliseconds)

                if (weeks > 0) {
                    return weeks + " w"
                } else if (days > 0) {
                    return days + " d"
                } else if (hours > 0) {
                    return hours + " h"
                } else if (minutes > 0) {
                    return minutes + " min"
                } else {
                    return seconds + " s"
                }
            },
        }
    })
})
