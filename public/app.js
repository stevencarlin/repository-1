// DOM Elements
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const recursiveCheck = document.getElementById('recursiveCheck');
const progressSection = document.getElementById('progressSection');
const resultsSection = document.getElementById('resultsSection');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const progressPercent = document.getElementById('progressPercent');
const fileList = document.getElementById('fileList');
const successCount = document.getElementById('successCount');
const failedCount = document.getElementById('failedCount');
const totalCount = document.getElementById('totalCount');
const failedFiles = document.getElementById('failedFiles');
const failedFilesList = document.getElementById('failedFilesList');
const resetBtn = document.getElementById('resetBtn');
const status = document.getElementById('status');
const statusText = document.getElementById('statusText');

// State
let uploadedFiles = [];
let failedFileNames = [];

// Check connection on load
async function checkConnection() {
    try {
        const response = await fetch('/api/upload/check-connection');
        const data = await response.json();

        if (data.success) {
            status.classList.add('connected');
            statusText.textContent = 'Connected to Notion ✓';
        } else {
            status.classList.add('error');
            statusText.textContent = `Connection failed: ${data.error}`;
        }
    } catch (error) {
        status.classList.add('error');
        statusText.textContent = 'Cannot connect to server';
    }
}

// Initialize
checkConnection();

// Browse button
browseBtn.addEventListener('click', () => {
    fileInput.click();
});

// File input change
fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

// Drag and drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');

    const items = Array.from(e.dataTransfer.items);
    handleDroppedItems(items);
});

// Handle dropped items
async function handleDroppedItems(items) {
    const files = [];

    for (const item of items) {
        if (item.kind === 'file') {
            const entry = item.webkitGetAsEntry();
            if (entry) {
                await traverseFileTree(entry, files);
            }
        }
    }

    if (files.length > 0) {
        handleFiles(files);
    }
}

// Traverse file tree
async function traverseFileTree(entry, files, path = '') {
    if (entry.isFile) {
        return new Promise((resolve) => {
            entry.file((file) => {
                if (isImageFile(file.name)) {
                    files.push(file);
                }
                resolve();
            });
        });
    } else if (entry.isDirectory && recursiveCheck.checked) {
        const reader = entry.createReader();
        await new Promise((resolve) => {
            reader.readEntries(async (entries) => {
                for (const childEntry of entries) {
                    await traverseFileTree(childEntry, files, path + entry.name + '/');
                }
                resolve();
            });
        });
    }
}

// Check if file is an image
function isImageFile(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext);
}

// Handle files
async function handleFiles(files) {
    const imageFiles = Array.from(files).filter(f => isImageFile(f.name));

    if (imageFiles.length === 0) {
        alert('No image files found. Please select a folder containing images.');
        return;
    }

    // Show progress section
    progressSection.style.display = 'block';
    resultsSection.style.display = 'none';
    fileList.innerHTML = '';
    uploadedFiles = [];
    failedFileNames = [];

    // Upload files
    for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const progress = ((i + 1) / imageFiles.length) * 100;

        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${i + 1} / ${imageFiles.length} images uploaded`;
        progressPercent.textContent = `${Math.round(progress)}%`;

        await uploadFile(file);
    }

    // Show results
    showResults(imageFiles.length);
}

// Upload single file
async function uploadFile(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-item uploading';
    fileItem.textContent = `Uploading ${file.name}...`;
    fileList.appendChild(fileItem);

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            fileItem.className = 'file-item success';
            fileItem.textContent = `✓ ${file.name}`;
            uploadedFiles.push(result);
        } else {
            fileItem.className = 'file-item failed';
            fileItem.textContent = `✗ ${file.name}: ${result.error}`;
            failedFileNames.push({ name: file.name, error: result.error });
        }
    } catch (error) {
        fileItem.className = 'file-item failed';
        fileItem.textContent = `✗ ${file.name}: Upload failed`;
        failedFileNames.push({ name: file.name, error: 'Upload failed' });
    }

    // Scroll to bottom
    fileList.scrollTop = fileList.scrollHeight;
}

// Show results
function showResults(total) {
    progressSection.style.display = 'none';
    resultsSection.style.display = 'block';

    const successful = uploadedFiles.length;
    const failed = failedFileNames.length;

    successCount.textContent = successful;
    failedCount.textContent = failed;
    totalCount.textContent = total;

    if (failed > 0) {
        failedFiles.style.display = 'block';
        failedFilesList.innerHTML = '';
        failedFileNames.forEach(({ name, error }) => {
            const li = document.createElement('li');
            li.textContent = `${name}: ${error}`;
            failedFilesList.appendChild(li);
        });
    } else {
        failedFiles.style.display = 'none';
    }
}

// Reset button
resetBtn.addEventListener('click', () => {
    resultsSection.style.display = 'none';
    progressSection.style.display = 'none';
    fileInput.value = '';
    uploadedFiles = [];
    failedFileNames = [];
});
