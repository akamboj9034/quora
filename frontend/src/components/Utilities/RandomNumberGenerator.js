export const randomNumber = () => {
    const min = 0
    const max = 35
    const stringPool = "0123456789abcdefghijklmnopqrstuvwxyz"
    let randomString = ''
    for (let i = 0; i < 24; i++) {
        let random = Math.floor(Math.random() * (max - min)) + min;
        randomString = randomString + stringPool.charAt(random)
    }

    return randomString
}