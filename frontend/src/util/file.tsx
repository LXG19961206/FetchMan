export const fileToUint8Array = (file: File) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            try {
                const file = (event.target) as FileReader
                resolve(new Uint8Array(file.result as ArrayBuffer))
            } catch (err) {
               resolve(new Uint8Array())
            }
        });
        reader.addEventListener('error', reject);
        reader.readAsArrayBuffer(file);
    });
}