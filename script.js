function calculateChecksum(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const spark = new SparkMD5.ArrayBuffer();

        reader.onload = (event) => {
            spark.append(event.target.result);
            const checksum = spark.end();
            resolve(checksum);
        };

        reader.onerror = () => {
            reject(new Error('Error reading file.'));
        };

        reader.readAsArrayBuffer(file);
    });
}

function handleFileInput(event) {
    const file = event.target.files[0];
    if (file) {
        calculateChecksum(file)
            .then((checksum) => {
                const resultElement = document.getElementById('checksum-result');
                resultElement.innerText = 'Checksum: ' + checksum;
            })
            .catch((error) => {
                console.error(error);
            });
    }
}

function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
}

function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    const fileInput = document.getElementById('file-input');
    fileInput.files = event.dataTransfer.files;
    handleFileInput(event);
}

function copyChecksum() {
    const resultElement = document.getElementById('checksum-result');
    const checksum = resultElement.innerText.replace('Checksum: ', '');

    const textarea = document.createElement('textarea');
    textarea.value = checksum;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    alert('Checksum copied to clipboard!');
}

// Add event listeners
const dropArea = document.getElementById('drop-area');
dropArea.addEventListener('dragover', handleDragOver);
dropArea.addEventListener('drop', handleDrop);

const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', handleFileInput);