export default function calculateDigitollCommission (digitollPriceInCents) {
    const tenPercent = Math.floor(digitollPriceInCents * 0.1) // calculate 10% of the price
    const total = tenPercent + 30 // add $0.30 to the 10% value
    return Math.round(total)
}