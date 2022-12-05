class Main{
    #cellsize;
    #FPS;
    #mesh_color;
    #cell_color;
    #generation;
    #play;
    #interval;


    constructor(){
        // canvas and ctx
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");

        // grid and cells
        this.#play = false;
        this.#generation = 0;
        this.#mesh_color = "black";
        this.#cell_color = "green";
        this.grid = [];
        this.#cellsize = document.getElementById("cellsize").value;

        // about FPS
        this.lasttime = 0;
        this.#FPS = 60;
        this.#interval = 1000/this.#FPS;
        this.timer = 0;

        this.#set(); // set canvas width, height, rows, cols, fill grid
        this.#reset(); // reset everything when resize the window or change the cellsize
        this.#randomGrid(); // when press the random button make a new grid every time it pressed
        this.#playPause();
        this.#stepUp();
        this.#editCellsWithMouse();
    }


    #set(){
        // set canvas width, height according to the clientWidth, clientHeight;
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        // width and height
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // rows and columns
        this.rows = Math.floor(this.height / this.#cellsize);
        this.cols = Math.floor(this.width / this.#cellsize);

        // fill the grid
        this.#fillGrid();
    }


    #reset(){

        // reset all when window is resize( reset canvas width, height, rows, cols, grid)
        window.addEventListener("resize", () => {
            this.#set();
        })

        // change the cellsize according to the select tag value
        // then reset all ( reset canvas width, height, rows, cols, grid)
        document.getElementById("cellsize").addEventListener("change", e => {
            this.#cellsize = e.target.value;
            this.#set();
        })
    }


    #fillGrid(){
        this.#generation = 0; // reset the generation
        this.grid = []; // delete all the cells from the grid

        for (let j = 0; j < this.rows; j++)
        {
            let row = [];
            for (let i = 0; i < this.cols; i++)
            {
                row.push(Math.floor(Math.random() * 2)); // 0 means die | 1 means live
            }

            this.grid.push(row);
        }
    }


    #randomGrid(){
        document.getElementById("random").addEventListener("click", () => {
            this.#fillGrid();
        })
    }


    #showGeneration(){
        document.getElementById("generation").value = this.#generation;
    }


    #drawMesh(){
        // horizental lines

        this.ctx.strokeStyle = this.#mesh_color;
        for (let j = 0; j < this.rows + 1; j++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(0, j * this.#cellsize);
            this.ctx.lineTo(this.width, j * this.#cellsize);
            this.ctx.stroke();
            this.ctx.closePath()
        }

        // vertical lines
        for(let i = 0; i < this.cols + 1; i++)
        {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.#cellsize, 0);
            this.ctx.lineTo(i * this.#cellsize, this.height);
            this.ctx.stroke();
            this.ctx.closePath()
        }
    }


    #drawCells(){
        this.ctx.fillStyle = this.#cell_color; // cet the ctx fillColor to cell color

        // draw live cells
        for (let j = 0; j < this.rows; j++)
        {
            for (let i = 0; i < this.cols; i++)
            {
                if (this.grid[j][i] == 1) this.ctx.fillRect(i * this.#cellsize, j * this.#cellsize, this.#cellsize, this.#cellsize);
            }
        }
    }


    #update(){
        let copy_of_grid = structuredClone(this.grid); // this time we get a deepcopy of the grid, not a reference to the grid( means not a shallow copy )

        // loop though the every cell in the grid
        for (let j = 0; j < this.rows; j++)
        {
            for (let i = 0; i < this.cols; i++)
            {
                let currentCell = copy_of_grid[j][i];

                // get the neighbour count
                let neighbourCount = 0
                for (let a = -1; a < 2; a++)
                {
                    for (let b = -1; b < 2; b++)
                    {
                        let x = (this.cols + i + a) % this.cols;
                        let y = (this.rows + j + b) % this.rows;

                        neighbourCount += copy_of_grid[y][x];
                    }
                }

                neighbourCount -= currentCell; // remove the currentCell value from the neighbourCount

                // rules
                if (currentCell == 1 && (neighbourCount < 2 || neighbourCount > 3)) 
                {
                    this.grid[j][i] = 0;
                }
                else if (currentCell == 0 && neighbourCount == 3)
                {
                    this.grid[j][i] = 1;
                }
            }
        }

        this.#generation++; // increase generation by one
    }


    #editCellsWithMouse(){
        this.canvas.addEventListener("click", e => {
            let i = Math.floor(e.offsetX / this.#cellsize);
            let j = Math.floor(e.offsetY / this.#cellsize);

            this.grid[j][i] = (this.grid[j][i] == 1) ? 0 : 1; // change the cell state
        })
    }


    #stepUp(){
        let buttons = document.querySelectorAll(".bottom > button:not(#random, #play)");
        buttons.forEach(btn => {
            btn.addEventListener("click", e => {
                switch(e.target.innerText){
                    case "1X":
                        this.#update();
                        break;

                    case "10X":
                        for (let i = 0; i < 10; i++)
                        {
                            this.#update();
                        }
                        break;

                    case "100X":
                        for (let i = 0; i < 100; i++)
                        {
                            this.#update();
                        }
                        break;

                    case "1000X":
                        for (let i = 0; i < 1000; i++)
                        {
                            this.#update();
                        }
                        break;
                }
            })
        })
    }


    #playPause(){
        let playBtn = document.getElementById("play");
        playBtn.addEventListener("click", () => {
            this.#play = !this.#play;

            // change the innerText and the bgcolor of the play button according to the state
            if (this.#play) 
            {
                playBtn.innerText = "Paused";
                playBtn.style.backgroundColor = "yellow";
            }
            else 
            {
                playBtn.innerText = "Play";
                playBtn.style.backgroundColor = "#04ff04";
            }
        })
    }


    #animate(timestamp){
        this.timer += timestamp - this.lasttime;
        this.lasttime = timestamp;

        if (this.#interval < this.timer)
        {
            this.ctx.clearRect(0, 0, this.width, this.height); // clear the screen
            this.#drawCells();
            if (this.#cellsize > 2) this.#drawMesh();
            if (this.#play) this.#update(); // only update the play attribute is true
            this.#showGeneration();

            this.timer = 0; // reset the timer
        }

        requestAnimationFrame(this.#animate.bind(this));
    }


    run(){
        this.#animate(0);
    }
}


let main = new Main();
main.run();