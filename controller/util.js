// ==================================================== Select ============================================
export const paintSelect = (selectElement, elementsCollection, selectName, curSelectNum) => {
    selectElement.options.length = 0;
    for (let i = 0; i < elementsCollection.length; i++){
        let option = document.createElement('option');
        option.innerText = `${selectName} #${i+1}`;
        selectElement.append(option);
    }
    selectElement.options.selectedIndex = curSelectNum;
}
// ==================================================== Select ============================================
