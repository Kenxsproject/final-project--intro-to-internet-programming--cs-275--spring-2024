window.onload = () => {
    const UserInput = () => {
        return new Promise((resolve) => {
            let size;
            do{
                size = parseInt(window.prompt(`Enter a number greater than 1; this will be the matrix size`));
                if(isNaN(size) || size <= 1){
                    alert(`Invalid size input.Please input an number greater than 1.`);
                }
            } while(isNaN(size) || size <= 1);
            resolve(size);
        });
    };

    const MatrixCreation = (size) => {
        return new Promise((resolve) =>{
            const matrix = [];
            for(let i = 0; i < size; i++ ){
                matrix.push([]);
                for(let j = 0; j < size; j++){
                    matrix[i].push(i * size + j);
                }
            }
            resolve(matrix);
        });
    };
    const printMatrix = (matrix,tableId) => {   //this function appends the matrix to HTML elements
        const table = document.getElementById(tableId);
        table.innerHTML = ``;
        matrix.forEach((row,rowIndex) => {
            const rowElement = document.createElement(`tr`);
            row.forEach((cell, columnIndex) => {
                const cellElement = document.createElement(`td`);
                cellElement.className = `cell`;
                cellElement.innerText = cell;
                if(rowIndex + columnIndex === matrix.length -1){
                    cellElement.classList.add(`unchanged-row`);
                }
                rowElement.appendChild(cellElement);
            });
            table.appendChild(rowElement);
        });
    };
    const matrixReversal = (matrix) => { //uses a temp array to store and swap the cells
        const matrixReversal = [];
        for(let i = matrix.length - 1; i >= 0; i--){
            matrixReversal.push([]);
            for(let j = matrix[i].length - 1; j >= 0; j--){
                if(i === j){
                    matrixReversal[matrixReversal.length -1].push(matrix[i][j]);
                } else{
                    matrixReversal[matrixReversal.length -1].push(matrix[j][i]);
                }
            }
        }
        return matrixReversal;
    };
    UserInput()
        .then(size => MatrixCreation(size))
        .then(matrix => {
            printMatrix(matrix, `original-matrix`);
            const reversedMatrix = matrixReversal(matrix);
            printMatrix(reversedMatrix, `reversed-matrix`);
        });
};
