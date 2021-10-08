// select div 생성
export const paintSelect = (selectElement, elementsCollection, selectName, curSelectNum) => {
    selectElement.options.length = 0;
    for (let i = 0; i < elementsCollection.length; i++){
        let option = document.createElement('option');
        option.innerText = `${selectName} #${i+1}`;
        selectElement.append(option);
    }
    selectElement.options.selectedIndex = curSelectNum;
}

// byte 변환기
export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// 두 값 사이의 난수 생성기 (최소값, 최대값, 소수점 반올림 자리)
export const getRandomArbitarary = (min, max, fixed) => {
    return ((Math.random() * (max - min)) + min).toFixed(fixed);
}